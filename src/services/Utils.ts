import applyCaseMiddleware from "axios-case-converter";
import axios from "axios";
import { userService } from "./User";

const client = applyCaseMiddleware(axios.create());

export async function getAuthenticatedBlob<T>(path: string) {
  const cred = userService.getCredentials();
  return client.get<T>(path, { auth: cred, responseType: 'blob'});
}

export async function getAuthenticated<T>(path: string) {
  const cred = userService.getCredentials();
  return client.get<T>(path, { auth: cred });
}

export async function postAuthenticated(path: string, config: Object = {}) {
  const cred = userService.getCredentials();
  return client.post(path, config, { auth: cred });
}

export async function get(url: string, config: Object = {}) {
  return client.get(url, config);
}
