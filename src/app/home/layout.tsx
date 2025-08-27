"use client";
import Header from "@/components/layout/Header";
import SideBar from "@/components/layout/SideBar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="h-[100vh] overflow-auto">
      <Header />
      <main className="flex">
        <SideBar />
        {children}
      </main>
    </div>
  );
}

export default Layout;
