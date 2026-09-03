import React from "react";
import { Badge } from "./Badge";

interface SectionHeadingProps {
  badgeText?: string;
  badgeVariant?: "default" | "cyan" | "emerald" | "amber" | "slate";
  title: string;
  highlightText?: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeading({
  badgeText,
  badgeVariant = "cyan",
  title,
  highlightText,
  description,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div
      className={`flex flex-col mb-12 sm:mb-16 ${
        isCenter ? "items-center text-center max-w-3xl mx-auto" : "items-start text-left max-w-2xl"
      } ${className}`}
    >
      {badgeText && (
        <Badge variant={badgeVariant} dot size="md" className="mb-4">
          {badgeText}
        </Badge>
      )}

      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
        {title}{" "}
        {highlightText && (
          <span className="text-gradient-cyan">{highlightText}</span>
        )}
      </h2>

      {description && (
        <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
}
