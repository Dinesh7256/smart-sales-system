import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText, TextField, Button, Box, CircularProgress, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import productService from '../services/productService';
import salesService from '../services/salesService';

const AddSalePage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [salesData, setSalesData] = useState({});

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productService.getProducts();
                setProducts(response.data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleQuantityChange = (productId, quantity) => {
        setSalesData(prevData => ({
            ...prevData,
            [productId]: parseInt(quantity, 10) || 0,
        }));
    };

    const handleSubmit = async () => {
        const itemsSold = Object.entries(salesData)
            .filter(([_, quantity]) => quantity > 0)
            .map(([productId, quantitySold]) => ({ productId, quantitySold }));

        if (itemsSold.length === 0) {
            alert("Please enter a quantity for at least one product.");
            return;
        }

        try {
            await salesService.addSale(itemsSold);
            navigate('/dashboard');
        } catch (error) {
            console.error("Failed to add sale", error);
            alert("An error occurred while submitting the sale.");
        }
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    return (
        <Container maxWidth="sm" sx={{ px: { xs: 1, sm: 3 } }}>
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
                    Add Today's Sales
                </Typography>
            </Box>
            <List sx={{ py: 0 }}>
                {products.map((product) => (
                    <ListItem 
                        key={product._id} 
                        divider
                        sx={{
                            py: { xs: 2, sm: 1 },
                            px: { xs: 1, sm: 2 },
                            flexWrap: { xs: 'wrap', sm: 'nowrap' },
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            gap: { xs: 1, sm: 0 }
                        }}
                    >
                        <ListItemText 
                            primary={
                                <Typography 
                                    variant="body1"
                                    sx={{
                                        fontSize: { xs: '1rem', sm: '1rem' },
                                        fontWeight: '500',
                                        mb: { xs: 0.5, sm: 0 }
                                    }}
                                >
                                    {product.productName}
                                </Typography>
                            }
                            secondary={
                                <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                    sx={{ fontSize: { xs: '0.875rem', sm: '0.875rem' } }}
                                >
                                    In Stock: {product.quantityInStock}
                                </Typography>
                            }
                            sx={{ 
                                flex: { xs: '1 1 100%', sm: '1' },
                                mb: { xs: 1, sm: 0 }
                            }}
                        />
                        <TextField
                            type="number"
                            label="Qty Sold"
                            size="small"
                            sx={{ 
                                width: { xs: '120px', sm: '100px' },
                                '& .MuiInputBase-root': {
                                    height: { xs: 48, sm: 40 },
                                    fontSize: { xs: '1rem', sm: '0.875rem' }
                                },
                                '& .MuiInputLabel-root': {
                                    fontSize: { xs: '1rem', sm: '0.875rem' }
                                }
                            }}
                            onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                            inputProps={{ min: 0, max: product.quantityInStock }}
                        />
                    </ListItem>
                ))}
            </List>
            <Button 
                variant="contained" 
                fullWidth 
                sx={{ 
                    mt: { xs: 3, sm: 4 },
                    mb: { xs: 2, sm: 0 },
                    height: { xs: 48, sm: 40 },
                    fontSize: { xs: '1rem', sm: '0.875rem' },
                    fontWeight: '600'
                }}
                onClick={handleSubmit}
            >
                Submit Sale
            </Button>
        </Container>
    );
};

export default AddSalePage;
