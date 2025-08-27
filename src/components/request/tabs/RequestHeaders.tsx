import React from "react";
import { useRequest } from "@/context/RequestContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export default function RequestHeaders() {
  const { request, setRequest, edited, setEdited } = useRequest();
  const headers = request.headers || [];

  const addHeader = () => {
    setRequest((prev) => ({
      ...prev,
      headers: [...headers, { key: "", value: "" }],
    }));

    if (!edited) setEdited(true);
  };

  const removeHeader = (index: number) => {
    setRequest((prev) => ({
      ...prev,
      headers: headers.filter((_, i) => i !== index),
    }));

    if (!edited) setEdited(true);
  };

  const updateHeader = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    setRequest((prev) => ({
      ...prev,
      headers: headers.map((header, i) =>
        i === index ? { ...header, [field]: value } : header
      ),
    }));

    if (!edited) setEdited(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          Request Headers
        </h3>
        <Button variant="outline" size="sm" onClick={addHeader}>
          <Plus className="h-4 w-4 mr-2" />
          Add Header
        </Button>
      </div>

      <div className="space-y-2">
        {headers.length > 0 && (
          <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground mb-2">
            <div className="col-span-5">Key</div>
            <div className="col-span-6">Value</div>
            <div className="col-span-1"></div>
          </div>
        )}

        {headers.map((header, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 items-center">
            <Input
              placeholder="Header name"
              value={header.key}
              onChange={(e) => updateHeader(index, "key", e.target.value)}
              className="col-span-5"
            />
            <Input
              placeholder="Header value"
              value={header.value}
              onChange={(e) => updateHeader(index, "value", e.target.value)}
              className="col-span-6"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeHeader(index)}
              className="col-span-1 h-9 w-9"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {headers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No headers added yet</p>
            <p className="text-sm">Click "Add Header" to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
