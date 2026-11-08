import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CreateTicketModal } from "@/components/suporte/CreateTicketModal";
import * as ticketActions from "@/lib/actions/ticket-actions";
import * as compressionModule from "@/lib/utils/image-compression";
import { TicketType } from "@prisma/client";

describe("components/suporte/CreateTicketModal", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should not render when isOpen is false", () => {
    const { container } = render(
      <CreateTicketModal isOpen={false} onClose={vi.fn()} onSuccess={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("should render title and form inputs when isOpen is true", () => {
    render(<CreateTicketModal isOpen={true} onClose={vi.fn()} onSuccess={vi.fn()} />);

    expect(screen.getByText("Abrir Novo Chamado de Suporte")).toBeInTheDocument();
    expect(screen.getByText(/SLA de 6 horas para análise/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Erro ao gerar relatório/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Tela de associados/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Explique o que aconteceu/i)).toBeInTheDocument();
  });

  it("should validate required fields before submitting", async () => {
    const createSpy = vi.spyOn(ticketActions, "createTicketAction");
    render(<CreateTicketModal isOpen={true} onClose={vi.fn()} onSuccess={vi.fn()} />);

    const submitBtn = screen.getByRole("button", { name: /Criar Chamado/i });
    fireEvent.click(submitBtn);

    expect(createSpy).not.toHaveBeenCalled();
  });

  it("should call createTicketAction and trigger onSuccess when submitted with valid inputs", async () => {
    const handleSuccess = vi.fn();
    const handleClose = vi.fn();

    vi.spyOn(ticketActions, "createTicketAction").mockResolvedValue({
      success: true,
      data: { id: "tkt_123", ticketNumber: 77, code: "LTI-BUG-000077-2026-09-21-12-00", slaDueAt: new Date(), type: TicketType.BUG },
    });

    render(
      <CreateTicketModal
        isOpen={true}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    );

    const titleInput = screen.getByPlaceholderText(/Erro ao gerar relatório/i);
    const screenInput = screen.getByPlaceholderText(/Tela de associados/i);
    const descInput = screen.getByPlaceholderText(/Explique o que aconteceu/i);

    fireEvent.change(titleInput, { target: { value: "Falha na exportação" } });
    fireEvent.change(screenInput, { target: { value: "Tela de Produtos" } });
    fireEvent.change(descInput, { target: { value: "O botão não responde ao clique" } });

    const submitBtn = screen.getByRole("button", { name: /Criar Chamado/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleSuccess).toHaveBeenCalledWith("tkt_123", 77, "LTI-BUG-000077-2026-09-21-12-00");
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it("should handle image file upload and remove attachment", async () => {
    vi.spyOn(compressionModule, "compressImageToBase64").mockResolvedValue({
      fileName: "screenshot.png",
      mimeType: "image/png",
      base64Data: "data:image/png;base64,mockedCompressed",
    });

    const { container } = render(
      <CreateTicketModal
        isOpen={true}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    const fileInput = container.querySelector("#ticket-photo-upload") as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();

    const file = new File(["dummy png"], "screenshot.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText("screenshot.png")).toBeInTheDocument();
    });

    // Remove the attachment
    const removeBtn = screen.getByTitle("Remover anexo");
    fireEvent.click(removeBtn);

    await waitFor(() => {
      expect(screen.queryByText("screenshot.png")).toBeNull();
    });
  });

  it("should display server error message when creation fails", async () => {
    vi.spyOn(ticketActions, "createTicketAction").mockResolvedValue({
      success: false,
      error: "Erro no servidor ao salvar chamado",
    });

    render(
      <CreateTicketModal
        isOpen={true}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    const titleInput = screen.getByPlaceholderText(/Erro ao gerar relatório/i);
    const screenInput = screen.getByPlaceholderText(/Tela de associados/i);
    const descInput = screen.getByPlaceholderText(/Explique o que aconteceu/i);

    fireEvent.change(titleInput, { target: { value: "Falha" } });
    fireEvent.change(screenInput, { target: { value: "Tela" } });
    fireEvent.change(descInput, { target: { value: "Descrição" } });

    const submitBtn = screen.getByRole("button", { name: /Criar Chamado/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Erro no servidor ao salvar chamado")).toBeInTheDocument();
    });
  });

  it("should render client selector for SUPORTE and submit with targetUserId", async () => {
    const handleSuccess = vi.fn();
    const handleClose = vi.fn();

    const createSpy = vi.spyOn(ticketActions, "createTicketAction").mockResolvedValue({
      success: true,
      data: { id: "tkt_sup_1", ticketNumber: 88, code: "LTI-BUG-000088-2026-09-21-12-00", slaDueAt: new Date(), type: TicketType.BUG },
    });

    const mockClients = [
      { id: "cli_1", name: "Empresa Alfa", company: "Alfa Corp", email: "alfa@corp.com" },
    ];

    render(
      <CreateTicketModal
        isOpen={true}
        onClose={handleClose}
        onSuccess={handleSuccess}
        userRole="SUPORTE"
        clients={mockClients}
      />
    );

    expect(screen.getByText(/Cliente Solicitante/i)).toBeInTheDocument();
    const clientSelect = screen.getByLabelText(/Cliente Solicitante/i);
    fireEvent.change(clientSelect, { target: { value: "cli_1" } });

    const titleInput = screen.getByPlaceholderText(/Erro ao gerar relatório/i);
    const screenInput = screen.getByPlaceholderText(/Tela de associados/i);
    const descInput = screen.getByPlaceholderText(/Explique o que aconteceu/i);

    fireEvent.change(titleInput, { target: { value: "Suporte abrindo chamado" } });
    fireEvent.change(screenInput, { target: { value: "Dashboard" } });
    fireEvent.change(descInput, { target: { value: "Cliente ligou relatando problema" } });

    const submitBtn = screen.getByRole("button", { name: /Criar Chamado/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Suporte abrindo chamado",
          screenName: "Dashboard",
          description: "Cliente ligou relatando problema",
          targetUserId: "cli_1",
        })
      );
      expect(handleSuccess).toHaveBeenCalledWith("tkt_sup_1", 88, "LTI-BUG-000088-2026-09-21-12-00");
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it("should register a commercial proposal without presenting it as an email action", async () => {
    const createSpy = vi.spyOn(ticketActions, "createTicketAction").mockResolvedValue({
      success: true,
      data: {
        id: "tkt_proposal_1",
        ticketNumber: 89,
        code: "LTI-COMMERCIAL_PROPOSAL-000089-2026-09-21-12-00",
        slaDueAt: new Date(),
        type: TicketType.COMMERCIAL_PROPOSAL,
      },
    });

    render(<CreateTicketModal isOpen={true} onClose={vi.fn()} onSuccess={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/Tipo de Solicitação/i), {
      target: { value: TicketType.COMMERCIAL_PROPOSAL },
    });

    expect(screen.getByText(/não envia e-mails pela plataforma/i)).toBeInTheDocument();
    expect(screen.queryByText(/SLA de 6 horas para análise/i)).not.toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/scope|escopo proposto/i), {
      target: { value: "Escopo de melhoria do contrato" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Contrato 123 ou melhoria proposta/i), {
      target: { value: "Contrato 123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/data\/canal de envio/i), {
      target: { value: "Enviada por e-mail em 08/11/2026" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Proposta de melhoria enviada/i), {
      target: { value: "Proposta de melhoria do contrato" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Criar Chamado/i }));

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: TicketType.COMMERCIAL_PROPOSAL })
      );
    });
  });

  it("should record a technical consultation without assigning an intervention SLA", async () => {
    const createSpy = vi.spyOn(ticketActions, "createTicketAction").mockResolvedValue({
      success: true,
      data: {
        id: "tkt_consultation_1",
        ticketNumber: 90,
        code: "LTI-CONS-000090-2026-09-21-12-00",
        slaDueAt: new Date(),
        type: TicketType.TECHNICAL_CONSULTATION,
      },
    });

    render(<CreateTicketModal isOpen={true} onClose={vi.fn()} onSuccess={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/Tipo de Solicitação/i), {
      target: { value: TicketType.TECHNICAL_CONSULTATION },
    });

    expect(screen.getByText(/sem intervenção no sistema/i)).toBeInTheDocument();
    expect(screen.queryByText(/SLA de 6 horas para análise/i)).not.toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/Orientação sobre cadastro/i), {
      target: { value: "Dúvida sobre cadastro" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Ex: Cadastro de associados/i), {
      target: { value: "Cadastro de associados" },
    });
    fireEvent.change(screen.getByPlaceholderText(/orientação técnica fornecida/i), {
      target: { value: "Orientado sobre os passos do cadastro, sem intervenção." },
    });
    fireEvent.click(screen.getByRole("button", { name: /Criar Chamado/i }));

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: TicketType.TECHNICAL_CONSULTATION })
      );
    });
  });
});
