"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building,
  User,
  Mail,
  FileText,
  Calendar,
  Clock,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Maximize2,
  Download,
  Globe,
  Layout,
  Trash2,
} from "lucide-react";
import { SessionPayload } from "@/lib/auth/session";
import { TicketDetail, updateTicketStatusAction, deleteTicketAction } from "@/lib/actions/ticket-actions";
import { StatusBadge } from "./StatusBadge";
import { SlaBadge } from "./SlaBadge";
import { SupportHeader } from "./SupportHeader";
import { ImageLightboxModal } from "./ImageLightboxModal";
import { TicketStatus } from "@prisma/client";

interface TicketDetailClientViewProps {
  user: SessionPayload;
  initialTicket: TicketDetail;
}

export function TicketDetailClientView({
  user,
  initialTicket,
}: TicketDetailClientViewProps) {
  const router = useRouter();
  const [ticket, setTicket] = useState<TicketDetail>(initialTicket);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

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
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col">
      <SupportHeader user={user} activeTab="chamados" />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back link & Actions */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/suporte/chamados"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para a lista de chamados</span>
          </Link>

          <button
            onClick={handleDeleteTicket}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 text-xs font-medium transition-colors disabled:opacity-50"
            title="Excluir chamado (Soft-delete)"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? "Excluindo..." : "Excluir Chamado"}</span>
          </button>
        </div>

        {/* Status Error Alert */}
        {statusError && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{statusError}</span>
          </div>
        )}

        {/* Main Ticket Header Card */}
        <div className="rounded-2xl border border-slate-800 bg-[#0d131f] p-6 sm:p-8 shadow-xl mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-mono text-sm font-bold text-cyan-400 bg-cyan-950/50 border border-cyan-500/30 px-3 py-1 rounded-xl">
                  Chamado #{ticket.ticketNumber}
                </span>
                <StatusBadge status={ticket.status} size="lg" />
                <SlaBadge slaDueAt={ticket.slaDueAt} ticketStatus={ticket.status} size="lg" />
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-200 bg-slate-800/90 border border-slate-700 px-3 py-1 rounded-xl">
                  <Layout className="w-3.5 h-3.5 text-cyan-400" />
                  Tela: {ticket.screenName}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {ticket.title}
              </h1>
            </div>

            {/* Support Status Switcher Controls */}
            {isSupport && (
              <div className="flex flex-col items-start md:items-end gap-2">
                <span className="text-xs text-slate-400 font-medium">
                  Gerenciar Status do Chamado:
                </span>
                <div className="inline-flex items-center p-1 rounded-xl bg-slate-900 border border-slate-700/80 gap-1">
                  <button
                    onClick={() => handleStatusChange(TicketStatus.ABERTO)}
                    disabled={isUpdatingStatus}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      ticket.status === TicketStatus.ABERTO
                        ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                        : "text-slate-400 hover:text-emerald-400 hover:bg-slate-800"
                    }`}
                  >
                    Aberto
                  </button>

                  <button
                    onClick={() => handleStatusChange(TicketStatus.PENDENTE)}
                    disabled={isUpdatingStatus}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      ticket.status === TicketStatus.PENDENTE
                        ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                        : "text-slate-400 hover:text-amber-400 hover:bg-slate-800"
                    }`}
                  >
                    Pendente
                  </button>

                  <button
                    onClick={() => handleStatusChange(TicketStatus.FECHADO)}
                    disabled={isUpdatingStatus}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      ticket.status === TicketStatus.FECHADO
                        ? "bg-slate-600 text-white shadow-md"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    Fechado
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Metadata Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5 text-xs text-slate-400">
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-cyan-500 shrink-0" />
              <div>
                <span className="block text-slate-500 text-[10px]">Solicitante</span>
                <span className="text-slate-200 font-medium">{ticket.user.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Building className="w-4 h-4 text-cyan-500 shrink-0" />
              <div>
                <span className="block text-slate-500 text-[10px]">Empresa / Contrato</span>
                <span className="text-slate-200 font-medium">
                  {ticket.user.company}
                  {ticket.user.contractNumber ? ` (${ticket.user.contractNumber})` : ""}
                </span>
                {ticket.user.systemUrl && (
                  <span className="flex items-center gap-1 text-cyan-400 text-[11px] mt-0.5">
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
              <Calendar className="w-4 h-4 text-cyan-500 shrink-0" />
              <div>
                <span className="block text-slate-500 text-[10px]">Data de Abertura</span>
                <span className="text-slate-200 font-medium">{formatDate(ticket.createdAt)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-cyan-500 shrink-0" />
              <div>
                <span className="block text-slate-500 text-[10px]">Última Atualização</span>
                <span className="text-slate-200 font-medium">{formatDate(ticket.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Problem Description Card */}
        <div className="rounded-2xl border border-slate-800 bg-[#0d131f] p-6 sm:p-8 shadow-xl mb-6">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Descrição do Incidente</span>
          </h2>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
            {ticket.description}
          </div>
        </div>

        {/* Attachments / Screenshots Section */}
        <div className="rounded-2xl border border-slate-800 bg-[#0d131f] p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              <span>Evidências e Screenshots ({ticket.attachments.length})</span>
            </h2>
            {ticket.attachments.length > 0 && (
              <span className="text-xs text-slate-400">
                Clique na imagem para expandir
              </span>
            )}
          </div>

          {ticket.attachments.length === 0 ? (
            <div className="p-8 rounded-xl bg-slate-900/40 border border-slate-800/80 text-center text-xs text-slate-500">
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
                  className="group relative rounded-xl overflow-hidden border border-slate-800 hover:border-cyan-500/50 bg-slate-950 aspect-video cursor-pointer transition-all shadow-md hover:shadow-cyan-500/10"
                >
                  <img
                    src={att.base64Data}
                    alt={att.fileName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                    <Maximize2 className="w-5 h-5 text-cyan-400" />
                    <span className="text-xs font-semibold">Visualizar</span>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-[11px] text-slate-200 truncate">
                    {att.fileName}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

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
