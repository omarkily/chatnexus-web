"use client";

import React from "react";
import clsx from "clsx";

interface GreenCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  variant?: "solid" | "outlined" | "glass";
  size?: "sm" | "md" | "lg";
}

export const GreenCard: React.FC<GreenCardProps> = ({
  children,
  title,
  className,
  variant = "solid",
  size = "md",
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "solid":
        return "bg-white dark:bg-gray-900 border-l-4 border-emerald-500 shadow-md shadow-emerald-500/10";
      case "outlined":
        return "bg-transparent border border-emerald-300/50 dark:border-emerald-800/50";
      case "glass":
        return "bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-emerald-200/30 dark:border-emerald-800/30 shadow-lg shadow-emerald-500/5";
      default:
        return "bg-white dark:bg-gray-900 border-l-4 border-emerald-500";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "p-3";
      case "md":
        return "p-5";
      case "lg":
        return "p-7";
      default:
        return "p-5";
    }
  };

  return (
    <div
      className={clsx(
        "rounded-lg relative overflow-hidden transition-all",
        getVariantClasses(),
        getSizeClasses(),
        className
      )}
    >
      {/* Decorative accent */}
      {variant === "solid" && (
        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-emerald-400 to-green-600" />
      )}
      
      {variant === "glass" && (
        <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-emerald-400/10 blur-xl" />
      )}
      
      {title && (
        <h3 className="text-lg font-semibold mb-3 text-emerald-800 dark:text-emerald-300">
          {title}
        </h3>
      )}
      
      <div className="relative z-10">{children}</div>
    </div>
  );
}; 