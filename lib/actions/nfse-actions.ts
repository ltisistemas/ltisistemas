"use server";

import { prisma } from "../db/prisma";
import { requireSession } from "../auth/session";
import { ActionResult } from "./auth-actions";
import {
  NfseConfig,
  NfseInvoice,
  NfseEnvironment,
  NfseStatus,
  NfseEventType,
} from "@prisma/client";
import {
  NfseSummaryDTO,
  NfseCancelInput,
  NfseReplaceInput,
  NfsePrestador,
} from "../services/nfse/types";
import { buildDpsData, sanitizeDocument } from "../services/nfse/dps-builder";
import { NfseApiClient } from "../services/nfse/nfse-client";
import { DanfseRenderData } from "../services/nfse/danfse-generator";

/**
 * Validação de sessão do operador de suporte
 */
async function ensureSupportSession() {
  const session = await requireSession();
  if (session.role !== "SUPORTE") {
    throw new Error("Acesso negado. Recurso exclusivo para a equipe de suporte e faturamento.");
  }
  return session;
}

/**
 * Obtém ou inicializa a configuração fiscal da empresa
 */
export async function getNfseConfigAction(): Promise<ActionResult<NfseConfig>> {
  try {
    await ensureSupportSession();

    let config = await prisma.nfseConfig.findFirst();
    if (!config) {
      config = await prisma.nfseConfig.create({
        data: {
          environment: "SIMULADOR",
          prestadorCnpj: "06990590000123",
          prestadorRazaoSocial: "LTI SISTEMAS TECNOLOGIA LTDA",
          prestadorNomeFantasia: "LTI Sistemas",
          prestadorInscricaoMunicipal: "1234567",
          prestadorCodigoMunicipio: "2611606", // Recife
          prestadorOptanteSimples: true,
          prestadorAliquotaIss: 0.0,
          codigoServicoLc116: "01.07",
          cnae: "6202000",
          isConfigured: true,
        },
      });
    }

    return { success: true, data: config };
  } catch (error: any) {
    return { success: false, error: error.message || "Falha ao carregar configurações fiscais." };
  }
}

/**
 * Salva ou atualiza a configuração fiscal
 */
export async function saveNfseConfigAction(
  data: Partial<NfseConfig>
): Promise<ActionResult<NfseConfig>> {
  try {
    await ensureSupportSession();

    let config = await prisma.nfseConfig.findFirst();

    const dataToSave: any = {
      environment: data.environment || "SIMULADOR",
      prestadorCnpj: sanitizeDocument(data.prestadorCnpj || "06990590000123"),
      prestadorRazaoSocial: data.prestadorRazaoSocial?.trim() || "LTI SISTEMAS TECNOLOGIA LTDA",
      prestadorNomeFantasia: data.prestadorNomeFantasia?.trim() || null,
      prestadorInscricaoMunicipal: data.prestadorInscricaoMunicipal?.trim() || "1234567",
      prestadorCodigoMunicipio: sanitizeDocument(data.prestadorCodigoMunicipio || "2611606"),
      prestadorOptanteSimples: data.prestadorOptanteSimples ?? true,
      prestadorAliquotaIss: data.prestadorAliquotaIss !== undefined && data.prestadorAliquotaIss !== null ? Number(data.prestadorAliquotaIss) : 0.0,
      codigoServicoLc116: data.codigoServicoLc116?.trim() || "01.07",
      codigoTributacaoMunicipal: data.codigoTributacaoMunicipal?.trim() || null,
      cnae: data.cnae?.trim() || "6202000",
      certificateBase64: data.certificateBase64 || null,
      certificatePassword: data.certificatePassword || null,
      apiRestUrl: data.apiRestUrl?.trim() || null,
      isConfigured: true,
    };

    if (config) {
      config = await prisma.nfseConfig.update({
        where: { id: config.id },
        data: dataToSave,
      });
    } else {
      config = await prisma.nfseConfig.create({
        data: dataToSave,
      });
    }

    return { success: true, data: config };
  } catch (error: any) {
    return { success: false, error: error.message || "Falha ao salvar configurações da NFS-e." };
  }
}

export interface EmitNfseInput {
  receivableId: string;
  customDiscriminacao?: string;
  customAliquota?: number;
  issRetido?: boolean;
  customLc116?: string;
  tomadorCpfCnpj?: string;
  tomadorRazaoSocial?: string;
  tomadorEmail?: string;
  tomadorInscricaoMunicipal?: string;
}

