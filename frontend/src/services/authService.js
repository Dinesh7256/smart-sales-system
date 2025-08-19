import axios from 'axios';

const API_URL = 'http://localhost:5001/api/v1'; // Use your backend's port

const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
    });

    // If the login is successful, save the token to local storage
    if (response.data.data) {
        localStorage.setItem('token', response.data.data);
    }

    return response.data;
};

const logout = () => {
    localStorage.removeItem('token');
};

const signup = async (businessName, email, password) => {
    const response = await axios.post(`${API_URL}/signup`, {
        businessName,
        email,
        password,
    });
    return response.data;
};

const authService = {
    login,
    logout,
    signup,
};

export default authService;
