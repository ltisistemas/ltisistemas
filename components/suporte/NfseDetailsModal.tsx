"use client";

import React, { useState } from "react";
import {
  X,
  FileText,
  Eye,
  Download,
  Ban,
  RefreshCw,
  Copy,
  Check,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { NfseSummaryDTO } from "@/lib/services/nfse/types";
import { cancelNfseAction, replaceNfseAction } from "@/lib/actions/nfse-actions";
import { NfseStatusBadge } from "./NfseStatusBadge";
import { DanfseViewerModal } from "./DanfseViewerModal";

interface NfseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: NfseSummaryDTO;
  onUpdated?: () => void;
}

export function NfseDetailsModal({
  isOpen,
  onClose,
  invoice,
  onUpdated,
}: NfseDetailsModalProps) {
  const [copiedKey, setCopiedKey] = useState(false);
  const [isDanfseOpen, setIsDanfseOpen] = useState(false);

  // Cancellation State
  const [isCanceling, setIsCanceling] = useState(false);
  const [cancelMotivo, setCancelMotivo] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  // Substitution State
  const [isReplacing, setIsReplacing] = useState(false);
  const [replaceMotivo, setReplaceMotivo] = useState("");
  const [replaceLoading, setReplaceLoading] = useState(false);
  const [replaceError, setReplaceError] = useState<string | null>(null);

  if (!isOpen) return null;

  function handleCopyKey() {
    if (invoice.chaveAcesso) {
      navigator.clipboard.writeText(invoice.chaveAcesso);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  }

  async function handleCancelSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cancelMotivo.trim()) return;

    setCancelLoading(true);
    setCancelError(null);

    try {
      const res = await cancelNfseAction({
        invoiceId: invoice.id,
        motivo: cancelMotivo,
      });

      if (!res.success) {
        setCancelError(res.error || "Falha ao cancelar.");
      } else {
        setIsCanceling(false);
        if (onUpdated) onUpdated();
        onClose();
      }
    } catch (err: any) {
      setCancelError(err.message || "Erro inesperado.");
    } finally {
      setCancelLoading(false);
    }
  }

  async function handleReplaceSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!replaceMotivo.trim()) return;

    setReplaceLoading(true);
    setReplaceError(null);

    try {
      const res = await replaceNfseAction({
        invoiceId: invoice.id,
        motivo: replaceMotivo,
      });

      if (!res.success) {
        setReplaceError(res.error || "Falha ao substituir.");
      } else {
        setIsReplacing(false);
        if (onUpdated) onUpdated();
        onClose();
      }
    } catch (err: any) {
      setReplaceError(err.message || "Erro inesperado.");
    } finally {
      setReplaceLoading(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-base text-slate-100">
                    NFS-e Nº {invoice.numeroNfse || "Em Processamento"}
                  </h3>
                  <NfseStatusBadge status={invoice.status} />
                </div>
                <p className="text-xs text-slate-400">
                  Emitida para {invoice.tomadorRazaoSocial || invoice.companyName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
            {/* Chave de Acesso Box */}
            {invoice.chaveAcesso && (
              <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                    Chave de Acesso Nacional (50 dígitos)
                  </span>
                  <button
                    onClick={handleCopyKey}
                    className="flex items-center text-[11px] text-blue-400 hover:text-blue-300 transition"
                  >
                    {copiedKey ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                        Copiada!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1" />
                        Copiar Chave
                      </>
                    )}
                  </button>
                </div>
                <div className="font-mono text-xs text-slate-300 break-all select-all">
                  {invoice.chaveAcesso}
                </div>
              </div>
            )}

            {/* Grid de Informações Principais */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase font-medium block">Cód. Verificação</span>
                <span className="font-mono text-xs font-semibold text-slate-200 mt-1 block">
                  {invoice.codigoVerificacao || "----"}
                </span>
              </div>
              <div className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase font-medium block">Competência</span>
                <span className="text-xs font-semibold text-slate-200 mt-1 block">
                  {typeof invoice.dataCompetencia === "string" ? invoice.dataCompetencia : new Date(invoice.dataCompetencia).toISOString().split("T")[0]}
                </span>
              </div>
              <div className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase font-medium block">ISSQN ({invoice.aliquotaIss}%)</span>
                <span className="text-xs font-semibold text-amber-400 mt-1 block">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(invoice.valorIss)}
                </span>
              </div>
              <div className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase font-medium block">Valor Líquido</span>
                <span className="text-xs font-bold text-emerald-400 mt-1 block">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(invoice.valorLiquido)}
                </span>
              </div>
            </div>

            {/* Discriminação do Serviço */}
            <div className="p-3.5 bg-slate-950/40 border border-slate-800/80 rounded-xl">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">
                Discriminação do Serviço (LC 116 Item {invoice.codigoServicoLc116})
              </div>
              <div className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                {invoice.discriminacaoServico}
              </div>
            </div>

            {/* Motivo do Cancelamento se cancelada */}
            {invoice.motivoCancelamento && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
                <span className="font-semibold block mb-1">Motivo do Cancelamento:</span>
                {invoice.motivoCancelamento}
              </div>
            )}

            {/* Seção de Cancelamento In-line */}
            {isCanceling && (
              <form onSubmit={handleCancelSubmit} className="p-4 bg-rose-950/30 border border-rose-800/50 rounded-xl space-y-3">
                <div className="flex items-center text-xs font-semibold text-rose-300">
                  <AlertTriangle className="w-4 h-4 mr-1.5" />
                  Confirmar Cancelamento junto ao Fisco
                </div>
                {cancelError && <p className="text-xs text-rose-400">{cancelError}</p>}
                <textarea
                  rows={2}
                  value={cancelMotivo}
                  onChange={(e) => setCancelMotivo(e.target.value)}
                  placeholder="Justificativa legal do cancelamento..."
                  className="w-full bg-slate-950 border border-rose-800/50 rounded-lg p-2.5 text-xs text-slate-200"
                  required
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsCanceling(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={cancelLoading}
                    className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg flex items-center"
                  >
                    {cancelLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                    Confirmar Cancelamento
                  </button>
                </div>
              </form>
            )}

            {/* Seção de Substituição In-line */}
            {isReplacing && (
              <form onSubmit={handleReplaceSubmit} className="p-4 bg-purple-950/30 border border-purple-800/50 rounded-xl space-y-3">
                <div className="flex items-center text-xs font-semibold text-purple-300">
                  <RefreshCw className="w-4 h-4 mr-1.5" />
                  Emitir Nota Substituta
                </div>
                {replaceError && <p className="text-xs text-rose-400">{replaceError}</p>}
                <textarea
                  rows={2}
                  value={replaceMotivo}
                  onChange={(e) => setReplaceMotivo(e.target.value)}
                  placeholder="Motivo da substituição (ex: correção de valores ou retenções)..."
                  className="w-full bg-slate-950 border border-purple-800/50 rounded-lg p-2.5 text-xs text-slate-200"
                  required
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsReplacing(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={replaceLoading}
                    className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg flex items-center"
                  >
                    {replaceLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                    Gerar Substituta
                  </button>
                </div>
              </form>
            )}

            {/* Ações Disponíveis */}
            <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-800 gap-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsDanfseOpen(true)}
                  className="flex items-center px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-xl shadow-sm transition"
                >
                  <Eye className="w-3.5 h-3.5 mr-1.5" />
                  Visualizar DANFSE
                </button>
                <a
                  href={`/api/nfse/danfse/${invoice.id}?format=xml`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl border border-slate-700 transition"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  XML
                </a>
              </div>

              {invoice.status === "AUTORIZADA" && !isCanceling && !isReplacing && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsReplacing(true)}
                    className="flex items-center px-3 py-2 text-purple-400 hover:bg-purple-950/40 rounded-xl text-xs font-medium border border-purple-500/30 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                    Substituir
                  </button>
                  <button
                    onClick={() => setIsCanceling(true)}
                    className="flex items-center px-3 py-2 text-rose-400 hover:bg-rose-950/40 rounded-xl text-xs font-medium border border-rose-500/30 transition"
                  >
                    <Ban className="w-3.5 h-3.5 mr-1.5" />
                    Cancelar Nota
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isDanfseOpen && (
        <DanfseViewerModal
          isOpen={isDanfseOpen}
          onClose={() => setIsDanfseOpen(false)}
          invoiceId={invoice.id}
        />
      )}
    </>
  );
}
