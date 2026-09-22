"use server";

import { prisma } from "../db/prisma";
import { requireSession } from "../auth/session";
import {
  ContractStatus,
  ReceivableStatus,
  PaymentMethod,
  ProposalStatus,
  UserStatus,
  NfseStatus,
} from "@prisma/client";
import { ActionResult } from "./auth-actions";

export interface ClientFinancialSummary {
  activeMrr: number;
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  proposalsCount: number;
  activeProposalsCount: number;
}

export interface ClientCommercialOverviewData {
  client: {
    id: string;
    name: string;
    company: string;
    email: string;
    contractNumber: string | null;
    systemUrl?: string | null;
    status?: UserStatus;
    createdAt?: Date;
  };
  contracts: Array<{
    id: string;
    userId: string;
    contractNumber: string | null;
    title: string;
    monthlyValue: number;
    billingDay: number;
    startDate: Date;
    endDate: Date | null;
    status: ContractStatus;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
  }>;
  receivables: Array<{
    id: string;
    userId: string;
    contractId: string | null;
    contractTitle?: string | null;
    description: string;
    competence: string;
    amount: number;
    dueDate: Date;
    paidDate: Date | null;
    paymentMethod: PaymentMethod;
    status: ReceivableStatus;
    isOverdue: boolean;
    notes: string | null;
    createdAt: Date;
    nfseInvoices?: Array<{
      id: string;
      status: NfseStatus;
      numeroNfse: string | null;
      chaveAcesso: string | null;
      codigoVerificacao: string | null;
      valorLiquido: number;
      valorIss: number;
      aliquotaIss: number;
      discriminacaoServico: string;
      codigoServicoLc116: string;
      tomadorCpfCnpj: string;
      tomadorRazaoSocial: string;
      dataEmissao: Date;
      dataCompetencia: Date;
      motivoCancelamento: string | null;
      motivoRejeicao: string | null;
      createdAt: Date;
    }>;
  }>;
  proposals: Array<{
    id: string;
    userId: string;
    proposalNumber: string;
    title: string;
    scopeDescription: string;
    oneOffValue: number;
    monthlyValue: number;
    sentDate: Date;
    validUntil: Date | null;
    status: ProposalStatus;
    documentUrl: string | null;
    notes: string | null;
    createdAt: Date;
  }>;
  summary: ClientFinancialSummary;
}

export interface PortfolioSummaryData {
  totalMrr: number;
  totalClientsWithContracts: number;
  totalPendingReceivables: number;
  totalPaidReceivables: number;
  totalActiveProposals: number;
  clientMrrMap: Record<string, number>;
}

/**
 * Validação de permissão: exclusivo para equipe de SUPORTE.
 */
async function ensureSupportSession() {
  const session = await requireSession();
  if (session.role !== "SUPORTE") {
    throw new Error("Acesso negado. Recurso comercial exclusivo para a equipe de suporte.");
  }
  return session;
}

/**
 * Obtém a visão 360° comercial e financeira de um cliente específico.
 * Clientes podem visualizar seus próprios dados; SUPORTE pode visualizar qualquer cliente.
 */
