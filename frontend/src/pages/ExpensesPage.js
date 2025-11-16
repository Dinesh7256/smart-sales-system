import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Box, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import expenseService from '../services/expenseService';

const ExpensesPage = () => {
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await expenseService.getExpenses();
                setExpenses(response.data);
            } catch (error) {
                console.error("Failed to fetch expenses", error);
            } finally {
                setLoading(false);
            }
        };
        fetchExpenses();
    }, []);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    return (
        <Container sx={{ px: { xs: 1, sm: 3 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: { xs: 2, sm: 4 } }}>
                <IconButton 
                    onClick={() => navigate(-1)}
                    sx={{ 
                        color: 'text.primary',
                        '&:hover': { bgcolor: 'action.hover' }
                    }}
                >
                    <ArrowBack />
                </IconButton>
                <Typography 
                    variant={{ xs: 'h5', sm: 'h4' }} 
                    sx={{ 
                        fontSize: { xs: '1.5rem', sm: '2rem' },
                        fontWeight: 'bold',
                        color: 'text.primary'
                    }}
                >
                    Expenses
                </Typography>
            </Box>
            {/* Mobile Card Layout */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                {expenses.map((expense) => (
                    <Paper key={expense._id} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', flex: 1 }}>
                                {expense.description}
                            </Typography>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    fontWeight: 600, 
                                    fontSize: '1.1rem',
                                    color: 'error.main',
                                    ml: 2
                                }}
                            >
                                ₹{expense.amount.toFixed(2)}
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            {new Date(expense.date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            })}
                        </Typography>
                    </Paper>
                ))}
                {expenses.length === 0 && (
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body1" color="text.secondary">
                            No expenses recorded yet.
                        </Typography>
                    </Paper>
                )}
            </Box>

            {/* Desktop Table Layout */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell align="right">Amount (₹)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {expenses.map((expense) => (
                                <TableRow key={expense._id}>
                                    <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{expense.description}</TableCell>
                                    <TableCell align="right">{expense.amount.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
};

export default ExpensesPage;
