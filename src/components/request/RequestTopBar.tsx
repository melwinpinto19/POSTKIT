import React from "react";
import { useRequest } from "@/context/RequestContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send } from "lucide-react";
import { RequestMethod } from "@/types/request";
import axios, { AxiosError } from "axios";
import { sendApiRequest } from "@/api";

const httpMethods: { value: RequestMethod; color: string }[] = [
  { value: "GET", color: "text-green-600" },
  { value: "POST", color: "text-orange-600" },
  { value: "PUT", color: "text-blue-600" },
  { value: "DELETE", color: "text-red-600" },
  { value: "PATCH", color: "text-purple-600" },
  { value: "HEAD", color: "text-gray-600" },
  { value: "OPTIONS", color: "text-yellow-600" },
];

export default function RequestTopBar() {
  const { request, setRequest, setResponse } = useRequest();

  // const handleSend = async () => {
  //   console.log("Sending request:", request);
  //   // Implement request sending logic here
  //   const params: Record<string, string> = {};
  //   request.params.forEach((param) => {
  //     params[param.key] = param.value;
  //   });

  //   const headers: Record<string, string> = {};
  //   request.headers.forEach((header) => {
  //     headers[header.key] = header.value;
  //   });

  //   const startTime = Date.now();
  //   try {
  //     const response = await axios.get(request.url, {
  //       params,
  //       headers,
  //     });
  //     setResponse({
  //       status: response.status,
  //       statusText: response.statusText,
  //       headers: response.headers as Record<string, string>,
  //       data: response.data,
  //       responseTime: Date.now() - startTime,
  //     });
  //     console.log({
  //       status: response.status,
  //       statusText: response.statusText,
  //       headers: response.headers as Record<string, string>,
  //       data: response.data,
  //       responseTime: Date.now() - startTime,
  //     });
  //   } catch (error) {
  //     if (error instanceof AxiosError) {
  //       setResponse({
  //         status: error.response?.status || 500,
  //         statusText: error.response?.statusText || "Internal Server Error",
  //         headers: error.response?.headers as Record<string, string>,
  //         data: error.response?.data,
  //         responseTime: Date.now() - startTime,
  //       });
  //     }
  //   }
  // };

  const handleSend = async () => {
    const transformedHeaders: Record<string, string> = {};

    request.headers.forEach(({ key, value }) => {
      transformedHeaders[key] = value;
    });

    const response = await sendApiRequest({
      method: request.method,
      url: request.url,
      headers: transformedHeaders,
      body: request.body,
    });

    setResponse(response);

    console.log(response);
  };

  const handleMethodChange = (method: string) => {
    setRequest((prev) => ({
      ...prev,
      method: method as RequestMethod,
    }));
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRequest((prev) => ({
      ...prev,
      url: e.target.value,
    }));
    updateParams(e.target.value);
  };

  const updateParams = (requestURL: string) => {
    try {
      const url = new URL(requestURL);

      const searchParams = Object.fromEntries(url.searchParams);

      const transformedParams = Object.keys(searchParams).map((key) => ({
        key,
        value: searchParams[key],
      }));

      setRequest((prev) => ({
        ...prev,
        params: transformedParams,
      }));

      console.log("Search params:", transformedParams);
    } catch (error) {
      console.error("Error updating params:", error);
    }
  };

  const currentMethod = httpMethods.find((m) => m.value === request.method);

  return (
    <div className="flex items-center gap-3 p-4 border-b bg-muted/30">
      {/* Method Dropdown */}
      <Select value={request.method} onValueChange={handleMethodChange}>
        <SelectTrigger className="w-32">
          <SelectValue>
            <span className={currentMethod?.color || "text-foreground"}>
              {request.method}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {httpMethods.map((method) => (
            <SelectItem key={method.value} value={method.value}>
              <span className={method.color}>{method.value}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* URL Input */}
      <Input
        type="url"
        placeholder="Enter request URL"
        value={request.url}
        onChange={handleUrlChange}
        className="flex-1"
      />

      {/* Send Button */}
      <Button onClick={handleSend} className="flex items-center gap-2">
        <Send className="h-4 w-4" />
        Send
      </Button>
    </div>
  );
}
