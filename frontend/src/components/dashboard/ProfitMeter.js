import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Avatar } from '@mui/material';
import { TrendingUp, TrendingDown, AccountBalanceWallet } from '@mui/icons-material';

const ProfitMeter = ({ sales, expenses }) => {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const recentSales = sales.filter(sale => new Date(sale.date) >= last7Days);
    const totalRevenue = recentSales.reduce((acc, sale) => acc + (sale.totalDailyRevenue || 0), 0);
    const totalProfit = recentSales.reduce((acc, sale) => acc + (sale.totalDailyProfit || 0), 0);

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
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={{ xs: 1.5, sm: 2 }} flexWrap="wrap">
                    <Typography variant={{ xs: 'subtitle1', sm: 'h6' }} fontWeight="600">
                        Weekly Performance
                    </Typography>
                    <Avatar 
                        sx={{ 
                            bgcolor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            width: { xs: 32, sm: 40 },
                            height: { xs: 32, sm: 40 }
                        }}
                    >
                        <AccountBalanceWallet sx={{ fontSize: { xs: 18, sm: 24 } }} />
                    </Avatar>
                </Box>

                <Box textAlign="center" py={{ xs: 1.5, sm: 2 }}>
                    <Box display="flex" alignItems="center" justifyContent="center" mb={1} flexWrap="wrap">
                        {isProfit ? 
                            <TrendingUp sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 20, sm: 24 } }} /> : 
                            <TrendingDown sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 20, sm: 24 } }} />
                        }
                        <Typography variant={{ xs: 'h5', sm: 'h4' }} fontWeight="700" sx={{ wordBreak: 'break-all' }}>
                            ₹{Math.abs(netProfit).toFixed(0)}
                        </Typography>
                    </Box>
                    <Chip 
                        label={isProfit ? 'Profit' : 'Loss'} 
                        size="small"
                        sx={{ 
                            bgcolor: 'rgba(255,255,255,0.2)', 
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            height: { xs: 24, sm: 32 }
                        }} 
                    />
                </Box>

                <Box 
                    display="flex" 
                    justifyContent="space-between" 
                    mt={{ xs: 2, sm: 3 }}
                    gap={{ xs: 1, sm: 2 }}
                >
                    <Box textAlign="center" flex={1}>
                        <Typography variant="body2" sx={{ opacity: 0.9, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Sales</Typography>
                        <Typography variant={{ xs: 'body1', sm: 'h6' }} fontWeight="600" sx={{ wordBreak: 'break-all' }}>₹{totalRevenue.toFixed(0)}</Typography>
                    </Box>
                    <Box textAlign="center" flex={1}>
                        <Typography variant="body2" sx={{ opacity: 0.9, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Expenses</Typography>
                        <Typography variant={{ xs: 'body1', sm: 'h6' }} fontWeight="600" sx={{ wordBreak: 'break-all' }}>₹{totalExpenses.toFixed(0)}</Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ProfitMeter;
