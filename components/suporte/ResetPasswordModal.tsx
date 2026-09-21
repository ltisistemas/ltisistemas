"use client";

import { useState } from "react";
import {
  X,
  KeyRound,
  Eye,
  EyeOff,
  Wand2,
  Copy,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { resetUserPasswordAction } from "@/lib/actions/auth-actions";

interface ResetPasswordTargetUser {
  id: string;
  name: string;
  email: string;
  company: string;
}

interface ResetPasswordModalProps {
  isOpen: boolean;
  user: ResetPasswordTargetUser | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ResetPasswordModal({
  isOpen,
  user,
  onClose,
  onSuccess,
}: ResetPasswordModalProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !user) return null;

  const generateRandomPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
    let gen = "";
    for (let i = 0; i < 12; i++) {
      gen += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(gen);
    setShowPassword(true);
    setErrorMessage(null);
  };

  const handleCopyPassword = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard copy error:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password.trim().length < 6) {
      setErrorMessage("A nova senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await resetUserPasswordAction(user.id, password);
      if (!res.success) {
        setErrorMessage(res.error || "Erro ao redefinir senha.");
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setPassword("");
      setShowPassword(false);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Reset password error:", err);
      setErrorMessage("Erro inesperado ao redefinir a senha.");
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setPassword("");
    setShowPassword(false);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Redefinir Senha do Cliente"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-yellow-50 border border-yellow-200 flex items-center justify-center text-[#b58105]">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 tracking-tight">
                Redefinir Senha
              </h2>
              <p className="text-xs text-gray-500">
                Altere as credenciais de acesso do cliente
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card Info */}
        <div className="mt-4 p-3 rounded-xl bg-gray-50 border border-gray-200 flex flex-col gap-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Cliente:</span>
            <span className="font-semibold text-gray-900 truncate max-w-[200px]">
              {user.name}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">E-mail:</span>
            <span className="font-mono text-[#0d6efd] text-[11px] truncate max-w-[200px]">
              {user.email}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Empresa:</span>
            <span className="text-gray-700 truncate max-w-[200px]">
              {user.company}
            </span>
          </div>
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
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-700">
                Nova Senha <span className="text-[#dc3545]">*</span>
              </label>
              <button
                type="button"
                onClick={generateRandomPassword}
                className="text-[11px] text-[#b58105] hover:text-[#8f6300] font-semibold inline-flex items-center gap-1 hover:underline transition-colors"
              >
                <Wand2 className="w-3 h-3" />
                <span>Gerar Senha Forte</span>
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-3.5 pr-20 py-2.5 rounded-xl bg-white border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#ffc107] focus:ring-1 focus:ring-[#ffc107] transition-colors"
              />

              <div className="absolute right-2 top-2 flex items-center gap-1">
                {password && (
                  <button
                    type="button"
                    onClick={handleCopyPassword}
                    title="Copiar senha"
                    className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-[#198754]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Ocultar senha" : "Ver senha"}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-[#ffc107] hover:bg-[#ffca2c] text-gray-900 text-sm font-semibold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-900" />
                  <span>Salvando...</span>
                </>
              ) : (
                <span>Atualizar Senha</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
