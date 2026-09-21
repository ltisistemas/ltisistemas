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
  FileText,
  Calendar,
  LifeBuoy,
  Globe,
  Trash2,
  KeyRound,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { SessionPayload } from "@/lib/auth/session";
import { SupportHeader } from "./SupportHeader";
import { CreateUserModal } from "./CreateUserModal";
import { ResetPasswordModal } from "./ResetPasswordModal";
import { deleteUserAction, toggleUserStatusAction } from "@/lib/actions/auth-actions";
import { Role, UserStatus } from "@prisma/client";

interface UserItem {
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
}

export function UsersClientView({ user, initialUsers }: UsersClientViewProps) {
  const router = useRouter();
  const [usersList, setUsersList] = useState<UserItem[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [resetPasswordTargetUser, setResetPasswordTargetUser] = useState<UserItem | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [actionUserId, setActionUserId] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return usersList;

    return usersList.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.company.toLowerCase().includes(q) ||
        (u.systemUrl && u.systemUrl.toLowerCase().includes(q)) ||
        (u.contractNumber && u.contractNumber.toLowerCase().includes(q)) ||
        u.role.toLowerCase().includes(q) ||
        u.status.toLowerCase().includes(q)
    );
  }, [usersList, searchQuery]);

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
    } catch (err) {
      console.error(err);
      alert("Erro ao alterar status do usuário.");
    } finally {
      setActionUserId(null);
    }
  };

  const handleDeleteUser = async (targetUser: UserItem) => {
    if (!confirm(`Deseja realmente desativar e excluir o usuário "${targetUser.name}"? Seus chamados anteriores serão preservados no histórico.`)) {
      return;
    }

    setActionUserId(targetUser.id);
    try {
      const res = await deleteUserAction(targetUser.id);
      if (res.success) {
        setUsersList((prev) => prev.filter((u) => u.id !== targetUser.id));
        router.refresh();
      } else {
        alert(res.error || "Erro ao excluir usuário.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir usuário.");
    } finally {
      setActionUserId(null);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(d);
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col">
      <SupportHeader user={user} activeTab="usuarios" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Feedback notification toast / banner */}
        {feedbackMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-medium">{feedbackMessage}</span>
            </div>
            <button
              onClick={() => setFeedbackMessage(null)}
              className="text-emerald-400/70 hover:text-emerald-300 transition-colors p-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Top title & action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <span>Gestão de Usuários</span>
              <span className="text-xs font-normal text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
                {usersList.length} cadastrados
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Controle de acessos, status (ATIVO/INATIVO), redefinição de senhas e sistemas vinculados.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4 text-slate-950" />
            <span>Cadastrar Novo Usuário</span>
          </button>
        </div>

        {/* Search */}
        <div className="my-6">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar por nome, e-mail, empresa, sistema ou contrato..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-2xl border border-slate-800 bg-[#0d131f] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th scope="col" className="py-3.5 px-4">
                    Usuário / Nome
                  </th>
                  <th scope="col" className="py-3.5 px-4">
                    E-mail
                  </th>
                  <th scope="col" className="py-3.5 px-4">
                    Empresa / Contrato
                  </th>
                  <th scope="col" className="py-3.5 px-4">
                    Site / Sistema
                  </th>
                  <th scope="col" className="py-3.5 px-4 text-center">
                    Status
                  </th>
                  <th scope="col" className="py-3.5 px-4 text-center">
                    Perfil
                  </th>
                  <th scope="col" className="py-3.5 px-4 text-center">
                    Chamados
                  </th>
                  <th scope="col" className="py-3.5 px-4 text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      Nenhum usuário encontrado com os filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-slate-850/50 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-medium text-white">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span>{u.name}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px]">
                        {u.email}
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-slate-500" />
                          <span>{u.company}</span>
                          {u.contractNumber && (
                            <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                              {u.contractNumber}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        {u.systemUrl ? (
                          <div className="flex items-center gap-1.5 text-cyan-400">
                            <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            {u.systemUrl.startsWith("http") ? (
                              <a
                                href={u.systemUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline truncate max-w-[150px] inline-block"
                              >
                                {u.systemUrl.replace(/^https?:\/\//, "")}
                              </a>
                            ) : (
                              <span className="truncate max-w-[150px]">{u.systemUrl}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(u)}
                          disabled={actionUserId === u.id}
                          title={`Clique para alternar status (${u.status})`}
                          className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full border transition-all ${
                            u.status === "ATIVO"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                              : "bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20"
                          }`}
                        >
                          {u.status === "ATIVO" ? "ATIVO" : "INATIVO"}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            u.role === Role.SUPORTE
                              ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                              : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="font-semibold text-white">
                          {u.ticketsCount}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setResetPasswordTargetUser(u)}
                            title={`Redefinir senha de ${u.name}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>

                          {u.id !== user.userId && (
                            <button
                              onClick={() => handleDeleteUser(u)}
                              disabled={actionUserId === u.id}
                              title="Desativar e excluir cliente (Soft-delete)"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleUserCreated}
      />

      <ResetPasswordModal
        isOpen={!!resetPasswordTargetUser}
        user={resetPasswordTargetUser}
        onClose={() => setResetPasswordTargetUser(null)}
        onSuccess={() => {
          const userName = resetPasswordTargetUser?.name || "Usuário";
          setFeedbackMessage(`Senha de "${userName}" redefinida com sucesso!`);
          setTimeout(() => setFeedbackMessage(null), 5000);
        }}
      />
    </div>
  );
}


