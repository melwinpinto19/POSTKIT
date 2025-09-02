import React, { useState } from "react";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import TreeRequest from "@/components/sidebar/TreeRequest";
import TreeContextMenu from "@/components/sidebar/TreeContextMenu";
import { TreeItem } from "@/types/sidebar";
import { usePathname, useRouter } from "next/navigation";

interface Request {
  _id: string;
  name: string;
  method: string;
  url: string;
}

interface Folder {
  _id: string;
  name: string;
  requests: Request[];
}

interface TreeFolderProps {
  folder: Folder;
  collectionId: string;
  selectedItem: { type: string; id: string } | null;
  onSelect: (item: { type: TreeItem; id: string }) => void;
  onCreateRequest: (collectionId: string, folderId: string) => void;
  onDelete: (type: TreeItem, id: string, parentId?: string) => void;
  onRename: (
    type: TreeItem,
    id: string,
    newName: string,
    parentId?: string
  ) => void;
}

export default function TreeFolder({
  folder,
  collectionId,
  selectedItem,
  onSelect,
  onCreateRequest,
  onDelete,
  onRename,
}: TreeFolderProps) {
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

  const isSelected = pathname === `/home/folders/${folder._id}`;

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type: "folder",
      id: folder._id,
      parentId: collectionId,
    });
  };

  const handleClick = () => {
    router.push(`/home/folders/${folder._id}`);
    // onSelect({ type: "folder", id: folder._id });
  };

  const handleCreateRequest = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCreateRequest(collectionId, folder._id);
  };

  return (
    <>
      <div className="space-y-1">
        {/* Folder Item */}
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
            <div className="font-medium text-sm truncate">{folder.name}</div>
            <div className="text-xs text-muted-foreground">
              {folder.requests.length} request
              {folder.requests.length !== 1 ? "s" : ""}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100"
            onClick={handleCreateRequest}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        {/* Requests */}
        {isExpanded && (
          <div className="ml-4 space-y-1">
            {folder.requests.map((request) => (
              <TreeRequest
                key={request._id}
                request={request}
                folderId={folder._id}
                collectionId={collectionId}
                selectedItem={selectedItem}
                onSelect={onSelect}
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
          onCreateRequest={(collectionId, folderId) =>
            onCreateRequest(collectionId, folderId || folder._id)
          }
        />
      )}
    </>
  );
}
