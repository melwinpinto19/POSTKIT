import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Zap,
  Download,
  Eye,
  Image,
  FileText,
  Video,
  Music,
} from "lucide-react";
import { useTheme } from "next-themes";
import ReactJson from "react-json-view";
import { useRequest } from "@/context/RequestContext";
import JsonPreviewEditor from "./shared/JsonPreviewEditor";
import JsonEditor from "./shared/JsonEditor";

export default function RequestResponse() {
  const { theme } = useTheme();
  const { isResponseLoading: isLoading, response } = useRequest();

  const renderPreview = (data: any, contentType: string) => {
    // Handle binary/blob data
    if (
      data &&
      typeof data === "object" &&
      data.type === "binary" &&
      data.blobUrl
    ) {
      return <BinaryPreview data={data} contentType={contentType} />;
    }

    // Handle JSON data
    if (typeof data === "object" && data !== null && !data.type) {
      return <JsonEditor value={JSON.stringify(data, null, 2)} editing={false} />;
    }

    // Handle text/plain, HTML, XML, etc.
    if (typeof data === "string") {
      if (contentType.includes("text/html")) {
        return <HtmlPreview data={data} />;
      }

      if (
        contentType.includes("application/xml") ||
        contentType.includes("text/xml")
      ) {
        return <XmlPreview data={data} />;
      }

      if (contentType.includes("text/css")) {
        return <CodePreview data={data} language="css" />;
      }

      if (
        contentType.includes("application/javascript") ||
        contentType.includes("text/javascript")
      ) {
        return <CodePreview data={data} language="javascript" />;
      }

      // Default text preview
      return <TextPreview data={data} />;
    }

    // Fallback for unknown data types
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>Unable to preview this response</p>
        <p className="text-sm">Content Type: {contentType}</p>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-background shadow-sm">
        <div className="p-4 border-b bg-muted/30">
          <div className="flex items-center gap-2">
            <div className="h-6 w-16 bg-muted animate-pulse rounded" />
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <div className="p-4">
          <div className="h-32 bg-muted animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="rounded-lg border bg-background shadow-sm">
        <div className="p-4 border-b bg-muted/30">
          <h3 className="text-sm font-medium text-muted-foreground">
            Response
          </h3>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium">No Response Yet</p>
            <p className="text-sm">Send a request to see the response here</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300)
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
    if (status >= 300 && status < 400)
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800";
    if (status >= 400 && status < 500)
      return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800";
    if (status >= 500)
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
    return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800";
  };

  return (
    <div className="rounded-lg border bg-background shadow-sm">
      {/* Response Header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <div className="flex items-center gap-3">
          <Badge className={`${getStatusColor(response.status)} font-mono`}>
            {response.status} {response.statusText}
          </Badge>
          {response.responseTime && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {response.responseTime}ms
            </div>
          )}
          {response.size && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Zap className="h-4 w-4" />
              {response.size}
            </div>
          )}
        </div>
      </div>

      {/* Response Content */}
      <div className="p-4">
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="raw">Raw</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-4">
            <ScrollArea className="h-[400px] w-full rounded border">
              <div className="p-4">
                {renderPreview(response.data, response.contentType)}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="raw" className="mt-4">
            <ScrollArea className="h-[400px] w-full rounded border">
              <pre className="p-4 text-sm font-mono whitespace-pre-wrap text-foreground">
                {typeof response.data === "object" && response.data !== null
                  ? JSON.stringify(response.data, null, 2)
                  : response.data}
              </pre>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="headers" className="mt-4">
            <ScrollArea className="h-[400px] w-full rounded border">
              <div className="p-4 space-y-2">
                {response.headers ? (
                  Object.entries(response.headers).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-3 gap-4 text-sm">
                      <div className="font-medium text-muted-foreground">
                        {key}:
                      </div>
                      <div className="col-span-2 font-mono break-all">
                        {value}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No headers available</p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Binary Preview Component
function BinaryPreview({
  data,
  contentType,
}: {
  data: any;
  contentType: string;
}) {
  const downloadFile = () => {
    const link = document.createElement("a");
    link.href = data.blobUrl;
    link.download = `response.${getFileExtension(contentType)}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileExtension = (contentType: string) => {
    const extensions: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "image/svg+xml": "svg",
      "application/pdf": "pdf",
      "video/mp4": "mp4",
      "audio/mpeg": "mp3",
      "text/csv": "csv",
    };
    return extensions[contentType] || "bin";
  };

  if (contentType.startsWith("image/")) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Image className="h-4 w-4" />
          Image Preview
        </div>
        <div className="flex flex-col items-center space-y-4">
          <img
            src={data.blobUrl}
            alt="Response"
            className="max-w-full max-h-80 object-contain rounded border"
          />
          <Button onClick={downloadFile} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download Image
          </Button>
        </div>
      </div>
    );
  }

  if (contentType.startsWith("video/")) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Video className="h-4 w-4" />
          Video Preview
        </div>
        <div className="flex flex-col items-center space-y-4">
          <video
            src={data.blobUrl}
            controls
            className="max-w-full max-h-80 rounded border"
          />
          <Button onClick={downloadFile} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download Video
          </Button>
        </div>
      </div>
    );
  }

  if (contentType.startsWith("audio/")) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Music className="h-4 w-4" />
          Audio Preview
        </div>
        <div className="flex flex-col items-center space-y-4">
          <audio src={data.blobUrl} controls className="w-full max-w-md" />
          <Button onClick={downloadFile} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download Audio
          </Button>
        </div>
      </div>
    );
  }

  if (contentType === "application/pdf") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          PDF Document
        </div>
        <div className="flex flex-col items-center space-y-4">
          <iframe
            src={data.blobUrl}
            className="w-full h-80 border rounded"
            title="PDF Preview"
          />
          <Button onClick={downloadFile} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>
    );
  }

  // Generic binary file
  return (
    <div className="space-y-4 text-center">
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <FileText className="h-4 w-4" />
        Binary File ({contentType})
      </div>
      <p className="text-sm">Size: {formatBytes(data.size)}</p>
      <Button onClick={downloadFile} variant="outline" size="sm">
        <Download className="h-4 w-4 mr-2" />
        Download File
      </Button>
    </div>
  );
}

// HTML Preview Component
function HtmlPreview({ data }: { data: string }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Eye className="h-4 w-4" />
        HTML Preview
      </div>
      <iframe
        srcDoc={data}
        className="w-full h-80 border rounded"
        title="HTML Preview"
        sandbox="allow-same-origin"
      />
    </div>
  );
}

// XML Preview Component
function XmlPreview({ data }: { data: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <FileText className="h-4 w-4" />
        XML Content
      </div>
      <pre className="text-sm font-mono whitespace-pre-wrap bg-muted/50 p-3 rounded">
        {data}
      </pre>
    </div>
  );
}

// Code Preview Component
function CodePreview({ data, language }: { data: string; language: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <FileText className="h-4 w-4" />
        {language.toUpperCase()} Code
      </div>
      <pre className="text-sm font-mono whitespace-pre-wrap bg-muted/50 p-3 rounded">
        {data}
      </pre>
    </div>
  );
}

// Text Preview Component
function TextPreview({ data }: { data: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <FileText className="h-4 w-4" />
        Text Content
      </div>
      <pre className="text-sm whitespace-pre-wrap text-foreground">{data}</pre>
    </div>
  );
}

// Utility function
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
