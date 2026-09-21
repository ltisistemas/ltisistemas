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
  Layout,
  Globe,
  Users,
} from "lucide-react";
import { SessionPayload } from "@/lib/auth/session";
import { TicketSummary, TicketStats } from "@/lib/actions/ticket-actions";
import { StatusBadge } from "./StatusBadge";
import { SlaBadge } from "./SlaBadge";
import { SupportHeader } from "./SupportHeader";
import { CreateTicketModal, ClientOption } from "./CreateTicketModal";
import { CreateUserModal } from "./CreateUserModal";
import TicketSuccessModal from "./TicketSuccessModal";
import { TicketStatus } from "@prisma/client";

interface TicketsClientViewProps {
  user: SessionPayload;
  initialTickets: TicketSummary[];
  initialStats: TicketStats;
  clients?: ClientOption[];
}

export function TicketsClientView({
  user,
  initialTickets,
  initialStats,
  clients = [],
}: TicketsClientViewProps) {
  const router = useRouter();
  const [tickets, setTickets] = useState<TicketSummary[]>(initialTickets);
  const [stats, setStats] = useState<TicketStats>(initialStats);
  const [statusFilter, setStatusFilter] = useState<"ALL" | TicketStatus>("ALL");
  const [clientFilter, setClientFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [successModalInfo, setSuccessModalInfo] = useState<{ id: string; ticketNumber: number; code: string } | null>(null);

  const isSupport = user.role === "SUPORTE";

  // Filter tickets by status, client and search query
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesStatus =
        statusFilter === "ALL" ? true : ticket.status === statusFilter;

      const matchesClient =
        clientFilter === "ALL" || !clientFilter ? true : ticket.user.id === clientFilter;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesStatus && matchesClient;

      const matchesSearch =
        ticket.title.toLowerCase().includes(q) ||
        ticket.description.toLowerCase().includes(q) ||
        (ticket.screenName && ticket.screenName.toLowerCase().includes(q)) ||
        ticket.ticketNumber.toString().includes(q) ||
        (ticket.code && ticket.code.toLowerCase().includes(q)) ||
        ticket.user.name.toLowerCase().includes(q) ||
        ticket.user.company.toLowerCase().includes(q) ||
        (ticket.user.systemUrl && ticket.user.systemUrl.toLowerCase().includes(q)) ||
        (ticket.user.contractNumber &&
          ticket.user.contractNumber.toLowerCase().includes(q));

      return matchesStatus && matchesClient && matchesSearch;
    });
  }, [tickets, statusFilter, clientFilter, searchQuery]);

  const handleTicketCreated = (newTicketId: string, ticketNumber: number, ticketCode: string) => {
    setSuccessModalInfo({ id: newTicketId, ticketNumber, code: ticketCode });
    router.refresh();
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
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      {/* Top Header */}
      <SupportHeader
        user={user}
        onOpenNewTicket={() => setIsTicketModalOpen(true)}
        activeTab="chamados"
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome & Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
              <span>{isSupport ? "Painel Geral de Atendimento" : "Meus Chamados"}</span>
              <span className="text-xs font-semibold text-gray-600 bg-gray-200 px-2.5 py-1 rounded-full">
                {stats.total} {stats.total === 1 ? "chamado" : "chamados"}
              </span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isSupport
                ? "Visualize, gerencie e responda aos incidentes de todos os clientes e sistemas."
                : `Acompanhe o status e histórico de solicitações da ${user.company}.`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isSupport && (
              <button
                onClick={() => setIsUserModalOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-xs font-semibold shadow-sm transition-all"
              >
                <UserPlus className="w-4 h-4 text-white" />
                <span>Cadastrar Usuário</span>
              </button>
            )}

            <button
              onClick={() => setIsTicketModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#198754] hover:bg-[#157347] text-white text-xs font-bold shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span>Abrir Novo Chamado</span>
            </button>
          </div>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 my-6">
          {/* Total */}
          <div
            onClick={() => setStatusFilter("ALL")}
            className={`cursor-pointer rounded-xl p-4 border transition-all ${
              statusFilter === "ALL"
                ? "bg-white border-[#0d6efd] ring-2 ring-[#0d6efd]/20 shadow-sm"
                : "bg-white border-gray-200 hover:border-gray-300 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
              <span>Total Registrado</span>
              <Inbox className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
              {stats.total}
            </div>
          </div>

          {/* Abertos */}
          <div
            onClick={() => setStatusFilter(TicketStatus.ABERTO)}
            className={`cursor-pointer rounded-xl p-4 border transition-all ${
              statusFilter === TicketStatus.ABERTO
                ? "bg-white border-[#198754] ring-2 ring-[#198754]/20 shadow-sm"
                : "bg-white border-gray-200 hover:border-green-300 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between text-xs text-[#198754] font-medium">
              <span>Em Aberto</span>
              <AlertCircle className="w-4 h-4 text-[#198754]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#198754] mt-2">
              {stats.aberto}
            </div>
          </div>

          {/* Pendentes */}
          <div
            onClick={() => setStatusFilter(TicketStatus.PENDENTE)}
            className={`cursor-pointer rounded-xl p-4 border transition-all ${
              statusFilter === TicketStatus.PENDENTE
                ? "bg-white border-[#ffc107] ring-2 ring-[#ffc107]/20 shadow-sm"
                : "bg-white border-gray-200 hover:border-yellow-300 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between text-xs text-[#b58105] font-medium">
              <span>Pendentes</span>
              <Clock className="w-4 h-4 text-[#b58105]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#b58105] mt-2">
              {stats.pendente}
            </div>
          </div>

          {/* Fechados */}
          <div
            onClick={() => setStatusFilter(TicketStatus.FECHADO)}
            className={`cursor-pointer rounded-xl p-4 border transition-all ${
              statusFilter === TicketStatus.FECHADO
                ? "bg-white border-gray-500 ring-2 ring-gray-400/20 shadow-sm"
                : "bg-white border-gray-200 hover:border-gray-300 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
              <span>Resolvidos / Fechados</span>
              <CheckCircle2 className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-700 mt-2">
              {stats.fechado}
            </div>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 mb-6 bg-white p-3 rounded-xl border border-gray-200 shadow-xs">
          {/* Status Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-gray-100 border border-gray-200 overflow-x-auto">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                statusFilter === "ALL"
                  ? "bg-white text-[#0d6efd] shadow-xs font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Todos ({stats.total})
            </button>

            <button
              onClick={() => setStatusFilter(TicketStatus.ABERTO)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                statusFilter === TicketStatus.ABERTO
                  ? "bg-[#d1e7dd] text-[#0f5132] font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Abertos ({stats.aberto})
            </button>

            <button
              onClick={() => setStatusFilter(TicketStatus.PENDENTE)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                statusFilter === TicketStatus.PENDENTE
                  ? "bg-[#fff3cd] text-[#664d03] font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Pendentes ({stats.pendente})
            </button>

            <button
              onClick={() => setStatusFilter(TicketStatus.FECHADO)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                statusFilter === TicketStatus.FECHADO
                  ? "bg-[#e2e3e5] text-[#41464b] font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Fechados ({stats.fechado})
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            {/* Client Filter Dropdown (visible for SUPORTE) */}
            {isSupport && clients.length > 0 && (
              <div className="w-full sm:w-60">
                <select
                  aria-label="Filtrar por Cliente"
                  value={clientFilter}
                  onChange={(e) => setClientFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-[#0d6efd] focus:ring-1 focus:ring-[#0d6efd] transition-colors"
                >
                  <option value="ALL">Todos os Clientes</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.company}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Search box */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar chamado, tela, empresa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0d6efd] focus:ring-1 focus:ring-[#0d6efd] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Tickets List */}
        {filteredTickets.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center flex flex-col items-center justify-center shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
              <Inbox className="w-6 h-6" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">Nenhum chamado encontrado</h2>
            <p className="text-xs text-gray-500 mt-1 max-w-sm">
              {searchQuery || clientFilter !== "ALL"
                ? "Nenhum resultado corresponde aos filtros ou à sua pesquisa de busca."
                : "Não há chamados nesta categoria no momento."}
            </p>
            <button
              onClick={() => setIsTicketModalOpen(true)}
              className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#198754] hover:bg-[#157347] text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-white" />
              <span>Abrir Novo Chamado</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/suporte/chamados/${ticket.id}`}
                className="group block rounded-xl border border-gray-200 bg-white hover:border-[#0d6efd] hover:shadow-md p-4 sm:p-5 transition-all shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    {/* Ticket Hash Badge */}
                    <div className="shrink-0 font-mono text-xs font-bold text-[#0d6efd] bg-blue-50 border border-blue-200 px-2.5 py-1.5 rounded-lg">
                      {ticket.code}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-[#0d6efd] transition-colors">
                          {ticket.title}
                        </h2>
                        <StatusBadge status={ticket.status} size="sm" />
                        <SlaBadge slaDueAt={ticket.slaDueAt} ticketStatus={ticket.status} size="sm" />
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">
                          <Layout className="w-3 h-3 text-gray-500" />
                          Tela: {ticket.screenName}
                        </span>
                        {ticket.attachmentsCount > 0 && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">
                            <ImageIcon className="w-3 h-3 text-gray-500" />
                            {ticket.attachmentsCount}{" "}
                            {ticket.attachmentsCount === 1 ? "anexo" : "anexos"}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                        {ticket.description}
                      </p>

                      {/* Metadata row */}
                      <div className="flex items-center gap-4 text-[11px] text-gray-500 mt-2 flex-wrap">
                        {isSupport && (
                          <>
                            <span className="flex items-center gap-1 text-gray-700 font-medium">
                              <Building className="w-3 h-3 text-gray-400" />
                              {ticket.user.company}
                              {ticket.user.contractNumber && (
                                <span className="text-gray-400">
                                  ({ticket.user.contractNumber})
                                </span>
                              )}
                            </span>
                            {ticket.user.systemUrl && (
                              <span className="flex items-center gap-1 text-[#0d6efd]">
                                <Globe className="w-3 h-3 text-gray-400" />
                                {ticket.user.systemUrl.replace(/^https?:\/\//, "")}
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-gray-600">
                              <User className="w-3 h-3 text-gray-400" />
                              {ticket.user.name}
                            </span>
                          </>
                        )}
                        <span className="flex items-center gap-1 text-gray-500">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          Aberto em {formatDate(ticket.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end sm:self-center">
                    <span className="text-xs font-semibold text-[#0d6efd] group-hover:translate-x-1 transition-transform flex items-center gap-1">
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
        userRole={user.role}
        clients={clients}
      />

      {isSupport && (
        <CreateUserModal
          isOpen={isUserModalOpen}
          onClose={() => setIsUserModalOpen(false)}
          onSuccess={handleUserCreated}
        />
      )}

      {/* Ticket Success Confirmation Modal */}
      {successModalInfo && (
        <TicketSuccessModal
          isOpen={!!successModalInfo}
          ticketNumber={successModalInfo.ticketNumber}
          ticketCode={successModalInfo.code}
          ticketId={successModalInfo.id}
          onClose={() => setSuccessModalInfo(null)}
          onViewTicket={(id) => {
            setSuccessModalInfo(null);
            router.push(`/suporte/chamados/${id}`);
          }}
        />
      )}
    </div>
  );
}
