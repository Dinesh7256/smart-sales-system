import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText } from '@mui/material';

const LowStockAlert = ({ products }) => {
    const lowStockProducts = (products || []).filter(product => product.quantityInStock <= 5);

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" color="error">
                    Low Stock Alerts
                </Typography>
                {lowStockProducts.length === 0 ? (
                    <Typography variant="body2" color="textSecondary">
                        All products are sufficiently stocked.
                    </Typography>
                ) : (
                    <List>
                        {lowStockProducts.map(product => (
                            <ListItem key={product._id}>
                                <ListItemText
                                    primary={product.productName}
                                    secondary={`Stock: ${product.quantityInStock}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </CardContent>
        </Card>
    );
};

export default LowStockAlert;
