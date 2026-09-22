"use client";

import React, { useState } from "react";
import { portfolioProjects } from "@/lib/data";
import { trackEvent } from "@/lib/analytics";
import { SectionHeading } from "@/components/ui/SectionHeading";
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
  ExternalLink,
  Laptop,
} from "lucide-react";

export function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("Todos");

  const categories = [
    "Todos",
    "Fintech & Crédito",
    "SaaS & Aceleração de Produtos",
    "Fintech & Gestão Financeira",
    "B2B & Automação Fiscal",
  ];

  const filteredProjects =
    activeFilter === "Todos"
      ? portfolioProjects
      : portfolioProjects.filter((p) => p.category === activeFilter);

  const getProjectIcon = (id: string) => {
    switch (id) {
      case "credit-flow-app":
        return <TrendingUp className="h-5 w-5 text-blue-600" />;
      case "mainfast-mvp":
        return <Boxes className="h-5 w-5 text-emerald-600" />;
      case "meu-fluxo-financeiro":
        return <PieChart className="h-5 w-5 text-purple-600" />;
      case "quick-invoiceflow":
        return <FileCheck2 className="h-5 w-5 text-amber-600" />;
      default:
        return <Globe className="h-5 w-5 text-blue-600" />;
    }
  };

  const getCardHeaderColor = (id: string) => {
    switch (id) {
      case "credit-flow-app":
        return "from-blue-600/10 via-sky-500/5 to-transparent border-blue-100";
      case "mainfast-mvp":
        return "from-emerald-600/10 via-teal-500/5 to-transparent border-emerald-100";
      case "meu-fluxo-financeiro":
        return "from-purple-600/10 via-indigo-500/5 to-transparent border-purple-100";
      case "quick-invoiceflow":
        return "from-amber-600/10 via-orange-500/5 to-transparent border-amber-100";
      default:
        return "from-blue-600/10 via-sky-500/5 to-transparent border-blue-100";
    }
  };

  return (
    <section id="produtos" className="py-20 md:py-28 relative overflow-hidden bg-slate-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badgeText="Showcase de Produtos Live"
          badgeVariant="blue"
          title="Plataformas Digitais em"
          highlightText="Produção Ativa"
          description="Conheça 4 plataformas completas desenvolvidas pela engenharia da LTI Sistemas, operando em tempo real com alta performance e arquitetura robusta."
        />

        {/* Filter Tabs Bar (Inspired by Inspiration Images) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeFilter === cat
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-600/25"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200/90 hover:border-slate-300 shadow-2xs"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="p-6 sm:p-8 flex flex-col justify-between rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all duration-300 group"
            >
              <div>
                {/* Browser Mockup Header Bar */}
                <div
                  className={`p-3.5 rounded-xl bg-gradient-to-r ${getCardHeaderColor(
                    project.id
                  )} border mb-6 flex items-center justify-between`}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-300 inline-block" />
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-300 inline-block" />
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-300 inline-block" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 font-medium ml-2 truncate max-w-[180px]">
                      {project.url.replace("https://", "")}
                    </span>
                  </div>

                  <Badge variant="emerald" dot size="sm">
                    {project.status}
                  </Badge>
                </div>

                {/* Title & Icon */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                    {getProjectIcon(project.id)}
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </h3>
                    <span className="text-xs font-semibold text-slate-500">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Descriptions */}
                <p className="text-sm font-semibold text-slate-700 mb-2 leading-relaxed">
                  {project.shortDescription}
                </p>
                <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
                  {project.fullDescription}
                </p>

                {/* Highlights list */}
                <div className="space-y-2 mb-6 p-4 rounded-xl bg-slate-50/80 border border-slate-200/70">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Destaques de Engenharia LTI:
                  </span>
                  {project.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 mb-6 pt-3 border-t border-slate-100">
                  {project.techStack.map((tech, idx) => (
                    <Badge key={idx} variant="default" size="sm">
                      {tech}
                    </Badge>
                  ))}
                </div>

                {/* CTA Action Button */}
                <Button
                  href={project.url}
                  isExternal
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() =>
                    trackEvent("portfolio_launch", {
                      projectTitle: project.title,
                      url: project.url,
                    })
                  }
                  icon={<Globe className="h-4 w-4" />}
                  iconRight={<ArrowUpRight className="h-4 w-4" />}
                  className="shadow-sm"
                >
                  Acessar Plataforma em Produção
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
