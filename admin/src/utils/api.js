import axios from "axios";

// Get the token from wherever you store it (e.g., localStorage)
const token = localStorage.getItem("jwt");

const api = axios.create({
  baseURL: "http://127.0.0.1:3000/api/v1",
});

// Use an interceptor to add the token to every request
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default api;
