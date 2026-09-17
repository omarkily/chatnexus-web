"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Input,
  Button,
  Link,
  Chip,
  Textarea,
  Tooltip,
  Checkbox,
  CardBody,
} from "@heroui/react";
import { title, subtitle } from "@/components/primitives";
import { toast } from "@/components/toast";

// Define available scopes
export const SCOPES = {
  USERS: {
    READ: "users.read",
    WRITE: "users.write",
    UPDATE: "users.update",
    DELETE: "users.delete",
    ALL: "users.all",
  },
  APPLICATIONS: {
    READ: "applications.read",
    WRITE: "applications.write",
    UPDATE: "applications.update",
    DELETE: "applications.delete",
    ALL: "applications.all",
  },
};

// Define scope descriptions
export const SCOPE_DESCRIPTIONS: { [key: string]: string } = {
  "users.read": "Read user data",
  "users.write": "Create user data",
  "users.update": "Update user data",
  "users.delete": "Delete user data",
  "users.all": "Full access to user data",
  "applications.read": "Read application data",
  "applications.write": "Create applications",
  "applications.update": "Update applications",
  "applications.delete": "Delete applications",
  "applications.all": "Full access to applications",
};

interface Application {
  _id: string;
  name: string;
  description: string;
  api_key: string;
  scopes: string[];
  status: string;
  created_at: string;
  user_id: string;
}

