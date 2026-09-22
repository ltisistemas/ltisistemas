"use client";

import { useState, useEffect, useTransition, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  User,
  Building,
  Mail,
  Phone,
  Globe,
  Calendar,
  DollarSign,
  Receipt,
  FileText,
  LifeBuoy,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Edit2,
  Trash2,
  Shield,
  KeyRound,
  Tag,
  FileSpreadsheet,
  Check,
  Copy,
  Zap,
  Layers,
  Sparkles,
} from "lucide-react";
import { SessionPayload } from "@/lib/auth/session";
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
import {
  getTicketsAction,
  TicketSummary,
  TicketStats,
} from "@/lib/actions/ticket-actions";
import {
  getClientApiKeysAction,
  createApiKeyAction,
  revokeApiKeyAction,
  updateClientProfileAction,
} from "@/lib/actions/auth-actions";
import { ContractStatus, ReceivableStatus, ProposalStatus } from "@prisma/client";
import { StatusBadge } from "./StatusBadge";
import { SlaBadge } from "./SlaBadge";
import { CreateContractModal } from "./CreateContractModal";
import { CreateReceivableModal } from "./CreateReceivableModal";
import { CreateProposalModal } from "./CreateProposalModal";
import { CreateTicketModal } from "./CreateTicketModal";
import { ResetPasswordModal } from "./ResetPasswordModal";
import { TicketSuccessModal } from "./TicketSuccessModal";

export type ClientTabType =
  | "visao-geral"
  | "contratos"
  | "financeiro"
  | "chamados"
  | "propostas"
  | "integracoes";

interface ClientOption {
  id: string;
  name: string;
  company: string;
  email: string;
  contractNumber: string | null;
  status?: string;
}

interface ClientHub360ViewProps {
  user: SessionPayload;
  initialClientId: string;
  allClients?: ClientOption[];
  onBackToList?: () => void;
  defaultTab?: ClientTabType;
}

