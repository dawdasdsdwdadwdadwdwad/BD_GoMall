import axios from "axios";
const api = axios.create({
  // baseURL: "http://localhost:8888", // 注释掉baseURL，使用相对路径与Mock匹配
  timeout: 5000,
});

export default api;
