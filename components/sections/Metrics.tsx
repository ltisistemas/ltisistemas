import React from "react";
import { impactMetrics } from "@/lib/data";
import { Card } from "@/components/ui/Card";
import { Zap, TrendingUp, ShieldCheck, Award } from "lucide-react";

export function Metrics() {
  const getMetricIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Award className="h-6 w-6 text-cyan-400" />;
      case 1:
        return <Zap className="h-6 w-6 text-emerald-400" />;
      case 2:
        return <TrendingUp className="h-6 w-6 text-blue-400" />;
      case 3:
        return <ShieldCheck className="h-6 w-6 text-purple-400" />;
      default:
        return <Award className="h-6 w-6 text-cyan-400" />;
    }
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-slate-900/30 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {impactMetrics.map((metric, index) => (
            <Card
              key={index}
              className="p-6 border-slate-800/80 bg-slate-900/60 text-center flex flex-col items-center justify-between relative group"
              hoverEffect
            >
              <div className="mb-4">
                <div className="h-12 w-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  {getMetricIcon(index)}
                </div>

                <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-2 font-mono">
                  <span className={index === 1 ? "text-gradient-emerald" : "text-gradient-cyan"}>
                    {metric.value}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-200 mb-2">
                  {metric.label}
                </h3>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed max-w-[240px]">
                {metric.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
