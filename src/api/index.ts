export interface RequestOptions {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
  url: string;
  headers?: Record<string, string>;
  body?: {
    type: "raw" | "json" | "form";
    content: any;
  };
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

export class ApiClient {
  private formatSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  private prepareRequestBody(body?: RequestOptions["body"]): {
    processedBody: any;
    contentType?: string;
  } {
    if (!body || !body.content) {
      return { processedBody: null };
    }

    switch (body.type) {
      case "json":
        try {
          const jsonContent =
            typeof body.content === "string"
              ? JSON.parse(body.content)
              : body.content;
          return {
            processedBody: JSON.stringify(jsonContent),
            contentType: "application/json",
          };
        } catch (error) {
          throw new Error("Invalid JSON format in request body");
        }

      case "form":
        if (typeof body.content === "string") {
          // Parse form data from string format (key=value&key2=value2)
          const formData = new URLSearchParams();
          body.content.split("&").forEach((pair) => {
            const [key, value] = pair.split("=");
            if (key && value) {
              formData.append(
                decodeURIComponent(key),
                decodeURIComponent(value)
              );
            }
          });
          return {
            processedBody: formData,
            contentType: "application/x-www-form-urlencoded",
          };
        } else if (body.content instanceof FormData) {
          return { processedBody: body.content };
        } else {
          // Convert object to FormData
          const formData = new FormData();
          Object.entries(body.content).forEach(([key, value]) => {
            formData.append(key, value as string);
          });
          return { processedBody: formData };
        }

      case "raw":
      default:
        return {
          processedBody: body.content,
          contentType: "text/plain",
        };
    }
  }

  private async processResponse(
    response: Response,
    startTime: number
  ): Promise<ApiResponse> {
    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);

    // Get response headers
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const contentType = response.headers.get("content-type") || "";

    // Get response as blob first to handle all types
    const blob = await response.blob();
    const size = this.formatSize(blob.size);

    let data: any;

    // Process blob based on content type
    if (contentType.includes("application/json")) {
      const text = await blob.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    } else if (contentType.includes("text/")) {
      data = await blob.text();
    } else if (
      contentType.includes("image/") ||
      contentType.includes("video/") ||
      contentType.includes("audio/") ||
      contentType.includes("application/pdf")
    ) {
      // For binary content, convert to base64 or keep as blob URL
      data = {
        type: "binary",
        contentType,
        size: blob.size,
        blobUrl: URL.createObjectURL(blob),
      };
    } else {
      // For unknown content types, try to convert to text
      try {
        data = await blob.text();
      } catch {
        data = {
          type: "binary",
          contentType,
          size: blob.size,
          blobUrl: URL.createObjectURL(blob),
        };
      }
    }

    return {
      status: response.status,
      statusText: response.statusText,
      headers,
      data,
      responseTime,
      size,
      contentType,
    };
  }

  async sendRequest(options: RequestOptions): Promise<ApiResponse> {
    const startTime = performance.now();

    try {
      // Prepare request body
      const { processedBody, contentType } = this.prepareRequestBody(
        options.body
      );

      // Prepare headers
      const headers = new Headers(options.headers || {});

      // Set content-type if not already set and we have a body
      if (processedBody && contentType && !headers.has("content-type")) {
        headers.set("content-type", contentType);
      }

      // Make the request
      const response = await fetch(options.url, {
        method: options.method,
        headers,
        body: ["GET", "HEAD"].includes(options.method)
          ? undefined
          : processedBody,
      });

      return await this.processResponse(response, startTime);
    } catch (error) {
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);

      // Return error response in consistent format
      return {
        status: 0,
        statusText: "Network Error",
        headers: {},
        data: {
          error: true,
          message:
            error instanceof Error ? error.message : "Unknown error occurred",
          type: "network_error",
        },
        responseTime,
        size: "0 B",
        contentType: "application/json",
      };
    }
  }

  // Convenience methods for different HTTP verbs
  async get(
    url: string,
    options?: Omit<RequestOptions, "method" | "url">
  ): Promise<ApiResponse> {
    return this.sendRequest({ ...options, method: "GET", url });
  }

  async post(
    url: string,
    options?: Omit<RequestOptions, "method" | "url">
  ): Promise<ApiResponse> {
    return this.sendRequest({ ...options, method: "POST", url });
  }

  async put(
    url: string,
    options?: Omit<RequestOptions, "method" | "url">
  ): Promise<ApiResponse> {
    return this.sendRequest({ ...options, method: "PUT", url });
  }

  async delete(
    url: string,
    options?: Omit<RequestOptions, "method" | "url">
  ): Promise<ApiResponse> {
    return this.sendRequest({ ...options, method: "DELETE", url });
  }

  async patch(
    url: string,
    options?: Omit<RequestOptions, "method" | "url">
  ): Promise<ApiResponse> {
    return this.sendRequest({ ...options, method: "PATCH", url });
  }

  async head(
    url: string,
    options?: Omit<RequestOptions, "method" | "url">
  ): Promise<ApiResponse> {
    return this.sendRequest({ ...options, method: "HEAD", url });
  }

  async options(
    url: string,
    options?: Omit<RequestOptions, "method" | "url">
  ): Promise<ApiResponse> {
    return this.sendRequest({ ...options, method: "OPTIONS", url });
  }
}

// Export a default instance
export const apiClient = new ApiClient();

// Export helper functions
export const sendApiRequest = (
  options: RequestOptions
): Promise<ApiResponse> => {
  return apiClient.sendRequest(options);
};