export async function getClientCommercialOverviewAction(
  clientId: string
): Promise<ActionResult<ClientCommercialOverviewData>> {
  try {
    const session = await requireSession();
    if (session.role !== "SUPORTE" && session.userId !== clientId) {
      return { success: false, error: "Acesso negado. Você só pode visualizar dados da sua própria conta." };
    }

    const client = await prisma.user.findUnique({
      where: { id: clientId, deletedAt: null },
      select: {
        id: true,
        name: true,
        company: true,
        email: true,
        contractNumber: true,
        systemUrl: true,
        status: true,
        createdAt: true,
      },
    });

    if (!client) {
      return { success: false, error: "Cliente não encontrado." };
    }

    const [contracts, rawReceivables, proposals] = await Promise.all([
      prisma.clientContract.findMany({
        where: { userId: clientId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.clientReceivable.findMany({
        where: { userId: clientId },
        include: {
          contract: {
            select: { title: true },
          },
          nfseInvoices: {
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { dueDate: "desc" },
      }),
      prisma.clientProposal.findMany({
        where: { userId: clientId },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const now = new Date();

    // Processa recebíveis e verifica atrasos dinâmicos
    const receivables = rawReceivables.map((r) => {
      const isOverdue =
        r.status === "PENDENTE" && new Date(r.dueDate).getTime() < now.getTime();
      return {
        id: r.id,
        userId: r.userId,
        contractId: r.contractId,
        contractTitle: r.contract?.title || null,
        description: r.description,
        competence: r.competence,
        amount: r.amount,
        dueDate: r.dueDate,
        paidDate: r.paidDate,
        paymentMethod: r.paymentMethod,
        status: isOverdue ? ("ATRASADO" as ReceivableStatus) : r.status,
        isOverdue,
        notes: r.notes,
        createdAt: r.createdAt,
        nfseInvoices: r.nfseInvoices || [],
      };
    });

    // Cálculos de Resumo
    const activeMrr = contracts
      .filter((c) => c.status === "ATIVO")
      .reduce((sum, c) => sum + (c.monthlyValue || 0), 0);

    const totalPaid = receivables
      .filter((r) => r.status === "PAGO")
      .reduce((sum, r) => sum + r.amount, 0);

    const totalPending = receivables
      .filter((r) => r.status === "PENDENTE")
      .reduce((sum, r) => sum + r.amount, 0);

    const totalOverdue = receivables
      .filter((r) => r.isOverdue || r.status === "ATRASADO")
      .reduce((sum, r) => sum + r.amount, 0);

    const proposalsCount = proposals.length;
    const activeProposalsCount = proposals.filter((p) =>
      ["RASCUNHO", "ENVIADA", "EM_NEGOCIACAO"].includes(p.status)
    ).length;

    return {
      success: true,
      data: {
        client,
        contracts,
        receivables,
        proposals,
        summary: {
          activeMrr,
          totalPaid,
          totalPending,
          totalOverdue,
          proposalsCount,
          activeProposalsCount,
        },
      },
    };
  } catch (error: any) {
    console.error("getClientCommercialOverviewAction error:", error);
    return { success: false, error: error.message || "Falha ao carregar visão comercial." };
  }
}

/**
 * Obtém o resumo de MRR e KPIs de toda a carteira de clientes.
 */
export async function getPortfolioSummaryAction(): Promise<
  ActionResult<PortfolioSummaryData>
> {
  try {
    await ensureSupportSession();

    const [activeContracts, receivables, activeProposals] = await Promise.all([
      prisma.clientContract.findMany({
        where: { status: "ATIVO" },
        select: { userId: true, monthlyValue: true },
      }),
      prisma.clientReceivable.findMany({
        select: { amount: true, status: true },
      }),
      prisma.clientProposal.count({
        where: { status: { in: ["RASCUNHO", "ENVIADA", "EM_NEGOCIACAO"] } },
      }),
    ]);

    const clientMrrMap: Record<string, number> = {};
    let totalMrr = 0;

    activeContracts.forEach((c) => {
      totalMrr += c.monthlyValue;
      clientMrrMap[c.userId] = (clientMrrMap[c.userId] || 0) + c.monthlyValue;
    });

    const totalPaidReceivables = receivables
      .filter((r) => r.status === "PAGO")
      .reduce((sum, r) => sum + r.amount, 0);

    const totalPendingReceivables = receivables
      .filter((r) => r.status === "PENDENTE" || r.status === "ATRASADO")
      .reduce((sum, r) => sum + r.amount, 0);

    return {
      success: true,
      data: {
        totalMrr,
        totalClientsWithContracts: Object.keys(clientMrrMap).length,
        totalPaidReceivables,
        totalPendingReceivables,
        totalActiveProposals: activeProposals,
        clientMrrMap,
      },
    };
  } catch (error: any) {
    console.error("getPortfolioSummaryAction error:", error);
    return { success: false, error: error.message || "Falha ao carregar resumo da carteira." };
  }
}

// -------------------------------------------------------------
// CONTRATOS
// -------------------------------------------------------------

export interface CreateContractInput {
  userId: string;
  contractNumber?: string;
  title: string;
  monthlyValue: number;
  billingDay: number;
  startDate?: string;
  endDate?: string;
  status?: ContractStatus;
  notes?: string;
}

export async function createContractAction(
  input: CreateContractInput
): Promise<ActionResult<{ id: string }>> {
  try {
    await ensureSupportSession();

    if (!input.userId || !input.title.trim() || input.monthlyValue === undefined) {
      return { success: false, error: "Título e valor mensal são obrigatórios." };
    }

    const billingDay = Math.min(Math.max(Number(input.billingDay) || 10, 1), 31);
    const startDate = input.startDate ? new Date(input.startDate) : new Date();
    const endDate = input.endDate ? new Date(input.endDate) : null;

    const contract = await prisma.clientContract.create({
      data: {
        userId: input.userId,
        contractNumber: input.contractNumber?.trim() || null,
        title: input.title.trim(),
        monthlyValue: Number(input.monthlyValue) || 0,
        billingDay,
        startDate,
        endDate,
        status: input.status || "ATIVO",
        notes: input.notes?.trim() || null,
      },
      select: { id: true },
    });

    return { success: true, data: { id: contract.id } };
  } catch (error: any) {
    console.error("createContractAction error:", error);
    return { success: false, error: error.message || "Falha ao cadastrar contrato." };
  }
}

export interface UpdateContractInput {
  id: string;
  contractNumber?: string;
  title?: string;
  monthlyValue?: number;
  billingDay?: number;
  startDate?: string;
  endDate?: string;
  status?: ContractStatus;
  notes?: string;
}

export async function updateContractAction(
  input: UpdateContractInput
): Promise<ActionResult<{ id: string }>> {
  try {
    await ensureSupportSession();

    const dataToUpdate: any = {};
    if (input.contractNumber !== undefined) dataToUpdate.contractNumber = input.contractNumber.trim() || null;
    if (input.title !== undefined) dataToUpdate.title = input.title.trim();
    if (input.monthlyValue !== undefined) dataToUpdate.monthlyValue = Number(input.monthlyValue);
    if (input.billingDay !== undefined) dataToUpdate.billingDay = Math.min(Math.max(Number(input.billingDay), 1), 31);
    if (input.startDate !== undefined) dataToUpdate.startDate = new Date(input.startDate);
    if (input.endDate !== undefined) dataToUpdate.endDate = input.endDate ? new Date(input.endDate) : null;
    if (input.status !== undefined) dataToUpdate.status = input.status;
    if (input.notes !== undefined) dataToUpdate.notes = input.notes.trim() || null;

    const updated = await prisma.clientContract.update({
      where: { id: input.id },
      data: dataToUpdate,
      select: { id: true },
    });

    return { success: true, data: { id: updated.id } };
  } catch (error: any) {
    console.error("updateContractAction error:", error);
    return { success: false, error: error.message || "Falha ao atualizar contrato." };
  }
}

export async function deleteContractAction(
  id: string
): Promise<ActionResult<{ deleted: boolean }>> {
  try {
    await ensureSupportSession();

    await prisma.clientContract.delete({
      where: { id },
    });

    return { success: true, data: { deleted: true } };
  } catch (error: any) {
    console.error("deleteContractAction error:", error);
    return { success: false, error: error.message || "Falha ao remover contrato." };
  }
}

// -------------------------------------------------------------
// RECEBÍVEIS & MENSALIDADES
// -------------------------------------------------------------

export interface CreateReceivableInput {
  userId: string;
  contractId?: string;
  description: string;
  competence: string; // YYYY-MM
  amount: number;
  dueDate: string;
  paymentMethod?: PaymentMethod;
  status?: ReceivableStatus;
  notes?: string;
}

export async function createReceivableAction(
  input: CreateReceivableInput
): Promise<ActionResult<{ id: string }>> {
  try {
    await ensureSupportSession();

    if (!input.userId || !input.description.trim() || !input.amount || !input.dueDate) {
      return { success: false, error: "Descrição, valor e data de vencimento são obrigatórios." };
    }

    const dueDate = new Date(input.dueDate);
    if (isNaN(dueDate.getTime())) {
      return { success: false, error: "Data de vencimento inválida." };
    }

    const receivable = await prisma.clientReceivable.create({
      data: {
        userId: input.userId,
        contractId: input.contractId || null,
        description: input.description.trim(),
        competence: input.competence?.trim() || `${dueDate.getFullYear()}-${String(dueDate.getMonth() + 1).padStart(2, "0")}`,
        amount: Number(input.amount),
        dueDate,
        paymentMethod: input.paymentMethod || "PIX",
        status: input.status || "PENDENTE",
        notes: input.notes?.trim() || null,
      },
      select: { id: true },
    });

    return { success: true, data: { id: receivable.id } };
  } catch (error: any) {
    console.error("createReceivableAction error:", error);
    return { success: false, error: error.message || "Falha ao criar recebível." };
  }
}

export interface UpdateReceivableStatusInput {
  id: string;
  status: ReceivableStatus;
  paidDate?: string;
  paymentMethod?: PaymentMethod;
  notes?: string;
}

export async function updateReceivableStatusAction(
  input: UpdateReceivableStatusInput
): Promise<ActionResult<{ id: string }>> {
  try {
    await ensureSupportSession();

    const dataToUpdate: any = {
      status: input.status,
    };

    if (input.status === "PAGO") {
      dataToUpdate.paidDate = input.paidDate ? new Date(input.paidDate) : new Date();
    } else if (input.status === "PENDENTE") {
      dataToUpdate.paidDate = null;
    }

    if (input.paymentMethod) dataToUpdate.paymentMethod = input.paymentMethod;
    if (input.notes !== undefined) dataToUpdate.notes = input.notes.trim() || null;

    const updated = await prisma.clientReceivable.update({
      where: { id: input.id },
      data: dataToUpdate,
      select: { id: true },
    });

    return { success: true, data: { id: updated.id } };
  } catch (error: any) {
    console.error("updateReceivableStatusAction error:", error);
    return { success: false, error: error.message || "Falha ao alterar status do recebível." };
  }
}

export async function deleteReceivableAction(
  id: string
): Promise<ActionResult<{ deleted: boolean }>> {
  try {
    await ensureSupportSession();

    await prisma.clientReceivable.delete({
      where: { id },
    });

    return { success: true, data: { deleted: true } };
  } catch (error: any) {
    console.error("deleteReceivableAction error:", error);
    return { success: false, error: error.message || "Falha ao remover recebível." };
  }
}

/**
 * Utilitários para iteração e cálculo de competências
 */
function getCompetenceString(year: number, monthIndex: number): string {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
}

function parseCompetence(comp: string): { year: number; month: number } {
  const [y, m] = comp.split("-").map(Number);
  return { year: y, month: m };
}

function getYearMonth(date: Date | string): { year: number; month: number } {
  if (typeof date === "string") {
    const parts = date.split("T")[0].split("-");
    if (parts.length >= 2) {
      return { year: parseInt(parts[0], 10), month: parseInt(parts[1], 10) };
    }
  }
  const iso = (date instanceof Date ? date : new Date(date)).toISOString();
  const [y, m] = iso.split("T")[0].split("-").map(Number);
  return { year: y, month: m };
}

function getCompetencesBetween(startDate: Date | string, endDate: Date | string): string[] {
  const start = getYearMonth(startDate);
  const end = getYearMonth(endDate);

  const competences: string[] = [];
  let curYear = start.year;
  let curMonth = start.month;

  while (
    curYear < end.year ||
    (curYear === end.year && curMonth <= end.month)
  ) {
    competences.push(`${curYear}-${String(curMonth).padStart(2, "0")}`);
    curMonth++;
    if (curMonth > 12) {
      curMonth = 1;
      curYear++;
    }
  }

  return competences;
}

/**
 * Gera fatura/recebível mensal a partir de um contrato ativo.
 * Caso a competência não seja informada, calcula inteligentemente a próxima competência
 * pendente (se a do mês vigente já existir ou estiver paga, gera a do próximo mês).
 */
export async function generateMonthlyReceivableFromContractAction(params: {
  contractId: string;
  competence?: string; // Ex: "2026-10" ou omitido para próximo mês disponível
}): Promise<ActionResult<{ id: string; competence: string; amount: number }>> {
  try {
    await ensureSupportSession();

    const contract = await prisma.clientContract.findUnique({
      where: { id: params.contractId },
      include: {
        receivables: {
          select: { competence: true, status: true },
        },
      },
    });

    if (!contract) {
      return { success: false, error: "Contrato não encontrado." };
    }

    let targetCompetence = params.competence?.trim();

    if (!targetCompetence) {
      const now = new Date();
      const currentMonthComp = getCompetenceString(now.getFullYear(), now.getMonth());

      const existingMap = new Map<string, ReceivableStatus>();
      contract.receivables.forEach((r) => existingMap.set(r.competence, r.status));

      // Se o mês vigente ainda não foi gerado, gera para o mês vigente
      if (!existingMap.has(currentMonthComp)) {
        targetCompetence = currentMonthComp;
      } else {
        // Se o mês vigente já foi gerado (pago ou pendente), busca o próximo mês que ainda não tem fatura
        const iterDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        let found = false;

        // Procura nos próximos 24 meses
        for (let i = 0; i < 24; i++) {
          const checkComp = getCompetenceString(iterDate.getFullYear(), iterDate.getMonth());
          if (!existingMap.has(checkComp)) {
            targetCompetence = checkComp;
            found = true;
            break;
          }
          iterDate.setMonth(iterDate.getMonth() + 1);
        }

        if (!found) {
          return { success: false, error: "Todas as faturas futuras para este contrato já foram geradas." };
        }
      }
    }

    if (!targetCompetence) {
      return { success: false, error: "Não foi possível determinar a competência da fatura." };
    }

    const { year, month } = parseCompetence(targetCompetence);
    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      return { success: false, error: "Competência no formato inválido. Utilize AAAA-MM (ex: 2026-10)." };
    }

    // Verifica se já existe fatura para essa competência específica neste contrato
    const existing = await prisma.clientReceivable.findFirst({
      where: {
        contractId: contract.id,
        competence: targetCompetence,
      },
    });

    if (existing) {
      return {
        success: false,
        error: `A fatura para a competência ${targetCompetence} já existe neste contrato.`,
      };
    }

    const lastDayOfMonth = new Date(year, month, 0).getDate();
    const effectiveDay = Math.min(contract.billingDay, lastDayOfMonth);
    const dueDate = new Date(year, month - 1, effectiveDay, 12, 0, 0);
    const description = `Mensalidade de Sustentação — ${contract.title} (${targetCompetence})`;

    const receivable = await prisma.clientReceivable.create({
      data: {
        userId: contract.userId,
        contractId: contract.id,
        description,
        competence: targetCompetence,
        amount: contract.monthlyValue,
        dueDate,
        paymentMethod: "PIX",
        status: "PENDENTE",
      },
      select: { id: true, competence: true, amount: true },
    });

    return { success: true, data: receivable };
  } catch (error: any) {
    console.error("generateMonthlyReceivableFromContractAction error:", error);
    return { success: false, error: error.message || "Falha ao gerar mensalidade do contrato." };
  }
}

/**
 * Gera todas as faturas pendentes de um contrato (do início ao término do contrato).
 * Exemplo: contrato de set/2026 a set/2027 com 2 faturas já geradas -> gera as faturas restantes.
 */
export async function generateAllMissingReceivablesForContractAction(params: {
  contractId: string;
}): Promise<
  ActionResult<{
    count: number;
    generatedCompetences: string[];
    contractTitle: string;
  }>
> {
  try {
    await ensureSupportSession();

    const contract = await prisma.clientContract.findUnique({
      where: { id: params.contractId },
      include: {
        receivables: {
          select: { competence: true },
        },
      },
    });

    if (!contract) {
      return { success: false, error: "Contrato não encontrado." };
    }

    const startYM = getYearMonth(contract.startDate);
    let endYM: { year: number; month: number };

    if (contract.endDate) {
      endYM = getYearMonth(contract.endDate);
    } else {
      // Padrão de 12 meses (do mês de início até 11 meses adiante)
      let endMonth = startYM.month + 11;
      let endYear = startYM.year;
      if (endMonth > 12) {
        endYear += Math.floor((endMonth - 1) / 12);
        endMonth = ((endMonth - 1) % 12) + 1;
      }
      endYM = { year: endYear, month: endMonth };
    }

    const allCompetences = getCompetencesBetween(
      `${startYM.year}-${String(startYM.month).padStart(2, "0")}-01`,
      `${endYM.year}-${String(endYM.month).padStart(2, "0")}-01`
    );
    const existingCompetences = new Set(contract.receivables.map((r) => r.competence));

    const missingCompetences = allCompetences.filter((c) => !existingCompetences.has(c));

    if (missingCompetences.length === 0) {
      return {
        success: true,
        data: {
          count: 0,
          generatedCompetences: [],
          contractTitle: contract.title,
        },
      };
    }

    // Cria em lote todas as faturas faltantes
    const createdList: string[] = [];

    for (const comp of missingCompetences) {
      const { year, month } = parseCompetence(comp);
      const lastDayOfMonth = new Date(year, month, 0).getDate();
      const effectiveDay = Math.min(contract.billingDay, lastDayOfMonth);
      const dueDate = new Date(year, month - 1, effectiveDay, 12, 0, 0);
      const description = `Mensalidade de Sustentação — ${contract.title} (${comp})`;

      await prisma.clientReceivable.create({
        data: {
          userId: contract.userId,
          contractId: contract.id,
          description,
          competence: comp,
          amount: contract.monthlyValue,
          dueDate,
          paymentMethod: "PIX",
          status: "PENDENTE",
        },
      });

      createdList.push(comp);
    }

    return {
      success: true,
      data: {
        count: createdList.length,
        generatedCompetences: createdList,
        contractTitle: contract.title,
      },
    };
  } catch (error: any) {
    console.error("generateAllMissingReceivablesForContractAction error:", error);
    return {
      success: false,
      error: error.message || "Falha ao gerar faturas pendentes do contrato.",
    };
  }
}

// -------------------------------------------------------------
// PROPOSTAS COMERCIAIS
// -------------------------------------------------------------

export interface CreateProposalInput {
  userId: string;
  proposalNumber: string;
  title: string;
  scopeDescription: string;
  oneOffValue?: number;
  monthlyValue?: number;
  sentDate?: string;
  validUntil?: string;
  status?: ProposalStatus;
  documentUrl?: string;
  notes?: string;
}

export async function createProposalAction(
  input: CreateProposalInput
): Promise<ActionResult<{ id: string }>> {
  try {
    await ensureSupportSession();

    if (!input.userId || !input.proposalNumber?.trim() || !input.title?.trim() || !input.scopeDescription?.trim()) {
      return { success: false, error: "Número da proposta, título e descrição do escopo são obrigatórios." };
    }

    const sentDate = input.sentDate ? new Date(input.sentDate) : new Date();
    const validUntil = input.validUntil ? new Date(input.validUntil) : null;

    const proposal = await prisma.clientProposal.create({
      data: {
        userId: input.userId,
        proposalNumber: input.proposalNumber.trim(),
        title: input.title.trim(),
        scopeDescription: input.scopeDescription.trim(),
        oneOffValue: Number(input.oneOffValue) || 0,
        monthlyValue: Number(input.monthlyValue) || 0,
        sentDate,
        validUntil,
        status: input.status || "ENVIADA",
        documentUrl: input.documentUrl?.trim() || null,
        notes: input.notes?.trim() || null,
      },
      select: { id: true },
    });

    return { success: true, data: { id: proposal.id } };
  } catch (error: any) {
    console.error("createProposalAction error:", error);
    return { success: false, error: error.message || "Falha ao criar proposta comercial." };
  }
}

export interface UpdateProposalStatusInput {
  id: string;
  status: ProposalStatus;
  notes?: string;
}

export async function updateProposalStatusAction(
  input: UpdateProposalStatusInput
): Promise<ActionResult<{ id: string }>> {
  try {
    await ensureSupportSession();

    const dataToUpdate: any = { status: input.status };
    if (input.notes !== undefined) dataToUpdate.notes = input.notes.trim() || null;

    const updated = await prisma.clientProposal.update({
      where: { id: input.id },
      data: dataToUpdate,
      select: { id: true },
    });

    return { success: true, data: { id: updated.id } };
  } catch (error: any) {
    console.error("updateProposalStatusAction error:", error);
    return { success: false, error: error.message || "Falha ao atualizar status da proposta." };
  }
}

export async function deleteProposalAction(
  id: string
): Promise<ActionResult<{ deleted: boolean }>> {
  try {
    await ensureSupportSession();

    await prisma.clientProposal.delete({
      where: { id },
    });

    return { success: true, data: { deleted: true } };
  } catch (error: any) {
    console.error("deleteProposalAction error:", error);
    return { success: false, error: error.message || "Falha ao remover proposta comercial." };
  }
}
