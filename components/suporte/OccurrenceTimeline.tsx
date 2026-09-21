"use client";

import { useState } from "react";
import {
  Clock,
  Terminal,
  FileCode,
  Globe,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Layers,
  Server,
  Monitor,
  Activity,
  Cpu,
} from "lucide-react";
import { TicketOccurrenceItem } from "@/lib/actions/ticket-actions";
import { IncidentOrigin } from "@prisma/client";

interface OccurrenceTimelineProps {
  occurrences: TicketOccurrenceItem[];
}

export function OriginBadge({ origin }: { origin: IncidentOrigin }) {
  const configs: Record<
    IncidentOrigin,
    { label: string; bg: string; text: string; border: string; icon: any }
  > = {
    FRONT: {
      label: "Frontend",
      bg: "bg-blue-50",
      text: "text-[#0d6efd]",
      border: "border-blue-200",
      icon: Monitor,
    },
    BACK: {
      label: "Backend",
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
      icon: Server,
    },
    INFRA: {
      label: "Infraestrutura",
      bg: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-200",
      icon: Cpu,
    },
    EVENT: {
      label: "Evento / Fila",
      bg: "bg-amber-50",
      text: "text-amber-800",
      border: "border-amber-200",
      icon: Activity,
    },
    OUTROS: {
      label: "Outros",
      bg: "bg-gray-100",
      text: "text-gray-700",
      border: "border-gray-300",
      icon: Layers,
    },
  };

  const config = configs[origin] || configs.OUTROS;
  const IconComponent = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}
    >
      <IconComponent className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </span>
  );
}

export function OccurrenceTimeline({ occurrences }: OccurrenceTimelineProps) {
  const [expandedOccurrences, setExpandedOccurrences] = useState<Record<string, boolean>>({
    [occurrences[0]?.id || ""]: true, // Auto-expand first occurrence
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!occurrences || occurrences.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-gray-50 border border-gray-200 text-center text-xs text-gray-500">
        Nenhum registro detalhado de ocorrência ou telemetria automática disponível.
      </div>
    );
  }

  const toggleExpand = (id: string) => {
    setExpandedOccurrences((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCopy = async (text: string, idKey: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      }
      setCopiedId(idKey);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(idKey);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(d);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#0d6efd]" />
          <span>Histórico de Ocorrências & Telemetria ({occurrences.length})</span>
        </h3>
        <span className="text-xs text-gray-500">
          Ordenado da mais recente para a mais antiga
        </span>
      </div>

      <div className="relative border-l-2 border-blue-200 ml-3.5 space-y-4 pt-1">
        {occurrences.map((occ, index) => {
          const isExpanded = !!expandedOccurrences[occ.id];
          const hasDetails = !!(occ.stackTrace || occ.payload || occ.sourceUrl || occ.targetUrl);

          return (
            <div key={occ.id} className="relative pl-6">
              {/* Timeline marker node */}
              <div
                className={`absolute -left-[9px] top-3.5 w-4 h-4 rounded-full border-2 border-white ${
                  index === 0 ? "bg-[#0d6efd] ring-4 ring-blue-100" : "bg-gray-400"
                }`}
              />

              <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden transition-all">
                {/* Header item */}
                <div
                  onClick={() => hasDetails && toggleExpand(occ.id)}
                  className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    hasDetails ? "cursor-pointer hover:bg-gray-50/80" : ""
                  }`}
                >
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <OriginBadge origin={occ.origin} />
                    <span className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {formatDate(occ.occurredAt)}
                    </span>
                    {index === 0 && (
                      <span className="text-[10px] uppercase font-bold bg-[#d1e7dd] text-[#0f5132] px-2 py-0.5 rounded-md border border-[#badbcc]">
                        Última Ocorrência
                      </span>
                    )}
                  </div>

                  {hasDetails && (
                    <button
                      type="button"
                      className="text-xs font-medium text-[#0d6efd] flex items-center gap-1 self-end sm:self-center"
                    >
                      <span>{isExpanded ? "Ocultar Detalhes" : "Ver Telemetria"}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>

                {/* Collapsible Details */}
                {isExpanded && hasDetails && (
                  <div className="p-4 pt-0 border-t border-gray-100 bg-gray-50/50 space-y-3.5 text-xs text-gray-800">
                    {/* URLs Info */}
                    {(occ.sourceUrl || occ.targetUrl) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3">
                        {occ.sourceUrl && (
                          <div className="p-2.5 rounded-lg bg-white border border-gray-200">
                            <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                              URL de Origem
                            </span>
                            <span className="font-mono text-xs text-[#0d6efd] break-all flex items-center gap-1">
                              <Globe className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                              {occ.sourceUrl}
                            </span>
                          </div>
                        )}

                        {occ.targetUrl && (
                          <div className="p-2.5 rounded-lg bg-white border border-gray-200">
                            <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                              URL de Destino
                            </span>
                            <span className="font-mono text-xs text-gray-700 break-all flex items-center gap-1">
                              <Globe className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                              {occ.targetUrl}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Stack Trace */}
                    {occ.stackTrace && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                            <Terminal className="w-3.5 h-3.5 text-[#dc3545]" />
                            Log de Erro / Stack-Trace
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(occ.stackTrace!, `stack_${occ.id}`)}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-2 py-0.5 rounded shadow-xs hover:bg-gray-50"
                          >
                            {copiedId === `stack_${occ.id}` ? (
                              <>
                                <Check className="w-3 h-3 text-green-600" />
                                <span>Copiado!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-gray-400" />
                                <span>Copiar Log</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-3 rounded-lg bg-gray-900 text-red-200 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto border border-gray-800">
                          {occ.stackTrace}
                        </pre>
                      </div>
                    )}

                    {/* Payload Snapshot */}
                    {occ.payload && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                            <FileCode className="w-3.5 h-3.5 text-[#0d6efd]" />
                            Payload & Contexto Sanitizado
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(occ.payload!, `payload_${occ.id}`)}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-2 py-0.5 rounded shadow-xs hover:bg-gray-50"
                          >
                            {copiedId === `payload_${occ.id}` ? (
                              <>
                                <Check className="w-3 h-3 text-green-600" />
                                <span>Copiado!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-gray-400" />
                                <span>Copiar JSON</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-3 rounded-lg bg-gray-900 text-blue-100 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto border border-gray-800">
                          {occ.payload}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
