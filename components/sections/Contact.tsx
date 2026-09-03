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
  Copy,
  Check,
  RotateCcw,
  Sparkles,
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
  const [isCopied, setIsCopied] = useState(false);

  // Formatted payloads
  const formattedSubject = `[LTI Sistemas - Proposta Corporativa] ${formData.projectType} - ${
    formData.company ? `${formData.company} (${formData.name})` : formData.name
  }`;

  const formattedEmailBody = `Olá, equipe LTI Sistemas!\n\nGostaria de solicitar uma proposta corporativa / diagnóstico técnico com os seguintes detalhes:\n\n👤 Nome: ${formData.name}\n🏢 Empresa: ${
    formData.company || "Não informada"
  }\n📧 E-mail: ${formData.email}\n📌 Tipo de Necessidade: ${
    formData.projectType
  }\n\n📝 Detalhes do Projeto / Escopo:\n${
    formData.message
  }\n\n---\nSolicitação gerada através do portal oficial LTI Sistemas (ltisistemas.com.br).`;

  const formattedWhatsAppBody = `*Solicitação de Proposta Corporativa - LTI Sistemas*\n\n*Nome:* ${
    formData.name
  }\n*Empresa:* ${formData.company || "Não informada"}\n*E-mail:* ${
    formData.email
  }\n*Necessidade:* ${formData.projectType}\n\n*Detalhes do Projeto:*\n${
    formData.message
  }`;

  const encodedSubject = encodeURIComponent(formattedSubject);
  const encodedEmailBody = encodeURIComponent(formattedEmailBody);
  const encodedWhatsAppBody = encodeURIComponent(formattedWhatsAppBody);

  // Direct dispatch endpoints
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${siteConfig.contact.email}&su=${encodedSubject}&body=${encodedEmailBody}`;
  const whatsAppProposalUrl = `https://wa.me/5581973123278?text=${encodedWhatsAppBody}`;
  const mailtoUrl = `mailto:${siteConfig.contact.email}?subject=${encodedSubject}&body=${encodedEmailBody}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitted(true);
  };

  const handleCopyProposal = () => {
    const textToCopy = `Assunto: ${formattedSubject}\n\n${formattedEmailBody}`;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setIsCopied(false);
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

          {/* Inquiry Form / Multi-Channel Dispatch Column */}
          <div className="lg:col-span-7">
            <Card className="p-6 sm:p-8 border-slate-800 bg-slate-900/70 shadow-2xl relative overflow-hidden">
              {isSubmitted ? (
                /* Multi-Channel Proposal Dispatch View */
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        Proposta Estruturada com Sucesso!
                      </h3>
                      <p className="text-xs text-slate-400">
                        Selecione o canal de sua preferência para concluir o envio à equipe técnica:
                      </p>
                    </div>
                  </div>

                  {/* Proposal Summary Box */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
                    <div className="flex justify-between text-slate-400">
                      <span>Solicitante:</span>
                      <strong className="text-slate-200">{formData.name}</strong>
                    </div>
                    {formData.company && (
                      <div className="flex justify-between text-slate-400">
                        <span>Empresa:</span>
                        <strong className="text-slate-200">{formData.company}</strong>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-400">
                      <span>E-mail:</span>
                      <strong className="text-cyan-400">{formData.email}</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Necessidade:</span>
                      <strong className="text-slate-200">{formData.projectType}</strong>
                    </div>
                  </div>

                  {/* Dispatch Channel Triggers */}
                  <div className="flex flex-col gap-3">
                    {/* Option 1: Gmail Webmail (1-Click) */}
                    <a
                      href={gmailComposeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/40 hover:border-red-400 text-white transition-all group shadow-lg shadow-red-950/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                          <Mail className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-bold flex items-center gap-1.5">
                            <span>Enviar via Gmail Webmail</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/30 text-red-300 font-normal">Recomendado</span>
                          </div>
                          <span className="text-xs text-slate-300">Abre o Gmail no navegador com tudo preenchido</span>
                        </div>
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" />
                    </a>

                    {/* Option 2: WhatsApp Corporativo (1-Click) */}
                    <a
                      href={whatsAppProposalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 hover:border-emerald-400 text-white transition-all group shadow-lg shadow-emerald-950/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                          <WhatsAppIcon className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-bold">Encaminhar via WhatsApp Corporativo</div>
                          <span className="text-xs text-slate-300">Contato direto com a liderança técnica</span>
                        </div>
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" />
                    </a>

                    {/* Option 3: Default Mailto */}
                    <a
                      href={mailtoUrl}
                      className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-slate-400 shrink-0">
                          <Send className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-semibold">Abrir no Aplicativo de E-mail (Outlook / Apple Mail)</div>
                        </div>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-slate-300" />
                    </a>
                  </div>

                  {/* Utility actions */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={handleCopyProposal}
                      className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">Proposta copiada!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copiar texto formatado</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Editar dados ou enviar nova proposta</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Proposal Form View */
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-cyan-400" />
                    <h3 className="text-xl font-bold text-white">
                      Solicitar Proposta ou Diagnóstico Técnico
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 mb-6">
                    Preencha as informações do seu projeto. Você poderá escolher o canal de envio preferido (Gmail, WhatsApp ou E-mail corporativo).
                  </p>

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
                      Estruturar e Enviar Proposta
                    </Button>
                  </form>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
