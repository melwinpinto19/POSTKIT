export interface Collection {
  _id: string;
  name: string;
  description?: string;
  folders: Folder[];
}

export interface Folder {
  _id: string;
  name: string;
  requests: Request[];
}

export interface Request {
  _id: string;
  name: string;
  method: string;
  url: string;
}

export type TreeItem = "collection" | "folder" | "request";
