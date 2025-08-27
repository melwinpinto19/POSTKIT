import React, { useState, useRef } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Folder, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRequest } from "@/context/RequestContext";

export default function RequestBreadcrumb() {
  const { breadcrumb, request, setRequest, setEdited } = useRequest();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(request.name || "");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when editing starts
  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleNameClick = () => {
    setIsEditing(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleNameBlur = () => {
    setIsEditing(false);
    if (name.trim() && name !== request.name) {
      setRequest((prev) => ({ ...prev, name }));
      setEdited(true);
    }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      inputRef.current?.blur();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setName(request.name || "");
    }
  };

  const breadcrumbItems = [
    { name: breadcrumb[0], type: "workspace", href: "/" },
    { name: breadcrumb[1], type: "folder", href: "/collection/1" },
    { name: request.name, type: "request" },
  ];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {index === breadcrumbItems.length - 1 ? (
                <BreadcrumbPage className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {isEditing ? (
                    <Input
                      ref={inputRef}
                      value={name}
                      onChange={handleNameChange}
                      onBlur={handleNameBlur}
                      onKeyDown={handleNameKeyDown}
                      className="h-7 w-[180px] px-2 text-sm"
                    />
                  ) : (
                    <span
                      className="cursor-pointer"
                      onClick={handleNameClick}
                    >
                      {item.name}
                    </span>
                  )}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  href={item.href}
                  className="flex items-center gap-2"
                >
                  {item.type === "folder" && <Folder className="h-4 w-4" />}
                  {item.name}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}