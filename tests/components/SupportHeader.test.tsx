import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SupportHeader } from "@/components/suporte/SupportHeader";
import { Role } from "@prisma/client";
import { SessionPayload } from "@/lib/auth/session";

describe("components/suporte/SupportHeader", () => {
  const supportUser: SessionPayload = {
    userId: "sup_1",
    name: "Luiz Felipe",
    email: "suporte@ltisistemas.com",
    company: "LTI Sistemas",
    contractNumber: "ADM-01",
    role: Role.SUPORTE,
  };

  const clientUser: SessionPayload = {
    userId: "cli_1",
    name: "Cliente Empresa",
    email: "cliente@empresa.com",
    company: "Empresa XYZ",
    contractNumber: "CTR-123",
    role: Role.CLIENTE,
  };

  it("should render SupportHeader with user details and SUPORTE badge", () => {
    render(<SupportHeader user={supportUser} />);

    expect(screen.getAllByText("LTI Sistemas").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("SUPORTE")).toBeInTheDocument();
    expect(screen.getByText("Luiz Felipe")).toBeInTheDocument();
    expect(screen.getByText("Usuários")).toBeInTheDocument();
  });

  it("should not render 'Usuários' link for CLIENTE role", () => {
    render(<SupportHeader user={clientUser} />);

    expect(screen.getByText("CLIENTE")).toBeInTheDocument();
    expect(screen.getByText("Cliente Empresa")).toBeInTheDocument();
    expect(screen.queryByText("Usuários")).toBeNull();
  });

  it("should trigger onOpenNewTicket when click 'Novo Chamado'", () => {
    const handleOpenTicket = vi.fn();
    render(<SupportHeader user={clientUser} onOpenNewTicket={handleOpenTicket} />);

    const newBtn = screen.getByRole("button", { name: /Novo Chamado/i });
    fireEvent.click(newBtn);
    expect(handleOpenTicket).toHaveBeenCalledTimes(1);
  });

  it("should handle logout click", async () => {
    render(<SupportHeader user={clientUser} />);

    const logoutBtn = screen.getByTitle("Encerrar sessão");
    fireEvent.click(logoutBtn);
    expect(logoutBtn).toBeInTheDocument();
  });
});
