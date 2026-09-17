"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
  Checkbox,
  Spinner,
} from "@heroui/react";
import { isAuthenticated, login, setToken, LoginPayload } from "@/lib/auth";

// This component will handle the search params and pass them to the main component
const LoginContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const fromPath = searchParams.get("from") || "/";

  useEffect(() => {
    // Check if user is already authenticated
    if (isAuthenticated()) {
      // User is authenticated, redirect to dashboard or the 'from' path
      router.push(fromPath);
    }
  }, [router, fromPath]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const payload: LoginPayload = {
        email,
        password,
      };

      // Add expiration if remember me is checked (14 days in seconds)
      if (rememberMe) {
        payload.expire = 1209600; // 60 * 60 * 24 * 14
      }

      // Call login API
      const response: any = await login(payload);

      if (response && response.data.token) {
        // Set the token in cookies
        setToken(response.data.token, rememberMe);

        // Redirect to the from path or dashboard
        router.push(fromPath);
      } else {
        setError("Invalid response from server");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/30 p-4">
      <Card className="max-w-md w-full border border-emerald-100 dark:border-emerald-800/30 shadow-lg shadow-emerald-100/20 dark:shadow-emerald-900/10">
        <CardHeader className="flex flex-col items-center gap-3 pb-2 bg-emerald-50/50 dark:bg-emerald-900/20">
          <h1 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
            Login to ChatNexus
          </h1>
          <p className="text-emerald-600/70 dark:text-emerald-300/70 text-center text-sm">
            Sign in to access your dashboard
          </p>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardBody className="gap-4 pt-6">
            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-100 dark:border-red-800/30">
                {error}
              </div>
            )}
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="bordered"
              classNames={{
                label: "text-emerald-600 dark:text-emerald-400",
                inputWrapper:
                  "border-emerald-200 dark:border-emerald-800/50 bg-white/80 dark:bg-emerald-950/20",
              }}
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="bordered"
              classNames={{
                label: "text-emerald-600 dark:text-emerald-400",
                inputWrapper:
                  "border-emerald-200 dark:border-emerald-800/50 bg-white/80 dark:bg-emerald-950/20",
              }}
            />
            <div className="flex items-center gap-2">
              <Checkbox
                isSelected={rememberMe}
                onValueChange={setRememberMe}
                color="success"
                classNames={{
                  label: "text-emerald-600 dark:text-emerald-400",
                }}
              >
                Remember me for 14 days
              </Checkbox>
            </div>
          </CardBody>
          <CardFooter className="flex-col items-center gap-4 pt-2 pb-6 px-6">
            <Button
              type="submit"
              color="success"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 text-white font-medium shadow-md shadow-emerald-200 dark:shadow-emerald-900/20"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

// Loading fallback component to show while Suspense is active
function LoginLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/30 p-4">
      <div className="flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" color="success" />
        <p className="text-emerald-700 dark:text-emerald-400">Loading...</p>
      </div>
    </div>
  );
}

// Main page component that uses Suspense for the client component
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginContent />
    </Suspense>
  );
}
