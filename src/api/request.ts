import { AxiosRequestHeaders } from "axios";
import { instance } from "./apiHandler";
import { CreateRequestData, UpdateRequestData } from "@/types/api/request";

export const getRequests = async () => {
  return await instance.get("/requests", {}, {} as AxiosRequestHeaders, true);
};

export const getRequestById = async (id: string) => {
  return await instance.get(
    `/requests/${id}`,
    {},
    {} as AxiosRequestHeaders,
    true
  );
};

export const createRequest = async (data: CreateRequestData) => {
  return await instance.post(
    "/requests",
    data,
    {} as AxiosRequestHeaders,
    true
  );
};

export const updateRequest = async (id: string, data: UpdateRequestData) => {
  return await instance.put(
    `/requests/${id}`,
    data,
    {} as AxiosRequestHeaders,
    true
  );
};

export const deleteRequest = async (id: string) => {
  return await instance.delete(
    `/requests/${id}`,
    {},
    {} as AxiosRequestHeaders,
    true
  );
};
