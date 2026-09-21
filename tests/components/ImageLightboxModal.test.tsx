import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ImageLightboxModal } from "@/components/suporte/ImageLightboxModal";

describe("components/suporte/ImageLightboxModal", () => {
  it("should not render when isOpen is false", () => {
    const { container } = render(
      <ImageLightboxModal
        isOpen={false}
        onClose={vi.fn()}
        imageUrl="data:image/png;base64,123"
        fileName="print.png"
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("should render image and title when isOpen is true", () => {
    render(
      <ImageLightboxModal
        isOpen={true}
        onClose={vi.fn()}
        imageUrl="data:image/png;base64,123"
        fileName="print_erro.png"
      />
    );

    expect(screen.getByText("print_erro.png")).toBeInTheDocument();
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "data:image/png;base64,123");
  });

  it("should trigger onClose when clicking close button", () => {
    const handleClose = vi.fn();
    render(
      <ImageLightboxModal
        isOpen={true}
        onClose={handleClose}
        imageUrl="data:image/png;base64,123"
        fileName="print.png"
      />
    );

    const closeBtn = screen.getByTitle("Fechar (Esc)");
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("should trigger onClose when pressing Escape key", () => {
    const handleClose = vi.fn();
    render(
      <ImageLightboxModal
        isOpen={true}
        onClose={handleClose}
        imageUrl="data:image/png;base64,123"
        fileName="print.png"
      />
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
