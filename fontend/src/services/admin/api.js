import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };
};

// Helper function to handle API responses
const handleResponse = (response) => {
    // Axios trả về response.data trực tiếp
    return response.data;
};

// Helper function to handle errors
const handleError = (error) => {
    if (error.response) {
        // Server trả về response với status code ngoài 2xx
        const data = error.response.data;
        throw new Error(data.message || JSON.stringify(data.errors) || `HTTP ${error.response.status}: ${error.response.statusText}`);
    } else if (error.request) {
        // Request đã gửi nhưng không nhận được response
        throw new Error('No response from server.');
    } else {
        // Lỗi khác
        throw new Error(error.message);
    }
};

class ApiServiceAdmin {

    static async getUsers() {
        try {
            const response = await axios.get(`${API_BASE_URL}/users`, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    static async getCategories() {
        try {
            const response = await axios.get(`${API_BASE_URL}/categories`, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    // Author methods
    static async getAuthors() {
        try {
            const response = await axios.get(`${API_BASE_URL}/authors`, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    // fontend/src/services/api.js
    static async getDashboardSummary() {
        const response = await axios.get(`${API_BASE_URL}/dashboard/summary`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    }

    static async getNewBooks() {
        const response = await axios.get(`${API_BASE_URL}/dashboard/new-books`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    }

    static async getNewReaders() {
        const response = await axios.get(`${API_BASE_URL}/dashboard/new-readers`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    }

    static async getBookStatistics() {
        const response = await axios.get(`${API_BASE_URL}/statistics/books`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    }

    static async getBorrowRecords() {
        const response = await axios.get(`${API_BASE_URL}/borrow-records`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
      }
}

export default ApiServiceAdmin; 