import React from "react";
import { impactMetrics } from "@/lib/data";
import { Zap, TrendingUp, ShieldCheck, Award, Building2, Terminal, Server, CheckCircle2 } from "lucide-react";

export function Metrics() {
  const logos = [
    { name: "Apex Finanças", icon: "⬡ APEX LOGISTICS" },
    { name: "NovaTech Cloud", icon: "◈ NOVATECH" },
    { name: "DataCore Systems", icon: "❖ DATACORE" },
    { name: "HealthPlus Care", icon: "✦ HEALTHPLUS" },
    { name: "SmartVarejo B2B", icon: "◆ SMARTVAREJO" },
    { name: "OmniLog Logística", icon: "⬢ OMNILOG" },
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Social Proof Header & Logos Strip */}
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-8">
            Confiado por mais de <span className="text-blue-600 font-black">100+ empresas</span> e plataformas em produção
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-center max-w-5xl mx-auto">
            {logos.map((logo, idx) => (
              <div
                key={idx}
                className="py-3.5 px-4 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-blue-300 hover:bg-blue-50/30 transition-all font-mono font-bold text-xs tracking-wider group cursor-default shadow-2xs"
              >
                <span className="group-hover:scale-105 transition-transform">{logo.icon}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Benchmarks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10 border-t border-slate-100">
          {impactMetrics.map((metric, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200/80 text-center flex flex-col items-center justify-between hover:border-blue-300 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="mb-2">
                <div className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-2">
                  <span
                    className={
                      index === 0
                        ? "text-blue-600"
                        : index === 1
                        ? "text-sky-500"
                        : index === 2
                        ? "text-indigo-600"
                        : "text-emerald-600"
                    }
                  >
                    {metric.value}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-800 mb-1">
                  {metric.label}
                </h3>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed max-w-[220px]">
                {metric.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
