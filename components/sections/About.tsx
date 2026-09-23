import React from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/data";
import { CheckCircle2, ArrowRight, Shield, Sparkles, Server, Terminal, Laptop } from "lucide-react";

export function About() {
  return (
    <section id="sobre" className="py-24 bg-slate-50/50 relative overflow-hidden border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main 3-Column Showcase matching Reference */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Heading, Paragraph, CTA */}
          <div className="lg:col-span-4 flex flex-col items-start text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200/60 px-3.5 py-1.5 rounded-full mb-4">
              Foco no Seu Negócio
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-5">
              Cuidamos de toda a tecnologia, para você focar no que realmente importa.
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-8">
              Elimine gargalos operacionais e instabilidades. Fornecemos sustentação técnica de alto nível, esteiras de DevOps modernas e desenvolvimento de software contínuo com arquitetos seniores.
            </p>

            <Link
              href="#contato"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#0c1f4d] hover:bg-blue-600 text-white text-xs font-bold shadow-md shadow-slate-900/10 hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <span>Falar com Especialista</span>
              <ArrowRight className="w-4 h-4 text-sky-400" />
            </Link>
          </div>

          {/* Center Column: Photo of Tech Professional */}
          <div className="lg:col-span-4 flex justify-center items-center w-full min-w-0">
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] h-[360px] sm:h-[400px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 group">
              <Image
                src="/images/feature-person.jpg"
                alt="Luiz Felipe — Liderança Técnica em Arquitetura e Engenharia de Software na LTI Sistemas"
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-60" />
              
              {/* Floating Live Badge */}
              <div className="absolute bottom-3.5 left-3.5 right-3.5 p-2.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold text-xs">Governança Técnica</span>
                </div>
                <span className="text-[11px] text-sky-400 font-mono">20+ Anos</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Stacked Feature Badges */}
          <div className="lg:col-span-4 flex flex-col gap-4 w-full min-w-0">
            
            {/* Item 1: Regular Light Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200/60 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex flex-col text-left min-w-0 flex-1">
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  Suporte Remoto & SLA Rápido
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Chamados e incidentes resolvidos com tempo de resposta ágil e canal direto com engenheiros.
                </p>
              </div>
            </div>

            {/* Item 2: Highlighted Active Blue Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-600/25 border border-blue-500 flex items-start gap-4 transform sm:scale-[1.02]">
              <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5 text-sky-200" />
              </div>
              <div className="flex flex-col text-left min-w-0 flex-1">
                <h3 className="text-sm font-bold text-white mb-1">
                  Infraestrutura Cloud & Workstation
                </h3>
                <p className="text-xs text-sky-100/90 leading-relaxed">
                  Ambientes gerenciados em nuvem com alta redundância, bancos de dados seguros e 99.9% de uptime.
                </p>
              </div>
            </div>

            {/* Item 3: Regular Light Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-sky-50 border border-sky-200/60 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5 text-sky-600" />
              </div>
              <div className="flex flex-col text-left">
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  Emissão Fiscal NFS-e & Backups
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Geração automática de notas fiscais Gov.br a partir de faturas e rotinas diárias de backup.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
