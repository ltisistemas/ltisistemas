"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Settings2,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Building2,
  Percent,
  FileCode,
  ShieldCheck,
} from "lucide-react";
import { getNfseConfigAction, saveNfseConfigAction } from "@/lib/actions/nfse-actions";
import { LC116_SERVICE_CATALOG } from "@/lib/services/nfse/tax-calculator";
import { NfseConfig } from "@prisma/client";

interface NfseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function NfseConfigModal({
  isOpen,
  onClose,
  onSuccess,
}: NfseConfigModalProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Prestador Fiscal Data State
  const [environment, setEnvironment] = useState<"SIMULADOR" | "PRODUCAO_RESTRITA" | "PRODUCAO">("SIMULADOR");
  const [prestadorCnpj, setPrestadorCnpj] = useState("");
  const [prestadorRazaoSocial, setPrestadorRazaoSocial] = useState("");
  const [prestadorNomeFantasia, setPrestadorNomeFantasia] = useState("");
  const [prestadorInscricaoMunicipal, setPrestadorInscricaoMunicipal] = useState("");
  const [prestadorCodigoMunicipio, setPrestadorCodigoMunicipio] = useState("2611606");
  const [prestadorOptanteSimples, setPrestadorOptanteSimples] = useState(true);
  const [prestadorAliquotaIss, setPrestadorAliquotaIss] = useState(0); // 0 para MEI
  const [isMei, setIsMei] = useState(true);
  const [codigoServicoLc116, setCodigoServicoLc116] = useState("01.07");
  const [cnae, setCnae] = useState("6202000");

  useEffect(() => {
    if (isOpen) {
      loadConfig();
    }
  }, [isOpen]);

  async function loadConfig() {
    setLoading(true);
    setError(null);
    try {
      const res = await getNfseConfigAction();
      if (res.success && res.data) {
        const c = res.data;
        setEnvironment(c.environment);
        setPrestadorCnpj(c.prestadorCnpj || "");
        setPrestadorRazaoSocial(c.prestadorRazaoSocial || "");
        setPrestadorNomeFantasia(c.prestadorNomeFantasia || "");
        setPrestadorInscricaoMunicipal(c.prestadorInscricaoMunicipal || "");
        setPrestadorCodigoMunicipio(c.prestadorCodigoMunicipio || "2611606");
        setPrestadorOptanteSimples(c.prestadorOptanteSimples ?? true);
        setPrestadorAliquotaIss(c.prestadorAliquotaIss ?? 0);
        setIsMei(c.prestadorAliquotaIss === 0);
        setCodigoServicoLc116(c.codigoServicoLc116 || "01.07");
        setCnae(c.cnae || "6202000");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao carregar configurações fiscais.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await saveNfseConfigAction({
        environment,
        prestadorCnpj,
        prestadorRazaoSocial,
        prestadorNomeFantasia,
        prestadorInscricaoMunicipal,
        prestadorCodigoMunicipio,
        prestadorOptanteSimples,
        prestadorAliquotaIss: isMei ? 0 : Number(prestadorAliquotaIss),
        codigoServicoLc116,
        cnae,
      });

      if (!res.success) {
        setError(res.error || "Falha ao salvar configurações.");
      } else {
        setSuccessMsg("Dados fiscais do prestador salvos com sucesso!");
        if (onSuccess) onSuccess();
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      setError(err.message || "Erro inesperado.");
    } finally {
      setSaving(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
              <Settings2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-slate-100">
                Configurações Fiscais da NFS-e (Dados do Prestador)
              </h3>
              <p className="text-xs text-slate-400">
                Informe o seu CNPJ, Inscrição Municipal e enquadramento tributário (MEI / Simples)
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

        {/* Body */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
            <p className="text-sm">Carregando configurações fiscais...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start space-x-3 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start space-x-3 text-emerald-300 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Ambiente & Enquadramento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Ambiente de Emissão
                </label>
                <select
                  value={environment}
                  onChange={(e) => setEnvironment(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="SIMULADOR">Simulador Sandbox (Testes Rápidos Locais)</option>
                  <option value="PRODUCAO_RESTRITA">Homologação / Produção Restrita Gov.br</option>
                  <option value="PRODUCAO">Produção Oficial Nacional Gov.br</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Enquadramento Fiscal
                </label>
                <div className="flex items-center space-x-4 pt-2">
                  <label className="flex items-center space-x-2 text-xs text-slate-200 cursor-pointer">
                    <input
                      type="radio"
                      name="tipoEmpresa"
                      checked={isMei}
                      onChange={() => {
                        setIsMei(true);
                        setPrestadorAliquotaIss(0);
                      }}
                      className="text-blue-600 bg-slate-950 border-slate-700 focus:ring-0"
                    />
                    <span className="font-semibold text-emerald-400">MEI (Alíquota 0%)</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs text-slate-200 cursor-pointer">
                    <input
                      type="radio"
                      name="tipoEmpresa"
                      checked={!isMei}
                      onChange={() => {
                        setIsMei(false);
                        if (prestadorAliquotaIss === 0) setPrestadorAliquotaIss(2.0);
                      }}
                      className="text-blue-600 bg-slate-950 border-slate-700 focus:ring-0"
                    />
                    <span>Simples Nacional / ME (2% a 5%)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* CNPJ e Razão Social */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Seu CNPJ do Prestador (MEI ou Empresa)
                </label>
                <input
                  type="text"
                  value={prestadorCnpj}
                  onChange={(e) => setPrestadorCnpj(e.target.value)}
                  placeholder="00.000.000/0001-00"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Razão Social / Nome Empresarial
                </label>
                <input
                  type="text"
                  value={prestadorRazaoSocial}
                  onChange={(e) => setPrestadorRazaoSocial(e.target.value)}
                  placeholder="Nome Completo ou Razão Social MEI"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Nome Fantasia e Inscrição Municipal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Nome Fantasia (Opcional)
                </label>
                <input
                  type="text"
                  value={prestadorNomeFantasia}
                  onChange={(e) => setPrestadorNomeFantasia(e.target.value)}
                  placeholder="LTI Sistemas"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Inscrição Municipal (CCM)
                </label>
                <input
                  type="text"
                  value={prestadorInscricaoMunicipal}
                  onChange={(e) => setPrestadorInscricaoMunicipal(e.target.value)}
                  placeholder="Ex: 123456"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Código IBGE do Município
                </label>
                <input
                  type="text"
                  value={prestadorCodigoMunicipio}
                  onChange={(e) => setPrestadorCodigoMunicipio(e.target.value)}
                  placeholder="Ex: 2611606 (Recife)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                  required
                />
              </div>
            </div>

            {/* Alíquota de ISS e Código LC 116 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Item Padrão LC 116/03
                </label>
                <select
                  value={codigoServicoLc116}
                  onChange={(e) => setCodigoServicoLc116(e.target.value)}
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
                  Alíquota de ISS Padrão (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5.0"
                    value={isMei ? 0 : prestadorAliquotaIss}
                    disabled={isMei}
                    onChange={(e) => setPrestadorAliquotaIss(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3 pr-8 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 disabled:opacity-60"
                  />
                  <Percent className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-2.5" />
                </div>
                {isMei && (
                  <span className="text-[10px] text-emerald-400 block mt-1">
                    ✓ MEI: Isento de ISS por nota (0%). O imposto é fixo no DAS mensal.
                  </span>
                )}
              </div>
            </div>

            {/* CNAE */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                CNAE Principal
              </label>
              <input
                type="text"
                value={cnae}
                onChange={(e) => setCnae(e.target.value)}
                placeholder="6202000 (Desenvolvimento e suporte de TI)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg transition disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 mr-2" />
                    Salvar Dados Fiscais
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
