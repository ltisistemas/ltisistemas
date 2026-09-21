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
    {
      id: "tkt_3",
      ticketNumber: 103,
      title: "Pendente aprovação",
      description: "Aguardando confirmação do cliente",
      status: TicketStatus.PENDENTE,
      createdAt: new Date(),
      updatedAt: new Date(),
      attachmentsCount: 0,
      user: {
        id: "cli_3",
        name: "Pedro Cliente",
        company: "Gamma Corp",
        contractNumber: null,
        email: "pedro@gamma.com",
      },
    },
  ];

  const sampleStats: TicketStats = {
    total: 3,
    aberto: 1,
    pendente: 1,
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

  it("should filter tickets by clicking summary cards", () => {
    render(
      <TicketsClientView
        user={supportUser}
        initialTickets={sampleTickets}
        initialStats={sampleStats}
      />
    );

    // Click Pendentes card
    const pendentesCard = screen.getByText("Pendentes");
    fireEvent.click(pendentesCard);
    expect(screen.getByText("Pendente aprovação")).toBeInTheDocument();
    expect(screen.queryByText("Erro no webhook")).toBeNull();

    // Click Fechados card
    const fechadosCard = screen.getByText("Resolvidos / Fechados");
    fireEvent.click(fechadosCard);
    expect(screen.getByText("Dúvida sobre relatório")).toBeInTheDocument();

    // Click Em Aberto card
    const abertoCard = screen.getByText("Em Aberto");
    fireEvent.click(abertoCard);
    expect(screen.getByText("Erro no webhook")).toBeInTheDocument();

    // Click Total card
    const totalCard = screen.getByText("Total Registrado");
    fireEvent.click(totalCard);
    expect(screen.getByText("Erro no webhook")).toBeInTheDocument();
    expect(screen.getByText("Dúvida sobre relatório")).toBeInTheDocument();
  });

  it("should open modals when clicking buttons", () => {
    render(
      <TicketsClientView
        user={supportUser}
        initialTickets={sampleTickets}
        initialStats={sampleStats}
      />
    );

    const newTicketBtn = screen.getByRole("button", { name: /Abrir Novo Chamado/i });
    fireEvent.click(newTicketBtn);
    expect(screen.getByText("Abrir Novo Chamado de Suporte")).toBeInTheDocument();

    const createUserBtn = screen.getByRole("button", { name: /Cadastrar Usuário/i });
    fireEvent.click(createUserBtn);
    expect(screen.getByText("Cadastrar Novo Usuário")).toBeInTheDocument();
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
