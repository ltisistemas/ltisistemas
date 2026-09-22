"use client";

import React from "react";
import { siteConfig } from "@/lib/data";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { ArrowUpRight, ArrowDown, ShieldCheck, Clock, MessageSquare } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#0c1f4d] via-[#102d73] to-[#0a183d] p-8 sm:p-12 md:p-16 overflow-hidden shadow-2xl text-white border border-sky-400/20">
          {/* Decorative background grid and auras */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
            {/* Pill Tag */}
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 border border-sky-400/30 text-xs font-semibold uppercase tracking-wider text-sky-300 mb-6 backdrop-blur-sm">
              <MessageSquare className="h-3.5 w-3.5 text-sky-400" />
              <span>Vamos Construir Juntos</span>
            </span>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.15] mb-6">
              Tem um Desafio Crítico ou Precisa Escalar sua Operação?
            </h2>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-200/90 leading-relaxed mb-10 max-w-2xl font-normal">
              Converse diretamente com nossa liderança técnica e receba um diagnóstico de arquitetura ou proposta de engenharia sob medida para sua empresa.
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-10">
              <a
                href={siteConfig.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("whatsapp_click", { location: "cta_banner" })}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-sm font-bold text-slate-950 bg-sky-400 hover:bg-sky-300 shadow-xl shadow-sky-500/25 transition-all hover:-translate-y-0.5"
              >
                <WhatsAppIcon className="h-4 w-4 text-slate-950" />
                <span>Falar no WhatsApp Agora</span>
                <ArrowUpRight className="h-4 w-4 text-slate-950" />
              </a>

              <a
                href="#contato"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-sm font-semibold text-white border-2 border-white/80 hover:bg-white/15 backdrop-blur-sm transition-all hover:-translate-y-0.5"
              >
                <span>Preencher Formulário</span>
                <ArrowDown className="h-4 w-4 text-sky-300" />
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-300 pt-6 border-t border-white/15">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-sky-300 shrink-0" />
                <span>Resposta ágil em até 2 horas</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-300 shrink-0" />
                <span>Sigilo e Acordo de Confidencialidade (NDA)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
