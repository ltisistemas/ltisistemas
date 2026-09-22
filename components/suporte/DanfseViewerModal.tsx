"use client";

import React, { useState, useEffect } from "react";
import { X, Printer, Download, FileCode, Loader2, AlertCircle } from "lucide-react";
import { getDanfseDataAction } from "@/lib/actions/nfse-actions";
import { renderDanfseHtml } from "@/lib/services/nfse/danfse-generator";

interface DanfseViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId: string;
}

export function DanfseViewerModal({
  isOpen,
  onClose,
  invoiceId,
}: DanfseViewerModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [numeroNfse, setNumeroNfse] = useState<string>("");

  useEffect(() => {
    if (isOpen && invoiceId) {
      loadDanfse();
    }
  }, [isOpen, invoiceId]);

  async function loadDanfse() {
    setLoading(true);
    setError(null);
    try {
      const res = await getDanfseDataAction(invoiceId);
      if (!res.success || !res.data) {
        setError(res.error || "Não foi possível carregar o DANFSE.");
      } else {
        setNumeroNfse(res.data.numeroNfse);
        const html = renderDanfseHtml(res.data);
        setHtmlContent(html);
      }
    } catch (err: any) {
      setError(err.message || "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  function handlePrint() {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 300);
    }
  }

  function handleDownloadXml() {
    window.open(`/api/nfse/danfse/${invoiceId}?format=xml`, "_blank");
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-slate-100">
                Visualização do DANFSE {numeroNfse ? `— Nº ${numeroNfse}` : ""}
              </h3>
              <p className="text-xs text-slate-400">
                Documento Auxiliar da Nota Fiscal de Serviços Eletrônica
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadXml}
              className="flex items-center px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition"
              title="Baixar XML assinado da NFS-e"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Baixar XML
            </button>
            <button
              onClick={handlePrint}
              disabled={loading || Boolean(error)}
              className="flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition disabled:opacity-50"
              title="Imprimir ou Salvar PDF"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Imprimir / PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body with Rendered DANFSE */}
        <div className="flex-1 overflow-auto p-4 bg-slate-950 flex justify-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
              <p className="text-sm">Carregando dados da NFS-e...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-rose-400 max-w-md text-center">
              <AlertCircle className="w-10 h-10 mb-3 text-rose-500" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          ) : (
            <iframe
              srcDoc={htmlContent}
              title="DANFSE Preview"
              className="w-full h-[70vh] rounded-lg border border-slate-700 bg-white"
            />
          )}
        </div>
      </div>
    </div>
  );
}
