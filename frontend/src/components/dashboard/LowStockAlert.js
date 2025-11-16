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
            <Box display="flex" alignItems="center" gap={1} mb={{ xs: 0.5, sm: 1 }} flexWrap="wrap">
                <Typography 
                    variant={{ xs: 'body2', sm: 'subtitle1' }} 
                    fontWeight="600" 
                    color={textColor}
                    sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                >
                    {title}
                </Typography>
                <Chip 
                    label={productList.length} 
                    size="small" 
                    sx={{ 
                        bgcolor: bgColor, 
                        color: 'white', 
                        fontWeight: 'bold',
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        height: { xs: 20, sm: 24 }
                    }}
                />
            </Box>
            {productList.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                    None
                </Typography>
            ) : (
                <List dense={false} sx={{ py: 0 }}>
                    {productList.slice(0, 3).map(product => {
                        const stockStatus = getStockStatus(product.quantityInStock);
                        const StatusIcon = stockStatus.icon;
                        return (
                            <ListItem 
                                key={product._id} 
                                sx={{ 
                                    py: { xs: 1, sm: 0.5 },
                                    px: { xs: 1, sm: 2 },
                                    minHeight: { xs: 56, sm: 48 }
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ 
                                        bgcolor: stockStatus.color, 
                                        width: { xs: 36, sm: 32 }, 
                                        height: { xs: 36, sm: 32 }
                                    }}>
                                        <StatusIcon sx={{ fontSize: { xs: 20, sm: 18 } }} />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography 
                                            variant={{ xs: 'body2', sm: 'body2' }} 
                                            fontWeight="500"
                                            sx={{ 
                                                fontSize: { xs: '0.9rem', sm: '0.875rem' },
                                                lineHeight: 1.2
                                            }}
                                        >
                                            {product.productName}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography 
                                            variant="caption" 
                                            color="text.secondary"
                                            sx={{ fontSize: { xs: '0.75rem', sm: '0.75rem' } }}
                                        >
                                            Stock: {product.quantityInStock}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        );
                    })}
                    {productList.length > 3 && (
                        <Typography 
                            variant="caption" 
                            color="text.secondary" 
                            sx={{ 
                                ml: { xs: 2, sm: 2 },
                                fontSize: { xs: '0.75rem', sm: '0.75rem' },
                                display: 'block',
                                py: 1
                            }}
                        >
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
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={{ xs: 2, sm: 3 }} flexWrap="wrap">
                    <Typography variant={{ xs: 'subtitle1', sm: 'h6' }} fontWeight="600" color="text.primary">
                        Stock Overview
                    </Typography>
                    <Avatar sx={{ 
                        bgcolor: 'primary.main',
                        width: { xs: 32, sm: 40 },
                        height: { xs: 32, sm: 40 }
                    }}>
                        <Inventory2 sx={{ fontSize: { xs: 18, sm: 24 } }} />
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
