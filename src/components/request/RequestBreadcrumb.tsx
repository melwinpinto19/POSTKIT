import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Folder, FileText } from "lucide-react";
import { useRequest } from "@/context/RequestContext";

export default function RequestBreadcrumb() {
  // Mock breadcrumb data - replace with actual data from props or context
  const { breadcrumb } = useRequest();
  const breadcrumbItems = [
    { name: breadcrumb[0], type: "workspace", href: "/" },
    { name: breadcrumb[1], type: "folder", href: "/collection/1" },
    { name: breadcrumb[2], type: "request" },
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
                  {item.name}
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
