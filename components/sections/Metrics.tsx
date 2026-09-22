import React from "react";
import { impactMetrics } from "@/lib/data";
import { Card } from "@/components/ui/Card";
import { Zap, TrendingUp, ShieldCheck, Award } from "lucide-react";

export function Metrics() {
  const getMetricIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Award className="h-6 w-6 text-blue-600" />;
      case 1:
        return <Zap className="h-6 w-6 text-emerald-600" />;
      case 2:
        return <TrendingUp className="h-6 w-6 text-sky-600" />;
      case 3:
        return <ShieldCheck className="h-6 w-6 text-amber-600" />;
      default:
        return <Award className="h-6 w-6 text-blue-600" />;
    }
  };

  const getMetricBadgeStyle = (index: number) => {
    switch (index) {
      case 0:
        return "bg-blue-50 border-blue-100";
      case 1:
        return "bg-emerald-50 border-emerald-100";
      case 2:
        return "bg-sky-50 border-sky-100";
      case 3:
        return "bg-amber-50 border-amber-100";
      default:
        return "bg-blue-50 border-blue-100";
    }
  };

  return (
    <section className="py-16 md:py-20 relative overflow-hidden bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {impactMetrics.map((metric, index) => (
            <div
              key={index}
              className="p-6 sm:p-7 rounded-2xl bg-slate-50/70 border border-slate-200/80 text-center flex flex-col items-center justify-between relative group hover:bg-white hover:border-blue-300 hover:shadow-md transition-all duration-300"
            >
              <div className="mb-3">
                <div
                  className={`h-12 w-12 rounded-xl ${getMetricBadgeStyle(
                    index
                  )} border flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                >
                  {getMetricIcon(index)}
                </div>

                <div className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 mb-2">
                  <span
                    className={
                      index === 0
                        ? "text-blue-600"
                        : index === 1
                        ? "text-emerald-600"
                        : index === 2
                        ? "text-sky-600"
                        : "text-amber-600"
                    }
                  >
                    {metric.value}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-800 mb-1">
                  {metric.label}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-[240px]">
                {metric.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
