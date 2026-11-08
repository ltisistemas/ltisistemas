import { TicketType } from "@prisma/client";
import { Bug, Sparkles, Globe, MessageCircleQuestion, FileText } from "lucide-react";

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

  if (normalized === "EXTERNAL_ISSUE") {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-amber-50 text-amber-800 border border-amber-200 shadow-xs ${sizeClasses[size]}`}
        title="Tipo: Indisponibilidade externa"
      >
        {showIcon && <Globe className={`${iconSizes[size]} text-amber-700 shrink-0`} />}
        <span>Indisponibilidade externa</span>
      </span>
    );
  }

  if (normalized === "TECHNICAL_CONSULTATION") {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-sky-50 text-sky-800 border border-sky-200 shadow-xs ${sizeClasses[size]}`}
        title="Tipo: Consulta técnica"
      >
        {showIcon && <MessageCircleQuestion className={`${iconSizes[size]} text-sky-700 shrink-0`} />}
        <span>Consulta técnica</span>
      </span>
    );
  }

  if (normalized === "COMMERCIAL_PROPOSAL") {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs ${sizeClasses[size]}`}
        title="Tipo: Proposta comercial enviada"
      >
        {showIcon && <FileText className={`${iconSizes[size]} text-emerald-700 shrink-0`} />}
        <span>Proposta comercial enviada</span>
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
