"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check for authentication
    if (!isAuthenticated()) {
      // Redirect to login if not authenticated
      const returnUrl = encodeURIComponent(pathname || "/dashboard");
      router.push(`/login?from=${returnUrl}`);
    }
  }, [router, pathname]);

  // If we're checking authentication, don't render children yet
  if (typeof window !== "undefined" && !isAuthenticated()) {
    return null;
  }

  // If authenticated, render children
  return <>{children}</>;
};
