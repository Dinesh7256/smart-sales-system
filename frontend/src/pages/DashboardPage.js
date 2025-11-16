import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
    Container, Typography, Button, Grid, Box, Card, CardContent, Avatar
} from '@mui/material';
import {
    MenuBook as BahiIcon,
    Add as AddIcon,
    Inventory as InventoryIcon,
    Receipt as ExpenseIcon,
    ExitToApp as LogoutIcon,
    AccountBalanceWallet as ExpenseLogIcon
} from '@mui/icons-material';
import authService from '../services/authService';
import productService from '../services/productService';
import salesService from '../services/salesService';
import ProfitMeter from '../components/dashboard/ProfitMeter';
import LogExpenseModal from '../components/expenses/LogExpenseModal';
import expenseService from '../services/expenseService';
import LowStockAlert from '../components/dashboard/LowStockAlert';
import { Fab } from '@mui/material';

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

    if (loading) {
        return (
            <Box 
                display="flex" 
                flexDirection="column"
                justifyContent="center" 
                alignItems="center" 
                minHeight="100vh"
                sx={{ background: 'linear-gradient(135deg, #4ECDC4 0%, #2A9D8F 100%)' }}
            >
                <Avatar 
                    sx={{ 
                        width: 80, 
                        height: 80, 
                        mb: 2, 
                        bgcolor: 'white',
                        color: 'primary.main'
                    }}
                >
                    <BahiIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h6" color="white" sx={{ fontWeight: 500 }}>
                    Loading your store...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Header */}
            <Card 
                elevation={0} 
                sx={{ 
                    borderRadius: 0, 
                    background: 'linear-gradient(135deg, #4ECDC4 0%, #2A9D8F 100%)',
                    color: 'white',
                    py: 2
                }}
            >
                <Container>
                    <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap={{ xs: 'wrap', sm: 'nowrap' }} gap={2}>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                                <BahiIcon />
                            </Avatar>
                            <Typography variant={{ xs: 'h6', sm: 'h5' }} fontWeight="600">
                                Bahi
                            </Typography>
                        </Box>
                        <Box 
                            display="flex" 
                            gap={{ xs: 0.5, sm: 1 }}
                            flexWrap={{ xs: 'wrap', md: 'nowrap' }}
                            justifyContent={{ xs: 'center', sm: 'flex-end' }}
                            width={{ xs: '100%', sm: 'auto' }}
                        >
                            <Button 
                                component={RouterLink} 
                                to="/sales-pad" 
                                variant="contained"
                                startIcon={<AddIcon />}
                                size="small"
                                sx={{ 
                                    bgcolor: 'success.main',
                                    '&:hover': { bgcolor: 'success.dark' },
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    minWidth: { xs: 'auto', sm: '120px' },
                                    px: { xs: 1, sm: 2 },
                                    height: { xs: 32, sm: 36 },
                                    fontWeight: 'bold'
                                }}
                            >
                                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Smart Sales</Box>
                                <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Quick</Box>
                            </Button>
                            <Button 
                                component={RouterLink} 
                                to="/inventory" 
                                variant="outlined" 
                                startIcon={<InventoryIcon />}
                                size="small"
                                sx={{ 
                                    color: 'white', 
                                    borderColor: 'rgba(255,255,255,0.3)',
                                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    minWidth: { xs: 'auto', sm: '120px' },
                                    px: { xs: 1, sm: 2 },
                                    height: { xs: 32, sm: 36 }
                                }}
                            >
                                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Inventory</Box>
                                <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Inv</Box>
                            </Button>
                            <Button 
                                component={RouterLink} 
                                to="/expenses" 
                                variant="outlined"
                                startIcon={<ExpenseIcon />}
                                size="small"
                                sx={{ 
                                    color: 'white', 
                                    borderColor: 'rgba(255,255,255,0.3)',
                                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    minWidth: { xs: 'auto', sm: '120px' },
                                    px: { xs: 1, sm: 2 },
                                    height: { xs: 32, sm: 36 }
                                }}
                            >
                                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Expenses</Box>
                                <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Exp</Box>
                            </Button>
                            <Button 
                                variant="outlined" 
                                startIcon={<ExpenseLogIcon />}
                                onClick={() => setExpenseModalOpen(true)}
                                size="small"
                                sx={{ 
                                    color: 'white', 
                                    borderColor: 'rgba(255,255,255,0.3)',
                                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    minWidth: { xs: 'auto', sm: '120px' },
                                    px: { xs: 1, sm: 2 },
                                    height: { xs: 32, sm: 36 }
                                }}
                            >
                                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Log Expense</Box>
                                <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Log</Box>
                            </Button>
                            <Button 
                                variant="contained" 
                                startIcon={<LogoutIcon />}
                                onClick={handleLogout}
                                size="small"
                                sx={{ 
                                    bgcolor: 'error.main',
                                    '&:hover': { bgcolor: 'error.dark' },
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    minWidth: { xs: 'auto', sm: '120px' },
                                    px: { xs: 1, sm: 2 },
                                    height: { xs: 32, sm: 36 }
                                }}
                            >
                                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Logout</Box>
                                <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}><LogoutIcon /></Box>
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Card>

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 }, px: { xs: 2, sm: 3 } }}>
                {error && (
                    <Card sx={{ mb: { xs: 2, sm: 3 }, bgcolor: 'error.light', color: 'error.contrastText' }}>
                        <CardContent sx={{ py: { xs: 1, sm: 2 } }}>
                            <Typography variant="body2">{error}</Typography>
                        </CardContent>
                    </Card>
                )}
                
                <Grid container spacing={{ xs: 2, sm: 3 }}>
                    <Grid item xs={12} md={6}>
                        <ProfitMeter sales={sales} expenses={expenses} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <LowStockAlert products={products} />
                    </Grid>
                </Grid>
            </Container>

            {/* Add Sale FAB */}
            <Fab
                color="primary"
                aria-label="add sale"
                component={RouterLink}
                to="/add-sale"
                size="medium"
                sx={{ 
                    position: 'fixed', 
                    bottom: { xs: 16, sm: 24 }, 
                    right: { xs: 16, sm: 24 },
                    background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E8E 90%)',
                    '&:hover': {
                        background: 'linear-gradient(45deg, #E55555 30%, #FF6B6B 90%)',
                    },
                    width: { xs: 56, sm: 64 },
                    height: { xs: 56, sm: 64 },
                    zIndex: 1000
                }}
            >
                <AddIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
            </Fab>

            {/* Expense Modal */}
            <LogExpenseModal 
                open={expenseModalOpen} 
                handleClose={() => setExpenseModalOpen(false)} 
                onExpenseLogged={handleExpenseLogged} 
            />
        </Box>
    );
};

export default DashboardPage;
