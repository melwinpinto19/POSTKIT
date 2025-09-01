"use client";
import React from "react";
import RequestBreadcrumb from "./RequestBreadcrumb";
import SaveRequestButton from "./SaveRequest";
import RequestTopBar from "./RequestTopBar";
import RequestResponse from "./RequestResponse";
import RequestTabs from "./tabs/RequestTabs";
import { useRequest } from "@/context/RequestContext";
import { Skeleton } from "@/components/ui/skeleton";

function Request() {
  const { isLoading } = useRequest();

  if (isLoading) {
    return (
      <div className="w-full mx-auto p-4 overflow-auto">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-8 w-20" />
        </div>
        <div className="mt-4 rounded-lg border bg-background shadow-sm p-6 space-y-4">
          <Skeleton className="h-10 w-1/4" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-4 overflow-auto">
      <div className="flex items-center justify-between">
        <RequestBreadcrumb />
        <SaveRequestButton />
      </div>
      <div className="mt-4 rounded-lg border bg-background shadow-sm">
        <RequestTopBar />
        <RequestTabs />
        <RequestResponse />
      </div>
    </div>
  );
}

export default Request;