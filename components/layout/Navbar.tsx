"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/data";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { Menu, X, Code2, ArrowUpRight, LifeBuoy } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Soluções", href: "#solucoes" },
    { label: "Metodologia", href: "#metodologia" },
    { label: "Produtos Live", href: "#produtos" },
    { label: "Diferenciais", href: "#diferenciais" },
    { label: "Depoimentos", href: "#depoimentos" },
    { label: "Contato", href: "#contato" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md border-b border-slate-200/80 py-3.5 shadow-sm"
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
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 p-0.5 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/35 transition-all">
              <div className="h-full w-full bg-white rounded-[10px] flex items-center justify-center">
                <Code2 className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-1">
                LTI <span className="text-blue-600">Sistemas</span>
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                Engenharia de Software Corporativa
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/80 p-1.5 rounded-full border border-slate-200/90 shadow-xs backdrop-blur-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-100/70 rounded-full transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/suporte/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs hover:border-slate-300 transition-all"
              title="Acessar Central de Chamados"
            >
              <LifeBuoy className="h-3.5 w-3.5 text-blue-600" />
              <span>Área do Cliente</span>
            </Link>

            <Button
              href={siteConfig.contact.whatsappUrl}
              isExternal
              variant="primary"
              size="sm"
              onClick={() =>
                trackEvent("whatsapp_click", { location: "navbar_desktop" })
              }
              icon={<WhatsAppIcon className="h-3.5 w-3.5" />}
              iconRight={<ArrowUpRight className="h-3.5 w-3.5" />}
            >
              Solicitar Proposta
            </Button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-2xs focus:outline-none"
            aria-label="Abrir Menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 px-6 py-6 transition-all shadow-xl">
          <div className="flex flex-col gap-4">
            <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Navegação
              </span>
              <Badge variant="emerald" dot size="sm">
                Atendimento Ativo
              </Badge>
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-700 hover:text-blue-600 py-1 transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="h-4 w-4 text-slate-400" />
              </Link>
            ))}

            <Link
              href="/suporte/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-semibold text-blue-600 hover:text-blue-700 py-2 transition-colors flex items-center justify-between border-t border-slate-100"
            >
              <span className="flex items-center gap-2">
                <LifeBuoy className="h-4 w-4" />
                <span>Área do Cliente (Chamados)</span>
              </span>
              <ArrowUpRight className="h-4 w-4 text-blue-600" />
            </Link>

            <div className="pt-2 flex flex-col gap-2">
              <Button
                href={siteConfig.contact.whatsappUrl}
                isExternal
                variant="primary"
                size="md"
                fullWidth
                icon={<WhatsAppIcon className="h-4 w-4" />}
                onClick={() => {
                  trackEvent("whatsapp_click", { location: "navbar_mobile" });
                  setIsMobileMenuOpen(false);
                }}
              >
                Solicitar Proposta no WhatsApp
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
