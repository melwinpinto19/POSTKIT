import { AxiosRequestHeaders } from "axios";
import { instance } from "./apiHandler";

export const getCollections = async () => {
  return await instance.get(
    "/collections",
    {},
    {} as AxiosRequestHeaders,
    true
  );
};

export const getCollectionById = async (id: string) => {
  return await instance.get(
    `/collections/${id}`,
    {},
    {} as AxiosRequestHeaders,
    true
  );
};

export const createCollection = async (name: string, description: string) => {
  return await instance.post(
    "/collections",
    { name, description },
    {} as AxiosRequestHeaders,
    true
  );
};

export const updateCollection = async (
  id: string,
  name: string,
  description: string
) => {
  return await instance.put(
    `/collections/${id}`,
    { name, description },
    {} as AxiosRequestHeaders,
    true
  );
};

export const deleteCollection = async (id: string) => {
  return await instance.delete(
    `/collections/${id}`,
    {},
    {} as AxiosRequestHeaders,
    true
  );
};

export const exportCollection = async (id: string) => {
  return await instance.get(
    `/collections/export/${id}`,
    {},
    {} as AxiosRequestHeaders,
    true
  );
};

export const importCollection = async (data: any) => {
  return await instance.post(
    "/collections/import",
    data,
    {} as AxiosRequestHeaders,
    true
  );
};
