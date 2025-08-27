import React from "react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export function Loader({ size = "md", className, text }: LoaderProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-muted border-t-primary",
          sizeClasses[size]
        )}
      />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}

interface FullScreenLoaderProps {
  text?: string;
  overlay?: boolean;
}

export function FullScreenLoader({ 
  text = "Loading...", 
  overlay = true 
}: FullScreenLoaderProps) {
  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center",
      overlay && "bg-background/80 backdrop-blur-sm"
    )} suppressHydrationWarning>
      <div className="flex flex-col items-center justify-center gap-4 p-8 rounded-lg bg-background/95 shadow-lg border">
        <div className="w-12 h-12 animate-spin rounded-full border-4 border-muted border-t-primary" />
        <div className="text-center space-y-1">
          <h3 className="font-medium text-foreground">{text}</h3>
          <p className="text-sm text-muted-foreground">Please wait a moment</p>
        </div>
      </div>
    </div>
  );
}

// Alternative animated loader with dots
export function DotLoader({ text }: { text?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center gap-4 p-8 rounded-lg bg-background/95 shadow-lg border">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
        </div>
        {text && (
          <p className="text-sm text-muted-foreground text-center">{text}</p>
        )}
      </div>
    </div>
  );
}

// Pulse loader
export function PulseLoader({ text }: { text?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center gap-4 p-8 rounded-lg bg-background/95 shadow-lg border">
        <div className="relative">
          <div className="w-12 h-12 bg-primary/20 rounded-full animate-ping"></div>
          <div className="absolute inset-0 w-12 h-12 bg-primary/40 rounded-full animate-pulse"></div>
          <div className="absolute inset-2 w-8 h-8 bg-primary rounded-full"></div>
        </div>
        {text && (
          <p className="text-sm text-muted-foreground text-center">{text}</p>
        )}
      </div>
    </div>
  );
}