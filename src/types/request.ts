export interface RequestType {
  method: RequestMethod;
  url: string;
  headers: Array<{ key: string; value: string }>;
  params: Array<{ key: string; value: string }>;
  body: { type: RequestBodyType; content: any };
}

export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";

export type RequestBodyType = "raw" | "json" | "form";
