// SPDX-FileCopyrightText: 2024 Johannes Unruh <johannes.unruh@dlr.de>
//
// SPDX-License-Identifier: Apache-2.0

import { deleteAuthenticated, getAuthenticated, postAuthenticated } from "./Utils";


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

/**
 * Asynchronously fetches a specific training from the API.
 *
 * @param {string} id - The unique ID of the training.
 * @returns {Promise<ITraining>} A Promise that resolves to the training data.
 */
export async function getTraining(id: string): Promise<ITraining> {
  const response = await getAuthenticated<ITraining>(`/api/trainings/${id}/`);
  return response.data;
}

/**
 * Asynchronously fetches all trainings from the API.
 *
 * @returns {Promise<ITraining[]>} A Promise that resolves to an array of all trainings.
 */
export async function getTrainings(): Promise<ITraining[]> {
  const response = await getAuthenticated<ITraining[]>("/api/trainings/");
  return response.data;
}

/**
 * Asynchronously creates a new training in the API.
 *
 * @param {Object} data - The data for the new training.
 * @returns {Promise<any>} A Promise that resolves to the data of the created training.
 */
export async function createTraining(data: Object): Promise<any> {
  const response = await postAuthenticated("/api/trainings/", data);
  return response.data;
}


/**
 * Asynchronously starts a specific training in the API.
 *
 * @param {string} id - The unique ID of the training to start.
 * @returns {Promise<any>} A Promise that resolves to the response data of the start operation.
 */
export async function startTraining(id: string) {
  const response = await postAuthenticated(`/api/trainings/${id}/start/`);
  return response.data;
}

/**
 * Asynchronously deletes a specific training from the API.
 *
 * @param {string} id - The unique ID of the training to delete.
 * @returns {Promise<any>} A Promise that resolves to the response data of the delete operation.
 */
export async function deleteTraining(id: string) {
  const response = await deleteAuthenticated(`/api/trainings/${id}/`);
  return response.data;
}
