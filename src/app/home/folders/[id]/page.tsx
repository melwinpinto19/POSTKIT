"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getFolderById, updateFolder, deleteFolder } from "@/api/folder";
import {
  getRequests,
  createRequest,
  getRequestsByFolderId,
} from "@/api/request";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Pencil,
  Trash2,
  Save,
  X,
  Plus,
  Calendar,
  User,
  ArrowLeft,
  FileText,
  Globe,
  Zap,
  Activity,
} from "lucide-react";
import DeleteDialog from "@/components/shared/DeleteDialog";
import { CreateRequestData } from "@/types/api/request";

const methodColors: Record<string, string> = {
  GET: "bg-green-500",
  POST: "bg-orange-500",
  PUT: "bg-blue-500",
  DELETE: "bg-red-500",
  PATCH: "bg-purple-500",
  HEAD: "bg-gray-500",
  OPTIONS: "bg-yellow-500",
};

export default function FolderPage() {
  const { id: folderId } = useParams<{ id: string }>();
  const router = useRouter();

  const [folder, setFolder] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    fetchFolderData();
  }, [folderId]);

  const fetchFolderData = async () => {
    try {
      setLoading(true);
      const [folderRes, requestsRes] = await Promise.all([
        getFolderById(folderId),
        getRequestsByFolderId(folderId),
      ]);

      if (folderRes.success) {
        setFolder(folderRes.data);
        setName(folderRes.data.name || "");
      } else {
        toast.error("Folder not found");
        router.push("/home");
        return;
      }

      if (requestsRes.success) {
        setRequests(requestsRes.data);
      } else {
        toast.error("Failed to load requests.");
      }
    } catch (error) {
      console.error("Error fetching folder:", error);
      toast.error("Failed to load folder data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Folder name is required.");
      return;
    }

    try {
      setSaving(true);
      const response = await updateFolder(folderId, name.trim());
      if (response.success) {
        setFolder({ ...folder, name: name.trim() });
        setEditMode(false);
        toast.success("Folder updated successfully.");
      } else {
        toast.error("Failed to update folder.");
      }
    } catch (error) {
      console.error("Error updating folder:", error);
      toast.error("Failed to update folder.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFolder(folderId);
      toast.success("Folder deleted successfully.");
      // Navigate back to collection page
      if (folder?.collectionName) {
        router.push(`/home/collections/${folder.collectionName}`);
      } else {
        router.push("/home");
      }
    } catch (error) {
      console.error("Error deleting folder:", error);
      toast.error("Failed to delete folder.");
    }
  };

  const handleCreateRequest = async () => {
    try {
      const requestData: CreateRequestData = {
        name: "New Request",
        method: "GET",
        url: "https://api.example.com",
        folder: folderId,
      };

      const response = await createRequest(requestData);
      if (response.success) {
        setRequests((prev) => [...prev, response.data]);
        toast.success("Request created successfully.");
      } else {
        toast.error("Failed to create request.");
      }
    } catch (error) {
      console.error("Error creating request:", error);
      toast.error("Failed to create request.");
    }
  };

  const handleRequestClick = (requestId: string) => {
    router.push(`/home/requests/${requestId}`);
  };

  const handleBackToCollection = () => {
    if (folder?.collectionName) {
      router.push(`/home/collections/${folder.collectionName}`);
    } else {
      router.push("/home");
    }
  };

  if (loading) {
    return <FolderPageSkeleton />;
  }

  if (!folder) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Folder Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The requested folder could not be found.
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
                <div className="flex items-center gap-3 mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToCollection}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Collection
                  </Button>
                </div>

                {editMode ? (
                  <div className="space-y-4 max-w-xl">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Folder Name</label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter folder name"
                        className="text-lg font-semibold"
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
                          setName(folder.name || "");
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
                        {folder.name}
                      </h1>
                      <Badge variant="secondary">
                        {requests.length} requests
                      </Badge>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Created{" "}
                          {new Date(folder.createdAt).toLocaleDateString()}
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
                    onClick={handleCreateRequest}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Request
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
              {requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="text-center max-w-md">
                    <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      No requests yet
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Start testing your APIs by creating your first request in
                      this folder.
                    </p>
                    <Button onClick={handleCreateRequest}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Request
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Requests</h2>
                    <Button variant="outline" onClick={handleCreateRequest}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Request
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {requests.map((request: any) => (
                      <Card
                        key={request._id}
                        className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleRequestClick(request._id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <Badge
                                className={`${
                                  methodColors[request.method] || "bg-gray-500"
                                } text-white font-mono text-xs px-2 py-1`}
                              >
                                {request.method}
                              </Badge>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-sm truncate">
                                  {request.name}
                                </h3>
                                <p className="text-xs text-muted-foreground truncate font-mono">
                                  {request.url}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Activity className="h-3 w-3" />
                                <span>Ready</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {new Date(
                                    request.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
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
        title="Delete Folder"
        description="Are you sure you want to delete this folder? This will also delete all requests in this folder. This action cannot be undone."
      />
    </>
  );
}

function FolderPageSkeleton() {
  return (
    <div className="flex flex-col h-full w-full">
      {/* Header Skeleton */}
      <div className="border-b bg-background/95 backdrop-blur p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-8 w-32" />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-6 w-20" />
            </div>
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
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Skeleton className="h-6 w-16" />
                      <div className="min-w-0 flex-1">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-64" />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-20" />
                    </div>
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
