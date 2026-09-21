import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TicketsClientView } from "@/components/suporte/TicketsClientView";
import { Role, TicketStatus } from "@prisma/client";
import { SessionPayload } from "@/lib/auth/session";
import { TicketSummary, TicketStats } from "@/lib/actions/ticket-actions";

describe("components/suporte/TicketsClientView", () => {
  const supportUser: SessionPayload = {
    userId: "sup_1",
    name: "Luiz Support",
    email: "suporte@ltisistemas.com",
    company: "LTI Sistemas",
    role: Role.SUPORTE,
  };

  const sampleTickets: TicketSummary[] = [
    {
      id: "tkt_1",
      ticketNumber: 101,
      title: "Erro no webhook",
      description: "Webhook não está retornando status 200",
      status: TicketStatus.ABERTO,
      createdAt: new Date(),
      updatedAt: new Date(),
      attachmentsCount: 2,
      user: {
        id: "cli_1",
        name: "Carlos Cliente",
        company: "Alpha Corp",
        contractNumber: "CTR-01",
        email: "carlos@alpha.com",
      },
    },
    {
      id: "tkt_2",
      ticketNumber: 102,
      title: "Dúvida sobre relatório",
      description: "Como exportar para excel?",
      status: TicketStatus.FECHADO,
      createdAt: new Date(),
      updatedAt: new Date(),
      attachmentsCount: 0,
      user: {
        id: "cli_2",
        name: "Ana Cliente",
        company: "Beta Corp",
        contractNumber: "CTR-02",
        email: "ana@beta.com",
      },
    },
  ];

  const sampleStats: TicketStats = {
    total: 2,
    aberto: 1,
    pendente: 0,
    fechado: 1,
  };

  it("should render tickets list and statistics cards", () => {
    render(
      <TicketsClientView
        user={supportUser}
        initialTickets={sampleTickets}
        initialStats={sampleStats}
      />
    );

    expect(screen.getByText("Painel Geral de Atendimento")).toBeInTheDocument();
    expect(screen.getByText("Erro no webhook")).toBeInTheDocument();
    expect(screen.getByText("Dúvida sobre relatório")).toBeInTheDocument();
    expect(screen.getByText("#101")).toBeInTheDocument();
    expect(screen.getByText("#102")).toBeInTheDocument();
  });

  it("should filter tickets by search query", () => {
    render(
      <TicketsClientView
        user={supportUser}
        initialTickets={sampleTickets}
        initialStats={sampleStats}
      />
    );

    const searchInput = screen.getByPlaceholderText(/Buscar chamado, empresa ou título/i);
    fireEvent.change(searchInput, { target: { value: "webhook" } });

    expect(screen.getByText("Erro no webhook")).toBeInTheDocument();
    expect(screen.queryByText("Dúvida sobre relatório")).toBeNull();
  });

  it("should filter tickets by status pill", () => {
    render(
      <TicketsClientView
        user={supportUser}
        initialTickets={sampleTickets}
        initialStats={sampleStats}
      />
    );

    const abertosBtn = screen.getByRole("button", { name: /Abertos \(1\)/i });
    fireEvent.click(abertosBtn);

    expect(screen.getByText("Erro no webhook")).toBeInTheDocument();
    expect(screen.queryByText("Dúvida sobre relatório")).toBeNull();
  });

  it("should render empty state when no tickets match filter", () => {
    render(
      <TicketsClientView
        user={supportUser}
        initialTickets={[]}
        initialStats={{ total: 0, aberto: 0, pendente: 0, fechado: 0 }}
      />
    );

    expect(screen.getByText("Nenhum chamado encontrado")).toBeInTheDocument();
  });
});
