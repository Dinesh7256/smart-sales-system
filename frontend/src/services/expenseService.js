import axios from 'axios';

const API_URL = 'http://localhost:5001/api/v1';

const getExpenses = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/expenses`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

const addExpense = async (expenseData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/expenses`, expenseData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

const expenseService = {
    getExpenses,
    addExpense,
};

export default expenseService;
