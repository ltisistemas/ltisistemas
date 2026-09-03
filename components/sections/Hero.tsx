import React from "react";
import { siteConfig } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { WhatsAppIcon } from "@/components/ui/Icons";
import {
  ShieldCheck,
  Zap,
  Layers,
  ArrowDown,
  Sparkles,
  CheckCircle2,
  Terminal,
  Building2,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Dynamic Background Glow Elements */}
      <div className="glow-cyan -top-20 -left-20 w-[500px] h-[500px] opacity-20" />
      <div className="glow-emerald top-40 -right-20 w-[600px] h-[600px] opacity-15" />
      <div className="absolute inset-0 grid-background opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Availability Status Badge */}
          <div className="inline-flex items-center gap-2 mb-6">
            <Badge variant="cyan" dot size="md" className="px-4 py-1.5 shadow-md shadow-cyan-950/40">
              <span className="font-semibold text-slate-100">
                {siteConfig.contact.availability}
              </span>
            </Badge>
          </div>

          {/* Slogan & Main Corporate Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
            Engenharia de Software de{" "}
            <span className="text-gradient-cyan">Alta Complexidade</span> & Soluções{" "}
            <span className="text-gradient-emerald">Corporativas Escaláveis</span>
          </h1>

          {/* Institutional Credentials Line */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6 text-sm sm:text-base font-medium text-slate-300">
            <span className="text-white font-bold">{siteConfig.name}</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-cyan-400">Arquitetura Cloud-Native & Microsserviços</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-emerald-400">Liderança Técnica & Squad Acceleration</span>
          </div>

          {/* Tagline / Subtitle */}
          <p className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-3xl mb-10 font-normal">
            {siteConfig.tagline}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16">
            <Button
              href={siteConfig.contact.whatsappUrl}
              isExternal
              variant="primary"
              size="lg"
              icon={<WhatsAppIcon className="h-5 w-5" />}
              className="w-full sm:w-auto shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40"
            >
              Solicitar Proposta Corporativa
            </Button>

            <Button
              href="#produtos"
              variant="secondary"
              size="lg"
              icon={<Layers className="h-5 w-5 text-cyan-400" />}
              iconRight={<ArrowDown className="h-4 w-4 text-slate-400" />}
              className="w-full sm:w-auto"
            >
              Conhecer Nossos Produtos
            </Button>
          </div>

          {/* Quick Credibility Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl pt-8 border-t border-slate-800/80">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 text-left">
              <div className="h-9 w-9 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-4 w-4 text-cyan-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Sistemas Críticos</span>
                <span className="text-[11px] text-slate-400">Alta Disponibilidade & Escala</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 text-left">
              <div className="h-9 w-9 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Zap className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">+900% Throughput</span>
                <span className="text-[11px] text-slate-400">Otimização de Desempenho</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 text-left">
              <div className="h-9 w-9 rounded-lg bg-blue-950/80 border border-blue-500/30 flex items-center justify-center shrink-0">
                <Terminal className="h-4 w-4 text-blue-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Clean Architecture</span>
                <span className="text-[11px] text-slate-400">SOLID, TDD & Cloud-Native</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 text-left">
              <div className="h-9 w-9 rounded-lg bg-purple-950/80 border border-purple-500/30 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-4 w-4 text-purple-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">4 Produtos Live</span>
                <span className="text-[11px] text-slate-400">Plataformas em Produção</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
