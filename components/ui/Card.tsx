import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glow?: "none" | "cyan" | "emerald" | "blue" | "amber";
  onClick?: () => void;
}

export function Card({
  children,
  className = "",
  hoverEffect = true,
  glow = "none",
  onClick,
}: CardProps) {
  const glowStyles = {
    none: "",
    blue: "hover:border-blue-400 hover:shadow-[0_12px_32px_rgba(37,99,235,0.08)]",
    cyan: "hover:border-sky-400 hover:shadow-[0_12px_32px_rgba(14,165,233,0.08)]",
    emerald: "hover:border-emerald-400 hover:shadow-[0_12px_32px_rgba(16,185,129,0.08)]",
    amber: "hover:border-amber-400 hover:shadow-[0_12px_32px_rgba(245,158,11,0.08)]",
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-6 sm:p-8 relative border border-slate-200/80 shadow-sm transition-all duration-300 ${
        hoverEffect ? "hover:-translate-y-1 hover:shadow-md" : ""
      } ${glowStyles[glow]} ${className}`}
    >
      {children}
    </div>
  );
}
