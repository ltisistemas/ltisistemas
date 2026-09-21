"use client";

import { useState, useRef, ChangeEvent } from "react";
import { X, Upload, Loader2, AlertCircle, Clock, UserCheck } from "lucide-react";
import { createTicketAction, AttachmentInput } from "@/lib/actions/ticket-actions";
import { compressImageToBase64 } from "@/lib/utils/image-compression";

export interface ClientOption {
  id: string;
  name: string;
  company: string;
  email: string;
}

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newTicketId: string, ticketNumber: number, ticketCode: string) => void;
  userRole?: "SUPORTE" | "CLIENTE";
  clients?: ClientOption[];
}

export function CreateTicketModal({
  isOpen,
  onClose,
  onSuccess,
  userRole,
  clients = [],
}: CreateTicketModalProps) {
  const [title, setTitle] = useState("");
  const [screenName, setScreenName] = useState("");
  const [targetUserId, setTargetUserId] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<AttachmentInput[]>([]);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const isSupport = userRole === "SUPORTE";

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const availableSlots = 3 - attachments.length;
    if (availableSlots <= 0) {
      setErrorMessage("Você já atingiu o limite de 3 anexos.");
      return;
    }

    const filesToProcess = Array.from(files).slice(0, availableSlots);
    setIsProcessingImages(true);
    setErrorMessage(null);

    try {
      const processedList: AttachmentInput[] = [];

      for (const file of filesToProcess) {
        if (!file.type.startsWith("image/")) {
          setErrorMessage("Apenas arquivos de imagem (PNG, JPG, WebP) são permitidos.");
          continue;
        }

        const compressed = await compressImageToBase64(file, 1200, 1200, 0.85);
        processedList.push(compressed);
      }

      setAttachments((prev) => [...prev, ...processedList]);
    } catch (err: any) {
      console.error("Compression error:", err);
      setErrorMessage(err.message || "Falha ao processar as imagens.");
    } finally {
      setIsProcessingImages(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveAttachment = (indexToRemove: number) => {
    setAttachments((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim() || !screenName.trim() || !description.trim()) {
      setErrorMessage("Por favor, preencha o título, o nome da tela e a descrição do incidente.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await createTicketAction({
        title,
        screenName,
        description,
        targetUserId: isSupport && targetUserId ? targetUserId : undefined,
        attachments,
      });

      if (!res.success || !res.data) {
        setErrorMessage(res.error || "Não foi possível abrir o chamado.");
        setIsSubmitting(false);
        return;
      }

      // Reset fields
      setTitle("");
      setScreenName("");
      setTargetUserId("");
      setDescription("");
      setAttachments([]);
      setIsSubmitting(false);

      onSuccess(res.data.id, res.data.ticketNumber, res.data.code);
      onClose();
    } catch (err) {
      console.error("Submit ticket error:", err);
      setErrorMessage("Erro de rede ou servidor ao criar o chamado.");
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Abrir Novo Chamado"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
              Abrir Novo Chamado de Suporte
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Descreva o incidente ou solicitação técnica para nossa equipe.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Fechar formulário"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SLA Info Banner */}
        <div className="mt-4 p-3 rounded-xl bg-[#cff4fc] border border-[#b6effb] flex items-center gap-2.5 text-xs text-[#055160]">
          <Clock className="w-4 h-4 text-[#0dcaf0] shrink-0" />
          <span>
            <strong>SLA de 6 horas para análise:</strong> Sua solicitação receberá atendimento e primeira avaliação técnica em até 6 horas úteis.
          </span>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-[#f8d7da] border border-[#f5c2c7] flex items-start gap-2.5 text-xs text-[#842029]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#dc3545]" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Client selector (visible for SUPORTE) */}
          {isSupport && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Cliente Solicitante <span className="text-gray-400 font-normal">(opcional - vincular ao chamado)</span>
              </label>
              <div className="relative">
                <select
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-[#0d6efd] focus:ring-1 focus:ring-[#0d6efd] transition-colors"
                >
                  <option value="">Aberto em meu nome (Suporte)</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.company} ({c.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Título do Incidente <span className="text-[#dc3545]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Erro ao gerar relatório"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0d6efd] focus:ring-1 focus:ring-[#0d6efd] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Nome da Tela / Módulo <span className="text-[#dc3545]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Tela de associados / Produtos"
                value={screenName}
                onChange={(e) => setScreenName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0d6efd] focus:ring-1 focus:ring-[#0d6efd] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Descritivo Detalhado <span className="text-[#dc3545]">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Explique o que aconteceu na tela, passos para reproduzir o erro e o comportamento esperado..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0d6efd] focus:ring-1 focus:ring-[#0d6efd] transition-colors resize-none"
            />
          </div>

          {/* Attachments Section */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-700">
                Evidências / Prints (Até 3 fotos)
              </label>
              <span className="text-[11px] text-gray-500">
                {attachments.length}/3 imagens
              </span>
            </div>

            {/* Thumbnail previews */}
            {attachments.length > 0 && (
              <div className="grid grid-cols-3 gap-2.5 mb-3">
                {attachments.map((att, index) => (
                  <div
                    key={index}
                    className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-100 aspect-video flex items-center justify-center shadow-sm"
                  >
                    <img
                      src={att.base64Data}
                      alt={att.fileName}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(index)}
                      className="absolute top-1 right-1 p-1 rounded-md bg-black/70 hover:bg-[#dc3545] text-white transition-colors opacity-90 group-hover:opacity-100"
                      title="Remover anexo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-1 left-1 right-1 text-[10px] text-white bg-black/70 px-1 py-0.5 rounded truncate">
                      {att.fileName}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* File Upload Trigger */}
            {attachments.length < 3 && (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/webp"
                  multiple
                  className="hidden"
                  id="ticket-photo-upload"
                  disabled={isProcessingImages || isSubmitting}
                />
                <label
                  htmlFor="ticket-photo-upload"
                  className="w-full border-2 border-dashed border-gray-300 hover:border-[#0d6efd] rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-gray-50 hover:bg-gray-100/80 transition-all text-center group"
                >
                  {isProcessingImages ? (
                    <div className="flex items-center gap-2 text-[#0d6efd] text-xs py-1">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Comprimindo imagem...</span>
                    </div>
                  ) : (
                    <>
                      <div className="p-1.5 rounded-lg bg-gray-200 text-gray-600 group-hover:text-[#0d6efd] group-hover:bg-blue-50 transition-colors">
                        <Upload className="w-4 h-4" />
                      </div>
                      <span className="text-xs text-gray-700 font-medium group-hover:text-gray-900">
                        Clique para anexar print ou arraste uma imagem
                      </span>
                      <span className="text-[10px] text-gray-500">
                        PNG, JPG ou WebP (otimização automática)
                      </span>
                    </>
                  )}
                </label>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting || isProcessingImages}
              className="px-5 py-2 rounded-lg bg-[#198754] hover:bg-[#157347] text-white text-sm font-semibold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Enviando Chamado...</span>
                </>
              ) : (
                <span>Criar Chamado</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
