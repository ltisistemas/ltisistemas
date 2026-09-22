"use client";

import { useState } from "react";
import { X, UserPlus, Loader2, AlertCircle, Eye, EyeOff, Building, Mail, User, Key, FileText, Globe } from "lucide-react";
import { createUserAction } from "@/lib/actions/auth-actions";
import { Role, UserStatus } from "@prisma/client";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: { id: string; email: string; name: string }) => void;
}

export function CreateUserModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateUserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [contractNumber, setContractNumber] = useState("");
  const [systemUrl, setSystemUrl] = useState("");
  const [status, setStatus] = useState<UserStatus>("ATIVO");
  const [role, setRole] = useState<Role>(Role.CLIENTE);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || !email.trim() || !company.trim() || !password) {
      setErrorMessage("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("A senha deve conter no mínimo 6 caracteres.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await createUserAction({
        name,
        email,
        company,
        contractNumber: contractNumber.trim() || undefined,
        systemUrl: systemUrl.trim() || undefined,
        status,
        role,
        password,
      });

      if (!res.success || !res.data) {
        setErrorMessage(res.error || "Erro ao cadastrar usuário.");
        setIsSubmitting(false);
        return;
      }

      // Reset form
      setName("");
      setEmail("");
      setCompany("");
      setContractNumber("");
      setSystemUrl("");
      setStatus("ATIVO");
      setPassword("");
      setIsSubmitting(false);

      onSuccess(res.data);
      onClose();
    } catch (err) {
      console.error("Create user error:", err);
      setErrorMessage("Erro de rede ou servidor ao cadastrar usuário.");
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cadastrar Novo Usuário"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-[#0d6efd] border border-blue-200">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 tracking-tight">
                Cadastrar Novo Usuário
              </h2>
              <p className="text-xs text-gray-500">
                Apenas a equipe de suporte pode provisionar novos acessos.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-[#f8d7da] border border-[#f5c2c7] flex items-start gap-2.5 text-xs text-[#842029]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#dc3545]" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Nome Completo <span className="text-[#dc3545]">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="Ex: Carlos Oliveira"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0d6efd] focus:ring-1 focus:ring-[#0d6efd]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              E-mail de Acesso <span className="text-[#dc3545]">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="carlos@empresa.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0d6efd] focus:ring-1 focus:ring-[#0d6efd]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Empresa / Cliente <span className="text-[#dc3545]">*</span>
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Empresa XYZ"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0d6efd] focus:ring-1 focus:ring-[#0d6efd]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                CPF / CNPJ ou Nº Contrato <span className="text-gray-400 text-[10px]">(Dados Fiscais)</span>
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="CTR-2026-042 ou CNPJ"
                  value={contractNumber}
                  onChange={(e) => setContractNumber(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0d6efd] focus:ring-1 focus:ring-[#0d6efd]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Endereço Site/Sistema <span className="text-gray-400 text-[10px]">(URL ou Nome)</span>
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="https://app.cliente.com.br"
                  value={systemUrl}
                  onChange={(e) => setSystemUrl(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0d6efd] focus:ring-1 focus:ring-[#0d6efd]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Status do Cliente <span className="text-[#dc3545]">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as UserStatus)}
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-[#0d6efd] focus:ring-1 focus:ring-[#0d6efd]"
              >
                <option value="ATIVO">ATIVO</option>
                <option value="INATIVO">INATIVO</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Perfil de Acesso <span className="text-[#dc3545]">*</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-[#0d6efd] focus:ring-1 focus:ring-[#0d6efd]"
              >
                <option value={Role.CLIENTE}>CLIENTE (Apenas chamados próprios)</option>
                <option value={Role.SUPORTE}>SUPORTE (Acesso total)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Senha Inicial <span className="text-[#dc3545]">*</span>
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Mínimo 6 dígitos"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-white border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0d6efd] focus:ring-1 focus:ring-[#0d6efd]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-700"
                  title={showPassword ? "Ocultar senha" : "Ver senha"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
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
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-sm font-semibold shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Cadastrando...</span>
                </>
              ) : (
                <span>Cadastrar Usuário</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
