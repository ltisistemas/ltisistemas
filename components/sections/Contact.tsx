"use client";

import React from "react";
import Image from "next/image";
import { siteConfig } from "@/lib/data";
import { trackEvent } from "@/lib/analytics";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { WhatsAppIcon, LinkedInIcon } from "@/components/ui/Icons";
import {
  Mail,
  ArrowUpRight,
  Sparkles,
  Cloud,
  Users,
  RefreshCw,
  Code2,
  MessageSquare,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";

export function Contact() {
  const whatsappNumber = "5581973123278";

  const quickTopics = [
    {
      id: "architecture",
      title: "Consultoria em Arquitetura & Cloud-Native",
      description: "Microsserviços, AWS, escalabilidade e resiliência para sistemas críticos.",
      tags: ["Cloud-Native", "Microsserviços", "AWS"],
      icon: <Cloud className="h-5 w-5 text-blue-600" />,
      iconBg: "bg-blue-50 border-blue-100",
      message:
        "Olá, Luiz Felipe! Gostaria de conversar sobre Consultoria em Arquitetura e Cloud-Native para minha empresa.",
    },
    {
      id: "squad",
      title: "Alocação de Tech Lead & Squad Acceleration",
      description: "Liderança técnica sênior, mentoria de desenvolvedores e governança de código.",
      tags: ["Tech Lead as a Service", "Squads", "Code Review"],
      icon: <Users className="h-5 w-5 text-emerald-600" />,
      iconBg: "bg-emerald-50 border-emerald-100",
      message:
        "Olá, Luiz Felipe! Tenho interesse em Tech Lead as a Service e aceleração de squads para meu time.",
    },
    {
      id: "modernization",
      title: "Modernização de Legados sem Downtime",
      description: "Migração progressiva para nuvem, desacoplamento de monólitos e refatoração.",
      tags: ["Zero Downtime", "Strangler Fig", "Performance"],
      icon: <RefreshCw className="h-5 w-5 text-purple-600" />,
      iconBg: "bg-purple-50 border-purple-100",
      message:
        "Olá, Luiz Felipe! Gostaria de entender como funciona a modernização de sistemas legados sem downtime.",
    },
    {
      id: "custom_saas",
      title: "Engenharia Sob Medida & Plataformas SaaS",
      description: "Construção de novos produtos digitais do zero com arquitetura corporativa.",
      tags: ["Novo SaaS", "Full-Stack", "Alta Performance"],
      icon: <Code2 className="h-5 w-5 text-sky-600" />,
      iconBg: "bg-sky-50 border-sky-100",
      message:
        "Olá, Luiz Felipe! Quero desenvolver um novo software sob medida / plataforma SaaS para minha empresa.",
    },
    {
      id: "general_diagnostic",
      title: "Diagnóstico Técnico Geral & Proposta Rápida",
      description: "Tire dúvidas sobre escopo, prazos estimados e viabilidade técnica da sua ideia.",
      tags: ["Diagnóstico", "Estimativa", "Atendimento Direto"],
      icon: <MessageSquare className="h-5 w-5 text-amber-600" />,
      iconBg: "bg-amber-50 border-amber-100",
      message:
        "Olá, Luiz Felipe! Gostaria de um diagnóstico técnico inicial e uma proposta para meu projeto com a LTI Sistemas.",
    },
  ];

  const getWhatsAppUrl = (customMessage: string) => {
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(customMessage)}`;
  };

  return (
    <section id="contato" className="py-20 md:py-28 relative overflow-hidden bg-slate-50/60 w-full max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <SectionHeading
          badgeText="Atendimento Imediato & Propostas"
          badgeVariant="blue"
          title="Fale Diretamente com a"
          highlightText="Liderança da LTI Sistemas"
          description="Sem burocracia ou intermediários. Inicie uma conversa no WhatsApp em 1 clique com o contexto do seu projeto e receba retorno técnico ágil."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          {/* Main Direct Authority Card (Col Span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Primary Direct WhatsApp Authority Hub */}
            <div className="p-7 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden">
              {/* Status Header with Founder Thumbnail */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-400 shadow-sm shrink-0">
                    <Image
                      src="/images/hero-person.jpg"
                      alt={siteConfig.founder}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {siteConfig.founder}
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">Chief Solutions Architect</span>
                  </div>
                </div>
                <Badge variant="emerald" dot size="md">
                  Online
                </Badge>
              </div>

              {/* Authority Information */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-emerald-600">
                  <WhatsAppIcon className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">WhatsApp Corporativo</span>
                </div>
                <span className="text-xs font-bold text-emerald-600 font-mono">
                  {siteConfig.contact.whatsappDisplay}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 mb-6 space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>
                    Canal direto com a liderança técnica
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>Retorno prioritário em até 2 horas</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-purple-600 shrink-0" />
                  <span>Sigilo corporativo e acordo de confidencialidade</span>
                </div>
              </div>

              {/* Big Direct Button */}
              <Button
                href={siteConfig.contact.whatsappUrl}
                isExternal
                variant="emerald"
                size="lg"
                fullWidth
                onClick={() =>
                  trackEvent("whatsapp_click", {
                    location: "contact_hub_main_button",
                  })
                }
                icon={<WhatsAppIcon className="h-5 w-5" />}
                iconRight={<ArrowUpRight className="h-4 w-4" />}
                className="text-base"
              >
                Iniciar Conversa no WhatsApp
              </Button>
            </div>

            {/* LinkedIn Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-blue-300 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-blue-200 shrink-0 shadow-2xs">
                    <Image
                      src="/images/hero-person.jpg"
                      alt={siteConfig.founder}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{siteConfig.founder}</h4>
                    <span className="text-xs text-slate-500">LinkedIn • Artigos & Conexão</span>
                  </div>
                </div>
                <Badge variant="blue" size="sm">
                  Oficial
                </Badge>
              </div>

              <Button
                href={siteConfig.contact.linkedinUrl}
                isExternal
                variant="secondary"
                size="sm"
                fullWidth
                onClick={() =>
                  trackEvent("linkedin_click", { location: "contact_hub_card" })
                }
                icon={<LinkedInIcon className="h-3.5 w-3.5" />}
                iconRight={<ArrowUpRight className="h-3.5 w-3.5" />}
              >
                Conectar no LinkedIn
              </Button>
            </div>

            {/* Email Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-xs text-slate-500 block font-semibold">E-mail Corporativo</span>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-sm font-semibold text-blue-600 hover:underline truncate block"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Categorized 1-Click WhatsApp Topics (Col Span 7) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wider">
                  Selecione o Assunto para Iniciar no WhatsApp
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">1-Clique direto</span>
            </div>

            <p className="text-xs text-slate-500 mb-1">
              Escolha o tema mais alinhado com a necessidade da sua empresa para abrir o WhatsApp com a mensagem personalizada:
            </p>

            <div className="flex flex-col gap-3 w-full">
              {quickTopics.map((topic) => (
                <a
                  key={topic.id}
                  href={getWhatsAppUrl(topic.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent("whatsapp_click", {
                      location: `contact_topic_${topic.id}`,
                      topic: topic.title,
                    })
                  }
                  className="group block p-4 sm:p-5 rounded-2xl bg-white hover:bg-slate-50/80 border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer shadow-2xs w-full"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      <div
                        className={`h-10 w-10 rounded-xl ${topic.iconBg} border flex items-center justify-center shrink-0 transition-colors shadow-2xs`}
                      >
                        {topic.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1 leading-snug">
                          {topic.title}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed mb-3">
                          {topic.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {topic.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 pt-1">
                      <div className="h-8 w-8 rounded-full bg-emerald-50 group-hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-all">
                        <WhatsAppIcon className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
