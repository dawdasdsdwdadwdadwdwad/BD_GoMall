import api from "./config";
export const register = (userData) => {
  return api.post("/api/auth/register", userData);
};
export const login = (userData) => {
  return api.post("/api/auth/login", userData);
};