export const SetupTab: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isCreatingApp, setIsCreatingApp] = useState(false);
  const [newAppData, setNewAppData] = useState({
    name: "",
    description: "",
    scopes: ["applications.all", "users.all"],
  });
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [apiRequestStatus, setApiRequestStatus] = useState({
    loading: false,
    error: null as string | null,
    success: false,
    message: "",
    serverConflict: false,
  });
  const [isEditingPermissions, setIsEditingPermissions] = useState(false);
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [editingScopes, setEditingScopes] = useState<string[]>([]);

  // Fetch applications on component mount
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setApiRequestStatus({
      loading: true,
      error: null,
      success: false,
      message: "",
      serverConflict: false,
    });

    try {
      // Get token using the improved function
      const token = getAuthToken();

      if (!token) {
        setIsInitialLoading(false);
        throw new Error("Authentication token not found. Please log in again.");
      }

      // Make API call to fetch applications
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/applications`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setApplications(data.data || []);
        setApiRequestStatus({
          loading: false,
          error: null,
          success: true,
          message: "Applications fetched successfully",
          serverConflict: false,
        });
        setIsInitialLoading(false);
      } else {
        // Handle error response
        const errorData = await response.json();
        setApiRequestStatus({
          loading: false,
          error: errorData.message || "Failed to fetch applications",
          success: false,
          message: "",
          serverConflict: false,
        });
        setIsInitialLoading(false);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      setApiRequestStatus({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch applications",
        success: false,
        message: "",
        serverConflict: false,
      });
      setIsInitialLoading(false);
    }
  };

  const handleCreateApplication = async () => {
    setApiRequestStatus({
      loading: true,
      error: null,
      success: false,
      message: "",
      serverConflict: false,
    });

    try {
      // Make API call to create application using proxy
      const response = await fetch(`/api/proxy/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newAppData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create application");
      }

      // Update applications list
      setApplications([...applications, data.data]);

      // Reset form and state
      setNewAppData({
        name: "",
        description: "",
        scopes: ["applications.all", "users.all"],
      });

      setIsCreatingApp(false);

      setApiRequestStatus({
        loading: false,
        error: null,
        success: false,
        message: "",
        serverConflict: false,
      });

      // Show a toast instead
      toast.success("Application created successfully!");
    } catch (error) {
      console.error("Error creating application:", error);
      setApiRequestStatus({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to create application",
        success: false,
        message: "",
        serverConflict: false,
      });
    }
  };

  const handleRevokeApplication = async (appId: string) => {
    setApiRequestStatus({
      loading: true,
      error: null,
      success: false,
      message: "",
      serverConflict: false,
    });

    try {
      // Get token using the improved function
      const token = getAuthToken();

      if (!token) {
        setIsInitialLoading(false);
        throw new Error("Authentication token not found. Please log in again.");
      }

      // Construct the API endpoint URL
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/applications/${appId}`;
      console.log("Deleting application with DELETE request to:", apiUrl);

      // Make API call to delete the application
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to revoke application");
      }

      // Update applications list
      setApplications(
        applications.map((app) => (app._id === appId ? { ...app, status: "revoked" } : app))
      );

      setApiRequestStatus({
        loading: false,
        error: null,
        success: false,
        message: "",
        serverConflict: false,
      });

      // Show a toast with error color for revocation
      toast.error("Application revoked successfully!", { duration: 4000 });
    } catch (error) {
      console.error("Error revoking application:", error);
      setApiRequestStatus({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to revoke application",
        success: false,
        message: "",
        serverConflict: false,
      });
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.info("Copied to clipboard");
      setApiRequestStatus({
        loading: false,
        error: null,
        success: false,
        message: "",
        serverConflict: false,
      });
    } catch (error) {
      setApiRequestStatus({
        loading: false,
        error: "Failed to copy to clipboard",
        success: false,
        message: "",
        serverConflict: false,
      });
    }
  };

  const handleUpdatePermissions = async () => {
    if (!editingAppId) return;

    setApiRequestStatus({
      loading: true,
      error: null,
      success: false,
      message: "",
      serverConflict: false,
    });

    try {
      // Find the app being edited
      const appToUpdate = applications.find((app) => app._id === editingAppId);
      if (!appToUpdate) throw new Error("Application not found");

      // Make API call to update application using proxy
      const response = await fetch(`/api/proxy/applications/${editingAppId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          scopes: editingScopes,
          // Keep other fields the same
          name: appToUpdate.name,
          description: appToUpdate.description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update application permissions");
      }

      // Update the application in the local state
      setApplications(
        applications.map((app) =>
          app._id === editingAppId ? { ...app, scopes: editingScopes } : app
        )
      );

      // Close the edit panel and reset state
      setIsEditingPermissions(false);
      setEditingAppId(null);
      setEditingScopes([]);

      setApiRequestStatus({
        loading: false,
        error: null,
        success: false,
        message: "",
        serverConflict: false,
      });

      // Show a toast with success message
      toast.success("Application permissions updated successfully!", { duration: 4000 });
    } catch (error) {
      console.error("Error updating application permissions:", error);
      setApiRequestStatus({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to update application permissions",
        success: false,
        message: "",
        serverConflict: false,
      });
    }
  };

  const openPermissionEditor = (appId: string) => {
    const app = applications.find((app) => app._id === appId);
    if (!app) return;

    // Initialize the editing state with current scopes
    setEditingAppId(appId);

    // Handle scopes that might be stored as a string
    if (Array.isArray(app.scopes)) {
      setEditingScopes([...app.scopes]);
    } else if (typeof app.scopes === "string") {
      try {
        setEditingScopes(JSON.parse(app.scopes));
      } catch (e) {
        setEditingScopes([]);
      }
    } else {
      setEditingScopes([]);
    }

    setIsEditingPermissions(true);
  };

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

  return (
    <div className="flex flex-col w-full gap-6 pb-10">
      <div className="flex flex-col gap-2">
        <h1 className={title({ size: "md" })}>API Setup</h1>
        <p className={subtitle()}>Create and manage your API applications and keys.</p>
      </div>

      {apiRequestStatus.error && (
        <div className="mx-auto max-w-xl p-4 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-lg text-sm border border-red-100 dark:border-red-800/30 shadow-md">
          <div className="flex flex-col items-center text-center">
            <div className="mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <p className="font-medium">Error: {apiRequestStatus.error}</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-emerald-700 dark:text-emerald-400">
          Application Clients
        </h2>
        <Button
          color="primary"
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700"
          onPress={() => setIsCreatingApp(true)}
          isDisabled={applications.length >= 2 || isCreatingApp}
        >
          Create Application
        </Button>
      </div>

      {isCreatingApp ? (
        <Card className="border border-emerald-100 dark:border-emerald-800/30">
          <CardBody className="gap-4">
            <h3 className="font-medium text-emerald-700 dark:text-emerald-400">
              Create New Application
            </h3>

            <Input
              label="Application Name"
              placeholder="Enter application name"
              value={newAppData.name}
              onChange={(e) => setNewAppData({ ...newAppData, name: e.target.value })}
              className="mb-2"
            />

            <Textarea
              label="Description"
              placeholder="Describe this application's purpose"
              value={newAppData.description}
              onChange={(e) => setNewAppData({ ...newAppData, description: e.target.value })}
              className="mb-2"
            />

            <div>
              <h4 className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-2">
                Permissions
              </h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Checkbox
                    isSelected={newAppData.scopes.includes(SCOPES.USERS.ALL)}
                    onValueChange={(checked) => {
                      if (checked) {
                        setNewAppData({
                          ...newAppData,
                          scopes: [
                            ...newAppData.scopes.filter((s) => !s.startsWith("users.")),
                            SCOPES.USERS.ALL,
                          ],
                        });
                      } else {
                        setNewAppData({
                          ...newAppData,
                          scopes: newAppData.scopes.filter((s) => s !== SCOPES.USERS.ALL),
                        });
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <span>Users - Full Access</span>
                      <Tooltip content={SCOPE_DESCRIPTIONS[SCOPES.USERS.ALL]}>
                        <div className="ml-1 text-gray-400 cursor-help">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                          </svg>
                        </div>
                      </Tooltip>
                    </div>
                  </Checkbox>
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    isSelected={newAppData.scopes.includes(SCOPES.APPLICATIONS.ALL)}
                    onValueChange={(checked) => {
                      if (checked) {
                        setNewAppData({
                          ...newAppData,
                          scopes: [
                            ...newAppData.scopes.filter((s) => !s.startsWith("applications.")),
                            SCOPES.APPLICATIONS.ALL,
                          ],
                        });
                      } else {
                        setNewAppData({
                          ...newAppData,
                          scopes: newAppData.scopes.filter((s) => s !== SCOPES.APPLICATIONS.ALL),
                        });
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <span>Applications - Full Access</span>
                      <Tooltip content={SCOPE_DESCRIPTIONS[SCOPES.APPLICATIONS.ALL]}>
                        <div className="ml-1 text-gray-400 cursor-help">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                          </svg>
                        </div>
                      </Tooltip>
                    </div>
                  </Checkbox>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <Button
                variant="light"
                onPress={() => {
                  setIsCreatingApp(false);
                }}
                isDisabled={apiRequestStatus.loading}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                className="bg-emerald-600 hover:bg-emerald-700"
                onPress={handleCreateApplication}
                isLoading={apiRequestStatus.loading}
                isDisabled={
                  !newAppData.name || !newAppData.description || newAppData.scopes.length === 0
                }
              >
                Create
              </Button>
            </div>
          </CardBody>
        </Card>
      ) : (
        <>
          {applications.length === 0 ? (
            <div className="p-6 border border-dashed border-emerald-200 dark:border-emerald-800/30 rounded-lg flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                  <line x1="6" y1="6" x2="6.01" y2="6"></line>
                  <line x1="6" y1="18" x2="6.01" y2="18"></line>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-emerald-700 dark:text-emerald-400 mb-1">
                No Applications
              </h3>
              <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-4">
                Create up to 2 applications to access the API
              </p>
              <Button
                color="primary"
                className="bg-emerald-600 hover:bg-emerald-700"
                onPress={() => setIsCreatingApp(true)}
              >
                Create First Application
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {applications
                .filter((app) => app.status !== "deleted")
                .map((app) => (
                  <Card
                    key={app._id}
                    className="border border-emerald-100 dark:border-emerald-800/30 hover:shadow-md transition-shadow overflow-hidden"
                  >
                    <CardBody className="p-0">
                      {/* Card Header */}
                      <div className="relative">
                        {/* Status indicator bar at top */}
                        <div
                          className={`h-1.5 w-full ${
                            app.status === "active"
                              ? "bg-emerald-500 dark:bg-emerald-400"
                              : "bg-yellow-400 dark:bg-yellow-500"
                          }`}
                        ></div>

                        {/* Header content with app name and status */}
                        <div className="p-4 pb-2 flex justify-between items-center">
                          <h3 className="font-medium text-lg text-emerald-700 dark:text-emerald-400">
                            {app.name}
                          </h3>
                          <Chip
                            size="sm"
                            className={`${
                              app.status === "active"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400"
                            }`}
                            startContent={
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  app.status === "active"
                                    ? "bg-emerald-500 dark:bg-emerald-400"
                                    : "bg-yellow-500 dark:bg-yellow-400"
                                }`}
                              />
                            }
                          >
                            {app.status === "active" ? "Active" : "Inactive"}
                          </Chip>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="px-4 pb-3">
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          {app.description}
                        </p>

                        {/* Created date */}
                        <div className="mb-3 text-xs text-gray-500 dark:text-gray-400">
                          Created:{" "}
                          {new Date(app.created_at).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>

                        {/* API Key section with improved styling */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">
                              API Key
                            </h4>
                            <Button
                              size="sm"
                              variant="flat"
                              className="text-xs bg-white dark:bg-gray-700"
                              onPress={() => copyToClipboard(app.api_key)}
                              isDisabled={app.status !== "active"}
                              startContent={
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                              }
                            >
                              Copy
                            </Button>
                          </div>
                          {app.status === "active" ? (
                            <div className="bg-white dark:bg-gray-700 p-2 rounded border border-gray-200 dark:border-gray-600">
                              <code className="text-xs text-gray-800 dark:text-gray-200 font-mono break-all">
                                {app.api_key}
                              </code>
                            </div>
                          ) : (
                            <div className="bg-white dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                                <p className="text-xs">
                                  Key inactive - Activate application to view
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Permissions section */}
                        <div className="mb-4">
                          <h4 className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                            Permissions
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(app.scopes)
                              ? app.scopes.map((scope) => (
                                  <Chip
                                    key={scope}
                                    size="sm"
                                    className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 text-xs"
                                  >
                                    {scope}
                                  </Chip>
                                ))
                              : typeof app.scopes === "string" &&
                                JSON.parse(app.scopes).map((scope: string) => (
                                  <Chip
                                    key={scope}
                                    size="sm"
                                    className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 text-xs"
                                  >
                                    {scope}
                                  </Chip>
                                ))}
                          </div>
                        </div>
                      </div>

                      {/* Card Footer with actions */}
                      <div className="border-t border-gray-100 dark:border-gray-800 p-3 bg-gray-50 dark:bg-gray-800/30 flex justify-end gap-2">
                        <Button
                          color="primary"
                          variant="flat"
                          size="sm"
                          onPress={() => openPermissionEditor(app._id)}
                          startContent={
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          }
                        >
                          Edit Permissions
                        </Button>
                        <Button
                          color="danger"
                          variant="flat"
                          size="sm"
                          isDisabled={app.status !== "active" || apiRequestStatus.loading}
                          onPress={() => handleRevokeApplication(app._id)}
                          startContent={
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          }
                        >
                          Revoke
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                ))}
            </div>
          )}
        </>
      )}

      <Card className="p-4 sm:p-6 border border-emerald-100 dark:border-emerald-900/30 mt-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-medium mb-2 text-emerald-700 dark:text-emerald-400">
              Documentation
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              Visit our API documentation to learn how to use your API key effectively.
            </p>
            <Link
              href="/docs/api"
              className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium flex items-center gap-1"
              showAnchorIcon
            >
              View API Documentation
            </Link>
          </div>

          <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-3 sm:p-4 border border-emerald-100 dark:border-emerald-800/30">
            <h4 className="text-sm font-medium mb-2 text-emerald-700 dark:text-emerald-400">
              Authentication Example
            </h4>
            <pre className="bg-gray-800 text-gray-200 p-2 sm:p-3 rounded text-xs overflow-x-auto">
              <code>{`curl -X GET "https://api.chatnexus.com/v1/chat" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}</code>
            </pre>
          </div>
        </div>
      </Card>

      {/* Permission edit dialog/panel */}
      {isEditingPermissions && editingAppId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-emerald-700 dark:text-emerald-400 mb-4">
              Edit Permissions
            </h3>

            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Checkbox
                    isSelected={editingScopes.includes(SCOPES.USERS.ALL)}
                    onValueChange={(checked) => {
                      if (checked) {
                        setEditingScopes([
                          ...editingScopes.filter((s) => !s.startsWith("users.")),
                          SCOPES.USERS.ALL,
                        ]);
                      } else {
                        setEditingScopes(editingScopes.filter((s) => s !== SCOPES.USERS.ALL));
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <span>Users - Full Access</span>
                      <Tooltip content={SCOPE_DESCRIPTIONS[SCOPES.USERS.ALL]}>
                        <div className="ml-1 text-gray-400 cursor-help">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                          </svg>
                        </div>
                      </Tooltip>
                    </div>
                  </Checkbox>
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    isSelected={editingScopes.includes(SCOPES.APPLICATIONS.ALL)}
                    onValueChange={(checked) => {
                      if (checked) {
                        setEditingScopes([
                          ...editingScopes.filter((s) => !s.startsWith("applications.")),
                          SCOPES.APPLICATIONS.ALL,
                        ]);
                      } else {
                        setEditingScopes(
                          editingScopes.filter((s) => s !== SCOPES.APPLICATIONS.ALL)
                        );
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <span>Applications - Full Access</span>
                      <Tooltip content={SCOPE_DESCRIPTIONS[SCOPES.APPLICATIONS.ALL]}>
                        <div className="ml-1 text-gray-400 cursor-help">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                          </svg>
                        </div>
                      </Tooltip>
                    </div>
                  </Checkbox>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="light"
                onPress={() => {
                  setIsEditingPermissions(false);
                  setEditingAppId(null);
                  setEditingScopes([]);
                }}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                className="bg-emerald-600 hover:bg-emerald-700"
                onPress={handleUpdatePermissions}
                isLoading={apiRequestStatus.loading}
                isDisabled={editingScopes.length === 0}
              >
                Save Permissions
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
