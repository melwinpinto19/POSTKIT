import React from "react";
import { RequestProvider } from "@/context/RequestContext";
import RequestBreadcrumb from "@/components/request/RequestBreadcrumb";
import RequestTopBar from "@/components/request/RequestTopBar";

export default function RequestBuilder() {
  return (
    <RequestProvider>
      <div className="w-full max-w-6xl mx-auto p-4 overflow-auto">
        <RequestBreadcrumb />
        <div className="mt-4 rounded-lg border bg-background shadow-sm">
          <RequestTopBar />
        </div>
      </div>
    </RequestProvider>
  );
}