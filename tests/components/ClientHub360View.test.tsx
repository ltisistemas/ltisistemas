import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ClientHub360View } from "@/components/suporte/ClientHub360View";
import * as commercialActions from "@/lib/actions/commercial-actions";
import * as ticketActions from "@/lib/actions/ticket-actions";
import * as authActions from "@/lib/actions/auth-actions";
import { Role, ContractStatus, ReceivableStatus, ProposalStatus, TicketStatus, IncidentOrigin } from "@prisma/client";
import { SessionPayload } from "@/lib/auth/session";

describe("components/suporte/ClientHub360View", () => {
  const supportUser: SessionPayload = {
    userId: "sup_1",
    name: "Luiz Support",
    email: "suporte@ltisistemas.com",
    company: "LTI Sistemas",
    role: Role.SUPORTE,
  };

  const clientUser: SessionPayload = {
    userId: "u1",
    name: "Panji Dwi",
    email: "panji@alpha.com",
    company: "Alpha Tecnologia",
    role: Role.CLIENTE,
  };

  const sampleCommercialData: commercialActions.ClientCommercialOverviewData = {
    client: {
      id: "u1",
      name: "Panji Dwi",
      company: "Alpha Tecnologia",
      email: "panji@alpha.com",
      contractNumber: "EMP07",
      systemUrl: "https://alpha.com",
      status: "ATIVO",
      createdAt: new Date("2026-01-15"),
    },
    contracts: [
      {
        id: "ctr_1",
        userId: "u1",
        contractNumber: "EMP07",
        title: "Suporte Enterprise & Sustentação TI",
        monthlyValue: 8000,
        billingDay: 10,
        startDate: new Date("2026-01-01"),
        endDate: new Date("2027-01-01"),
        status: ContractStatus.ATIVO,
        notes: "Contrato anual com SLA 6h.",
        createdAt: new Date("2026-01-01"),
        updatedAt: new Date("2026-01-01"),
      },
    ],
    receivables: [
      {
        id: "rec_1",
        userId: "u1",
        contractId: "ctr_1",
        contractTitle: "Suporte Enterprise & Sustentação TI",
        description: "Mensalidade Setembro/2026",
        competence: "2026-09",
        amount: 8000,
        dueDate: new Date("2026-09-10"),
        paidDate: null,
        paymentMethod: "PIX",
        status: ReceivableStatus.PENDENTE,
        isOverdue: false,
        notes: null,
        createdAt: new Date("2026-09-01"),
      },
    ],
    proposals: [
      {
        id: "prop_1",
        userId: "u1",
        proposalNumber: "PROP-001",
        title: "Módulo de Inteligência Fiscal",
        scopeDescription: "Desenvolvimento e deploy do novo módulo fiscal integrado.",
        oneOffValue: 15000,
        monthlyValue: 1200,
        sentDate: new Date("2026-09-01"),
        validUntil: new Date("2026-10-01"),
        status: ProposalStatus.ENVIADA,
        documentUrl: null,
        notes: null,
        createdAt: new Date("2026-09-01"),
      },
    ],
    summary: {
      activeMrr: 8000,
      totalPaid: 64000,
      totalPending: 8000,
      totalOverdue: 0,
      proposalsCount: 1,
      activeProposalsCount: 1,
    },
  };

  const sampleTickets: ticketActions.TicketSummary[] = [
    {
      id: "t1",
      ticketNumber: 1001,
      code: "INC-1001",
      title: "Erro 500 ao emitir NF-e",
      description: "Falha na conexão com SEFAZ.",
      screenName: "Faturamento",
      status: TicketStatus.ABERTO,
      origin: IncidentOrigin.BACK,
      occurrenceCount: 3,
      lastOccurrenceAt: new Date(),
      sourceUrl: "https://alpha.com/faturamento",
      targetUrl: null,
      slaDueAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
      attachmentsCount: 1,
      user: {
        id: "u1",
        name: "Panji Dwi",
        company: "Alpha Tecnologia",
        contractNumber: "EMP07",
        systemUrl: "https://alpha.com",
        email: "panji@alpha.com",
      },
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(commercialActions, "getClientCommercialOverviewAction").mockResolvedValue({
      success: true,
      data: sampleCommercialData,
    });
    vi.spyOn(ticketActions, "getTicketsAction").mockResolvedValue({
      success: true,
      data: {
        tickets: sampleTickets,
        stats: { total: 1, aberto: 1, pendente: 0, fechado: 0 },
      },
    });
    vi.spyOn(authActions, "getClientApiKeysAction").mockResolvedValue({
      success: true,
      data: [
        {
          id: "k1",
          name: "Chave Produção",
          keyPrefix: "lti_live_9a8b7c6d...",
          lastUsedAt: new Date(),
          createdAt: new Date(),
        },
      ],
    });
  });

  it("should render Hero banner with client name, status and metadata", async () => {
    render(
      <ClientHub360View
        user={supportUser}
        initialClientId="u1"
        allClients={[{ id: "u1", name: "Panji Dwi", company: "Alpha Tecnologia", email: "panji@alpha.com", contractNumber: "EMP07" }]}
      />
    );

    await waitFor(() => {
      expect(screen.getAllByText("Panji Dwi").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("Alpha Tecnologia").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("#EMP07")).toBeInTheDocument();
    });
  });

  it("should navigate through sub-tabs (Contratos, Financeiro, Chamados, Propostas, API)", async () => {
    render(
      <ClientHub360View
        user={supportUser}
        initialClientId="u1"
      />
    );

    await waitFor(() => {
      expect(screen.getAllByText("Panji Dwi").length).toBeGreaterThanOrEqual(1);
    });

    // Switch to Contratos Tab
    const contratosTab = screen.getByRole("button", { name: /Contratos/i });
    fireEvent.click(contratosTab);

    expect(screen.getByText(/Vigência do Contrato/i)).toBeInTheDocument();
    expect(screen.getByText(/Suporte Enterprise & Sustentação TI/i)).toBeInTheDocument();
    expect(screen.getByText(/R\$ 8\.000,00\/mês/i)).toBeInTheDocument();

    // Switch to Financeiro Tab
    const financeiroTab = screen.getByRole("button", { name: /Faturas & Financeiro/i });
    fireEvent.click(financeiroTab);

    expect(screen.getByText(/Histórico de Faturas & Recebíveis/i)).toBeInTheDocument();
    expect(screen.getByText("Mensalidade Setembro/2026")).toBeInTheDocument();

    // Switch to Chamados Tab
    const chamadosTab = screen.getByRole("button", { name: /Chamados & Suporte/i });
    fireEvent.click(chamadosTab);

    expect(screen.getByText("Erro 500 ao emitir NF-e")).toBeInTheDocument();
    expect(screen.getByText("INC-1001")).toBeInTheDocument();

    // Switch to Propostas Tab
    const propostasTab = screen.getByRole("button", { name: /Propostas/i });
    fireEvent.click(propostasTab);

    expect(screen.getByText(/Módulo de Inteligência Fiscal/i)).toBeInTheDocument();

    // Switch to API Tab
    const apiTab = screen.getByRole("button", { name: /API & Integrações/i });
    fireEvent.click(apiTab);

    expect(screen.getByText(/Chaves de API/i)).toBeInTheDocument();
    expect(screen.getByText("Chave Produção")).toBeInTheDocument();
  });

  it("should allow client user to access their own hub in client mode", async () => {
    render(
      <ClientHub360View
        user={clientUser}
        initialClientId="u1"
      />
    );

    await waitFor(() => {
      expect(screen.getAllByText("Panji Dwi").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("Alpha Tecnologia").length).toBeGreaterThanOrEqual(1);
    });

    // In client mode, there's no back button or + Contrato button
    expect(screen.queryByTitle(/Voltar para a Lista/i)).toBeNull();
    expect(screen.queryByText(/\+ Contrato/i)).toBeNull();
  });
});
