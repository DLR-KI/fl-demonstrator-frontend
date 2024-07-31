// SPDX-FileCopyrightText: 2024 Tarek Stolz <tarek.stolz@dlr.de>
//
// SPDX-License-Identifier: Apache-2.0

import { postAuthenticated } from "./Utils";

/**
 * Creates a new inference by sending a POST request to the server.
 *
 * @param {Object} data - The data object containing information for the new inference.
 * @returns {Promise<Object>} - A promise that resolves to the response data of the created inference.
 */
export async function createInference(body: Object = {}, headers = {}) {
  const response = await postAuthenticated("/api/inference/", body, {
    headers,
  });
  return response.data;
}
