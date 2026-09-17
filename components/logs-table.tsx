"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from "@heroui/react";
import { LogStatusBadge } from "@/components/log-status-badge";

interface LogsTableProps {
  logs: any[];
}

// Method badge component
const MethodBadge: React.FC<{ method: string }> = ({ method }) => {
  let className = '';
  
  switch (method.toUpperCase()) {
    case 'GET':
      className = 'bg-emerald-500 dark:bg-emerald-600';
      break;
    case 'POST':
      className = 'bg-blue-500 dark:bg-blue-600';
      break;
    case 'PUT':
      className = 'bg-amber-500 dark:bg-amber-600';
      break;
    case 'DELETE':
      className = 'bg-red-500 dark:bg-red-600';
      break;
    case 'PATCH':
      className = 'bg-purple-500 dark:bg-purple-600';
      break;
    default:
      className = 'bg-gray-500 dark:bg-gray-600';
  }

  return (
    <span className={`${className} px-2 py-1 rounded text-white text-xs font-bold`}>
      {method.toUpperCase()}
    </span>
  );
};

export const LogsTable: React.FC<LogsTableProps> = ({ logs }) => {
  const router = useRouter();

  // Handle row click to navigate to log details
  const handleRowClick = (logId: string) => {
    router.push(`/logs/${logId}`);
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  // Truncate URL for display
  const truncateUrl = (url: string, maxLength: number = 40) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  // Render empty state
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-emerald-700 dark:text-emerald-400 mb-1">No Logs Found</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
          No request logs match your current filters. Try adjusting your filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-6">
      <Table 
        aria-label="Request logs table"
        className="min-w-full"
        classNames={{
          wrapper: "px-6",
          th: "bg-emerald-50/50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium",
          tr: "cursor-pointer hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors border-b border-emerald-100 dark:border-emerald-800/30",
        }}
      >
        <TableHeader>
          <TableColumn>METHOD</TableColumn>
          <TableColumn>URL</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>API VERSION</TableColumn>
          <TableColumn>TIMESTAMP</TableColumn>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log._id} onClick={() => handleRowClick(log._id)}>
              <TableCell>
                <MethodBadge method={log.method} />
              </TableCell>
              <TableCell className="max-w-[200px] truncate">
                {truncateUrl(log.url)}
              </TableCell>
              <TableCell>
                <LogStatusBadge statusCode={log.statusCode} />
              </TableCell>
              <TableCell>
                <Chip 
                  size="sm" 
                  className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  v{log.apiVersion}
                </Chip>
              </TableCell>
              <TableCell className="text-gray-600 dark:text-gray-300 text-sm">
                {formatTimestamp(log.timestamp)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}; 