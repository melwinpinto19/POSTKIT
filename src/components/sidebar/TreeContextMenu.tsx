import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Trash2, Edit3, FolderPlus, Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TreeItem } from "@/types/sidebar";
import { Button } from "@/components/ui/button";

interface TreeContextMenuProps {
  x: number;
  y: number;
  type: TreeItem;
  id: string;
  parentId?: string;
  onClose: () => void;
  onDelete: (type: TreeItem, id: string, parentId?: string) => void;
  onRename: (
    type: TreeItem,
    id: string,
    newName: string,
    parentId?: string
  ) => void;
  onCreateFolder?: (collectionId: string) => void;
  onCreateRequest?: (collectionId: string, folderId: string) => void;
}

export default function TreeContextMenu({
  x,
  y,
  type,
  id,
  parentId,
  onClose,
  onDelete,
  onRename,
  onCreateFolder,
  onCreateRequest,
}: TreeContextMenuProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only close if dialog is not open
      if (!showDeleteDialog && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, showDeleteDialog]);

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isRenaming]);

  const handleRename = () => {
    setIsRenaming(true);
  };

  const handleRenameSubmit = () => {
    if (newName.trim()) {
      onRename(type, id, newName.trim(), parentId);
      onClose();
    }
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRenameSubmit();
    } else if (e.key === "Escape") {
      setIsRenaming(false);
      setNewName("");
    }
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(type, id, parentId);
    setShowDeleteDialog(false);
    onClose();
  };

  const handleCreateFolder = () => {
    if (onCreateFolder) {
      onCreateFolder(id);
      onClose();
    }
  };

  const handleCreateRequest = () => {
    if (onCreateRequest) {
      onCreateRequest(parentId || id, id);
      onClose();
    }
  };

  const getDeleteTitle = () => {
    switch (type) {
      case "collection":
        return "Delete Collection";
      case "folder":
        return "Delete Folder";
      case "request":
        return "Delete Request";
      default:
        return "Delete Item";
    }
  };

  const getDeleteDescription = () => {
    switch (type) {
      case "collection":
        return "This action cannot be undone. This will permanently delete the collection and all its folders and requests.";
      case "folder":
        return "This action cannot be undone. This will permanently delete the folder and all its requests.";
      case "request":
        return "This action cannot be undone. This will permanently delete this request.";
      default:
        return "This action cannot be undone.";
    }
  };

  return (
    <>
      <div
        ref={menuRef}
        className="fixed z-50 bg-background border rounded-md shadow-lg py-1 min-w-[160px]"
        style={{
          left: x,
          top: y,
        }}
      >
        {isRenaming ? (
          <div className="px-2 py-1">
            <Input
              ref={inputRef}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleRenameKeyDown}
              onBlur={() => {
                if (newName.trim()) {
                  handleRenameSubmit();
                } else {
                  setIsRenaming(false);
                }
              }}
              className="h-7 text-sm"
              placeholder={`Rename ${type}`}
            />
          </div>
        ) : (
          <>
            {/* Create options */}
            {type === "collection" && onCreateFolder && (
              <button
                onClick={handleCreateFolder}
                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted w-full text-left"
              >
                <FolderPlus className="h-4 w-4" />
                Add Folder
              </button>
            )}

            {type === "folder" && onCreateRequest && (
              <button
                onClick={handleCreateRequest}
                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted w-full text-left"
              >
                <Plus className="h-4 w-4" />
                Add Request
              </button>
            )}

            {/* Rename option */}
            <button
              onClick={handleRename}
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted w-full text-left"
            >
              <Edit3 className="h-4 w-4" />
              Rename
            </button>

            {/* Delete option */}
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 w-full text-left"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </>
        )}
      </div>

      {/* AlertDialog rendered outside the menu */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{getDeleteTitle()}</AlertDialogTitle>
            <AlertDialogDescription>
              {getDeleteDescription()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}