"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getCollections,
  updateCollection,
  deleteCollection,
  getCollectionById,
} from "@/api/collection";
import { getFolders, createFolder } from "@/api/folder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Pencil,
  Trash2,
  Save,
  X,
  FolderPlus,
  Folder,
  Calendar,
  User,
  FileText,
  Settings,
} from "lucide-react";
import DeleteDialog from "@/components/shared/DeleteDialog";

export default function CollectionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [collection, setCollection] = useState<any>(null);
  const [folders, setFolders] = useState<any[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    fetchCollectionData();
  }, [id]);

  const fetchCollectionData = async () => {
    try {
      setLoading(true);
      const [collectionRes, foldersRes] = await Promise.all([
        getCollectionById(id),
        getFolders(),
      ]);

      const foundCollection = collectionRes.data;

      if (!foundCollection) {
        toast.error("Collection not found");
        router.push("/home");
        return;
      }

      setCollection(foundCollection);
      setName(foundCollection.name || "");
      setDescription(foundCollection.description || "");

      const collectionFolders =
        foldersRes.data?.filter((f: any) => f.collectionName === id) || [];
      setFolders(collectionFolders);
    } catch (error) {
      console.error("Error fetching collection:", error);
      toast.error("Failed to load collection data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Collection name is required.");
      return;
    }

    try {
      setSaving(true);
      await updateCollection(id, name.trim(), description.trim());
      setCollection({
        ...collection,
        name: name.trim(),
        description: description.trim(),
      });
      setEditMode(false);
      toast.success("Collection updated successfully.");
    } catch (error) {
      console.error("Error updating collection:", error);
      toast.error("Failed to update collection.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCollection(id);
      toast.success("Collection deleted successfully.");
      router.push("/home");
    } catch (error) {
      console.error("Error deleting collection:", error);
      toast.error("Failed to delete collection.");
    }
  };

  const handleCreateFolder = async () => {

    try {
      const response = await createFolder("New Folder", id);
      if (response.success) {
        setFolders((prev) => [...prev, response.data]);
        toast.success("Folder created successfully.");
      } else {
        toast.error("Failed to create folder.");
      }
    } catch (error) {
      console.error("Error creating folder:", error);
      toast.error("Failed to create folder.");
    }
  };

  const handleFolderClick = (folderId: string) => {
    router.push(`/home/folders/${folderId}`);
  };

  if (loading) {
    return <CollectionPageSkeleton />;
  }

  if (!collection) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Collection Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The requested collection could not be found.
          </p>
          <Button onClick={() => router.push("/home")}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-[calc(100%-320px)]">
        <div className="flex flex-col h-full w-full min-[1300px]:m-auto">
          {/* Header */}
          <div className="border-b bg-background/95 backdrop-blur p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                {editMode ? (
                  <div className="space-y-4 max-w-2xl">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Collection Name
                      </label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter collection name"
                        className="text-lg font-semibold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter collection description"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSave} disabled={saving}>
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditMode(false);
                          setName(collection.name || "");
                          setDescription(collection.description || "");
                        }}
                        disabled={saving}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold truncate">
                        {collection.name}
                      </h1>
                      <Badge variant="secondary">
                        {folders.length} folders
                      </Badge>
                    </div>
                    {collection.description && (
                      <p className="text-muted-foreground text-lg mb-4 max-w-2xl">
                        {collection.description}
                      </p>
                    )}
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Created{" "}
                          {new Date(collection.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Owner</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {!editMode && (
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditMode(true)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCreateFolder}
                  >
                    <FolderPlus className="h-4 w-4 mr-2" />
                    New Folder
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              {folders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="text-center max-w-md">
                    <Folder className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      No folders yet
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Get started by creating your first folder to organize your
                      API requests.
                    </p>
                    <Button onClick={handleCreateFolder}>
                      <FolderPlus className="h-4 w-4 mr-2" />
                      Create First Folder
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Folders</h2>
                    <Button variant="outline" onClick={handleCreateFolder}>
                      <FolderPlus className="h-4 w-4 mr-2" />
                      Add Folder
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {folders.map((folder) => (
                      <Card
                        key={folder._id}
                        className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleFolderClick(folder._id)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Folder className="h-5 w-5 text-primary" />
                              <CardTitle className="text-base truncate">
                                {folder.name}
                              </CardTitle>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {folder.requests?.length || 0} requests
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {new Date(
                                  folder.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FileText className="h-3 w-3" />
                              <span>API Tests</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <DeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Collection"
        description="Are you sure you want to delete this collection?"
      />
    </>
  );
}

function CollectionPageSkeleton() {
  return (
    <div className="flex flex-col h-full w-full">
      {/* Header Skeleton */}
      <div className="border-b bg-background/95 backdrop-blur p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-6 w-96 mb-4" />
            <div className="flex items-center gap-6">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-9 w-28" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                    <Skeleton className="h-5 w-16" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
