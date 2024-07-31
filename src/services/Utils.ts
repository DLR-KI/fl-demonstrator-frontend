// SPDX-FileCopyrightText: 2024 Johannes Unruh <johannes.unruh@dlr.de>
//
// SPDX-License-Identifier: Apache-2.0

import axios, { AxiosResponse } from "axios";
import applyCaseMiddleware from "axios-case-converter";
import { getCredentials } from "./User";

const client = applyCaseMiddleware(axios.create());

/**
 * Asynchronously makes an authenticated GET request and expects a Blob in response.
 *
 * @param {string} path - The URL path of the request.
 * @returns {Promise<T>} A Promise that resolves to the response data.
 */
export async function getAuthenticatedBlob<T>(path: string) {
  const cred = getCredentials();
  return client.get<T>(path, { auth: cred, responseType: 'blob' });
}

/**
 * Asynchronously makes an authenticated GET request.
 *
 * @param {string} path - The URL path of the request.
 * @returns {Promise<T>} A Promise that resolves to the response data.
 */
export async function getAuthenticated<T>(path: string) {
  const cred = getCredentials();
  return client.get<T>(path, { auth: cred });
}

/**
 * Asynchronously makes an authenticated DELETE request.
 *
 * @param {string} path - The URL path of the request.
 * @returns {Promise<T>} A Promise that resolves to the response data.
 */
export async function deleteAuthenticated<T>(path: string) {
  const cred = getCredentials();
  return client.delete<T>(path, { auth: cred });
}

/**
 * Asynchronously makes an authenticated POST request.
 *
 * @param {string} path - The URL path of the request.
 * @param {Object} body - The body of the request.
 * @param {Object} headers - The headers of the request.
 * @returns {Promise<any>} A Promise that resolves to the response data.
 */
export async function postAuthenticated(path: string, body: Object = {}, headers = {}) {
  const cred = getCredentials();
  return client.post(
    path,
    body,
    {
      auth: cred,
      headers: headers,
    }
  );
}

/**
 * Asynchronously makes a GET request.
 *
 * @param {string} url - The URL of the request.
 * @param {Object} config - The configuration of the request.
 * @returns {Promise<any>} A Promise that resolves to the response data.
 */
export async function get(url: string, config: Object = {}): Promise<AxiosResponse<any, any>> {
  return client.get(url, config);
}
