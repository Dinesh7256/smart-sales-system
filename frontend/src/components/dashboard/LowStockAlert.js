import React from 'react';
import { 
    Card, CardContent, Typography, List, ListItem, 
    ListItemText, Chip, Avatar, Box, ListItemAvatar 
} from '@mui/material';
import { 
    Warning, CheckCircle, Error, Inventory2 
} from '@mui/icons-material';

const LowStockAlert = ({ products }) => {
    const getStockStatus = (quantity) => {
        if (quantity === 0) return { status: 'out', color: '#FF6B6B', icon: Error, label: 'Out of Stock' };
        if (quantity <= 5) return { status: 'low', color: '#FFE66D', icon: Warning, label: 'Low Stock' };
        return { status: 'good', color: '#4ECDC4', icon: CheckCircle, label: 'Good Stock' };
    };

    const categorizeProducts = () => {
        const outOfStock = products.filter(p => p.quantityInStock === 0);
        const lowStock = products.filter(p => p.quantityInStock > 0 && p.quantityInStock <= 5);
        const goodStock = products.filter(p => p.quantityInStock > 5);
        
        return { outOfStock, lowStock, goodStock };
    };

    const { outOfStock, lowStock, goodStock } = categorizeProducts();

    const renderProductList = (productList, title, bgColor, textColor = '#2C3E50') => (
        <Box mb={2}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Typography variant="subtitle1" fontWeight="600" color={textColor}>
                    {title}
                </Typography>
                <Chip 
                    label={productList.length} 
                    size="small" 
                    sx={{ bgcolor: bgColor, color: 'white', fontWeight: 'bold' }}
                />
            </Box>
            {productList.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                    None
                </Typography>
            ) : (
                <List dense>
                    {productList.slice(0, 3).map(product => {
                        const stockStatus = getStockStatus(product.quantityInStock);
                        const StatusIcon = stockStatus.icon;
                        return (
                            <ListItem key={product._id} sx={{ py: 0.5 }}>
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: stockStatus.color, width: 32, height: 32 }}>
                                        <StatusIcon sx={{ fontSize: 18 }} />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography variant="body2" fontWeight="500">
                                            {product.productName}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="caption" color="text.secondary">
                                            Stock: {product.quantityInStock}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        );
                    })}
                    {productList.length > 3 && (
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                            +{productList.length - 3} more
                        </Typography>
                    )}
                </List>
            )}
        </Box>
    );

    return (
        <Card elevation={2}>
            <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                    <Typography variant="h6" fontWeight="600" color="text.primary">
                        Stock Overview
                    </Typography>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <Inventory2 />
                    </Avatar>
                </Box>

                {renderProductList(outOfStock, "Out of Stock", "#FF6B6B")}
                {renderProductList(lowStock, "Low Stock", "#FFE66D")}
                {renderProductList(goodStock, "Good Stock", "#4ECDC4")}

                {products.length === 0 && (
                    <Box textAlign="center" py={3}>
                        <Typography variant="body2" color="text.secondary">
                            No products found
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default LowStockAlert;
