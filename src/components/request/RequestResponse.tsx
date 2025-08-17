import React, { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Zap } from "lucide-react";
import JsonPreviewEditor from "./shared/JsonPreviewEditor";
import { useRequest } from "@/context/RequestContext";


export default function RequestResponse() {
  const { isResponseLoading, response } = useRequest();

  if (isResponseLoading) {
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

  const isJsonData = (data: any) => {
    return typeof data === "object" && data !== null;
  };

  return (
    <div className="rounded-lg border bg-background shadow-sm">
      {/* Response Header - matches RequestTopBar style */}
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

      {/* Response Content - matches RequestTabs style */}
      <div className="p-4">
        <Tabs defaultValue="body" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="body">Response Body</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
          </TabsList>

          <TabsContent value="body" className="mt-4">
            <ScrollArea className="h-[400px] w-full rounded border">
              <div className="p-4">
                {response.headers["content-type"] == "application/json" ? (
                  <JsonPreviewEditor json={response.data} edit={false} />
                ) : (
                  <pre className="text-sm font-mono whitespace-pre-wrap text-foreground">
                    {/* {response.data} */}
                  </pre>
                )}
              </div>
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
                      <div className="col-span-2 font-mono">{value}</div>
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
