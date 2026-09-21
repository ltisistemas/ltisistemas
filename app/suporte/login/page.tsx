"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LifeBuoy,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
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
    <div className="min-h-screen w-full bg-[#080c14] flex flex-col justify-between items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background glow accents */}
      <div className="glow-cyan w-[500px] h-[500px] -top-40 -left-40 opacity-30" />
      <div className="glow-emerald w-[500px] h-[500px] -bottom-40 -right-40 opacity-20" />

      {/* Top Bar Return Link */}
      <div className="w-full max-w-md flex justify-start z-10">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-cyan-400 transition-colors py-2"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Voltar para o site da LTI Sistemas</span>
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md z-10 my-auto">
        <div className="rounded-3xl border border-slate-800 bg-[#0d131f]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500" />

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-slate-950 mb-4">
              <LifeBuoy className="w-7 h-7 text-slate-950" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Central de Chamados
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-xs">
              Acesso exclusivo para abertura de chamados e suporte técnico.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 flex items-start gap-2.5 text-xs text-red-400 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-300 mb-1.5"
              >
                E-mail corporativo
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="seu.email@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-300"
                >
                  Senha de acesso
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white transition-colors"
                  title={showPassword ? "Ocultar senha" : "Ver senha"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <span>Acessar Painel</span>
              )}
            </button>
          </form>

          {/* Security footnote */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Autenticação protegida via Argon2id + Pepper criptográfico.</span>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="w-full max-w-md text-center py-4 z-10 text-[11px] text-slate-600">
        &copy; {new Date().getFullYear()} LTI Sistemas. Todos os direitos reservados.
      </div>
    </div>
  );
}
