"use client";

import { useEffect } from "react";
import { X, Download, ZoomIn } from "lucide-react";

interface ImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  fileName?: string;
}

export function ImageLightboxModal({
  isOpen,
  onClose,
  imageUrl,
  fileName = "screenshot.png",
}: ImageLightboxModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Visualização da imagem do chamado"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar Controls */}
        <div className="w-full flex items-center justify-between pb-3 text-slate-200">
          <div className="flex items-center gap-2 text-sm font-medium truncate max-w-md">
            <ZoomIn className="w-4 h-4 text-cyan-400" />
            <span className="truncate">{fileName}</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={imageUrl}
              download={fileName}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-medium border border-slate-700"
              title="Baixar imagem"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar</span>
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-red-500/20 hover:text-red-400 text-slate-200 transition-colors border border-slate-700"
              title="Fechar (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Container */}
        <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-center shadow-2xl">
          <img
            src={imageUrl}
            alt={fileName}
            className="max-h-[80vh] max-w-full object-contain select-none"
          />
        </div>
      </div>
    </div>
  );
}
