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
  ArrowUpRight,
  CheckCircle2,
  Server,
  Code2,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export function Hero() {
  const quickCategories = [
    { label: "Fintech & Crédito", href: "#produtos" },
    { label: "SaaS & Fábrica de MVP", href: "#produtos" },
    { label: "Gestão Financeira", href: "#produtos" },
    { label: "B2B & Automação Fiscal", href: "#produtos" },
    { label: "Cloud-Native & Microsserviços", href: "#solucoes" },
  ];

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-slate-100/40">
      {/* Soft Luminous Background Glows */}
      <div className="aura-blue top-12 left-1/2 -translate-x-1/2 w-[650px] h-[500px] opacity-70" />
      <div className="aura-cyan top-36 right-10 w-[450px] h-[450px] opacity-60" />
      <div className="aura-amber top-20 left-10 w-[400px] h-[400px] opacity-40" />
      <div className="absolute inset-0 dot-pattern opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-slate-200/90 shadow-2xs backdrop-blur-sm mb-6 animate-in fade-in slide-in-from-top-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {siteConfig.contact.availability}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.12] mb-6">
            Engenharia de Software de{" "}
            <span className="text-blue-600">Alta Complexidade</span> &{" "}
            <span className="text-slate-800">Soluções Corporativas</span>
          </h1>

          {/* Tagline / Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-3xl mb-8 font-normal">
            {siteConfig.tagline}
          </p>

          {/* Quick Categories Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-3xl">
            <span className="text-xs font-semibold text-slate-500 mr-1 hidden sm:inline">
              Áreas de Domínio:
            </span>
            {quickCategories.map((cat) => (
              <a
                key={cat.label}
                href={cat.href}
                className="px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white text-xs font-semibold text-slate-700 hover:text-blue-600 border border-slate-200/90 hover:border-blue-300 shadow-2xs transition-all hover:scale-105"
              >
                {cat.label}
              </a>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16">
            <Button
              href={siteConfig.contact.whatsappUrl}
              isExternal
              variant="primary"
              size="lg"
              onClick={() => trackEvent("whatsapp_click", { location: "hero" })}
              icon={<WhatsAppIcon className="h-5 w-5" />}
              iconRight={<ArrowUpRight className="h-4 w-4" />}
              className="w-full sm:w-auto text-base"
            >
              Solicitar Proposta Corporativa
            </Button>

            <Button
              href="#produtos"
              variant="secondary"
              size="lg"
              icon={<Layers className="h-5 w-5 text-blue-600" />}
              iconRight={<ArrowDown className="h-4 w-4 text-slate-400" />}
              className="w-full sm:w-auto text-base"
            >
              Conhecer Nossos Produtos
            </Button>
          </div>

          {/* Credibility Floating Cards Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl text-left">
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all">
              <div className="h-11 w-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900">20+ Anos de Know-how</span>
                <span className="text-xs text-slate-500 font-medium">Sistemas Críticos & Enterprise</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all">
              <div className="h-11 w-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                <Zap className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900">+900% Throughput</span>
                <span className="text-xs text-slate-500 font-medium">Benchmark de Performance</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-md transition-all">
              <div className="h-11 w-11 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0">
                <Server className="h-5 w-5 text-sky-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900">Clean Architecture</span>
                <span className="text-xs text-slate-500 font-medium">DDD, TDD & Cloud-Native</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-amber-300 hover:shadow-md transition-all">
              <div className="h-11 w-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900">4 Produtos Live</span>
                <span className="text-xs text-slate-500 font-medium">Plataformas em Produção</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
