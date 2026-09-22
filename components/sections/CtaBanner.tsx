"use client";

import React from "react";
import { siteConfig } from "@/lib/data";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { ArrowUpRight, ArrowDown, ShieldCheck, Clock, MessageSquare } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 p-8 sm:p-12 md:p-16 overflow-hidden shadow-xl text-white">
          {/* Decorative background grid and auras */}
          <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
            {/* Pill Tag */}
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 border border-white/30 text-xs font-semibold uppercase tracking-wider text-blue-100 mb-6 backdrop-blur-sm">
              <MessageSquare className="h-3.5 w-3.5 text-white" />
              <span>Vamos Construir Juntos</span>
            </span>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.15] mb-6">
              Tem um Desafio Crítico ou Precisa Escalar sua Operação?
            </h2>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-blue-100/90 leading-relaxed mb-10 max-w-2xl font-normal">
              Converse diretamente com nossa liderança técnica e receba um diagnóstico de arquitetura ou proposta de engenharia sob medida para sua empresa.
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-10">
              <Button
                href={siteConfig.contact.whatsappUrl}
                isExternal
                variant="secondary"
                size="lg"
                onClick={() => trackEvent("whatsapp_click", { location: "cta_banner" })}
                icon={<WhatsAppIcon className="h-5 w-5 text-emerald-600" />}
                iconRight={<ArrowUpRight className="h-4 w-4 text-blue-600" />}
                className="w-full sm:w-auto text-base text-blue-700 font-bold bg-white hover:bg-blue-50 shadow-lg"
              >
                Falar no WhatsApp Agora
              </Button>

              <Button
                href="#contato"
                variant="dark"
                size="lg"
                icon={<ArrowDown className="h-4 w-4 text-slate-300" />}
                className="w-full sm:w-auto text-base bg-slate-950/60 hover:bg-slate-950 border border-white/20"
              >
                Preencher Formulário
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-blue-100/80 pt-6 border-t border-white/20">
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
