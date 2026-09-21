import { describe, it, expect } from "vitest";
import { calculateSlaStatus } from "@/lib/utils/sla";
import { TicketStatus } from "@prisma/client";

describe("lib/utils/sla", () => {
  const baseTime = new Date("2026-09-21T12:00:00.000Z").getTime();

  it("should return resolved info when ticket is FECHADO", () => {
    const due = new Date(baseTime + 3600 * 1000);
    const result = calculateSlaStatus(due, TicketStatus.FECHADO, baseTime);

    expect(result.isResolved).toBe(true);
    expect(result.variant).toBe("gray");
    expect(result.label).toBe("SLA Finalizado");
  });

  it("should return normal 6h countdown when remaining time is > 2h", () => {
    const due = new Date(baseTime + 5 * 3600 * 1000 + 30 * 60 * 1000); // 5h 30m
    const result = calculateSlaStatus(due, TicketStatus.ABERTO, baseTime);

    expect(result.isExpired).toBe(false);
    expect(result.isCritical).toBe(false);
    expect(result.variant).toBe("green");
    expect(result.label).toContain("SLA 6h (5h 30m)");
  });

  it("should return critical status when remaining time is <= 2h and > 0", () => {
    const due = new Date(baseTime + 45 * 60 * 1000); // 45m
    const result = calculateSlaStatus(due, TicketStatus.PENDENTE, baseTime);

    expect(result.isExpired).toBe(false);
    expect(result.isCritical).toBe(true);
    expect(result.variant).toBe("yellow");
    expect(result.label).toContain("SLA Crítico (45m)");
  });

  it("should return expired status when deadline is in the past", () => {
    const due = new Date(baseTime - 2 * 3600 * 1000 - 15 * 60 * 1000); // 2h 15m ago
    const result = calculateSlaStatus(due, TicketStatus.ABERTO, baseTime);

    expect(result.isExpired).toBe(true);
    expect(result.isCritical).toBe(true);
    expect(result.variant).toBe("red");
    expect(result.label).toContain("SLA Vencido (2h 15m)");
  });

  it("should handle minutes format when under 1 hour", () => {
    const due = new Date(baseTime - 20 * 60 * 1000); // 20m ago
    const result = calculateSlaStatus(due, TicketStatus.ABERTO, baseTime);

    expect(result.label).toBe("SLA Vencido (20m)");
  });
});
