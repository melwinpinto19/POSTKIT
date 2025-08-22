import { AxiosRequestHeaders } from "axios";
import { instance } from "./apiHandler";

export const getFolders = async () => {
  return await instance.get(
    "/folder",
    {},
    {} as AxiosRequestHeaders,
    true
  );
};

export const getFolderById = async (id: string) => {
  return await instance.get(
    `/folder/${id}`,
    {},
    {} as AxiosRequestHeaders,
    true
  );
};

export const createFolder = async (name: string, collectionName: string) => {
  return await instance.post(
    "/folder",
    { name, collectionName },
    {} as AxiosRequestHeaders,
    true
  );
};

export const updateFolder = async (id: string, name: string) => {
  return await instance.put(
    `/folder/${id}`,
    { name },
    {} as AxiosRequestHeaders,
    true
  );
};

export const deleteFolder = async (id: string) => {
  return await instance.delete(
    `/folder/${id}`,
    {},
    {} as AxiosRequestHeaders,
    true
  );
};