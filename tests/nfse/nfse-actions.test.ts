import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getNfseConfigAction,
  saveNfseConfigAction,
  emitNfseAction,
  getNfseByReceivableAction,
  consultNfseStatusAction,
  cancelNfseAction,
  replaceNfseAction,
  getDanfseDataAction,
} from "@/lib/actions/nfse-actions";
import { prisma } from "@/lib/db/prisma";
import * as sessionModule from "@/lib/auth/session";
import { Role } from "@prisma/client";

describe("nfse-actions", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const supportSession = {
    userId: "sup_1",
    name: "Suporte Admin",
    email: "suporte@ltisistemas.com",
    company: "LTI Sistemas",
    role: Role.SUPORTE,
  };

  const clientSession = {
    userId: "cli_1",
    name: "Cliente Usuário",
    email: "cliente@empresa.com",
    company: "Empresa Cliente",
    role: Role.CLIENTE,
  };

  const mockConfig = {
    id: "cfg_1",
    environment: "SIMULADOR" as const,
    prestadorCnpj: "06990590000123",
    prestadorRazaoSocial: "LTI SISTEMAS TECNOLOGIA LTDA",
    prestadorNomeFantasia: "LTI Sistemas",
    prestadorInscricaoMunicipal: "1234567",
    prestadorCodigoMunicipio: "2611606",
    prestadorOptanteSimples: true,
    prestadorRegimeEspecial: "0",
    prestadorAliquotaIss: 2.0,
    codigoServicoLc116: "01.07",
    codigoTributacaoMunicipal: null,
    cnae: "6202000",
    certificateBase64: null,
    certificatePassword: null,
    certificateExpiresAt: null,
    apiRestUrl: null,
    isConfigured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockReceivable = {
    id: "rec_101",
    userId: "cli_1",
    contractId: "ctr_1",
    description: "Mensalidade do Software",
    competence: "2026-09",
    amount: 2500.0,
    dueDate: new Date(),
    paidDate: null,
    paymentMethod: "PIX" as const,
    status: "PENDENTE" as const,
    notes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {
      id: "cli_1",
      name: "João Silva",
      company: "Empresa Cliente S.A.",
      email: "financeiro@cliente.com",
      contractNumber: "52998224725", // CPF válido
    },
    contract: {
      title: "Contrato Anual de Suporte",
    },
    nfseInvoices: [],
  };

  it("should get and save fiscal config for support users", async () => {
    vi.spyOn(sessionModule, "requireSession").mockResolvedValue(supportSession);
    vi.spyOn(prisma.nfseConfig, "findFirst").mockResolvedValue(mockConfig as any);

    const getRes = await getNfseConfigAction();
    expect(getRes.success).toBe(true);
    expect(getRes.data?.prestadorCnpj).toBe("06990590000123");

    vi.spyOn(prisma.nfseConfig, "update").mockResolvedValue({
      ...mockConfig,
      prestadorAliquotaIss: 3.0,
    } as any);

    const saveRes = await saveNfseConfigAction({ prestadorAliquotaIss: 3.0 });
    expect(saveRes.success).toBe(true);
    expect(saveRes.data?.prestadorAliquotaIss).toBe(3.0);
  });

  it("should block non-support users from configuring or emitting NFS-e", async () => {
    vi.spyOn(sessionModule, "requireSession").mockResolvedValue(clientSession);

    const res = await emitNfseAction({ receivableId: "rec_101" });
    expect(res.success).toBe(false);
    expect(res.error).toContain("Acesso negado");
  });

  it("should emit NFS-e successfully linked to receivable", async () => {
    vi.spyOn(sessionModule, "requireSession").mockResolvedValue(supportSession);
    vi.spyOn(prisma.nfseConfig, "findFirst").mockResolvedValue(mockConfig as any);
    vi.spyOn(prisma.clientReceivable, "findUnique").mockResolvedValue(mockReceivable as any);

    const mockInvoiceCreated = {
      id: "inv_001",
      userId: "cli_1",
      receivableId: "rec_101",
      environment: "SIMULADOR" as const,
      status: "AUTORIZADA" as const,
      dpsNumero: "105",
      dpsSerie: "1",
      numeroNfse: "9001",
      chaveAcesso: "26116062560010000010052609069905900001231234567891",
      codigoVerificacao: "A1B2-C3D4",
      dataEmissao: new Date(),
      dataCompetencia: new Date(),
      valorServicos: 2500.0,
      valorDeducoes: 0,
      valorPis: 0,
      valorCofins: 0,
      valorInss: 0,
      valorIr: 0,
      valorCsll: 0,
      issRetido: false,
      valorIss: 50.0,
      valorIssRetido: 0,
      aliquotaIss: 2.0,
      valorLiquido: 2500.0,
      discriminacaoServico: "Mensalidade do Software",
      codigoServicoLc116: "01.07",
      codigoCnae: "6202000",
      tomadorCpfCnpj: "52998224725",
      tomadorRazaoSocial: "Empresa Cliente S.A.",
      tomadorEmail: "financeiro@cliente.com",
      tomadorInscricaoMunicipal: null,
      tomadorEndereco: null,
      xmlEnviado: "<DPS></DPS>",
      xmlRetorno: "<NFSe></NFSe>",
      danfseUrl: "/api/nfse/danfse/inv_001",
      motivoRejeicao: null,
      motivoCancelamento: null,
      substituidaPorId: null,
      substituiId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.spyOn(prisma.nfseInvoice, "create").mockResolvedValue(mockInvoiceCreated as any);

    const emitRes = await emitNfseAction({
      receivableId: "rec_101",
    });

    expect(emitRes.success).toBe(true);
    expect(emitRes.data?.numeroNfse).toBeDefined();
    expect(emitRes.data?.status).toBe("AUTORIZADA");
    expect(emitRes.data?.valorLiquido).toBe(2500.0);
  });

  it("should prevent duplicate emission for already authorized receivable", async () => {
    vi.spyOn(sessionModule, "requireSession").mockResolvedValue(supportSession);
    vi.spyOn(prisma.clientReceivable, "findUnique").mockResolvedValue({
      ...mockReceivable,
      nfseInvoices: [{ id: "inv_existing", status: "AUTORIZADA", numeroNfse: "8001" }],
    } as any);

    const res = await emitNfseAction({ receivableId: "rec_101" });
    expect(res.success).toBe(false);
    expect(res.error).toContain("Já existe uma NFS-e AUTORIZADA");
  });

  it("should cancel an authorized NFS-e", async () => {
    vi.spyOn(sessionModule, "requireSession").mockResolvedValue(supportSession);
    vi.spyOn(prisma.nfseConfig, "findFirst").mockResolvedValue(mockConfig as any);
    vi.spyOn(prisma.nfseInvoice, "findUnique").mockResolvedValue({
      id: "inv_001",
      status: "AUTORIZADA",
      chaveAcesso: "26116062560010000010052609069905900001231234567891",
      environment: "SIMULADOR",
    } as any);

    vi.spyOn(prisma.nfseInvoice, "update").mockResolvedValue({
      id: "inv_001",
      status: "CANCELADA",
    } as any);

    const res = await cancelNfseAction({
      invoiceId: "inv_001",
      motivo: "Erro no valor do serviço contratado",
    });

    expect(res.success).toBe(true);
  });

  it("should get DANFSE render data for client or support", async () => {
    vi.spyOn(sessionModule, "requireSession").mockResolvedValue(clientSession);
    vi.spyOn(prisma.nfseConfig, "findFirst").mockResolvedValue(mockConfig as any);
    vi.spyOn(prisma.nfseInvoice, "findUnique").mockResolvedValue({
      id: "inv_001",
      userId: "cli_1", // mesmo user da sessão
      status: "AUTORIZADA",
      numeroNfse: "9001",
      chaveAcesso: "26116062560010000010052609069905900001231234567891",
      codigoVerificacao: "A1B2-C3D4",
      dataEmissao: new Date(),
      dataCompetencia: new Date(),
      valorServicos: 2500,
      valorDeducoes: 0,
      aliquotaIss: 2.0,
      valorIss: 50.0,
      issRetido: false,
      valorLiquido: 2500.0,
      discriminacaoServico: "Suporte mensal",
      codigoServicoLc116: "01.07",
      tomadorCpfCnpj: "52998224725",
      tomadorRazaoSocial: "Empresa Cliente S.A.",
    } as any);

    const res = await getDanfseDataAction("inv_001");
    expect(res.success).toBe(true);
    expect(res.data?.numeroNfse).toBe("9001");
    expect(res.data?.tomador.razaoSocial).toBe("Empresa Cliente S.A.");
  });
});
