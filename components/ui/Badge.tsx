import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "cyan" | "blue" | "emerald" | "amber" | "purple" | "outline" | "slate";
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
    md: "px-3.5 py-1 text-xs font-semibold",
  };

  const variantStyles = {
    default: "bg-slate-100 text-slate-700 border border-slate-200/80",
    blue: "bg-blue-50 text-blue-700 border border-blue-200/80",
    cyan: "bg-sky-50 text-sky-700 border border-sky-200/80",
    emerald: "bg-emerald-50 text-emerald-700 border border-emerald-200/80",
    amber: "bg-amber-50 text-amber-800 border border-amber-200/80",
    purple: "bg-purple-50 text-purple-700 border border-purple-200/80",
    slate: "bg-slate-100 text-slate-600 border border-slate-200",
    outline: "bg-white text-slate-700 border border-slate-300 shadow-2xs",
  };

  const dotColors = {
    default: "bg-slate-500",
    blue: "bg-blue-500",
    cyan: "bg-sky-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    purple: "bg-purple-500",
    slate: "bg-slate-400",
    outline: "bg-blue-500",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full transition-colors ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}
