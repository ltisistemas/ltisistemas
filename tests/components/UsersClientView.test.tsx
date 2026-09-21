import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UsersClientView } from "@/components/suporte/UsersClientView";
import * as authActions from "@/lib/actions/auth-actions";
import { Role } from "@prisma/client";
import { SessionPayload } from "@/lib/auth/session";

describe("components/suporte/UsersClientView", () => {
  const supportUser: SessionPayload = {
    userId: "sup_1",
    name: "Luiz Support",
    email: "suporte@ltisistemas.com",
    company: "LTI Sistemas",
    role: Role.SUPORTE,
  };

  const sampleUsers = [
    {
      id: "u1",
      name: "Cliente Alpha",
      email: "alpha@empresa.com",
      company: "Alpha Corp",
      contractNumber: "CTR-01",
      systemUrl: "https://alpha.com",
      status: "ATIVO" as const,
      role: Role.CLIENTE,
      createdAt: new Date(),
      ticketsCount: 4,
    },
    {
      id: "u2",
      name: "Suporte Beta",
      email: "beta@ltisistemas.com",
      company: "LTI Sistemas",
      contractNumber: null,
      systemUrl: "app.internal.local",
      status: "INATIVO" as const,
      role: Role.SUPORTE,
      createdAt: new Date(),
      ticketsCount: 0,
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should render users list table with systemUrl and status", () => {
    render(<UsersClientView user={supportUser} initialUsers={sampleUsers} />);

    expect(screen.getByText(/Gestão de Usuários/i)).toBeInTheDocument();
    expect(screen.getByText("Cliente Alpha")).toBeInTheDocument();
    expect(screen.getByText("alpha@empresa.com")).toBeInTheDocument();
    expect(screen.getByText("alpha.com")).toBeInTheDocument();
    expect(screen.getByText("Suporte Beta")).toBeInTheDocument();
    expect(screen.getByText("app.internal.local")).toBeInTheDocument();
  });

  it("should filter users by search query across multiple fields", () => {
    render(<UsersClientView user={supportUser} initialUsers={sampleUsers} />);

    const searchInput = screen.getByPlaceholderText(/Buscar por nome, e-mail/i);

    // By company
    fireEvent.change(searchInput, { target: { value: "Alpha Corp" } });
    expect(screen.getByText("Cliente Alpha")).toBeInTheDocument();
    expect(screen.queryByText("Suporte Beta")).toBeNull();

    // By contract
    fireEvent.change(searchInput, { target: { value: "CTR-01" } });
    expect(screen.getByText("Cliente Alpha")).toBeInTheDocument();

    // By systemUrl
    fireEvent.change(searchInput, { target: { value: "internal.local" } });
    expect(screen.getByText("Suporte Beta")).toBeInTheDocument();

    // By status
    fireEvent.change(searchInput, { target: { value: "INATIVO" } });
    expect(screen.getByText("Suporte Beta")).toBeInTheDocument();

    // Empty result
    fireEvent.change(searchInput, { target: { value: "NonExistentUser123" } });
    expect(screen.getByText("Nenhum usuário encontrado com os filtros aplicados.")).toBeInTheDocument();
  });

  it("should toggle user status successfully", async () => {
    vi.spyOn(authActions, "toggleUserStatusAction").mockResolvedValue({
      success: true,
      data: { id: "u1", status: "INATIVO" },
    });

    render(<UsersClientView user={supportUser} initialUsers={sampleUsers} />);

    const activePill = screen.getByText("ATIVO");
    fireEvent.click(activePill);

    await waitFor(() => {
      expect(authActions.toggleUserStatusAction).toHaveBeenCalledWith("u1", "INATIVO");
    });
  });

  it("should handle error when toggle user status fails", async () => {
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.spyOn(authActions, "toggleUserStatusAction").mockResolvedValue({
      success: false,
      error: "Falha ao alterar status",
    });

    render(<UsersClientView user={supportUser} initialUsers={sampleUsers} />);

    const activePill = screen.getByText("ATIVO");
    fireEvent.click(activePill);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("Falha ao alterar status");
    });
  });

  it("should handle exception when toggle user status throws", async () => {
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.spyOn(authActions, "toggleUserStatusAction").mockRejectedValue(new Error("Network"));

    render(<UsersClientView user={supportUser} initialUsers={sampleUsers} />);

    const activePill = screen.getByText("ATIVO");
    fireEvent.click(activePill);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("Erro ao alterar status do usuário.");
    });
  });

  it("should handle delete user soft-delete when confirmed", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    vi.spyOn(authActions, "deleteUserAction").mockResolvedValue({
      success: true,
      data: { id: "u1" },
    });

    render(<UsersClientView user={supportUser} initialUsers={sampleUsers} />);

    const deleteButtons = screen.getAllByTitle(/Desativar e excluir/i);
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(authActions.deleteUserAction).toHaveBeenCalledWith("u1");
    });
  });

  it("should cancel delete user if confirm is declined", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const deleteSpy = vi.spyOn(authActions, "deleteUserAction");

    render(<UsersClientView user={supportUser} initialUsers={sampleUsers} />);

    const deleteButtons = screen.getAllByTitle(/Desativar e excluir/i);
    fireEvent.click(deleteButtons[0]);

    expect(deleteSpy).not.toHaveBeenCalled();
  });

  it("should handle error when delete user fails or throws", async () => {
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.spyOn(window, "confirm").mockReturnValue(true);
    vi.spyOn(authActions, "deleteUserAction").mockResolvedValue({
      success: false,
      error: "Não foi possível excluir",
    });

    render(<UsersClientView user={supportUser} initialUsers={sampleUsers} />);

    const deleteButtons = screen.getAllByTitle(/Desativar e excluir/i);
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("Não foi possível excluir");
    });

    vi.spyOn(authActions, "deleteUserAction").mockRejectedValue(new Error("DB Err"));
    fireEvent.click(deleteButtons[0]);
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("Erro ao excluir usuário.");
    });
  });

  it("should open and close create user modal and handle user creation", async () => {
    vi.spyOn(authActions, "createUserAction").mockResolvedValue({
      success: true,
      data: { id: "u3", email: "novo@empresa.com", name: "Novo" },
    });

    render(<UsersClientView user={supportUser} initialUsers={sampleUsers} />);

    const createBtn = screen.getByRole("button", { name: /Cadastrar Novo Usuário/i });
    fireEvent.click(createBtn);

    expect(screen.getByPlaceholderText(/Carlos Oliveira/i)).toBeInTheDocument();

    // Close modal
    const cancelBtn = screen.getByRole("button", { name: /Cancelar/i });
    fireEvent.click(cancelBtn);

    // Reopen and submit
    fireEvent.click(createBtn);
    fireEvent.change(screen.getByPlaceholderText(/Carlos Oliveira/i), {
      target: { value: "Novo" },
    });
    fireEvent.change(screen.getByPlaceholderText(/carlos@empresa.com.br/i), {
      target: { value: "novo@empresa.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Empresa XYZ/i), {
      target: { value: "Nova Corp" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Mínimo 6 dígitos/i), {
      target: { value: "123456" },
    });
    const submitBtn = screen.getByRole("button", { name: /Cadastrar Usuário/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(authActions.createUserAction).toHaveBeenCalled();
    });
  });

  it("should open reset password modal, submit new password, and display feedback banner", async () => {
    vi.spyOn(authActions, "resetUserPasswordAction").mockResolvedValue({
      success: true,
    });

    render(<UsersClientView user={supportUser} initialUsers={sampleUsers} />);

    // Click on reset password key icon for first user
    const keyButtons = screen.getAllByTitle(/Redefinir senha de/i);
    fireEvent.click(keyButtons[0]);

    // Modal should be visible with user name
    expect(screen.getByText("Redefinir Senha")).toBeInTheDocument();
    expect(screen.getAllByText("Cliente Alpha").length).toBeGreaterThanOrEqual(1);

    // Fill new password
    const passwordInput = screen.getByPlaceholderText(/Mínimo 6 caracteres/i);
    fireEvent.change(passwordInput, { target: { value: "SenhaSegura@2026" } });

    // Submit form
    const updateBtn = screen.getByRole("button", { name: /Atualizar Senha/i });
    fireEvent.click(updateBtn);

    await waitFor(() => {
      expect(authActions.resetUserPasswordAction).toHaveBeenCalledWith(
        "u1",
        "SenhaSegura@2026"
      );
      expect(screen.getByText(/Senha de "Cliente Alpha" redefinida com sucesso!/i)).toBeInTheDocument();
    });

    // Dismiss feedback banner
    const dismissBtn = screen.getByText("✕");
    fireEvent.click(dismissBtn);
    expect(screen.queryByText(/Senha de "Cliente Alpha" redefinida com sucesso!/i)).toBeNull();
  });
});


