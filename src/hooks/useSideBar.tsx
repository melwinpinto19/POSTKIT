"use client";
import { createCollection, updateCollection } from "@/api/collection";
import { createFolder, updateFolder } from "@/api/folder";
import { createRequest } from "@/api/request";
import { getSidebarItems } from "@/api/sidebar";
import { Collection, TreeItem } from "@/types/sidebar";
import React, { useEffect, useState } from "react";

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

  const handleDelete = (type: string, id: string, parentId?: string) => {
    if (type === "collection") {
      setCollections(collections.filter((c) => c._id !== id));
    } else if (type === "folder") {
      setCollections(
        collections.map((collection) => ({
          ...collection,
          folders: collection.folders.filter((f) => f._id !== id),
        }))
      );
    } else if (type === "request") {
      setCollections(
        collections.map((collection) => ({
          ...collection,
          folders: collection.folders.map((folder) => ({
            ...folder,
            requests: folder.requests.filter((r) => r._id !== id),
          })),
        }))
      );
    }
  };

  //  rename functions :

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
  };
}

export default useSideBar;
