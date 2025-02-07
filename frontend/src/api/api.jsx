import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api", // Sesuaikan dengan URL backend Anda
  withCredentials: true, // Jika Anda menggunakan cookies atau session
});

export default axiosInstance;