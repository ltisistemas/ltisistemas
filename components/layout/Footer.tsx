import React from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/data";
import { Code2, ArrowUpRight, Mail, ShieldCheck, Heart } from "lucide-react";
import { WhatsAppIcon, LinkedInIcon } from "@/components/ui/Icons";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 relative overflow-hidden border-t border-slate-800">
      {/* Ambient background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Col 1 & 2: Brand & Positioning */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-400 to-blue-600 p-0.5 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-all">
                <div className="h-full w-full bg-[#0d2259] rounded-[10px] flex items-center justify-center">
                  <Code2 className="h-5 w-5 text-sky-400 group-hover:rotate-6 transition-transform" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-white tracking-tight flex items-center gap-1">
                  lti<span className="text-sky-400 font-black">sistemas</span>
                </span>
                <span className="text-[10px] text-sky-200/70 uppercase tracking-wider font-semibold">
                  Engenharia de Software & Cloud
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              {siteConfig.tagline}
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{siteConfig.experienceYears} de experiência prática em engenharia de software corporativa.</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={siteConfig.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-slate-700 transition-all"
                aria-label="WhatsApp Corporativo"
              >
                <WhatsAppIcon className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.contact.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-blue-400 hover:border-blue-500/40 hover:bg-slate-700 transition-all"
                aria-label="LinkedIn da Liderança"
              >
                <LinkedInIcon className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-blue-400 hover:border-blue-500/40 hover:bg-slate-700 transition-all"
                aria-label="E-mail Corporativo"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Soluções */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Soluções
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link href="#solucoes" className="hover:text-blue-400 transition-colors">
                  Engenharia Sob Medida
                </Link>
              </li>
              <li>
                <Link href="#solucoes" className="hover:text-blue-400 transition-colors">
                  Arquitetura Cloud-Native
                </Link>
              </li>
              <li>
                <Link href="#solucoes" className="hover:text-blue-400 transition-colors">
                  Squad Acceleration & Tech Lead
                </Link>
              </li>
              <li>
                <Link href="#solucoes" className="hover:text-blue-400 transition-colors">
                  Modernização de Legados
                </Link>
              </li>
              <li>
                <Link href="#metodologia" className="hover:text-blue-400 transition-colors">
                  Metodologia em 3 Passos
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Produtos Live */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Produtos em Produção
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <a
                  href="https://credit-flow-app.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center gap-1 group"
                >
                  <span>Credit Flow App</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-blue-400 transition-colors" />
                </a>
              </li>
              <li>
                <a
                  href="https://mainfast-fabrica-de-mvp-webapp-reac.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center gap-1 group"
                >
                  <span>MainFast - Fábrica de MVP</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-blue-400 transition-colors" />
                </a>
              </li>
              <li>
                <a
                  href="https://meufluxofinanceiro-app.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center gap-1 group"
                >
                  <span>Meu Fluxo Financeiro</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-blue-400 transition-colors" />
                </a>
              </li>
              <li>
                <a
                  href="https://quick-invoiceflow.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center gap-1 group"
                >
                  <span>Quick InvoiceFlow</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-blue-400 transition-colors" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Atendimento & Suporte */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Central & Clientes
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link
                  href="/suporte/login"
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span>Área do Cliente (Chamados)</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </li>
              <li>
                <Link href="#contato" className="hover:text-blue-400 transition-colors">
                  Solicitar Proposta
                </Link>
              </li>
              <li>
                <a
                  href={siteConfig.contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  WhatsApp: {siteConfig.contact.whatsappDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="hover:text-blue-400 transition-colors break-all"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {currentYear} LTI Sistemas (Luiz Tecnologia da Informação). Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            <span>Desenvolvido com excelência técnica e arquitetura de alto desempenho</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
