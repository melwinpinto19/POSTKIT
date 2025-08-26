export interface RequestType {
  name: string;
  method: RequestMethod;
  url: string;
  headers: Array<{ key: string; value: string }>;
  params: Array<{ key: string; value: string }>;
  body: { type: RequestBodyType; content: any };
  auth: AuthConfig;
}

export type RequestMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "OPTIONS";

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

export interface AuthConfig {
  type: AuthType;
  token: string;
  username: string;
  password: string;
  key: string;
  value: string;
  addTo: "header" | "query";
  clientId: string;
  clientSecret: string;
  accessTokenUrl: string;
  scope: string;
  realm: string;
}

export type AuthType = "none" | "bearer" | "basic" | "apikey" | "oauth2";
