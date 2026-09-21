"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  LifeBuoy,
  LogOut,
  Users,
  PlusCircle,
  Layers,
  Building,
  FileBarChart,
} from "lucide-react";
import { logoutAction } from "@/lib/actions/auth-actions";
import { SessionPayload } from "@/lib/auth/session";

interface SupportHeaderProps {
  user: SessionPayload;
  onOpenNewTicket?: () => void;
  activeTab?: "chamados" | "usuarios" | "relatorios";
}

export function SupportHeader({
  user,
  onOpenNewTicket,
  activeTab = "chamados",
}: SupportHeaderProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const isSupport = user.role === "SUPORTE";

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logoutAction();
      router.push("/suporte/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Portal Title */}
          <div className="flex items-center gap-4">
            <Link href="/suporte/chamados" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0d6efd] flex items-center justify-center shadow-sm text-white font-bold">
                <LifeBuoy className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm tracking-tight text-gray-900">
                    LTI Sistemas
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      isSupport
                        ? "bg-blue-50 text-[#0d6efd] border-blue-200"
                        : "bg-green-50 text-[#198754] border-green-200"
                    }`}
                  >
                    {isSupport ? "SUPORTE" : "CLIENTE"}
                  </span>
                </div>
                <span className="text-[11px] text-gray-500 truncate max-w-[160px] sm:max-w-xs">
                  {isSupport ? "Console de Atendimento" : "Central de Incidentes"}
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-2 sm:gap-3">
            <nav className="flex items-center gap-1.5 mr-2">
              <Link
                href="/suporte/chamados"
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === "chamados"
                    ? "bg-blue-50 text-[#0d6efd] border border-blue-200 shadow-xs font-semibold"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Chamados</span>
              </Link>

              {isSupport && (
                <Link
                  href="/suporte/usuarios"
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === "usuarios"
                      ? "bg-blue-50 text-[#0d6efd] border border-blue-200 shadow-xs font-semibold"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Usuários</span>
                </Link>
              )}

              <Link
                href="/suporte/relatorios"
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === "relatorios"
                    ? "bg-blue-50 text-[#0d6efd] border border-blue-200 shadow-xs font-semibold"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <FileBarChart className="w-3.5 h-3.5" />
                <span>Relatórios</span>
              </Link>
            </nav>

            {/* Quick Open Ticket Button (Bootstrap Success) */}
            {onOpenNewTicket && (
              <button
                onClick={onOpenNewTicket}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#198754] hover:bg-[#157347] text-white text-xs font-semibold shadow-sm transition-all"
              >
                <PlusCircle className="w-4 h-4 text-white" />
                <span className="hidden sm:inline">Novo Chamado</span>
                <span className="sm:hidden">Novo</span>
              </button>
            )}

            {/* User Profile Summary */}
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-gray-200 text-xs text-gray-700">
              <div className="flex flex-col text-right">
                <span className="font-semibold text-gray-900 truncate max-w-[140px]">
                  {user.name}
                </span>
                <span className="text-[11px] text-gray-500 flex items-center gap-1 justify-end truncate max-w-[140px]">
                  <Building className="w-3 h-3 text-gray-400" />
                  {user.company}
                  {user.contractNumber && (
                    <span className="text-gray-400 text-[10px]">
                      ({user.contractNumber})
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Logout Button (Bootstrap Danger on hover) */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="p-2 rounded-lg text-gray-400 hover:text-[#dc3545] hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
              title="Encerrar sessão"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
