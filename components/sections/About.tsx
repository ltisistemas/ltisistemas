import React from "react";
import { siteConfig, companyPillars } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Code,
  Shield,
  Layers,
  Users2,
  Boxes,
  ArrowUpRight,
  Building2,
  CheckCircle2,
} from "lucide-react";

export function About() {
  const getPillarIcon = (iconName: string) => {
    switch (iconName) {
      case "Shield":
        return <Shield className="h-5 w-5 text-emerald-600" />;
      case "Boxes":
        return <Boxes className="h-5 w-5 text-blue-600" />;
      case "Users2":
        return <Users2 className="h-5 w-5 text-purple-600" />;
      case "Layers":
        return <Layers className="h-5 w-5 text-amber-600" />;
      default:
        return <Code className="h-5 w-5 text-blue-600" />;
    }
  };

  const getPillarBadgeBg = (iconName: string) => {
    switch (iconName) {
      case "Shield":
        return "bg-emerald-50 border-emerald-100";
      case "Boxes":
        return "bg-blue-50 border-blue-100";
      case "Users2":
        return "bg-purple-50 border-purple-100";
      case "Layers":
        return "bg-amber-50 border-amber-100";
      default:
        return "bg-blue-50 border-blue-100";
    }
  };

  return (
    <section id="diferenciais" className="py-20 md:py-28 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badgeText="Diferenciais & Governança"
          badgeVariant="blue"
          title="Por Que Escolher a"
          highlightText="LTI Sistemas"
          description="Transformamos desafios técnicos complexos em plataformas digitais de alta disponibilidade, governança de código e velocidade sustentável."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Company Narrative & Leadership Card */}
          <div className="lg:col-span-6 flex flex-col justify-between p-8 sm:p-10 rounded-2xl bg-slate-50/70 border border-slate-200/80 shadow-2xs">
            <div>
              <div className="flex items-center gap-3.5 mb-6">
                <div className="h-12 w-12 rounded-xl bg-blue-600 p-0.5 flex items-center justify-center shadow-md shadow-blue-600/20">
                  <div className="h-full w-full bg-white rounded-[10px] flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{siteConfig.name}</h3>
                  <p className="text-xs text-blue-600 font-semibold">{siteConfig.fullName}</p>
                </div>
              </div>

              <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                <p>
                  A <strong>LTI Sistemas</strong> é uma software house e consultoria de engenharia de software especializada no desenvolvimento de ecossistemas corporativos de alta complexidade, microsserviços escaláveis e modernização de aplicações legadas.
                </p>
                <p>
                  Fundada e liderada pelo arquiteto sênior <strong>{siteConfig.founder}</strong> ({siteConfig.founderRole}), a empresa nasceu com a premissa de entregar rigor técnico e maturidade arquitetural praticados em ambientes corporativos de ponta.
                </p>
                <p>
                  Nossa atuação combina liderança técnica hands-on, implementação de esteiras seguras e arquitetura limpa (Clean Architecture), garantindo que seus produtos digitais e squads operem com máxima eficiência.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="emerald" dot size="sm">
                  4 Produtos Ativos
                </Badge>
                <Badge variant="blue" size="sm">
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
          </div>

          {/* Company Pillars Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {companyPillars.map((item, index) => (
              <div
                key={index}
                className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`h-11 w-11 rounded-xl ${getPillarBadgeBg(
                      item.iconName
                    )} border flex items-center justify-center mb-4 shadow-2xs`}
                  >
                    {getPillarIcon(item.iconName)}
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
