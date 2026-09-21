import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ClientCommercialModal } from "@/components/suporte/ClientCommercialModal";
import * as commercialActions from "@/lib/actions/commercial-actions";
import { ContractStatus, ReceivableStatus, ProposalStatus } from "@prisma/client";

describe("components/suporte/ClientCommercialModal", () => {
  const mockOverviewData: commercialActions.ClientCommercialOverviewData = {
    client: {
      id: "cli_aposchesf",
      name: "Gestor Aposchesf",
      company: "Aposchesf",
      email: "contato@aposchesf.com.br",
      contractNumber: "CTR-480",
    },
    contracts: [
      {
        id: "cont_1",
        userId: "cli_aposchesf",
        contractNumber: "CTR-480",
        title: "Sustentação Mensal & Telemetria",
        monthlyValue: 480,
        billingDay: 10,
        startDate: new Date("2026-01-01"),
        endDate: null,
        status: ContractStatus.ATIVO,
        notes: "Contrato mensal padrão",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    receivables: [
      {
        id: "rec_1",
        userId: "cli_aposchesf",
        contractId: "cont_1",
        contractTitle: "Sustentação Mensal & Telemetria",
        description: "Mensalidade 2026-09",
        competence: "2026-09",
        amount: 480,
        dueDate: new Date("2026-09-10"),
        paidDate: null,
        paymentMethod: "PIX",
        status: ReceivableStatus.PENDENTE,
        isOverdue: false,
        notes: null,
        createdAt: new Date(),
      },
    ],
    proposals: [
      {
        id: "prop_1",
        userId: "cli_aposchesf",
        proposalNumber: "PROP-2026-001",
        title: "Módulo Financeiro",
        scopeDescription: "Desenvolvimento e sustentação contínua",
        oneOffValue: 2000,
        monthlyValue: 480,
        sentDate: new Date("2026-09-01"),
        validUntil: new Date("2026-10-01"),
        status: ProposalStatus.ENVIADA,
        documentUrl: null,
        notes: null,
        createdAt: new Date(),
      },
    ],
    summary: {
      activeMrr: 480,
      totalPaid: 0,
      totalPending: 480,
      totalOverdue: 0,
      proposalsCount: 1,
      activeProposalsCount: 1,
    },
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(commercialActions, "getClientCommercialOverviewAction").mockResolvedValue({
      success: true,
      data: mockOverviewData,
    });
  });

  it("should render client commercial modal with KPIs and contracts tab", async () => {
    render(
      <ClientCommercialModal
        isOpen={true}
        onClose={vi.fn()}
        clientId="cli_aposchesf"
        clientName="Gestor Aposchesf"
        clientCompany="Aposchesf"
        clientEmail="contato@aposchesf.com.br"
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Aposchesf")).toBeInTheDocument();
      expect(screen.getByText("VISÃO COMERCIAL 360°")).toBeInTheDocument();
      expect(screen.getAllByText(/480,00/).length).toBeGreaterThanOrEqual(1); // MRR KPI
      expect(screen.getByText("Sustentação Mensal & Telemetria")).toBeInTheDocument();
    });
  });

  it("should switch tabs to Recebíveis & Faturas and Propostas Comerciais", async () => {
    render(
      <ClientCommercialModal
        isOpen={true}
        onClose={vi.fn()}
        clientId="cli_aposchesf"
        clientName="Gestor Aposchesf"
        clientCompany="Aposchesf"
        clientEmail="contato@aposchesf.com.br"
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Sustentação Mensal & Telemetria")).toBeInTheDocument();
    });

    // Switch to Recebíveis
    const recebiveisTab = screen.getByRole("button", { name: /Recebíveis & Faturas/i });
    fireEvent.click(recebiveisTab);

    await waitFor(() => {
      expect(screen.getByText("2026-09")).toBeInTheDocument();
      expect(screen.getByText("Mensalidade 2026-09")).toBeInTheDocument();
      expect(screen.getByText("Dar Baixa")).toBeInTheDocument();
    });

    // Switch to Propostas
    const propostasTab = screen.getByRole("button", { name: /Propostas Comerciais/i });
    fireEvent.click(propostasTab);

    await waitFor(() => {
      expect(screen.getByText("PROP-2026-001")).toBeInTheDocument();
      expect(screen.getByText("Módulo Financeiro")).toBeInTheDocument();
    });
  });

  it("should call updateReceivableStatusAction when clicking Dar Baixa", async () => {
    const updateSpy = vi.spyOn(commercialActions, "updateReceivableStatusAction").mockResolvedValue({
      success: true,
      data: { id: "rec_1" },
    });

    render(
      <ClientCommercialModal
        isOpen={true}
        onClose={vi.fn()}
        clientId="cli_aposchesf"
        clientName="Gestor Aposchesf"
        clientCompany="Aposchesf"
        clientEmail="contato@aposchesf.com.br"
      />
    );

    const recebiveisTab = await screen.findByRole("button", { name: /Recebíveis & Faturas/i });
    fireEvent.click(recebiveisTab);

    const darBaixaBtn = await screen.findByRole("button", { name: /Dar Baixa/i });
    fireEvent.click(darBaixaBtn);

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "rec_1",
          status: "PAGO",
        })
      );
    });
  });
});
