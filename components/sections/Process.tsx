import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Compass, GitBranch, Rocket, ArrowRight, Check } from "lucide-react";

export function Process() {
  const steps = [
    {
      number: "01",
      title: "Diagnóstico & Arquitetura",
      subtitle: "Mapeamento & Design Estratégico",
      description:
        "Análise profunda dos requisitos de negócio, mapeamento de débitos técnicos, desenho de Clean Architecture e definição do modelo de dados para suportar hipercrescimento.",
      icon: Compass,
      color: "blue",
      badgeClass: "bg-blue-50 text-blue-600 border-blue-100",
      accentDot: "bg-blue-600",
      highlights: [
        "Clean Architecture & Domain-Driven Design (DDD)",
        "Diagnóstico de gargalos e plano de escalabilidade",
        "Segurança corporativa e compliance desde o dia 1",
      ],
    },
    {
      number: "02",
      title: "Engenharia Ágil, TDD & CI/CD",
      subtitle: "Desenvolvimento de Alta Precisão",
      description:
        "Construção modular de microsserviços e APIs com cobertura rigorosa de testes unitários/integração, esteiras automatizadas de CI/CD e governança de código limpo.",
      icon: GitBranch,
      color: "emerald",
      badgeClass: "bg-emerald-50 text-emerald-600 border-emerald-100",
      accentDot: "bg-emerald-600",
      highlights: [
        "Test-Driven Development (TDD) e automação",
        "Esteiras de CI/CD (GitHub Actions / Azure DevOps)",
        "Code Reviews rigorosos e mentoria técnica",
      ],
    },
    {
      number: "03",
      title: "Deploy em Nuvem & Escala",
      subtitle: "Operação Contínua & Zero Downtime",
      description:
        "Implementação cloud-native (AWS/Azure) com Infraestrutura como Código (Terraform/Docker), observabilidade completa e suporte contínuo para evolução estável.",
      icon: Rocket,
      color: "amber",
      badgeClass: "bg-amber-50 text-amber-600 border-amber-100",
      accentDot: "bg-amber-600",
      highlights: [
        "Infraestrutura Cloud-Native resiliente e escalável",
        "Modernização progressiva com zero indisponibilidade",
        "Monitoramento analítico e suporte executivo",
      ],
    },
  ];

  return (
    <section id="metodologia" className="py-20 md:py-28 relative overflow-hidden bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badgeText="Metodologia & Processo"
          badgeVariant="blue"
          title="Como Construímos Sistemas de"
          highlightText="Alta Performance"
          description="Nossa esteira de engenharia combina rigor arquitetural e agilidade de entrega para transformar desafios corporativos em produtos sólidos e escaláveis."
        />

        {/* 3 Step Cards with connecting flow */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.number}
                className="flex flex-col justify-between p-7 sm:p-8 rounded-2xl bg-slate-50/60 border border-slate-200/80 shadow-2xs hover:bg-white hover:border-blue-300 hover:shadow-md transition-all duration-300 relative group"
              >
                <div>
                  {/* Top Step Pill & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`h-12 w-12 rounded-xl ${step.badgeClass} border flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent className="h-6 w-6" />
                    </div>

                    <span className="text-sm font-black text-slate-400 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-2xs">
                      Etapa {step.number}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-1 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs font-semibold text-blue-600 mb-4">
                    {step.subtitle}
                  </p>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {step.description}
                  </p>

                  {/* Step Highlights */}
                  <div className="space-y-2 pt-4 border-t border-slate-200/70">
                    {step.highlights.map((highlight, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
