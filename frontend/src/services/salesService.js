import axios from 'axios';

const API_URL = 'http://localhost:5001/api/v1';

const getSales = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/sales`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

const salesService = {
    getSales,
};

export default salesService;
