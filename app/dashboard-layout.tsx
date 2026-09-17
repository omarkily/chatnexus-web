"use client";

import { FC, ReactNode, useEffect, useState } from "react";
import { useSidebarStore } from "@/store/sidebarStore";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  const { isCollapsed, width, collapsedWidth } = useSidebarStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update CSS variables for the sidebar width
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--sidebar-width', 
      `${isCollapsed ? collapsedWidth : width}px`
    );
  }, [isCollapsed, width, collapsedWidth]);

  return (
    <main
      style={{
        marginLeft: isMobile ? 0 : (isCollapsed ? collapsedWidth : width),
        width: isMobile ? '100%' : `calc(100% - ${isCollapsed ? collapsedWidth : width}px)`,
        marginTop: "64px", // height of top navbar
        height: "calc(100vh - 64px)", // subtract top navbar height
      }}
      className="bg-background overflow-hidden relative transition-all duration-300"
    >
      {/* Scrollable content container */}
      <div className="h-full overflow-auto">
        <div className="container mx-auto p-4 md:p-6 relative">{children}</div>
      </div>
    </main>
  );
};
