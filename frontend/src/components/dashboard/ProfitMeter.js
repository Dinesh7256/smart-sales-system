import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const ProfitMeter = ({ sales, expenses }) => {
    // Calculate total profit from the last 7 days
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const recentSales = sales.filter(sale => new Date(sale.date) >= last7Days);
    const totalProfit = recentSales.reduce((acc, sale) => acc + sale.totalDailyProfit, 0);

    const recentExpenses = (expenses || []).filter(exp => new Date(exp.date) >= last7Days);
    const totalExpenses = recentExpenses.reduce((acc, exp) => acc + Number(exp.amount), 0);

    const netProfit = totalProfit - totalExpenses;
    const isProfit = netProfit >= 0;
    const displayColor = isProfit ? 'success.main' : 'error.main'; // Green for profit, Red for loss

    return (
        <Card>
            <CardContent>
                <Typography variant="h6">
                    Last 7 Days Performance
                </Typography>
                <Box sx={{
                    my: 2,
                    p: 3,
                    bgcolor: displayColor,
                    color: 'white',
                    borderRadius: 1,
                    textAlign: 'center'
                }}>
                    <Typography variant="h4">
                        {isProfit ? 'Net Profit' : 'Net Loss'}: ₹{Math.abs(netProfit).toFixed(2)}
                    </Typography>
                </Box>
                <Typography variant="body2" align="center">
                    This is your net profit (sales profit minus expenses) over the last week.
                </Typography>
            </CardContent>
        </Card>
    );
};

export default ProfitMeter;
