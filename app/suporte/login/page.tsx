"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LifeBuoy,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { loginAction } from "@/lib/actions/auth-actions";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await loginAction(email, password);

      if (!res.success || !res.data) {
        setErrorMessage(res.error || "E-mail ou senha incorretos.");
        setIsLoading(false);
        return;
      }

      router.push(res.data.redirectUrl);
      router.refresh();
    } catch (error) {
      console.error("Login submission error:", error);
      setErrorMessage("Erro ao conectar com o servidor. Tente novamente.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col justify-between items-center p-4 sm:p-6 lg:p-8 relative">
      {/* Main Login Card */}
      <div className="w-full max-w-md z-10 my-auto">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#0d6efd]" />

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#0d6efd] flex items-center justify-center shadow-md text-white mb-4">
              <LifeBuoy className="w-7 h-7 text-white" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Central de Chamados
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1.5 max-w-xs">
              Acesso exclusivo para abertura de chamados e suporte técnico da LTI Sistemas.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-[#f8d7da] border border-[#f5c2c7] flex items-start gap-2.5 text-xs text-[#842029]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#dc3545]" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-gray-700 mb-1.5"
              >
                E-mail corporativo
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="seu.email@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0d6efd] focus:ring-1 focus:ring-[#0d6efd] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-gray-700"
                >
                  Senha de acesso
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-white border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0d6efd] focus:ring-1 focus:ring-[#0d6efd] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-700 transition-colors"
                  title={showPassword ? "Ocultar senha" : "Ver senha"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-[#0d6efd] hover:bg-[#0b5ed7] text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <span>Acessar Painel</span>
              )}
            </button>
          </form>

          {/* Security footnote */}
          <div className="mt-6 pt-5 border-t border-gray-200 flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
            <ShieldCheck className="w-3.5 h-3.5 text-[#198754]" />
            <span>Autenticação protegida via Argon2id + Pepper criptográfico.</span>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="w-full max-w-md text-center py-4 z-10 text-[11px] text-gray-500">
        &copy; {new Date().getFullYear()} LTI Sistemas. Todos os direitos reservados.
      </div>
    </div>
  );
}
