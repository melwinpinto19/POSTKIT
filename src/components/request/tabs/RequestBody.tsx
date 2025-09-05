"use client";
import React from "react";
import { useRequest } from "@/context/RequestContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RequestBodyType } from "@/types/request";
import JsonEditor from "../shared/JsonEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RequestBody() {
  const { request, setRequest, edited, setEdited } = useRequest();
  const body = request.body || { raw: "", form: [], json: "" };
  const type = request.selectedBodyType;

  const updateBodyType = (type: string) => {
    setRequest((prev) => ({
      ...prev,
      selectedBodyType: type as RequestBodyType,
    }));
    if (!edited) setEdited(true);
  };

  const updateBodyContent = (type: string, content: any) => {
    setRequest((prev) => ({
      ...prev,
      body: { ...body, [type]: content },
    }));
    if (!edited) setEdited(true);
  };

  // Form Data Handlers
  const handleFormChange = (idx: number, field: "key" | "value", value: string) => {
    const updated = body.form.map((item: { key: string; value: string }, i: number) =>
      i === idx ? { ...item, [field]: value } : item
    );
    updateBodyContent("form", updated);
  };

  const handleAddFormRow = () => {
    updateBodyContent("form", [...body.form, { key: "", value: "" }]);
  };

  const handleRemoveFormRow = (idx: number) => {
    updateBodyContent(
      "form",
      body.form.filter((_: any, i: number) => i !== idx)
    );
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
          <textarea
            placeholder="Enter raw body content..."
            value={body.raw}
            onChange={(e) => updateBodyContent("raw", e.target.value)}
            className="min-h-[200px] font-mono w-full border rounded-md p-2"
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
          <div className="space-y-2">
            {Array.isArray(body.form) &&
              body.form.map(
                (item: { key: string; value: string }, idx: number) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <Input
                      placeholder="Key"
                      value={item.key}
                      onChange={(e) =>
                        handleFormChange(idx, "key", e.target.value)
                      }
                      className="w-1/3"
                    />
                    <Input
                      placeholder="Value"
                      value={item.value}
                      onChange={(e) =>
                        handleFormChange(idx, "value", e.target.value)
                      }
                      className="w-1/2"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFormRow(idx)}
                      className="text-destructive"
                      type="button"
                    >
                      Remove
                    </Button>
                  </div>
                )
              )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddFormRow}
              type="button"
              className="mt-2"
            >
              Add Row
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Enter form data as key-value pairs
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}