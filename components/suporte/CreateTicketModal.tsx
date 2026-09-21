"use client";

import { useState, useRef, ChangeEvent } from "react";
import { X, Upload, Image as ImageIcon, Loader2, AlertCircle, CheckCircle2, Layout, Clock } from "lucide-react";
import { createTicketAction, AttachmentInput } from "@/lib/actions/ticket-actions";
import { compressImageToBase64 } from "@/lib/utils/image-compression";

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newTicketId: string, ticketNumber: number) => void;
}

export function CreateTicketModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateTicketModalProps) {
  const [title, setTitle] = useState("");
  const [screenName, setScreenName] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<AttachmentInput[]>([]);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

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
      setDescription("");
      setAttachments([]);
      setIsSubmitting(false);

      onSuccess(res.data.id, res.data.ticketNumber);
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-[#0d131f] p-6 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Abrir Novo Chamado de Suporte
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Descreva o incidente ou solicitação técnica para nossa equipe.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SLA Info Banner */}
        <div className="mt-4 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/25 flex items-center gap-2.5 text-xs text-cyan-300">
          <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong>SLA de 6 horas para análise:</strong> Sua solicitação receberá atendimento e primeira avaliação técnica em até 6 horas úteis.
          </span>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/25 flex items-start gap-2.5 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Título do Incidente <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Erro ao gerar relatório"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nome da Tela / Módulo <span className="text-cyan-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Ex: Tela de associados / Produtos"
                  value={screenName}
                  onChange={(e) => setScreenName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Descritivo Detalhado <span className="text-cyan-400">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Explique o que aconteceu na tela, passos para reproduzir o erro e o comportamento esperado..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors resize-none"
            />
          </div>

          {/* Attachments Section */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Evidências / Prints (Até 3 fotos)
              </label>
              <span className="text-[11px] text-slate-400">
                {attachments.length}/3 imagens
              </span>
            </div>

            {/* Thumbnail previews */}
            {attachments.length > 0 && (
              <div className="grid grid-cols-3 gap-2.5 mb-3">
                {attachments.map((att, index) => (
                  <div
                    key={index}
                    className="relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-950 aspect-video flex items-center justify-center shadow-inner"
                  >
                    <img
                      src={att.base64Data}
                      alt={att.fileName}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(index)}
                      className="absolute top-1 right-1 p-1 rounded-md bg-black/70 hover:bg-red-600 text-white transition-colors opacity-90 group-hover:opacity-100"
                      title="Remover anexo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-1 left-1 right-1 text-[10px] text-white/90 bg-black/60 px-1 py-0.5 rounded truncate">
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
                  className="w-full border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition-all text-center group"
                >
                  {isProcessingImages ? (
                    <div className="flex items-center gap-2 text-cyan-400 text-xs py-1">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Comprimindo imagem...</span>
                    </div>
                  ) : (
                    <>
                      <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400 group-hover:text-cyan-400 transition-colors">
                        <Upload className="w-4 h-4" />
                      </div>
                      <span className="text-xs text-slate-300 font-medium group-hover:text-white">
                        Clique para anexar print ou arraste uma imagem
                      </span>
                      <span className="text-[10px] text-slate-500">
                        PNG, JPG ou WebP (otimização automática)
                      </span>
                    </>
                  )}
                </label>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting || isProcessingImages}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-semibold shadow-md shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
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
