import React from "react";
import { siteConfig, companyPillars } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Code,
  Shield,
  Layers,
  Users2,
  Boxes,
  Award,
  ArrowUpRight,
  Building2,
  CheckCircle2,
} from "lucide-react";

export function About() {
  const getPillarIcon = (iconName: string) => {
    switch (iconName) {
      case "Shield":
        return <Shield className="h-5 w-5 text-emerald-400" />;
      case "Boxes":
        return <Boxes className="h-5 w-5 text-cyan-400" />;
      case "Users2":
        return <Users2 className="h-5 w-5 text-purple-400" />;
      case "Layers":
        return <Layers className="h-5 w-5 text-amber-400" />;
      default:
        return <Code className="h-5 w-5 text-cyan-400" />;
    }
  };

  return (
    <section id="sobre" className="py-20 md:py-32 relative overflow-hidden bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badgeText="Institucional"
          badgeVariant="cyan"
          title="Sobre a LTI Sistemas"
          highlightText="Engenharia com Propósito & Rigor"
          description="Transformamos desafios técnicos complexos em plataformas digitais de alta disponibilidade, governança de código e velocidade sustentável para sua empresa."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Company Narrative & Leadership Card */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <Card className="border-slate-800 bg-slate-900/60 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-cyan-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{siteConfig.name}</h3>
                  <p className="text-xs text-cyan-400 font-medium">{siteConfig.fullName}</p>
                </div>
              </div>

              <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                <p>
                  A <strong>LTI Sistemas</strong> é uma software house e consultoria de engenharia de software especializada no desenvolvimento de ecossistemas corporativos de alta complexidade, microsserviços escaláveis e modernização de aplicações.
                </p>
                <p>
                  Fundada e liderada pelo arquiteto sênior <strong>{siteConfig.founder}</strong> ({siteConfig.founderRole}), a empresa nasceu com a premissa de entregar para empresas em crescimento o mesmo rigor técnico e maturidade arquitetural praticados em gigantes como <strong>Tata Consultancy Services (TCS) / Banco Itaú</strong> e <strong>Petrobras</strong>.
                </p>
                <p>
                  Nossa atuação combina liderança técnica hands-on, implementação de esteiras seguras e arquitetura limpa (Clean Architecture), garantindo que seus produtos digitais e squads operem com máxima eficiência, sem débitos técnicos que impeçam a escalabilidade do negócio.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="emerald" dot size="sm">
                    4 Produtos Ativos
                  </Badge>
                  <Badge variant="slate" size="sm">
                    Padrão Enterprise
                  </Badge>
                </div>

                <Button
                  href={siteConfig.contact.linkedinUrl}
                  variant="outline"
                  size="sm"
                  isExternal
                  iconRight={<ArrowUpRight className="h-3.5 w-3.5" />}
                >
                  Direção Técnica (LinkedIn)
                </Button>
              </div>
            </Card>
          </div>

          {/* Company Pillars Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {companyPillars.map((item, index) => (
              <Card
                key={index}
                className="p-6 border-slate-800/70 bg-slate-900/40 flex flex-col justify-between"
                hoverEffect
              >
                <div>
                  <div className="h-10 w-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center mb-4 shadow-inner">
                    {getPillarIcon(item.iconName)}
                  </div>
                  <h4 className="text-base font-bold text-white mb-2 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
