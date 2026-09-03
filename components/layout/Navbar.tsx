"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { Menu, X, Code2, ArrowUpRight } from "lucide-react";

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
    { label: "Sobre a LTI", href: "#sobre" },
    { label: "Soluções", href: "#solucoes" },
    { label: "Produtos", href: "#produtos" },
    { label: "Metodologia & Stack", href: "#metodologia" },
    { label: "Histórico", href: "#historico" },
    { label: "Contato", href: "#contato" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 py-3 shadow-xl shadow-black/30"
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
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/35 transition-all">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Code2 className="h-5 w-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                LTI <span className="text-cyan-400">Sistemas</span>
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">
                Engenharia de Software Corporativa
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/70 backdrop-blur-md">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-full transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              href={siteConfig.contact.whatsappUrl}
              isExternal
              variant="primary"
              size="sm"
              icon={<WhatsAppIcon className="h-3.5 w-3.5" />}
              iconRight={<ArrowUpRight className="h-3.5 w-3.5" />}
            >
              Falar com Especialistas
            </Button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white focus:outline-none"
            aria-label="Abrir Menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 px-6 py-6 transition-all animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col gap-4">
            <div className="pb-2 border-b border-slate-800/60 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Navegação Corporativa
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
                className="text-base font-medium text-slate-200 hover:text-cyan-400 py-1 transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="h-4 w-4 text-slate-500" />
              </Link>
            ))}
            <div className="pt-4 border-t border-slate-800/60 flex flex-col gap-2">
              <Button
                href={siteConfig.contact.whatsappUrl}
                isExternal
                variant="primary"
                size="md"
                fullWidth
                icon={<WhatsAppIcon className="h-4 w-4" />}
                onClick={() => setIsMobileMenuOpen(false)}
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
