import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Box, Button, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AddProductModal from '../components/inventory/AddProductModal';
import RestockProductModal from '../components/inventory/RestockProductModal';
import productService from '../services/productService';

const InventoryPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [restockModalOpen, setRestockModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            // Check if user is logged in
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("No authentication token found - redirecting to login");
                navigate('/login');
                return;
            }
            
            const response = await productService.getProducts();
            setProducts(response.data);
        } catch (error) {
            console.error("Failed to fetch products", error);
            
            // Handle authentication errors
            if (error.response?.status === 401) {
                console.error("Authentication failed - redirecting to login");
                localStorage.removeItem('token'); // Clear invalid token
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleProductAdded = () => {
        fetchProducts();
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    const handleRestockClick = (product) => {
        setSelectedProduct(product);
        setRestockModalOpen(true);
    };

    const handleRestocked = () => {
        fetchProducts();
    };

    return (
        <Container sx={{ px: { xs: 1, sm: 3 } }}>
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 0 }
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                            my: { xs: 2, sm: 4 },
                            fontSize: { xs: '1.5rem', sm: '2rem' },
                            fontWeight: 'bold',
                            color: 'text.primary'
                        }}
                    >
                        Inventory Management
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    onClick={() => setModalOpen(true)}
                    sx={{
                        height: { xs: 44, sm: 36 },
                        fontSize: { xs: '0.9rem', sm: '0.875rem' },
                        px: { xs: 3, sm: 2 },
                        alignSelf: { xs: 'stretch', sm: 'auto' }
                    }}
                >
                    Add New Product
                </Button>
            </Box>
            <AddProductModal open={modalOpen} handleClose={() => setModalOpen(false)} onProductAdded={handleProductAdded} />
            
            {/* Mobile Card Layout */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                {products.map((product) => (
                    <Paper key={product._id} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '1.1rem' }}>
                                {product.productName}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Cost Price:</Typography>
                                <Typography variant="body2" fontWeight={500}>₹{product.costPrice.toFixed(2)}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Selling Price:</Typography>
                                <Typography variant="body2" fontWeight={500}>₹{product.sellingPrice.toFixed(2)}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Stock:</Typography>
                                <Typography 
                                    variant="body2" 
                                    fontWeight={500}
                                    sx={{ 
                                        color: product.quantityInStock < 10 ? 'error.main' : 'text.primary'
                                    }}
                                >
                                    {product.quantityInStock}
                                </Typography>
                            </Box>
                        </Box>
                        <Button 
                            fullWidth
                            variant="outlined" 
                            onClick={() => handleRestockClick(product)}
                            sx={{ 
                                height: 44,
                                fontSize: '0.9rem',
                                fontWeight: 600
                            }}
                        >
                            Restock
                        </Button>
                    </Paper>
                ))}
            </Box>

            {/* Desktop Table Layout */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Product Name</TableCell>
                                <TableCell align="right">Cost Price (₹)</TableCell>
                                <TableCell align="right">Selling Price (₹)</TableCell>
                                <TableCell align="right">Quantity in Stock</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product._id}>
                                    <TableCell>{product.productName}</TableCell>
                                    <TableCell align="right">{product.costPrice.toFixed(2)}</TableCell>
                                    <TableCell align="right">{product.sellingPrice.toFixed(2)}</TableCell>
                                    <TableCell align="right">{product.quantityInStock}</TableCell>
                                    <TableCell align="center">
                                        <Button size="small" variant="outlined" onClick={() => handleRestockClick(product)}>
                                            Restock
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <RestockProductModal open={restockModalOpen} handleClose={() => setRestockModalOpen(false)} product={selectedProduct} onRestocked={handleRestocked} />
        </Container>
    );
};

export default InventoryPage;
