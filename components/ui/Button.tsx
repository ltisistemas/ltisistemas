import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "emerald";
  size?: "sm" | "md" | "lg";
  href?: string;
  isExternal?: boolean;
  fullWidth?: boolean;
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
  icon,
  iconRight,
  className = "",
  onClick,
  ...props
}: ButtonProps) {
  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs font-medium rounded-lg gap-1.5",
    md: "px-5 py-2.5 text-sm font-semibold rounded-xl gap-2",
    lg: "px-7 py-3.5 text-base font-semibold rounded-xl gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 active:scale-[0.98]",
    secondary:
      "bg-slate-800/90 hover:bg-slate-700/90 text-white border border-slate-700/80 hover:border-slate-600 active:scale-[0.98]",
    emerald:
      "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-[0.98]",
    outline:
      "bg-transparent hover:bg-slate-800/60 text-slate-200 border border-slate-700 hover:border-cyan-500/50 active:scale-[0.98]",
    ghost:
      "bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-white active:scale-[0.98]",
  };

  const baseStyles =
    "inline-flex items-center justify-center transition-all duration-200 cursor-pointer select-none";
  const widthStyle = fullWidth ? "w-full" : "";

  const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`;

  if (href) {
    if (isExternal || href.startsWith("http") || href.startsWith("https") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("https://wa.me")) {
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
