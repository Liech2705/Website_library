const API_BASE_URL = 'http://127.0.0.1:8000/api';

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
const handleResponse = async (response) => {
    const contentType = response.headers.get('content-type');

    if (!contentType || !contentType.includes('application/json')) {
        // Nếu response không phải JSON, có thể là HTML error page
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200)); // Log first 200 chars
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
};

// API service class
class ApiService {
    // Authentication methods
    static async login(email, password) {
        console.log('Attempting login with:', { email });

        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await handleResponse(response);

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
    }

    static async register(name, email, password) {
        console.log('Attempting register with:', { name, email });

        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await handleResponse(response);

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
    }

    static async logout() {
        const response = await fetch(`${API_BASE_URL}/logout`, {
            method: 'POST',
            headers: getAuthHeaders(),
        });

        if (response.ok) {
            // Clear local storage
            localStorage.removeItem('access_token');
            localStorage.removeItem('token_type');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('user_id');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
            localStorage.removeItem('email');
        }

        return response.json();
    }

    // User methods
    static async getUsers() {
        const response = await fetch(`${API_BASE_URL}/users`, {
            headers: getAuthHeaders(),
        });

        return handleResponse(response);
    }

    static async getUserById(id) {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            headers: getAuthHeaders(),
        });

        return handleResponse(response);
    }

    // Book methods
    static async getBooks() {
        const response = await fetch(`${API_BASE_URL}/reviews_books`, {
            headers: getAuthHeaders(),
        });

        return handleResponse(response);
    }

    static async getBookById(id) {
        const response = await fetch(`${API_BASE_URL}/reviews_books/${id}`, {
            headers: getAuthHeaders(),
        });

        return handleResponse(response);
    }

    // Category methods
    static async getCategories() {
        const response = await fetch(`${API_BASE_URL}/categories`, {
            headers: getAuthHeaders(),
        });

        return handleResponse(response);
    }

    // Author methods
    static async getAuthors() {
        const response = await fetch(`${API_BASE_URL}/authors`, {
            headers: getAuthHeaders(),
        });

        return handleResponse(response);
    }

    // Borrow record methods
    static async getBorrowRecords() {
        const response = await fetch(`${API_BASE_URL}/borrow-records`, {
            headers: getAuthHeaders(),
        });

        return handleResponse(response);
    }

    // Notification methods
    static async getNotifications() {
        const response = await fetch(`${API_BASE_URL}/notifications`, {
            headers: getAuthHeaders(),
        });

        return handleResponse(response);
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
}

export default ApiService; 