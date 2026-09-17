"use client";

import React, { useState, useEffect } from "react";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button as UIButton,
  Chip,
  Checkbox,
} from "@heroui/react";
import { title, subtitle } from "@/components/primitives";
import { IntegrationCard } from "@/components/integration-card";
import { IntegrationModal, IntegrationType } from "@/components/integration-modal";
import { SetupTab } from "@/components/setup-tab";
import { LogsTable } from "@/components/logs-table";
import { LogsFilter } from "@/components/logs-filter";

// Integration data
const integrations = [
  {
    id: "api",
    title: "API Integration",
    description: "Connect directly with our robust API to build custom integrations and workflows.",
    icon: (
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
        <path d="M9 15L3 9l6-6" />
        <path d="M15 3l6 6-6 6" />
        <path d="M12 3v18" />
      </svg>
    ),
  },
  {
    id: "zoho",
    title: "Zoho CRM",
    description:
      "Synchronize contacts, leads, and deals with Zoho CRM for streamlined data management.",
    icon: (
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
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
];

// Local storage key for configured integration
const CONFIGURED_INTEGRATION_KEY = "configuredIntegration";

export default function IntegrationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIntegrationType, setSelectedIntegrationType] = useState<IntegrationType | null>(
    null
  );
  const [configuredIntegrations, setConfiguredIntegrations] = useState<IntegrationType[]>([]);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [integrationToRemove, setIntegrationToRemove] = useState<IntegrationType | null>(null);

  // Load configured integrations from localStorage on component mount
  useEffect(() => {
    const savedIntegrations = localStorage.getItem(CONFIGURED_INTEGRATION_KEY);
    if (savedIntegrations) {
      try {
        const integrations = JSON.parse(savedIntegrations);
        // Validate that we have an array of valid integration types
        if (
          Array.isArray(integrations) &&
          integrations.every((type) => type === "api" || type === "zoho")
        ) {
          setConfiguredIntegrations(integrations);
        } else {
          // If data is invalid, clear it from localStorage
          localStorage.removeItem(CONFIGURED_INTEGRATION_KEY);
        }
      } catch (e) {
        console.error("Error parsing saved integrations:", e);
        // If there's an error parsing, clear the invalid data
        localStorage.removeItem(CONFIGURED_INTEGRATION_KEY);
      }
    }
  }, []);

  // Function to handle integration card click
  const handleIntegrationClick = (integrationType: IntegrationType) => {
    setSelectedIntegrationType(integrationType);
    setIsModalOpen(true);
  };

  // Function to handle integration configuration save
  const handleSaveConfiguration = (integrationType: IntegrationType) => {
    // Add the new integration to the list if it's not already configured
    setConfiguredIntegrations((prev) => {
      if (!prev.includes(integrationType)) {
        const newIntegrations = [...prev, integrationType];
        localStorage.setItem(CONFIGURED_INTEGRATION_KEY, JSON.stringify(newIntegrations));
        return newIntegrations;
      }
      return prev;
    });
    // Close modal
    setIsModalOpen(false);
  };

  // Function to handle integration removal
  const handleRemoveIntegration = (integrationType: IntegrationType) => {
    setIntegrationToRemove(integrationType);
    setIsRemoveModalOpen(true);
  };

  // Function to confirm and complete integration removal
  const confirmRemoveIntegration = () => {
    if (integrationToRemove) {
      setConfiguredIntegrations((prev) => {
        const newIntegrations = prev.filter((type) => type !== integrationToRemove);
        localStorage.setItem(CONFIGURED_INTEGRATION_KEY, JSON.stringify(newIntegrations));
        return newIntegrations;
      });
      setIsRemoveModalOpen(false);
      setIntegrationToRemove(null);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6">
      <div className="mt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => (
          <IntegrationCard
            key={integration.id}
            type={integration.id as IntegrationType}
            title={integration.title}
            description={integration.description}
            icon={integration.icon}
            isConfigured={configuredIntegrations.includes(integration.id as IntegrationType)}
            onConfigure={() => handleIntegrationClick(integration.id as IntegrationType)}
            onRemove={
              configuredIntegrations.includes(integration.id as IntegrationType)
                ? () => handleRemoveIntegration(integration.id as IntegrationType)
                : undefined
            }
          />
        ))}
      </div>

      <IntegrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        integrationType={selectedIntegrationType || "api"}
        isConfigured={
          selectedIntegrationType ? configuredIntegrations.includes(selectedIntegrationType) : false
        }
        onSaveConfiguration={() => {
          if (selectedIntegrationType) {
            handleSaveConfiguration(selectedIntegrationType);
          }
        }}
      />

      {/* Confirmation modal for removing integration */}
      <Modal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        classNames={{
          backdrop: "bg-black/50 backdrop-blur-sm",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-lg font-medium text-red-600 dark:text-red-400">
                  Remove Integration
                </h3>
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to remove the{" "}
                  {integrationToRemove === "api" ? "API" : "Zoho CRM"} integration? This will
                  unconfigure the integration and you will need to set it up again if you want to
                  use it.
                </p>
                {integrationToRemove === "api" && (
                  <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm border border-yellow-100 dark:border-yellow-800/30 shadow-sm">
                    <strong className="text-yellow-900 dark:text-yellow-300">Warning:</strong> Your
                    application clients will remain active, but you will no longer see them in the
                    UI until you reconfigure the API integration.
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <UIButton variant="light" onPress={onClose}>
                  Cancel
                </UIButton>
                <UIButton color="danger" onPress={confirmRemoveIntegration}>
                  Remove Integration
                </UIButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
