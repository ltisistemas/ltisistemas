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
  User,
  Mail,
  Settings2,
} from "lucide-react";
import { emitNfseAction, getNfseConfigAction } from "@/lib/actions/nfse-actions";
import { LC116_SERVICE_CATALOG, calculateNfseTaxes } from "@/lib/services/nfse/tax-calculator";
import { NfseSummaryDTO } from "@/lib/services/nfse/types";
import { NfseConfigModal } from "./NfseConfigModal";

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
  const [isPrestadorConfigOpen, setIsPrestadorConfigOpen] = useState(false);

  // Form State - Tomador (Cliente)
  const [tomadorCpfCnpj, setTomadorCpfCnpj] = useState("");
  const [tomadorRazaoSocial, setTomadorRazaoSocial] = useState("");
  const [tomadorEmail, setTomadorEmail] = useState("");
  const [tomadorInscricaoMunicipal, setTomadorInscricaoMunicipal] = useState("");

  // Form State - Serviço & Tributos
  const [discriminacao, setDiscriminacao] = useState("");
  const [lc116Code, setLc116Code] = useState("01.07");
  const [aliquotaIss, setAliquotaIss] = useState(0); // 0 para MEI por padrão
  const [issRetido, setIssRetido] = useState(false);
  const [environment, setEnvironment] = useState("SIMULADOR");

  useEffect(() => {
    if (isOpen) {
      setTomadorCpfCnpj(receivable.user?.contractNumber || "");
      setTomadorRazaoSocial(clientCompany || clientName || receivable.user?.company || "");
      setTomadorEmail(receivable.user?.email || "");
      setTomadorInscricaoMunicipal("");

      setDiscriminacao(
        `Serviços de consultoria, suporte técnico contínuo e manutenção de software. Competência ${receivable.competence} — ${receivable.contractTitle || "Contrato Mensal"}`
      );
      loadConfig();
    }
  }, [isOpen, receivable, clientCompany, clientName]);

  async function loadConfig() {
    try {
      const res = await getNfseConfigAction();
      if (res.success && res.data) {
        setAliquotaIss(res.data.prestadorAliquotaIss ?? 0);
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
        tomadorCpfCnpj: tomadorCpfCnpj.trim(),
        tomadorRazaoSocial: tomadorRazaoSocial.trim(),
        tomadorEmail: tomadorEmail.trim(),
        tomadorInscricaoMunicipal: tomadorInscricaoMunicipal.trim() || undefined,
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
            <button
              type="button"
              onClick={() => setIsPrestadorConfigOpen(true)}
              className="flex items-center space-x-1 text-[11px] text-blue-300 hover:text-blue-200 bg-blue-950/80 hover:bg-blue-900/80 px-2.5 py-1 rounded-lg border border-blue-800/80 transition"
              title="Configurações fiscais da sua empresa (Prestador)"
            >
              <Settings2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Meus Dados (Prestador)</span>
            </button>
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
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start space-x-3 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Seção Tomador (Dados Fiscais do Cliente) */}
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs font-semibold text-slate-200 flex items-center">
                  <Building2 className="w-4 h-4 mr-1.5 text-blue-400" />
                  Dados do Tomador (Seu Cliente)
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  Competência: <strong className="text-blue-400">{receivable.competence}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    CPF ou CNPJ do Cliente
                  </label>
                  <input
                    type="text"
                    value={tomadorCpfCnpj}
                    onChange={(e) => setTomadorCpfCnpj(e.target.value)}
                    placeholder="00.000.000/0001-00 ou CPF"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Razão Social / Nome do Cliente
                  </label>
                  <input
                    type="text"
                    value={tomadorRazaoSocial}
                    onChange={(e) => setTomadorRazaoSocial(e.target.value)}
                    placeholder="Razão Social ou Nome Completo"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    E-mail do Cliente
                  </label>
                  <input
                    type="email"
                    value={tomadorEmail}
                    onChange={(e) => setTomadorEmail(e.target.value)}
                    placeholder="financeiro@empresa.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Inscrição Municipal (Opcional)
                  </label>
                  <input
                    type="text"
                    value={tomadorInscricaoMunicipal}
                    onChange={(e) => setTomadorInscricaoMunicipal(e.target.value)}
                    placeholder="Inscrição Municipal"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="text-[10px] text-slate-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800 flex items-center gap-1.5">
                <span className="text-blue-400 font-bold">💡 Dica:</span>
                <span>O CPF/CNPJ e dados do cliente informados aqui são salvos automaticamente no cadastro para as próximas notas.</span>
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
                    min="0"
                    max="5.0"
                    value={aliquotaIss}
                    onChange={(e) => setAliquotaIss(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3 pr-8 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                  <Percent className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-2.5" />
                </div>
                {aliquotaIss === 0 && (
                  <span className="text-[10px] text-emerald-400 block mt-1">
                    ✓ Alíquota 0% para MEI / Isenção
                  </span>
                )}
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

      {/* Prestador Config Modal inside Emission */}
      <NfseConfigModal
        isOpen={isPrestadorConfigOpen}
        onClose={() => setIsPrestadorConfigOpen(false)}
        onSuccess={loadConfig}
      />
    </div>
  );
}
