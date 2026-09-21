"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  FileBarChart,
  Calendar,
  Building,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Copy,
  Printer,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Check,
  ExternalLink,
} from "lucide-react";
import { SessionPayload } from "@/lib/auth/session";
import { SupportHeader } from "./SupportHeader";
import { StatusBadge } from "./StatusBadge";
import {
  ClientReportData,
  getClientReportAction,
} from "@/lib/actions/report-actions";

export interface ClientItem {
  id: string;
  name: string;
  company: string;
  email: string;
}

interface ClientReportViewProps {
  user: SessionPayload;
  clients: ClientItem[];
  initialReportData: ClientReportData | null;
  initialClientId?: string;
  initialStartDate: string;
  initialEndDate: string;
}

type PeriodPreset = "current_month" | "last_month" | "last_90_days" | "custom";

export function ClientReportView({
  user,
  clients,
  initialReportData,
  initialClientId = "ALL",
  initialStartDate,
  initialEndDate,
}: ClientReportViewProps) {
  const isSupport = user.role === "SUPORTE";

  const [clientId, setClientId] = useState<string>(
    isSupport ? initialClientId : user.userId
  );
  const [startDate, setStartDate] = useState<string>(initialStartDate);
  const [endDate, setEndDate] = useState<string>(initialEndDate);
  const [preset, setPreset] = useState<PeriodPreset>("current_month");

  const [reportData, setReportData] = useState<ClientReportData | null>(
    initialReportData
  );
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  // Helper para calcular datas dos presets
  const applyPreset = (type: PeriodPreset) => {
    setPreset(type);
    const now = new Date();

    if (type === "current_month") {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const s = firstDay.toISOString().split("T")[0];
      const e = lastDay.toISOString().split("T")[0];
      setStartDate(s);
      setEndDate(e);
      fetchReport(clientId, s, e);
    } else if (type === "last_month") {
      const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
      const s = firstDay.toISOString().split("T")[0];
      const e = lastDay.toISOString().split("T")[0];
      setStartDate(s);
      setEndDate(e);
      fetchReport(clientId, s, e);
    } else if (type === "last_90_days") {
      const past90 = new Date();
      past90.setDate(past90.getDate() - 90);
      const s = past90.toISOString().split("T")[0];
      const e = now.toISOString().split("T")[0];
      setStartDate(s);
      setEndDate(e);
      fetchReport(clientId, s, e);
    }
  };

  const fetchReport = (targetClient: string, sDate: string, eDate: string) => {
    startTransition(async () => {
      const res = await getClientReportAction({
        clientId: targetClient === "ALL" ? undefined : targetClient,
        startDate: sDate,
        endDate: eDate,
      });

      if (res.success && res.data) {
        setReportData(res.data);
      }
    });
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReport(clientId, startDate, endDate);
  };

  const handleClientChange = (newClientId: string) => {
    setClientId(newClientId);
    fetchReport(newClientId, startDate, endDate);
  };

  const handleCopyText = async () => {
    if (!reportData?.executiveCopy.fullFormattedText) return;
    try {
      await navigator.clipboard.writeText(
        reportData.executiveCopy.fullFormattedText
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Falha ao copiar:", err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 pb-16">
      {/* Header do Suporte */}
      <div className="print:hidden">
        <SupportHeader user={user} activeTab="relatorios" />
      </div>

      {/* Cabeçalho exclusivo para Impressão / PDF */}
      <div className="hidden print:block p-6 mb-6 border-b-2 border-gray-900 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              LTI Sistemas — Central de Suporte & Telemetria
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Relatório Executivo de Desempenho e Sustentação Técnica
            </p>
          </div>
          <div className="text-right text-xs text-gray-500">
            <p className="font-semibold text-gray-900">
              {reportData?.client?.company || user.company}
            </p>
            <p>Período: {reportData?.period.formattedRange}</p>
            <p>Emissão: {new Date().toLocaleDateString("pt-BR")}</p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Barra Superior de Ações & Título */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-blue-50 text-[#0d6efd] border border-blue-200">
                <FileBarChart className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Relatório de Atendimento & Telemetria
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Consolidação de SLAs, diagnóstico de estabilidade e parecer técnico executivo para clientes.
            </p>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              type="button"
              onClick={handleCopyText}
              disabled={!reportData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Texto Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-white" />
                  <span>Copiar Texto Executivo</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              disabled={!reportData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              <Printer className="w-4 h-4 text-gray-600" />
              <span>Imprimir / PDF</span>
            </button>
          </div>
        </div>

        {/* Feedback visual de cópia */}
        {copied && (
          <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200 text-xs font-medium text-[#198754] flex items-center justify-between animate-fadeIn print:hidden">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#198754]" />
              <span>
                Texto executivo copiado para a área de transferência! Pronto para envio por e-mail ou WhatsApp aos gestores.
              </span>
            </div>
          </div>
        )}

        {/* Painel de Filtros (Oculto em Print) */}
        <div className="mt-6 p-4 rounded-xl bg-white border border-gray-200 shadow-sm print:hidden">
          <form
            onSubmit={handleFilterSubmit}
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-4"
          >
            {/* Seleção de Cliente e Presets */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
              {isSupport ? (
                <div className="w-full sm:w-64">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Cliente / Empresa
                  </label>
                  <select
                    value={clientId}
                    onChange={(e) => handleClientChange(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0d6efd]"
                  >
                    <option value="ALL">Todos os Clientes (Visão Geral)</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company || c.name} ({c.name})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="w-full sm:w-64">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Sua Empresa
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span>{user.company}</span>
                  </div>
                </div>
              )}

              {/* Atalhos Rápidos de Período */}
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Atalhos de Período
                </label>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => applyPreset("current_month")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      preset === "current_month"
                        ? "bg-[#0d6efd] text-white shadow-xs font-semibold"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    Mês Atual
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset("last_month")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      preset === "last_month"
                        ? "bg-[#0d6efd] text-white shadow-xs font-semibold"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    Mês Anterior
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset("last_90_days")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      preset === "last_90_days"
                        ? "bg-[#0d6efd] text-white shadow-xs font-semibold"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    Últimos 90 Dias
                  </button>
                </div>
              </div>
            </div>

            {/* Inputs de Data e Botão Filtrar */}
            <div className="flex items-center gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Início
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPreset("custom");
                  }}
                  className="px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0d6efd]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Fim
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPreset("custom");
                  }}
                  className="px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0d6efd]"
                />
              </div>

              <div className="self-end">
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50"
                >
                  {isPending ? "Calculando..." : "Filtrar"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Conteúdo do Relatório */}
        {reportData && (
          <div className="mt-6 space-y-6">
            {/* Cartões de Indicadores Executivos (KPIs) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Card 1: Total de Chamados */}
              <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">
                    Total Chamados
                  </span>
                  <Layers className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {reportData.metrics.totalTickets}
                  </span>
                  <span className="text-xs text-gray-500">no período</span>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-600">
                  <span>Solucionados:</span>
                  <strong className="text-[#198754]">
                    {reportData.metrics.closedTickets}
                  </strong>
                </div>
              </div>

              {/* Card 2: Taxa de Resolução */}
              <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">
                    Taxa de Resolução
                  </span>
                  <TrendingUp className="w-4 h-4 text-[#198754]" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#198754]">
                    {reportData.metrics.resolutionRate.toFixed(0)}%
                  </span>
                  <span className="text-xs text-gray-500">eficiência</span>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-600">
                  <span>Em andamento:</span>
                  <strong className="text-gray-900">
                    {reportData.metrics.openTickets +
                      reportData.metrics.pendingTickets}
                  </strong>
                </div>
              </div>

              {/* Card 3: SLA Cumprido */}
              <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">
                    Cumprimento SLA
                  </span>
                  <Clock className="w-4 h-4 text-[#0d6efd]" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#0d6efd]">
                    {reportData.metrics.slaComplianceRate.toFixed(0)}%
                  </span>
                  <span className="text-xs text-gray-500">no prazo</span>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-600">
                  <span>Meta contratual:</span>
                  <strong className="text-gray-900">6h úteis</strong>
                </div>
              </div>

              {/* Card 4: Ocorrências de Telemetria */}
              <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">
                    Telemetria & Erros
                  </span>
                  <Cpu className="w-4 h-4 text-[#ffc107]" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {reportData.metrics.totalOccurrences}
                  </span>
                  <span className="text-xs text-gray-500">capturados</span>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-600">
                  <span>Média / chamado:</span>
                  <strong className="text-gray-900">
                    {reportData.metrics.avgOccurrencesPerTicket}
                  </strong>
                </div>
              </div>
            </div>

            {/* Parecer Executivo / Copywriting do Relatório (Destaque Principal) */}
            <div className="p-6 rounded-xl bg-white border-2 border-blue-100 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-lg bg-blue-50 text-[#0d6efd]">
                    <Sparkles className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">
                      {reportData.executiveCopy.headline}
                    </h2>
                    <span className="text-xs text-gray-500">
                      Período de Apuração: {reportData.period.formattedRange}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyText}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0d6efd] border border-blue-200 text-xs font-semibold transition-all print:hidden"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? "Copiado!" : "Copiar Texto"}</span>
                </button>
              </div>

              <div className="mt-5 space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
                <p className="font-semibold text-gray-900">
                  {reportData.executiveCopy.greeting}
                </p>

                {/* 1. Síntese Executiva */}
                <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200/80">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#0d6efd]" />
                    1. Síntese Executiva & Nível de Serviço (SLA)
                  </h3>
                  <p>{reportData.executiveCopy.executiveSummary}</p>
                </div>

                {/* 2. Diagnóstico de Estabilidade */}
                <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200/80">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#198754]" />
                    2. Diagnóstico de Estabilidade Técnica
                  </h3>
                  <p>{reportData.executiveCopy.stabilityDiagnostic}</p>
                </div>

                {/* 3. Telemetria e Camadas */}
                <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200/80">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-[#ffc107]" />
                    3. Análise de Telemetria e Camadas Afetadas
                  </h3>
                  <p>{reportData.executiveCopy.telemetryInsights}</p>
                </div>

                {/* 4. Plano de Ação */}
                <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200/80">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <ArrowRight className="w-4 h-4 text-[#0dcaf0]" />
                    4. Recomendações e Próximos Passos
                  </h3>
                  <p>{reportData.executiveCopy.actionPlan}</p>
                </div>
              </div>
            </div>

            {/* Painel Duplo: Distribuição por Origem & Top Telas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Origens */}
              <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-xs">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-gray-500" />
                  Distribuição de Incidentes por Origem
                </h3>

                {reportData.originBreakdown.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">
                    Nenhum incidente registrado no período.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {reportData.originBreakdown.map((item) => (
                      <div key={item.origin} className="text-xs">
                        <div className="flex justify-between font-medium text-gray-700 mb-1">
                          <span>{item.label}</span>
                          <span className="font-semibold text-gray-900">
                            {item.count} chamados ({item.percentage.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-[#0d6efd] h-2 rounded-full transition-all"
                            style={{ width: `${Math.max(item.percentage, 4)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Top Módulos / Telas */}
              <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-xs">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-gray-500" />
                  Módulos e Telas mais Demandadas
                </h3>

                {reportData.topScreens.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">
                    Nenhum módulo demandou chamados no período.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {reportData.topScreens.map((screen) => (
                      <div key={screen.screenName} className="text-xs">
                        <div className="flex justify-between font-medium text-gray-700 mb-1">
                          <span className="truncate max-w-[200px]">
                            {screen.screenName}
                          </span>
                          <span className="font-semibold text-gray-900">
                            {screen.count} ({screen.percentage.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-[#198754] h-2 rounded-full transition-all"
                            style={{ width: `${Math.max(screen.percentage, 4)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tabela Detalhada de Chamados do Período */}
            <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Histórico de Chamados no Período
                  </h3>
                  <p className="text-xs text-gray-500">
                    Listagem dos registros que compõem os indicadores acima.
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                  {reportData.tickets.length} itens
                </span>
              </div>

              {reportData.tickets.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <CheckCircle2 className="w-8 h-8 text-[#198754] mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-800">
                    Nenhum chamado aberto neste período!
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Ambiente em 100% de conformidade técnica e operacional.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                        <th className="py-2.5 px-3">Código</th>
                        <th className="py-2.5 px-3">Título / Tela</th>
                        <th className="py-2.5 px-3">Origem</th>
                        <th className="py-2.5 px-3">Ocorrências</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">SLA</th>
                        <th className="py-2.5 px-3 text-right print:hidden">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {reportData.tickets.map((t) => (
                        <tr key={t.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-medium text-gray-900">
                            {t.code}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-semibold text-gray-900 truncate max-w-xs">
                              {t.title}
                            </div>
                            <div className="text-[11px] text-gray-500">
                              {t.screenName} •{" "}
                              {new Date(t.createdAt).toLocaleDateString("pt-BR")}
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700">
                              {t.origin}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-gray-800">
                            {t.occurrenceCount}
                          </td>
                          <td className="py-2.5 px-3">
                            <StatusBadge status={t.status} />
                          </td>
                          <td className="py-2.5 px-3">
                            {t.slaMet ? (
                              <span className="inline-flex items-center gap-1 text-[11px] text-[#198754] font-semibold">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>No Prazo</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] text-[#dc3545] font-semibold">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>Excedido</span>
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right print:hidden">
                            <Link
                              href={`/suporte/chamados/${t.id}`}
                              className="inline-flex items-center gap-1 text-[#0d6efd] hover:underline font-semibold text-[11px]"
                            >
                              <span>Ver</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
