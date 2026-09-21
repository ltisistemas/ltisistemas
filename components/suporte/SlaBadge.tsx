"use client";

import { useEffect, useState } from "react";
import { TicketStatus } from "@prisma/client";
import { Clock, AlertTriangle, CheckCircle2, AlertOctagon } from "lucide-react";
import { calculateSlaStatus } from "@/lib/utils/sla";

interface SlaBadgeProps {
  slaDueAt: Date | string;
  ticketStatus: TicketStatus | string;
  size?: "sm" | "md" | "lg";
  liveUpdate?: boolean;
}

export function SlaBadge({
  slaDueAt,
  ticketStatus,
  size = "md",
  liveUpdate = true,
}: SlaBadgeProps) {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    if (!liveUpdate || ticketStatus === "FECHADO") return;

    // Update every minute to keep SLA remaining countdown accurate
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 60000);

    return () => clearInterval(interval);
  }, [liveUpdate, ticketStatus]);

  const slaInfo = calculateSlaStatus(slaDueAt, ticketStatus as TicketStatus, now);

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
    lg: "text-sm px-3 py-1.5 gap-2 font-medium",
  };

  const iconSize = size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5";

  if (slaInfo.variant === "gray") {
    return (
      <span
        data-testid="sla-badge"
        className={`inline-flex items-center font-medium rounded-full bg-[#e2e3e5] text-[#41464b] border border-[#d3d6d8] ${sizeClasses[size]}`}
      >
        <CheckCircle2 className={iconSize} />
        <span>{slaInfo.label}</span>
      </span>
    );
  }

  if (slaInfo.variant === "red") {
    return (
      <span
        data-testid="sla-badge"
        className={`inline-flex items-center font-medium rounded-full bg-[#f8d7da] text-[#842029] border border-[#f5c2c7] ${sizeClasses[size]}`}
      >
        <AlertOctagon className={`${iconSize} text-[#dc3545] animate-pulse`} />
        <span>{slaInfo.label}</span>
      </span>
    );
  }

  if (slaInfo.variant === "yellow") {
    return (
      <span
        data-testid="sla-badge"
        className={`inline-flex items-center font-medium rounded-full bg-[#fff3cd] text-[#664d03] border border-[#ffecb5] ${sizeClasses[size]}`}
      >
        <AlertTriangle className={iconSize} />
        <span>{slaInfo.label}</span>
      </span>
    );
  }

  return (
    <span
      data-testid="sla-badge"
      className={`inline-flex items-center font-medium rounded-full bg-[#cff4fc] text-[#055160] border border-[#b6effb] ${sizeClasses[size]}`}
    >
      <Clock className={iconSize} />
      <span>{slaInfo.label}</span>
    </span>
  );
}
