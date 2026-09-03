import React from "react";
import { servicesData } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Cpu,
  Boxes,
  Users,
  CloudCog,
  Layers,
  CheckCircle2,
} from "lucide-react";

export function Services() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Cpu":
        return <Cpu className="h-6 w-6 text-cyan-400" />;
      case "Boxes":
        return <Boxes className="h-6 w-6 text-emerald-400" />;
      case "Users":
        return <Users className="h-6 w-6 text-purple-400" />;
      case "CloudCog":
        return <CloudCog className="h-6 w-6 text-blue-400" />;
      case "Layers":
        return <Layers className="h-6 w-6 text-amber-400" />;
      default:
        return <Cpu className="h-6 w-6 text-cyan-400" />;
    }
  };

  return (
    <section id="solucoes" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background glow element */}
      <div className="glow-cyan top-1/2 left-0 w-96 h-96 opacity-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badgeText="Nossas Soluções"
          badgeVariant="cyan"
          title="Soluções de Engenharia para"
          highlightText="Empresas em Escala"
          description="Oferecemos 5 pilares estratégicos de atuação técnica para elevar a capacidade tecnológica, a confiabilidade e a velocidade de entrega da sua organização."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData.map((service, index) => (
            <Card
              key={service.id}
              className={`p-6 sm:p-8 flex flex-col justify-between border-slate-800/80 bg-slate-900/50 ${
                index === 0 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
              hoverEffect
              glow="cyan"
            >
              <div>
                {/* Header with Icon and Number */}
                <div className="flex items-center justify-between mb-6">
                  <div className="h-12 w-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shadow-lg shadow-black/40">
                    {getIcon(service.iconName)}
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-500">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-1.5 leading-snug">
                  {service.title}
                </h3>
                <p className="text-xs font-medium text-cyan-400 mb-4">
                  {service.subtitle}
                </p>

                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Key Deliverables */}
                <div className="space-y-2.5 mb-6 pt-4 border-t border-slate-800/60">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                    Entregáveis & Atuação LTI:
                  </span>
                  {service.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies footer */}
              <div className="pt-4 border-t border-slate-800/60 flex flex-wrap gap-1.5">
                {service.technologies.map((tech, idx) => (
                  <Badge key={idx} variant="slate" size="sm">
                    {tech}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
