import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import store from "./Store";

const AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL_DEV,
  // timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

AxiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // const {
    //   auth: { access_token },
    // } = store.getState();
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";")?.shift(); // Using optional chaining
      return undefined; // Explicitly return undefined if the cookie is not found
    };
    // Get the access token from cookies
    const access_token = getCookie("accessTokenAuction");

    if (access_token)
      config.headers["Authorization"] = `Bearer ${access_token}`;

    return config;
  },
  (err: Error | AxiosError) => Promise.reject(err)
);

// Response interceptor to handle 401 Unauthorized
AxiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      document.cookie =
        "accessTokenAuction=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "myInfo=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      sessionStorage.setItem("reduxState", "{}");
      localStorage.removeItem("accessTokenAuction");
      localStorage.removeItem("myInfo");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default AxiosInstance;
