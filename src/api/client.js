import axios from "axios";

/* ---------- API BASE URLs ---------- */
const HTTP_API_BASE_URL = import.meta.env.DEV
    ? "" // Vite dev proxy will handle routes starting with /api
    : "https://88ag9ta6da.execute-api.ca-central-1.amazonaws.com"; // API Gateway for data fetching

const S3_UPLOAD_API_BASE_URL = "https://jlmerqcowe.execute-api.ca-central-1.amazonaws.com";

console.log("Current Environment:", import.meta.env.MODE);
console.log("HTTP API Base URL:", HTTP_API_BASE_URL);
console.log("S3 Upload API Base URL:", S3_UPLOAD_API_BASE_URL);

/* ---------- S3 UPLOAD API CLIENT (ACCESS TOKEN) ---------- */
// HTTP API for S3 upload with JWT authorizer → ACCESS TOKEN
export const s3UploadApiClient = axios.create({
    baseURL: S3_UPLOAD_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

s3UploadApiClient.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("access_token");
        // const idToken = localStorage.getItem("id_token");

        // Send both tokens - API Gateway can use whichever it needs
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        // if (idToken) {
        //     config.headers['X-ID-Token'] = idToken;
        // }

        return config;
    },
    (error) => Promise.reject(error)
);

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
        const idToken = localStorage.getItem("id_token");

        // Send both tokens - API Gateway can use whichever it needs
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        if (idToken) {
            config.headers["x-id-token"] = idToken;
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