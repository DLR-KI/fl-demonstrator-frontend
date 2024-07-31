// SPDX-FileCopyrightText: 2024 Johannes Unruh <johannes.unruh@dlr.de>
//
// SPDX-License-Identifier: Apache-2.0

import { AxiosBasicCredentials, AxiosResponse } from "axios";
import { get, getAuthenticated } from "./Utils";


export interface IUser {
  id: string;
  actor: boolean;
  client: boolean;
  email: string;
  firstName: string;
  lastName: string;
  messageEndpoint: string;
  username: string;
  colorId: number;
  color: string;
}

export interface IParticipantLocations {
  [userId: string]: {
    lat: number;
    lng: number;
  };
}


/**
 * Returns a string representation of a user.
 *
 * @param {IUser} user - The user object.
 * @returns {string} A string representation of the user.
 */
export function getUserRepresentation(user: IUser): string {
  return `${user.username} (${user.lastName}, ${user.firstName})`;
}

/**
 * Asynchronously fetches the authenticated user's information.
 *
 * @returns {Promise<IUser>} A Promise that resolves to the authenticated user's data.
 */
export async function getMyself(): Promise<IUser> {
  const response = await getAuthenticated<IUser>("/api/users/myself/");
  return response.data;
}

/**
 * Asynchronously fetches a specific user's information.
 *
 * @param {string} id - The unique ID of the user.
 * @returns {Promise<IUser>} A Promise that resolves to the user's data.
 */
export async function getUser(id: string): Promise<IUser> {
  const response = await getAuthenticated<IUser>(`/api/users/${id}/`);
  return response.data;
}

/**
 * Asynchronously fetches multiple users' information.
 *
 * @param {string[]} ids - The unique IDs of the users.
 * @returns {Promise<IUser[]>} A Promise that resolves to an array of users' data.
 */
export async function getUsers(ids: string[]): Promise<IUser[]> {
  return Promise.all(ids.map(async (id) => {
    return getUser(id);
  }));
}

/**
 * Asynchronously fetches all users' information.
 *
 * @returns {Promise<IUser[]>} A Promise that resolves to an array of all users' data.
 */
export async function getAllUsers(): Promise<IUser[]> {
  const response = await getAuthenticated<IUser[]>(`/api/users/`);
  return response.data;
}

/**
 * Retrieves stored user credentials from local storage.
 *
 * @returns {AxiosBasicCredentials | undefined} The stored user credentials, or undefined if no credentials are stored.
 */
export function getCredentials(): AxiosBasicCredentials | undefined {
  const storageUser: string | null = localStorage.getItem("user");
  if (!storageUser) return undefined;
  const userData: { username: string, password: string } = JSON.parse(storageUser);
  return { "username": userData.username, "password": userData.password };
}

/**
 * Removes stored user credentials from local storage.
 */
export function logout(): void {
  localStorage.removeItem("user");
}

/**
 * Logs in a user and stores their credentials in local storage.
 *
 * @param {string} username - The user's username.
 * @param {string} password - The user's password.
 * @returns {Promise<any>} A Promise that resolves when the login operation is complete.
 */
export function login(username: string, password: string): Promise<AxiosResponse<any, any>> {
  const authdata = btoa(username + ":" + password);

  return get("/api/users/myself/", {
    headers: { "Authorization": "Basic " + authdata }
  }).catch(error => error.response);
}



export async function fetchLocations(users: IUser[]): Promise<IParticipantLocations> {
  try {
    // Simulating no locations found
    const fetchedLocations: IParticipantLocations = {};

    // Return an empty object indicating no locations found
    return new Promise((resolve) => {
      setTimeout(() => resolve(fetchedLocations), 1000); // Simulate async operation
    });
  } catch (error) {
    console.error('Error fetching participant locations:', error);
    throw error;
  }
}
