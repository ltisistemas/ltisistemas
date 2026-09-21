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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <SupportHeader user={user} activeTab="usuarios" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Feedback notification toast / banner */}
        {feedbackMessage && (
          <div className="mb-6 p-4 rounded-xl bg-[#d1e7dd] border border-[#badbcc] text-[#0f5132] text-xs flex items-center justify-between animate-fadeIn shadow-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#198754] shrink-0" />
              <span className="font-semibold">{feedbackMessage}</span>
            </div>
            <button
              onClick={() => setFeedbackMessage(null)}
              className="text-[#0f5132]/70 hover:text-[#0f5132] transition-colors p-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Top title & action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
              <span>Gestão de Usuários</span>
              <span className="text-xs font-semibold text-gray-600 bg-gray-200 px-2.5 py-1 rounded-full">
                {usersList.length} cadastrados
              </span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Controle de acessos, status (ATIVO/INATIVO), redefinição de senhas e sistemas vinculados.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-xs font-bold shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4 text-white" />
            <span>Cadastrar Novo Usuário</span>
          </button>
        </div>

        {/* Search */}
        <div className="my-6">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar por nome, e-mail, empresa, sistema ou contrato..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-300 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0d6efd] focus:ring-1 focus:ring-[#0d6efd] transition-colors"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
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
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-400">
                      Nenhum usuário encontrado com os filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-gray-50/80 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-semibold text-gray-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0d6efd] flex items-center justify-center font-bold text-xs">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span>{u.name}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-gray-600 font-mono text-[11px]">
                        {u.email}
                      </td>

                      <td className="py-3.5 px-4 text-gray-700">
                        <div className="flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-gray-400" />
                          <span>{u.company}</span>
                          {u.contractNumber && (
                            <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                              {u.contractNumber}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-gray-700">
                        {u.systemUrl ? (
                          <div className="flex items-center gap-1.5 text-[#0d6efd]">
                            <Globe className="w-3.5 h-3.5 text-gray-400 shrink-0" />
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
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(u)}
                          disabled={actionUserId === u.id}
                          title={`Clique para alternar status (${u.status})`}
                          className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full border transition-all ${
                            u.status === "ATIVO"
                              ? "bg-[#d1e7dd] text-[#0f5132] border-[#badbcc] hover:bg-green-200"
                              : "bg-[#f8d7da] text-[#842029] border-[#f5c2c7] hover:bg-red-200"
                          }`}
                        >
                          {u.status === "ATIVO" ? "ATIVO" : "INATIVO"}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            u.role === Role.SUPORTE
                              ? "bg-blue-50 text-[#0d6efd] border-blue-200"
                              : "bg-green-50 text-[#198754] border-green-200"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="font-semibold text-gray-900">
                          {u.ticketsCount}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setResetPasswordTargetUser(u)}
                            title={`Redefinir senha de ${u.name}`}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-[#b58105] hover:bg-yellow-50 transition-colors"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>

                          {u.id !== user.userId && (
                            <button
                              onClick={() => handleDeleteUser(u)}
                              disabled={actionUserId === u.id}
                              title="Desativar e excluir cliente (Soft-delete)"
                              className="p-1.5 rounded-lg text-gray-400 hover:text-[#dc3545] hover:bg-red-50 transition-colors disabled:opacity-50"
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
