import React from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/data";
import { Code2, ArrowUpRight, Mail } from "lucide-react";
import { WhatsAppIcon, LinkedInIcon } from "@/components/ui/Icons";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-16 pb-12 text-slate-400 relative overflow-hidden">
      {/* Background glow */}
      <div className="glow-cyan -top-40 left-1/2 -translate-x-1/2 w-96 h-96 opacity-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/60">
          {/* Col 1: Brand & Slogan */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 flex items-center justify-center">
                <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Code2 className="h-4 w-4 text-cyan-400" />
                </div>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                LTI <span className="text-cyan-400">Sistemas</span>
              </span>
            </Link>

            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              {siteConfig.slogan}
            </p>

            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              Engenharia de software corporativa, arquitetura cloud-native escalável e governança técnica para empresas em crescimento. Direção técnica por <strong className="text-slate-300">{siteConfig.founder}</strong> ({siteConfig.experienceYears} de know-how enterprise).
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={siteConfig.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
                aria-label="WhatsApp Corporativo"
              >
                <WhatsAppIcon className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.contact.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                aria-label="LinkedIn da Liderança"
              >
                <LinkedInIcon className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                aria-label="E-mail Corporativo"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Navegação
            </h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link href="#sobre" className="hover:text-cyan-400 transition-colors">
                  Sobre a LTI Sistemas
                </Link>
              </li>
              <li>
                <Link href="#solucoes" className="hover:text-cyan-400 transition-colors">
                  Soluções Corporativas
                </Link>
              </li>
              <li>
                <Link href="#produtos" className="hover:text-cyan-400 transition-colors">
                  Produtos Desenvolvidos
                </Link>
              </li>
              <li>
                <Link href="#metodologia" className="hover:text-cyan-400 transition-colors">
                  Metodologia & Stack
                </Link>
              </li>
              <li>
                <Link href="#historico" className="hover:text-cyan-400 transition-colors">
                  Histórico Enterprise
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Live Portfolio Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Produtos & Cases
            </h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <a
                  href="https://credit-flow-app.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1 group"
                >
                  <span>Credit Flow App</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-cyan-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://mainfast-fabrica-de-mvp-webapp-reac.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1 group"
                >
                  <span>MainFast - Fábrica de MVP</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-cyan-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://meufluxofinanceiro-app.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1 group"
                >
                  <span>Meu Fluxo Financeiro</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-cyan-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://quick-invoiceflow.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1 group"
                >
                  <span>Quick InvoiceFlow</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-cyan-400" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} LTI Sistemas - Luiz Tecnologia da Informação. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Engenharia de Software Corporativa & Soluções Digitais
          </p>
        </div>
      </div>
    </footer>
  );
}
