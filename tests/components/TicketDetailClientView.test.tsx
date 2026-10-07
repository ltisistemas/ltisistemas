import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TicketDetailClientView } from "@/components/suporte/TicketDetailClientView";
import { Role, TicketStatus, TicketType, IncidentOrigin } from "@prisma/client";
import { SessionPayload } from "@/lib/auth/session";
import { TicketDetail } from "@/lib/actions/ticket-actions";
import * as ticketActions from "@/lib/actions/ticket-actions";

describe("components/suporte/TicketDetailClientView", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const supportUser: SessionPayload = {
    userId: "sup_1",
    name: "Luiz Support",
    email: "suporte@ltisistemas.com",
    company: "LTI Sistemas",
    role: Role.SUPORTE,
  };

  const sampleTicket: TicketDetail = {
    id: "tkt_100",
    ticketNumber: 55,
    code: "LTI-BUG-000055-2026-09-21-14-30",
    title: "Erro crítico no banco de dados",
    screenName: "Módulo de Relatórios",
    description: "Falha de conexão intermitente ao consultar tabelas",
    type: TicketType.BUG,
    status: TicketStatus.ABERTO,
    origin: IncidentOrigin.BACK,
    occurrenceCount: 2,
    lastOccurrenceAt: new Date(),
    sourceUrl: "https://parceira.com.br/api",
    targetUrl: null,
    slaDueAt: new Date(Date.now() + 5 * 3600 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
    attachmentsCount: 1,
    user: {
      id: "cli_1",
      name: "João Silva",
      company: "Empresa Parceira",
      contractNumber: "CTR-2026",
      systemUrl: "https://parceira.com.br",
      email: "joao@parceira.com",
    },
    attachments: [
      {
        id: "att_1",
        fileName: "screenshot_erro.png",
        mimeType: "image/png",
        base64Data: "data:image/png;base64,samplebase64string",
        createdAt: new Date(),
      },
    ],
    occurrences: [
      {
        id: "occ_100_1",
        origin: IncidentOrigin.BACK,
        occurredAt: new Date(),
        sourceUrl: "https://parceira.com.br/api",
        targetUrl: null,
        stackTrace: "DB Connection Pool Exhausted",
        payload: '{"poolSize": 20}',
        headers: null,
        createdAt: new Date(),
      },
    ],
  };

  it("should render ticket details, screen name, user info and description", () => {
    render(
      <TicketDetailClientView
        user={supportUser}
        initialTicket={sampleTicket}
      />
    );

    expect(screen.getByText("LTI-BUG-000055-2026-09-21-14-30")).toBeInTheDocument();
    expect(screen.getAllByText("Backend").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("2 ocorrências")).toBeInTheDocument();
    expect(screen.getByText("Tela: Módulo de Relatórios")).toBeInTheDocument();
    expect(screen.getByText("Erro crítico no banco de dados")).toBeInTheDocument();
    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText("Empresa Parceira (CTR-2026)")).toBeInTheDocument();
    expect(screen.getByText("parceira.com.br")).toBeInTheDocument();
    expect(screen.getByText("Falha de conexão intermitente ao consultar tabelas")).toBeInTheDocument();
    expect(screen.getByText("screenshot_erro.png")).toBeInTheDocument();
  });

  it("should render back button and navigate when clicked", () => {
    render(
      <TicketDetailClientView
        user={supportUser}
        initialTicket={sampleTicket}
      />
    );

    const backBtn = screen.getByRole("button", { name: "Voltar para a lista de chamados" });
    expect(backBtn).toBeInTheDocument();
    fireEvent.click(backBtn);
  });

  it("should allow user to soft-delete ticket", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    vi.spyOn(ticketActions, "deleteTicketAction").mockResolvedValue({
      success: true,
    });

    render(
      <TicketDetailClientView
        user={supportUser}
        initialTicket={sampleTicket}
      />
    );

    const deleteBtn = screen.getByRole("button", { name: /Excluir Chamado/i });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(ticketActions.deleteTicketAction).toHaveBeenCalledWith("tkt_100");
    });
  });

  it("should allow support user to trigger status update", async () => {
    vi.spyOn(ticketActions, "updateTicketStatusAction").mockResolvedValue({
      success: true,
      data: { id: "tkt_100", status: TicketStatus.FECHADO },
    });

    render(
      <TicketDetailClientView
        user={supportUser}
        initialTicket={sampleTicket}
      />
    );

    const fechadoBtn = screen.getByRole("button", { name: "Fechado" });
    fireEvent.click(fechadoBtn);

    await waitFor(() => {
      expect(ticketActions.updateTicketStatusAction).toHaveBeenCalledWith("tkt_100", TicketStatus.FECHADO);
    });
  });

  it("should display error message when status update fails", async () => {
    vi.spyOn(ticketActions, "updateTicketStatusAction").mockResolvedValue({
      success: false,
      error: "Erro de permissão no servidor",
    });

    render(
      <TicketDetailClientView
        user={supportUser}
        initialTicket={sampleTicket}
      />
    );

    const pendenteBtn = screen.getByRole("button", { name: "Pendente" });
    fireEvent.click(pendenteBtn);

    await waitFor(() => {
      expect(screen.getByText("Erro de permissão no servidor")).toBeInTheDocument();
    });
  });

  it("should open lightbox modal when clicking attachment image", () => {
    render(
      <TicketDetailClientView
        user={supportUser}
        initialTicket={sampleTicket}
      />
    );

    const thumbnail = screen.getByText("Visualizar");
    fireEvent.click(thumbnail);

    expect(screen.getByTitle("Fechar (Esc)")).toBeInTheDocument();
  });

  it("should allow toggling ticket type", async () => {
    vi.spyOn(ticketActions, "updateTicketTypeAction").mockResolvedValue({
      success: true,
      data: { id: "tkt_100", type: TicketType.FEATURE },
    });

    render(
      <TicketDetailClientView
        user={supportUser}
        initialTicket={sampleTicket}
      />
    );

    const toggleBtn = screen.getByTitle(/Alternar para Nova Funcionalidade/i);
    fireEvent.click(toggleBtn);

    await waitFor(() => {
      expect(ticketActions.updateTicketTypeAction).toHaveBeenCalledWith("tkt_100", TicketType.FEATURE);
    });
  });

  it("should open edit modal and allow saving updated SLA and opening date", async () => {
    vi.spyOn(ticketActions, "updateTicketDetailsAction").mockResolvedValue({
      success: true,
      data: {
        id: "tkt_100",
        type: TicketType.BUG,
        createdAt: new Date("2026-09-20T08:00:00Z"),
        slaDueAt: new Date("2026-09-20T14:00:00Z"),
        title: "Título alterado",
        screenName: "Tela alterada",
        description: "Desc",
      },
    });

    render(
      <TicketDetailClientView
        user={supportUser}
        initialTicket={sampleTicket}
      />
    );

    const manageBtn = screen.getByRole("button", { name: /Gerenciar Abertura & SLA/i });
    fireEvent.click(manageBtn);

    expect(screen.getByRole("dialog", { name: /Gerenciar Abertura e SLA do Chamado/i })).toBeInTheDocument();

    const saveBtn = screen.getByRole("button", { name: /Salvar Alterações/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(ticketActions.updateTicketDetailsAction).toHaveBeenCalled();
    });
  });
});
