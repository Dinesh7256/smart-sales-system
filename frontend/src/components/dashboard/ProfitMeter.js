import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Avatar } from '@mui/material';
import { TrendingUp, TrendingDown, AccountBalanceWallet } from '@mui/icons-material';

const ProfitMeter = ({ sales, expenses }) => {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const recentSales = sales.filter(sale => new Date(sale.date) >= last7Days);
    const totalProfit = recentSales.reduce((acc, sale) => acc + sale.totalDailyProfit, 0);

    const recentExpenses = (expenses || []).filter(exp => new Date(exp.date) >= last7Days);
    const totalExpenses = recentExpenses.reduce((acc, exp) => acc + Number(exp.amount), 0);

    const netProfit = totalProfit - totalExpenses;
    const isProfit = netProfit >= 0;

    return (
        <Card 
            elevation={2}
            sx={{ 
                background: isProfit 
                    ? 'linear-gradient(135deg, #4ECDC4 0%, #2A9D8F 100%)' 
                    : 'linear-gradient(135deg, #FF6B6B 0%, #E55555 100%)',
                color: 'white'
            }}
        >
            <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="h6" fontWeight="600">
                        Weekly Performance
                    </Typography>
                    <Avatar 
                        sx={{ 
                            bgcolor: 'rgba(255,255,255,0.2)',
                            color: 'white'
                        }}
                    >
                        <AccountBalanceWallet />
                    </Avatar>
                </Box>

                <Box textAlign="center" py={2}>
                    <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                        {isProfit ? <TrendingUp sx={{ mr: 1 }} /> : <TrendingDown sx={{ mr: 1 }} />}
                        <Typography variant="h4" fontWeight="700">
                            ₹{Math.abs(netProfit).toFixed(0)}
                        </Typography>
                    </Box>
                    <Chip 
                        label={isProfit ? 'Profit' : 'Loss'} 
                        size="small"
                        sx={{ 
                            bgcolor: 'rgba(255,255,255,0.2)', 
                            color: 'white',
                            fontWeight: 'bold'
                        }} 
                    />
                </Box>

                <Box display="flex" justifyContent="space-between" mt={3}>
                    <Box textAlign="center">
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>Sales</Typography>
                        <Typography variant="h6" fontWeight="600">₹{totalProfit.toFixed(0)}</Typography>
                    </Box>
                    <Box textAlign="center">
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>Expenses</Typography>
                        <Typography variant="h6" fontWeight="600">₹{totalExpenses.toFixed(0)}</Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ProfitMeter;
