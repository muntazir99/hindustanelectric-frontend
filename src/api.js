import axios from "axios";

const api = axios.create({
  baseURL: "https://hindustanelectric.onrender.com",
  //baseURL: "http://localhost:5001",

  // base // Update this if the backend URL is different
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
