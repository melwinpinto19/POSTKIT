import { AxiosRequestHeaders } from "axios";
import { instance } from "./apiHandler";
import { CreateRequestData, UpdateRequestData } from "@/types/api/request";

export const getRequests = async () => {
  return await instance.get("/request", {}, {} as AxiosRequestHeaders, true);
};

export const getRequestById = async (id: string) => {
  return await instance.get(
    `/request/${id}`,
    {},
    {} as AxiosRequestHeaders,
    true
  );
};

export const createRequest = async (data: CreateRequestData) => {
  return await instance.post(
    "/request",
    data,
    {} as AxiosRequestHeaders,
    true
  );
};

export const updateRequest = async (id: string, data: UpdateRequestData) => {
  return await instance.put(
    `/request/${id}`,
    data,
    {} as AxiosRequestHeaders,
    true
  );
};

export const deleteRequest = async (id: string) => {
  return await instance.delete(
    `/request/${id}`,
    {},
    {} as AxiosRequestHeaders,
    true
  );
};
