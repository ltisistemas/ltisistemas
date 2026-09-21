import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TicketsClientView } from "@/components/suporte/TicketsClientView";
import { Role, TicketStatus, IncidentOrigin } from "@prisma/client";
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
      code: "LTI-BUG-000101-2026-09-21-10-00",
      title: "Erro no webhook",
      screenName: "Tela de Integrações",
      description: "Webhook não está retornando status 200",
      status: TicketStatus.ABERTO,
      origin: IncidentOrigin.BACK,
      occurrenceCount: 1,
      lastOccurrenceAt: new Date(),
      sourceUrl: null,
      targetUrl: null,
      slaDueAt: new Date(Date.now() + 4 * 3600 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
      attachmentsCount: 2,
      user: {
        id: "cli_1",
        name: "Carlos Cliente",
        company: "Alpha Corp",
        contractNumber: "CTR-01",
        systemUrl: "https://alpha.com",
        email: "carlos@alpha.com",
      },
    },
    {
      id: "tkt_2",
      ticketNumber: 102,
      code: "LTI-BUG-000102-2026-09-21-11-00",
      title: "Dúvida sobre relatório",
      screenName: "Módulo Financeiro",
      description: "Como exportar para excel?",
      status: TicketStatus.FECHADO,
      origin: IncidentOrigin.OUTROS,
      occurrenceCount: 1,
      lastOccurrenceAt: new Date(),
      sourceUrl: null,
      targetUrl: null,
      slaDueAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      attachmentsCount: 0,
      user: {
        id: "cli_2",
        name: "Ana Cliente",
        company: "Beta Corp",
        contractNumber: "CTR-02",
        systemUrl: null,
        email: "ana@beta.com",
      },
    },
    {
      id: "tkt_3",
      ticketNumber: 103,
      code: "LTI-BUG-000103-2026-09-21-12-00",
      title: "Pendente aprovação",
      screenName: "Cadastro de Produtos",
      description: "Aguardando confirmação do cliente",
      status: TicketStatus.PENDENTE,
      origin: IncidentOrigin.FRONT,
      occurrenceCount: 2,
      lastOccurrenceAt: new Date(),
      sourceUrl: null,
      targetUrl: null,
      slaDueAt: new Date(Date.now() + 1 * 3600 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
      attachmentsCount: 0,
      user: {
        id: "cli_3",
        name: "Pedro Cliente",
        company: "Gamma Corp",
        contractNumber: null,
        systemUrl: "https://gamma.com",
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

  it("should render tickets list, screen names and statistics cards", () => {
    render(
      <TicketsClientView
        user={supportUser}
        initialTickets={sampleTickets}
        initialStats={sampleStats}
      />
    );

    expect(screen.getByText("Painel Geral de Atendimento")).toBeInTheDocument();
    expect(screen.getByText("Erro no webhook")).toBeInTheDocument();
    expect(screen.getByText("Tela: Tela de Integrações")).toBeInTheDocument();
    expect(screen.getByText("Dúvida sobre relatório")).toBeInTheDocument();
    expect(screen.getByText("LTI-BUG-000101-2026-09-21-10-00")).toBeInTheDocument();
    expect(screen.getByText("LTI-BUG-000102-2026-09-21-11-00")).toBeInTheDocument();
  });

  it("should filter tickets by search query across multiple ticket attributes", () => {
    render(
      <TicketsClientView
        user={supportUser}
        initialTickets={sampleTickets}
        initialStats={sampleStats}
      />
    );

    const searchInput = screen.getByPlaceholderText(/Buscar chamado, tela, empresa/i);

    // Filter by description
    fireEvent.change(searchInput, { target: { value: "excel" } });
    expect(screen.getByText("Dúvida sobre relatório")).toBeInTheDocument();
    expect(screen.queryByText("Erro no webhook")).toBeNull();

    // Filter by screenName
    fireEvent.change(searchInput, { target: { value: "Integrações" } });
    expect(screen.getByText("Erro no webhook")).toBeInTheDocument();

    // Filter by ticket number or hash code
    fireEvent.change(searchInput, { target: { value: "LTI-BUG-000103" } });
    expect(screen.getByText("Pendente aprovação")).toBeInTheDocument();

    // Filter by user name
    fireEvent.change(searchInput, { target: { value: "Pedro" } });
    expect(screen.getByText("Pendente aprovação")).toBeInTheDocument();

    // Filter by company
    fireEvent.change(searchInput, { target: { value: "Gamma" } });
    expect(screen.getByText("Pendente aprovação")).toBeInTheDocument();

    // Filter by systemUrl
    fireEvent.change(searchInput, { target: { value: "gamma.com" } });
    expect(screen.getByText("Pendente aprovação")).toBeInTheDocument();

    // Filter by contractNumber
    fireEvent.change(searchInput, { target: { value: "CTR-01" } });
    expect(screen.getByText("Erro no webhook")).toBeInTheDocument();
  });

  it("should filter tickets using filter pills and clear filters", () => {
    render(
      <TicketsClientView
        user={supportUser}
        initialTickets={sampleTickets}
        initialStats={sampleStats}
      />
    );

    // Click "Abertos (1)" pill
    const abertosPill = screen.getByRole("button", { name: /Abertos \(1\)/i });
    fireEvent.click(abertosPill);
    expect(screen.getByText("Erro no webhook")).toBeInTheDocument();
    expect(screen.queryByText("Dúvida sobre relatório")).toBeNull();

    // Click "Pendentes (1)" pill
    const pendentesPill = screen.getByRole("button", { name: /Pendentes \(1\)/i });
    fireEvent.click(pendentesPill);
    expect(screen.getByText("Pendente aprovação")).toBeInTheDocument();

    // Click "Fechados (1)" pill
    const fechadosPill = screen.getByRole("button", { name: /Fechados \(1\)/i });
    fireEvent.click(fechadosPill);
    expect(screen.getByText("Dúvida sobre relatório")).toBeInTheDocument();

    // Click "Todos (3)" pill
    const todosPill = screen.getByRole("button", { name: /Todos \(3\)/i });
    fireEvent.click(todosPill);

    expect(screen.getByText("Erro no webhook")).toBeInTheDocument();
    expect(screen.getByText("Dúvida sobre relatório")).toBeInTheDocument();
  });

  it("should handle client role rendering", () => {
    const clientUser: SessionPayload = {
      userId: "cli_1",
      name: "Carlos Cliente",
      email: "carlos@alpha.com",
      company: "Alpha Corp",
      role: Role.CLIENTE,
    };

    render(
      <TicketsClientView
        user={clientUser}
        initialTickets={sampleTickets}
        initialStats={sampleStats}
      />
    );

    expect(screen.getByText("Meus Chamados")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Cadastrar Usuário/i })).toBeNull();
  });

  it("should open modal when clicking 'Abrir Novo Chamado' in empty state", () => {
    render(
      <TicketsClientView
        user={supportUser}
        initialTickets={[]}
        initialStats={{ total: 0, aberto: 0, pendente: 0, fechado: 0 }}
      />
    );

    expect(screen.getByText("Nenhum chamado encontrado")).toBeInTheDocument();
    const openButtons = screen.getAllByRole("button", { name: /Abrir Novo Chamado/i });
    fireEvent.click(openButtons[openButtons.length - 1]);

    expect(screen.getByText("Abrir Novo Chamado de Suporte")).toBeInTheDocument();
  });

  it("should open modals when clicking buttons", () => {
    render(
      <TicketsClientView
        user={supportUser}
        initialTickets={sampleTickets}
        initialStats={sampleStats}
      />
    );

    const newTicketBtns = screen.getAllByRole("button", { name: /Abrir Novo Chamado/i });
    fireEvent.click(newTicketBtns[0]);
    expect(screen.getByText("Abrir Novo Chamado de Suporte")).toBeInTheDocument();

    const createUserBtn = screen.getByRole("button", { name: /Cadastrar Usuário/i });
    fireEvent.click(createUserBtn);
    expect(screen.getByText("Cadastrar Novo Usuário")).toBeInTheDocument();
  });


  it("should handle ticket created callback and redirect", async () => {
    render(
      <TicketsClientView
        user={supportUser}
        initialTickets={sampleTickets}
        initialStats={sampleStats}
      />
    );

    const newTicketBtn = screen.getByRole("button", { name: /Abrir Novo Chamado/i });
    fireEvent.click(newTicketBtn);

    // Fill ticket modal form
    fireEvent.change(screen.getByPlaceholderText(/Ex: Erro ao gerar relatório/i), {
      target: { value: "Novo Chamado Teste" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Ex: Tela de associados/i), {
      target: { value: "Tela de Teste" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Explique o que aconteceu na tela/i), {
      target: { value: "Descrição com mais de 10 caracteres detalhando o problema." },
    });

    // Mock createTicketAction
    const ticketActions = await import("@/lib/actions/ticket-actions");
    vi.spyOn(ticketActions, "createTicketAction").mockResolvedValue({
      success: true,
      data: { id: "tkt_created", ticketNumber: 999, code: "LTI-BUG-000999-2026-09-21-12-00" } as any,
    });

    const submitBtn = screen.getByRole("button", { name: /Criar Chamado/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(ticketActions.createTicketAction).toHaveBeenCalled();
    });
  });

  it("should handle user created callback in support mode", async () => {
    render(
      <TicketsClientView
        user={supportUser}
        initialTickets={sampleTickets}
        initialStats={sampleStats}
      />
    );

    const createUserBtn = screen.getByRole("button", { name: /Cadastrar Usuário/i });
    fireEvent.click(createUserBtn);

    const authActions = await import("@/lib/actions/auth-actions");
    vi.spyOn(authActions, "createUserAction").mockResolvedValue({
      success: true,
      data: { id: "usr_created", email: "novo@corp.com", name: "Novo" },
    });

    fireEvent.change(screen.getByPlaceholderText(/Carlos Oliveira/i), {
      target: { value: "Novo" },
    });
    fireEvent.change(screen.getByPlaceholderText(/carlos@empresa.com.br/i), {
      target: { value: "novo@corp.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Empresa XYZ/i), {
      target: { value: "Corp" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Mínimo 6 dígitos/i), {
      target: { value: "123456" },
    });

    const submitButtons = screen.getAllByRole("button", { name: /Cadastrar Usuário/i });
    const modalSubmitBtn = submitButtons.find((btn) => btn.getAttribute("type") === "submit") || submitButtons[1];
    fireEvent.click(modalSubmitBtn);

    await waitFor(() => {
      expect(authActions.createUserAction).toHaveBeenCalled();
    });
  });

  it("should filter tickets by client dropdown when support selects a client", () => {
    const mockClients = [
      { id: "cli_1", name: "Carlos Cliente", company: "Alpha Corp", email: "carlos@alpha.com" },
      { id: "cli_2", name: "Ana Cliente", company: "Beta Corp", email: "ana@beta.com" },
    ];

    render(
      <TicketsClientView
        user={supportUser}
        initialTickets={sampleTickets}
        initialStats={sampleStats}
        clients={mockClients}
      />
    );

    const clientSelect = screen.getByLabelText(/Filtrar por Cliente/i);
    expect(clientSelect).toBeInTheDocument();

    // Select Carlos Cliente (cli_1)
    fireEvent.change(clientSelect, { target: { value: "cli_1" } });

    expect(screen.getByText("Erro no webhook")).toBeInTheDocument();
    expect(screen.queryByText("Dúvida sobre relatório")).toBeNull();
    expect(screen.queryByText("Pendente aprovação")).toBeNull();

    // Select "ALL"
    fireEvent.change(clientSelect, { target: { value: "ALL" } });
    expect(screen.getByText("Erro no webhook")).toBeInTheDocument();
    expect(screen.getByText("Dúvida sobre relatório")).toBeInTheDocument();
  });

  it("should show TicketSuccessModal when a new ticket is created and allow copy", async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(
      <TicketsClientView
        user={supportUser}
        initialTickets={sampleTickets}
        initialStats={sampleStats}
      />
    );

    const newTicketBtn = screen.getByRole("button", { name: /Abrir Novo Chamado/i });
    fireEvent.click(newTicketBtn);

    fireEvent.change(screen.getByPlaceholderText(/Ex: Erro ao gerar relatório/i), {
      target: { value: "Chamado com Modal" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Ex: Tela de associados/i), {
      target: { value: "Tela de Checkout" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Explique o que aconteceu na tela/i), {
      target: { value: "Detalhes do incidente." },
    });

    const ticketActions = await import("@/lib/actions/ticket-actions");
    vi.spyOn(ticketActions, "createTicketAction").mockResolvedValue({
      success: true,
      data: { id: "tkt_modal_1", ticketNumber: 777, code: "LTI-BUG-000777-2026-09-21-14-00" } as any,
    });

    const submitBtn = screen.getByRole("button", { name: /Criar Chamado/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Chamado Aberto com Sucesso!")).toBeInTheDocument();
      expect(screen.getByText("LTI-BUG-000777-2026-09-21-14-00")).toBeInTheDocument();
    });

    const copyBtn = screen.getByText("Copiar Código");
    fireEvent.click(copyBtn);
    expect(writeTextMock).toHaveBeenCalledWith("LTI-BUG-000777-2026-09-21-14-00");
  });
});



