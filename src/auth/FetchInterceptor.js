import axios from "axios";
import { API_BASE_URL } from "configs/AppConfig";
import history from "../history";
import { AUTH_TOKEN } from "redux/constants/Auth";
import { notification } from "antd";

const service = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

// Config
const ENTRY_ROUTE = "/auth/login";
const TOKEN_PAYLOAD_KEY = "authorization";
const PUBLIC_REQUEST_KEY = "public-request";

// API Request interceptor
service.interceptors.request.use(
  (config) => {
    const jwtToken = localStorage.getItem(AUTH_TOKEN);

    if (jwtToken) {
      config.headers[TOKEN_PAYLOAD_KEY] = jwtToken;
    }

    if (!jwtToken && !config.headers[PUBLIC_REQUEST_KEY]) {
      history.push(ENTRY_ROUTE);
      window.location.reload();
    }

    return config;
  },
  (error) => {
    // Do something with request error here
    notification.error({
      message: "Error",
    });
    Promise.reject(error);
  }
);

// API respone interceptor
service.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    let notificationParam = {
      message: "",
    };

    // Remove token and redirect
    if (error.response.status === 400 || error.response.status === 403) {
      notificationParam.message = "Authentication Fail";
      notificationParam.description = "Please login again";
      localStorage.removeItem(AUTH_TOKEN);
      history.push(ENTRY_ROUTE);
      window.location.reload();
    }

    if (error.response.status === 404) {
      notificationParam.message = "Not Found";
    }

    if (error.response.status === 500) {
      notificationParam.message = "Internal Server Error";
    }

    if (error.response.status === 508) {
      notificationParam.message = "Time Out";
    }

    notification.error(notificationParam);

    return Promise.reject(error);
  }
);

export class Api {
	
  async get(moduleName, data = {}) {
    try {
      const response = await service.post("/api/" + moduleName + "/get", data)
        .catch((e) => {});

      return response.data;
    } catch (e) {
      if (
        e?.response?.data?.message ||
        e?.response?.data?.errors ||
        e?.response?.data?.errors
      ) {
        return e.response.data;
      } else {
        return { success: false, message: "Error in getting" };
      }
    }
  }

  async getSingle(moduleName, data = {}) {
    try {
      const response = await service.post("/api/" + moduleName + "/getSingle", data);
      return response.data;
    } catch (e) {
      if (
        e?.response?.data?.message ||
        e?.response?.data?.errors ||
        e?.response?.data?.errors
      ) {
        return e.response.data;
      } else {
        return { success: false, message: "Error in getting" };
      }
    }
  }

  async customRoute(route, data = {}) {
    try {
      const response = await service.post("/api/" + route, data);
      return response.data;
    } catch (e) {
      if (
        e?.response?.data?.message ||
        e?.response?.data?.errors ||
        e?.response?.data?.errors
      ) {
        return e.response.data;
      } else {
        return { success: false, message: "Error in getting" };
      }
    }
  }

  async save(moduleName, data) {
    try {
      const response = await service.post("/api/" + moduleName + "/create", data)
      return response.data;
    } catch (e) {
      if (e?.response?.data?.message || e?.response?.data?.errors || e?.response?.data?.errors) {
        return e.response.data;
      } else {
        return { success: false, message: "Error in saving" };
      }
    }
  }
  
  async update(moduleName, data, id) {
    try {
      data._id = id;
      const response = await service.post("/api/" + moduleName + "/update", data);
      return response.data;
    } catch (e) {
      if (e?.response?.data?.message || e?.response?.data?.errors || e?.response?.data?.errors) {
        return e.response.data;
      } else {
        return { success: false, message: "Error in saving" };
      }
    }
  }

  async uploadFile(moduleName, data) {
    try {
      const response = await service.post("/api/" + moduleName + "/uploadFile", data);
      return response.data;
    } catch (e) {
      if (e?.response?.data?.message || e?.response?.data?.errors || e?.response?.data?.errors) {
        return e.response.data;
      } else {
        return { success: false, message: "Error in saving" };
      }
    }
  }

  async delete(moduleName, id) {
    try {
      const data = { _id: id }
      const response = await service.post("/api/" + moduleName + "/delete", data);
      return response.data;
    } catch (e) {
      if (e?.response?.data?.message || e?.response?.data?.errors || e?.response?.data?.errors) {
        return e.response.data;
      } else {
        return { success: false, message: "Error in deleting" };
      }
    }
  }

}

export const api = new Api()

export default service;
