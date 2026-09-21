import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CreateTicketModal } from "@/components/suporte/CreateTicketModal";
import * as ticketActions from "@/lib/actions/ticket-actions";
import * as compressionModule from "@/lib/utils/image-compression";

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
      data: { id: "tkt_123", ticketNumber: 77, slaDueAt: new Date() },
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
      expect(handleSuccess).toHaveBeenCalledWith("tkt_123", 77);
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
});