/**
 * Emite uma NFS-e vinculada a uma fatura / recebível
 */
export async function emitNfseAction(
  input: EmitNfseInput
): Promise<ActionResult<NfseSummaryDTO>> {
  try {
    await ensureSupportSession();

    if (!input.receivableId) {
      return { success: false, error: "ID da fatura é obrigatório." };
    }

    // 1. Buscar recebível e cliente
    const receivable = await prisma.clientReceivable.findUnique({
      where: { id: input.receivableId },
      include: {
        user: true,
        contract: true,
        nfseInvoices: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!receivable) {
      return { success: false, error: "Fatura não encontrada." };
    }

    // Prevenir duplicidade se já houver nota autorizada ou em processamento
    const activeInvoice = receivable.nfseInvoices.find(
      (inv) => inv.status === "AUTORIZADA" || inv.status === "PROCESSANDO"
    );
    if (activeInvoice) {
      return {
        success: false,
        error: `Já existe uma NFS-e ${activeInvoice.status} (Nº ${activeInvoice.numeroNfse || "DPS"}) vinculada a esta fatura.`,
      };
    }

    // 2. Carregar configuração fiscal
    const configRes = await getNfseConfigAction();
    if (!configRes.success || !configRes.data) {
      return { success: false, error: "Configuração fiscal não encontrada." };
    }
    const config = configRes.data;

    // 3. Montar dados do prestador e tomador
    const prestador: NfsePrestador = {
      cnpj: config.prestadorCnpj,
      razaoSocial: config.prestadorRazaoSocial,
      nomeFantasia: config.prestadorNomeFantasia,
      inscricaoMunicipal: config.prestadorInscricaoMunicipal,
      codigoMunicipio: config.prestadorCodigoMunicipio,
      optanteSimplesNacional: config.prestadorOptanteSimples,
      aliquotaIss: input.customAliquota ?? config.prestadorAliquotaIss,
      codigoServicoLc116: input.customLc116 ?? config.codigoServicoLc116,
      cnae: config.cnae,
    };

    // Tomador: utiliza dados informados ou do cadastro do cliente
    const rawTomadorDoc = sanitizeDocument(input.tomadorCpfCnpj || receivable.user.contractNumber || "06990590000123");
    const tomadorCpfCnpj = rawTomadorDoc.length === 11 || rawTomadorDoc.length === 14 ? rawTomadorDoc : "06990590000123";
    const tomadorRazaoSocial = input.tomadorRazaoSocial?.trim() || receivable.user.company || receivable.user.name;
    const tomadorEmail = input.tomadorEmail?.trim() || receivable.user.email;
    const tomadorInscricaoMunicipal = input.tomadorInscricaoMunicipal?.trim() || null;

    // Se informou CPF/CNPJ novo, atualiza no cadastro do cliente para memorização
    if (input.tomadorCpfCnpj && input.tomadorCpfCnpj !== receivable.user.contractNumber) {
      await prisma.user.update({
        where: { id: receivable.userId },
        data: { contractNumber: input.tomadorCpfCnpj.trim() },
      });
    }

    const discriminacao =
      input.customDiscriminacao?.trim() ||
      `${receivable.description} - Competência ${receivable.competence} | Contrato: ${receivable.contract?.title || "Avulso"}`;

    const dpsNumero = String(Date.now()).slice(-6);

    const dpsData = buildDpsData({
      dpsNumero,
      environment: config.environment,
      prestador,
      tomador: {
        cpfCnpj: tomadorCpfCnpj,
        razaoSocial: tomadorRazaoSocial,
        email: tomadorEmail,
        inscricaoMunicipal: tomadorInscricaoMunicipal,
      },
      servico: {
        codigoLc116: prestador.codigoServicoLc116 || "01.07",
        discriminacao,
        codigoCnae: config.cnae,
      },
      valores: {
        valorServicos: receivable.amount,
        aliquotaIss: prestador.aliquotaIss,
        issRetido: Boolean(input.issRetido),
      },
    });

    // 4. Executar chamada do Cliente da API
    const client = new NfseApiClient({
      environment: config.environment,
      apiUrl: config.apiRestUrl,
      certificateBase64: config.certificateBase64,
      certificatePassword: config.certificatePassword,
    });

    const emissionRes = await client.emitirNfse(dpsData);

    // 5. Salvar registro da NFS-e no banco
    const invoice = await prisma.nfseInvoice.create({
      data: {
        userId: receivable.userId,
        receivableId: receivable.id,
        environment: config.environment,
        status: emissionRes.status,
        dpsNumero: dpsData.numeroDps,
        dpsSerie: dpsData.serieDps,
        numeroNfse: emissionRes.numeroNfse || null,
        chaveAcesso: emissionRes.chaveAcesso || null,
        codigoVerificacao: emissionRes.codigoVerificacao || null,
        dataEmissao: emissionRes.dataEmissao || new Date(),
        dataCompetencia: dpsData.dataCompetencia,
        valorServicos: dpsData.valores.valorServicos,
        valorDeducoes: dpsData.valores.valorDeducoes || 0,
        issRetido: dpsData.valores.issRetido,
        valorIss: dpsData.valores.valorIss || 0,
        valorIssRetido: dpsData.valores.valorIssRetido || 0,
        aliquotaIss: dpsData.valores.aliquotaIss,
        valorLiquido: dpsData.valores.valorLiquido,
        discriminacaoServico: dpsData.servico.discriminacao,
        codigoServicoLc116: dpsData.servico.codigoLc116,
        codigoCnae: dpsData.servico.codigoCnae,
        tomadorCpfCnpj: dpsData.tomador.cpfCnpj,
        tomadorRazaoSocial: dpsData.tomador.razaoSocial,
        tomadorEmail: dpsData.tomador.email,
        xmlEnviado: emissionRes.xmlEnviado,
        xmlRetorno: emissionRes.xmlRetorno,
        danfseUrl: emissionRes.danfseUrl,
        motivoRejeicao: emissionRes.error || null,
        events: {
          create: [
            {
              type: "EMISSAO_SOLICITADA",
              description: `Emissão de NFS-e solicitada para a fatura ${receivable.id}`,
            },
            {
              type: emissionRes.success ? "TRANSMISSAO_SUCESSO" : "TRANSMISSAO_ERRO",
              description: emissionRes.success
                ? `NFS-e autorizada com sucesso. Chave: ${emissionRes.chaveAcesso}`
                : `Falha na autorização: ${emissionRes.error}`,
              payload: emissionRes.protocolo,
            },
          ],
        },
      },
    });

    const summary: NfseSummaryDTO = {
      id: invoice.id,
      receivableId: receivable.id,
      userId: receivable.userId,
      clientName: receivable.user.name,
      companyName: receivable.user.company,
      status: invoice.status,
      environment: invoice.environment,
      numeroNfse: invoice.numeroNfse,
      chaveAcesso: invoice.chaveAcesso,
      codigoVerificacao: invoice.codigoVerificacao,
      dataEmissao: invoice.dataEmissao,
      dataCompetencia: invoice.dataCompetencia,
      valorServicos: invoice.valorServicos,
      valorIss: invoice.valorIss,
      aliquotaIss: invoice.aliquotaIss,
      valorLiquido: invoice.valorLiquido,
      discriminacaoServico: invoice.discriminacaoServico,
      codigoServicoLc116: invoice.codigoServicoLc116,
      tomadorCpfCnpj: invoice.tomadorCpfCnpj,
      tomadorRazaoSocial: invoice.tomadorRazaoSocial,
      motivoRejeicao: invoice.motivoRejeicao,
      motivoCancelamento: invoice.motivoCancelamento,
      createdAt: invoice.createdAt,
    };

    return { success: true, data: summary };
  } catch (error: any) {
    return { success: false, error: error.message || "Falha no processo de emissão da NFS-e." };
  }
}

/**
 * Consulta a lista de NFS-e vinculadas a uma fatura
 */
export async function getNfseByReceivableAction(
  receivableId: string
): Promise<ActionResult<NfseSummaryDTO[]>> {
  try {
    await ensureSupportSession();

    const invoices = await prisma.nfseInvoice.findMany({
      where: { receivableId },
      include: {
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const data: NfseSummaryDTO[] = invoices.map((inv) => ({
      id: inv.id,
      receivableId: inv.receivableId,
      userId: inv.userId,
      clientName: inv.user.name,
      companyName: inv.user.company,
      status: inv.status,
      environment: inv.environment,
      numeroNfse: inv.numeroNfse,
      chaveAcesso: inv.chaveAcesso,
      codigoVerificacao: inv.codigoVerificacao,
      dataEmissao: inv.dataEmissao,
      dataCompetencia: inv.dataCompetencia,
      valorServicos: inv.valorServicos,
      valorIss: inv.valorIss,
      aliquotaIss: inv.aliquotaIss,
      valorLiquido: inv.valorLiquido,
      discriminacaoServico: inv.discriminacaoServico,
      codigoServicoLc116: inv.codigoServicoLc116,
      tomadorCpfCnpj: inv.tomadorCpfCnpj,
      tomadorRazaoSocial: inv.tomadorRazaoSocial,
      motivoRejeicao: inv.motivoRejeicao,
      motivoCancelamento: inv.motivoCancelamento,
      createdAt: inv.createdAt,
    }));

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao consultar NFS-e da fatura." };
  }
}

/**
 * Consulta o status atual de uma NFS-e
 */
export async function consultNfseStatusAction(
  invoiceId: string
): Promise<ActionResult<{ status: NfseStatus; chaveAcesso?: string }>> {
  try {
    await ensureSupportSession();

    const invoice = await prisma.nfseInvoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      return { success: false, error: "NFS-e não encontrada." };
    }

    if (invoice.chaveAcesso) {
      const configRes = await getNfseConfigAction();
      const client = new NfseApiClient({
        environment: invoice.environment,
        apiUrl: configRes.data?.apiRestUrl,
      });

      const consult = await client.consultarNfse(invoice.chaveAcesso);
      if (consult.success && consult.status !== invoice.status) {
        await prisma.nfseInvoice.update({
          where: { id: invoice.id },
          data: { status: consult.status },
        });
      }
    }

    return {
      success: true,
      data: {
        status: invoice.status,
        chaveAcesso: invoice.chaveAcesso || undefined,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao sincronizar status da NFS-e." };
  }
}

/**
 * Cancela uma NFS-e autorizada
 */
export async function cancelNfseAction(
  input: NfseCancelInput
): Promise<ActionResult<{ success: boolean }>> {
  try {
    await ensureSupportSession();

    const invoice = await prisma.nfseInvoice.findUnique({
      where: { id: input.invoiceId },
    });

    if (!invoice) {
      return { success: false, error: "NFS-e não encontrada." };
    }

    if (invoice.status !== "AUTORIZADA") {
      return { success: false, error: `Não é possível cancelar uma nota com status ${invoice.status}.` };
    }

    if (!input.motivo?.trim()) {
      return { success: false, error: "Motivo do cancelamento é obrigatório." };
    }

    const configRes = await getNfseConfigAction();
    const client = new NfseApiClient({
      environment: invoice.environment,
      apiUrl: configRes.data?.apiRestUrl,
      certificateBase64: configRes.data?.certificateBase64,
      certificatePassword: configRes.data?.certificatePassword,
    });

    if (invoice.chaveAcesso) {
      const cancelRes = await client.cancelarNfse({
        invoiceId: invoice.id,
        chaveAcesso: invoice.chaveAcesso,
        motivo: input.motivo.trim(),
        codigoCancelamento: input.codigoCancelamento,
      });

      if (!cancelRes.success) {
        return { success: false, error: cancelRes.error || "Falha ao processar cancelamento junto ao Fisco." };
      }
    }

    await prisma.nfseInvoice.update({
      where: { id: invoice.id },
      data: {
        status: "CANCELADA",
        motivoCancelamento: input.motivo.trim(),
        events: {
          create: {
            type: "CANCELADA",
            description: `NFS-e cancelada. Motivo: ${input.motivo.trim()}`,
          },
        },
      },
    });

    return { success: true, data: { success: true } };
  } catch (error: any) {
    return { success: false, error: error.message || "Falha ao cancelar NFS-e." };
  }
}

/**
 * Substitui uma NFS-e cancelando a original e emitindo a substituta
 */
export async function replaceNfseAction(
  input: NfseReplaceInput
): Promise<ActionResult<NfseSummaryDTO>> {
  try {
    await ensureSupportSession();

    const originalInvoice = await prisma.nfseInvoice.findUnique({
      where: { id: input.invoiceId },
      include: { receivable: true },
    });

    if (!originalInvoice) {
      return { success: false, error: "NFS-e original não encontrada." };
    }

    // 1. Cancelar nota original
    const cancelRes = await cancelNfseAction({
      invoiceId: originalInvoice.id,
      motivo: `Substituída: ${input.motivo}`,
    });

    if (!cancelRes.success) {
      return { success: false, error: `Falha ao cancelar nota original: ${cancelRes.error}` };
    }

    // 2. Emitir nova nota
    const emitRes = await emitNfseAction({
      receivableId: originalInvoice.receivableId,
      customDiscriminacao: input.discriminacaoAtualizada || `${originalInvoice.discriminacaoServico} [Substituta da NFS-e ${originalInvoice.numeroNfse}]`,
      customAliquota: input.novaAliquota || originalInvoice.aliquotaIss,
    });

    if (!emitRes.success || !emitRes.data) {
      return { success: false, error: `Falha ao emitir nota substituta: ${emitRes.error}` };
    }

    // 3. Vincular notas
    await prisma.nfseInvoice.update({
      where: { id: originalInvoice.id },
      data: {
        status: "SUBSTITUIDA",
        substituidaPorId: emitRes.data.id,
      },
    });

    await prisma.nfseInvoice.update({
      where: { id: emitRes.data.id },
      data: {
        substituiId: originalInvoice.id,
      },
    });

    return { success: true, data: emitRes.data };
  } catch (error: any) {
    return { success: false, error: error.message || "Falha ao substituir NFS-e." };
  }
}

/**
 * Monta os dados necessários para renderização visual do DANFSE
 */
export async function getDanfseDataAction(
  invoiceId: string
): Promise<ActionResult<DanfseRenderData>> {
  try {
    const session = await requireSession();

    const invoice = await prisma.nfseInvoice.findUnique({
      where: { id: invoiceId },
      include: {
        user: true,
        receivable: true,
      },
    });

    if (!invoice) {
      return { success: false, error: "NFS-e não encontrada." };
    }

    // Validação de acesso: o cliente só pode ver suas próprias notas; suporte pode ver todas
    if (session.role === "CLIENTE" && invoice.userId !== session.userId) {
      return { success: false, error: "Acesso negado à visualização desta NFS-e." };
    }

    const config = await prisma.nfseConfig.findFirst();

    const renderData: DanfseRenderData = {
      numeroNfse: invoice.numeroNfse || "EM_PROCESSAMENTO",
      chaveAcesso: invoice.chaveAcesso || "CHAVE_PENDENTE",
      codigoVerificacao: invoice.codigoVerificacao || "----",
      dataEmissao: invoice.dataEmissao,
      dataCompetencia: invoice.dataCompetencia,
      status: invoice.status,
      prestador: {
        razaoSocial: config?.prestadorRazaoSocial || "LTI SISTEMAS TECNOLOGIA LTDA",
        nomeFantasia: config?.prestadorNomeFantasia,
        cnpj: config?.prestadorCnpj || "06990590000123",
        inscricaoMunicipal: config?.prestadorInscricaoMunicipal || "1234567",
        codigoMunicipio: config?.prestadorCodigoMunicipio || "2611606",
        municipioNome: "Recife",
        uf: "PE",
        optanteSimples: config?.prestadorOptanteSimples ?? true,
      },
      tomador: {
        razaoSocial: invoice.tomadorRazaoSocial,
        cpfCnpj: invoice.tomadorCpfCnpj,
        email: invoice.tomadorEmail,
        inscricaoMunicipal: invoice.tomadorInscricaoMunicipal,
        endereco: invoice.tomadorEndereco,
      },
      servico: {
        codigoLc116: invoice.codigoServicoLc116,
        codigoCnae: invoice.codigoCnae,
        discriminacao: invoice.discriminacaoServico,
      },
      valores: {
        valorServicos: invoice.valorServicos,
        valorDeducoes: invoice.valorDeducoes,
        baseCalculo: invoice.valorServicos - invoice.valorDeducoes,
        aliquotaIss: invoice.aliquotaIss,
        valorIss: invoice.valorIss,
        issRetido: invoice.issRetido,
        valorIssRetido: invoice.valorIssRetido,
        valorPis: invoice.valorPis,
        valorCofins: invoice.valorCofins,
        valorInss: invoice.valorInss,
        valorIr: invoice.valorIr,
        valorCsll: invoice.valorCsll,
        valorLiquido: invoice.valorLiquido,
      },
    };

    return { success: true, data: renderData };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao carregar dados do DANFSE." };
  }
}
