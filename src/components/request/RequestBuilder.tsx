import React from "react";
import { RequestProvider } from "@/context/RequestContext";
import RequestBreadcrumb from "@/components/request/RequestBreadcrumb";
import RequestTopBar from "@/components/request/RequestTopBar";
import RequestTabs from "./tabs/RequestTabs";
import RequestResponse from "./RequestResponse";
import SaveRequestButton from "./SaveRequest";
import Request from "./Request";

export default function RequestBuilder({ id }: { id: string }) {
  return (
    <RequestProvider id={id}>
      <Request />
    </RequestProvider>
  );
}
