import axios from "axios";

/* ---------- API BASE URLs ---------- */
const HTTP_API_BASE_URL = import.meta.env.DEV
    ? "" // Vite dev proxy will handle routes starting with /api
    : "https://ai-doc-parser.rishimajmudar.me/api"; // CloudFront API domain

const REST_API_BASE_URL = "https://8h60njzxe8.execute-api.ca-central-1.amazonaws.com";

console.log("Current Environment:", import.meta.env.MODE);
console.log("HTTP API Base URL:", HTTP_API_BASE_URL);
console.log("REST API Base URL:", REST_API_BASE_URL);

/* ---------- REST API CLIENT (NO AUTH FOR NOW) ---------- */
// REST API for S3 upload - Authorization temporarily disabled
export const restApiClient = axios.create({
    baseURL: REST_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// No interceptor - no authorization header added

/* ---------- HTTP API CLIENT (ACCESS TOKEN) ---------- */
// HTTP API with JWT authorizer → ACCESS TOKEN ONLY
export const httpApiClient = axios.create({
    baseURL: HTTP_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

httpApiClient.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/* ---------- LEGACY DEFAULT EXPORT (HTTP API) ---------- */
// For backward compatibility, default export is the HTTP API client
const apiClient = httpApiClient;

/* ---------- FETCH HELPER ---------- */
export const fetchData = async (endpoint, limit = 20) => {
    try {
        const response = await httpApiClient.get(`${endpoint}?limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error);
        throw error;
    }
};

export default apiClient;