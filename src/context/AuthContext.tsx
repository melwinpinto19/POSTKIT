"use client";
import { getCurrentUser } from "@/api/user";
import { FullScreenLoader } from "@/components/shared/Loader";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<{
  user: string | null;
  login: (user: string, token: string) => void;
  logout: () => void;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const login = (user: string, token: string) => {
    setUser(user);
    localStorage.setItem("access_token", token);
    router.push("/home");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("access_token");
    router.push("/auth/login");
  };

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      const response = await getCurrentUser();

      if (response.success) {
        setUser(response.data.data.email);
      }

      setIsLoading(false);
    };
    fetchLoggedInUser();
  }, []);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
