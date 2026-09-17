"use client";

import React from "react";

interface IconProps {
  size?: number;
  className?: string;
}

export const ApiIcon: React.FC<IconProps> = ({ size = 24, className }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M17 16L21 12L17 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 8L3 12L7 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 4L10 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ZohoIcon: React.FC<IconProps> = ({ size = 24, className }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Infinity loop icon in green */}
      <path
        d="M18.178 8C19.736 8 21 9.264 21 10.822C21 12.38 19.736 13.644 18.178 13.644C17.0688 13.644 16.099 13.03 15.598 12.13C14.776 13.487 13.441 14.453 11.996 14.453C10.551 14.453 9.216 13.487 8.394 12.13C7.893 13.03 6.923 13.644 5.814 13.644C4.256 13.644 2.992 12.38 2.992 10.822C2.992 9.264 4.256 8 5.814 8C6.923 8 7.893 8.614 8.394 9.514C9.216 8.157 10.551 7.191 11.996 7.191C13.441 7.191 14.776 8.157 15.598 9.514C16.099 8.614 17.0688 8 18.178 8Z"
        fill="#38A169"
        stroke="#38A169"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.178 8C19.736 8 21 9.264 21 10.822C21 12.38 19.736 13.644 18.178 13.644C17.0688 13.644 16.099 13.03 15.598 12.13C14.776 13.487 13.441 14.453 11.996 14.453C10.551 14.453 9.216 13.487 8.394 12.13C7.893 13.03 6.923 13.644 5.814 13.644C4.256 13.644 2.992 12.38 2.992 10.822C2.992 9.264 4.256 8 5.814 8C6.923 8 7.893 8.614 8.394 9.514C9.216 8.157 10.551 7.191 11.996 7.191C13.441 7.191 14.776 8.157 15.598 9.514C16.099 8.614 17.0688 8 18.178 8Z"
        fill="#38A169"
        stroke="#4ADE80"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}; 