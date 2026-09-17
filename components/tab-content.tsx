"use client";

import { FC } from "react";
import { title } from "@/components/primitives";
import { TabId } from "@/store/sidebarStore";

interface TabContentProps {
  tabId: TabId;
}

export const TabContent: FC<TabContentProps> = ({ tabId }) => {
  const formattedTitle = tabId.charAt(0).toUpperCase() + tabId.slice(1).replace(/-/g, " ");
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className={title({ size: "lg" })}>
        {formattedTitle}
      </h1>
      <p className="text-default-600 mt-4">
        This is the {tabId.replace(/-/g, " ")} tab content.
      </p>
    </div>
  );
}; 