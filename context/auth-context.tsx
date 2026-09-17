"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated, logout, getToken } from '@/lib/auth';

interface AuthContextType {
  authenticated: boolean;
  loading: boolean;
  handleLogout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  authenticated: false,
  loading: true,
  handleLogout: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/about', '/pricing', '/docs', '/blog', '/'];

  useEffect(() => {
    const checkAuth = () => {
      const auth = isAuthenticated();
      setAuthenticated(auth);
      setLoading(false);

      // Check if the current path is not public and user is not authenticated
      const isPublicPath = publicPaths.some(path => 
        pathname === path || pathname.startsWith(`${path}/`)
      );
      
      if (!auth && !isPublicPath && pathname !== undefined) {
        console.log('Client-side redirect to login');
        router.push(`/login?from=${encodeURIComponent(pathname)}`);
      }

      // Redirect from login page if authenticated
      if (auth && pathname === '/login') {
        router.push('/dashboard');
      }
    };

    checkAuth();

    // Check auth status every 5 minutes to detect expired tokens
    const intervalId = setInterval(checkAuth, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [pathname, router]);

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ authenticated, loading, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}; 