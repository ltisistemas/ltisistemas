import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import TicketSuccessModal from "@/components/suporte/TicketSuccessModal";

describe("components/suporte/TicketSuccessModal", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should not render when isOpen is false", () => {
    const { container } = render(
      <TicketSuccessModal
        isOpen={false}
        ticketNumber={1050}
        onClose={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("should render ticket number and title when isOpen is true", () => {
    render(
      <TicketSuccessModal
        isOpen={true}
        ticketNumber={1050}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText("Chamado Aberto com Sucesso!")).toBeDefined();
    expect(screen.getByText("#1050")).toBeDefined();
    expect(screen.getByText("Copiar Código")).toBeDefined();
  });

  it("should handle copy to clipboard when clicking copy button", async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(
      <TicketSuccessModal
        isOpen={true}
        ticketNumber={1050}
        onClose={vi.fn()}
      />
    );

    const copyBtn = screen.getByText("Copiar Código");
    await act(async () => {
      fireEvent.click(copyBtn);
    });

    expect(writeTextMock).toHaveBeenCalledWith("#1050");
    expect(screen.getByText("Copiado!")).toBeDefined();
  });

  it("should call onClose when close button or cancel button clicked", () => {
    const onCloseMock = vi.fn();
    render(
      <TicketSuccessModal
        isOpen={true}
        ticketNumber={1050}
        onClose={onCloseMock}
      />
    );

    const closeBtn = screen.getByLabelText("Fechar modal");
    fireEvent.click(closeBtn);
    expect(onCloseMock).toHaveBeenCalledTimes(1);

    const cancelBtn = screen.getByRole("button", { name: "Fechar" });
    fireEvent.click(cancelBtn);
    expect(onCloseMock).toHaveBeenCalledTimes(2);
  });

  it("should render 'Ver Detalhes' button and trigger onViewTicket when clicked", () => {
    const onCloseMock = vi.fn();
    const onViewTicketMock = vi.fn();

    render(
      <TicketSuccessModal
        isOpen={true}
        ticketNumber={1050}
        ticketId="tkt_abc"
        onClose={onCloseMock}
        onViewTicket={onViewTicketMock}
      />
    );

    const viewBtn = screen.getByText("Ver Detalhes");
    fireEvent.click(viewBtn);

    expect(onCloseMock).toHaveBeenCalled();
    expect(onViewTicketMock).toHaveBeenCalledWith("tkt_abc");
  });
});
