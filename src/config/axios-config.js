import Axios from "axios";
import auth from "../utils/auth";

Axios.defaults.baseURL =
  process.env.NODE_ENV !== "production"
    ? process.env.REACT_APP_DEV_URL
    : process.env.REACT_APP_SERVER_URL;

const AuthAxios = Axios.create();

AuthAxios.interceptors.request.use(async (config) => {
  let accessToken = await auth.getToken();
  config.headers = {
    Authorization: `Bearer ${accessToken}`,
    // "Accept-Language": window.localStorage.getItem("language"),
  };
  return config;
});

export const axios = Axios;
export const authAxios = AuthAxios;
