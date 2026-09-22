"use client";

import React from "react";
import { NfseStatus } from "@prisma/client";
import { CheckCircle2, Clock, AlertTriangle, XCircle, RefreshCw, FileText } from "lucide-react";

interface NfseStatusBadgeProps {
  status: NfseStatus;
  numeroNfse?: string | null;
  className?: string;
  onClick?: () => void;
}

export function NfseStatusBadge({
  status,
  numeroNfse,
  className = "",
  onClick,
}: NfseStatusBadgeProps) {
  const configs: Record<
    NfseStatus,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    AUTORIZADA: {
      label: numeroNfse ? `NFS-e Nº ${numeroNfse}` : "NFS-e Autorizada",
      bg: "bg-emerald-500/10 hover:bg-emerald-500/20",
      text: "text-emerald-400",
      border: "border-emerald-500/30",
      icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1" />,
    },
    PROCESSANDO: {
      label: "Transmitindo...",
      bg: "bg-amber-500/10 hover:bg-amber-500/20",
      text: "text-amber-400",
      border: "border-amber-500/30",
      icon: <Clock className="w-3.5 h-3.5 mr-1 animate-spin" />,
    },
    REJEITADA: {
      label: "NFS-e Rejeitada",
      bg: "bg-rose-500/10 hover:bg-rose-500/20",
      text: "text-rose-400",
      border: "border-rose-500/30",
      icon: <AlertTriangle className="w-3.5 h-3.5 mr-1" />,
    },
    CANCELADA: {
      label: "NFS-e Cancelada",
      bg: "bg-slate-500/10 hover:bg-slate-500/20",
      text: "text-slate-400",
      border: "border-slate-500/30",
      icon: <XCircle className="w-3.5 h-3.5 mr-1" />,
    },
    SUBSTITUIDA: {
      label: "NFS-e Substituída",
      bg: "bg-purple-500/10 hover:bg-purple-500/20",
      text: "text-purple-400",
      border: "border-purple-500/30",
      icon: <RefreshCw className="w-3.5 h-3.5 mr-1" />,
    },
    RASCUNHO: {
      label: "Rascunho",
      bg: "bg-blue-500/10 hover:bg-blue-500/20",
      text: "text-blue-400",
      border: "border-blue-500/30",
      icon: <FileText className="w-3.5 h-3.5 mr-1" />,
    },
  };

  const cfg = configs[status] || configs.RASCUNHO;

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border transition-colors ${cfg.bg} ${cfg.text} ${cfg.border} ${
        onClick ? "cursor-pointer hover:shadow-sm" : ""
      } ${className}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}
