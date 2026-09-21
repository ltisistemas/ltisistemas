import { TicketStatus } from "@prisma/client";

export interface SlaInfo {
  isExpired: boolean;
  isCritical: boolean;
  isResolved: boolean;
  label: string;
  variant: "green" | "yellow" | "red" | "gray" | "blue";
  remainingMinutes: number;
}

/**
 * Computes SLA 6-hour analysis status relative to a reference time.
 */
export function calculateSlaStatus(
  slaDueAt: Date | string | number,
  ticketStatus: TicketStatus,
  now: Date | number = Date.now()
): SlaInfo {
  if (ticketStatus === "FECHADO") {
    return {
      isExpired: false,
      isCritical: false,
      isResolved: true,
      label: "SLA Finalizado",
      variant: "gray",
      remainingMinutes: 0,
    };
  }

  const dueDate = new Date(slaDueAt).getTime();
  const currentTime = typeof now === "number" ? now : new Date(now).getTime();
  const diffMs = dueDate - currentTime;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes <= 0) {
    const overdueMinutes = Math.abs(diffMinutes);
    const hours = Math.floor(overdueMinutes / 60);
    const mins = overdueMinutes % 60;
    const timeText = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

    return {
      isExpired: true,
      isCritical: true,
      isResolved: false,
      label: `SLA Vencido (${timeText})`,
      variant: "red",
      remainingMinutes: diffMinutes,
    };
  }

  const hours = Math.floor(diffMinutes / 60);
  const mins = diffMinutes % 60;
  const timeText = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  if (diffMinutes <= 120) {
    return {
      isExpired: false,
      isCritical: true,
      isResolved: false,
      label: `SLA Crítico (${timeText})`,
      variant: "yellow",
      remainingMinutes: diffMinutes,
    };
  }

  return {
    isExpired: false,
    isCritical: false,
    isResolved: false,
    label: `SLA 6h (${timeText})`,
    variant: "green",
    remainingMinutes: diffMinutes,
  };
}
