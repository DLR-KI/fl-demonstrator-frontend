import { getAuthenticated, postAuthenticated } from "./Utils";


export enum TrainingState {
  INITIAL = "I",
  ONGOING = "O",
  COMPLETED = "C",
  ERROR = "E",
  SWAG_ROUND = "S",
}

export const TrainingStateLabel: { [key in TrainingState]: string } = {
  [TrainingState.INITIAL]: "Initial",
  [TrainingState.ONGOING]: "Ongoing",
  [TrainingState.COMPLETED]: "Completed",
  [TrainingState.ERROR]: "Error",
  [TrainingState.SWAG_ROUND]: "SWAG Round",
};

export enum AggregationMethod {
  AVG = "FedAvg",
  DC = "FedDC",
  PROX = "FedProx",
}

export const AggregationMethodLabel: { [key in AggregationMethod]: string } = {
  [AggregationMethod.AVG]: "FedAvg",
  [AggregationMethod.DC]: "FedDC",
  [AggregationMethod.PROX]: "FedProx",
};

export interface ITraining {
  id: string;
  actor: string;
  participants: string[];
  model: string;
  state: TrainingState;
  targetNumUpdates: number;
  uncertaintyMethod: string;
  aggregationMethod: AggregationMethod;
  locked: boolean;
  lastUpdate: Date;
}

export async function getTraining(id: string) {
  const response = await getAuthenticated<ITraining>(`/api/trainings/${id}/`);
  return response.data;
}

export async function getTrainings() {
  const response = await getAuthenticated<ITraining[]>("/api/trainings/");
  return response.data;
}

export async function createTraining(data: Object) {
  const response = await postAuthenticated("/api/trainings/", data);
  return response.data;
}

export async function startTraining(id: string)  {
  const response = await postAuthenticated(`/api/trainings/${id}/start`);
  return response.data;
}
