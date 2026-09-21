"use client";

import { useState } from "react";
import { CheckCircle2, Copy, Check, X, ArrowRight } from "lucide-react";

interface TicketSuccessModalProps {
  isOpen: boolean;
  ticketNumber: number;
  ticketId?: string;
  onClose: () => void;
  onViewTicket?: (ticketId: string) => void;
}

export default function TicketSuccessModal({
  isOpen,
  ticketNumber,
  ticketId,
  onClose,
  onViewTicket,
}: TicketSuccessModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const formattedTicketCode = `#${ticketNumber}`;

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(formattedTicketCode);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-success-title"
    >
      <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 shadow-2xl text-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
          aria-label="Fechar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="w-16 h-16 bg-[#d1e7dd] text-[#198754] rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-green-50">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        {/* Title & Description */}
        <h3 id="modal-success-title" className="text-xl font-bold text-gray-900 mb-1">
          Chamado Aberto com Sucesso!
        </h3>
        <p className="text-sm text-gray-600 mb-5">
          O chamado foi registrado na fila de atendimento com SLA inicial de 6 horas para análise.
        </p>

        {/* Ticket Code Box */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 flex items-center justify-between gap-3">
          <div className="text-left">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
              Número do Incidente
            </span>
            <span className="text-2xl font-extrabold text-[#0d6efd] font-mono tracking-tight">
              {formattedTicketCode}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all shadow-sm ${
              copied
                ? "bg-[#198754] text-white hover:bg-[#157347]"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-white" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-gray-600" />
                Copiar Código
              </>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Fechar
          </button>

          {ticketId && onViewTicket && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewTicket(ticketId);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#0d6efd] hover:bg-[#0b5ed7] rounded-lg shadow-sm transition-colors"
            >
              Ver Detalhes
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
