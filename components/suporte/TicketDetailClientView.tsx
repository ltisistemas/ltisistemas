"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building,
  User,
  Calendar,
  Clock,
  Image as ImageIcon,
  AlertCircle,
  Maximize2,
  Globe,
  Layout,
  Trash2,
  FileText,
  Edit3,
  X,
  Loader2,
  Bug,
  Sparkles,
  RefreshCw,
  Save,
  Check,
} from "lucide-react";
import { SessionPayload } from "@/lib/auth/session";
import {
  TicketDetail,
  updateTicketStatusAction,
  updateTicketTypeAction,
  updateTicketDetailsAction,
  deleteTicketAction,
} from "@/lib/actions/ticket-actions";
import { StatusBadge } from "./StatusBadge";
import { SlaBadge } from "./SlaBadge";
import { TicketTypeBadge } from "./TicketTypeBadge";
import { SupportHeader } from "./SupportHeader";
import { ImageLightboxModal } from "./ImageLightboxModal";
import { OccurrenceTimeline, OriginBadge } from "./OccurrenceTimeline";
import { TicketStatus, TicketType } from "@prisma/client";
import { Activity } from "lucide-react";

interface TicketDetailClientViewProps {
  user: SessionPayload;
  initialTicket: TicketDetail;
}

const toLocalDatetimeInputValue = (date: Date | string) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export function TicketDetailClientView({
  user,
  initialTicket,
}: TicketDetailClientViewProps) {
  const router = useRouter();
  const [ticket, setTicket] = useState<TicketDetail>(initialTicket);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingType, setIsUpdatingType] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  // Edit / SLA Management Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editType, setEditType] = useState<TicketType>(initialTicket.type || TicketType.BUG);
  const [editTitle, setEditTitle] = useState(initialTicket.title);
  const [editScreenName, setEditScreenName] = useState(initialTicket.screenName);
  const [editCreatedAt, setEditCreatedAt] = useState(toLocalDatetimeInputValue(initialTicket.createdAt));
  const [editSlaDueAt, setEditSlaDueAt] = useState(toLocalDatetimeInputValue(initialTicket.slaDueAt));
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Lightbox state
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    fileName: string;
  } | null>(null);

  const isSupport = user.role === "SUPORTE";

  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (newStatus === ticket.status || isUpdatingStatus) return;

    setIsUpdatingStatus(true);
    setStatusError(null);

    try {
      const res = await updateTicketStatusAction(ticket.id, newStatus);
      if (!res.success || !res.data) {
        setStatusError(res.error || "Erro ao atualizar status.");
        setIsUpdatingStatus(false);
        return;
      }

      const updatedData = res.data;
      setTicket((prev) => ({
        ...prev,
        status: updatedData.status,
        updatedAt: new Date(),
      }));
      setIsUpdatingStatus(false);
      router.refresh();
    } catch (err) {
      console.error("Status update error:", err);
      setStatusError("Erro de comunicação com o servidor.");
      setIsUpdatingStatus(false);
    }
  };

  const handleQuickTypeToggle = async () => {
    const nextType = ticket.type === TicketType.BUG ? TicketType.FEATURE : TicketType.BUG;
    setIsUpdatingType(true);
    setStatusError(null);

    try {
      const res = await updateTicketTypeAction(ticket.id, nextType);
      if (!res.success || !res.data) {
        setStatusError(res.error || "Erro ao alterar tipo do chamado.");
        setIsUpdatingType(false);
        return;
      }

      setTicket((prev) => ({
        ...prev,
        type: res.data!.type,
        updatedAt: new Date(),
      }));
      setEditType(res.data!.type);
      setSuccessNotice(`Tipo alterado para ${res.data!.type === TicketType.FEATURE ? "Nova Funcionalidade" : "Bug"}!`);
      setTimeout(() => setSuccessNotice(null), 3000);
      setIsUpdatingType(false);
      router.refresh();
    } catch (err) {
      console.error("Type update error:", err);
      setStatusError("Erro ao alterar tipo do chamado.");
      setIsUpdatingType(false);
    }
  };

  const handleRecalculateSla = () => {
    if (!editCreatedAt) return;
    const opening = new Date(editCreatedAt);
    if (!isNaN(opening.getTime())) {
      const calculatedSla = new Date(opening.getTime() + 6 * 60 * 60 * 1000);
      setEditSlaDueAt(toLocalDatetimeInputValue(calculatedSla));
    }
  };

  const openEditModal = () => {
    setEditType(ticket.type || TicketType.BUG);
    setEditTitle(ticket.title);
    setEditScreenName(ticket.screenName);
    setEditCreatedAt(toLocalDatetimeInputValue(ticket.createdAt));
    setEditSlaDueAt(toLocalDatetimeInputValue(ticket.slaDueAt));
    setEditError(null);
    setIsEditModalOpen(true);
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);

    if (!editTitle.trim() || !editScreenName.trim()) {
      setEditError("Título e nome da tela são obrigatórios.");
      return;
    }

    setIsSavingDetails(true);

    try {
      const res = await updateTicketDetailsAction({
        ticketId: ticket.id,
        type: editType,
        title: editTitle,
        screenName: editScreenName,
        createdAt: isSupport && editCreatedAt ? new Date(editCreatedAt) : undefined,
        slaDueAt: isSupport && editSlaDueAt ? new Date(editSlaDueAt) : undefined,
      });

      if (!res.success || !res.data) {
        setEditError(res.error || "Erro ao atualizar dados do chamado.");
        setIsSavingDetails(false);
        return;
      }

      const updated = res.data;
      setTicket((prev) => ({
        ...prev,
        type: updated.type,
        title: updated.title,
        screenName: updated.screenName,
        createdAt: new Date(updated.createdAt),
        slaDueAt: new Date(updated.slaDueAt),
        updatedAt: new Date(),
      }));

      setIsSavingDetails(false);
      setIsEditModalOpen(false);
      setSuccessNotice("Chamado e SLA atualizados com sucesso!");
      setTimeout(() => setSuccessNotice(null), 4000);
      router.refresh();
    } catch (err) {
      console.error("Save details error:", err);
      setEditError("Erro ao salvar alterações.");
      setIsSavingDetails(false);
    }
  };

  const handleDeleteTicket = async () => {
    if (!confirm("Deseja realmente excluir este chamado? O chamado será arquivado logicamente via soft-delete.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await deleteTicketAction(ticket.id);
      if (res.success) {
        router.push("/suporte/chamados");
        router.refresh();
      } else {
        alert(res.error || "Erro ao excluir chamado.");
        setIsDeleting(false);
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir chamado.");
      setIsDeleting(false);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
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
      <SupportHeader user={user} activeTab="chamados" />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <button
            type="button"
            onClick={() => router.push("/suporte/chamados")}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-900 shadow-xs transition-all"
            aria-label="Voltar para a lista de chamados"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
            <span>Voltar para a lista de chamados</span>
          </button>

          <div className="flex items-center gap-2.5">
            {/* Edit / Manage SLA Button */}
            <button
              type="button"
              onClick={openEditModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-semibold shadow-xs transition-all"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#0d6efd]" />
              <span>{isSupport ? "Gerenciar Abertura & SLA" : "Editar Tipo / Detalhes"}</span>
            </button>

            <button
              type="button"
              onClick={handleDeleteTicket}
              disabled={isDeleting}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#dc3545] hover:bg-[#bb2d3b] text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
              title="Excluir chamado (Soft-delete)"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isDeleting ? "Excluindo..." : "Excluir Chamado"}</span>
            </button>
          </div>
        </div>

        {/* Success Notice */}
        {successNotice && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800 flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Status Error Alert */}
        {statusError && (
          <div className="mb-6 p-3 rounded-xl bg-[#f8d7da] border border-[#f5c2c7] text-xs text-[#842029] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#dc3545]" />
            <span>{statusError}</span>
          </div>
        )}

        {/* Main Ticket Header Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-mono text-xs sm:text-sm font-bold text-[#0d6efd] bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg">
                  {ticket.code}
                </span>

                {/* Ticket Type Badge with Quick Toggle */}
                <div className="inline-flex items-center gap-1.5">
                  <TicketTypeBadge type={ticket.type} size="lg" />
                  <button
                    type="button"
                    onClick={handleQuickTypeToggle}
                    disabled={isUpdatingType}
                    className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    title={`Alternar para ${ticket.type === TicketType.BUG ? "Nova Funcionalidade" : "Bug"}`}
                  >
                    {isUpdatingType ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-500" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <StatusBadge status={ticket.status} size="lg" />
                <SlaBadge slaDueAt={ticket.slaDueAt} ticketStatus={ticket.status} size="lg" />
                {ticket.origin && <OriginBadge origin={ticket.origin} />}
                {ticket.occurrenceCount > 1 && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-lg">
                    <Activity className="w-3.5 h-3.5" />
                    {ticket.occurrenceCount} ocorrências
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-200 px-3 py-1 rounded-lg">
                  <Layout className="w-3.5 h-3.5 text-gray-500" />
                  Tela: {ticket.screenName}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                {ticket.title}
              </h1>
            </div>

            {/* Support Status Switcher Controls (Bootstrap Semantic Colors) */}
            {isSupport && (
              <div className="flex flex-col items-start md:items-end gap-2">
                <span className="text-xs text-gray-500 font-medium">
                  Gerenciar Status do Chamado:
                </span>
                <div className="inline-flex items-center p-1 rounded-lg bg-gray-100 border border-gray-200 gap-1">
                  <button
                    onClick={() => handleStatusChange(TicketStatus.ABERTO)}
                    disabled={isUpdatingStatus}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      ticket.status === TicketStatus.ABERTO
                        ? "bg-[#198754] text-white shadow-xs"
                        : "text-gray-600 hover:text-[#198754] hover:bg-white"
                    }`}
                  >
                    Aberto
                  </button>

                  <button
                    onClick={() => handleStatusChange(TicketStatus.PENDENTE)}
                    disabled={isUpdatingStatus}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      ticket.status === TicketStatus.PENDENTE
                        ? "bg-[#ffc107] text-gray-900 shadow-xs"
                        : "text-gray-600 hover:text-[#b58105] hover:bg-white"
                    }`}
                  >
                    Pendente
                  </button>

                  <button
                    onClick={() => handleStatusChange(TicketStatus.FECHADO)}
                    disabled={isUpdatingStatus}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      ticket.status === TicketStatus.FECHADO
                        ? "bg-[#6c757d] text-white shadow-xs"
                        : "text-gray-600 hover:text-gray-900 hover:bg-white"
                    }`}
                  >
                    Fechado
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Metadata Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5 text-xs text-gray-600">
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-[#0d6efd] shrink-0" />
              <div>
                <span className="block text-gray-400 text-[10px]">Solicitante</span>
                <span className="text-gray-900 font-medium">{ticket.user.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Building className="w-4 h-4 text-[#0d6efd] shrink-0" />
              <div>
                <span className="block text-gray-400 text-[10px]">Empresa / Contrato</span>
                <span className="text-gray-900 font-medium">
                  {ticket.user.company}
                  {ticket.user.contractNumber ? ` (${ticket.user.contractNumber})` : ""}
                </span>
                {ticket.user.systemUrl && (
                  <span className="flex items-center gap-1 text-[#0d6efd] text-[11px] mt-0.5">
                    <Globe className="w-3 h-3" />
                    {ticket.user.systemUrl.startsWith("http") ? (
                      <a
                        href={ticket.user.systemUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {ticket.user.systemUrl.replace(/^https?:\/\//, "")}
                      </a>
                    ) : (
                      ticket.user.systemUrl
                    )}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-[#0d6efd] shrink-0" />
              <div>
                <span className="block text-gray-400 text-[10px]">Data de Abertura</span>
                <span className="text-gray-900 font-medium">{formatDate(ticket.createdAt)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#0d6efd] shrink-0" />
              <div>
                <span className="block text-gray-400 text-[10px]">Prazo Limite SLA (6h)</span>
                <span className="text-gray-900 font-medium">{formatDate(ticket.slaDueAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Problem Description Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs mb-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#0d6efd]" />
            <span>Descrição do Incidente</span>
          </h2>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
            {ticket.description}
          </div>
        </div>

        {/* Telemetry & Occurrences Timeline */}
        {ticket.occurrences && ticket.occurrences.length > 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs mb-6">
            <OccurrenceTimeline occurrences={ticket.occurrences} />
          </div>
        )}

        {/* Attachments / Screenshots Section */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#0d6efd]" />
              <span>Evidências e Screenshots ({ticket.attachments.length})</span>
            </h2>
            {ticket.attachments.length > 0 && (
              <span className="text-xs text-gray-500">
                Clique na imagem para expandir
              </span>
            )}
          </div>

          {ticket.attachments.length === 0 ? (
            <div className="p-8 rounded-xl bg-gray-50 border border-gray-200 text-center text-xs text-gray-500">
              Nenhuma imagem ou captura de tela foi anexada a este chamado.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {ticket.attachments.map((att) => (
                <div
                  key={att.id}
                  onClick={() =>
                    setSelectedImage({
                      url: att.base64Data,
                      fileName: att.fileName,
                    })
                  }
                  className="group relative rounded-xl overflow-hidden border border-gray-200 hover:border-[#0d6efd] bg-gray-100 aspect-video cursor-pointer transition-all shadow-xs hover:shadow-md"
                >
                  <img
                    src={att.base64Data}
                    alt={att.fileName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                    <Maximize2 className="w-5 h-5 text-white" />
                    <span className="text-xs font-semibold">Visualizar</span>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-[11px] text-white truncate">
                    {att.fileName}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Edit / Manage SLA Modal */}
      {isEditModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Gerenciar Abertura e SLA do Chamado"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                  {isSupport ? "Gerenciar Abertura & SLA" : "Editar Chamado"}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Ajuste o tipo, data/hora de abertura e controle de prazos de SLA.
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="mt-4 p-3 rounded-xl bg-[#f8d7da] border border-[#f5c2c7] flex items-start gap-2 text-xs text-[#842029]">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#dc3545] mt-0.5" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleSaveDetails} className="mt-4 space-y-4">
              {/* Type selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Tipo da Solicitação
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setEditType(TicketType.BUG)}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      editType === TicketType.BUG
                        ? "border-rose-400 bg-rose-50/80 text-rose-900 ring-2 ring-rose-400/20 shadow-xs font-semibold"
                        : "border-gray-200 bg-white hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-lg shrink-0 ${
                        editType === TicketType.BUG ? "bg-rose-600 text-white" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <Bug className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">Bug / Falha</div>
                      <div className="text-[10px] text-gray-500">Erro ou travamento</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditType(TicketType.FEATURE)}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      editType === TicketType.FEATURE
                        ? "border-purple-400 bg-purple-50/80 text-purple-900 ring-2 ring-purple-400/20 shadow-xs font-semibold"
                        : "border-gray-200 bg-white hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-lg shrink-0 ${
                        editType === TicketType.FEATURE ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">Nova Funcionalidade</div>
                      <div className="text-[10px] text-gray-500">Melhoria ou recurso</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Support SLA & Opening Date/Time Controls */}
              {isSupport && (
                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0d6efd] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Manejo de Datas & SLA (Equipe de Suporte)
                    </span>
                    <button
                      type="button"
                      onClick={handleRecalculateSla}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0d6efd] hover:underline"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Calcular SLA (+6h)</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Data e Hora de Abertura
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={editCreatedAt}
                        onChange={(e) => setEditCreatedAt(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0d6efd]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Prazo Limite do SLA
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={editSlaDueAt}
                        onChange={(e) => setEditSlaDueAt(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0d6efd]"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500">
                    Ajuste a data de abertura para sincronizar retroativamente e clique em &quot;Calcular SLA&quot; para definir o prazo de 6h.
                  </p>
                </div>
              )}

              {/* Title and Screen Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0d6efd]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Nome da Tela / Módulo
                  </label>
                  <input
                    type="text"
                    required
                    value={editScreenName}
                    onChange={(e) => setEditScreenName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0d6efd]"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSavingDetails}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSavingDetails}
                  className="px-5 py-2 rounded-lg bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSavingDetails ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5 text-white" />
                      <span>Salvar Alterações</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      <ImageLightboxModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage?.url || ""}
        fileName={selectedImage?.fileName || "screenshot.png"}
      />
    </div>
  );
}
