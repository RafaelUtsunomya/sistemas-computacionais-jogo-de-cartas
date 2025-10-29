import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7245/api",
});

api.interceptors.request.use((config) => {
  // CORREÇÃO: A chave deve ser "authToken", 
  // que é a mesma usada pelo authService.js e AuthContext.jsx
  const token = localStorage.getItem("authToken"); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
