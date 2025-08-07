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

// API service class
class ApiService {
    // Authentication methods
    static async login(email, password) {
        console.log('Attempting login with:', { email });
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, { email, password }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
            const data = handleResponse(response);
            // Lưu token và thông tin user vào localStorage
            if (data.access_token) {
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('token_type', data.token_type);
                localStorage.setItem('isLoggedIn', 'true');
                if (data.user) {
                    localStorage.setItem('user_id', data.user.id);
                    localStorage.setItem('username', data.user.name);
                    localStorage.setItem('email', data.user.email);
                    localStorage.setItem('role', data.user.role);
                }
            }
            return data;
        } catch (error) {
            handleError(error);
        }
    }

    static async register(phone, email, password) {
        console.log('Attempting register with:', { phone, email });
        try {
            const response = await axios.post(`${API_BASE_URL}/register`, { phone, email, password }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
            const data = handleResponse(response);
            // Lưu token và thông tin user vào localStorage
            if (data.access_token) {
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('token_type', data.token_type);
                localStorage.setItem('isLoggedIn', 'true');
                // Lấy thông tin user từ token hoặc tạo mặc định
                const user = {
                    id: data.user?.id || 'new_user',
                    name: data.user?.name || 'New User',
                    email: data.user?.email || email,
                    role: data.user?.role || 'user',
                };
                localStorage.setItem('user_id', user.id);
                localStorage.setItem('username', user.name);
                localStorage.setItem('email', user.email);
                localStorage.setItem('role', user.role);
            }
            // Handle validation errors from backend
            if (data.errors) {
                throw new Error(JSON.stringify(data.errors));
            }
            return data;
        } catch (error) {
            handleError(error);
        }
    }

    static async logout() {
        try {
            const response = await axios.post(`${API_BASE_URL}/logout`, {}, {
                headers: getAuthHeaders(),
            });
            if (response.status === 200) {
                // Clear local storage
                localStorage.removeItem('access_token');
                localStorage.removeItem('token_type');
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('user_id');
                localStorage.removeItem('username');
                localStorage.removeItem('role');
                localStorage.removeItem('email');
                localStorage.removeItem("isLoggedIn");
            }
            return response.data;
        } catch (error) {
            handleError(error);
        }
    }


    // Book methods
    static async getBooks() {
        try {
            const response = await axios.get(`${API_BASE_URL}/reviews_books`);
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    static async getBookById(id) {
        try {
            const response = await axios.get(`${API_BASE_URL}/reviews_books/${id}`);
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    // Category methods
    // static async getCategories() {
    //     try {
    //         const response = await axios.get(`${API_BASE_URL}/categories`, {
    //             headers: getAuthHeaders(),
    //         });
    //         return handleResponse(response);
    //     } catch (error) {
    //         handleError(error);
    //     }
    // }

    // Borrow record methods
    // static async getBorrowRecords() {
    //     try {
    //         const response = await axios.get(`${API_BASE_URL}/borrow-records`, {
    //             headers: getAuthHeaders(),
    //         });
    //         return handleResponse(response);
    //     } catch (error) {
    //         handleError(error);
    //     }
    // }


    static async createBorrowRecord($data) {
        try {
            const response = await axios.post(`${API_BASE_URL}/borrow-records`, $data, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    static async renewBorrowRecord(borrowRecordId) {
            try {
                const response = await axios.post(
                    `${API_BASE_URL}/borrow-records/${borrowRecordId}/renew`,
                    {}, 
                    {
                        headers: getAuthHeaders(), 
                    }
                );
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

    // Reservation methods
    static async createReservation(bookId) {
        try {
            const response = await axios.post(`${API_BASE_URL}/reservations`, { id_book: bookId }, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    static async getUserReservations() {
        try {
            const response = await axios.get(`${API_BASE_URL}/reservations/my`, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    static async cancelReservation(id) {
        try {
            const response = await axios.delete(`${API_BASE_URL}/reservations/${id}/cancel`, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }


    // Notification methods
    static async getNotificationsByUser(userId) {
        const response = await axios.get(`${API_BASE_URL}/notifications/user/${userId}`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    }

    static async getBorrowRecordHistory(id) {
        try {
            const response = await axios.get(`${API_BASE_URL}/borrow-history/${id}`, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    static async updateUserProfile(data) {
        try {
            const response = await axios.post(`${API_BASE_URL}/update-infor`, data, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    static async updateUserAvatar(file) {
        try {
            const formData = new FormData();
            formData.append('avatar', file);
            const response = await axios.post(`${API_BASE_URL}/users/avatar`, formData, {
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'multipart/form-data',
                },
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    static async changePassword(oldPassword, newPassword) {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/change-password`,
                { oldPassword, newPassword },
                { headers: getAuthHeaders() }
            );
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    // Check if user is authenticated
    static isAuthenticated() {
        return localStorage.getItem('access_token') !== null;
    }

    // Get current user info from localStorage
    static getCurrentUser() {
        return {
            id: localStorage.getItem('user_id'),
            name: localStorage.getItem('username'),
            email: localStorage.getItem('email'),
            role: localStorage.getItem('role'),
        };
    }

    // Check if user is admin
    static isAdmin() {
        return localStorage.getItem('role') === 'admin';
    }

    // Check if token is expired
    static isTokenExpired() {
        const token = localStorage.getItem('access_token');
        if (!token) return true;
        try {
            // Decode JWT token to check expiration
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp < currentTime;
        } catch (error) {
            console.error('Error checking token expiration:', error);
            return true;
        }
    }

    // Auto-login if token exists and is valid
    static async checkAuthStatus() {
        const token = localStorage.getItem('access_token');
        if (!token || this.isTokenExpired()) {
            this.logout();
            return false;
        }
        return true;
    }

    static async getMyUserInfor() {
        try {
            const response = await axios.get(`${API_BASE_URL}/user-infor/me`, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    static async getUserInforById(userId) {
        try {
            const response = await axios.get(`${API_BASE_URL}/user-infor/${userId}`, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }

    static async checkEmailExists(email) {
        try {
            const response = await axios.get(`${API_BASE_URL}/check-email-exists/${email}`);
            return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    }
}

export default ApiService; 