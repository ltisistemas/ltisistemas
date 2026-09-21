import { describe, it, expect, vi, beforeEach } from "vitest";
import { getClientReportAction } from "@/lib/actions/report-actions";
import { generateExecutiveCopy } from "@/lib/utils/report-copy";
import { prisma } from "@/lib/db/prisma";
import { Role, TicketStatus, IncidentOrigin } from "@prisma/client";
import * as sessionModule from "@/lib/auth/session";

describe("lib/actions/report-actions", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("generateExecutiveCopy", () => {
    it("should generate a 100% stability executive narrative when there are 0 tickets", () => {
      const copy = generateExecutiveCopy({
        companyName: "Acme Corp",
        contactName: "João Silva",
        formattedRange: "01/09/2026 até 30/09/2026",
        totalTickets: 0,
        closedTickets: 0,
        openTickets: 0,
        pendingTickets: 0,
        resolutionRate: 100,
        slaComplianceRate: 100,
        totalOccurrences: 0,
        originBreakdown: [],
        topScreens: [],
      });

      expect(copy.headline).toContain("Acme Corp");
      expect(copy.greeting).toContain("Prezados Gestores da Acme Corp");
      expect(copy.executiveSummary).toContain("100% de disponibilidade técnica");
      expect(copy.stabilityDiagnostic).toContain("estabilidade operacional");
      expect(copy.telemetryInsights).toContain("Nenhuma falha de execução");
      expect(copy.actionPlan).toContain("manutenção das rotinas preventivas");
      expect(copy.fullFormattedText).toContain("Total de Chamados Processados: 0");
    });

    it("should generate detailed diagnostics when tickets and occurrences exist", () => {
      const copy = generateExecutiveCopy({
        companyName: "Beta Tecnologia",
        contactName: "Maria Oliveira",
        formattedRange: "01/08/2026 até 31/08/2026",
        totalTickets: 10,
        closedTickets: 9,
        openTickets: 1,
        pendingTickets: 0,
        resolutionRate: 90,
        slaComplianceRate: 100,
        totalOccurrences: 35,
        originBreakdown: [
          { origin: IncidentOrigin.BACK, label: "Backend / Serviços", count: 7, percentage: 70 },
          { origin: IncidentOrigin.FRONT, label: "Frontend / Interface", count: 3, percentage: 30 },
        ],
        topScreens: [
          { screenName: "Checkout", count: 5, percentage: 50 },
          { screenName: "Login", count: 2, percentage: 20 },
        ],
      });

      expect(copy.greeting).toContain("Beta Tecnologia");
      expect(copy.executiveSummary).toContain("10 chamados");
      expect(copy.executiveSummary).toContain("90.0%");
      expect(copy.executiveSummary).toContain("100.0%");
      expect(copy.telemetryInsights).toContain("35 ocorrências brutas");
      expect(copy.telemetryInsights).toContain("Checkout");
      expect(copy.fullFormattedText).toContain("Backend / Serviços: 7 (70.0%)");
    });
  });

  describe("getClientReportAction", () => {
    it("should return error if dates are invalid", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "sup_1",
        name: "Suporte",
        email: "sup@lti.com",
        company: "LTI Sistemas",
        role: Role.SUPORTE,
      });

      const res = await getClientReportAction({
        startDate: "invalid-date",
        endDate: "not-a-date",
      });

      expect(res.success).toBe(false);
      expect(res.error).toContain("Datas inválidas");
    });

    it("should enforce client isolation when session role is CLIENTE", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "cli_100",
        name: "Cliente VIP",
        email: "vip@cliente.com",
        company: "Cliente VIP S.A.",
        role: Role.CLIENTE,
      });

      const findUniqueSpy = vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
        id: "cli_100",
        name: "Cliente VIP",
        email: "vip@cliente.com",
        company: "Cliente VIP S.A.",
        contractNumber: "CTR-2026-001",
      } as any);

      const findManySpy = vi.spyOn(prisma.ticket, "findMany").mockResolvedValue([]);

      const res = await getClientReportAction({
        clientId: "other_user_id_which_should_be_ignored",
        startDate: "2026-09-01",
        endDate: "2026-09-30",
      });

      expect(res.success).toBe(true);
      // findMany must be called with userId = cli_100 (ignoring other_user_id_which_should_be_ignored)
      expect(findManySpy).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: "cli_100",
          }),
        })
      );
      expect(res.data?.client?.company).toBe("Cliente VIP S.A.");
      expect(res.data?.metrics.totalTickets).toBe(0);
      expect(res.data?.metrics.resolutionRate).toBe(100);
    });

    it("should correctly compute SLA, occurrences, and breakdown for tickets", async () => {
      vi.spyOn(sessionModule, "requireSession").mockResolvedValue({
        userId: "sup_1",
        name: "Suporte",
        email: "sup@lti.com",
        company: "LTI Sistemas",
        role: Role.SUPORTE,
      });

      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
        id: "cli_200",
        name: "Carlos Gerente",
        email: "carlos@varejo.com",
        company: "Varejo Total",
        contractNumber: "CTR-55",
      } as any);

      const baseDate = new Date("2026-09-10T10:00:00Z");
      const slaOnTime = new Date("2026-09-10T16:00:00Z");
      const slaLate = new Date("2026-09-10T12:00:00Z");
      const resolvedAt = new Date("2026-09-10T14:00:00Z");

      vi.spyOn(prisma.ticket, "findMany").mockResolvedValue([
        {
          id: "t_1",
          ticketNumber: 101,
          title: "Erro no Carrinho",
          screenName: "Carrinho",
          status: TicketStatus.FECHADO,
          origin: IncidentOrigin.FRONT,
          occurrenceCount: 5,
          slaDueAt: slaOnTime, // 16:00 > 14:00 -> SLA MET
          createdAt: baseDate,
          updatedAt: resolvedAt,
          user: { id: "cli_200", name: "Carlos", company: "Varejo Total", email: "carlos@varejo.com" },
        } as any,
        {
          id: "t_2",
          ticketNumber: 102,
          title: "Falha de Webhook",
          screenName: "WebhookService",
          status: TicketStatus.FECHADO,
          origin: IncidentOrigin.BACK,
          occurrenceCount: 2,
          slaDueAt: slaLate, // 12:00 < 14:00 -> SLA MISSED
          createdAt: baseDate,
          updatedAt: resolvedAt,
          user: { id: "cli_200", name: "Carlos", company: "Varejo Total", email: "carlos@varejo.com" },
        } as any,
        {
          id: "t_3",
          ticketNumber: 103,
          title: "Lentidão Servidor",
          screenName: "Dashboard",
          status: TicketStatus.ABERTO,
          origin: IncidentOrigin.INFRA,
          occurrenceCount: 1,
          slaDueAt: new Date(Date.now() + 86400000), // future -> SLA MET
          createdAt: baseDate,
          updatedAt: baseDate,
          user: { id: "cli_200", name: "Carlos", company: "Varejo Total", email: "carlos@varejo.com" },
        } as any,
      ]);

      const res = await getClientReportAction({
        clientId: "cli_200",
        startDate: "2026-09-01",
        endDate: "2026-09-30",
      });

      expect(res.success).toBe(true);
      expect(res.data?.metrics.totalTickets).toBe(3);
      expect(res.data?.metrics.closedTickets).toBe(2);
      expect(res.data?.metrics.openTickets).toBe(1);
      expect(res.data?.metrics.totalOccurrences).toBe(8); // 5 + 2 + 1
      expect(res.data?.metrics.resolutionRate).toBeCloseTo(66.66, 1);
      // SLA met: t_1 (met), t_2 (missed), t_3 (future -> met) = 2/3 = 66.66%
      expect(res.data?.metrics.slaComplianceRate).toBeCloseTo(66.66, 1);

      expect(res.data?.originBreakdown.length).toBe(3);
      expect(res.data?.topScreens.length).toBe(3);
      expect(res.data?.executiveCopy.fullFormattedText).toContain("Varejo Total");
    });
  });
});
