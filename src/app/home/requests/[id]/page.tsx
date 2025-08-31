"use client";
import RequestBuilder from "@/components/request/RequestBuilder";
import { useParams } from "next/navigation";
import React from "react";

function Page() {
  const { id } = useParams();
  return <RequestBuilder id={id as string} />;
}

export default Page;
