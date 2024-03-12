import { AxiosBasicCredentials } from "axios";
import { get, getAuthenticated } from "./Utils";


export const userService = {
  login,
  logout,
  getCredentials,
  getMyself,
  getUsers,
  getGroups
};

export interface IUser {
  id: string;
  actor: boolean;
  client: boolean;
  email: string;
  firstName: string;
  lastName: string;
  messageEndpoint: string;
  username: string;
}

export function getUserRepresentation(user: IUser) {
  return `${user.username} (${user.lastName}, ${user.firstName})`;
}

async function getMyself() {
  const response = await getAuthenticated<IUser[]>("/api/users/");
  return response.data;
}

export async function getUser(id: string) {
  const response = await getAuthenticated<IUser>(`/api/users/${id}/`);
  return response.data;
}

export async function getGroups() {
  const response = await getAuthenticated<[Object]>(`/api/users/groups/`);
  return response.data;
}

async function getUsers(ids: string[]) {
  return Promise.all(ids.map(async (id) => {
    return getUser(id);
  }));
}

function getCredentials(): AxiosBasicCredentials | undefined {
  const storageUser: string | null = localStorage.getItem("user");
  if (!storageUser) return undefined;
  const userData: { username: string, password: string } = JSON.parse(storageUser);
  return { "username": userData.username, "password": userData.password };
}

function logout() {
  localStorage.removeItem("user");
}

function login(username: string, password: string) {
  const authdata = btoa(username + ":" + password);

  return get("/api/users/", {
    headers: { "Authorization": "Basic " + authdata }
  }).then((response) => {
    if (response.status < 300) {
      localStorage.setItem("user", JSON.stringify({ "username": username, "password": password }));
    } else {
      // TODO: handle error (or ignore?)
      console.error(response.statusText);
    }
  });
}
