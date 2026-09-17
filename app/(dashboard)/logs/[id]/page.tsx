"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardBody, Button, Spinner, Tabs, Tab, Divider } from "@heroui/react";
import { title, subtitle } from "@/components/primitives";
import { LogStatusBadge } from "@/components/log-status-badge";
import { toast } from "@/components/toast";

export default function LogDetailPage() {
  const [log, setLog] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("request");
  const router = useRouter();
  const params = useParams();
  const logId = params.id as string;

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
  
  // Fetch log details
  useEffect(() => {
    const fetchLogDetails = async () => {
      setIsLoading(true);
      try {
        const token = getAuthToken();

        if (!token) {
          throw new Error("Authentication token not found. Please log in again.");
        }

        // Make API request
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/logs/${logId}`,
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
          throw new Error(data.message || "Failed to fetch log details");
        }

        setLog(data);
      } catch (error) {
        console.error("Error fetching log details:", error);
        toast.error(error instanceof Error ? error.message : "Failed to fetch log details");
      } finally {
        setIsLoading(false);
      }
    };

    if (logId) {
      fetchLogDetails();
    }
  }, [logId]);

  // Format JSON data for display
  const formatJSONData = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      return jsonString;
    }
  };

  // Handle back button click
  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center justify-center h-64">
          <Spinner color="success" size="lg" />
          <p className="mt-4 text-emerald-600 dark:text-emerald-400">Loading log details...</p>
        </div>
      </div>
    );
  }

  if (!log) {
    return (
      <div className="w-full max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-lg text-gray-600 dark:text-gray-300">Log not found</div>
          <Button
            color="primary"
            className="mt-4 bg-emerald-600 hover:bg-emerald-700"
            onPress={handleBack}
          >
            Back to Logs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6">
      <div className="flex flex-col gap-2 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant="light"
            size="sm"
            onPress={handleBack}
            className="text-emerald-600 dark:text-emerald-400"
            startContent={
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
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            }
          >
            Back to Logs
          </Button>
        </div>
        <h1 className={title({ size: "sm" })}>Log Details</h1>
        <p className={subtitle()}>Detailed view of API request log</p>
      </div>

      <Card className="mb-6">
        <CardBody className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Request</h3>
              <div className="text-base font-semibold flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded text-white ${
                    log.method === "GET"
                      ? "bg-emerald-500 dark:bg-emerald-600"
                      : log.method === "POST"
                        ? "bg-blue-500 dark:bg-blue-600"
                        : log.method === "PUT"
                          ? "bg-amber-500 dark:bg-amber-600"
                          : log.method === "DELETE"
                            ? "bg-red-500 dark:bg-red-600"
                            : "bg-gray-500 dark:bg-gray-600"
                  } text-xs font-bold`}
                >
                  {log.method}
                </span>
                <span className="truncate">{log.url}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
              <div className="text-base font-semibold">
                <LogStatusBadge statusCode={log.statusCode} />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Timestamp</h3>
              <div className="text-base font-semibold">
                {new Date(log.timestamp).toLocaleString()}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">API Version</h3>
              <div className="text-base font-semibold">v{log.apiVersion}</div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</h3>
              <div className="text-base font-semibold">
                {new Date(log.created_at).toLocaleString()}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">ID</h3>
              <div className="text-base font-semibold text-gray-600 dark:text-gray-300 truncate">
                {log._id}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="p-0">
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as string)}
            classNames={{
              tabList: "px-4 border-b border-emerald-200 dark:border-emerald-800/30",
              tab: "text-emerald-600 dark:text-emerald-400 py-3 px-4 focus:outline-none hover:text-emerald-700 dark:hover:text-emerald-300",
              cursor: "bg-emerald-100 dark:bg-emerald-900/40",
              tabContent: "text-sm",
            }}
          >
            <Tab key="request" title="Request Data">
              <div className="p-6">
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto max-h-[400px] text-sm">
                  {formatJSONData(log.requestData)}
                </pre>
              </div>
            </Tab>
            <Tab key="response" title="Response Data">
              <div className="p-6">
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto max-h-[400px] text-sm">
                  {formatJSONData(log.responseData)}
                </pre>
              </div>
            </Tab>
            <Tab key="terminal" title="Terminal Logs">
              <div className="p-6">
                {log.terminalLogs && log.terminalLogs.length > 0 ? (
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto max-h-[400px]">
                    {log.terminalLogs.map((logEntry: string, index: number) => (
                      <div key={index} className="text-sm mb-2 font-mono">
                        {logEntry}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No terminal logs available for this request.
                  </div>
                )}
              </div>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}
