import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText, TextField, Button, Box, CircularProgress } from '@mui/material';
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
        <Container maxWidth="sm">
            <Typography variant="h4" sx={{ my: 4 }}>
                Add Today's Sales
            </Typography>
            <List>
                {products.map((product) => (
                    <ListItem key={product._id} divider>
                        <ListItemText 
                            primary={product.productName} 
                            secondary={`In Stock: ${product.quantityInStock}`} 
                        />
                        <TextField
                            type="number"
                            label="Qty Sold"
                            size="small"
                            sx={{ width: '100px' }}
                            onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                            inputProps={{ min: 0, max: product.quantityInStock }}
                        />
                    </ListItem>
                ))}
            </List>
            <Button 
                variant="contained" 
                fullWidth 
                sx={{ mt: 4 }}
                onClick={handleSubmit}
            >
                Submit Sale
            </Button>
        </Container>
    );
};

export default AddSalePage;
