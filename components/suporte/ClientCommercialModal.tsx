"use client";

import { useEffect, useState, useTransition } from "react";
import {
  X,
  FileText,
  Receipt,
  Briefcase,
  DollarSign,
  TrendingUp,
  PlusCircle,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Edit2,
  Trash2,
  Loader2,
  ShieldAlert,
  Building,
  Mail,
  Zap,
} from "lucide-react";
import {
  ClientCommercialOverviewData,
  getClientCommercialOverviewAction,
  updateReceivableStatusAction,
  deleteContractAction,
  deleteReceivableAction,
  deleteProposalAction,
  updateProposalStatusAction,
  generateMonthlyReceivableFromContractAction,
} from "@/lib/actions/commercial-actions";
import { ContractStatus, ReceivableStatus, ProposalStatus } from "@prisma/client";
import { CreateContractModal } from "./CreateContractModal";
import { CreateReceivableModal } from "./CreateReceivableModal";
import { CreateProposalModal } from "./CreateProposalModal";

interface ClientCommercialModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string | null;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
}

type TabType = "contratos" | "recebiveis" | "propostas";

export function ClientCommercialModal({
  isOpen,
  onClose,
  clientId,
  clientName,
  clientCompany,
  clientEmail,
}: ClientCommercialModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("contratos");
  const [data, setData] = useState<ClientCommercialOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Modais de Criação / Edição
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<any | null>(null);
  const [isReceivableModalOpen, setIsReceivableModalOpen] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);

  // Geração rápida de competência
  const now = new Date();
  const currentCompetence = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [generatingCompetence, setGeneratingCompetence] = useState(false);

  const loadData = async () => {
    if (!clientId) return;
    setLoading(true);
    try {
      const res = await getClientCommercialOverviewAction(clientId);
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Erro ao carregar dados comerciais:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && clientId) {
      loadData();
    } else {
      setData(null);
    }
  }, [isOpen, clientId]);

  if (!isOpen || !clientId) return null;

  // Ações Rápidas
  const handleMarkPaid = async (receivableId: string) => {
    startTransition(async () => {
      await updateReceivableStatusAction({
        id: receivableId,
        status: "PAGO",
        paidDate: new Date().toISOString(),
      });
      loadData();
    });
  };

  const handleDeleteContract = async (contractId: string) => {
    if (!confirm("Tem certeza que deseja excluir este contrato?")) return;
    startTransition(async () => {
      await deleteContractAction(contractId);
      loadData();
    });
  };

  const handleDeleteReceivable = async (receivableId: string) => {
    if (!confirm("Tem certeza que deseja excluir este recebível?")) return;
    startTransition(async () => {
      await deleteReceivableAction(receivableId);
      loadData();
    });
  };

  const handleDeleteProposal = async (proposalId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta proposta comercial?")) return;
    startTransition(async () => {
      await deleteProposalAction(proposalId);
      loadData();
    });
  };

  const handleProposalStatusChange = async (proposalId: string, newStatus: ProposalStatus) => {
    startTransition(async () => {
      await updateProposalStatusAction({
        id: proposalId,
        status: newStatus,
      });
      loadData();
    });
  };

  const handleGenerateMonthlyInvoice = async (contractId: string) => {
    setGeneratingCompetence(true);
    try {
      const res = await generateMonthlyReceivableFromContractAction({
        contractId,
        competence: currentCompetence,
      });
      if (!res.success) {
        alert(res.error || "Falha ao gerar cobrança.");
      } else {
        loadData();
        setActiveTab("recebiveis");
      }
    } finally {
      setGeneratingCompetence(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val || 0);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fadeIn">
        <div className="w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl bg-white border border-gray-200 shadow-2xl overflow-hidden animate-scaleUp">
          {/* Header da Modal */}
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0d6efd] flex items-center justify-center border border-blue-200 shadow-xs">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                    {clientCompany || clientName}
                  </h2>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#0d6efd] border border-blue-200">
                    VISÃO COMERCIAL 360°
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-gray-400" />
                    {clientName}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    {clientEmail}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin text-[#0d6efd] mb-2" />
                <p className="text-xs font-medium">Carregando dados financeiros e contratos...</p>
              </div>
            ) : data ? (
              <>
                {/* Cards de Resumo Financeiro (KPIs) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                  {/* Card MRR */}
                  <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/80 shadow-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between text-blue-700 text-xs font-semibold uppercase tracking-wider mb-1">
                      <span>MRR Contratual</span>
                      <TrendingUp className="w-4 h-4 text-[#0d6efd]" />
                    </div>
                    <div className="text-2xl font-black text-[#0d6efd]">
                      {formatCurrency(data.summary.activeMrr)}
                    </div>
                    <div className="text-[11px] text-blue-600/80 mt-1">
                      {data.contracts.filter((c) => c.status === "ATIVO").length} contrato(s) ativo(s)
                    </div>
                  </div>

                  {/* Card Total Recebido */}
                  <div className="p-4 rounded-xl bg-green-50/50 border border-green-200/80 shadow-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between text-green-700 text-xs font-semibold uppercase tracking-wider mb-1">
                      <span>Total Liquidado</span>
                      <CheckCircle2 className="w-4 h-4 text-[#198754]" />
                    </div>
                    <div className="text-2xl font-black text-[#198754]">
                      {formatCurrency(data.summary.totalPaid)}
                    </div>
                    <div className="text-[11px] text-green-600/80 mt-1">
                      {data.receivables.filter((r) => r.status === "PAGO").length} fatura(s) paga(s)
                    </div>
                  </div>

                  {/* Card Pendente */}
                  <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 shadow-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between text-amber-700 text-xs font-semibold uppercase tracking-wider mb-1">
                      <span>A Receber / Aberto</span>
                      <Clock className="w-4 h-4 text-[#ffc107]" />
                    </div>
                    <div className="text-2xl font-black text-amber-600">
                      {formatCurrency(data.summary.totalPending)}
                    </div>
                    <div className="text-[11px] text-amber-700/80 mt-1">
                      {data.receivables.filter((r) => r.status === "PENDENTE").length} fatura(s) pendente(s)
                    </div>
                  </div>

                  {/* Card Atrasado ou Propostas */}
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 shadow-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1">
                      <span>Propostas em Aberto</span>
                      <Briefcase className="w-4 h-4 text-[#0dcaf0]" />
                    </div>
                    <div className="text-2xl font-black text-gray-900">
                      {data.summary.activeProposalsCount}
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1">
                      de {data.summary.proposalsCount} proposta(s) totais
                    </div>
                  </div>
                </div>

                {/* Navegação por Abas */}
                <div className="flex items-center justify-between border-b border-gray-200 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab("contratos")}
                      className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                        activeTab === "contratos"
                          ? "border-[#0d6efd] text-[#0d6efd]"
                          : "border-transparent text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Contratos & MRR</span>
                      <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-gray-100 text-gray-700 font-bold">
                        {data.contracts.length}
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveTab("recebiveis")}
                      className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                        activeTab === "recebiveis"
                          ? "border-[#198754] text-[#198754]"
                          : "border-transparent text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Recebíveis & Faturas</span>
                      <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-gray-100 text-gray-700 font-bold">
                        {data.receivables.length}
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveTab("propostas")}
                      className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                        activeTab === "propostas"
                          ? "border-[#0dcaf0] text-[#0aa2c0]"
                          : "border-transparent text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Propostas Comerciais</span>
                      <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-gray-100 text-gray-700 font-bold">
                        {data.proposals.length}
                      </span>
                    </button>
                  </div>

                  {/* Botões de Ação Rápida por Aba */}
                  <div>
                    {activeTab === "contratos" && (
                      <button
                        onClick={() => {
                          setEditingContract(null);
                          setIsContractModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-xs font-semibold shadow-sm transition-all"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Novo Contrato</span>
                      </button>
                    )}

                    {activeTab === "recebiveis" && (
                      <button
                        onClick={() => setIsReceivableModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#198754] hover:bg-[#157347] text-white text-xs font-semibold shadow-sm transition-all"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Nova Fatura / Recebível</span>
                      </button>
                    )}

                    {activeTab === "propostas" && (
                      <button
                        onClick={() => setIsProposalModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-xs font-semibold shadow-sm transition-all"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Nova Proposta</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Conteúdo da Aba Contratos */}
                {activeTab === "contratos" && (
                  <div className="space-y-4">
                    {data.contracts.length === 0 ? (
                      <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs font-semibold text-gray-800">
                          Nenhum contrato cadastrado para este cliente.
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1">
                          Cadastre um contrato para começar a rastrear o valor mensal recorrente (MRR).
                        </p>
                        <button
                          onClick={() => {
                            setEditingContract(null);
                            setIsContractModalOpen(true);
                          }}
                          className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0d6efd] text-white text-xs font-semibold"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Cadastrar Primeiro Contrato</span>
                        </button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto border border-gray-200 rounded-xl">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase tracking-wider font-semibold">
                            <tr>
                              <th className="py-2.5 px-3">Título / Código</th>
                              <th className="py-2.5 px-3">Valor Mensal (MRR)</th>
                              <th className="py-2.5 px-3">Dia Venc.</th>
                              <th className="py-2.5 px-3">Início / Término</th>
                              <th className="py-2.5 px-3">Status</th>
                              <th className="py-2.5 px-3 text-right">Ações</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 bg-white">
                            {data.contracts.map((c) => (
                              <tr key={c.id} className="hover:bg-gray-50/80 transition-colors">
                                <td className="py-2.5 px-3">
                                  <div className="font-bold text-gray-900">{c.title}</div>
                                  <div className="text-[11px] text-gray-500 font-mono">
                                    {c.contractNumber || "Sem código"}
                                  </div>
                                </td>
                                <td className="py-2.5 px-3 font-bold text-[#0d6efd] text-sm">
                                  {formatCurrency(c.monthlyValue)}
                                  <span className="text-[10px] text-gray-500 font-normal ml-1">/mês</span>
                                </td>
                                <td className="py-2.5 px-3 text-gray-700 font-medium">
                                  Dia {c.billingDay}
                                </td>
                                <td className="py-2.5 px-3 text-[11px] text-gray-600">
                                  {new Date(c.startDate).toLocaleDateString("pt-BR")}
                                  {c.endDate && ` até ${new Date(c.endDate).toLocaleDateString("pt-BR")}`}
                                </td>
                                <td className="py-2.5 px-3">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                      c.status === "ATIVO"
                                        ? "bg-green-50 text-[#198754] border-green-200"
                                        : c.status === "SUSPENSO"
                                        ? "bg-amber-50 text-[#ffc107] border-amber-200"
                                        : "bg-gray-100 text-gray-600 border-gray-200"
                                    }`}
                                  >
                                    {c.status}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    {c.status === "ATIVO" && (
                                      <button
                                        onClick={() => handleGenerateMonthlyInvoice(c.id)}
                                        disabled={generatingCompetence}
                                        title={`Gerar mensalidade da competência ${currentCompetence}`}
                                        className="p-1.5 rounded-lg bg-green-50 text-[#198754] hover:bg-green-100 border border-green-200 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                                      >
                                        <Zap className="w-3 h-3" />
                                        <span>Gerar Fatura</span>
                                      </button>
                                    )}

                                    <button
                                      onClick={() => {
                                        setEditingContract(c);
                                        setIsContractModalOpen(true);
                                      }}
                                      className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                                      title="Editar contrato"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>

                                    <button
                                      onClick={() => handleDeleteContract(c.id)}
                                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#dc3545] hover:bg-red-50"
                                      title="Excluir contrato"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Conteúdo da Aba Recebíveis */}
                {activeTab === "recebiveis" && (
                  <div className="space-y-4">
                    {data.receivables.length === 0 ? (
                      <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <Receipt className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs font-semibold text-gray-800">
                          Nenhum recebível registrado para este cliente.
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1">
                          Gere mensalidades a partir dos contratos ou crie cobranças pontuais.
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto border border-gray-200 rounded-xl">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase tracking-wider font-semibold">
                            <tr>
                              <th className="py-2.5 px-3">Competência</th>
                              <th className="py-2.5 px-3">Descrição / Contrato</th>
                              <th className="py-2.5 px-3">Valor</th>
                              <th className="py-2.5 px-3">Vencimento</th>
                              <th className="py-2.5 px-3">Forma</th>
                              <th className="py-2.5 px-3">Status</th>
                              <th className="py-2.5 px-3 text-right">Ação</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 bg-white">
                            {data.receivables.map((r) => (
                              <tr key={r.id} className="hover:bg-gray-50/80 transition-colors">
                                <td className="py-2.5 px-3 font-mono font-bold text-gray-900">
                                  {r.competence}
                                </td>
                                <td className="py-2.5 px-3">
                                  <div className="font-semibold text-gray-900">{r.description}</div>
                                  {r.contractTitle && (
                                    <div className="text-[10px] text-gray-500">
                                      Vínculo: {r.contractTitle}
                                    </div>
                                  )}
                                </td>
                                <td className="py-2.5 px-3 font-bold text-gray-900 text-sm">
                                  {formatCurrency(r.amount)}
                                </td>
                                <td className="py-2.5 px-3 text-[11px] text-gray-700">
                                  {new Date(r.dueDate).toLocaleDateString("pt-BR")}
                                </td>
                                <td className="py-2.5 px-3">
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700">
                                    {r.paymentMethod}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                      r.status === "PAGO"
                                        ? "bg-green-50 text-[#198754] border-green-200"
                                        : r.status === "ATRASADO" || r.isOverdue
                                        ? "bg-red-50 text-[#dc3545] border-red-200"
                                        : "bg-amber-50 text-amber-700 border-amber-200"
                                    }`}
                                  >
                                    {r.status === "PAGO"
                                      ? "PAGO"
                                      : r.status === "ATRASADO" || r.isOverdue
                                      ? "ATRASADO"
                                      : "PENDENTE"}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    {r.status !== "PAGO" && (
                                      <button
                                        onClick={() => handleMarkPaid(r.id)}
                                        disabled={isPending}
                                        className="px-2.5 py-1 rounded-lg bg-[#198754] hover:bg-[#157347] text-white text-[11px] font-semibold flex items-center gap-1 shadow-xs transition-all disabled:opacity-50"
                                      >
                                        <CheckCircle2 className="w-3 h-3" />
                                        <span>Dar Baixa</span>
                                      </button>
                                    )}

                                    <button
                                      onClick={() => handleDeleteReceivable(r.id)}
                                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#dc3545] hover:bg-red-50"
                                      title="Remover fatura"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Conteúdo da Aba Propostas Comerciais */}
                {activeTab === "propostas" && (
                  <div className="space-y-4">
                    {data.proposals.length === 0 ? (
                      <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <Briefcase className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs font-semibold text-gray-800">
                          Nenhuma proposta comercial cadastrada.
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1">
                          Cadastre propostas e orçamentos para manter histórico de negociações.
                        </p>
                        <button
                          onClick={() => setIsProposalModalOpen(true)}
                          className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0d6efd] text-white text-xs font-semibold"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Criar Primeira Proposta</span>
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.proposals.map((p) => (
                          <div
                            key={p.id}
                            className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div>
                                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-[#0d6efd] border border-blue-200">
                                    {p.proposalNumber}
                                  </span>
                                  <h4 className="text-sm font-bold text-gray-900 mt-1.5">
                                    {p.title}
                                  </h4>
                                </div>
                                <select
                                  value={p.status}
                                  onChange={(e) =>
                                    handleProposalStatusChange(p.id, e.target.value as ProposalStatus)
                                  }
                                  className="text-[11px] font-bold px-2 py-1 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 focus:ring-1 focus:ring-[#0d6efd]"
                                >
                                  <option value="ENVIADA">ENVIADA</option>
                                  <option value="EM_NEGOCIACAO">EM NEGOCIAÇÃO</option>
                                  <option value="APROVADA">APROVADA</option>
                                  <option value="RASCUNHO">RASCUNHO</option>
                                  <option value="RECUSADA">RECUSADA</option>
                                  <option value="EXPIRADA">EXPIRADA</option>
                                </select>
                              </div>

                              <p className="text-xs text-gray-600 line-clamp-3 mb-3 leading-relaxed">
                                {p.scopeDescription}
                              </p>

                              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-gray-50 border border-gray-100 text-xs mb-3">
                                <div>
                                  <span className="text-[10px] text-gray-500 block">Setup / Pontual:</span>
                                  <strong className="text-gray-900">
                                    {p.oneOffValue > 0 ? formatCurrency(p.oneOffValue) : "Isento"}
                                  </strong>
                                </div>
                                <div>
                                  <span className="text-[10px] text-gray-500 block">Recorrente Proposto:</span>
                                  <strong className="text-[#0d6efd]">
                                    {p.monthlyValue > 0 ? `${formatCurrency(p.monthlyValue)}/mês` : "N/A"}
                                  </strong>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px] text-gray-500">
                              <span>
                                Enviada em: {new Date(p.sentDate).toLocaleDateString("pt-BR")}
                              </span>
                              <div className="flex items-center gap-2">
                                {p.documentUrl && (
                                  <a
                                    href={p.documentUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#0d6efd] hover:underline flex items-center gap-1 font-semibold"
                                  >
                                    <span>Ver PDF</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                                <button
                                  onClick={() => handleDeleteProposal(p.id)}
                                  className="text-gray-400 hover:text-[#dc3545]"
                                  title="Remover proposta"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* Submodais */}
      {isContractModalOpen && (
        <CreateContractModal
          isOpen={isContractModalOpen}
          onClose={() => {
            setIsContractModalOpen(false);
            setEditingContract(null);
          }}
          onSuccess={loadData}
          userId={clientId}
          clientName={clientCompany || clientName}
          initialData={editingContract}
        />
      )}

      {isReceivableModalOpen && (
        <CreateReceivableModal
          isOpen={isReceivableModalOpen}
          onClose={() => setIsReceivableModalOpen(false)}
          onSuccess={loadData}
          userId={clientId}
          clientName={clientCompany || clientName}
          contracts={
            data?.contracts.map((c) => ({
              id: c.id,
              title: c.title,
              monthlyValue: c.monthlyValue,
            })) || []
          }
        />
      )}

      {isProposalModalOpen && (
        <CreateProposalModal
          isOpen={isProposalModalOpen}
          onClose={() => setIsProposalModalOpen(false)}
          onSuccess={loadData}
          userId={clientId}
          clientName={clientCompany || clientName}
        />
      )}
    </>
  );
}
