"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  FileCheck,
  Send,
  Loader2,
  AlertCircle,
  Building2,
  Calculator,
  Percent,
  CheckCircle2,
} from "lucide-react";
import { emitNfseAction, getNfseConfigAction } from "@/lib/actions/nfse-actions";
import { LC116_SERVICE_CATALOG, calculateNfseTaxes } from "@/lib/services/nfse/tax-calculator";
import { NfseSummaryDTO } from "@/lib/services/nfse/types";

interface NfseEmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  receivable: {
    id: string;
    description: string;
    competence: string;
    amount: number;
    contractTitle?: string | null;
    user?: {
      name: string;
      company: string;
      email: string;
      contractNumber?: string | null;
    } | null;
  };
  clientName: string;
  clientCompany: string;
  onSuccess: (nfse: NfseSummaryDTO) => void;
}

export function NfseEmissionModal({
  isOpen,
  onClose,
  receivable,
  clientName,
  clientCompany,
  onSuccess,
}: NfseEmissionModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<NfseSummaryDTO | null>(null);

  // Form State
  const [discriminacao, setDiscriminacao] = useState("");
  const [lc116Code, setLc116Code] = useState("01.07");
  const [aliquotaIss, setAliquotaIss] = useState(2.0);
  const [issRetido, setIssRetido] = useState(false);
  const [environment, setEnvironment] = useState("SIMULADOR");

  useEffect(() => {
    if (isOpen) {
      setDiscriminacao(
        `Serviços de consultoria, suporte técnico contínuo e manutenção de software. Competência ${receivable.competence} — ${receivable.contractTitle || "Contrato Mensal"}`
      );
      loadConfig();
    }
  }, [isOpen, receivable]);

  async function loadConfig() {
    try {
      const res = await getNfseConfigAction();
      if (res.success && res.data) {
        setAliquotaIss(res.data.prestadorAliquotaIss || 2.0);
        setLc116Code(res.data.codigoServicoLc116 || "01.07");
        setEnvironment(res.data.environment);
      }
    } catch {
      // Usar defaults
    }
  }

  // Live Tax Preview
  const taxCalculations = calculateNfseTaxes({
    valorServicos: receivable.amount,
    aliquotaIss,
    issRetido,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await emitNfseAction({
        receivableId: receivable.id,
        customDiscriminacao: discriminacao,
        customAliquota: Number(aliquotaIss),
        issRetido,
        customLc116: lc116Code,
      });

      if (!res.success || !res.data) {
        setError(res.error || "Falha ao emitir NFS-e.");
      } else {
        setSuccessData(res.data);
        onSuccess(res.data);
      }
    } catch (err: any) {
      setError(err.message || "Erro inesperado ao transmitir NFS-e.");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-slate-100">
                Emitir NFS-e Nacional
              </h3>
              <p className="text-xs text-slate-400">
                Padrão Nacional de Nota Fiscal Eletrônica (Gov.br)
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {environment}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {successData ? (
          <div className="p-8 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-in zoom-in-50 duration-300">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-100">
                NFS-e Emitida com Sucesso!
              </h4>
              <p className="text-sm text-slate-400 mt-1">
                Nota autorizada pelo Sistema Nacional NFS-e.
              </p>
            </div>

            <div className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-4 text-left text-xs space-y-2 mt-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Número da NFS-e:</span>
                <span className="font-bold text-emerald-400 text-sm">{successData.numeroNfse}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Código de Verificação:</span>
                <span className="font-mono text-slate-200">{successData.codigoVerificacao}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Valor Líquido:</span>
                <span className="font-semibold text-slate-100">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(successData.valorLiquido)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-400 block mb-1">Chave de Acesso:</span>
                <span className="font-mono text-[11px] text-slate-300 break-all bg-slate-900 p-2 rounded block border border-slate-800">
                  {successData.chaveAcesso}
                </span>
              </div>
            </div>

            <div className="flex w-full space-x-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
              >
                Fechar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start space-x-3 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Tomador / Cliente Info */}
            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-slate-800 text-slate-300 rounded-lg">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Tomador dos Serviços</div>
                  <div className="text-sm font-semibold text-slate-200">{clientCompany || clientName}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 font-medium">Competência / Fatura</div>
                <div className="text-xs font-semibold text-blue-400">{receivable.competence}</div>
              </div>
            </div>

            {/* Código LC 116 e Alíquota */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Item da Lista LC 116/03
                </label>
                <select
                  value={lc116Code}
                  onChange={(e) => setLc116Code(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  {Object.values(LC116_SERVICE_CATALOG).map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.code} — {item.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Alíquota de ISS (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="2.0"
                    max="5.0"
                    value={aliquotaIss}
                    onChange={(e) => setAliquotaIss(parseFloat(e.target.value) || 2.0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3 pr-8 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                  <Percent className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-2.5" />
                </div>
              </div>
            </div>

            {/* Discriminação do Serviço */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Discriminação dos Serviços Prestados
              </label>
              <textarea
                rows={3}
                value={discriminacao}
                onChange={(e) => setDiscriminacao(e.target.value)}
                placeholder="Descreva detalhadamente os serviços prestados..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Resumo de Valores e Tributos */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-semibold text-slate-300 flex items-center">
                  <Calculator className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                  Cálculo Tributário Automático
                </span>
                <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={issRetido}
                    onChange={(e) => setIssRetido(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-0"
                  />
                  <span>ISS Retido na Fonte</span>
                </label>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Valor dos Serviços</span>
                  <span className="font-semibold text-slate-200">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(receivable.amount)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Valor do ISS ({aliquotaIss}%)</span>
                  <span className="font-semibold text-amber-400">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(taxCalculations.valorIss || 0)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Valor Líquido</span>
                  <span className="font-bold text-emerald-400">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(taxCalculations.valorLiquido)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-950/30 transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                    Transmitindo ao Fisco...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 mr-2" />
                    Transmitir e Emitir NFS-e
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
