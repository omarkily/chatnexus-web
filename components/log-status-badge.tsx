"use client";

import React from "react";
import { Chip } from "@heroui/react";

// Status badge component
export const LogStatusBadge: React.FC<{ statusCode: number }> = ({ statusCode }) => {
  let color = '';
  let textColor = '';
  let label = '';

  if (statusCode >= 200 && statusCode < 300) {
    color = 'bg-emerald-100 dark:bg-emerald-900/30';
    textColor = 'text-emerald-700 dark:text-emerald-400';
    label = 'Success';
  } else if (statusCode >= 300 && statusCode < 400) {
    color = 'bg-blue-100 dark:bg-blue-900/30';
    textColor = 'text-blue-700 dark:text-blue-400';
    label = 'Redirect';
  } else if (statusCode >= 400 && statusCode < 500) {
    color = 'bg-amber-100 dark:bg-amber-900/30';
    textColor = 'text-amber-700 dark:text-amber-400';
    label = 'Client Error';
  } else if (statusCode >= 500) {
    color = 'bg-red-100 dark:bg-red-900/30';
    textColor = 'text-red-700 dark:text-red-400';
    label = 'Server Error';
  } else {
    color = 'bg-gray-100 dark:bg-gray-800';
    textColor = 'text-gray-700 dark:text-gray-400';
    label = 'Unknown';
  }

  return (
    <div className="flex items-center gap-2">
      <Chip 
        size="sm"
        className={`${color} ${textColor} font-medium`}
      >
        {statusCode}
      </Chip>
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
    </div>
  );
}; 