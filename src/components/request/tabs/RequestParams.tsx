import React, { useEffect } from "react";
import { useRequest } from "@/context/RequestContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export default function RequestParams() {
  const { request, setRequest, edited, setEdited } = useRequest();
  const params = request.params || [];

  const updateRequestURL = (params: Array<Record<string, string>>) => {
    if (!request.url) return;

    try {
      const url = new URL(request.url);
      const baseURL = new URL(url.origin + url.pathname);

      console.log("Base URL:", baseURL);

      params.forEach((param) => {
        baseURL.searchParams.append(param.key, param.value);
      });
      setRequest((prev) => ({
        ...prev,
        url: baseURL.toString(),
      }));
    } catch (error) {}
  };

  const addParam = () => {
    const updatedParams = [...params, { key: "", value: "" }];
    setRequest((prev) => ({
      ...prev,
      params: updatedParams,
    }));
    updateRequestURL(params);
    if (!edited) setEdited(true);
  };

  const removeParam = (index: number) => {
    const updatedParams = params.filter((_, i) => i !== index);
    setRequest((prev) => ({
      ...prev,
      params: updatedParams,
    }));
    updateRequestURL(updatedParams);
    if (!edited) setEdited(true);
  };

  const updateParam = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const updatedParams = params.map((param, i) =>
      i === index ? { ...param, [field]: value } : param
    );
    setRequest((prev) => ({
      ...prev,
      params: updatedParams,
    }));
    updateRequestURL(updatedParams);
    if (!edited) setEdited(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          Query Parameters
        </h3>
        <Button variant="outline" size="sm" onClick={addParam}>
          <Plus className="h-4 w-4 mr-2" />
          Add Parameter
        </Button>
      </div>

      <div className="space-y-2">
        {params.length > 0 && (
          <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground mb-2">
            <div className="col-span-5">Key</div>
            <div className="col-span-6">Value</div>
            <div className="col-span-1"></div>
          </div>
        )}

        {params.map((param, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 items-center">
            <Input
              placeholder="Parameter key"
              value={param.key}
              onChange={(e) => updateParam(index, "key", e.target.value)}
              className="col-span-5"
            />
            <Input
              placeholder="Parameter value"
              value={param.value}
              onChange={(e) => updateParam(index, "value", e.target.value)}
              className="col-span-6"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeParam(index)}
              className="col-span-1 h-9 w-9"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {params.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No parameters added yet</p>
            <p className="text-sm">Click "Add Parameter" to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
