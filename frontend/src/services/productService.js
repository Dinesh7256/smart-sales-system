
import axios from 'axios';
const API_URL = 'http://localhost:5001/api/v1';

const restockProduct = async (productId, quantityToAdd) => {
    const token = localStorage.getItem('token');
    const response = await axios.patch(`${API_URL}/products/${productId}/restock`, { quantityToAdd }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

const getProducts = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/products`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

const addProduct = async (productData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/products`, productData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

const productService = {
    getProducts,
    addProduct,
    restockProduct,
};

export default productService;
