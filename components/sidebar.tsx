"use client";

import React, { FC, ReactNode, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useSidebarStore, TabId } from "@/store/sidebarStore";
import { Divider, Tooltip, Button } from "@heroui/react";

import {
  OverviewIcon,
  IntegrationsIcon,
  AnalyticsIcon,
  SettingsIcon,
  ChatsIcon,
  KnowledgeBaseIcon,
  SupportIcon,
  Logo,
  ExpandIcon,
  CollapseIcon,
} from "@/components/icons";

interface SidebarTabProps {
  id: TabId;
  label: string;
  icon: ReactNode;
  isSelected: boolean;
  href: string;
  isCollapsed: boolean;
}

const SidebarTab: FC<SidebarTabProps> = ({ id, label, icon, isSelected, href, isCollapsed }) => {
  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 w-full",
        isSelected
          ? "bg-primary/10 text-primary font-medium"
          : "text-foreground/70 hover:bg-default-100"
      )}
    >
      <div className="text-lg">{icon}</div>
      {!isCollapsed && <span className="text-sm">{label}</span>}
    </Link>
  );
};

export const Sidebar: FC = () => {
  const { isCollapsed, width, collapsedWidth, toggleCollapsed, isMobileOpen, setMobileOpen } =
    useSidebarStore();
  const pathname = usePathname();
  const isMobile = typeof window !== "undefined" ? window.innerWidth < 768 : false;

  const getTabRoute = (tabId: TabId) => {
    return `/${tabId}`;
  };

  const isTabSelected = (tabId: TabId) => {
    return pathname === getTabRoute(tabId);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && isMobileOpen) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileOpen, setMobileOpen]);

  const mainTabs = [
    { id: "overview" as TabId, label: "Overview", icon: <OverviewIcon /> },
    { id: "channels" as TabId, label: "Channels", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
      </svg>
    ) },
    { id: "integrations" as TabId, label: "Integrations", icon: <IntegrationsIcon /> },
    { id: "analytics" as TabId, label: "Analytics", icon: <AnalyticsIcon /> },
    { id: "logs" as TabId, label: "Logs", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    ) },
    { id: "settings" as TabId, label: "Settings", icon: <SettingsIcon /> },
  ];

  const chatTabs = [{ id: "chats" as TabId, label: "Chats", icon: <ChatsIcon /> }];

  const bottomTabs = [
    { id: "knowledge-base" as TabId, label: "Knowledge Base", icon: <KnowledgeBaseIcon /> },
    { id: "support" as TabId, label: "Contact Support", icon: <SupportIcon /> },
  ];

  const renderSidebarContent = () => (
    <>
      {/* Main navigation section */}
      <div className="flex flex-col flex-1 px-3 py-4 gap-1">
        {mainTabs.map((tab) => (
          <SidebarTab
            key={tab.id}
            id={tab.id}
            label={tab.label}
            icon={tab.icon}
            isSelected={isTabSelected(tab.id)}
            href={getTabRoute(tab.id)}
            isCollapsed={isCollapsed}
          />
        ))}

        <Divider className="my-3" />

        {chatTabs.map((tab) => (
          <SidebarTab
            key={tab.id}
            id={tab.id}
            label={tab.label}
            icon={tab.icon}
            isSelected={isTabSelected(tab.id)}
            href={getTabRoute(tab.id)}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>

      {/* Bottom tabs */}
      <div className="mt-auto px-3 pb-6 pt-2 flex flex-col gap-1">
        {bottomTabs.map((tab) => (
          <SidebarTab
            key={tab.id}
            id={tab.id}
            label={tab.label}
            icon={tab.icon}
            isSelected={isTabSelected(tab.id)}
            href={getTabRoute(tab.id)}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        style={{ width: isCollapsed ? collapsedWidth : width }}
        className="h-screen hidden md:flex flex-col border-r border-divider bg-background fixed top-0 left-0 overflow-y-auto z-40"
      >
        {/* Fixed height header section to align with top navbar */}
        <div className="h-16 hidden lg:block" />
        {renderSidebarContent()}
      </aside>

      {/* Mobile Bottom Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="fixed bottom-0 left-0 right-0 z-50 h-[80vh] bg-background border-t border-divider rounded-t-xl overflow-y-auto md:hidden"
            >
              <div className="flex justify-between items-center p-4 border-b border-divider sticky top-0 bg-background">
                <h2 className="text-xl font-bold">Navigation</h2>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => setMobileOpen(false)}
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
              <div className="h-full flex flex-col">{renderSidebarContent()}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Corner connector */}
      <div className="absolute top-0 right-0 hidden md:block">
        <div className="w-5 h-5 bg-white dark:bg-gray-950" />
        <div className="w-5 h-5 bg-background rounded-tl-xl" />
      </div>
    </>
  );
};
