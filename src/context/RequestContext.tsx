import { RequestType } from "@/types/request";
import { createContext, useContext, useState } from "react";

type RequestContextType = {
  request: RequestType;
  setRequest: React.Dispatch<React.SetStateAction<RequestType>>;
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

  return (
    <RequestContext.Provider value={{ request, setRequest }}>
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
