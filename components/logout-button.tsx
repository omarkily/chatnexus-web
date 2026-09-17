"use client";

import React from "react";
import { Button, ButtonProps } from "@heroui/react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";

interface LogoutButtonProps extends Omit<ButtonProps, 'onPress'> {
  redirect?: string;
  onLogout?: () => void;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  redirect = "/login",
  children = "Log Out", 
  color = "default",
  variant = "flat",
  onLogout,
  ...props 
}) => {
  const router = useRouter();

  const handleLogout = () => {
    // Call logout function from auth utility
    logout();

    // Run any additional logout callback
    if (onLogout) {
      onLogout();
    }
    
    // Redirect user after logout
    router.push(redirect);
  };

  return (
    <Button
      color={color}
      variant={variant}
      onPress={handleLogout}
      {...props}
    >
      {children}
    </Button>
  );
}; 