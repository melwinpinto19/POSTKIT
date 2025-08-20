import React from "react";
import { useRequest } from "@/context/RequestContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, Shield, User, Lock } from "lucide-react";
import { AuthConfig, AuthType } from "@/types/request";

export default function RequestAuth() {
  const { request, setRequest } = useRequest();

  // Get auth config from request or initialize with default
  const authConfig: AuthConfig = (request as any).auth || { type: "none" };

  const updateAuth = (updates: Partial<AuthConfig>) => {
    setRequest((prev) => ({
      ...prev,
      auth: { ...authConfig, ...updates },
    }));
  };

  const authTypes = [
    { value: "none", label: "No Auth", icon: Shield },
    { value: "bearer", label: "Bearer Token", icon: Key },
    { value: "basic", label: "Basic Auth", icon: User },
    { value: "apikey", label: "API Key", icon: Lock },
    { value: "oauth2", label: "OAuth 2.0", icon: Shield },
  ];

  const renderAuthFields = () => {
    switch (authConfig.type) {
      case "bearer":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bearer-token">Token</Label>
              <Input
                id="bearer-token"
                type="password"
                placeholder="Enter your bearer token"
                value={authConfig.token || ""}
                onChange={(e) => updateAuth({ token: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                The token will be sent as "Authorization: Bearer {"{token}"}"
              </p>
            </div>
          </div>
        );

      case "basic":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="basic-username">Username</Label>
                <Input
                  id="basic-username"
                  placeholder="Enter username"
                  value={authConfig.username || ""}
                  onChange={(e) => updateAuth({ username: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="basic-password">Password</Label>
                <Input
                  id="basic-password"
                  type="password"
                  placeholder="Enter password"
                  value={authConfig.password || ""}
                  onChange={(e) => updateAuth({ password: e.target.value })}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Credentials will be base64 encoded and sent as "Authorization:
              Basic {"{encoded}"}"
            </p>
          </div>
        );

      case "apikey":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">Key</Label>
              <Input
                id="api-key"
                placeholder="e.g., X-API-Key, api_key"
                value={authConfig.key || ""}
                onChange={(e) => updateAuth({ key: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-value">Value</Label>
              <Input
                id="api-value"
                type="password"
                placeholder="Enter your API key"
                value={authConfig.value || ""}
                onChange={(e) => updateAuth({ value: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-addto">Add to</Label>
              <Select
                value={authConfig.addTo || "header"}
                onValueChange={(value: "header" | "query") =>
                  updateAuth({ addTo: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="header">Header</SelectItem>
                  <SelectItem value="query">Query Params</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "oauth2":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="oauth-client-id">Client ID</Label>
                <Input
                  id="oauth-client-id"
                  placeholder="Enter client ID"
                  value={authConfig.clientId || ""}
                  onChange={(e) => updateAuth({ clientId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="oauth-client-secret">Client Secret</Label>
                <Input
                  id="oauth-client-secret"
                  type="password"
                  placeholder="Enter client secret"
                  value={authConfig.clientSecret || ""}
                  onChange={(e) => updateAuth({ clientSecret: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="oauth-token-url">Access Token URL</Label>
              <Input
                id="oauth-token-url"
                placeholder="https://oauth.example.com/token"
                value={authConfig.accessTokenUrl || ""}
                onChange={(e) => updateAuth({ accessTokenUrl: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="oauth-scope">Scope (Optional)</Label>
              <Input
                id="oauth-scope"
                placeholder="read write"
                value={authConfig.scope || ""}
                onChange={(e) => updateAuth({ scope: e.target.value })}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              OAuth 2.0 Client Credentials flow
            </p>
          </div>
        );
      
        default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No authentication required</p>
            <p className="text-sm">
              This request will be sent without authentication
            </p>
          </div>
        );
    }
  };

  const currentAuthType = authTypes.find(
    (type) => type.value === authConfig.type
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          Authorization
        </h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="auth-type">Type</Label>
          <Select
            value={authConfig.type}
            onValueChange={(value: AuthType) => updateAuth({ type: value })}
          >
            <SelectTrigger>
              <SelectValue>
                <div className="flex items-center gap-2">
                  {currentAuthType && (
                    <>
                      <currentAuthType.icon className="h-4 w-4" />
                      {currentAuthType.label}
                    </>
                  )}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {authTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    <type.icon className="h-4 w-4" />
                    {type.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card className="border-dashed">
          <CardContent className="pt-6">{renderAuthFields()}</CardContent>
        </Card>
      </div>
    </div>
  );
}
