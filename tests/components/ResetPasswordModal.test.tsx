import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ResetPasswordModal } from "@/components/suporte/ResetPasswordModal";
import * as authActions from "@/lib/actions/auth-actions";

describe("components/suporte/ResetPasswordModal", () => {
  const sampleUser = {
    id: "usr_123",
    name: "Carlos Cliente",
    email: "carlos@empresa.com",
    company: "Empresa XYZ",
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should not render when isOpen is false or user is null", () => {
    const { container: c1 } = render(
      <ResetPasswordModal
        isOpen={false}
        user={sampleUser}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );
    expect(c1.firstChild).toBeNull();

    const { container: c2 } = render(
      <ResetPasswordModal
        isOpen={true}
        user={null}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );
    expect(c2.firstChild).toBeNull();
  });

  it("should render modal with user info and password field", () => {
    render(
      <ResetPasswordModal
        isOpen={true}
        user={sampleUser}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    expect(screen.getByText("Redefinir Senha")).toBeInTheDocument();
    expect(screen.getByText("Carlos Cliente")).toBeInTheDocument();
    expect(screen.getByText("carlos@empresa.com")).toBeInTheDocument();
    expect(screen.getByText("Empresa XYZ")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Mínimo 6 caracteres/i)).toBeInTheDocument();
  });

  it("should toggle password visibility", () => {
    render(
      <ResetPasswordModal
        isOpen={true}
        user={sampleUser}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText(/Mínimo 6 caracteres/i);
    expect(input).toHaveAttribute("type", "password");

    const toggleBtn = screen.getByTitle("Ver senha");
    fireEvent.click(toggleBtn);
    expect(input).toHaveAttribute("type", "text");

    const hideBtn = screen.getByTitle("Ocultar senha");
    fireEvent.click(hideBtn);
    expect(input).toHaveAttribute("type", "password");
  });

  it("should generate random strong password and copy to clipboard", async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(
      <ResetPasswordModal
        isOpen={true}
        user={sampleUser}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    const generateBtn = screen.getByRole("button", { name: /Gerar Senha Forte/i });
    fireEvent.click(generateBtn);

    const input = screen.getByPlaceholderText(/Mínimo 6 caracteres/i) as HTMLInputElement;
    expect(input.value.length).toBe(12);

    const copyBtn = screen.getByTitle("Copiar senha");
    fireEvent.click(copyBtn);
    expect(writeTextMock).toHaveBeenCalledWith(input.value);
  });

  it("should submit password reset successfully", async () => {
    const handleSuccess = vi.fn();
    const handleClose = vi.fn();

    vi.spyOn(authActions, "resetUserPasswordAction").mockResolvedValue({
      success: true,
    });

    render(
      <ResetPasswordModal
        isOpen={true}
        user={sampleUser}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    );

    const input = screen.getByPlaceholderText(/Mínimo 6 caracteres/i);
    fireEvent.change(input, { target: { value: "MinhaNovaSenha@123" } });

    const submitBtn = screen.getByRole("button", { name: /Atualizar Senha/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(authActions.resetUserPasswordAction).toHaveBeenCalledWith(
        "usr_123",
        "MinhaNovaSenha@123"
      );
      expect(handleSuccess).toHaveBeenCalledTimes(1);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  it("should display validation error when password is too short", async () => {
    const resetSpy = vi.spyOn(authActions, "resetUserPasswordAction");

    render(
      <ResetPasswordModal
        isOpen={true}
        user={sampleUser}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText(/Mínimo 6 caracteres/i);
    fireEvent.change(input, { target: { value: "123" } });

    const submitBtn = screen.getByRole("button", { name: /Atualizar Senha/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText("A nova senha deve ter no mínimo 6 caracteres.")).toBeInTheDocument();
    expect(resetSpy).not.toHaveBeenCalled();
  });

  it("should display server error message when action fails", async () => {
    vi.spyOn(authActions, "resetUserPasswordAction").mockResolvedValue({
      success: false,
      error: "Usuário inativo ou excluído.",
    });

    render(
      <ResetPasswordModal
        isOpen={true}
        user={sampleUser}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText(/Mínimo 6 caracteres/i);
    fireEvent.change(input, { target: { value: "SenhaCorreta@123" } });

    const submitBtn = screen.getByRole("button", { name: /Atualizar Senha/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Usuário inativo ou excluído.")).toBeInTheDocument();
    });
  });

  it("should handle unexpected exception during submission", async () => {
    vi.spyOn(authActions, "resetUserPasswordAction").mockRejectedValue(
      new Error("Network Failure")
    );

    render(
      <ResetPasswordModal
        isOpen={true}
        user={sampleUser}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText(/Mínimo 6 caracteres/i);
    fireEvent.change(input, { target: { value: "SenhaCorreta@123" } });

    const submitBtn = screen.getByRole("button", { name: /Atualizar Senha/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Erro inesperado ao redefinir a senha.")).toBeInTheDocument();
    });
  });

  it("should close modal when clicking cancel button", () => {
    const handleClose = vi.fn();
    render(
      <ResetPasswordModal
        isOpen={true}
        user={sampleUser}
        onClose={handleClose}
        onSuccess={vi.fn()}
      />
    );

    const cancelBtn = screen.getByRole("button", { name: /Cancelar/i });
    fireEvent.click(cancelBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
