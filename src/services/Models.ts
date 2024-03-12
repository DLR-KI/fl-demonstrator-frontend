import { getAuthenticated, getAuthenticatedBlob, postAuthenticated } from "./Utils";


export interface IModel {
  id: string;
  owner: string;
  round: number;
  weights?: number;
  name?: string;
  description?: string;
}

export async function getModelFile(id: string) {
  const response = await getAuthenticatedBlob<any>(`/api/models/${id}/`);
  return response.data;
}

export async function getModel(id: string) {
  const response = await getAuthenticated<IModel>(`/api/models/${id}/metadata/`);
  return response.data;
}

export async function getModels() {
  const response = await getAuthenticated<IModel[]>("/api/models/");
  return response.data;
}

export async function createModel() {
  const response = await postAuthenticated("/api/models/");
  return response.data;
}
