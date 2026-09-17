"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, Divider, Button, Link } from "@heroui/react";

import { siteConfig } from "@/config/site";
import { TwitterIcon, GithubIcon, DiscordIcon } from "@/components/icons";
import { LogoutButton } from "@/components/logout-button";

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ isOpen, onClose }) => {
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  const renderSidebarContent = () => (
    <div className="p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Profile</h2>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onPress={onClose}
          className="text-default-500 hover:text-default-700 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </Button>
      </div>
      
      <div className="flex flex-col items-center mb-6">
        <Avatar
          src="https://i.pravatar.cc/150?img=3"
          className="w-24 h-24"
          name="User"
        />
        <h3 className="text-lg font-semibold mt-3">John Doe</h3>
        <p className="text-sm text-default-500">john.doe@example.com</p>
      </div>
      
      <Divider className="my-3" />
      
      <div className="flex flex-col gap-2">
        <Button variant="light" className="justify-start">My Account</Button>
        <Button variant="light" className="justify-start">Settings</Button>
        <Button variant="light" className="justify-start">Team</Button>
      </div>
      
      <Divider className="my-3" />
      
      <div className="mb-4">
        <h4 className="text-sm font-semibold mb-2">Connect with us</h4>
        <div className="flex gap-3">
          <Link isExternal aria-label="Twitter" href={siteConfig.links.twitter}>
            <TwitterIcon className="text-default-500 hover:text-blue-500 transition" />
          </Link>
          <Link isExternal aria-label="Discord" href={siteConfig.links.discord}>
            <DiscordIcon className="text-default-500 hover:text-blue-500 transition" />
          </Link>
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500 hover:text-blue-500 transition" />
          </Link>
        </div>
      </div>
      
      <div className="mt-auto">
        <LogoutButton
          color="danger"
          variant="flat"
          className="w-full"
          onLogout={onClose}
        >
          Sign Out
        </LogoutButton>
      </div>
    </div>
  );

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
          
          {/* Desktop Right Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="fixed top-0 right-0 z-50 h-screen w-72 bg-background border-l border-divider shadow-lg hidden md:block"
          >
            {renderSidebarContent()}
          </motion.div>

          {/* Mobile Bottom Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50 h-[80vh] bg-background border-t border-divider rounded-t-xl overflow-y-auto md:hidden"
          >
            {renderSidebarContent()}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}; 