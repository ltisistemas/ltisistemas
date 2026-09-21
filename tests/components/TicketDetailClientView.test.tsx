import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TicketDetailClientView } from "@/components/suporte/TicketDetailClientView";
import { Role, TicketStatus } from "@prisma/client";
import { SessionPayload } from "@/lib/auth/session";
import { TicketDetail } from "@/lib/actions/ticket-actions";
import * as ticketActions from "@/lib/actions/ticket-actions";

describe("components/suporte/TicketDetailClientView", () => {
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
    title: "Erro crítico no banco de dados",
    description: "Falha de conexão intermitente ao consultar tabelas",
    status: TicketStatus.ABERTO,
    createdAt: new Date(),
    updatedAt: new Date(),
    attachmentsCount: 1,
    user: {
      id: "cli_1",
      name: "João Silva",
      company: "Empresa Parceira",
      contractNumber: "CTR-2026",
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
  };

  it("should render ticket details, user info and description", () => {
    render(
      <TicketDetailClientView
        user={supportUser}
        initialTicket={sampleTicket}
      />
    );

    expect(screen.getByText("Chamado #55")).toBeInTheDocument();
    expect(screen.getByText("Erro crítico no banco de dados")).toBeInTheDocument();
    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText("Empresa Parceira (CTR-2026)")).toBeInTheDocument();
    expect(screen.getByText("Falha de conexão intermitente ao consultar tabelas")).toBeInTheDocument();
    expect(screen.getByText("screenshot_erro.png")).toBeInTheDocument();
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

  it("should open lightbox modal when clicking attachment image", () => {
    render(
      <TicketDetailClientView
        user={supportUser}
        initialTicket={sampleTicket}
      />
    );

    const thumbnail = screen.getByText("Visualizar");
    fireEvent.click(thumbnail);

    // Lightbox opens with close button
    expect(screen.getByTitle("Fechar (Esc)")).toBeInTheDocument();
  });
});
