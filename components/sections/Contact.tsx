"use client";

import React, { useState } from "react";
import { siteConfig } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { WhatsAppIcon, LinkedInIcon } from "@/components/ui/Icons";
import {
  Mail,
  Send,
  CheckCircle2,
  ArrowUpRight,
  Building,
} from "lucide-react";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "Consultoria em Arquitetura & Cloud",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    // Compose mailto as accessible fallback
    const mailtoSubject = encodeURIComponent(
      `[LTI Sistemas - Proposta Corporativa] ${formData.projectType} - ${formData.company ? `${formData.company} (${formData.name})` : formData.name}`
    );
    const mailtoBody = encodeURIComponent(
      `Nome: ${formData.name}\nEmail: ${formData.email}\nEmpresa: ${formData.company || "Não informada"}\nTipo de Necessidade: ${formData.projectType}\n\nDetalhes do Projeto / Escopo:\n${formData.message}`
    );
    window.location.href = `mailto:${siteConfig.contact.email}?subject=${mailtoSubject}&body=${mailtoBody}`;

    setIsSubmitted(true);
  };

  return (
    <section id="contato" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background glow */}
      <div className="glow-cyan bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] opacity-15" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badgeText="Contato Corporativo"
          badgeVariant="cyan"
          title="Vamos Estruturar o Próximo"
          highlightText="Salto Tecnológico da sua Empresa?"
          description="Fale diretamente com os especialistas da LTI Sistemas para diagnósticos de arquitetura, aceleração de squads, modernização de legados e engenharia sob medida."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
          {/* Direct Channels Column */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* WhatsApp Direct Card (Primary Conversion) */}
            <Card
              className="p-6 border-emerald-500/40 bg-emerald-950/20 shadow-xl shadow-emerald-950/20"
              hoverEffect
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <WhatsAppIcon className="h-5 w-5" />
                </div>
                <Badge variant="emerald" dot size="sm">
                  Atendimento Ágil
                </Badge>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">
                WhatsApp Corporativo
              </h3>
              <p className="text-xs font-mono font-semibold text-emerald-400 mb-2">
                {siteConfig.contact.whatsappDisplay}
              </p>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                Converse diretamente com a equipe técnica da LTI Sistemas para esclarecer dúvidas e agendar uma reunião de alinhamento.
              </p>

              <Button
                href={siteConfig.contact.whatsappUrl}
                isExternal
                variant="emerald"
                size="md"
                fullWidth
                icon={<WhatsAppIcon className="h-4 w-4" />}
                iconRight={<ArrowUpRight className="h-4 w-4" />}
              >
                Abrir WhatsApp Corporativo
              </Button>
            </Card>

            {/* LinkedIn Card */}
            <Card className="p-6 border-slate-800 bg-slate-900/50" hoverEffect>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <LinkedInIcon className="h-5 w-5" />
                </div>
                <Badge variant="cyan" size="sm">
                  Direção Técnica
                </Badge>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">
                Conexão Profissional
              </h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Acompanhe publicações, artigos e novidades sobre arquitetura de software e governança corporativa.
              </p>

              <Button
                href={siteConfig.contact.linkedinUrl}
                isExternal
                variant="outline"
                size="md"
                fullWidth
                icon={<LinkedInIcon className="h-4 w-4" />}
                iconRight={<ArrowUpRight className="h-4 w-4" />}
              >
                Ver Perfil da Liderança
              </Button>
            </Card>

            {/* Direct Email Card */}
            <Card className="p-6 border-slate-800 bg-slate-900/50" hoverEffect>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-300 shrink-0">
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

          {/* Inquiry Form Column */}
          <div className="lg:col-span-7">
            <Card className="p-8 border-slate-800 bg-slate-900/60 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-2">
                Solicitar Proposta ou Diagnóstico Técnico
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mb-6">
                Descreva as necessidades da sua empresa e nossa liderança técnica retornará com uma análise prévia.
              </p>

              {isSubmitted ? (
                <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-3 animate-in fade-in">
                  <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
                  <h4 className="text-base font-bold text-white">Solicitação Recebida!</h4>
                  <p className="text-xs text-slate-300">
                    Agradecemos o contato. Nossa equipe entrará em contato em breve através do e-mail corporativo informado.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSubmitted(false)}
                    className="mt-2"
                  >
                    Enviar nova mensagem
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Seu Nome *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: Carlos Silva"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Empresa / Organização
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Nome da sua empresa"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Seu E-mail Corporativo *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="carlos@empresa.com.br"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Tipo de Necessidade / Solução
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                    >
                      <option value="Consultoria em Arquitetura & Cloud">Consultoria em Arquitetura & Cloud-Native</option>
                      <option value="Alocação de Tech Lead / Squad Acceleration">Alocação de Tech Lead & Squad Acceleration</option>
                      <option value="Modernização de Sistemas Legados">Modernização de Sistemas Legados sem Downtime</option>
                      <option value="Engenharia de Software Sob Medida">Engenharia de Software Sob Medida (Sistemas Críticos)</option>
                      <option value="Desenvolvimento de Novo Produto / SaaS">Desenvolvimento de Novo Produto Digital / SaaS</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Descreva o contexto ou objetivo do projeto *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Conte-nos sobre os desafios atuais, tecnologias em uso e objetivos de negócio..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    icon={<Send className="h-4 w-4" />}
                  >
                    Solicitar Proposta Corporativa
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
