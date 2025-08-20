import React, { useState } from "react";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import TreeCollection from "@/components/sidebar/TreeCollection";
import { TreeItem } from "@/types/sidebar";

// Dummy data structure
const dummyData = [
  {
    _id: "collection1",
    name: "User Management API",
    description: "APIs for user operations",
    folders: [
      {
        _id: "folder1",
        name: "Authentication",
        requests: [
          {
            _id: "request1",
            name: "Login User",
            method: "POST",
            url: "https://api.example.com/auth/login",
          },
          {
            _id: "request2",
            name: "Register User",
            method: "POST",
            url: "https://api.example.com/auth/register",
          },
          {
            _id: "request3",
            name: "Refresh Token",
            method: "POST",
            url: "https://api.example.com/auth/refresh",
          },
        ],
      },
      {
        _id: "folder2",
        name: "Profile Management",
        requests: [
          {
            _id: "request4",
            name: "Get User Profile",
            method: "GET",
            url: "https://api.example.com/users/profile",
          },
          {
            _id: "request5",
            name: "Update Profile",
            method: "PUT",
            url: "https://api.example.com/users/profile",
          },
        ],
      },
    ],
  },
  {
    _id: "collection2",
    name: "E-commerce API",
    description: "Product and order management",
    folders: [
      {
        _id: "folder3",
        name: "Products",
        requests: [
          {
            _id: "request6",
            name: "Get All Products",
            method: "GET",
            url: "https://api.example.com/products",
          },
          {
            _id: "request7",
            name: "Create Product",
            method: "POST",
            url: "https://api.example.com/products",
          },
        ],
      },
    ],
  },
];

export default function Sidebar() {
  const [collections, setCollections] = useState(dummyData);
  const [selectedItem, setSelectedItem] = useState<{
    type: TreeItem;
    id: string;
  } | null>(null);

  const handleCreateCollection = () => {
    const newCollection = {
      _id: `collection${Date.now()}`,
      name: "New Collection",
      description: "",
      folders: [],
    };
    setCollections([...collections, newCollection]);
  };

  const handleCreateFolder = (collectionId: string) => {
    setCollections(collections.map(collection => 
      collection._id === collectionId 
        ? {
            ...collection,
            folders: [
              ...collection.folders,
              {
                _id: `folder${Date.now()}`,
                name: "New Folder",
                requests: [],
              }
            ]
          }
        : collection
    ));
  };

  const handleCreateRequest = (collectionId: string, folderId: string) => {
    setCollections(collections.map(collection => 
      collection._id === collectionId 
        ? {
            ...collection,
            folders: collection.folders.map(folder =>
              folder._id === folderId
                ? {
                    ...folder,
                    requests: [
                      ...folder.requests,
                      {
                        _id: `request${Date.now()}`,
                        name: "New Request",
                        method: "GET",
                        url: "https://api.example.com",
                      }
                    ]
                  }
                : folder
            )
          }
        : collection
    ));
  };

  const handleDelete = (type: string, id: string, parentId?: string) => {
    if (type === 'collection') {
      setCollections(collections.filter(c => c._id !== id));
    } else if (type === 'folder') {
      setCollections(collections.map(collection => ({
        ...collection,
        folders: collection.folders.filter(f => f._id !== id)
      })));
    } else if (type === 'request') {
      setCollections(collections.map(collection => ({
        ...collection,
        folders: collection.folders.map(folder => ({
          ...folder,
          requests: folder.requests.filter(r => r._id !== id)
        }))
      })));
    }
  };

  const handleRename = (type: string, id: string, newName: string, parentId?: string) => {
    if (type === 'collection') {
      setCollections(collections.map(c => 
        c._id === id ? { ...c, name: newName } : c
      ));
    } else if (type === 'folder') {
      setCollections(collections.map(collection => ({
        ...collection,
        folders: collection.folders.map(f => 
          f._id === id ? { ...f, name: newName } : f
        )
      })));
    } else if (type === 'request') {
      setCollections(collections.map(collection => ({
        ...collection,
        folders: collection.folders.map(folder => ({
          ...folder,
          requests: folder.requests.map(r => 
            r._id === id ? { ...r, name: newName } : r
          )
        }))
      })));
    }
  };

  return (
    <div className="w-80 border-r bg-background h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Collections</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCreateCollection}
            className="h-8 w-8"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tree Structure */}
      <div className="flex-1 overflow-y-auto p-2">
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
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleCreateCollection}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Collection
        </Button>
      </div>
    </div>
  );
}