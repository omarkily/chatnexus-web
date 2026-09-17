"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Checkbox,
  Textarea,
  Divider,
  Tabs,
  Tab,
  Card,
  CardBody,
  Chip,
  Tooltip,
} from "@heroui/react";
import { toast } from "@/components/toast";

export type IntegrationType = "api" | "zoho";

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

// Define scope mappings to scope combinations
export const SCOPE_MAPS: { [key: string]: string[] } = {
  "users.all": ["users.read", "users.write", "users.update", "users.delete"],
  "applications.all": [
    "applications.read",
    "applications.write",
    "applications.update",
    "applications.delete",
  ],
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

interface IntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  integrationType: IntegrationType;
  isConfigured?: boolean;
  onSaveConfiguration: () => void;
}

export const IntegrationModal: React.FC<IntegrationModalProps> = ({
  isOpen,
  onClose,
  integrationType,
  isConfigured = false,
  onSaveConfiguration,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [applications, setApplications] = useState<Application[]>([]);
  const [isCreatingApp, setIsCreatingApp] = useState(false);
  const [hasReadFullContent, setHasReadFullContent] = useState(false);
  const zohoFormRef = React.useRef<HTMLDivElement>(null);
  const [zohoCrmUrl, setZohoCrmUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [newAppData, setNewAppData] = useState({
    name: "",
    description: "",
    scopes: ["applications.all", "users.all"],
  });
  const [apiRequestStatus, setApiRequestStatus] = useState<{
    loading: boolean;
    error: string | null;
    success: boolean;
  }>({
    loading: false,
    error: null,
    success: false,
  });
  const [isEditingPermissions, setIsEditingPermissions] = useState(false);
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [editingScopes, setEditingScopes] = useState<string[]>([]);

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

  // Block body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      // Disable scrolling on body when modal is open
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scrolling when modal closes
      document.body.style.overflow = "";
    }

    return () => {
      // Cleanup: re-enable scrolling if component unmounts while modal is open
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Reset state when modal opens/closes
    if (isOpen) {
      setActiveTab(
        isConfigured ? (integrationType === "zoho" ? "zohoCrm" : "applications") : "overview"
      );
      setApiRequestStatus({
        loading: false,
        error: null,
        success: false,
      });
      setHasReadFullContent(false);
      setZohoCrmUrl("");
      setUrlError("");
    }
  }, [isOpen, isConfigured, integrationType]);

  // Handle scroll to check if user has read full content
  useEffect(() => {
    if (!isOpen || integrationType !== "zoho" || isConfigured) {
      return;
    }

    const checkScrollPosition = () => {
      if (!zohoFormRef.current) return;

      // Get the parent modal body for proper scroll tracking
      const modalBody =
        zohoFormRef.current?.closest(".modal-body") || zohoFormRef.current?.parentElement;
      if (!modalBody) return;

      const { scrollTop, scrollHeight, clientHeight } = modalBody;

      // Consider content read if scrolled at least 90% of the way down
      const isNearBottom = scrollTop + clientHeight >= scrollHeight * 0.9;

      if (isNearBottom) {
        setHasReadFullContent(true);
      }
    };

    const modalBody =
      zohoFormRef.current?.closest(".modal-body") || zohoFormRef.current?.parentElement;
    if (modalBody) {
      // Initial check in case content is small enough to fit without scrolling
      setTimeout(checkScrollPosition, 100);

      modalBody.addEventListener("scroll", checkScrollPosition);
      return () => modalBody.removeEventListener("scroll", checkScrollPosition);
    }
  }, [isOpen, integrationType, isConfigured]);

  const handleSaveConfiguration = () => {
    // For Zoho CRM, validate the URL is provided
    if (integrationType === "zoho" && !isConfigured) {
      // If content hasn't been read, scroll to bottom
      if (!hasReadFullContent && zohoFormRef.current) {
        const modalBody =
          zohoFormRef.current?.closest(".modal-body") || zohoFormRef.current?.parentElement;
        if (modalBody) {
          modalBody.scrollTo({
            top: modalBody.scrollHeight,
            behavior: "smooth",
          });

          // Set a timeout to update the hasReadFullContent state after smooth scroll completes
          setTimeout(() => {
            setHasReadFullContent(true);
          }, 800); // Typical smooth scroll takes ~500-800ms

          return;
        }
      }

      // Check if URL is provided
      if (!zohoCrmUrl.trim()) {
        setUrlError("Zoho CRM URL is required");
        return;
      }

      // Basic URL validation
      if (!zohoCrmUrl.startsWith("https://crm.zoho.com/")) {
        setUrlError("Please enter a valid Zoho CRM URL");
        return;
      }

      setUrlError("");
    }

    setIsSaving(true);

    // Save the configuration
    setTimeout(() => {
      setIsSaving(false);
      // Call the parent component's handler
      onSaveConfiguration();
      toast.success("Integration configured successfully!", { duration: 4000 });
      onClose();
    }, 1000);
  };

  const handleCreateApplication = async () => {
    setApiRequestStatus({
      loading: true,
      error: null,
      success: false,
    });

    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      // Make API call to create application
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/applications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...newAppData,
            name: newAppData.name,
            type: integrationType, // Include the integration type in the request
          }),
        }
      );

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
      });

      toast.success("Application created successfully!");
    } catch (error) {
      console.error("Error creating application:", error);
      setApiRequestStatus({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to create application",
        success: false,
      });
    }
  };

  const handleUpdatePermissions = async () => {
    if (!editingAppId) return;

    setApiRequestStatus({
      loading: true,
      error: null,
      success: false,
    });

    try {
      // Find the app being edited
      const appToUpdate = applications.find((app) => app._id === editingAppId);
      if (!appToUpdate) throw new Error("Application not found");

      // Make API call to update application
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/applications/${editingAppId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify({
            scopes: editingScopes,
            // Keep other fields the same
            name: appToUpdate.name,
            description: appToUpdate.description,
          }),
        }
      );

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
      });

      // Show a toast with success message
      toast.success("Application permissions updated successfully!", { duration: 4000 });
    } catch (error) {
      console.error("Error updating application permissions:", error);
      setApiRequestStatus({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to update application permissions",
        success: false,
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

  const renderForm = () => {
    if (isConfigured) {
      return integrationType === "api" ? renderApplicationsTab() : renderZohoCrmTab();
    }

    return integrationType === "api" ? renderApiIntegrationInfo() : renderZohoCrmForm();
  };

  const renderApiIntegrationInfo = () => (
    <>
      <div className="space-y-6">
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
          <h3 className="text-lg font-medium text-emerald-700 dark:text-emerald-400 mb-2">
            About API Integration
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            Configuring API Integration will allow you to create up to 2 application clients. Each
            application will have:
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300 space-y-2">
            <li>Its own unique API key for authentication</li>
            <li>Customizable permission scopes</li>
            <li>Independent access control</li>
            <li>Usage tracking and analytics</li>
          </ul>
        </div>

        <div className="p-4 border border-emerald-100 dark:border-emerald-800/30 rounded-lg">
          <h3 className="text-lg font-medium text-emerald-700 dark:text-emerald-400 mb-2">
            What You Can Do
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
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
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                  <line x1="6" y1="6" x2="6.01" y2="6"></line>
                  <line x1="6" y1="18" x2="6.01" y2="18"></line>
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold">Create Applications</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Create up to 2 application clients
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
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
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold">Set Permissions</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Control exactly what each app can access
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
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
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold">Secure API Keys</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Generate and manage API keys securely
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
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
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold">Monitor Usage</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Track API calls and application activity
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 text-center text-sm text-gray-500">
          <p>
            Once configured, other integrations will be hidden until this integration is
            deactivated.
          </p>
        </div>
      </div>

      {apiRequestStatus.error && (
        <div className="mx-auto max-w-xl p-4 mb-4 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-lg text-sm border border-red-100 dark:border-red-800/30 shadow-md">
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
    </>
  );

  const renderZohoCrmTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-emerald-700 dark:text-emerald-400">
        Zoho CRM Settings
      </h3>

      <Card className="border border-emerald-100 dark:border-emerald-800/30">
        <CardBody className="gap-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-emerald-700 dark:text-emerald-400">
              Connection Details
            </h4>
            <Chip
              size="sm"
              className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
              startContent={
                <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              }
            >
              Active
            </Chip>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <h5 className="text-sm font-medium">Connected CRM URL</h5>
            </div>
            <code className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded block font-mono break-all">
              {zohoCrmUrl || "https://crm.zoho.com/crm/org742535210"}
            </code>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
            <h4 className="font-medium text-emerald-700 dark:text-emerald-400 mb-2">
              Sync Settings
            </h4>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Auto-sync data</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Automatically sync data every 30 minutes
                  </p>
                </div>
                <Checkbox defaultSelected />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Notification on sync error</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Get notified when data sync fails
                  </p>
                </div>
                <Checkbox defaultSelected />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Two-way sync</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Changes in either system will be reflected in both
                  </p>
                </div>
                <Checkbox defaultSelected />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
            <h4 className="font-medium text-emerald-700 dark:text-emerald-400 mb-2">
              Modules Enabled
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <Chip
                size="sm"
                className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
              >
                Leads
              </Chip>
              <Chip
                size="sm"
                className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
              >
                Contacts
              </Chip>
              <Chip
                size="sm"
                className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
              >
                Deals
              </Chip>
              <Chip
                size="sm"
                className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
              >
                Accounts
              </Chip>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              color="primary"
              variant="flat"
              size="sm"
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
              Edit Settings
            </Button>
            <Button color="danger" variant="light" size="sm">
              Disconnect
            </Button>
          </div>
        </CardBody>
      </Card>

      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm border border-blue-100 dark:border-blue-800/30">
        <strong>Note:</strong> Changes to Zoho CRM integration settings may take up to 15 minutes to
        fully propagate.
      </div>
    </div>
  );

  const renderApplicationsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-emerald-700 dark:text-emerald-400">
          Application Clients
        </h3>
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
            <h4 className="font-medium text-emerald-700 dark:text-emerald-400">
              Create New Application
            </h4>

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
              <h5 className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-2">
                Permissions
              </h5>
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

            {apiRequestStatus.error && (
              <div className="p-3 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-lg text-sm">
                Error: {apiRequestStatus.error}
              </div>
            )}

            <div className="flex justify-end gap-2 mt-2">
              <Button
                variant="light"
                onPress={() => {
                  setIsCreatingApp(false);
                  setApiRequestStatus({
                    loading: false,
                    error: null,
                    success: false,
                  });
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                          onPress={() => {
                            navigator.clipboard.writeText(app.api_key);
                            toast.info("API key copied to clipboard", { duration: 3000 });
                          }}
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
                            <p className="text-xs">Key inactive - Activate application to view</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Permissions section */}
                    <div className="mb-3">
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

                  {/* Add a footer with the Edit Permissions button */}
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
                  </div>
                </CardBody>
              </Card>
            ))}
        </div>
      )}
    </div>
  );

  const renderZohoCrmForm = () => (
    <div className="space-y-4" ref={zohoFormRef}>
      <div>
        <h3 className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-3">
          Connect to Zoho CRM
        </h3>

        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            Please copy and paste your Zoho CRM tab URL to connect your account:
          </p>
          <Input
            label="Zoho CRM URL"
            placeholder="https://crm.zoho.com/crm/org742535210"
            type="text"
            value={zohoCrmUrl}
            onChange={(e) => {
              setZohoCrmUrl(e.target.value);
              setUrlError("");
            }}
            isRequired
            isInvalid={!!urlError}
            errorMessage={urlError}
            className="mb-2"
          />
        </div>

        <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 mb-4 flex flex-col items-center justify-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 text-center">
            Image placeholder: How to copy your Zoho CRM URL
          </p>
          <div className="w-full h-40 bg-gray-200 dark:bg-gray-800 rounded flex items-center justify-center">
            <p className="text-gray-400 dark:text-gray-600">Image will be displayed here</p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 max-w-md text-center">
            1. Login to your Zoho CRM account 2. Navigate to any tab in your CRM 3. Copy the full
            URL from your browser&apos;s address bar 4. Paste it in the field above
          </p>
        </div>

        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm border border-blue-100 dark:border-blue-800/30">
          <strong>Note:</strong> This integration requires appropriate Zoho CRM access permissions.
          Make sure your account has administrator access or the necessary permissions to create
          integrations.
        </div>
      </div>

      <Divider className="my-4" />

      <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
        <h3 className="text-lg font-medium text-emerald-700 dark:text-emerald-400 mb-3">
          Zoho CRM Integration Features
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Connect your ChatNexus application with Zoho CRM to access and manage your customer data
          seamlessly.
        </p>

        <h4 className="font-medium text-emerald-700 dark:text-emerald-400 mb-2">
          This integration enables:
        </h4>
        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
          <li>Accessing (create, read, update) Leads, Contacts, and Deals modules</li>
          <li>Creating functions and workflows for automated actions</li>
          <li>Creating webtabs, widgets, and related lists in your CRM</li>
          <li>Creating custom reports for data analysis</li>
          <li>Accessing users and organization details</li>
        </ul>
      </div>
    </div>
  );

  // Mobile bottom drawer implementation
  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={onClose}
            />

            {/* Mobile Bottom Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] bg-background border-t border-divider rounded-t-xl overflow-y-auto modal-body"
            >
              <div className="sticky top-0 bg-background z-10 px-6 pt-6 pb-2">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-emerald-700 dark:text-emerald-400">
                    {integrationType === "api" ? "API Integration" : "Zoho CRM Integration"}
                  </h2>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={onClose}
                    className="text-default-500 hover:text-default-700 transition"
                  >
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
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  {integrationType === "api"
                    ? isConfigured
                      ? "Manage your API applications and settings"
                      : "Configure your API integration settings to connect with ChatNexus."
                    : "Connect ChatNexus with your Zoho CRM account to sync customer data."}
                </p>
              </div>

              <div className="p-6 pt-2">{renderForm()}</div>

              {!isConfigured && (
                <div className="sticky bottom-0 bg-background z-10 p-6 pt-3 border-t border-divider flex justify-end gap-2">
                  <Button color="default" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onPress={handleSaveConfiguration}
                    isLoading={isSaving}
                  >
                    {integrationType === "zoho" && !hasReadFullContent
                      ? "Continue Reading"
                      : isSaving
                        ? "Saving..."
                        : "Save Configuration"}
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Desktop modal implementation
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      classNames={{
        backdrop: "bg-black/50 backdrop-blur-sm",
        base: "max-h-[90vh] max-w-[50vw]",
        wrapper: "items-center",
        body: "p-0",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-400 [&::-webkit-scrollbar-thumb]:dark:hover:bg-gray-500 [&::-webkit-scrollbar-thumb]:transition-colors [&::-webkit-scrollbar-thumb]:duration-200">
              {renderForm()}
            </ModalBody>
            <ModalFooter className="px-6 py-4 border-t border-divider">
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              {!isConfigured && (
                <Button
                  color="success"
                  onPress={handleSaveConfiguration}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Save Configuration
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
