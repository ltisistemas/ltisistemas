import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "cyan" | "emerald" | "amber" | "outline" | "slate";
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "md",
  dot = false,
  className = "",
}: BadgeProps) {
  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-xs font-medium",
    md: "px-3 py-1 text-xs font-semibold",
  };

  const variantStyles = {
    default: "bg-slate-800/80 text-slate-300 border border-slate-700/60",
    cyan: "bg-cyan-950/60 text-cyan-300 border border-cyan-500/30",
    emerald: "bg-emerald-950/60 text-emerald-300 border border-emerald-500/30",
    amber: "bg-amber-950/60 text-amber-300 border border-amber-500/30",
    slate: "bg-slate-900/90 text-slate-400 border border-slate-800",
    outline: "bg-transparent text-slate-300 border border-slate-700/80",
  };

  const dotColors = {
    default: "bg-slate-400",
    cyan: "bg-cyan-400 animate-pulse",
    emerald: "bg-emerald-400 animate-pulse",
    amber: "bg-amber-400",
    slate: "bg-slate-500",
    outline: "bg-cyan-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full backdrop-blur-sm transition-colors ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}
