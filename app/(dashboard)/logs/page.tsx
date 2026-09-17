"use client";
// @ts-ignore
import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Tabs,
  Tab,
  Pagination,
  Spinner,
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Badge,
  Chip,
} from "@heroui/react";
import { title, subtitle } from "@/components/primitives";
// @ts-ignore
import { LogsTable } from "@/components/logs-table";
// @ts-ignore
import { LogsFilter } from "@/components/logs-filter";
import { toast } from "@/components/toast";

export default function LogsPage() {
  const [selectedKey, setSelectedKey] = useState("all-logs");
  const [logs, setLogs] = useState<any[]>([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    startDate: undefined,
    endDate: undefined,
    method: "",
    url: "",
    userid: "",
    statusCode: "",
    apiVersion: "",
  });

  // Get auth token from localStorage or cookies
  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        return token;
      }

      const cookies = document.cookie.split(";");
      const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith("token="));

      if (tokenCookie) {
        return tokenCookie.split("=")[1].trim();
      }
    }
    return null;
  };

  // Fetch logs from the API
  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append("page", currentPage.toString());
      queryParams.append("limit", pageSize.toString());

      // Add filters if they exist
      if (filters.startDate)
        queryParams.append("startDate", new Date(filters.startDate).toISOString());
      if (filters.endDate) queryParams.append("endDate", new Date(filters.endDate).toISOString());
      if (filters.method) queryParams.append("method", filters.method);
      if (filters.url) queryParams.append("url", filters.url);
      if (filters.userid) queryParams.append("userid", filters.userid);
      if (filters.statusCode) queryParams.append("statusCode", filters.statusCode);
      if (filters.apiVersion) queryParams.append("apiVersion", filters.apiVersion);

      // Make API request
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/logs?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch logs");
      }

      setLogs(data.logs || []);
      setTotalLogs(data.total || 0);
      setTotalPages(data.pages || 1);
    } catch (error) {
      console.error("Error fetching logs:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch logs";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch logs when page, pageSize, or filters change
  useEffect(() => {
    fetchLogs();
  }, [currentPage, pageSize]);

  // Handle filter changes
  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Apply filters
  const applyFilters = () => {
    fetchLogs();
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      startDate: undefined,
      endDate: undefined,
      method: "",
      url: "",
      userid: "",
      statusCode: "",
      apiVersion: "",
    });
    setCurrentPage(1);
    fetchLogs();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6">
      <div className="flex flex-col gap-2 pb-8">
        <h1 className={title({ size: "sm" })}>Request Logs</h1>
        <p className={subtitle()}>View and analyze API request logs.</p>
      </div>

      <Tabs
        selectedKey={selectedKey}
        onSelectionChange={(key) => setSelectedKey(key as string)}
        classNames={{
          tabList: "border-b border-emerald-200 dark:border-emerald-800/30",
        }}
      >
        <Tab
          key="all-logs"
          title="All Logs"
          className="text-emerald-600 dark:text-emerald-400 py-2 px-4 focus:outline-none hover:text-emerald-700 dark:hover:text-emerald-300"
        >
          <Card className="mt-6">
            <CardBody>
              <LogsFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                onApplyFilters={applyFilters}
                onResetFilters={resetFilters}
              />

              {error && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-900/30">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span className="font-medium">Error:</span> {error}
                  </div>
                </div>
              )}

              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <Spinner color="success" size="lg" />
                  <p className="mt-4 text-emerald-600 dark:text-emerald-400">Loading logs...</p>
                </div>
              ) : (
                <>
                  <LogsTable logs={logs} />

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Showing {logs.length} of {totalLogs} results
                    </div>

                    <Pagination
                      total={totalPages}
                      initialPage={currentPage}
                      page={currentPage}
                      onChange={setCurrentPage}
                      color="success"
                      classNames={{
                        wrapper: "gap-0 overflow-visible",
                        item: "bg-transparent text-emerald-600",
                        cursor:
                          "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
                      }}
                    />
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
