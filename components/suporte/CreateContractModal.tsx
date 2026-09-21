"use client";

import { useState } from "react";
import { X, FileText, Loader2, AlertCircle, DollarSign, Calendar } from "lucide-react";
import { createContractAction, updateContractAction } from "@/lib/actions/commercial-actions";
import { ContractStatus } from "@prisma/client";

interface CreateContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
  clientName: string;
  initialData?: {
    id: string;
    contractNumber?: string | null;
    title: string;
    monthlyValue: number;
    billingDay: number;
    startDate: Date;
    endDate?: Date | null;
    status: ContractStatus;
    notes?: string | null;
  } | null;
}

export function CreateContractModal({
  isOpen,
  onClose,
  onSuccess,
  userId,
  clientName,
  initialData,
}: CreateContractModalProps) {
  const isEditing = !!initialData;

  const [contractNumber, setContractNumber] = useState(initialData?.contractNumber || "");
  const [title, setTitle] = useState(initialData?.title || "Sustentação Mensal & Telemetria");
  const [monthlyValue, setMonthlyValue] = useState<string>(
    initialData ? String(initialData.monthlyValue) : "480"
  );
  const [billingDay, setBillingDay] = useState<number>(initialData?.billingDay || 10);
  const [startDate, setStartDate] = useState<string>(
    initialData?.startDate
      ? new Date(initialData.startDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState<string>(
    initialData?.endDate ? new Date(initialData.endDate).toISOString().split("T")[0] : ""
  );
  const [status, setStatus] = useState<ContractStatus>(initialData?.status || "ATIVO");
  const [notes, setNotes] = useState(initialData?.notes || "");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim() || !monthlyValue) {
      setErrorMessage("Por favor, informe o título e o valor mensal do contrato.");
      return;
    }

    const numValue = parseFloat(monthlyValue.replace(",", "."));
    if (isNaN(numValue) || numValue < 0) {
      setErrorMessage("Informe um valor mensal válido.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && initialData) {
        const res = await updateContractAction({
          id: initialData.id,
          contractNumber: contractNumber.trim() || undefined,
          title: title.trim(),
          monthlyValue: numValue,
          billingDay: Number(billingDay),
          startDate,
          endDate: endDate ? endDate : undefined,
          status,
          notes: notes.trim() || undefined,
        });

        if (!res.success) {
          setErrorMessage(res.error || "Falha ao atualizar contrato.");
          setIsSubmitting(false);
          return;
        }
      } else {
        const res = await createContractAction({
          userId,
          contractNumber: contractNumber.trim() || undefined,
          title: title.trim(),
          monthlyValue: numValue,
          billingDay: Number(billingDay),
          startDate,
          endDate: endDate ? endDate : undefined,
          status,
          notes: notes.trim() || undefined,
        });

        if (!res.success) {
          setErrorMessage(res.error || "Falha ao cadastrar contrato.");
          setIsSubmitting(false);
          return;
        }
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Ocorreu um erro ao salvar o contrato.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl bg-white border border-gray-200 shadow-2xl overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0d6efd] flex items-center justify-center border border-blue-200">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {isEditing ? "Editar Contrato" : "Novo Contrato Comercial"}
              </h2>
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
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Título / Objeto do Contrato *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Sustentação Mensal & Telemetria"
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0d6efd]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Número / Código do Contrato
              </label>
              <input
                type="text"
                value={contractNumber}
                onChange={(e) => setContractNumber(e.target.value)}
                placeholder="Ex: CTR-2026-001"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0d6efd]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Valor Recorrente Mensal (R$) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-gray-500">R$</span>
                <input
                  type="text"
                  value={monthlyValue}
                  onChange={(e) => setMonthlyValue(e.target.value)}
                  placeholder="480,00"
                  required
                  className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0d6efd]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Dia de Vencimento Mensal *
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={billingDay}
                onChange={(e) => setBillingDay(Number(e.target.value))}
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0d6efd]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Status do Contrato *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ContractStatus)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0d6efd]"
              >
                <option value="ATIVO">ATIVO (Gera MRR)</option>
                <option value="SUSPENSO">SUSPENSO</option>
                <option value="CANCELADO">CANCELADO</option>
                <option value="FINALIZADO">FINALIZADO</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Data de Início *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0d6efd]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Data de Término (Opcional)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0d6efd]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Observações do Contrato
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Detalhes sobre escopo, reajustes ou SLA contratado..."
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
                <span>{isEditing ? "Salvar Alterações" : "Criar Contrato"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
