import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { UsersClientView } from "@/components/suporte/UsersClientView";
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
      role: Role.SUPORTE,
      createdAt: new Date(),
      ticketsCount: 0,
    },
  ];

  it("should render users list table", () => {
    render(<UsersClientView user={supportUser} initialUsers={sampleUsers} />);

    expect(screen.getByText("Gestão de Usuários")).toBeInTheDocument();
    expect(screen.getByText("Cliente Alpha")).toBeInTheDocument();
    expect(screen.getByText("alpha@empresa.com")).toBeInTheDocument();
    expect(screen.getByText("Suporte Beta")).toBeInTheDocument();
  });

  it("should filter users by search query", () => {
    render(<UsersClientView user={supportUser} initialUsers={sampleUsers} />);

    const searchInput = screen.getByPlaceholderText(/Buscar por nome, e-mail/i);
    fireEvent.change(searchInput, { target: { value: "Alpha" } });

    expect(screen.getByText("Cliente Alpha")).toBeInTheDocument();
    expect(screen.queryByText("Suporte Beta")).toBeNull();
  });

  it("should open create user modal when clicking button", () => {
    render(<UsersClientView user={supportUser} initialUsers={sampleUsers} />);

    const createBtn = screen.getByRole("button", { name: /Cadastrar Novo Usuário/i });
    fireEvent.click(createBtn);

    expect(screen.getByPlaceholderText(/Carlos Oliveira/i)).toBeInTheDocument();
  });
});
