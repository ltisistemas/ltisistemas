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
          className={`inline-flex items-center font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 ${sizeClasses[size]}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <AlertCircle className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
          Aberto
        </span>
      );

    case "PENDENTE":
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/25 ${sizeClasses[size]}`}
        >
          <Clock className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
          Pendente
        </span>
      );

    case "FECHADO":
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20 ${sizeClasses[size]}`}
        >
          <CheckCircle2 className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
          Fechado
        </span>
      );

    default:
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-slate-500/10 text-slate-300 border border-slate-700 ${sizeClasses[size]}`}
        >
          {status}
        </span>
      );
  }
}
