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
  Shield,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { logoutAction } from "@/lib/actions/auth-actions";
import { SessionPayload } from "@/lib/auth/session";

interface SupportHeaderProps {
  user: SessionPayload;
  onOpenNewTicket?: () => void;
  activeTab?: "chamados" | "usuarios" | "relatorios" | "cliente";
  counts?: {
    clients?: number;
    contracts?: number;
    tickets?: number;
  };
}

export function SupportHeader({
  user,
  onOpenNewTicket,
  activeTab = "chamados",
  counts,
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

  const getInitials = (name: string) => {
    if (!name) return "LT";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-[#111622] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Portal Title */}
          <div className="flex items-center gap-6">
            <Link
              href={isSupport ? "/suporte/usuarios" : "/suporte/cliente"}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md text-white font-bold group-hover:scale-105 transition-transform">
                <LifeBuoy className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm tracking-tight text-white group-hover:text-blue-400 transition-colors">
                    LTI Sistemas
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      isSupport
                        ? "bg-blue-950/80 text-blue-300 border-blue-800"
                        : "bg-emerald-950/80 text-emerald-300 border-emerald-800"
                    }`}
                  >
                    {isSupport ? "SUPORTE" : "CLIENTE"}
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 truncate max-w-[160px] sm:max-w-xs">
                  {isSupport ? "Console de Atendimento" : "Central do Cliente 360°"}
                </span>
              </div>
            </Link>

            {/* Navigation Pills (Tiimi Style) */}
            <nav className="hidden md:flex items-center gap-1.5 bg-[#1b2234] p-1 rounded-xl border border-gray-800 text-xs">
              {isSupport ? (
                <>
                  <Link
                    href="/suporte/usuarios"
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                      activeTab === "usuarios"
                        ? "bg-blue-600 text-white shadow-sm font-semibold"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Clientes</span>
                    {counts?.clients !== undefined && (
                      <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-bold">
                        {counts.clients}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/suporte/chamados"
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                      activeTab === "chamados"
                        ? "bg-blue-600 text-white shadow-sm font-semibold"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Chamados</span>
                    {counts?.tickets !== undefined && (
                      <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/30 text-amber-300 font-bold">
                        {counts.tickets}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/suporte/relatorios"
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                      activeTab === "relatorios"
                        ? "bg-blue-600 text-white shadow-sm font-semibold"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <FileBarChart className="w-3.5 h-3.5" />
                    <span>Relatórios</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/suporte/cliente"
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                      activeTab === "cliente"
                        ? "bg-emerald-600 text-white shadow-sm font-semibold"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Meu Hub 360°</span>
                  </Link>

                  <Link
                    href="/suporte/chamados"
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                      activeTab === "chamados"
                        ? "bg-emerald-600 text-white shadow-sm font-semibold"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Meus Chamados</span>
                  </Link>

                  <Link
                    href="/suporte/relatorios"
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                      activeTab === "relatorios"
                        ? "bg-emerald-600 text-white shadow-sm font-semibold"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <FileBarChart className="w-3.5 h-3.5" />
                    <span>Relatórios</span>
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Right Action and Profile Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Open Ticket Button */}
            {onOpenNewTicket && (
              <button
                onClick={onOpenNewTicket}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                <PlusCircle className="w-4 h-4 text-white" />
                <span className="hidden sm:inline">Novo Chamado</span>
                <span className="sm:hidden">Novo</span>
              </button>
            )}

            {/* User Profile Badge */}
            <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-gray-800 text-xs">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-blue-500/30">
                {getInitials(user.name)}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="font-semibold text-gray-100 truncate max-w-[130px] leading-tight">
                  {user.name}
                </span>
                <span className="text-[11px] text-gray-400 flex items-center gap-1 truncate max-w-[130px]">
                  <Building className="w-3 h-3 text-gray-500 shrink-0" />
                  {user.company}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="p-2 rounded-lg text-white/80 hover:text-rose-300 hover:bg-rose-950/40 border border-transparent hover:border-rose-900/50 transition-colors"
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

