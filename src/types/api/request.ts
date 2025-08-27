import { AuthConfig } from "../request";

export interface RequestBody {
  type: "raw" | "form" | "json";
  content: unknown;
}

export interface CreateRequestData {
  name: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
  url: string;
  headers?: { key: string; value: string }[];
  params?: { key: string; value: string }[];
  body?: RequestBody;
  auth?: AuthConfig;
  folder: string;
}

export interface UpdateRequestData {
  name?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
  url?: string;
  headers?: { key: string; value: string }[];
  params?: { key: string; value: string }[];
  body?: RequestBody;
  auth?: AuthConfig;
}
