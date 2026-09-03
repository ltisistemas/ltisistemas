"use client";

import React from "react";
import { siteConfig } from "@/lib/data";
import { trackEvent } from "@/lib/analytics";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
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
      icon: <Cloud className="h-5 w-5 text-cyan-400" />,
      badge: "Arquitetura",
      badgeVariant: "cyan" as const,
      message:
        "Olá, Luiz Felipe! Gostaria de conversar sobre Consultoria em Arquitetura e Cloud-Native para minha empresa.",
    },
    {
      id: "squad",
      title: "Alocação de Tech Lead & Squad Acceleration",
      description: "Liderança técnica sênior, mentoria de desenvolvedores e governança de código.",
      tags: ["Tech Lead as a Service", "Squads", "Code Review"],
      icon: <Users className="h-5 w-5 text-emerald-400" />,
      badge: "Liderança",
      badgeVariant: "emerald" as const,
      message:
        "Olá, Luiz Felipe! Tenho interesse em Tech Lead as a Service e aceleração de squads para meu time.",
    },
    {
      id: "modernization",
      title: "Modernização de Legados sem Downtime",
      description: "Migração progressiva para nuvem, desacoplamento de monólitos e refatoração.",
      tags: ["Zero Downtime", "Strangler Fig", "Performance"],
      icon: <RefreshCw className="h-5 w-5 text-purple-400" />,
      badge: "Modernização",
      badgeVariant: "purple" as const,
      message:
        "Olá, Luiz Felipe! Gostaria de entender como funciona a modernização de sistemas legados sem downtime.",
    },
    {
      id: "custom_saas",
      title: "Engenharia Sob Medida & Plataformas SaaS",
      description: "Construção de novos produtos digitais do zero com arquitetura corporativa.",
      tags: ["Novo SaaS", "Full-Stack", "Alta Performance"],
      icon: <Code2 className="h-5 w-5 text-blue-400" />,
      badge: "Desenvolvimento",
      badgeVariant: "cyan" as const,
      message:
        "Olá, Luiz Felipe! Quero desenvolver um novo software sob medida / plataforma SaaS para minha empresa.",
    },
    {
      id: "general_diagnostic",
      title: "Diagnóstico Técnico Geral & Proposta Rápida",
      description: "Tire dúvidas sobre escopo, prazos estimados e viabilidade técnica da sua ideia.",
      tags: ["Diagnóstico", "Estimativa", "Atendimento Direto"],
      icon: <MessageSquare className="h-5 w-5 text-emerald-400" />,
      badge: "Proposta Rápida",
      badgeVariant: "emerald" as const,
      message:
        "Olá, Luiz Felipe! Gostaria de um diagnóstico técnico inicial e uma proposta para meu projeto com a LTI Sistemas.",
    },
  ];

  const getWhatsAppUrl = (customMessage: string) => {
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(customMessage)}`;
  };

  return (
    <section id="contato" className="py-20 md:py-32 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="glow-cyan bottom-10 left-1/4 w-[600px] h-[600px] opacity-15" />
      <div className="glow-emerald top-20 right-1/4 w-[500px] h-[500px] opacity-15" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badgeText="Atendimento Imediato no WhatsApp"
          badgeVariant="emerald"
          title="Fale Diretamente com a"
          highlightText="Liderança Técnica da LTI Sistemas"
          description="Sem formulários lentos ou intermediários. Inicie uma conversa no WhatsApp em 1 clique com o contexto do seu projeto e receba retorno técnico ágil."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          {/* Main Direct Authority Card (Col Span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Primary Direct WhatsApp Authority Hub */}
            <Card
              className="p-6 sm:p-8 border-emerald-500/40 bg-gradient-to-b from-slate-900/90 to-emerald-950/30 shadow-2xl shadow-emerald-950/30 relative overflow-hidden"
              hoverEffect
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Status Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950/40">
                  <WhatsAppIcon className="h-6 w-6" />
                </div>
                <Badge variant="emerald" dot size="md" className="px-3 py-1">
                  Atendimento Online
                </Badge>
              </div>

              {/* Authority Information */}
              <h3 className="text-xl font-extrabold text-white mb-1">
                WhatsApp Corporativo
              </h3>
              <p className="text-sm font-mono font-bold text-emerald-400 mb-4">
                {siteConfig.contact.whatsappDisplay}
              </p>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 mb-6 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>
                    Converse com <strong className="text-white">Luiz Felipe Marinho Dantas</strong> (Fundador & Chief Solutions Architect)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>Retorno técnico prioritário</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-purple-400 shrink-0" />
                  <span>Sigilo corporativo e alinhamento de NDA</span>
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
                iconRight={<ArrowUpRight className="h-5 w-5" />}
                className="shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 text-base"
              >
                Iniciar Conversa Geral no WhatsApp
              </Button>
            </Card>

            {/* LinkedIn Card */}
            <Card className="p-5 border-slate-800 bg-slate-900/60" hoverEffect>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <LinkedInIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">LinkedIn da Liderança</h4>
                    <span className="text-xs text-slate-400">Artigos & Trajetória Técnica</span>
                  </div>
                </div>
                <Badge variant="cyan" size="sm">
                  Perfil Oficial
                </Badge>
              </div>

              <Button
                href={siteConfig.contact.linkedinUrl}
                isExternal
                variant="outline"
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
            </Card>

            {/* Email Card */}
            <Card className="p-5 border-slate-800 bg-slate-900/60" hoverEffect>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-xs text-slate-400 block font-medium">E-mail Corporativo</span>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-sm font-semibold text-cyan-400 hover:underline truncate block"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>
            </Card>
          </div>

          {/* Categorized 1-Click WhatsApp Topics (Col Span 7) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                  Selecione o Assunto para Iniciar no WhatsApp
                </h3>
              </div>
              <span className="text-xs text-slate-400 hidden sm:inline">1-Clique direto</span>
            </div>

            <p className="text-xs text-slate-400 mb-1">
              Escolha o tema mais alinhado com o seu momento para abrir o WhatsApp já com a mensagem e contexto específicos estruturados:
            </p>

            <div className="flex flex-col gap-3">
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
                  className="group block p-4 sm:p-5 rounded-2xl bg-slate-900/70 hover:bg-slate-900/95 border border-slate-800/80 hover:border-cyan-500/50 transition-all duration-200 shadow-md hover:shadow-xl hover:shadow-cyan-950/20 relative cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div className="h-10 w-10 rounded-xl bg-slate-950 border border-slate-800 group-hover:border-cyan-500/40 flex items-center justify-center shrink-0 transition-colors">
                        {topic.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {topic.title}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed mb-3">
                          {topic.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {topic.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800/60"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 pt-1">
                      <div className="h-8 w-8 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-all">
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
