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

    static async updateBook(id, data) {
        try {
            const response = await axios.put(`${API_BASE_URL}/books/${id}`, data, {
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

    static async getBookCopies() {
        try {
            const response = await axios.get(`${API_BASE_URL}/book-copies`, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    static async getBookCopy(id) {
        try {
            const response = await axios.get(`${API_BASE_URL}/book-copies/${id}`, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    static async addBookCopy(data) {
        try {
            const response = await axios.post(`${API_BASE_URL}/book-copies`, data, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    static async updateBookCopy(id, data) {
        try {
            const response = await axios.put(`${API_BASE_URL}/book-copies/${id}`, data, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    static async deleteBookCopy(id) {
        try {
            const response = await axios.delete(`${API_BASE_URL}/book-copies/${id}`, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    static async addBook(data) {
        try {
            const response = await axios.post(`${API_BASE_URL}/books`, data, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    static async addBookAuthor(data) {
        try {
            const response = await axios.post(`${API_BASE_URL}/book-authors`, data, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    static async getBookAuthors() {
        try {
            const response = await axios.get(`${API_BASE_URL}/book-authors`, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    static async deleteBook(id) {
        try {
            const response = await axios.delete(`${API_BASE_URL}/books/${id}`, {
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

    static async approveBorrows(id) {
        try {
            const response = await axios.post(`${API_BASE_URL}/book-copies/${id}/approve`, {}, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    static async rejectBorrowRecords(id, reason) {
        try {
            const response = await axios.post(`${API_BASE_URL}/borrow-records/${id}/reject`, { reason }, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    static async returnBook(id) {
        try {
            const response = await axios.post(`${API_BASE_URL}/borrow-records/${id}/return`, {}, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    // Reservation methods for admin
    static async getReservations() {
        try {
            const response = await axios.get(`${API_BASE_URL}/reservation`, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    static async notifyBookAvailable(id) {
        try {
            const response = await axios.post(`${API_BASE_URL}/reservations/${id}/notify`, {}, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    static async addCategory(data) {
        try {
            const response = await axios.post(`${API_BASE_URL}/categories`, data, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    static async updateCategory(id, data) {
        try {
            const response = await axios.put(`${API_BASE_URL}/categories/${id}`, data, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    static async deleteCategory(id) {
        try {
            const response = await axios.delete(`${API_BASE_URL}/categories/${id}`, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    static async addAuthor(data) {
        try {
            const response = await axios.post(`${API_BASE_URL}/authors`, data, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    static async updateAuthor(id, data) {
        try {
            const response = await axios.put(`${API_BASE_URL}/authors/${id}`, data, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    static async deleteAuthor(id) {
        try {
            const response = await axios.delete(`${API_BASE_URL}/authors/${id}`, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    static async updateUser(id, data) {
        try {
            const response = await axios.put(`${API_BASE_URL}/users/${id}`, data, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    static async addUser(data) {
        try {
            const response = await axios.post(`${API_BASE_URL}/users`, data, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    static async getAdminActivities() {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin-activities`, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    static async getAdminActivitiesByAdminId(adminId) {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin-activities/${adminId}`, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    static async createBorrowFromReservation(id) {
        try {
            const response = await axios.post(`${API_BASE_URL}/reservations/${id}/create-borrow`, {}, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    static async resetPassword(email, newPassword) {
        try {
            const response = await axios.post(`${API_BASE_URL}/users/reset-password`, { email, newPassword }, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    static async renewApprove(id) {
        try {
            const response = await axios.post(`${API_BASE_URL}/borrow-records/${id}/approve`, {}, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    static async renewReject(id, note) {
        try {
            const response = await axios.post(`${API_BASE_URL}/borrow-records/${id}/rejectRenew`, { note }, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }
}

export default ApiServiceAdmin;