import React from "react";
import { experienceTimeline } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Building2, CheckCircle, Calendar } from "lucide-react";

export function Experience() {
  return (
    <section id="historico" className="py-20 md:py-32 relative overflow-hidden bg-slate-950/40">
      {/* Background glow */}
      <div className="glow-emerald top-1/2 left-10 w-96 h-96 opacity-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badgeText="DNA Enterprise & Bagagem"
          badgeVariant="emerald"
          title="Histórico de Impacto em"
          highlightText="Grandes Ecossistemas"
          description="A solidez técnica da LTI Sistemas é fundamentada em duas décadas de resolução de desafios de alta escala, segurança rigorosa e arquiteturas de missão crítica."
        />

        <div className="max-w-4xl mx-auto space-y-8">
          {experienceTimeline.map((item, index) => (
            <div key={index} className="relative pl-6 sm:pl-8 border-l-2 border-slate-800 group">
              {/* Timeline marker node */}
              <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-slate-950 border-2 border-cyan-400 group-hover:scale-125 group-hover:bg-cyan-400 transition-all duration-300" />

              <Card className="p-6 sm:p-8 border-slate-800 bg-slate-900/50" hoverEffect>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg sm:text-xl font-bold text-white">
                        {item.role}
                      </span>
                      {item.badge && (
                        <Badge
                          variant={index === 0 ? "emerald" : "cyan"}
                          size="sm"
                          dot={index === 0}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-cyan-400 font-medium">
                      <Building2 className="h-4 w-4 text-slate-400" />
                      <span>{item.company}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800/80 shrink-0 w-fit">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>{item.period}</span>
                  </div>
                </div>

                <p className="text-sm text-slate-300 mb-5 leading-relaxed">
                  {item.description}
                </p>

                <div className="space-y-2 mb-6 pt-3 border-t border-slate-800/60">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Marcos & Resultados Técnicos:
                  </span>
                  {item.achievements.map((achievement, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                      <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{achievement}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800/60">
                  {item.technologies.map((tech, idx) => (
                    <Badge key={idx} variant="slate" size="sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
