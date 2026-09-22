"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/data";
import { trackEvent } from "@/lib/analytics";
import { WhatsAppIcon } from "@/components/ui/Icons";
import {
  Code2,
  Cloud,
  ShieldCheck,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Plus,
  Layers,
  Cpu,
  CheckCircle2,
} from "lucide-react";

export function Hero() {
  const quickCards = [
    {
      icon: <Code2 className="w-6 h-6 text-white" />,
      iconBg: "bg-gradient-to-tr from-blue-900 to-indigo-800 border border-blue-700/50 shadow-md",
      title: "Software Services",
      subtitle: "Desenvolvimento Sob Medida",
      description:
        "Sistemas web de alta complexidade, arquitetura limpa, APIs robustas e microsserviços escaláveis para transformar seu negócio.",
      link: "#servicos",
    },
    {
      icon: <Cloud className="w-6 h-6 text-sky-300" />,
      iconBg: "bg-gradient-to-tr from-sky-600 to-blue-700 border border-sky-400/40 shadow-md",
      title: "Cloud Services",
      subtitle: "Infraestrutura & DevOps",
      description:
        "Ambientes em nuvem com alta disponibilidade, CI/CD automatizado, monitoramento contínuo e escalabilidade sob demanda.",
      link: "#servicos",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-white" />,
      iconBg: "bg-gradient-to-tr from-blue-700 to-sky-600 border border-blue-400/40 shadow-md",
      title: "Security & Support",
      subtitle: "SLA Crítico & Gestão 24/7",
      description:
        "Sustentação proativa de sistemas, emissão fiscal automatizada NFS-e, segurança da informação e atendimento com tempo de resposta recorde.",
      link: "#servicos",
    },
  ];

  return (
    <div id="inicio" className="relative">
      {/* Hero Blue Section */}
      <section className="relative pt-32 pb-36 md:pt-40 md:pb-44 overflow-hidden bg-gradient-to-br from-[#0c1f4d] via-[#102d73] to-[#0a183d] text-white">
        {/* Subtle Tech Circuit / Grid Background Elements */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
        
        {/* Decorative Floating Pill Shapes & Plus Crosshairs */}
        <div className="absolute top-24 right-1/3 w-72 h-14 rounded-full bg-white/10 -rotate-45 blur-2xs pointer-events-none" />
        <div className="absolute top-48 right-12 w-96 h-20 rounded-full bg-sky-400/15 -rotate-45 blur-2xs pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-64 h-16 rounded-full bg-blue-500/15 -rotate-45 blur-2xs pointer-events-none" />

        {/* Plus Markers */}
        <Plus className="absolute top-28 right-1/4 w-5 h-5 text-sky-400/60 animate-pulse pointer-events-none" />
        <Plus className="absolute top-72 left-1/3 w-4 h-4 text-white/40 pointer-events-none" />
        <Plus className="absolute bottom-32 right-16 w-5 h-5 text-sky-300/50 pointer-events-none" />

        {/* Soft Glowing Aura Orbs */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-sky-400/25 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Pill Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-sky-400/30 text-sky-300 text-[11px] font-bold tracking-widest uppercase mb-6 backdrop-blur-sm shadow-sm">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                <span>WELCOME TO LTI SISTEMAS</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] mb-6">
                Resolvemos os desafios da sua empresa com <span className="text-sky-400">tecnologia</span>.
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-200/90 leading-relaxed font-normal mb-8 max-w-2xl">
                Nossa performance é o seu sucesso. Desenvolvemos soluções corporativas sob medida, arquitetura em nuvem e suporte técnico proativo com foco em alta disponibilidade e escala.
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <a
                  href={siteConfig.contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("whatsapp_click", { location: "hero_primary" })}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-sm font-bold text-slate-950 bg-sky-400 hover:bg-sky-300 shadow-xl shadow-sky-500/25 hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all active:translate-y-0"
                >
                  <WhatsAppIcon className="w-4 h-4 text-slate-950" />
                  <span>Começar Agora</span>
                </a>

                <Link
                  href="#produtos"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-sm font-semibold text-white border-2 border-white/80 hover:bg-white/15 backdrop-blur-sm transition-all hover:-translate-y-0.5"
                >
                  <span>Conhecer Soluções</span>
                  <ArrowRight className="w-4 h-4 text-sky-300" />
                </Link>
              </div>

              {/* Quick Trust Highlights */}
              <div className="flex flex-wrap items-center gap-6 mt-10 pt-8 border-t border-white/15 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400" />
                  <span>20+ Anos de Know-how</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400" />
                  <span>SLA Crítico Garantido</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400" />
                  <span>Emissão Fiscal NFS-e</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Person Composite */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* Angled Decorative 3D Pills behind character */}
              <div className="absolute -top-6 -right-4 w-48 h-12 rounded-full bg-sky-400/30 -rotate-45 blur-xs" />
              <div className="absolute top-12 -left-8 w-60 h-16 rounded-full bg-blue-500/40 -rotate-45 blur-xs" />
              <div className="absolute bottom-10 right-0 w-52 h-14 rounded-full bg-white/20 -rotate-45" />

              {/* Main Photo Card */}
              <div className="relative z-10 rounded-3xl overflow-hidden border border-sky-400/30 shadow-2xl shadow-black/50 bg-gradient-to-tr from-blue-900/60 to-slate-900/40 p-2 backdrop-blur-xs group">
                <div className="relative w-[320px] sm:w-[380px] h-[400px] sm:h-[460px] rounded-2xl overflow-hidden bg-slate-900">
                  <Image
                    src="/images/hero-person.jpg"
                    alt="Consultor de Engenharia de Software LTI Sistemas"
                    fill
                    priority
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c1f4d] via-transparent to-transparent opacity-60" />
                  
                  {/* Floating Live Badge */}
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-semibold text-white">Engenharia Dedicada</span>
                    </div>
                    <span className="text-[11px] text-sky-400 font-mono">Uptime 99.9%</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3 Overlapping White Feature Cards */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-24 md:-mt-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-7 sm:p-8 shadow-xl shadow-slate-900/10 border border-slate-100 flex flex-col items-center text-center hover:-translate-y-1.5 hover:shadow-2xl hover:border-sky-200 transition-all duration-300 group"
            >
              {/* Card Icon */}
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform ${card.iconBg}`}
              >
                {card.icon}
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-xl font-extrabold text-slate-900 mb-1">
                {card.title}
              </h3>
              <span className="text-xs font-semibold text-blue-600 mb-3 uppercase tracking-wider">
                {card.subtitle}
              </span>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {card.description}
              </p>

              {/* Action Button */}
              <div className="mt-auto w-full">
                <Link
                  href={card.link}
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#0c1f4d] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-md group-hover:shadow-lg"
                >
                  <span>Saiba mais</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
