import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:8888", // 替换为你的后端服务地址
  timeout: 5000,
});

export default api;
