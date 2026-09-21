"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LifeBuoy,
  PlusCircle,
  Search,
  Filter,
  Image as ImageIcon,
  Building,
  User,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  UserPlus,
  Inbox,
  FileText,
  Globe,
  Layout,
} from "lucide-react";
import { SessionPayload } from "@/lib/auth/session";
import { TicketSummary, TicketStats } from "@/lib/actions/ticket-actions";
import { StatusBadge } from "./StatusBadge";
import { SlaBadge } from "./SlaBadge";
import { SupportHeader } from "./SupportHeader";
import { CreateTicketModal } from "./CreateTicketModal";
import { CreateUserModal } from "./CreateUserModal";
import { TicketStatus } from "@prisma/client";

interface TicketsClientViewProps {
  user: SessionPayload;
  initialTickets: TicketSummary[];
  initialStats: TicketStats;
}

export function TicketsClientView({
  user,
  initialTickets,
  initialStats,
}: TicketsClientViewProps) {
  const router = useRouter();
  const [tickets, setTickets] = useState<TicketSummary[]>(initialTickets);
  const [stats, setStats] = useState<TicketStats>(initialStats);
  const [statusFilter, setStatusFilter] = useState<"ALL" | TicketStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const isSupport = user.role === "SUPORTE";

  // Filter tickets by active tab and search query
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesStatus =
        statusFilter === "ALL" ? true : ticket.status === statusFilter;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesStatus;

      const matchesSearch =
        ticket.title.toLowerCase().includes(q) ||
        ticket.description.toLowerCase().includes(q) ||
        (ticket.screenName && ticket.screenName.toLowerCase().includes(q)) ||
        ticket.ticketNumber.toString().includes(q) ||
        ticket.user.name.toLowerCase().includes(q) ||
        ticket.user.company.toLowerCase().includes(q) ||
        (ticket.user.systemUrl && ticket.user.systemUrl.toLowerCase().includes(q)) ||
        (ticket.user.contractNumber &&
          ticket.user.contractNumber.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });
  }, [tickets, statusFilter, searchQuery]);

  const handleTicketCreated = (newTicketId: string) => {
    router.refresh();
    router.push(`/suporte/chamados/${newTicketId}`);
  };

  const handleUserCreated = () => {
    router.refresh();
  };

  const formatDate = (dateString: Date | string) => {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col">
      {/* Top Header */}
      <SupportHeader
        user={user}
        onOpenNewTicket={() => setIsTicketModalOpen(true)}
        activeTab="chamados"
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome & Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <span>{isSupport ? "Painel Geral de Atendimento" : "Meus Chamados"}</span>
              <span className="text-xs font-normal text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
                {stats.total} {stats.total === 1 ? "chamado" : "chamados"}
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {isSupport
                ? "Visualize, gerencie e responda aos incidentes de todos os clientes e sistemas."
                : `Acompanhe o status e histórico de solicitações da ${user.company}.`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isSupport && (
              <button
                onClick={() => setIsUserModalOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
              >
                <UserPlus className="w-4 h-4 text-cyan-400" />
                <span>Cadastrar Usuário</span>
              </button>
            )}

            <button
              onClick={() => setIsTicketModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>Abrir Novo Chamado</span>
            </button>
          </div>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 my-6">
          {/* Total */}
          <div
            onClick={() => setStatusFilter("ALL")}
            className={`cursor-pointer rounded-2xl p-4 border transition-all ${
              statusFilter === "ALL"
                ? "bg-slate-800/90 border-cyan-500/50 shadow-md shadow-cyan-500/10"
                : "bg-[#0d131f] border-slate-800 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Total Registrado</span>
              <Inbox className="w-4 h-4 text-slate-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white mt-2">
              {stats.total}
            </div>
          </div>

          {/* Abertos */}
          <div
            onClick={() => setStatusFilter(TicketStatus.ABERTO)}
            className={`cursor-pointer rounded-2xl p-4 border transition-all ${
              statusFilter === TicketStatus.ABERTO
                ? "bg-emerald-950/30 border-emerald-500/50 shadow-md shadow-emerald-500/10"
                : "bg-[#0d131f] border-slate-800 hover:border-emerald-500/30"
            }`}
          >
            <div className="flex items-center justify-between text-xs text-emerald-400 font-medium">
              <span>Em Aberto</span>
              <AlertCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mt-2">
              {stats.aberto}
            </div>
          </div>

          {/* Pendentes */}
          <div
            onClick={() => setStatusFilter(TicketStatus.PENDENTE)}
            className={`cursor-pointer rounded-2xl p-4 border transition-all ${
              statusFilter === TicketStatus.PENDENTE
                ? "bg-amber-950/30 border-amber-500/50 shadow-md shadow-amber-500/10"
                : "bg-[#0d131f] border-slate-800 hover:border-amber-500/30"
            }`}
          >
            <div className="flex items-center justify-between text-xs text-amber-400 font-medium">
              <span>Pendentes</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-400 mt-2">
              {stats.pendente}
            </div>
          </div>

          {/* Fechados */}
          <div
            onClick={() => setStatusFilter(TicketStatus.FECHADO)}
            className={`cursor-pointer rounded-2xl p-4 border transition-all ${
              statusFilter === TicketStatus.FECHADO
                ? "bg-slate-800/90 border-slate-600 shadow-md"
                : "bg-[#0d131f] border-slate-800 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Resolvidos / Fechados</span>
              <CheckCircle2 className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-300 mt-2">
              {stats.fechado}
            </div>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          {/* Status Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                statusFilter === "ALL"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Todos ({stats.total})
            </button>

            <button
              onClick={() => setStatusFilter(TicketStatus.ABERTO)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                statusFilter === TicketStatus.ABERTO
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Abertos ({stats.aberto})
            </button>

            <button
              onClick={() => setStatusFilter(TicketStatus.PENDENTE)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                statusFilter === TicketStatus.PENDENTE
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Pendentes ({stats.pendente})
            </button>

            <button
              onClick={() => setStatusFilter(TicketStatus.FECHADO)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                statusFilter === TicketStatus.FECHADO
                  ? "bg-slate-700/60 text-slate-300 border border-slate-600"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Fechados ({stats.fechado})
            </button>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar chamado, tela, empresa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Tickets List */}
        {filteredTickets.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-[#0d131f]/70 p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 mb-4">
              <Inbox className="w-6 h-6" />
            </div>
            <h2 className="text-base font-semibold text-white">Nenhum chamado encontrado</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              {searchQuery
                ? "Nenhum resultado corresponde à sua pesquisa de busca."
                : "Não há chamados nesta categoria no momento."}
            </p>
            <button
              onClick={() => setIsTicketModalOpen(true)}
              className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Abrir Novo Chamado</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/suporte/chamados/${ticket.id}`}
                className="group block rounded-2xl border border-slate-800/90 bg-[#0d131f] hover:bg-slate-900/90 hover:border-cyan-500/40 p-4 sm:p-5 transition-all shadow-sm hover:shadow-lg hover:shadow-cyan-500/5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    {/* Ticket Number Badge */}
                    <div className="shrink-0 font-mono text-xs font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-2.5 py-1.5 rounded-xl">
                      #{ticket.ticketNumber}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="text-sm sm:text-base font-semibold text-white group-hover:text-cyan-300 transition-colors">
                          {ticket.title}
                        </h2>
                        <StatusBadge status={ticket.status} size="sm" />
                        <SlaBadge slaDueAt={ticket.slaDueAt} ticketStatus={ticket.status} size="sm" />
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700">
                          <Layout className="w-3 h-3 text-cyan-400" />
                          Tela: {ticket.screenName}
                        </span>
                        {ticket.attachmentsCount > 0 && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700">
                            <ImageIcon className="w-3 h-3 text-cyan-400" />
                            {ticket.attachmentsCount}{" "}
                            {ticket.attachmentsCount === 1 ? "anexo" : "anexos"}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                        {ticket.description}
                      </p>

                      {/* Metadata row */}
                      <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-2 flex-wrap">
                        {isSupport && (
                          <>
                            <span className="flex items-center gap-1 text-slate-400 font-medium">
                              <Building className="w-3 h-3 text-slate-500" />
                              {ticket.user.company}
                              {ticket.user.contractNumber && (
                                <span className="text-slate-500">
                                  ({ticket.user.contractNumber})
                                </span>
                              )}
                            </span>
                            {ticket.user.systemUrl && (
                              <span className="flex items-center gap-1 text-cyan-400">
                                <Globe className="w-3 h-3 text-slate-500" />
                                {ticket.user.systemUrl.replace(/^https?:\/\//, "")}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3 text-slate-500" />
                              {ticket.user.name}
                            </span>
                          </>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          Aberto em {formatDate(ticket.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end sm:self-center">
                    <span className="text-xs font-medium text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      <span>Ver detalhes</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <CreateTicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        onSuccess={handleTicketCreated}
      />

      {isSupport && (
        <CreateUserModal
          isOpen={isUserModalOpen}
          onClose={() => setIsUserModalOpen(false)}
          onSuccess={handleUserCreated}
        />
      )}
    </div>
  );
}
