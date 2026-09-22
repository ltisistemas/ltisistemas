"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/data";
import { trackEvent } from "@/lib/analytics";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { Menu, X, Code2, ArrowUpRight, LifeBuoy, Sparkles, ChevronDown } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Início", href: "#inicio" },
    { label: "Sobre Nós", href: "#sobre" },
    { label: "Serviços", href: "#servicos" },
    { label: "Soluções", href: "#produtos" },
    { label: "Diferenciais", href: "#diferenciais" },
    { label: "Contato", href: "#contato" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 py-3 shadow-md"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Corporate Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group transition-transform active:scale-95"
            aria-label="LTI Sistemas - Início"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-400 to-blue-600 p-0.5 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-all">
              <div className="h-full w-full bg-[#0d2259] rounded-[10px] flex items-center justify-center">
                <Code2 className="h-5 w-5 text-sky-400 group-hover:rotate-6 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <span
                className={`text-xl font-extrabold tracking-tight flex items-center gap-1 transition-colors ${
                  isScrolled ? "text-slate-900" : "text-white"
                }`}
              >
                lti<span className="text-sky-400 font-black">sistemas</span>
              </span>
              <span
                className={`text-[9px] uppercase tracking-wider font-semibold transition-colors ${
                  isScrolled ? "text-slate-500" : "text-sky-200/70"
                }`}
              >
                Engenharia de Software & Cloud
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className={`hidden lg:flex items-center gap-1 px-4 py-1.5 rounded-full transition-all ${
              isScrolled
                ? "bg-slate-100/80 border border-slate-200/80 text-slate-700"
                : "bg-white/10 backdrop-blur-md border border-white/15 text-white/90"
            }`}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  isScrolled
                    ? "text-slate-600 hover:text-blue-600 hover:bg-white shadow-2xs"
                    : "text-white/80 hover:text-white hover:bg-white/15"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/suporte/login"
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isScrolled
                  ? "text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 border border-slate-200"
                  : "text-white hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm"
              }`}
              title="Acessar Central de Chamados"
            >
              <LifeBuoy className="h-3.5 w-3.5 text-sky-400" />
              <span>Área do Cliente</span>
            </Link>

            <a
              href={siteConfig.contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("whatsapp_click", { location: "navbar_desktop" })}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-sky-400 hover:bg-sky-300 shadow-md shadow-sky-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <span>Começar Agora</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2.5 rounded-xl transition-all focus:outline-none ${
              isScrolled
                ? "bg-slate-100 text-slate-800 border border-slate-200"
                : "bg-white/10 text-white border border-white/20 backdrop-blur-sm"
            }`}
            aria-label="Abrir Menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0d2259]/98 backdrop-blur-2xl border-b border-sky-500/20 px-6 py-6 transition-all shadow-2xl text-white">
          <div className="flex flex-col gap-4">
            <div className="pb-2 border-b border-white/10 flex items-center justify-between">
              <span className="text-xs text-sky-300 font-semibold uppercase tracking-wider">
                Navegação
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                Atendimento Ativo
              </span>
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-200 hover:text-sky-300 py-1 transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="h-4 w-4 text-sky-400/60" />
              </Link>
            ))}

            <Link
              href="/suporte/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-semibold text-sky-400 hover:text-sky-300 py-2 transition-colors flex items-center justify-between border-t border-white/10"
            >
              <span className="flex items-center gap-2">
                <LifeBuoy className="h-4 w-4" />
                <span>Área do Cliente (Chamados)</span>
              </span>
              <ArrowUpRight className="h-4 w-4 text-sky-400" />
            </Link>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={siteConfig.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent("whatsapp_click", { location: "navbar_mobile" });
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-sky-400 text-slate-950 font-bold text-sm shadow-lg shadow-sky-500/30"
              >
                <WhatsAppIcon className="h-4 w-4" />
                <span>Solicitar Proposta no WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
