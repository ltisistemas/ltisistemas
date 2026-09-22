"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  UserPlus,
  Search,
  Building,
  Mail,
  Shield,
  Calendar,
  LifeBuoy,
  Globe,
  Trash2,
  KeyRound,
  CheckCircle2,
  XCircle,
  Loader2,
  Briefcase,
  TrendingUp,
  DollarSign,
  Receipt,
  FileText,
  ExternalLink,
  ChevronRight,
  MoreVertical,
  Filter,
  Download,
  LayoutGrid,
  List,
  Sparkles,
  Eye,
} from "lucide-react";
import { SessionPayload } from "@/lib/auth/session";
import { SupportHeader } from "./SupportHeader";
import { CreateUserModal } from "./CreateUserModal";
import { ResetPasswordModal } from "./ResetPasswordModal";
import { ClientHub360View } from "./ClientHub360View";
import { deleteUserAction, toggleUserStatusAction } from "@/lib/actions/auth-actions";
import { PortfolioSummaryData } from "@/lib/actions/commercial-actions";
import { Role, UserStatus } from "@prisma/client";

export interface UserItem {
  id: string;
  name: string;
  email: string;
  company: string;
  contractNumber: string | null;
  systemUrl: string | null;
  status: UserStatus;
  role: Role;
  createdAt: Date;
  ticketsCount: number;
}

interface UsersClientViewProps {
  user: SessionPayload;
  initialUsers: UserItem[];
  initialPortfolio?: PortfolioSummaryData | null;
}

