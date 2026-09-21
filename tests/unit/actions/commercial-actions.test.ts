import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getClientCommercialOverviewAction,
  getPortfolioSummaryAction,
  createContractAction,
  updateContractAction,
  deleteContractAction,
  createReceivableAction,
  updateReceivableStatusAction,
  deleteReceivableAction,
  generateMonthlyReceivableFromContractAction,
  createProposalAction,
  updateProposalStatusAction,
  deleteProposalAction,
} from "@/lib/actions/commercial-actions";
import { prisma } from "@/lib/db/prisma";
import { Role, ContractStatus, ReceivableStatus, ProposalStatus } from "@prisma/client";
import * as sessionModule from "@/lib/auth/session";

describe("lib/actions/commercial-actions", () => {
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
    userId: "cli_aposchesf",
    name: "Gestor Aposchesf",
    email: "gestor@aposchesf.com.br",
    company: "Aposchesf",
    role: Role.CLIENTE,
  };

  describe("Security authorization barrier", () => {
    it("should reject commercial overview access if user role is CLIENTE", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue(clientSession);

      const res = await getClientCommercialOverviewAction("cli_aposchesf");
      expect(res.success).toBe(false);
      expect(res.error).toContain("Acesso negado");
    });

    it("should reject contract creation if user role is CLIENTE", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue(clientSession);

      const res = await createContractAction({
        userId: "cli_aposchesf",
        title: "Contrato Suporte",
        monthlyValue: 480,
        billingDay: 10,
      });

      expect(res.success).toBe(false);
      expect(res.error).toContain("Acesso negado");
    });
  });

  describe("getClientCommercialOverviewAction", () => {
    it("should calculate active MRR and receivables summary correctly", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue(supportSession);

      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
        id: "cli_aposchesf",
        name: "Gestor Aposchesf",
        company: "Aposchesf",
        email: "gestor@aposchesf.com.br",
        contractNumber: "CTR-APOSCHESF-01",
      } as any);

      // 1 active contract of R$ 480/month and 1 cancelled contract of R$ 200/month
      vi.spyOn(prisma.clientContract, "findMany").mockResolvedValue([
        {
          id: "cont_1",
          userId: "cli_aposchesf",
          contractNumber: "CTR-APOSCHESF-01",
          title: "Sustentação Mensal e Telemetria",
          monthlyValue: 480,
          billingDay: 10,
          startDate: new Date("2026-01-01"),
          endDate: null,
          status: ContractStatus.ATIVO,
          notes: "Contrato mensal padrão",
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any,
        {
          id: "cont_2",
          userId: "cli_aposchesf",
          contractNumber: "CTR-OLD",
          title: "Serviço Avulso Encerrado",
          monthlyValue: 200,
          billingDay: 5,
          startDate: new Date("2025-01-01"),
          endDate: new Date("2025-12-31"),
          status: ContractStatus.CANCELADO,
          notes: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any,
      ]);

      // Receivables: 1 paid (R$ 480), 1 future pending (R$ 480), 1 past overdue (R$ 200)
      vi.spyOn(prisma.clientReceivable, "findMany").mockResolvedValue([
        {
          id: "rec_1",
          userId: "cli_aposchesf",
          contractId: "cont_1",
          description: "Mensalidade 2026-08",
          competence: "2026-08",
          amount: 480,
          dueDate: new Date("2026-08-10"),
          paidDate: new Date("2026-08-09"),
          paymentMethod: "PIX",
          status: ReceivableStatus.PAGO,
          notes: null,
          createdAt: new Date(),
          contract: { title: "Sustentação Mensal e Telemetria" },
        } as any,
        {
          id: "rec_2",
          userId: "cli_aposchesf",
          contractId: "cont_1",
          description: "Mensalidade 2026-10",
          competence: "2026-10",
          amount: 480,
          dueDate: new Date(Date.now() + 86400000 * 10), // 10 days in future -> PENDENTE
          paidDate: null,
          paymentMethod: "PIX",
          status: ReceivableStatus.PENDENTE,
          notes: null,
          createdAt: new Date(),
          contract: { title: "Sustentação Mensal e Telemetria" },
        } as any,
        {
          id: "rec_3",
          userId: "cli_aposchesf",
          contractId: "cont_1",
          description: "Mensalidade 2026-07 Atrasada",
          competence: "2026-07",
          amount: 200,
          dueDate: new Date("2026-07-10"), // in past -> ATRASADO
          paidDate: null,
          paymentMethod: "BOLETO",
          status: ReceivableStatus.PENDENTE,
          notes: null,
          createdAt: new Date(),
          contract: { title: "Sustentação Mensal e Telemetria" },
        } as any,
      ]);

      vi.spyOn(prisma.clientProposal, "findMany").mockResolvedValue([
        {
          id: "prop_1",
          userId: "cli_aposchesf",
          proposalNumber: "PROP-2026-042",
          title: "Módulo de Relatórios Avançados",
          scopeDescription: "Desenvolvimento do módulo de telemetria customizado",
          oneOffValue: 2500,
          monthlyValue: 150,
          sentDate: new Date("2026-09-01"),
          validUntil: new Date("2026-10-01"),
          status: ProposalStatus.ENVIADA,
          documentUrl: "https://docs.lti.com/prop-042.pdf",
          notes: "Aguardando reunião de diretoria",
          createdAt: new Date(),
        } as any,
      ]);

      const res = await getClientCommercialOverviewAction("cli_aposchesf");

      expect(res.success).toBe(true);
      expect(res.data?.client.company).toBe("Aposchesf");
      expect(res.data?.summary.activeMrr).toBe(480); // Only the ATIVO contract counted
      expect(res.data?.summary.totalPaid).toBe(480);
      expect(res.data?.summary.totalPending).toBe(480);
      expect(res.data?.summary.totalOverdue).toBe(200);
      expect(res.data?.summary.proposalsCount).toBe(1);
      expect(res.data?.summary.activeProposalsCount).toBe(1);
    });
  });

  describe("Contracts CRUD & Receivables Generation", () => {
    it("should validate and create a new contract", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue(supportSession);

      const createSpy = vi.spyOn(prisma.clientContract, "create").mockResolvedValue({
        id: "cont_new_123",
      } as any);

      const res = await createContractAction({
        userId: "cli_aposchesf",
        contractNumber: "CTR-480-2026",
        title: "Sustentação Aposchesf",
        monthlyValue: 480,
        billingDay: 10,
      });

      expect(res.success).toBe(true);
      expect(res.data?.id).toBe("cont_new_123");
      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: "cli_aposchesf",
            monthlyValue: 480,
            billingDay: 10,
            status: "ATIVO",
          }),
        })
      );
    });

    it("should generate a monthly receivable from an active contract", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue(supportSession);

      vi.spyOn(prisma.clientContract, "findUnique").mockResolvedValue({
        id: "cont_1",
        userId: "cli_aposchesf",
        title: "Sustentação Aposchesf",
        monthlyValue: 480,
        billingDay: 10,
      } as any);

      const createRecSpy = vi.spyOn(prisma.clientReceivable, "create").mockResolvedValue({
        id: "rec_new_456",
      } as any);

      const res = await generateMonthlyReceivableFromContractAction({
        contractId: "cont_1",
        competence: "2026-10",
      });

      expect(res.success).toBe(true);
      expect(res.data?.id).toBe("rec_new_456");
      expect(createRecSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: "cli_aposchesf",
            contractId: "cont_1",
            amount: 480,
            competence: "2026-10",
            status: "PENDENTE",
          }),
        })
      );
    });

    it("should update receivable status to PAGO and register paidDate", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue(supportSession);

      const updateSpy = vi.spyOn(prisma.clientReceivable, "update").mockResolvedValue({
        id: "rec_1",
      } as any);

      const res = await updateReceivableStatusAction({
        id: "rec_1",
        status: ReceivableStatus.PAGO,
        paidDate: "2026-09-10",
        paymentMethod: "PIX",
      });

      expect(res.success).toBe(true);
      expect(updateSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "rec_1" },
          data: expect.objectContaining({
            status: "PAGO",
            paymentMethod: "PIX",
          }),
        })
      );
    });
  });

  describe("Proposals Pipeline", () => {
    it("should create and transition proposal status to APROVADA", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue(supportSession);

      const createPropSpy = vi.spyOn(prisma.clientProposal, "create").mockResolvedValue({
        id: "prop_99",
      } as any);

      const createRes = await createProposalAction({
        userId: "cli_aposchesf",
        proposalNumber: "PROP-099",
        title: "Novo Portal",
        scopeDescription: "Redesign completo do portal web",
        oneOffValue: 5000,
        monthlyValue: 480,
      });

      expect(createRes.success).toBe(true);

      const updatePropSpy = vi.spyOn(prisma.clientProposal, "update").mockResolvedValue({
        id: "prop_99",
      } as any);

      const updateRes = await updateProposalStatusAction({
        id: "prop_99",
        status: ProposalStatus.APROVADA,
        notes: "Aprovado pelo comitê diretivo",
      });

      expect(updateRes.success).toBe(true);
      expect(updatePropSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "prop_99" },
          data: expect.objectContaining({
            status: "APROVADA",
            notes: "Aprovado pelo comitê diretivo",
          }),
        })
      );
    });
  });
});
