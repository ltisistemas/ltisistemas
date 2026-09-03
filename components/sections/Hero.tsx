"use client";

import React from "react";
import { siteConfig } from "@/lib/data";
import { trackEvent } from "@/lib/analytics";
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
      <div className="glow-cyan top-10 left-1/2 -translate-x-1/2 w-[700px] h-[500px] opacity-20" />
      <div className="glow-emerald top-40 right-10 w-[400px] h-[400px] opacity-10" />
      <div className="absolute inset-0 grid-background opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Availability Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-md mb-8 shadow-inner">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-slate-200 tracking-wide uppercase">
              {siteConfig.contact.availability}
            </span>
          </div>

          {/* Main Authority Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
            Engenharia de Software de{" "}
            <span className="text-gradient">Alta Complexidade</span> &{" "}
            <span className="text-gradient-emerald">Soluções Corporativas</span>
          </h1>

          {/* Slogan Pill */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium text-slate-300 mb-6 px-4 py-2 rounded-xl bg-slate-900/50 border border-slate-800">
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
              onClick={() => trackEvent("whatsapp_click", { location: "hero" })}
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
