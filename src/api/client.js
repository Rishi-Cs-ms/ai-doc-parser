import axios from 'axios';

const API_BASE_URL = import.meta.env.DEV
    ? '/api'
    : 'https://nvins6vagf.execute-api.ca-central-1.amazonaws.com/prod';

console.log('Current Environment:', import.meta.env.MODE);
console.log('API Base URL:', API_BASE_URL);

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

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
