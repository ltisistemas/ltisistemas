import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "@/components/suporte/StatusBadge";
import { TicketStatus } from "@prisma/client";

describe("components/suporte/StatusBadge", () => {
  it("should render Aberto badge with emerald styles", () => {
    render(<StatusBadge status={TicketStatus.ABERTO} />);
    expect(screen.getByText("Aberto")).toBeInTheDocument();
  });

  it("should render Pendente badge with amber styles", () => {
    render(<StatusBadge status={TicketStatus.PENDENTE} />);
    expect(screen.getByText("Pendente")).toBeInTheDocument();
  });

  it("should render Fechado badge with slate styles", () => {
    render(<StatusBadge status={TicketStatus.FECHADO} />);
    expect(screen.getByText("Fechado")).toBeInTheDocument();
  });

  it("should support different sizes without breaking", () => {
    const { rerender } = render(<StatusBadge status="ABERTO" size="sm" />);
    expect(screen.getByText("Aberto")).toBeInTheDocument();

    rerender(<StatusBadge status="ABERTO" size="lg" />);
    expect(screen.getByText("Aberto")).toBeInTheDocument();
  });

  it("should render custom status as fallback", () => {
    render(<StatusBadge status="EM_ANALISE" />);
    expect(screen.getByText("EM_ANALISE")).toBeInTheDocument();
  });
});
