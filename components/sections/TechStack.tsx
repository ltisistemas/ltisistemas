import React from "react";
import { techStackCategories } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Server,
  Layout,
  Cloud,
  Terminal,
  Database,
  ShieldCheck,
} from "lucide-react";

export function TechStack() {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Server":
        return <Server className="h-5 w-5 text-cyan-400" />;
      case "Layout":
        return <Layout className="h-5 w-5 text-emerald-400" />;
      case "Cloud":
        return <Cloud className="h-5 w-5 text-blue-400" />;
      case "Terminal":
        return <Terminal className="h-5 w-5 text-purple-400" />;
      case "Database":
        return <Database className="h-5 w-5 text-amber-400" />;
      case "ShieldCheck":
        return <ShieldCheck className="h-5 w-5 text-emerald-400" />;
      default:
        return <Server className="h-5 w-5 text-cyan-400" />;
    }
  };

  return (
    <section id="metodologia" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background glow */}
      <div className="glow-cyan top-1/3 right-0 w-80 h-80 opacity-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badgeText="Metodologia & Stack"
          badgeVariant="cyan"
          title="Arsenal Tecnológico &"
          highlightText="Padrões de Governança"
          description="Tecnologias corporativas consolidadas e padrões arquiteturais modernos aplicados pela LTI Sistemas para garantir a perenidade do seu software."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStackCategories.map((category, index) => (
            <Card
              key={index}
              className="p-6 border-slate-800 bg-slate-900/40 flex flex-col justify-between"
              hoverEffect
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                    {getCategoryIcon(category.iconName)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white leading-tight">
                      {category.name}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-800/60">
                  {category.skills.map((skill, idx) => (
                    <Badge
                      key={idx}
                      variant={skill.highlight ? "cyan" : "slate"}
                      size="sm"
                      className="text-xs"
                    >
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
