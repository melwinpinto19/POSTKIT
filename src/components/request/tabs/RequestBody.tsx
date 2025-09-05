"use client";
import React from "react";
import { useRequest } from "@/context/RequestContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RequestBodyType } from "@/types/request";
import JsonEditor from "../shared/JsonEditor";

export default function RequestBody() {
  const { request, setRequest, edited, setEdited } = useRequest();
  const body = request.body || { raw: "", form: "", json: "" };
  const type = request.selectedBodyType;

  const updateBodyType = (type: string) => {
    setRequest((prev) => ({
      ...prev,
      selectedBodyType: type as RequestBodyType,
    }));
    if (!edited) setEdited(true);
  };

  const updateBodyContent = (type: string, content: string) => {
    setRequest((prev) => ({
      ...prev,
      body: { ...body, [type]: content },
    }));
    if (!edited) setEdited(true);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium text-muted-foreground">
          Request Body
        </Label>
      </div>

      <Tabs value={type} onValueChange={updateBodyType} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="raw">Raw</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>
          <TabsTrigger value="form">Form Data</TabsTrigger>
        </TabsList>

        <TabsContent value="raw" className="mt-4">
          <Textarea
            placeholder="Enter raw body content..."
            value={body.raw}
            onChange={(e) => updateBodyContent("raw", e.target.value)}
            className="min-h-[200px] font-mono"
          />
        </TabsContent>

        <TabsContent value="json" className="mt-4">
          <JsonEditor
            value={body.json}
            onChange={(value) => {
              updateBodyContent("json", value);
            }}
          />

          <p className="text-xs text-muted-foreground mt-2">
            Enter valid JSON content
          </p>
        </TabsContent>

        <TabsContent value="form" className="mt-4">
          <Textarea
            placeholder="key1=value1&key2=value2"
            value={""}
            onChange={(e) => updateBodyContent("form", e.target.value)}
            className="min-h-[200px]"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Enter form data in key=value format separated by &
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
