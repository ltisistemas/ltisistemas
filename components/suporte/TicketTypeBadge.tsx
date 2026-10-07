import { TicketType } from "@prisma/client";
import { Bug, Sparkles } from "lucide-react";

interface TicketTypeBadgeProps {
  type?: TicketType | string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export function TicketTypeBadge({
  type = "BUG",
  size = "md",
  showIcon = true,
}: TicketTypeBadgeProps) {
  const normalized = (type || "BUG").toUpperCase();

  const sizeClasses = {
    sm: "text-[11px] px-2 py-0.5 gap-1 font-semibold",
    md: "text-xs px-2.5 py-1 gap-1.5 font-semibold",
    lg: "text-xs sm:text-sm px-3 py-1.5 gap-2 font-bold",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  if (normalized === "FEATURE" || normalized === "NOVA_FUNCIONALIDADE") {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-purple-50 text-purple-700 border border-purple-200 shadow-xs ${sizeClasses[size]}`}
        title="Tipo: Nova Funcionalidade / Melhoria"
      >
        {showIcon && <Sparkles className={`${iconSizes[size]} text-purple-600 shrink-0`} />}
        <span>Nova Funcionalidade</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full bg-rose-50 text-rose-700 border border-rose-200 shadow-xs ${sizeClasses[size]}`}
      title="Tipo: Bug / Correção"
    >
      {showIcon && <Bug className={`${iconSizes[size]} text-rose-600 shrink-0`} />}
      <span>Bug / Falha</span>
    </span>
  );
}
