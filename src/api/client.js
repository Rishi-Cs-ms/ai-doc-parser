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

// Add a request interceptor to intelligently choose the correct token
// REST API (Cognito User Pool authorizer) → ID Token
// HTTP API (JWT authorizer) → Access Token
apiClient.interceptors.request.use(
    (config) => {
        const url = config.url || "";

        // REST API endpoints (S3 upload)
        const isRestApi = url.startsWith("/upload");

        // Correct token usage
        const token = isRestApi
            ? localStorage.getItem("id_token")      // REST API
            : localStorage.getItem("access_token"); // HTTP API

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
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