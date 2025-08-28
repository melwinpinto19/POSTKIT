"use client";
import React, { useState } from "react";
import TreeContextMenu from "@/components/sidebar/TreeContextMenu";
import { TreeItem } from "@/types/sidebar";
import { useRouter } from "next/navigation";

interface Request {
  _id: string;
  name: string;
  method: string;
  url: string;
}

interface TreeRequestProps {
  request: Request;
  folderId: string;
  collectionId: string;
  selectedItem: { type: string; id: string } | null;
  onSelect: (item: { type: TreeItem; id: string }) => void;
  onDelete: (type: TreeItem, id: string, parentId?: string) => void;
  onRename: (
    type: TreeItem,
    id: string,
    newName: string,
    parentId?: string
  ) => void;
}

const methodColors: Record<string, string> = {
  GET: "text-green-600",
  POST: "text-orange-600",
  PUT: "text-blue-600",
  DELETE: "text-red-600",
  PATCH: "text-purple-600",
  HEAD: "text-gray-600",
  OPTIONS: "text-yellow-600",
};

export default function TreeRequest({
  request,
  folderId,
  collectionId,
  selectedItem,
  onSelect,
  onDelete,
  onRename,
}: TreeRequestProps) {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    type: TreeItem;
    id: string;
    parentId?: string;
  } | null>(null);
  const router = useRouter();

  const isSelected =
    selectedItem?.type === "request" && selectedItem?.id === request._id;

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type: "request",
      id: request._id,
      parentId: folderId,
    });
  };

  const handleClick = () => {
    onSelect({ type: "request", id: request._id });
    router.push(`/home/requests/${request._id}`);
  };

  return (
    <>
      <div
        className={`flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer ml-6 ${
          isSelected ? "bg-muted" : ""
        }`}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span
            className={`text-xs font-mono font-semibold ${
              methodColors[request.method]
            } inline-block w-[37px]`}
          >
            {request.method}
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-sm truncate">{request.name}</div>
            <div className="text-xs text-muted-foreground truncate">
              {request.url}
            </div>
          </div>
        </div>
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
        />
      )}
    </>
  );
}
