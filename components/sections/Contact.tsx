"use client";

import React, { useState } from "react";
import { siteConfig } from "@/lib/data";
import { trackEvent } from "@/lib/analytics";
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
  Loader2,
  Sparkles,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "Consultoria em Arquitetura & Cloud",
    message: "",
    honeypot: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
        trackEvent("proposal_submit", {
          projectType: formData.projectType,
          hasCompany: !!formData.company,
        });
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Não foi possível enviar a proposta. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      setStatus("error");
      setErrorMessage("Erro de conexão. Por favor, tente novamente ou use o WhatsApp.");
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      company: "",
      projectType: "Consultoria em Arquitetura & Cloud",
      message: "",
      honeypot: "",
    });
    setStatus("idle");
    setErrorMessage("");
  };

  // WhatsApp urgency URL
  const whatsAppUrgentUrl = `https://wa.me/5581973123278?text=${encodeURIComponent(
    `Olá, Luiz Felipe! Acabei de enviar uma proposta pelo site para a LTI Sistemas a respeito de "${formData.projectType}". Seguem meus dados:\n\nNome: ${formData.name}\nEmpresa: ${formData.company || "Não informada"}\nE-mail: ${formData.email}`
  )}`;

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
          description="Envie sua solicitação diretamente para a equipe técnica da LTI Sistemas para diagnósticos de arquitetura, aceleração de squads, modernização de legados e engenharia sob medida."
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
                onClick={() => trackEvent("whatsapp_click", { location: "contact_direct_card" })}
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

          {/* Direct 1-Click Form Column */}
          <div className="lg:col-span-7">
            <Card className="p-6 sm:p-8 border-slate-800 bg-slate-900/70 shadow-2xl relative overflow-hidden">
              {status === "success" ? (
                /* Instant On-Page Success Confirmation Screen */
                <div className="space-y-6 py-4 text-center animate-in fade-in zoom-in-95 duration-300">
                  <div className="h-16 w-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-xl shadow-emerald-950/40">
                    <CheckCircle2 className="h-9 w-9" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Proposta Enviada com Sucesso!
                    </h3>
                    <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                      Sua solicitação foi entregue diretamente na caixa de entrada da LTI Sistemas. Nossa liderança técnica fará a triagem inicial e retornará no e-mail <strong className="text-cyan-400">{formData.email}</strong> em até 24h úteis.
                    </p>
                  </div>

                  {/* Sent Data Summary */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-left max-w-md mx-auto space-y-2">
                    <div className="flex justify-between text-slate-400 border-b border-slate-800/80 pb-1.5">
                      <span>Solicitante:</span>
                      <strong className="text-slate-200">{formData.name}</strong>
                    </div>
                    {formData.company && (
                      <div className="flex justify-between text-slate-400 border-b border-slate-800/80 pb-1.5">
                        <span>Empresa:</span>
                        <strong className="text-slate-200">{formData.company}</strong>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-400">
                      <span>Necessidade:</span>
                      <strong className="text-slate-200">{formData.projectType}</strong>
                    </div>
                  </div>

                  {/* Urgent WhatsApp Option */}
                  <div className="pt-2 flex flex-col gap-3 max-w-md mx-auto">
                    <Button
                      href={whatsAppUrgentUrl}
                      isExternal
                      variant="emerald"
                      size="md"
                      fullWidth
                      onClick={() => trackEvent("whatsapp_click", { location: "contact_success_screen" })}
                      icon={<WhatsAppIcon className="h-4 w-4" />}
                      iconRight={<ArrowUpRight className="h-4 w-4" />}
                    >
                      Falar Também no WhatsApp (Opcional)
                    </Button>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 py-2 transition-colors"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Enviar outra proposta ou mensagem</span>
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
                    Preencha as informações do seu projeto. O envio é feito diretamente pelo site e nossa equipe técnica responderá por e-mail.
                  </p>

                  {status === "error" && (
                    <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start gap-3 text-red-200 text-xs animate-in fade-in">
                      <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-semibold">Falha no envio</strong>
                        <span>{errorMessage}</span>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Anti-spam honeypot */}
                    <input
                      type="text"
                      name="honeypot"
                      value={formData.honeypot}
                      onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                      className="hidden"
                      tabIndex={-1}
                      autoComplete="off"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                          Seu Nome *
                        </label>
                        <input
                          type="text"
                          required
                          disabled={status === "submitting"}
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Ex: Carlos Silva"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                          Empresa / Organização
                        </label>
                        <input
                          type="text"
                          disabled={status === "submitting"}
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="Nome da sua empresa"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50"
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
                        disabled={status === "submitting"}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="carlos@empresa.com.br"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Tipo de Necessidade / Solução
                      </label>
                      <select
                        disabled={status === "submitting"}
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50"
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
                        disabled={status === "submitting"}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Conte-nos sobre os desafios atuais, tecnologias em uso e objetivos de negócio..."
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors resize-none disabled:opacity-50"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      disabled={status === "submitting"}
                      icon={
                        status === "submitting" ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )
                      }
                    >
                      {status === "submitting"
                        ? "Enviando Proposta Diretamente..."
                        : "Enviar Proposta Corporativa"}
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
