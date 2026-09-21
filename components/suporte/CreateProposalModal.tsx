"use client";

import { useState } from "react";
import { X, Briefcase, Loader2, AlertCircle, DollarSign, Calendar, FileText, Link2 } from "lucide-react";
import { createProposalAction } from "@/lib/actions/commercial-actions";
import { ProposalStatus } from "@prisma/client";

interface CreateProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
  clientName: string;
}

export function CreateProposalModal({
  isOpen,
  onClose,
  onSuccess,
  userId,
  clientName,
}: CreateProposalModalProps) {
  const now = new Date();
  const defaultPropNumber = `PROP-${now.getFullYear()}-${String(Math.floor(100 + Math.random() * 900))}`;

  const [proposalNumber, setProposalNumber] = useState(defaultPropNumber);
  const [title, setTitle] = useState("");
  const [scopeDescription, setScopeDescription] = useState("");
  const [oneOffValue, setOneOffValue] = useState<string>("0");
  const [monthlyValue, setMonthlyValue] = useState<string>("0");
  const [sentDate, setSentDate] = useState<string>(now.toISOString().split("T")[0]);
  const [validUntil, setValidUntil] = useState<string>(
    new Date(now.getTime() + 15 * 86400000).toISOString().split("T")[0]
  );
  const [status, setStatus] = useState<ProposalStatus>("ENVIADA");
  const [documentUrl, setDocumentUrl] = useState("");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!proposalNumber.trim() || !title.trim() || !scopeDescription.trim()) {
      setErrorMessage("Número da proposta, título e descrição do escopo são obrigatórios.");
      return;
    }

    const numOneOff = parseFloat(oneOffValue.replace(",", ".")) || 0;
    const numMonthly = parseFloat(monthlyValue.replace(",", ".")) || 0;

    setIsSubmitting(true);

    try {
      const res = await createProposalAction({
        userId,
        proposalNumber: proposalNumber.trim(),
        title: title.trim(),
        scopeDescription: scopeDescription.trim(),
        oneOffValue: numOneOff,
        monthlyValue: numMonthly,
        sentDate,
        validUntil: validUntil || undefined,
        status,
        documentUrl: documentUrl.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      if (!res.success) {
        setErrorMessage(res.error || "Falha ao criar proposta comercial.");
        setIsSubmitting(false);
        return;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Ocorreu um erro ao salvar a proposta comercial.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-xl rounded-2xl bg-white border border-gray-200 shadow-2xl overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-[#0dcaf0] flex items-center justify-center border border-cyan-200">
              <Briefcase className="w-4 h-4 text-[#0aa2c0]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Nova Proposta Comercial</h2>
              <p className="text-xs text-gray-500">Cliente: {clientName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-[#dc3545]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Número / Código da Proposta *
              </label>
              <input
                type="text"
                value={proposalNumber}
                onChange={(e) => setProposalNumber(e.target.value)}
                placeholder="Ex: PROP-2026-001"
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-mono font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0d6efd]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Status Inicial *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProposalStatus)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0d6efd]"
              >
                <option value="ENVIADA">ENVIADA (Em Análise)</option>
                <option value="EM_NEGOCIACAO">EM NEGOCIAÇÃO</option>
                <option value="RASCUNHO">RASCUNHO</option>
                <option value="APROVADA">APROVADA (Gera Contrato)</option>
                <option value="RECUSADA">RECUSADA</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Título / Objeto da Proposta *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Desenvolvimento de Módulo de Faturamento & Sustentação"
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0d6efd]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Descrição do Escopo / Solução Técnica *
              </label>
              <textarea
                value={scopeDescription}
                onChange={(e) => setScopeDescription(e.target.value)}
                rows={3}
                placeholder="Descreva as entregas técnicas, arquitetura proposta, cronograma estimado e garantias..."
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0d6efd]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Valor Pontual / Setup (R$)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-gray-500">R$</span>
                <input
                  type="text"
                  value={oneOffValue}
                  onChange={(e) => setOneOffValue(e.target.value)}
                  placeholder="2.500,00"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0d6efd]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Valor Recorrente Mensal (R$)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-gray-500">R$</span>
                <input
                  type="text"
                  value={monthlyValue}
                  onChange={(e) => setMonthlyValue(e.target.value)}
                  placeholder="480,00"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0d6efd]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Data de Envio
              </label>
              <input
                type="date"
                value={sentDate}
                onChange={(e) => setSentDate(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0d6efd]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Validade da Proposta
              </label>
              <input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0d6efd]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Link do Documento / PDF (Opcional)
              </label>
              <input
                type="url"
                value={documentUrl}
                onChange={(e) => setDocumentUrl(e.target.value)}
                placeholder="https://drive.google.com/... ou link de anexo"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0d6efd]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                <span>Criar Proposta</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
