import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "emerald" | "amber" | "dark";
  size?: "sm" | "md" | "lg";
  href?: string;
  isExternal?: boolean;
  fullWidth?: boolean;
  pill?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  className?: string;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  isExternal = false,
  fullWidth = false,
  pill = true,
  icon,
  iconRight,
  className = "",
  onClick,
  ...props
}: ButtonProps) {
  const sizeStyles = {
    sm: "px-4 py-2 text-xs font-semibold gap-1.5",
    md: "px-5 py-2.5 text-sm font-semibold gap-2",
    lg: "px-7 py-3.5 text-base font-bold gap-2.5",
  };

  const roundedStyle = pill ? "rounded-full" : "rounded-xl";

  const variantStyles = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
    secondary:
      "bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 shadow-sm hover:border-slate-300 hover:shadow active:scale-[0.98]",
    emerald:
      "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 hover:-translate-y-0.5 active:scale-[0.98]",
    amber:
      "bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 active:scale-[0.98]",
    dark:
      "bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-900/20 hover:shadow-lg active:scale-[0.98]",
    outline:
      "bg-transparent hover:bg-blue-50 text-blue-600 border border-blue-200 hover:border-blue-400 active:scale-[0.98]",
    ghost:
      "bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900 active:scale-[0.98]",
  };

  const baseStyles =
    "inline-flex items-center justify-center transition-all duration-200 cursor-pointer select-none";
  const widthStyle = fullWidth ? "w-full" : "";

  const combinedClassName = `${baseStyles} ${roundedStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`;

  if (href) {
    if (
      isExternal ||
      href.startsWith("http") ||
      href.startsWith("https") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("https://wa.me")
    ) {
      return (
        <a
          href={href}
          onClick={onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
          target={isExternal || href.startsWith("http") || href.startsWith("https://wa.me") ? "_blank" : undefined}
          rel={isExternal || href.startsWith("http") || href.startsWith("https://wa.me") ? "noopener noreferrer" : undefined}
          className={combinedClassName}
        >
          {icon && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
          {iconRight && <span className="shrink-0">{iconRight}</span>}
        </a>
      );
    }

    return (
      <Link
        href={href}
        onClick={onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
        className={combinedClassName}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
        {iconRight && <span className="shrink-0">{iconRight}</span>}
      </Link>
    );
  }

  return (
    <button className={combinedClassName} onClick={onClick} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {iconRight && <span className="shrink-0">{iconRight}</span>}
    </button>
  );
}
