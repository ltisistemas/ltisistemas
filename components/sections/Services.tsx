import React from "react";
import { servicesData } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
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
        return <Cpu className="h-6 w-6 text-blue-600" />;
      case "Boxes":
        return <Boxes className="h-6 w-6 text-emerald-600" />;
      case "Users":
        return <Users className="h-6 w-6 text-purple-600" />;
      case "CloudCog":
        return <CloudCog className="h-6 w-6 text-sky-600" />;
      case "Layers":
        return <Layers className="h-6 w-6 text-amber-600" />;
      default:
        return <Cpu className="h-6 w-6 text-blue-600" />;
    }
  };

  const getIconContainerStyle = (index: number) => {
    switch (index % 5) {
      case 0:
        return "bg-blue-50 border-blue-100";
      case 1:
        return "bg-emerald-50 border-emerald-100";
      case 2:
        return "bg-purple-50 border-purple-100";
      case 3:
        return "bg-sky-50 border-sky-100";
      case 4:
        return "bg-amber-50 border-amber-100";
      default:
        return "bg-blue-50 border-blue-100";
    }
  };

  return (
    <section id="solucoes" className="py-20 md:py-28 relative overflow-hidden bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badgeText="Especialidades & Engenharia"
          badgeVariant="blue"
          title="Soluções Corporativas para"
          highlightText="Operações em Escala"
          description="Atuação estratégica de ponta a ponta para elevar a maturidade técnica, a escalabilidade da arquitetura e a velocidade de entrega do seu negócio."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData.map((service, index) => (
            <div
              key={service.id}
              className={`p-6 sm:p-8 flex flex-col justify-between rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all duration-300 ${
                index === 0 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div>
                {/* Header with Icon and Tag */}
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`h-12 w-12 rounded-xl ${getIconContainerStyle(
                      index
                    )} border flex items-center justify-center shadow-2xs`}
                  >
                    {getIcon(service.iconName)}
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    Módulo 0{index + 1}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-1.5 leading-snug">
                  {service.title}
                </h3>
                <p className="text-xs font-semibold text-blue-600 mb-4">
                  {service.subtitle}
                </p>

                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Key Deliverables */}
                <div className="space-y-2.5 mb-6 pt-5 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    Entregáveis & Atuação LTI:
                  </span>
                  {service.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies footer */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
                {service.technologies.map((tech, idx) => (
                  <Badge key={idx} variant="default" size="sm">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
