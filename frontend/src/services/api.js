import axios from "axios";
import { logout }
from "../utils/logout";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem(
        "token"
      );

    const publicRoutes = [
      "/auth/login",
      "/auth/register",
    ];

    const isPublicRoute =
      publicRoutes.some((route) =>
        config.url?.includes(route)
      );

    if (isPublicRoute) {
      return config;
    }

    if (!token) {

      logout();

      return Promise.reject(
        new Error(
          "No token found"
        )
      );
    }

    config.headers.Authorization =
      `Bearer ${token}`;

    return config;
  }
);

api.interceptors.response.use(

  (response) => response,

  (error) => {

    if (
      error.response?.status === 401
    ) {
      logout();
    }

    return Promise.reject(
      error
    );
  }
);

export default api;