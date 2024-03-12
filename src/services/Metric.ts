import { getAuthenticated } from "./Utils";


export interface IMetric {
  id: string;
  identifier: string;
  key: string;
  valueFloat?: number;
  valueBinary?: number;
  step: number;
  training: string;
  reportingClient: string;
}

export async function getMetric(modelId: string) {
  const response = await getAuthenticated<IMetric[]>(`/api/models/${modelId}/metrics`);
  return response.data;
}
