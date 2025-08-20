import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Button, Grid, Backdrop, CircularProgress } from '@mui/material';
import authService from '../services/authService';
import productService from '../services/productService';
import salesService from '../services/salesService';
import ProfitMeter from '../components/dashboard/ProfitMeter';
import LogExpenseModal from '../components/expenses/LogExpenseModal';
import expenseService from '../services/expenseService';
import LowStockAlert from '../components/dashboard/LowStockAlert';

const MIN_LOADING_TIME = 1500;

const DashboardPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [sales, setSales] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [expenseModalOpen, setExpenseModalOpen] = useState(false);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            const start = Date.now();
            try {
                const productData = await productService.getProducts();
                setProducts(productData.data);
                const salesData = await salesService.getSales();
                setSales(salesData.data);
                const expenseData = await expenseService.getExpenses();
                setExpenses(expenseData.data);
            } catch (err) {
                setError('Failed to fetch data.');
            } finally {
                const elapsed = Date.now() - start;
                const delay = Math.max(0, MIN_LOADING_TIME - elapsed);
                setTimeout(() => setLoading(false), delay);
            }
        };
        fetchData();
    }, []);

    const handleExpenseLogged = async () => {
        // Refresh expenses after logging
        try {
            const expenseData = await expenseService.getExpenses();
            setExpenses(expenseData.data);
        } catch {}
    };

    return (
        <Container>
            <Backdrop open={loading} sx={{ color: '#1976d2', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress size={64} thickness={5} color="primary" />
            </Backdrop>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px' }}>
                <Typography variant="h4">
                    Welcome to your Dashboard!
                </Typography>
                <div>
                    <Button component={RouterLink} to="/inventory" variant="outlined" sx={{ mr: 2 }}>
                        Manage Inventory
                    </Button>
                    <Button component={RouterLink} to="/expenses" variant="outlined" sx={{ mr: 2 }}>
                        View Expenses
                    </Button>
                    <Button variant="outlined" color="secondary" sx={{ mr: 2 }} onClick={() => setExpenseModalOpen(true)}>
                        Log Expense
                    </Button>
                    <Button variant="contained" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            </div>
            {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
            <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                    <ProfitMeter sales={sales} expenses={expenses} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <LowStockAlert products={products} />
                </Grid>
            </Grid>
            <LogExpenseModal open={expenseModalOpen} handleClose={() => setExpenseModalOpen(false)} onExpenseLogged={handleExpenseLogged} />
        </Container>
    );
};

export default DashboardPage;
