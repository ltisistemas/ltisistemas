import React from "react";
import { portfolioProjects } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Globe,
  CheckCircle,
  ArrowUpRight,
  TrendingUp,
  Boxes,
  PieChart,
  FileCheck2,
} from "lucide-react";

export function Portfolio() {
  const getProjectIcon = (id: string) => {
    switch (id) {
      case "credit-flow-app":
        return <TrendingUp className="h-5 w-5 text-cyan-400" />;
      case "mainfast-mvp":
        return <Boxes className="h-5 w-5 text-emerald-400" />;
      case "meu-fluxo-financeiro":
        return <PieChart className="h-5 w-5 text-purple-400" />;
      case "quick-invoiceflow":
        return <FileCheck2 className="h-5 w-5 text-amber-400" />;
      default:
        return <Globe className="h-5 w-5 text-cyan-400" />;
    }
  };

  return (
    <section id="produtos" className="py-20 md:py-32 relative overflow-hidden bg-slate-950/50">
      {/* Background radial glow */}
      <div className="glow-emerald bottom-0 right-10 w-[500px] h-[500px] opacity-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badgeText="Produtos & Ecossistemas"
          badgeVariant="emerald"
          title="Plataformas Desenvolvidas"
          highlightText="pela LTI Sistemas"
          description="Explore 4 plataformas digitais completas desenvolvidas pela nossa engenharia, combinando arquitetura moderna, alta performance e foco em resultados operacionais."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {portfolioProjects.map((project) => (
            <Card
              key={project.id}
              className="p-6 sm:p-8 flex flex-col justify-between border-slate-800 bg-slate-900/50 group"
              hoverEffect
              glow="emerald"
            >
              <div>
                {/* Header with Category & Live Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <Badge variant="cyan" size="sm">
                    {project.category}
                  </Badge>
                  <Badge variant="emerald" dot size="sm">
                    {project.status}
                  </Badge>
                </div>

                {/* Project Title & Icon */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 shadow-inner group-hover:border-cyan-500/30 transition-colors">
                    {getProjectIcon(project.id)}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h3>
                </div>

                {/* Short & Full Description */}
                <p className="text-sm font-medium text-slate-300 mb-3 leading-relaxed">
                  {project.shortDescription}
                </p>
                <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
                  {project.fullDescription}
                </p>

                {/* Key Highlights */}
                <div className="space-y-2 mb-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Destaques de Engenharia LTI:
                  </span>
                  {project.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6 pt-2 border-t border-slate-800/60">
                  {project.techStack.map((tech, idx) => (
                    <Badge key={idx} variant="slate" size="sm">
                      {tech}
                    </Badge>
                  ))}
                </div>

                {/* External Action Button */}
                <Button
                  href={project.url}
                  isExternal
                  variant="primary"
                  size="md"
                  fullWidth
                  icon={<Globe className="h-4 w-4" />}
                  iconRight={<ArrowUpRight className="h-4 w-4" />}
                  className="shadow-md shadow-cyan-950/30"
                >
                  Conhecer Plataforma em Produção
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
