import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ClientReportView } from "@/components/suporte/ClientReportView";
import { Role, TicketStatus, IncidentOrigin } from "@prisma/client";
import { SessionPayload } from "@/lib/auth/session";
import { ClientReportData } from "@/lib/actions/report-actions";

describe("components/suporte/ClientReportView", () => {
  const supportUser: SessionPayload = {
    userId: "sup_1",
    name: "Suporte Técnico",
    email: "suporte@lti.com",
    company: "LTI Sistemas",
    role: Role.SUPORTE,
  };

  const clients = [
    { id: "cli_1", name: "João", company: "Empresa Alpha", email: "joao@alpha.com" },
    { id: "cli_2", name: "Maria", company: "Beta Corp", email: "maria@beta.com" },
  ];

  const mockReportData: ClientReportData = {
    client: {
      id: "cli_1",
      name: "João",
      company: "Empresa Alpha",
      email: "joao@alpha.com",
      contractNumber: "CTR-99",
    },
    period: {
      startDate: "2026-09-01",
      endDate: "2026-09-30",
      formattedRange: "01/09/2026 até 30/09/2026",
    },
    metrics: {
      totalTickets: 2,
      closedTickets: 2,
      openTickets: 0,
      pendingTickets: 0,
      resolutionRate: 100,
      slaComplianceRate: 100,
      totalOccurrences: 6,
      avgOccurrencesPerTicket: 3,
    },
    originBreakdown: [
      { origin: IncidentOrigin.FRONT, label: "Frontend / Interface", count: 2, percentage: 100 },
    ],
    topScreens: [
      { screenName: "Checkout", count: 2, percentage: 100 },
    ],
    executiveCopy: {
      headline: "Relatório Executivo Mensal de Sustentação & Telemetria — Empresa Alpha",
      greeting: "Prezados Gestores da Empresa Alpha (A/C João),",
      executiveSummary: "Durante o período, foram processados 2 chamados com 100% de SLA.",
      stabilityDiagnostic: "Alta estabilidade com resolução rápida.",
      telemetryInsights: "6 ocorrências interceptadas e deduplicadas.",
      actionPlan: "Manter rotinas preventivas de testes.",
      fullFormattedText: "Texto completo do relatório executivo",
    },
    tickets: [
      {
        id: "t_1",
        ticketNumber: 1,
        code: "LTI-BUG-000001-2026-09-01-10-00",
        title: "Botão com erro",
        screenName: "Checkout",
        status: TicketStatus.FECHADO,
        origin: IncidentOrigin.FRONT,
        occurrenceCount: 6,
        createdAt: new Date("2026-09-01T10:00:00Z"),
        resolvedAt: new Date("2026-09-01T12:00:00Z"),
        slaDueAt: new Date("2026-09-01T16:00:00Z"),
        slaMet: true,
      },
    ],
  };

  it("should render KPIs, executive narrative and tickets table", () => {
    render(
      <ClientReportView
        user={supportUser}
        clients={clients}
        initialReportData={mockReportData}
        initialStartDate="2026-09-01"
        initialEndDate="2026-09-30"
      />
    );

    expect(screen.getByText("Relatório de Atendimento & Telemetria")).toBeInTheDocument();
    expect(screen.getAllByText("100%").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Empresa Alpha (João)")).toBeInTheDocument();
    expect(screen.getByText("Prezados Gestores da Empresa Alpha (A/C João),")).toBeInTheDocument();
    expect(screen.getByText("1. Síntese Executiva & Nível de Serviço (SLA)")).toBeInTheDocument();
    expect(screen.getByText("Botão com erro")).toBeInTheDocument();
    expect(screen.getByText("LTI-BUG-000001-2026-09-01-10-00")).toBeInTheDocument();
    expect(screen.getByText("No Prazo")).toBeInTheDocument();
  });

  it("should handle copy to clipboard", async () => {
    const writeTextSpy = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextSpy,
      },
    });

    render(
      <ClientReportView
        user={supportUser}
        clients={clients}
        initialReportData={mockReportData}
        initialStartDate="2026-09-01"
        initialEndDate="2026-09-30"
      />
    );

    const copyBtn = screen.getByRole("button", { name: /Copiar Texto Executivo/i });
    fireEvent.click(copyBtn);

    expect(writeTextSpy).toHaveBeenCalledWith("Texto completo do relatório executivo");
  });

  it("should handle period presets click", () => {
    render(
      <ClientReportView
        user={supportUser}
        clients={clients}
        initialReportData={mockReportData}
        initialStartDate="2026-09-01"
        initialEndDate="2026-09-30"
      />
    );

    const lastMonthBtn = screen.getByRole("button", { name: "Mês Anterior" });
    fireEvent.click(lastMonthBtn);

    const past90Btn = screen.getByRole("button", { name: "Últimos 90 Dias" });
    fireEvent.click(past90Btn);
  });
});
