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
  ShieldAlert,
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-[#0d131f] p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Redefinir Senha
              </h2>
              <p className="text-xs text-slate-400">
                Altere as credenciais de acesso do cliente
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Card Info */}
        <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Cliente:</span>
            <span className="font-semibold text-white truncate max-w-[200px]">
              {user.name}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">E-mail:</span>
            <span className="font-mono text-cyan-400 text-[11px] truncate max-w-[200px]">
              {user.email}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Empresa:</span>
            <span className="text-slate-300 truncate max-w-[200px]">
              {user.company}
            </span>
          </div>
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
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Nova Senha <span className="text-cyan-400">*</span>
              </label>
              <button
                type="button"
                onClick={generateRandomPassword}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1 hover:underline transition-colors"
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
                className="w-full pl-3.5 pr-20 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              />

              <div className="absolute right-2 top-2 flex items-center gap-1">
                {password && (
                  <button
                    type="button"
                    onClick={handleCopyPassword}
                    title="Copiar senha"
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Ocultar senha" : "Ver senha"}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
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
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
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