export function UsersClientView({
  user,
  initialUsers,
  initialPortfolio,
}: UsersClientViewProps) {
  const router = useRouter();
  const [usersList, setUsersList] = useState<UserItem[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ATIVO" | "INATIVO">("ALL");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "CLIENTE" | "SUPORTE">("ALL");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Selection for Client 360° Hub
  const [selectedClientForHub, setSelectedClientForHub] = useState<UserItem | null>(null);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [resetPasswordTargetUser, setResetPasswordTargetUser] = useState<UserItem | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [actionUserId, setActionUserId] = useState<string | null>(null);
  const [activeMenuUserId, setActiveMenuUserId] = useState<string | null>(null);

  const clientMrrMap = initialPortfolio?.clientMrrMap || {};

  // Status counts
  const activeCount = useMemo(() => usersList.filter((u) => u.status === "ATIVO").length, [usersList]);
  const inactiveCount = useMemo(() => usersList.filter((u) => u.status === "INATIVO").length, [usersList]);
  const totalMrr = initialPortfolio?.totalMrr || 0;

  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.company.toLowerCase().includes(q) ||
        (u.systemUrl && u.systemUrl.toLowerCase().includes(q)) ||
        (u.contractNumber && u.contractNumber.toLowerCase().includes(q));

      const matchesStatus = statusFilter === "ALL" || u.status === statusFilter;
      const matchesRole = roleFilter === "ALL" || u.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [usersList, searchQuery, statusFilter, roleFilter]);

  const handleUserCreated = () => {
    router.refresh();
  };

  const handleToggleStatus = async (targetUser: UserItem) => {
    const newStatus = targetUser.status === "ATIVO" ? "INATIVO" : "ATIVO";
    setActionUserId(targetUser.id);
    try {
      const res = await toggleUserStatusAction(targetUser.id, newStatus);
      if (res.success) {
        setUsersList((prev) =>
          prev.map((u) => (u.id === targetUser.id ? { ...u, status: newStatus } : u))
        );
      } else {
        alert(res.error || "Erro ao alterar status.");
      }
    } catch {
      alert("Erro ao comunicar com o servidor.");
    } finally {
      setActionUserId(null);
    }
  };

  const handleDeleteUser = async (targetUser: UserItem) => {
    if (
      !confirm(
        `Deseja realmente desativar o acesso de "${targetUser.name}" (${targetUser.company})?`
      )
    ) {
      return;
    }
    setActionUserId(targetUser.id);
    try {
      const res = await deleteUserAction(targetUser.id);
      if (res.success) {
        setUsersList((prev) => prev.filter((u) => u.id !== targetUser.id));
        setFeedbackMessage(`Usuário "${targetUser.name}" desativado com sucesso.`);
      } else {
        alert(res.error || "Erro ao desativar usuário.");
      }
    } catch {
      alert("Erro ao comunicar com o servidor.");
    } finally {
      setActionUserId(null);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "CL";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const formatClientId = (index: number) => {
    const num = (index + 1).toString().padStart(2, "0");
    return `#CLI${num}`;
  };

  const exportClientsCsv = () => {
    const headers = ["ID", "Nome", "Empresa", "Email", "Contrato", "MRR", "Status", "Chamados", "URL"];
    const rows = filteredUsers.map((u, i) => [
      formatClientId(i),
      `"${u.name}"`,
      `"${u.company}"`,
      u.email,
      u.contractNumber || "",
      clientMrrMap[u.id] || 0,
      u.status,
      u.ticketsCount,
      u.systemUrl || "",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `clientes_lti_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // If a client is selected, render their 360° Hub seamlessly
  if (selectedClientForHub) {
    return (
      <div className="min-h-screen bg-[#f3f4f8]">
        <SupportHeader
          user={user}
          activeTab="usuarios"
          counts={{ clients: usersList.length, tickets: usersList.reduce((acc, u) => acc + u.ticketsCount, 0) }}
        />
        <ClientHub360View
          user={user}
          initialClientId={selectedClientForHub.id}
          allClients={usersList.map((u) => ({
            id: u.id,
            name: u.name,
            company: u.company,
            email: u.email,
            contractNumber: u.contractNumber,
            status: u.status,
          }))}
          onBackToList={() => setSelectedClientForHub(null)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f8] text-gray-900 pb-16 font-sans">
      <SupportHeader
        user={user}
        activeTab="usuarios"
        counts={{
          clients: usersList.length,
          contracts: initialPortfolio?.totalClientsWithContracts,
          tickets: usersList.reduce((acc, u) => acc + u.ticketsCount, 0),
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

        {/* Feedback Message */}
        {feedbackMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{feedbackMessage}</span>
            </div>
            <button
              onClick={() => setFeedbackMessage(null)}
              className="text-gray-400 hover:text-gray-700 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* TIIMI STYLE HEADER BAR (Image 1 Mockup) */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                  Central de Clientes & Contratos
                </h1>
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Ativos {activeCount}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    Inativos {inactiveCount}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Gerenciamento de acessos, contratos vigentes, faturas e suporte de toda a carteira.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={exportClientsCsv}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-gray-500" />
                <span>Exportar CSV</span>
              </button>

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                <UserPlus className="w-4 h-4 text-white" />
                <span>+ Adicionar Cliente</span>
              </button>
            </div>
          </div>

          {/* FILTER TOOLBAR (Image 1 Filter Strip) */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 flex-wrap">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar cliente, empresa, e-mail..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Filter Dropdowns & View Mode */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap text-xs">
              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 font-medium text-gray-700 focus:outline-none"
              >
                <option value="ALL">Status: Todos</option>
                <option value="ATIVO">Status: Ativos</option>
                <option value="INATIVO">Status: Inativos</option>
              </select>

              {/* Role filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 font-medium text-gray-700 focus:outline-none"
              >
                <option value="ALL">Papel: Todos</option>
                <option value="CLIENTE">Apenas Clientes</option>
                <option value="SUPORTE">Apenas Suporte</option>
              </select>

              {/* View Switcher */}
              <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "table" ? "bg-white text-blue-600 shadow-xs" : "text-gray-500 hover:text-gray-900"
                  }`}
                  title="Visualização em Lista"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "grid" ? "bg-white text-blue-600 shadow-xs" : "text-gray-500 hover:text-gray-900"
                  }`}
                  title="Visualização em Grid"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CLIENTS DATA TABLE (Matching Image 1 Tiimi Design) */}
        {viewMode === "table" ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {filteredUsers.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-gray-800 mb-1">Nenhum cliente encontrado</h3>
                <p className="text-xs text-gray-500">Tente ajustar seus termos de busca ou filtros.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50/90 text-gray-500 font-semibold border-b border-gray-200 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4"># ID</th>
                      <th className="py-3 px-4">Cliente / Empresa</th>
                      <th className="py-3 px-4">Contrato & MRR</th>
                      <th className="py-3 px-4">Chamados</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Contato & URL</th>
                      <th className="py-3 px-4">Cadastro</th>
                      <th className="py-3 px-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {filteredUsers.map((u, index) => {
                      const mrr = clientMrrMap[u.id] || 0;
                      return (
                        <tr
                          key={u.id}
                          className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                          onClick={() => setSelectedClientForHub(u)}
                        >
                          {/* ID */}
                          <td className="py-3.5 px-4 font-mono font-bold text-gray-400 group-hover:text-blue-600 transition-colors">
                            {formatClientId(index)}
                          </td>

                          {/* Name & Company with Avatar */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
                                {getInitials(u.name)}
                              </div>
                              <div>
                                <span className="font-bold text-gray-900 text-sm block group-hover:text-blue-600 transition-colors">
                                  {u.name}
                                </span>
                                <span className="text-[11px] text-gray-500 flex items-center gap-1">
                                  <Building className="w-3 h-3 text-gray-400" />
                                  {u.company}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Contract & MRR */}
                          <td className="py-3.5 px-4">
                            {mrr > 0 ? (
                              <div>
                                <span className="font-bold text-emerald-700 block">
                                  R$ {mrr.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/mês
                                </span>
                                {u.contractNumber && (
                                  <span className="text-[10px] font-mono text-gray-400">
                                    #{u.contractNumber}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">Sem contrato ativo</span>
                            )}
                          </td>

                          {/* Tickets Count */}
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                              <LifeBuoy className="w-3 h-3 text-blue-500" />
                              {u.ticketsCount}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleToggleStatus(u)}
                              disabled={actionUserId === u.id}
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                                u.status === "ATIVO"
                                  ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  u.status === "ATIVO" ? "bg-emerald-500" : "bg-gray-400"
                                }`}
                              />
                              {u.status}
                            </button>
                          </td>

                          {/* Contact & URL */}
                          <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex flex-col gap-1 text-[11px]">
                              <a
                                href={`mailto:${u.email}`}
                                className="text-gray-700 hover:text-blue-600 truncate max-w-[180px] flex items-center gap-1"
                              >
                                <Mail className="w-3 h-3 text-gray-400" />
                                {u.email}
                              </a>
                              {u.systemUrl && (
                                <a
                                  href={u.systemUrl.startsWith("http") ? u.systemUrl : `https://${u.systemUrl}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-blue-600 hover:underline truncate max-w-[180px] flex items-center gap-1 font-mono text-[10px]"
                                >
                                  <Globe className="w-3 h-3 text-blue-400" />
                                  {u.systemUrl.replace(/^https?:\/\//, "")}
                                </a>
                              )}
                            </div>
                          </td>

                          {/* Joined Date */}
                          <td className="py-3.5 px-4 text-gray-600">
                            {new Date(u.createdAt).toLocaleDateString("pt-BR")}
                          </td>

                          {/* Action Button */}
                          <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedClientForHub(u)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Visão 360°</span>
                              </button>

                              <button
                                onClick={() => setResetPasswordTargetUser(u)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                                title="Redefinir Senha"
                              >
                                <KeyRound className="w-3.5 h-3.5" />
                              </button>

                              {u.role !== "SUPORTE" && (
                                <button
                                  onClick={() => handleDeleteUser(u)}
                                  disabled={actionUserId === u.id}
                                  className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition-colors"
                                  title="Desativar Cliente"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((u, index) => {
              const mrr = clientMrrMap[u.id] || 0;
              return (
                <div
                  key={u.id}
                  className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4 hover:border-blue-300 transition-all cursor-pointer"
                  onClick={() => setSelectedClientForHub(u)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                        {getInitials(u.name)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm leading-tight">{u.name}</h4>
                        <span className="text-xs text-gray-500">{u.company}</span>
                      </div>
                    </div>
                    {u.status === "ATIVO" ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900">
                        ATIVO
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-900">
                        INATIVO
                      </span>
                    )}
                  </div>

                  <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400 block text-[10px]">MRR Recorrente</span>
                      <span className="font-bold text-emerald-700">
                        {mrr > 0 ? `R$ ${mrr.toLocaleString("pt-BR")}` : "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">Chamados</span>
                      <span className="font-bold text-gray-900">{u.ticketsCount} abertos</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedClientForHub(u);
                      }}
                      className="w-full py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Abrir Visão 360°</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* CREATE USER MODAL */}
      {isCreateModalOpen && (
        <CreateUserModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleUserCreated}
        />
      )}

      {/* RESET PASSWORD MODAL */}
      {resetPasswordTargetUser && (
        <ResetPasswordModal
          isOpen={!!resetPasswordTargetUser}
          onClose={() => setResetPasswordTargetUser(null)}
          onSuccess={() => {
            setResetPasswordTargetUser(null);
            setFeedbackMessage("Senha redefinida com sucesso.");
          }}
          targetUser={{
            id: resetPasswordTargetUser.id,
            name: resetPasswordTargetUser.name,
            email: resetPasswordTargetUser.email,
            company: resetPasswordTargetUser.company,
          }}
        />
      )}

    </div>
  );
}
