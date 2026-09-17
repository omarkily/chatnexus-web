"use client";

import React, { FC, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Input,
  Avatar,
  Button,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import clsx from "clsx";

import { Logo, MenuIcon, SearchIcon } from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";
import { useSidebarStore } from "@/store/sidebarStore";
import { RightSidebar } from "@/components/right-sidebar";
import { LogoutButton } from "@/components/logout-button";

export const TopNavbar: FC = () => {
  const { isCollapsed, width, collapsedWidth, toggleCollapsed, resetWidth, toggleMobileOpen } =
    useSidebarStore();
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      <header
        style={{
          left: isMobile ? 0 : isCollapsed ? collapsedWidth : width,
          width: isMobile ? "100%" : `calc(100% - ${isCollapsed ? collapsedWidth : width}px)`,
        }}
        className="h-16 fixed top-0 right-0 z-40 border-b border-r-0 border-divider bg-background flex items-center px-4 transition-all duration-300"
      >
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-4">
            {/* Mobile menu button - visible on small screens */}
            <Button
              isIconOnly
              variant="light"
              className="md:hidden"
              onPress={toggleMobileOpen}
              aria-label="Open menu"
            >
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
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </Button>

            {/* Sidebar toggle button - visible on large screens */}
            <Button
              isIconOnly
              variant="light"
              className="hidden md:flex hover:bg-transparent"
              onPress={toggleCollapsed}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <MenuIcon className="text-default-500" />
              ) : (
                <MenuIcon className="text-default-500" />
              )}
            </Button>

            {/* Brand logo - show on all screen sizes when on mobile */}
            <div className={clsx("items-center gap-2", isMobile ? "flex" : "hidden lg:flex")}>
              <span className="font-bold text-lg">ChatNexus</span>
            </div>

            {/* Search input */}
            <div className="max-w-md w-full hidden sm:block">
              <Input
                aria-label="Search"
                classNames={{
                  inputWrapper: "bg-default-100",
                  input: "text-sm",
                }}
                placeholder="Search..."
                startContent={
                  <SearchIcon className="text-default-400 text-base pointer-events-none flex-shrink-0" />
                }
                type="search"
                size="sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeSwitch />
            
            {/* Profile button - opens right sidebar */}
            <Button
              isIconOnly
              variant="light"
              className="rounded-full"
              onPress={() => setProfileOpen(!isProfileOpen)}
            >
              <Avatar
                name="User"
                size="sm"
                src="https://i.pravatar.cc/150?img=3"
                className="cursor-pointer"
              />
            </Button>
          </div>
        </div>
      </header>

      {/* Right sidebar with integrated logout functionality */}
      <RightSidebar 
        isOpen={isProfileOpen} 
        onClose={() => setProfileOpen(false)} 
      />
    </>
  );
};
