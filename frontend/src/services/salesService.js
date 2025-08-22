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


const addSale = async (saleData) => {
    const token = localStorage.getItem('token');
    const payload = {
        date: new Date().toISOString(),
        itemsSold: saleData
    };
    const response = await axios.post(`${API_URL}/sales`, payload, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

const salesService = {
    getSales,
    addSale,
};

export default salesService;
