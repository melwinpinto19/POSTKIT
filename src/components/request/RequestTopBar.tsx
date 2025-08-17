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
  const { request, setRequest } = useRequest();

  const handleSend = () => {
    console.log("Sending request:", request);
    // Implement request sending logic here
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