import { Collection } from "@/types/sidebar";
import { instance } from "./apiHandler";
import { AxiosRequestHeaders } from "axios";

export const getSidebarItems = async () => {
  return await instance.get<Collection[]>(
    "/collections/tree",
    {},
    {} as AxiosRequestHeaders,
    true
  );
};
