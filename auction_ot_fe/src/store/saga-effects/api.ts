import { call } from 'redux-saga/effects';
import AxiosInstance from '../SetupAxios';
import store from '../Store';

export interface ApiResponse<Data, Meta = {}> {
  data: Data;
  meta: Meta;
  getResponse: () => Response;
}

export function* apiCall<Fn extends (...args: any[]) => any>(fn: Fn, ...args: Parameters<Fn>) {
  const result: object = yield call(fn, ...args);
  return result;
}

export function* apiGetCall(endpoint: string) {
  // Function to get cookie value by name
  const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';')?.shift(); // Using optional chaining
      return undefined; // Explicitly return undefined if the cookie is not found
  };
  // Get the access token from cookies
  const access_token = getCookie('accessTokenAuction');
  
  if (access_token) {
      const response: Response = yield AxiosInstance.get(endpoint, {
          headers: {
              Authorization: `Bearer ${access_token}`, // Use the token in the authorization header
          },
      });
      return response;
  }
  
  // Redirect to login if token is not present
  window.location.href = '/login';
}

export function* apiGetCallNoToken(endpoint: string) {
    const response: Response = yield AxiosInstance.get(endpoint);
    return response;
}



export function* apiPostCall(endpoint: string, body: object) {
  // const {
  //   auth: { access_token },
  // } = store.getState();
  // Function to get cookie value by name
  const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const cookieValue = parts.pop()?.split(';')?.shift();
        return cookieValue;
    }
    return undefined; // Explicitly return undefined if the cookie is not found
  };

  const access_token = getCookie('accessTokenAuction');

  if (access_token) {
    const response: Response = yield AxiosInstance.post(endpoint, body);

    // const data: ApiResponse<object> = yield call([response, response.json]);
    // data.getResponse = () => {
    //     return response;
    // };
    return response;
  }
  window.location.href = '/login';
}

export function* apiPostCallAuthen(endpoint: string, body: object) {
  const response: Response = yield AxiosInstance.post(endpoint, body);
  // const data: ApiResponse<object> = yield call([response, response.json]);
  // data.getResponse = () => {
  //     return response;
  // };
  return response;
}

export function* apiPutCall(endpoint: string, body: object) {
  // const {
  //   auth: { access_token },
  // } = store.getState();

  // Function to get cookie value by name
  const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';')?.shift(); // Using optional chaining
      return undefined; // Explicitly return undefined if the cookie is not found
  };
  // Get the access token from cookies
  const access_token = getCookie('accessTokenAuction');

  if (access_token) {
    const response: Response = yield AxiosInstance.put(endpoint, body);
    // const data: ApiResponse<object> = yield call([response, response.json]);
    // data.getResponse = () => {
    //     return response;
    // };
    return response;
  }
  window.location.href = '/login';
}

export function* apiDeleteCall(endpoint: string, body: object) {
  // const {
  //   auth: { access_token },
  // } = store.getState();

  // Function to get cookie value by name
  const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';')?.shift(); // Using optional chaining
      return undefined; // Explicitly return undefined if the cookie is not found
  };
  // Get the access token from cookies
  const access_token = getCookie('accessTokenAuction');

  if (access_token) {
    const response: Response = yield AxiosInstance.delete(endpoint, body);
    // const data: ApiResponse<object> = yield call([response, response.json]);
    // data.getResponse = () => {
    //     return response;
    // };
    return response;
  }
  window.location.href = '/login';
}
