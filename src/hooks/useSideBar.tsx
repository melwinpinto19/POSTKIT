"use client";
import {
  createCollection,
  updateCollection,
  deleteCollection,
  importCollection,
} from "@/api/collection";
import { createFolder, updateFolder, deleteFolder } from "@/api/folder";
import { createRequest, updateRequest, deleteRequest } from "@/api/request";
import { getSidebarItems } from "@/api/sidebar";
import { Collection, TreeItem } from "@/types/sidebar";
import React, { useEffect, useRef, useState } from "react";

function useSideBar() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<{
    type: TreeItem;
    id: string;
  } | null>(null);

  const handleCreateCollection = async () => {
    const response = await createCollection("New Collection", "No description");

    if (!response.success) return;

    const newCollection = {
      _id: response.data._id,
      name: response.data.name,
      description: response.data.description,
      folders: [],
    };
    setCollections([...collections, newCollection]);
  };
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.toLowerCase().endsWith(".json")) {
      alert("Please select a JSON file");
      return;
    }

    // Validate file size (optional - limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size should be less than 10MB");
      return;
    }

    try {
      const fileContent = await readFileAsText(file);
      const importData = JSON.parse(fileContent);

      const response = await importCollection(importData);
      if (!response.success) {
        throw new Error("Import failed");
      } else {
        const collection = response.data.data.collection;
        setCollections((prevCollections) => [...prevCollections, collection]);
      }

      console.log("Import successful:", response.data);
    } catch (error) {
      console.log("Import error:", error);
      alert("Failed to import collection. Please check the file format.");
    }

    // Reset file input
    event.target.value = "";
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  };

  const handleCreateFolder = async (collectionId: string) => {
    // Create the folder in the backend :
    const response = await createFolder("New Folder", collectionId);

    // Check if the folder creation was successful :
    if (!response.success) return;

    // Update the local state :
    setCollections(
      collections.map((collection) =>
        collection._id === collectionId
          ? {
              ...collection,
              folders: [
                ...collection.folders,
                {
                  _id: response.data._id,
                  name: response.data.name,
                  requests: [],
                },
              ],
            }
          : collection
      )
    );
  };

  const handleCreateRequest = async (
    collectionId: string,
    folderId: string
  ) => {
    const response = await createRequest({
      name: "New Request",
      url: "https://example.com",
      folder: folderId,
      method: "GET",
    });

    if (!response.success) return;

    const newRequest = {
      _id: response.data._id,
      name: response.data.name,
      url: response.data.url,
      method: response.data.method,
    };

    setCollections(
      collections.map((collection) =>
        collection._id === collectionId
          ? {
              ...collection,
              folders: collection.folders.map((folder) =>
                folder._id === folderId
                  ? {
                      ...folder,
                      requests: [...folder.requests, newRequest],
                    }
                  : folder
              ),
            }
          : collection
      )
    );
  };

  // Delete functions with API calls
  const handleCollectionDelete = async (id: string) => {
    const response = await deleteCollection(id);
    if (!response.success) return;

    setCollections(collections.filter((c) => c._id !== id));
  };

  const handleFolderDelete = async (id: string) => {
    const response = await deleteFolder(id);
    if (!response.success) return;

    setCollections(
      collections.map((collection) => ({
        ...collection,
        folders: collection.folders.filter((f) => f._id !== id),
      }))
    );
  };

  const handleRequestDelete = async (id: string) => {
    const response = await deleteRequest(id);
    if (!response.success) return;

    setCollections(
      collections.map((collection) => ({
        ...collection,
        folders: collection.folders.map((folder) => ({
          ...folder,
          requests: folder.requests.filter((r) => r._id !== id),
        })),
      }))
    );
  };

  const handleDelete = async (type: string, id: string, parentId?: string) => {
    if (type === "collection") {
      await handleCollectionDelete(id);
    } else if (type === "folder") {
      await handleFolderDelete(id);
    } else if (type === "request") {
      await handleRequestDelete(id);
    }
  };

  // Rename functions with API calls
  const handleCollectionRename = async (id: string, newName: string) => {
    // Find the collection being renamed :
    const collection = collections.find((c) => c._id === id);

    // Update the collection name in the backend :
    const response = await updateCollection(
      id,
      newName,
      collection?.description || ""
    );

    // Check if the update was successful :
    if (!response.success) return;

    // Update the local state :
    setCollections(
      collections.map((c) => (c._id === id ? { ...c, name: newName } : c))
    );
  };

  const handleFolderRename = async (id: string, newName: string) => {
    // Update the folder name in the backend :
    const response = await updateFolder(id, newName);

    // Check if the update was successful :
    if (!response.success) return;

    // Update the local state :
    setCollections(
      collections.map((c) => ({
        ...c,
        folders: c.folders.map((f) =>
          f._id === id ? { ...f, name: newName } : f
        ),
      }))
    );
  };

  const handleRequestRename = async (id: string, newName: string) => {
    // Update the request name in the backend :
    const response = await updateRequest(id, { name: newName });

    // Check if the update was successful :
    if (!response.success) return;

    // Update the local state :
    setCollections(
      collections.map((collection) => ({
        ...collection,
        folders: collection.folders.map((folder) => ({
          ...folder,
          requests: folder.requests.map((r) =>
            r._id === id ? { ...r, name: newName } : r
          ),
        })),
      }))
    );
  };

  const handleImportCollection = async (data: any) => {
    const response = await importCollection(data);
    if (!response.success) return;

    setCollections((prevCollections) => [
      ...prevCollections,
      response.data.collection,
    ]);
  };

  const handleRename = async (
    type: string,
    id: string,
    newName: string,
    parentId?: string
  ) => {
    if (type === "collection") {
      await handleCollectionRename(id, newName);
    } else if (type === "folder") {
      await handleFolderRename(id, newName);
    } else if (type === "request") {
      await handleRequestRename(id, newName);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getSidebarItems();

        if (response.success) {
          console.log(response.data);
          setCollections(response.data);
        } else {
          setError("Failed to load collections");
        }
      } catch (err) {
        setError("An error occurred while loading collections");
        console.error("Error fetching sidebar data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    collections,
    error,
    isLoading,
    handleCreateCollection,
    handleRename,
    handleDelete,
    handleCreateFolder,
    handleCreateRequest,
    selectedItem,
    setSelectedItem,
    fileInputRef,
    handleImportClick,
    handleFileSelect,
  };
}

export default useSideBar;
