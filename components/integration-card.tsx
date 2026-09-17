"use client";

import React from "react";
import { Card, CardBody, CardFooter, Button, Chip } from "@heroui/react";
import { IntegrationType } from "./integration-modal";
import clsx from "clsx";

interface IntegrationCardProps {
  type: IntegrationType;
  title: string;
  description: string;
  icon: React.ReactNode;
  isConfigured?: boolean;
  onConfigure: () => void;
  onRemove?: () => void;
  showManageButton?: boolean;
  onManage?: () => void;
}

export const IntegrationCard: React.FC<IntegrationCardProps> = ({
  type,
  title,
  description,
  icon,
  isConfigured = false,
  onConfigure,
  onRemove,
  showManageButton = false,
  onManage,
}) => {
  return (
    <Card
      className={clsx(
        "border border-emerald-100 dark:border-emerald-900/30 hover:border-emerald-300 dark:hover:border-emerald-700/40 transition-all",
        "hover:shadow-md hover:shadow-emerald-100 dark:hover:shadow-emerald-900/10",
        isConfigured && "bg-emerald-50/30 dark:bg-emerald-900/10",
        "w-full max-w-sm"
      )}
    >
      <CardBody className="gap-3">
        <div className="flex gap-3 items-start">
          <div
            className={clsx(
              "w-12 h-12 rounded-lg flex items-center justify-center text-white",
              type === "api"
                ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                : "bg-gradient-to-br from-emerald-400 to-green-600"
            )}
          >
            {icon}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start w-full">
              <h3 className="font-semibold text-lg text-emerald-800 dark:text-emerald-400">
                {title}
              </h3>
              {isConfigured && (
                <Chip
                  size="sm"
                  className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 font-medium"
                >
                  Active
                </Chip>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {description}
            </p>
          </div>
        </div>
      </CardBody>
      <CardFooter className="justify-end gap-2 border-t border-emerald-100 dark:border-emerald-900/30">
        {isConfigured && onRemove && (
          <Button
            variant="light"
            color="danger"
            onPress={onRemove}
            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Remove
          </Button>
        )}
        {showManageButton && onManage && (
          <Button
            variant="flat"
            color="primary"
            onPress={onManage}
            className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
          >
            Manage
          </Button>
        )}
        <Button
          variant={isConfigured ? "flat" : "solid"}
          color={isConfigured ? "default" : "primary"}
          className={isConfigured ? "" : "bg-emerald-600 hover:bg-emerald-700"}
          onPress={onConfigure}
        >
          {isConfigured ? "Reconfigure" : "Configure"}
        </Button>
      </CardFooter>
    </Card>
  );
};
