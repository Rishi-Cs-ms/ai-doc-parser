import axios from "axios";

/* ---------- API BASE URL ---------- */
const API_BASE_URL = import.meta.env.DEV
    ? "" // Vite dev proxy will handle routes starting with /api
    : "https://ai-doc-parser.rishimajmudar.me/api"; // CloudFront API domain

console.log("Current Environment:", import.meta.env.MODE);
console.log("API Base URL:", API_BASE_URL);

/* ---------- AXIOS INSTANCE ---------- */
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to add the access token to the headers
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("id_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/* ---------- FETCH HELPER ---------- */
export const fetchData = async (endpoint, limit = 20) => {
    try {
        const response = await apiClient.get(`${endpoint}?limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error);
        throw error;
    }
};

export default apiClient;