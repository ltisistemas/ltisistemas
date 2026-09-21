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
  ArrowLeft,
  ShieldAlert,
  Building,
  FileText,
} from "lucide-react";
import { logoutAction } from "@/lib/actions/auth-actions";
import { SessionPayload } from "@/lib/auth/session";

interface SupportHeaderProps {
  user: SessionPayload;
  onOpenNewTicket?: () => void;
  activeTab?: "chamados" | "usuarios";
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
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#080c14]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Portal Title */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="group flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors text-xs font-medium"
              title="Voltar ao site institucional"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Site</span>
            </Link>

            <div className="h-4 w-px bg-slate-800 hidden sm:block" />

            <Link href="/suporte/chamados" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20 text-slate-950 font-bold">
                <LifeBuoy className="w-5 h-5 text-slate-950" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm tracking-tight text-white">
                    LTI Sistemas
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      isSupport
                        ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    }`}
                  >
                    {isSupport ? "SUPORTE" : "CLIENTE"}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 truncate max-w-[160px] sm:max-w-xs">
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
                    ? "bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-850"
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
                      ? "bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-slate-850"
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Usuários</span>
                </Link>
              )}
            </nav>

            {/* Quick Open Ticket Button */}
            {onOpenNewTicket && (
              <button
                onClick={onOpenNewTicket}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-semibold shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <PlusCircle className="w-4 h-4 text-slate-950" />
                <span className="hidden sm:inline">Novo Chamado</span>
                <span className="sm:hidden">Novo</span>
              </button>
            )}

            {/* User Profile Summary */}
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-800 text-xs text-slate-300">
              <div className="flex flex-col text-right">
                <span className="font-medium text-white truncate max-w-[140px]">
                  {user.name}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 justify-end truncate max-w-[140px]">
                  <Building className="w-3 h-3 text-slate-500" />
                  {user.company}
                  {user.contractNumber && (
                    <span className="text-slate-500 text-[10px]">
                      ({user.contractNumber})
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors"
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
