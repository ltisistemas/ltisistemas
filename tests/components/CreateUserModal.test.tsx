import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CreateUserModal } from "@/components/suporte/CreateUserModal";
import * as authActions from "@/lib/actions/auth-actions";
import { Role } from "@prisma/client";

describe("components/suporte/CreateUserModal", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should not render when isOpen is false", () => {
    const { container } = render(
      <CreateUserModal isOpen={false} onClose={vi.fn()} onSuccess={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("should render user registration form when isOpen is true", () => {
    render(<CreateUserModal isOpen={true} onClose={vi.fn()} onSuccess={vi.fn()} />);

    expect(screen.getByText("Cadastrar Novo Usuário")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Carlos Oliveira/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/carlos@empresa.com.br/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Empresa XYZ/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/https:\/\/app\.cliente\.com\.br/i)).toBeInTheDocument();
  });

  it("should toggle password visibility", () => {
    render(<CreateUserModal isOpen={true} onClose={vi.fn()} onSuccess={vi.fn()} />);

    const passwordInput = screen.getByPlaceholderText(/Mínimo 6 dígitos/i);
    expect(passwordInput).toHaveAttribute("type", "password");

    const toggleBtn = screen.getByTitle("Ver senha");
    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute("type", "text");

    const hideBtn = screen.getByTitle("Ocultar senha");
    fireEvent.click(hideBtn);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("should call createUserAction when submitted with valid inputs", async () => {
    const handleSuccess = vi.fn();
    const handleClose = vi.fn();

    vi.spyOn(authActions, "createUserAction").mockResolvedValue({
      success: true,
      data: { id: "usr_new", email: "novo@empresa.com", name: "Novo" },
    });

    render(
      <CreateUserModal
        isOpen={true}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    );

    fireEvent.change(screen.getByPlaceholderText(/Carlos Oliveira/i), {
      target: { value: "Novo Usuário" },
    });
    fireEvent.change(screen.getByPlaceholderText(/carlos@empresa.com.br/i), {
      target: { value: "novo@empresa.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Empresa XYZ/i), {
      target: { value: "Empresa Nova" },
    });
    fireEvent.change(screen.getByPlaceholderText(/CTR-2026-042/i), {
      target: { value: "CTR-999" },
    });
    fireEvent.change(screen.getByPlaceholderText(/https:\/\/app\.cliente\.com\.br/i), {
      target: { value: "https://meusistema.com" },
    });

    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[0], { target: { value: "ATIVO" } });
    fireEvent.change(selects[1], { target: { value: Role.SUPORTE } });

    fireEvent.change(screen.getByPlaceholderText(/Mínimo 6 dígitos/i), {
      target: { value: "123456" },
    });

    const submitBtn = screen.getByRole("button", { name: /Cadastrar Usuário/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleSuccess).toHaveBeenCalledWith({
        id: "usr_new",
        email: "novo@empresa.com",
        name: "Novo",
      });
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it("should display error message when submission fails", async () => {
    vi.spyOn(authActions, "createUserAction").mockResolvedValue({
      success: false,
      error: "Este e-mail já está cadastrado",
    });

    render(
      <CreateUserModal
        isOpen={true}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    fireEvent.change(screen.getByPlaceholderText(/Carlos Oliveira/i), {
      target: { value: "User" },
    });
    fireEvent.change(screen.getByPlaceholderText(/carlos@empresa.com.br/i), {
      target: { value: "dup@empresa.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Empresa XYZ/i), {
      target: { value: "Empresa" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Mínimo 6 dígitos/i), {
      target: { value: "123456" },
    });

    const submitBtn = screen.getByRole("button", { name: /Cadastrar Usuário/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Este e-mail já está cadastrado")).toBeInTheDocument();
    });
  });
});
