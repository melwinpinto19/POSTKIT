import { RequestType, ResponseData } from "@/types/request";
import { createContext, useContext, useState } from "react";

type RequestContextType = {
  request: RequestType;
  setRequest: React.Dispatch<React.SetStateAction<RequestType>>;
  response: ResponseData | null;
  setResponse: React.Dispatch<React.SetStateAction<ResponseData | null>>;
  isLoading: boolean;
  isResponseLoading: boolean;
};

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export const RequestProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [request, setRequest] = useState<RequestType>({
    method: "GET",
    url: "",
    headers: [],
    params: [],
    body: { type: "raw", content: "" },
  });
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResponseLoading, setIsResponseLoading] = useState<boolean>(false);

  return (
    <RequestContext.Provider
      value={{
        request,
        setRequest,
        response,
        setResponse,
        isLoading,
        isResponseLoading,
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
