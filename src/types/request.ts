export interface RequestType {
  method: RequestMethod;
  url: string;
  headers: Array<{ key: string; value: string }>;
  params: Array<{ key: string; value: string }>;
  body: { type: RequestBodyType; content: any };
}

export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";

export type RequestBodyType = "raw" | "json" | "form";

export interface ResponseData {
  status: number;
  statusText: string;
  data: any;
  headers: Record<string, string>;
  responseTime?: number;
  size?: string;
}

export interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  responseTime: number;
  size: string;
  contentType: string;
}