// SPDX-FileCopyrightText: 2024 Johannes Unruh <johannes.unruh@dlr.de>
//
// SPDX-License-Identifier: Apache-2.0

import { getAuthenticated } from "./Utils";


export interface IMetric {
  id: string;
  identifier: string;
  key: string;
  valueFloat?: number;
  valueBinary?: number;
  step: number;
  training: string;
  reporter: string;
}

/**
 * Function to fetch metrics for a particular model.
 * This function makes an authenticated API call to fetch metrics associated with a specific model.
 *
 * @param {string} modelId - The unique ID of the model for which metrics are to be fetched.
 * @return {Promise<Object>} - Promise that resolves to an array of IMetric objects.
 */
export async function getMetric(modelId: string): Promise<IMetric[]> {
  const response = await getAuthenticated<IMetric[]>(`/api/models/${modelId}/metrics`);
  return response.data;
}