export function ClientHub360View({
  user,
  initialClientId,
  allClients = [],
  onBackToList,
  defaultTab = "visao-geral",
}: ClientHub360ViewProps) {
  const router = useRouter();
  const [currentClientId, setCurrentClientId] = useState(initialClientId);
  const [activeTab, setActiveTab] = useState<ClientTabType>(defaultTab);

  const [loading, setLoading] = useState(true);
  const [commercialData, setCommercialData] = useState<ClientCommercialOverviewData | null>(null);
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [ticketStats, setTicketStats] = useState<TicketStats>({ total: 0, aberto: 0, pendente: 0, fechado: 0 });
  const [apiKeys, setApiKeys] = useState<Array<{ id: string; name: string; keyPrefix: string; lastUsedAt: Date | null; createdAt: Date }>>([]);

  const [, startTransition] = useTransition();
  const [notification, setNotification] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [newGeneratedKey, setNewGeneratedKey] = useState<string | null>(null);

  // Modals state
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<any | null>(null);
  const [isReceivableModalOpen, setIsReceivableModalOpen] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [successTicketData, setSuccessTicketData] = useState<{ id?: string; number?: number; code: string; title?: string } | null>(null);

  // Profile Edit State
  const [editName, setEditName] = useState("");
  const [editCompany, setEditCompany] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editSystemUrl, setEditSystemUrl] = useState("");
  const [editContractNumber, setEditContractNumber] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const isSupport = user.role === "SUPORTE";

  // Client pagination info
  const currentIndex = allClients.findIndex((c) => c.id === currentClientId);
  const totalClients = allClients.length;

  const loadAllClientData = async (cid: string) => {
    setLoading(true);
    setNotification(null);
    try {
      const [resCommercial, resTickets, resKeys] = await Promise.all([
        getClientCommercialOverviewAction(cid),
        getTicketsAction("ALL", cid),
        getClientApiKeysAction(cid),
      ]);

      if (resCommercial.success && resCommercial.data) {
        setCommercialData(resCommercial.data);
        setEditName(resCommercial.data.client.name);
        setEditCompany(resCommercial.data.client.company);
        setEditEmail(resCommercial.data.client.email);
        setEditSystemUrl(resCommercial.data.client.systemUrl || "");
        setEditContractNumber(resCommercial.data.client.contractNumber || "");
      } else {
        setNotification({ type: "error", message: resCommercial.error || "Erro ao carregar dados comerciais." });
      }

      if (resTickets.success && resTickets.data) {
        setTickets(resTickets.data.tickets);
        setTicketStats(resTickets.data.stats);
      }

      if (resKeys.success && resKeys.data) {
        setApiKeys(resKeys.data);
      }
    } catch (err: any) {
      console.error("Erro ao carregar dados do cliente:", err);
      setNotification({ type: "error", message: "Falha na conexão com o servidor." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllClientData(currentClientId);
  }, [currentClientId]);

  // Client Pager handlers
  const handlePrevClient = () => {
    if (currentIndex > 0) {
      const prevId = allClients[currentIndex - 1].id;
      setCurrentClientId(prevId);
    }
  };

  const handleNextClient = () => {
    if (currentIndex < totalClients - 1) {
      const nextId = allClients[currentIndex + 1].id;
      setCurrentClientId(nextId);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Actions
  const handleMarkPaid = async (receivableId: string) => {
    startTransition(async () => {
      const res = await updateReceivableStatusAction({
        id: receivableId,
        status: "PAGO",
        paidDate: new Date().toISOString(),
      });
      if (res.success) {
        setNotification({ type: "success", message: "Fatura marcada como paga com sucesso!" });
        loadAllClientData(currentClientId);
      } else {
        setNotification({ type: "error", message: res.error || "Erro ao atualizar fatura." });
      }
    });
  };

  const handleDeleteReceivable = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este recebível/fatura?")) return;
    startTransition(async () => {
      const res = await deleteReceivableAction(id);
      if (res.success) {
        setNotification({ type: "success", message: "Fatura excluída." });
        loadAllClientData(currentClientId);
      } else {
        setNotification({ type: "error", message: res.error || "Erro ao excluir fatura." });
      }
    });
  };

  const handleGenerateMonthlyInvoice = async (contractId: string) => {
    startTransition(async () => {
      const res = await generateMonthlyReceivableFromContractAction({ contractId });
      if (res.success) {
        setNotification({ type: "success", message: "Fatura mensal gerada com sucesso!" });
        loadAllClientData(currentClientId);
      } else {
        setNotification({ type: "error", message: res.error || "Erro ao gerar fatura mensal." });
      }
    });
  };

  const handleUpdateProposalStatus = async (proposalId: string, status: ProposalStatus) => {
    startTransition(async () => {
      const res = await updateProposalStatusAction({ id: proposalId, status });
      if (res.success) {
        setNotification({ type: "success", message: `Status da proposta atualizado para ${status}.` });
        loadAllClientData(currentClientId);
      } else {
        setNotification({ type: "error", message: res.error || "Erro ao atualizar proposta." });
      }
    });
  };

  const handleDeleteProposal = async (id: string) => {
    if (!confirm("Deseja realmente excluir esta proposta comercial?")) return;
    startTransition(async () => {
      const res = await deleteProposalAction(id);
      if (res.success) {
        setNotification({ type: "success", message: "Proposta excluída." });
        loadAllClientData(currentClientId);
      } else {
        setNotification({ type: "error", message: res.error || "Erro ao excluir proposta." });
      }
    });
  };

  const handleCreateApiKey = async () => {
    startTransition(async () => {
      const res = await createApiKeyAction(currentClientId, "Chave de Integração API");
      if (res.success && res.data) {
        setNewGeneratedKey(res.data.secretKey);
        setNotification({ type: "success", message: "Nova chave de API gerada com sucesso! Copie-a agora." });
        loadAllClientData(currentClientId);
      } else {
        setNotification({ type: "error", message: res.error || "Erro ao gerar chave de API." });
      }
    });
  };

  const handleRevokeApiKey = async (id: string) => {
    if (!confirm("Revogar esta chave bloqueará imediatamente qualquer envio automático por ela. Continuar?")) return;
    startTransition(async () => {
      const res = await revokeApiKeyAction(id);
      if (res.success) {
        setNotification({ type: "success", message: "Chave de API revogada." });
        loadAllClientData(currentClientId);
      } else {
        setNotification({ type: "error", message: res.error || "Erro ao revogar chave." });
      }
    });
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const res = await updateClientProfileAction({
        userId: currentClientId,
        name: editName,
        company: editCompany,
        email: editEmail,
        systemUrl: editSystemUrl,
        contractNumber: editContractNumber,
      });
      if (res.success) {
        setNotification({ type: "success", message: "Dados cadastrais atualizados com sucesso!" });
        setIsEditingProfile(false);
        loadAllClientData(currentClientId);
      } else {
        setNotification({ type: "error", message: res.error || "Erro ao salvar perfil." });
      }
    } catch (err: any) {
      setNotification({ type: "error", message: "Erro inesperado ao salvar perfil." });
    } finally {
      setSavingProfile(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "CL";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const client = commercialData?.client;
  const contracts = commercialData?.contracts || [];
  const receivables = commercialData?.receivables || [];
  const proposals = commercialData?.proposals || [];
  const summary = commercialData?.summary;

  // Primary contract
  const primaryContract = contracts.find((c) => c.status === "ATIVO") || contracts[0];
  const daysRemaining = useMemo(() => {
    if (!primaryContract || !primaryContract.endDate) return null;
    const diffTime = new Date(primaryContract.endDate).getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [primaryContract]);

  const contractProgressPercent = useMemo(() => {
    if (!primaryContract || !primaryContract.startDate || !primaryContract.endDate) return 100;
    const start = new Date(primaryContract.startDate).getTime();
    const end = new Date(primaryContract.endDate).getTime();
    const now = new Date().getTime();
    if (now >= end) return 100;
    if (now <= start) return 0;
    return Math.round(((now - start) / (end - start)) * 100);
  }, [primaryContract]);

  return (
    <div className="min-h-screen bg-[#f3f4f8] text-gray-900 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

        {/* Notifications Bar */}
        {notification && (
          <div
            className={`p-4 rounded-xl flex items-center justify-between shadow-sm border transition-all ${
              notification.type === "success"
                ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                : notification.type === "error"
                ? "bg-rose-50 text-rose-900 border-rose-200"
                : "bg-blue-50 text-blue-900 border-blue-200"
            }`}
          >
            <div className="flex items-center gap-2.5 text-xs font-semibold">
              {notification.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-gray-400 hover:text-gray-700 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* TOP HERO PROFILE BANNER (Matching Image 2 & 3 Tiimi Style) */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 transition-all">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

            {/* Left: Back button + Avatar + Client Info + Live Status */}
            <div className="flex items-center gap-4 sm:gap-5">
              {isSupport && (
                <button
                  onClick={onBackToList || (() => router.push("/suporte/usuarios"))}
                  className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors shadow-xs"
                  title="Voltar para a Lista de Clientes"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}

              {/* Avatar with Status indicator */}
              <div className="relative">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-lg sm:text-xl flex items-center justify-center shadow-md ring-4 ring-blue-50">
                  {client ? getInitials(client.name) : "..."}
                </div>
                <span
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    client?.status === "INATIVO" ? "bg-gray-400" : "bg-emerald-500"
                  }`}
                  title={client?.status === "INATIVO" ? "Inativo" : "Ativo"}
                />
              </div>

              {/* Name & Quick Metadata Badges */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                    {client?.name || "Carregando..."}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      client?.status === "INATIVO"
                        ? "bg-gray-100 text-gray-700 border border-gray-200"
                        : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {client?.status === "INATIVO" ? "Inativo" : "Ativo"}
                  </span>
                  {client?.contractNumber && (
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-mono font-semibold border border-blue-200">
                      #{client.contractNumber}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1.5 flex-wrap">
                  <span className="flex items-center gap-1 font-medium text-gray-700">
                    <Building className="w-3.5 h-3.5 text-gray-400" />
                    {client?.company || "Empresa"}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    {client?.email}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center gap-1 text-gray-600">
                    <LifeBuoy className="w-3.5 h-3.5 text-blue-500" />
                    {ticketStats.aberto} chamado(s) aberto(s)
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Client Switcher Pager `< 1 of 32 >` + Action Buttons */}
            <div className="flex items-center gap-3 flex-wrap justify-end">
              {/* Client Pager for Support */}
              {isSupport && totalClients > 0 && (
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1 text-xs">
                  <button
                    onClick={handlePrevClient}
                    disabled={currentIndex <= 0}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    title="Cliente Anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-2.5 font-medium text-gray-700">
                    {currentIndex + 1} de {totalClients}
                  </span>
                  <button
                    onClick={handleNextClient}
                    disabled={currentIndex >= totalClients - 1}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    title="Próximo Cliente"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <button
                onClick={() => setIsTicketModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                <PlusCircle className="w-4 h-4 text-white" />
                <span>Novo Chamado</span>
              </button>

              {isSupport && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsContractModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#111827] hover:bg-black text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                    <span>+ Contrato</span>
                  </button>

                  <button
                    onClick={() => setIsReceivableModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    <Receipt className="w-3.5 h-3.5 text-white" />
                    <span>+ Fatura</span>
                  </button>

                  <button
                    onClick={() => setIsResetPasswordOpen(true)}
                    className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
                    title="Redefinir Senha do Cliente"
                  >
                    <KeyRound className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* SUB-TABS NAVIGATION BAR (Matching Images 2 & 3) */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("visao-geral")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === "visao-geral"
                  ? "bg-[#111827] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Visão Geral</span>
            </button>

            <button
              onClick={() => setActiveTab("contratos")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === "contratos"
                  ? "bg-[#111827] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Contratos</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === "contratos" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"
              }`}>
                {contracts.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("financeiro")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === "financeiro"
                  ? "bg-[#111827] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Faturas & Financeiro</span>
              {summary && summary.totalOverdue > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                  Atraso
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("chamados")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === "chamados"
                  ? "bg-[#111827] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>Chamados & Suporte</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === "chamados" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"
              }`}>
                {tickets.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("propostas")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === "propostas"
                  ? "bg-[#111827] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Propostas</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === "propostas" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"
              }`}>
                {proposals.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("integracoes")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === "integracoes"
                  ? "bg-[#111827] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>API & Integrações</span>
            </button>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-gray-500 font-medium">Carregando dados do cliente...</p>
          </div>
        )}

        {!loading && (
          <>
            {/* TAB 1: VISÃO GERAL */}
            {activeTab === "visao-geral" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column (2 Cols): Personal & Address Info */}
                <div className="lg:col-span-2 space-y-6">

                  {/* Card: Informações Cadastrais */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                      <div className="flex items-center gap-2.5 text-sm font-bold text-gray-900">
                        <User className="w-4 h-4 text-blue-600" />
                        <span>Informações da Empresa / Cliente</span>
                      </div>
                      {isSupport && (
                        <button
                          onClick={() => setIsEditingProfile(!isEditingProfile)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>{isEditingProfile ? "Cancelar" : "Editar"}</span>
                        </button>
                      )}
                    </div>

                    {isEditingProfile ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Nome do Contato Principal</label>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Razão Social / Empresa</label>
                            <input
                              type="text"
                              value={editCompany}
                              onChange={(e) => setEditCompany(e.target.value)}
                              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">E-mail Corporativo</label>
                            <input
                              type="email"
                              value={editEmail}
                              onChange={(e) => setEditEmail(e.target.value)}
                              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Número do Contrato</label>
                            <input
                              type="text"
                              value={editContractNumber}
                              onChange={(e) => setEditContractNumber(e.target.value)}
                              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">URL do Sistema em Produção</label>
                            <input
                              type="url"
                              value={editSystemUrl}
                              onChange={(e) => setEditSystemUrl(e.target.value)}
                              placeholder="https://app.cliente.com.br"
                              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            onClick={() => setIsEditingProfile(false)}
                            className="px-3.5 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-100"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={handleSaveProfile}
                            disabled={savingProfile}
                            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs"
                          >
                            {savingProfile ? "Salvando..." : "Salvar Alterações"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8 text-xs">
                        <div>
                          <span className="text-gray-400 block mb-1">Responsável / Contato</span>
                          <span className="font-semibold text-gray-900 text-sm">{client?.name}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block mb-1">Razão Social / Empresa</span>
                          <span className="font-semibold text-gray-900 text-sm">{client?.company}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block mb-1">E-mail Principal</span>
                          <span className="font-semibold text-gray-900">{client?.email}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block mb-1">Contrato Vigente</span>
                          <span className="font-semibold text-gray-900 font-mono">
                            {client?.contractNumber || "Não vinculado"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 block mb-1">Data de Cadastro</span>
                          <span className="font-medium text-gray-800">
                            {client?.createdAt ? new Date(client.createdAt).toLocaleDateString("pt-BR") : "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 block mb-1">Status da Conta</span>
                          <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            {client?.status || "ATIVO"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card: Instalação e URL do Sistema */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                      <div className="flex items-center gap-2.5 text-sm font-bold text-gray-900">
                        <Globe className="w-4 h-4 text-indigo-600" />
                        <span>Ambiente de Produção & Conectividade</span>
                      </div>
                    </div>

                    <div className="space-y-4 text-xs">
                      <div>
                        <span className="text-gray-400 block mb-1">URL do Sistema Web / API</span>
                        {client?.systemUrl ? (
                          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                            <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                            <a
                              href={client.systemUrl.startsWith("http") ? client.systemUrl : `https://${client.systemUrl}`}
                              target="_blank"
                              rel="noreferrer"
                              className="font-mono text-blue-600 hover:underline font-semibold flex-1 truncate"
                            >
                              {client.systemUrl}
                            </a>
                            <a
                              href={client.systemUrl.startsWith("http") ? client.systemUrl : `https://${client.systemUrl}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                              title="Abrir em nova aba"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        ) : (
                          <p className="text-gray-400 italic">Nenhuma URL cadastrada para o sistema deste cliente.</p>
                        )}
                      </div>

                      <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 text-blue-900 flex items-start gap-3">
                        <Zap className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold block mb-0.5">Integração Automática de Incidentes</span>
                          <p className="text-[11px] text-blue-800 leading-relaxed">
                            Erros não tratados no frontend e backend deste cliente são direcionados automaticamente para a Central de Chamados quando configurados com o SDK LTI Sistemas.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Column (1 Col): Sidebar Cards */}
                <div className="space-y-6">

                  {/* Card: Resumo Comercial & Financeiro */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-900 pb-3 border-b border-gray-100 mb-4">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      <span>Resumo Financeiro</span>
                    </div>

                    <div className="space-y-3.5 text-xs">
                      <div className="flex justify-between items-center py-1 border-b border-gray-50">
                        <span className="text-gray-500">MRR Ativo (Mensalidade)</span>
                        <span className="font-bold text-gray-900 text-sm">
                          R$ {(summary?.activeMrr || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-gray-50">
                        <span className="text-gray-500">Total Pago Acumulado</span>
                        <span className="font-semibold text-emerald-700">
                          R$ {(summary?.totalPaid || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-gray-50">
                        <span className="text-gray-500">Faturas a Vencer</span>
                        <span className="font-semibold text-blue-700">
                          R$ {(summary?.totalPending || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      {summary && summary.totalOverdue > 0 && (
                        <div className="flex justify-between items-center py-1 bg-rose-50 px-2 rounded-lg text-rose-800 font-bold">
                          <span>Faturas em Atraso</span>
                          <span>R$ {summary.totalOverdue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card: SLA & Atendimento */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-900 pb-3 border-b border-gray-100 mb-4">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span>Nível de Serviço (SLA)</span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="text-gray-500 block mb-1">Tempo de Resposta Padrão</span>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 font-bold font-mono">
                            6 Horas (Crítico)
                          </span>
                          <span className="text-[11px] text-gray-400">Atendimento 24/7</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-100">
                        <span className="text-gray-500 block mb-1">Desempenho de Resolução</span>
                        <div className="flex items-center justify-between text-[11px] font-semibold text-gray-700 mb-1">
                          <span>Conformidade SLA</span>
                          <span className="text-emerald-600">98.4%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-2 rounded-full w-[98.4%]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card: Tags / Classificação */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-900 pb-3 border-b border-gray-100 mb-4">
                      <Tag className="w-4 h-4 text-purple-600" />
                      <span>Tags & Classificação</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold">
                        SaaS Modular
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
                        Suporte Dedicado
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                        Cliente Ativo
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 border border-gray-200 text-xs font-semibold">
                        API Integrada
                      </span>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 2: CONTRATOS (Image 3 Tiimi Layout) */}
            {activeTab === "contratos" && (
              <div className="space-y-6">
                {primaryContract ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left 2 Cols: Contract Duration, Position Details & Compensation */}
                    <div className="lg:col-span-2 space-y-6">

                      {/* Card: Contract Duration */}
                      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                          <div className="flex items-center gap-2.5 text-sm font-bold text-gray-900">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span>Vigência do Contrato</span>
                          </div>
                          {isSupport && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleGenerateMonthlyInvoice(primaryContract.id)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-colors"
                              >
                                Gerar Fatura do Mês
                              </button>
                              <button
                                onClick={() => {
                                  setEditingContract(primaryContract);
                                  setIsContractModalOpen(true);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-colors"
                              >
                                Editar Contrato
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="space-y-4 text-xs">
                          <div className="flex items-center justify-between text-gray-700 font-medium">
                            <div>
                              <span className="text-gray-400 block text-[11px]">Início da Vigência</span>
                              <span className="font-semibold text-gray-900 text-sm">
                                {new Date(primaryContract.startDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                              </span>
                            </div>
                            <span className="text-gray-300 font-bold text-lg">→</span>
                            <div className="text-right">
                              <span className="text-gray-400 block text-[11px]">Término / Renovação</span>
                              <span className="font-semibold text-gray-900 text-sm">
                                {primaryContract.endDate
                                  ? new Date(primaryContract.endDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })
                                  : "Renovação Contínua"}
                              </span>
                            </div>
                          </div>

                          {/* Progress bar with days remaining badge */}
                          <div className="space-y-2 pt-2">
                            <div className="flex justify-between items-center text-xs font-semibold">
                              <span className="text-blue-900">Progresso do Período Contratual</span>
                              <span className="flex items-center gap-1.5 text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                                <Clock className="w-3 h-3 text-blue-600" />
                                {daysRemaining !== null
                                  ? `${daysRemaining > 0 ? daysRemaining : 0} dias até expirar`
                                  : "Contrato Recorrente Ativo"}
                              </span>
                            </div>
                            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                              <div
                                className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${contractProgressPercent}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card: Contract Position & Service Details */}
                      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                          <div className="flex items-center gap-2.5 text-sm font-bold text-gray-900">
                            <Layers className="w-4 h-4 text-indigo-600" />
                            <span>Serviços & Níveis de Suporte</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8 text-xs">
                          <div>
                            <span className="text-gray-400 block mb-1">Título do Serviço / Contrato</span>
                            <span className="font-semibold text-gray-900 text-sm">{primaryContract.title}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block mb-1">Nível de Suporte (SLA)</span>
                            <span className="font-semibold text-blue-700">Atendimento 6h Crítico</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block mb-1">Dia de Faturamento</span>
                            <span className="font-semibold text-gray-900">Todo dia {primaryContract.billingDay}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block mb-1">Status Contratual</span>
                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              {primaryContract.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card: Compensation & Benefit */}
                      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                          <div className="flex items-center gap-2.5 text-sm font-bold text-gray-900">
                            <DollarSign className="w-4 h-4 text-emerald-600" />
                            <span>Valores & Condições de Faturamento</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8 text-xs">
                          <div>
                            <span className="text-gray-400 block mb-1">Tipo de Cobrança</span>
                            <span className="font-semibold text-gray-900">Mensalidade Recorrente (MRR)</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block mb-1">Valor Mensal (BRL)</span>
                            <span className="font-bold text-emerald-700 text-base">
                              R$ {primaryContract.monthlyValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/mês
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400 block mb-1">Meios de Pagamento Aceitos</span>
                            <span className="font-semibold text-gray-800">PIX Instantâneo, Boleto Bancário</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block mb-1">Notas Contratuais</span>
                            <span className="text-gray-700">{primaryContract.notes || "Sem observações registradas."}</span>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Right 1 Col: Working Scope & Contract Legal Details */}
                    <div className="space-y-6">

                      {/* Card: Working Scope */}
                      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-900 pb-3 border-b border-gray-100 mb-4">
                          <Shield className="w-4 h-4 text-blue-600" />
                          <span>Escopo de Trabalho & SLA</span>
                        </div>

                        <div className="space-y-3 text-xs text-gray-600 leading-relaxed">
                          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <span className="font-semibold text-gray-900 block mb-1">Sustentação & Incidentes</span>
                            <p className="text-[11px]">
                              Atendimento a incidentes técnicos, diagnóstico de erros de frontend/backend e garantia de uptime.
                            </p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <span className="font-semibold text-gray-900 block mb-1">Manutenção e Melhorias</span>
                            <p className="text-[11px]">
                              Ajustes operacionais, suporte a relatórios e consultoria técnica especializada.
                            </p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <span className="font-semibold text-gray-900 block mb-1">Monitoramento Ativo</span>
                            <p className="text-[11px]">
                              Telemetria contínua com ingestão de stack traces e SLA prioritário de 6h.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Card: Contract Details */}
                      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-900 pb-3 border-b border-gray-100 mb-4">
                          <FileText className="w-4 h-4 text-purple-600" />
                          <span>Identificação Legal</span>
                        </div>

                        <div className="space-y-3 text-xs">
                          <div>
                            <span className="text-gray-400 block mb-0.5">Identificador do Contrato</span>
                            <span className="font-mono font-bold text-gray-900">
                              {primaryContract.contractNumber || `#CTR-${primaryContract.id.slice(0, 8)}`}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400 block mb-0.5">Jurisdição Fiscal</span>
                            <span className="font-semibold text-gray-900">Brasil (BRL)</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block mb-0.5">Data de Assinatura</span>
                            <span className="font-medium text-gray-800">
                              {new Date(primaryContract.createdAt).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-gray-800 mb-1">Nenhum contrato cadastrado</h3>
                    <p className="text-xs text-gray-500 mb-4">Este cliente ainda não possui contratos ativos registrados.</p>
                    {isSupport && (
                      <button
                        onClick={() => setIsContractModalOpen(true)}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs"
                      >
                        + Cadastrar Primeiro Contrato
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: FATURAS & FINANCEIRO */}
            {activeTab === "financeiro" && (
              <div className="space-y-6">

                {/* KPI Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                    <span className="text-xs text-gray-500 font-medium block mb-1">Total Faturado & Pago</span>
                    <span className="text-xl font-bold text-emerald-600">
                      R$ {(summary?.totalPaid || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                    <span className="text-xs text-gray-500 font-medium block mb-1">A Vencer / Pendente</span>
                    <span className="text-xl font-bold text-blue-600">
                      R$ {(summary?.totalPending || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                    <span className="text-xs text-gray-500 font-medium block mb-1">Vencido / Em Atraso</span>
                    <span className="text-xl font-bold text-rose-600">
                      R$ {(summary?.totalOverdue || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                    <span className="text-xs text-gray-500 font-medium block mb-1">MRR Recorrente</span>
                    <span className="text-xl font-bold text-gray-900">
                      R$ {(summary?.activeMrr || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Invoices Table */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Histórico de Faturas & Recebíveis</h3>
                      <p className="text-xs text-gray-500">Acompanhamento detalhado de parcelas e pagamentos.</p>
                    </div>

                    {isSupport && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsReceivableModalOpen(true)}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs"
                        >
                          + Nova Fatura Avulsa
                        </button>
                      </div>
                    )}
                  </div>

                  {receivables.length === 0 ? (
                    <div className="p-12 text-center">
                      <Receipt className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Nenhuma fatura registrada para este cliente.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-gray-50/80 text-gray-500 font-semibold border-b border-gray-200 uppercase text-[10px] tracking-wider">
                          <tr>
                            <th className="py-3 px-4">Competência</th>
                            <th className="py-3 px-4">Descrição</th>
                            <th className="py-3 px-4">Vencimento</th>
                            <th className="py-3 px-4">Valor</th>
                            <th className="py-3 px-4">Método</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-medium">
                          {receivables.map((r) => (
                            <tr key={r.id} className="hover:bg-gray-50/60 transition-colors">
                              <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                                {r.competence}
                              </td>
                              <td className="py-3.5 px-4 text-gray-800">
                                <span className="font-semibold block">{r.description}</span>
                                {r.contractTitle && (
                                  <span className="text-[10px] text-gray-400">Contrato: {r.contractTitle}</span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-gray-700">
                                {new Date(r.dueDate).toLocaleDateString("pt-BR")}
                              </td>
                              <td className="py-3.5 px-4 font-bold text-gray-900">
                                R$ {r.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-semibold text-[10px]">
                                  {r.paymentMethod}
                                </span>
                              </td>
                              <td className="py-3.5 px-4">
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                    r.status === "PAGO"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : r.status === "ATRASADO"
                                      ? "bg-rose-100 text-rose-800 font-bold"
                                      : "bg-amber-100 text-amber-800"
                                  }`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${
                                    r.status === "PAGO" ? "bg-emerald-500" : r.status === "ATRASADO" ? "bg-rose-500" : "bg-amber-500"
                                  }`} />
                                  {r.status}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {isSupport && r.status !== "PAGO" && (
                                    <button
                                      onClick={() => handleMarkPaid(r.id)}
                                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold"
                                      title="Marcar como Pago"
                                    >
                                      Baixar Pago
                                    </button>
                                  )}
                                  {isSupport && (
                                    <button
                                      onClick={() => handleDeleteReceivable(r.id)}
                                      className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition-colors"
                                      title="Excluir Fatura"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
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

            {/* TAB 4: CHAMADOS & SUPORTE */}
            {activeTab === "chamados" && (
              <div className="space-y-6">

                {/* Ticket Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                    <span className="text-xs text-gray-500 block mb-1">Total de Chamados</span>
                    <span className="text-xl font-bold text-gray-900">{ticketStats.total}</span>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                    <span className="text-xs text-gray-500 block mb-1">Abertos</span>
                    <span className="text-xl font-bold text-amber-600">{ticketStats.aberto}</span>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                    <span className="text-xs text-gray-500 block mb-1">Pendentes</span>
                    <span className="text-xl font-bold text-blue-600">{ticketStats.pendente}</span>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                    <span className="text-xs text-gray-500 block mb-1">Resolvidos</span>
                    <span className="text-xl font-bold text-emerald-600">{ticketStats.fechado}</span>
                  </div>
                </div>

                {/* Tickets Table */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Chamados do Cliente</h3>
                      <p className="text-xs text-gray-500">Incidentes abertos e histórico de suporte técnico.</p>
                    </div>
                    <button
                      onClick={() => setIsTicketModalOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs"
                    >
                      + Novo Chamado
                    </button>
                  </div>

                  {tickets.length === 0 ? (
                    <div className="p-12 text-center">
                      <LifeBuoy className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Nenhum chamado registrado para este cliente.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-gray-50/80 text-gray-500 font-semibold border-b border-gray-200 uppercase text-[10px] tracking-wider">
                          <tr>
                            <th className="py-3 px-4">Código / ID</th>
                            <th className="py-3 px-4">Título do Incidente</th>
                            <th className="py-3 px-4">Módulo / Tela</th>
                            <th className="py-3 px-4">Origem</th>
                            <th className="py-3 px-4">SLA Restante</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right">Ação</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-medium">
                          {tickets.map((t) => (
                            <tr key={t.id} className="hover:bg-gray-50/60 transition-colors">
                              <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                                {t.code}
                              </td>
                              <td className="py-3.5 px-4 text-gray-900 font-semibold max-w-xs truncate">
                                {t.title}
                              </td>
                              <td className="py-3.5 px-4 text-gray-600">
                                <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-mono text-[11px]">
                                  {t.screenName}
                                </span>
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold text-[10px]">
                                  {t.origin}
                                </span>
                              </td>
                              <td className="py-3.5 px-4">
                                <SlaBadge slaDueAt={t.slaDueAt} ticketStatus={t.status} />
                              </td>
                              <td className="py-3.5 px-4">
                                <StatusBadge status={t.status} />
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <Link
                                  href={`/suporte/chamados/${t.id}`}
                                  className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-semibold transition-colors inline-block"
                                >
                                  Ver Detalhes
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

            {/* TAB 5: PROPOSTAS COMERCIAIS */}
            {activeTab === "propostas" && (
              <div className="space-y-6">

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Propostas Comerciais</h3>
                    <p className="text-xs text-gray-500">Projetos de expansão, novos módulos e orçamentos enviados.</p>
                  </div>
                  {isSupport && (
                    <button
                      onClick={() => setIsProposalModalOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs"
                    >
                      + Nova Proposta
                    </button>
                  )}
                </div>

                {proposals.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                    <FileSpreadsheet className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Nenhuma proposta comercial registrada para este cliente.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {proposals.map((p) => (
                      <div
                        key={p.id}
                        className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4 hover:border-blue-300 transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-mono font-bold border border-purple-200">
                              #{p.proposalNumber}
                            </span>
                            <h4 className="text-base font-bold text-gray-900 mt-1.5">{p.title}</h4>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              p.status === "APROVADA"
                                ? "bg-emerald-100 text-emerald-800"
                                : p.status === "RECUSADA"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>

                        <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                          {p.scopeDescription}
                        </p>

                        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100 text-xs">
                          <div>
                            <span className="text-gray-400 block text-[10px]">Valor Pontual (Setup/Dev)</span>
                            <span className="font-bold text-gray-900 text-sm">
                              R$ {p.oneOffValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[10px]">Mensalidade Adicional</span>
                            <span className="font-bold text-emerald-700 text-sm">
                              R$ {p.monthlyValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/mês
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 text-[11px] text-gray-500">
                          <span>Envio: {new Date(p.sentDate).toLocaleDateString("pt-BR")}</span>
                          {p.validUntil && (
                            <span>Válido até: {new Date(p.validUntil).toLocaleDateString("pt-BR")}</span>
                          )}
                        </div>

                        {isSupport && (
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <select
                              value={p.status}
                              onChange={(e) => handleUpdateProposalStatus(p.id, e.target.value as ProposalStatus)}
                              className="text-xs px-2.5 py-1 rounded-lg border border-gray-300 bg-white font-medium"
                            >
                              <option value="RASCUNHO">Rascunho</option>
                              <option value="ENVIADA">Enviada</option>
                              <option value="EM_NEGOCIACAO">Em Negociação</option>
                              <option value="APROVADA">Aprovada</option>
                              <option value="RECUSADA">Recusada</option>
                              <option value="EXPIRADA">Expirada</option>
                            </select>

                            <button
                              onClick={() => handleDeleteProposal(p.id)}
                              className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition-colors"
                              title="Excluir Proposta"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* TAB 6: API & INTEGRAÇÕES */}
            {activeTab === "integracoes" && (
              <div className="space-y-6">

                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Chaves de API (API Keys)</h3>
                      <p className="text-xs text-gray-500">
                        Chaves secretas para envio automatizado de erros do backend e frontend deste cliente.
                      </p>
                    </div>
                    <button
                      onClick={handleCreateApiKey}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Gerar Nova Chave API</span>
                    </button>
                  </div>

                  {newGeneratedKey && (
                    <div className="p-4 mb-5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-xs">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>Sua nova chave de API foi gerada com sucesso!</span>
                      </div>
                      <p className="text-[11px] text-emerald-800">
                        Copie a chave agora. Por segurança, ela não será exibida novamente de forma completa.
                      </p>
                      <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-emerald-300">
                        <code className="font-mono text-xs text-gray-900 font-bold flex-1 break-all">
                          {newGeneratedKey}
                        </code>
                        <button
                          onClick={() => handleCopy(newGeneratedKey, "newKey")}
                          className="px-3 py-1 rounded bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1 shrink-0"
                        >
                          {copiedKey === "newKey" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === "newKey" ? "Copiado!" : "Copiar"}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {apiKeys.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">Nenhuma chave ativa gerada ainda.</p>
                  ) : (
                    <div className="space-y-3">
                      {apiKeys.map((k) => (
                        <div
                          key={k.id}
                          className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 bg-gray-50/60 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <KeyRound className="w-4 h-4 text-blue-600" />
                            <div>
                              <span className="font-bold text-gray-900 block">{k.name}</span>
                              <span className="font-mono text-gray-500">{k.keyPrefix}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-[11px] text-gray-500">
                              Criada em: {new Date(k.createdAt).toLocaleDateString("pt-BR")}
                            </span>
                            <button
                              onClick={() => handleRevokeApiKey(k.id)}
                              className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition-colors"
                              title="Revogar Chave"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Integration Guide Box */}
                <div className="bg-[#111827] text-white rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <Zap className="w-4 h-4 text-blue-400" />
                    <span>Guia Rápido de Ingestão de Incidentes via cURL</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Envie incidentes capturados no seu ambiente diretamente via HTTP POST:
                  </p>
                  <pre className="p-3.5 bg-black/60 rounded-xl font-mono text-[11px] text-emerald-400 overflow-x-auto border border-gray-800 leading-relaxed">
{`curl -X POST https://ltisistemas.com/api/v1/incidents/ingest \\
  -H "Authorization: Bearer lti_live_SEU_TOKEN_AQUI" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Erro 500 na rota de pagamento",
    "screenName": "Checkout",
    "origin": "BACK",
    "stackTrace": "Error: Payment Gateway Timeout..."
  }'`}
                  </pre>
                </div>

              </div>
            )}

          </>
        )}

      </div>

      {/* ALL MODALS INTEGRATED */}
      {isContractModalOpen && (
        <CreateContractModal
          isOpen={isContractModalOpen}
          onClose={() => {
            setIsContractModalOpen(false);
            setEditingContract(null);
          }}
          onSuccess={() => {
            setIsContractModalOpen(false);
            setEditingContract(null);
            setNotification({ type: "success", message: "Contrato salvo com sucesso!" });
            loadAllClientData(currentClientId);
          }}
          userId={currentClientId}
          clientName={client?.name || ""}
          initialData={editingContract}
        />
      )}

      {isReceivableModalOpen && (
        <CreateReceivableModal
          isOpen={isReceivableModalOpen}
          onClose={() => setIsReceivableModalOpen(false)}
          onSuccess={() => {
            setIsReceivableModalOpen(false);
            setNotification({ type: "success", message: "Fatura cadastrada com sucesso!" });
            loadAllClientData(currentClientId);
          }}
          userId={currentClientId}
          clientName={client?.name || ""}
          contracts={contracts.map((c) => ({ id: c.id, title: c.title, monthlyValue: c.monthlyValue }))}
        />
      )}

      {isProposalModalOpen && (
        <CreateProposalModal
          isOpen={isProposalModalOpen}
          onClose={() => setIsProposalModalOpen(false)}
          onSuccess={() => {
            setIsProposalModalOpen(false);
            setNotification({ type: "success", message: "Proposta criada com sucesso!" });
            loadAllClientData(currentClientId);
          }}
          userId={currentClientId}
          clientName={client?.name || ""}
        />
      )}

      {isTicketModalOpen && (
        <CreateTicketModal
          isOpen={isTicketModalOpen}
          onClose={() => setIsTicketModalOpen(false)}
          onSuccess={(newTicketId, ticketNumber, ticketCode) => {
            setIsTicketModalOpen(false);
            setSuccessTicketData({
              id: newTicketId,
              number: ticketNumber,
              code: ticketCode,
            });
            loadAllClientData(currentClientId);
          }}
          userRole={isSupport ? "SUPORTE" : "CLIENTE"}
          clients={allClients}
        />
      )}

      {successTicketData && (
        <TicketSuccessModal
          isOpen={!!successTicketData}
          onClose={() => setSuccessTicketData(null)}
          ticketCode={successTicketData.code}
          ticketNumber={successTicketData.number}
          ticketId={successTicketData.id}
          onViewTicket={() => {
            setActiveTab("chamados");
          }}
        />
      )}

      {isResetPasswordOpen && client && (
        <ResetPasswordModal
          isOpen={isResetPasswordOpen}
          onClose={() => setIsResetPasswordOpen(false)}
          onSuccess={() => {
            setIsResetPasswordOpen(false);
            setNotification({ type: "success", message: "Senha do cliente redefinida com sucesso!" });
          }}
          user={{
            id: client.id,
            name: client.name,
            email: client.email,
            company: client.company,
          }}
        />
      )}

    </div>
  );
}
