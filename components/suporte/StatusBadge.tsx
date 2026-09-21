import { TicketStatus } from "@prisma/client";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

interface StatusBadgeProps {
  status: TicketStatus | string;
  size?: "sm" | "md" | "lg";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const normalized = (status || "ABERTO").toUpperCase();

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
    lg: "text-sm px-3 py-1.5 gap-2 font-medium",
  };

  switch (normalized) {
    case "ABERTO":
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-[#d1e7dd] text-[#0f5132] border border-[#badbcc] ${sizeClasses[size]}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#198754] animate-pulse" />
          <AlertCircle className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
          Aberto
        </span>
      );

    case "PENDENTE":
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-[#fff3cd] text-[#664d03] border border-[#ffecb5] ${sizeClasses[size]}`}
        >
          <Clock className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
          Pendente
        </span>
      );

    case "FECHADO":
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-[#e2e3e5] text-[#41464b] border border-[#d3d6d8] ${sizeClasses[size]}`}
        >
          <CheckCircle2 className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
          Fechado
        </span>
      );

    default:
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-gray-100 text-gray-700 border border-gray-200 ${sizeClasses[size]}`}
        >
          {status}
        </span>
      );
  }
}
