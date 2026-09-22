import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Star, Quote } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      name: "Carlos Eduardo Mendes",
      role: "Chief Technology Officer (CTO)",
      company: "Fintech de Crédito & Pagamentos",
      rating: 5,
      quote:
        "A LTI Sistemas redesenhou nossa esteira de aprovação de crédito com Clean Architecture. A vazão de processamento subiu significativamente e eliminamos instabilidades em horários de pico.",
      initials: "CM",
      bgColor: "bg-blue-100 text-blue-700",
    },
    {
      name: "Mariana Alencar",
      role: "Head de Produto & Inovação",
      company: "Hub de Soluções SaaS",
      rating: 5,
      quote:
        "Precisávamos lançar nosso novo produto ao mercado em menos de 8 semanas sem abrir mão de qualidade e segurança. A esteira da LTI entregou uma arquitetura impecável e pronta para escalar.",
      initials: "MA",
      bgColor: "bg-emerald-100 text-emerald-700",
    },
    {
      name: "Rodrigo Vasconcelos",
      role: "Diretor de Operações & TI",
      company: "Grupo de Logística & Faturamento",
      rating: 5,
      quote:
        "A consultoria de arquitetura e liderança técnica da LTI Sistemas elevou a maturidade do nosso squad interno. Nossos deploys agora são 100% automatizados com zero downtime.",
      initials: "RV",
      bgColor: "bg-purple-100 text-purple-700",
    },
  ];

  return (
    <section id="depoimentos" className="py-20 md:py-28 relative overflow-hidden bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badgeText="Depoimentos & Prova Social"
          badgeVariant="blue"
          title="O Que Dizem os Líderes que"
          highlightText="Confiam na LTI"
          description="Resultados reais em sistemas de alta complexidade, escalabilidade de produtos e aceleração de engenharia."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="p-7 sm:p-8 rounded-2xl bg-slate-50/70 border border-slate-200/80 shadow-2xs hover:bg-white hover:border-blue-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* 5-star rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-slate-700 leading-relaxed mb-6 italic">
                  "{item.quote}"
                </p>
              </div>

              {/* Author info */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-200/70">
                <div
                  className={`h-11 w-11 rounded-full ${item.bgColor} flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs`}
                >
                  {item.initials}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900">
                    {item.name}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {item.role} • <strong className="text-slate-600 font-semibold">{item.company}</strong>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
