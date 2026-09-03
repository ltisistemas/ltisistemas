import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glow?: "none" | "cyan" | "emerald";
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
    cyan: "hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.12)]",
    emerald: "hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.12)]",
  };

  return (
    <div
      onClick={onClick}
      className={`glass-panel rounded-2xl p-6 relative overflow-hidden transition-all duration-300 ${
        hoverEffect ? "glass-panel-hover" : ""
      } ${glowStyles[glow]} ${className}`}
    >
      {children}
    </div>
  );
}
