"use client";

import React from "react";
import clsx from "clsx";

interface StatItemProps {
  value: string | number;
  label: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
  accentColor?: "emerald" | "green" | "teal";
}

export const GreenStatItem: React.FC<StatItemProps> = ({
  value,
  label,
  trend,
  icon,
  className,
  accentColor = "emerald",
}) => {
  const getColorClasses = () => {
    switch (accentColor) {
      case "emerald":
        return {
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/20",
          text: "text-emerald-600 dark:text-emerald-400",
          icon: "text-emerald-500",
        };
      case "green":
        return {
          bg: "bg-green-500/10",
          border: "border-green-500/20",
          text: "text-green-600 dark:text-green-400",
          icon: "text-green-500",
        };
      case "teal":
        return {
          bg: "bg-teal-500/10",
          border: "border-teal-500/20",
          text: "text-teal-600 dark:text-teal-400",
          icon: "text-teal-500",
        };
      default:
        return {
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/20",
          text: "text-emerald-600 dark:text-emerald-400",
          icon: "text-emerald-500",
        };
    }
  };

  const colors = getColorClasses();

  return (
    <div
      className={clsx(
        "rounded-xl p-4 border relative overflow-hidden",
        colors.bg,
        colors.border,
        className
      )}
    >
      {/* Decorative circles */}
      <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-white/10 dark:bg-black/10" />
      <div className="absolute -right-2 -bottom-2 w-8 h-8 rounded-full bg-white/20 dark:bg-black/20" />

      <div className="flex justify-between items-start mb-2">
        <div className="text-xs uppercase font-medium text-gray-500 dark:text-gray-400">
          {label}
        </div>
        {icon && <div className={clsx("text-xl", colors.icon)}>{icon}</div>}
      </div>

      <div className={clsx("text-2xl font-bold", colors.text)}>{value}</div>

      {trend && (
        <div className="flex items-center mt-2">
          <div
            className={clsx(
              "text-xs font-medium flex items-center",
              trend.isPositive
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            )}
          >
            {trend.isPositive ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {trend.value}%
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 ml-2">vs last period</div>
        </div>
      )}
    </div>
  );
};

export const GreenStatsGrid: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div
      className={clsx(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
        className
      )}
    >
      {children}
    </div>
  );
}; 