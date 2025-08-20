"use client";
import Header from "@/components/layout/Header";
import SideBar from "@/components/layout/SideBar";
import RequestBuilder from "@/components/request/RequestBuilder";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
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
