import { ApiResponse } from "@/api";
import { getRequestById } from "@/api/request";
import { RequestType, ResponseData } from "@/types/request";
import { createContext, useContext, useEffect, useState } from "react";

type RequestContextType = {
  request: RequestType;
  setRequest: React.Dispatch<React.SetStateAction<RequestType>>;
  response: ApiResponse | null;
  setResponse: React.Dispatch<React.SetStateAction<ApiResponse | null>>;
  isLoading: boolean;
  isResponseLoading: boolean;
  setIsResponseLoading: React.Dispatch<React.SetStateAction<boolean>>;
  edited: boolean;
  setEdited: React.Dispatch<React.SetStateAction<boolean>>;
  breadcrumb: string[];
};

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export const RequestProvider: React.FC<{
  children: React.ReactNode;
  id: string;
}> = ({ children, id }) => {
  const [request, setRequest] = useState<RequestType>({
    method: "GET",
    url: "",
    headers: [],
    params: [],
    body: { type: "raw", content: "" },
    auth: {
      type: "none",
      token: "",
      username: "",
      password: "",
      key: "",
      value: "",
      addTo: "header",
      clientId: "",
      clientSecret: "",
      accessTokenUrl: "",
      scope: "",
      realm: "",
    },
    name: "",
  });
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResponseLoading, setIsResponseLoading] = useState<boolean>(false);
  const [edited, setEdited] = useState<boolean>(false);
  const [breadcrumb, setBreadcrumb] = useState<string[]>([]);

  useEffect(() => {
    const fetchRequest = async () => {
      setIsLoading(true);
      try {
        const data = await getRequestById(id);
        if (data.success) {
          setRequest({
            method: data.data.method,
            url: data.data.url,
            headers: data.data.headers,
            params: data.data.params,
            body: data.data.body,
            auth: data.data.auth,
            name: data.data.name,
          });
          setBreadcrumb([
            data.data.folder.collectionName.name,
            data.data.folder.name,
            data.data.name,
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch request:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  return (
    <RequestContext.Provider
      value={{
        request,
        setRequest,
        response,
        setResponse,
        isLoading,
        isResponseLoading,
        setIsResponseLoading,
        edited,
        setEdited,
        breadcrumb,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
};

export const useRequest = () => {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error("useRequest must be used within a RequestProvider");
  }
  return context;
};
