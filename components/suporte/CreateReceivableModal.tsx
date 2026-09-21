"use client";

import { useState } from "react";
import { X, Receipt, Loader2, AlertCircle, DollarSign, Calendar } from "lucide-react";
import { createReceivableAction } from "@/lib/actions/commercial-actions";
import { PaymentMethod, ReceivableStatus } from "@prisma/client";

interface ContractOption {
  id: string;
  title: string;
  monthlyValue: number;
}

interface CreateReceivableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
  clientName: string;
  contracts: ContractOption[];
}

export function CreateReceivableModal({
  isOpen,
  onClose,
  onSuccess,
  userId,
  clientName,
  contracts,
}: CreateReceivableModalProps) {
  const now = new Date();
  const defaultCompetence = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const [contractId, setContractId] = useState(contracts[0]?.id || "");
  const [description, setDescription] = useState("Mensalidade de Sustentação & Telemetria");
  const [competence, setCompetence] = useState(defaultCompetence);
  const [amount, setAmount] = useState<string>(
    contracts[0] ? String(contracts[0].monthlyValue) : "480"
  );
  const [dueDate, setDueDate] = useState<string>(
    new Date(now.getFullYear(), now.getMonth(), 10).toISOString().split("T")[0]
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("PIX");
  const [status, setStatus] = useState<ReceivableStatus>("PENDENTE");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleContractSelect = (selectedId: string) => {
    setContractId(selectedId);
    const found = contracts.find((c) => c.id === selectedId);
    if (found) {
      setAmount(String(found.monthlyValue));
      setDescription(`Mensalidade de Sustentação — ${found.title}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!description.trim() || !amount || !dueDate) {
      setErrorMessage("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const numAmount = parseFloat(amount.replace(",", "."));
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage("Informe um valor de cobrança válido.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await createReceivableAction({
        userId,
        contractId: contractId || undefined,
        description: description.trim(),
        competence: competence.trim() || defaultCompetence,
        amount: numAmount,
        dueDate,
        paymentMethod,
        status,
        notes: notes.trim() || undefined,
      });

      if (!res.success) {
        setErrorMessage(res.error || "Falha ao criar recebível.");
        setIsSubmitting(false);
        return;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Ocorreu um erro ao registrar a fatura.");
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
            <div className="w-8 h-8 rounded-lg bg-green-50 text-[#198754] flex items-center justify-center border border-green-200">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Novo Recebível / Fatura</h2>
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
            {contracts.length > 0 && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Vincular ao Contrato (Opcional)
                </label>
                <select
                  value={contractId}
                  onChange={(e) => handleContractSelect(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#198754]"
                >
                  <option value="">Nenhum (Cobrança Avulsa / Projeto)</option>
                  {contracts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} (R$ {c.monthlyValue.toFixed(2)}/mês)
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Descrição da Cobrança *
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Mensalidade de Sustentação — Setembro/2026"
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#198754]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Competência (AAAA-MM) *
              </label>
              <input
                type="text"
                value={competence}
                onChange={(e) => setCompetence(e.target.value)}
                placeholder="2026-09"
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#198754]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Valor da Fatura (R$) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-gray-500">R$</span>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="480,00"
                  required
                  className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#198754]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Data de Vencimento *
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#198754]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Forma de Pagamento
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#198754]"
              >
                <option value="PIX">PIX (Chave / QR Code)</option>
                <option value="BOLETO">Boleto Bancário</option>
                <option value="TRANSFERENCIA">Transferência / TED</option>
                <option value="CARTAO">Cartão de Crédito</option>
                <option value="OUTRO">Outro</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Status Inicial
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ReceivableStatus)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#198754]"
              >
                <option value="PENDENTE">PENDENTE (Aguardando Pagamento)</option>
                <option value="PAGO">PAGO (Já Liquidado)</option>
              </select>
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
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#198754] hover:bg-[#157347] text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Registrando...</span>
                </>
              ) : (
                <span>Criar Recebível</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
