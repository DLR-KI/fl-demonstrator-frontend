// SPDX-FileCopyrightText: 2024 Johannes Unruh <johannes.unruh@dlr.de>
//
// SPDX-License-Identifier: Apache-2.0

import { getAuthenticated, getAuthenticatedBlob, postAuthenticated } from "./Utils";


export interface IModel {
  id: string;
  owner: string;
  round: number;
  weights?: number;
  name?: string;
  description?: string;
}

/**
 * Asynchronously fetches a model file from the API.
 *
 * @param {string} id - The unique ID of the model.
 * @returns {Promise<any>} A Promise that resolves to the model file data.
 */
export async function getModelFile(id: string) {
  const response = await getAuthenticatedBlob<any>(`/api/models/${id}/`);
  return response.data;
}

/**
 * Asynchronously fetches metadata for a specific model from the API.
 *
 * @param {string} id - The unique ID of the model.
 * @returns {Promise<IModel>} A Promise that resolves to the model metadata.
 */
export async function getModelMetadata(id: string) {
  const response = await getAuthenticated<IModel>(`/api/models/${id}/metadata/`);
  return response.data;
}

/**
 * Asynchronously fetches all models from the API.
 *
 * @returns {Promise<IModel[]>} A Promise that resolves to an array of all models.
 */
export async function getModels() {
  const response = await getAuthenticated<IModel[]>("/api/models/");
  return response.data;
}

/**
 * Asynchronously creates a new model in the API.
 *
 * @param {Object} data - The data for the new model.
 * @returns {Promise<any>} A Promise that resolves to the data of the created model.
 */
export async function createModel(data: Object) {
  const response = await postAuthenticated("/api/models/", data, {
    'Content-Type': `multipart/form-data`,
  });
  return response.data;
}
