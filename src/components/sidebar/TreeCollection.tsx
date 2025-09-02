import React, { useState } from "react";
import { ChevronDown, ChevronRight, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import TreeFolder from "@/components/sidebar/TreeFolder";
import TreeContextMenu from "@/components/sidebar/TreeContextMenu";
import { Collection, Folder, Request, TreeItem } from "@/types/sidebar";
import { usePathname, useRouter } from "next/navigation";

interface TreeCollectionProps {
  collection: Collection;
  selectedItem: { type: TreeItem; id: string } | null;
  onSelect: (item: { type: TreeItem; id: string }) => void;
  onCreateFolder: (collectionId: string) => void;
  onCreateRequest: (collectionId: string, folderId: string) => void;
  onDelete: (type: TreeItem, id: string, parentId?: string) => void;
  onRename: (
    type: TreeItem,
    id: string,
    newName: string,
    parentId?: string
  ) => void;
}

export default function TreeCollection({
  collection,
  selectedItem,
  onSelect,
  onCreateFolder,
  onCreateRequest,
  onDelete,
  onRename,
}: TreeCollectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    type: TreeItem;
    id: string;
    parentId?: string;
  } | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const isSelected = pathname === `/home/collections/${collection._id}`;

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type: "collection",
      id: collection._id,
    });
  };

  const handleClick = () => {
    router.push(`/home/collections/${collection._id}`);
    // onSelect({ type: "collection", id: collection._id });
  };

  const handleCreateFolder = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCreateFolder(collection._id);
  };

  return (
    <>
      <div className="space-y-1">
        {/* Collection Item */}
        <div
          className={`flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer group ${
            isSelected ? "bg-muted" : ""
          }`}
          onClick={handleClick}
          onContextMenu={handleContextMenu}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-0.5 hover:bg-muted-foreground/10 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">
              {collection.name}
            </div>
            {collection.description && (
              <div className="text-xs text-muted-foreground truncate">
                {collection.description}
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100"
            onClick={handleCreateFolder}
          >
            <FolderPlus className="h-3 w-3" />
          </Button>
        </div>

        {/* Folders */}
        {isExpanded && (
          <div className="ml-4 space-y-1">
            {collection.folders.map((folder) => (
              <TreeFolder
                key={folder._id}
                folder={folder}
                collectionId={collection._id}
                selectedItem={selectedItem}
                onSelect={onSelect}
                onCreateRequest={onCreateRequest}
                onDelete={onDelete}
                onRename={onRename}
              />
            ))}
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <TreeContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          type={contextMenu.type}
          id={contextMenu.id}
          parentId={contextMenu.parentId}
          onClose={() => setContextMenu(null)}
          onDelete={onDelete}
          onRename={onRename}
          onCreateFolder={onCreateFolder}
          onCreateRequest={onCreateRequest}
        />
      )}
    </>
  );
}
