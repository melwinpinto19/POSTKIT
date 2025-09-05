import { AuthConfig, RequestBodyType } from "../request";



export interface CreateRequestData {
  name: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
  url: string;
  headers?: { key: string; value: string }[];
  params?: { key: string; value: string }[];
  body?: RequestBodyType;
  auth?: AuthConfig;
  folder: string;
}

export interface UpdateRequestData {
  name?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
  url?: string;
  headers?: { key: string; value: string }[];
  params?: { key: string; value: string }[];
  body?: RequestBodyType;
  auth?: AuthConfig;
}
