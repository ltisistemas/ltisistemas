import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SlaBadge } from "@/components/suporte/SlaBadge";
import { TicketStatus } from "@prisma/client";

describe("components/suporte/SlaBadge", () => {
  it("should render gray badge when ticket is FECHADO", () => {
    const due = new Date();
    render(<SlaBadge slaDueAt={due} ticketStatus={TicketStatus.FECHADO} />);

    const badge = screen.getByTestId("sla-badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent("SLA Finalizado");
  });

  it("should render green badge when SLA is healthy", () => {
    const due = new Date(Date.now() + 5 * 3600 * 1000);
    render(<SlaBadge slaDueAt={due} ticketStatus={TicketStatus.ABERTO} />);

    const badge = screen.getByTestId("sla-badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent(/SLA 6h/i);
  });

  it("should render critical yellow badge when SLA < 2 hours", () => {
    const due = new Date(Date.now() + 45 * 60 * 1000);
    render(<SlaBadge slaDueAt={due} ticketStatus={TicketStatus.PENDENTE} />);

    const badge = screen.getByTestId("sla-badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent(/SLA Crítico/i);
  });

  it("should render red badge when SLA is overdue", () => {
    const due = new Date(Date.now() - 30 * 60 * 1000);
    render(<SlaBadge slaDueAt={due} ticketStatus={TicketStatus.ABERTO} />);

    const badge = screen.getByTestId("sla-badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent(/SLA Vencido/i);
  });

  it("should update countdown when timer fires", () => {
    vi.useFakeTimers();
    const due = new Date(Date.now() + 3 * 3600 * 1000);
    render(<SlaBadge slaDueAt={due} ticketStatus={TicketStatus.ABERTO} liveUpdate={true} />);

    act(() => {
      vi.advanceTimersByTime(60000);
    });

    expect(screen.getByTestId("sla-badge")).toBeInTheDocument();
    vi.useRealTimers();
  });
});



