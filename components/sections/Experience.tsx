import React from "react";
import { experienceTimeline } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Building2, CheckCircle, Calendar } from "lucide-react";

export function Experience() {
  return (
    <section id="historico" className="py-20 md:py-28 relative overflow-hidden bg-slate-50/50 border-t border-slate-200/80 w-full max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <SectionHeading
          badgeText="DNA Enterprise & Trajetória"
          badgeVariant="blue"
          title="Histórico de Impacto em"
          highlightText="Sistemas de Missão Crítica"
          description="A solidez técnica da LTI Sistemas é fundamentada em duas décadas de resolução de desafios de alta escala, segurança rigorosa e arquiteturas bancárias."
        />

        <div className="max-w-4xl mx-auto space-y-8">
          {experienceTimeline.map((item, index) => (
            <div key={index} className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 group">
              {/* Timeline marker node */}
              <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-white border-2 border-blue-600 group-hover:scale-125 group-hover:bg-blue-600 transition-all duration-300" />

              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg sm:text-xl font-bold text-slate-900">
                        {item.role}
                      </span>
                      {item.badge && (
                        <Badge
                          variant={index === 0 ? "emerald" : "blue"}
                          size="sm"
                          dot={index === 0}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-blue-600 font-semibold">
                      <Building2 className="h-4 w-4 text-slate-400" />
                      <span>{item.company}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 shrink-0 w-fit font-medium">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>{item.period}</span>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-5 leading-relaxed">
                  {item.description}
                </p>

                <div className="space-y-2 mb-6 pt-4 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Marcos & Resultados Técnicos:
                  </span>
                  {item.achievements.map((achievement, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{achievement}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                  {item.technologies.map((tech, idx) => (
                    <Badge key={idx} variant="default" size="sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
