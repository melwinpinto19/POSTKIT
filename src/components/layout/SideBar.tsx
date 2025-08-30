import React, { useRef } from "react";
import { Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import TreeCollection from "@/components/sidebar/TreeCollection";
import useSideBar from "@/hooks/useSideBar";

export default function Sidebar() {
  const {
    isLoading,
    collections,
    error,
    handleCreateCollection,
    handleCreateFolder,
    handleCreateRequest,
    handleDelete,
    handleRename,
    selectedItem,
    setSelectedItem,
    fileInputRef,
    handleImportClick,
    handleFileSelect,
  } = useSideBar();

  return (
    <div className="w-80 min-w-80 border-r bg-background h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-lg">Collections</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCreateCollection}
            className="h-8 w-8"
            disabled={isLoading}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Import Collection Button */}
        <Button
          variant="outline"
          onClick={handleImportClick}
          disabled={isLoading}
          className="w-full justify-center gap-2 h-9 text-sm font-medium border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
        >
          <Upload className="h-4 w-4" />
          <span>Import Collection</span>
        </Button>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Tree Structure */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <SidebarSkeleton />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <div className="text-muted-foreground mb-4">
              <p className="font-medium">Failed to load collections</p>
              <p className="text-sm">{error}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => {}}>
              Try Again
            </Button>
          </div>
        ) : collections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="text-muted-foreground mb-4">
              <p className="font-medium">No collections yet</p>
              <p className="text-sm">
                Create your first collection to get started
              </p>
            </div>
            <Button variant="outline" onClick={handleCreateCollection}>
              <Plus className="h-4 w-4 mr-2" />
              Create Collection
            </Button>
          </div>
        ) : (
          <div className="space-y-1">
            {collections.map((collection) => (
              <TreeCollection
                key={collection._id}
                collection={collection}
                selectedItem={selectedItem}
                onSelect={setSelectedItem}
                onCreateFolder={handleCreateFolder}
                onCreateRequest={handleCreateRequest}
                onDelete={handleDelete}
                onRename={handleRename}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleCreateCollection}
          disabled={isLoading}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Collection
        </Button>
      </div>
    </div>
  );
}

// Skeleton Loading Component
function SidebarSkeleton() {
  return (
    <div className="space-y-3">
      {/* Collection Skeletons */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          {/* Collection Item */}
          <div className="flex items-center gap-2 px-2 py-1.5">
            <Skeleton className="h-4 w-4" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-6 w-6" />
          </div>

          {/* Folder Skeletons */}
          <div className="ml-4 space-y-2">
            {[1, 2].map((j) => (
              <div key={j} className="space-y-1">
                {/* Folder Item */}
                <div className="flex items-center gap-2 px-2 py-1.5">
                  <Skeleton className="h-4 w-4" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                  <Skeleton className="h-6 w-6" />
                </div>

                {/* Request Skeletons */}
                <div className="ml-6 space-y-1">
                  {[1, 2].map((k) => (
                    <div
                      key={k}
                      className="flex items-center gap-2 px-2 py-1.5"
                    >
                      <Skeleton className="h-4 w-8" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-3 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
