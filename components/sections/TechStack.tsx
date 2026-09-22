import React from "react";
import { techStackCategories } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
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
        return <Server className="h-5 w-5 text-blue-600" />;
      case "Layout":
        return <Layout className="h-5 w-5 text-emerald-600" />;
      case "Cloud":
        return <Cloud className="h-5 w-5 text-sky-600" />;
      case "Terminal":
        return <Terminal className="h-5 w-5 text-purple-600" />;
      case "Database":
        return <Database className="h-5 w-5 text-amber-600" />;
      case "ShieldCheck":
        return <ShieldCheck className="h-5 w-5 text-emerald-600" />;
      default:
        return <Server className="h-5 w-5 text-blue-600" />;
    }
  };

  const getCategoryIconBg = (iconName: string) => {
    switch (iconName) {
      case "Server":
        return "bg-blue-50 border-blue-100";
      case "Layout":
        return "bg-emerald-50 border-emerald-100";
      case "Cloud":
        return "bg-sky-50 border-sky-100";
      case "Terminal":
        return "bg-purple-50 border-purple-100";
      case "Database":
        return "bg-amber-50 border-amber-100";
      case "ShieldCheck":
        return "bg-emerald-50 border-emerald-100";
      default:
        return "bg-blue-50 border-blue-100";
    }
  };

  return (
    <section id="stack" className="py-20 md:py-28 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badgeText="Arsenal Tecnológico"
          badgeVariant="blue"
          title="Stack de Engenharia &"
          highlightText="Padrões de Governança"
          description="Tecnologias consolidadas e práticas rigorosas de engenharia aplicadas pela LTI Sistemas para garantir estabilidade, segurança e longevidade."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStackCategories.map((category, index) => (
            <div
              key={index}
              className="p-6 sm:p-7 rounded-2xl bg-slate-50/70 border border-slate-200/80 shadow-2xs hover:bg-white hover:border-blue-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`h-10 w-10 rounded-xl ${getCategoryIconBg(
                      category.iconName
                    )} border flex items-center justify-center shrink-0 shadow-2xs`}
                  >
                    {getCategoryIcon(category.iconName)}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                      {category.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-slate-200/70">
                  {category.skills.map((skill, idx) => (
                    <Badge
                      key={idx}
                      variant={skill.highlight ? "blue" : "default"}
                      size="sm"
                    >
                      {skill.name}
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
