"use client";

import React, { useState } from "react";
import {
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Chip,
} from "@heroui/react";

interface LogsFilterProps {
  filters: {
    startDate?: any;
    endDate?: any;
    method: string;
    url: string;
    userid: string;
    statusCode: string;
    apiVersion: string;
  };
  onFilterChange: (filters: any) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

export const LogsFilter: React.FC<LogsFilterProps> = ({
  filters,
  onFilterChange,
  onApplyFilters,
  onResetFilters,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Check if any filters are active
  const hasActiveFilters = () => {
    return Object.entries(filters).some(([key, value]) => {
      if (key === "startDate" || key === "endDate") {
        return value !== undefined;
      }
      return value !== "";
    });
  };

  // Handle input change
  const handleInputChange = (key: string, value: any) => {
    onFilterChange({ [key]: value });

    // Update active filters list
    if (value && !activeFilters.includes(key)) {
      setActiveFilters([...activeFilters, key]);
    } else if (!value && activeFilters.includes(key)) {
      setActiveFilters(activeFilters.filter((filter) => filter !== key));
    }
  };

  // Handle method selection
  const handleMethodSelect = (method: string) => {
    onFilterChange({ method });

    if (method && !activeFilters.includes("method")) {
      setActiveFilters([...activeFilters, "method"]);
    } else if (!method && activeFilters.includes("method")) {
      setActiveFilters(activeFilters.filter((filter) => filter !== "method"));
    }
  };

  // Handle apply filters
  const handleApplyFilters = () => {
    onApplyFilters();
    setIsExpanded(false);
  };

  // Handle reset filters
  const handleResetFilters = () => {
    onResetFilters();
    setActiveFilters([]);
    setIsExpanded(false);
  };

  // Methods for dropdown
  const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];

  return (
    <div className="mb-6 space-y-4 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-lg border border-emerald-100 dark:border-emerald-900/30 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h3 className="text-sm font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Filter Logs
          {hasActiveFilters() && (
            <Chip
              size="sm"
              className="ml-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 font-medium"
            >
              {activeFilters.length} active
            </Chip>
          )}
        </h3>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="flat"
            color="success"
            className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
            onPress={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Hide Filters" : "Show Filters"}
          </Button>
          {hasActiveFilters() && (
            <Button
              size="sm"
              variant="flat"
              color="danger"
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
              onPress={handleResetFilters}
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
          <div>
            <Input
              label="URL Contains"
              placeholder="Filter by URL path"
              value={filters.url}
              onChange={(e) => handleInputChange("url", e.target.value)}
              className="w-full"
              size="sm"
              startContent={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              }
            />
          </div>

          <div>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="flat"
                  size="sm"
                  className={`justify-between w-full text-left ${
                    filters.method ? "text-emerald-700 dark:text-emerald-400" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 12H3M3 12L8 7M3 12L8 17" />
                    </svg>
                    {filters.method || "Method"}
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="HTTP Methods">
                <DropdownItem key="all" onPress={() => handleMethodSelect("")}>
                  All Methods
                </DropdownItem>
                <DropdownItem key="GET" onPress={() => handleMethodSelect("GET")}>
                  GET
                </DropdownItem>
                <DropdownItem key="POST" onPress={() => handleMethodSelect("POST")}>
                  POST
                </DropdownItem>
                <DropdownItem key="PUT" onPress={() => handleMethodSelect("PUT")}>
                  PUT
                </DropdownItem>
                <DropdownItem key="DELETE" onPress={() => handleMethodSelect("DELETE")}>
                  DELETE
                </DropdownItem>
                <DropdownItem key="PATCH" onPress={() => handleMethodSelect("PATCH")}>
                  PATCH
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          <div>
            <Input
              label="Status Code"
              placeholder="e.g. 200, 404, 500"
              value={filters.statusCode}
              onChange={(e) => handleInputChange("statusCode", e.target.value)}
              className="w-full"
              size="sm"
              startContent={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                  <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                </svg>
              }
            />
          </div>

          <div>
            <Input
              label="User ID"
              placeholder="Filter by user ID"
              value={filters.userid}
              onChange={(e) => handleInputChange("userid", e.target.value)}
              className="w-full"
              size="sm"
              startContent={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              }
            />
          </div>

          <div>
            <Input
              label="API Version"
              placeholder="e.g. 1, 2"
              value={filters.apiVersion}
              onChange={(e) => handleInputChange("apiVersion", e.target.value)}
              className="w-full"
              size="sm"
              startContent={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 16h6v6h-6z" />
                  <path d="M12 12H2V2h10z" />
                  <path d="M12 2v10H9.89C9.33 12 9 12.33 9 12.89c0 .56.33.89.89.89H12v7.64c0 .38.42.69.83.41L18 18V2Z" />
                </svg>
              }
            />
          </div>

          <div className="flex flex-col gap-1 justify-end">
            <Input
              type="date"
              label="Start Date"
              placeholder="From date"
              value={filters.startDate}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
              className="w-full"
              size="sm"
            />
          </div>

          <div className="flex flex-col gap-1 justify-end">
            <Input
              type="date"
              label="End Date"
              placeholder="To date"
              value={filters.endDate}
              onChange={(e) => handleInputChange("endDate", e.target.value)}
              className="w-full"
              size="sm"
            />
          </div>

          <div className="col-span-full flex justify-end mt-2">
            <Button
              color="primary"
              className="bg-emerald-600 hover:bg-emerald-700"
              onPress={handleApplyFilters}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
