import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RequestHeaders from "./RequestHeaders";
import RequestParams from "./RequestParams";
import RequestBody from "./RequestBody";

export default function RequestTabs() {
  return (
    <div className="p-4">
      <Tabs defaultValue="params" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="params">Params</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="body">Body</TabsTrigger>
        </TabsList>

        <TabsContent value="params" className="mt-4">
          <RequestParams />
        </TabsContent>

        <TabsContent value="headers" className="mt-4">
          <RequestHeaders />
        </TabsContent>

        <TabsContent value="body" className="mt-4">
          <RequestBody />
        </TabsContent>
      </Tabs>
    </div>
  );
}
