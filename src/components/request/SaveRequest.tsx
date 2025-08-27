import React from "react";
import { Button } from "@/components/ui/button";
import { useRequest } from "@/context/RequestContext";
import { updateRequest } from "@/api/request";
import { useParams } from "next/navigation";

export default function SaveRequestButton() {
  const { request, edited, setEdited, isLoading } = useRequest();
  const { id } = useParams();

  const handleSave = async () => {
    try {
      await updateRequest(id as string, request);
      setEdited(false);
    } catch (error) {
      // Optionally show error toast
      console.error("Failed to save request:", error);
    } finally {
    }
  };

  return (
    <Button
      onClick={handleSave}
      disabled={isLoading || !edited}
      variant="default"
      className="ml-2"
    >
      Save
    </Button>
  );
}
