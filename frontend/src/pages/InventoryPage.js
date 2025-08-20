import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Box, Button } from '@mui/material';
import AddProductModal from '../components/inventory/AddProductModal';
import RestockProductModal from '../components/inventory/RestockProductModal';
import productService from '../services/productService';

const InventoryPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [restockModalOpen, setRestockModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await productService.getProducts();
            setProducts(response.data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

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
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ my: 4 }}>
                    Inventory Management
                </Typography>
                <Button variant="contained" onClick={() => setModalOpen(true)}>
                    Add New Product
                </Button>
            </Box>
            <AddProductModal open={modalOpen} handleClose={() => setModalOpen(false)} onProductAdded={handleProductAdded} />
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
            <RestockProductModal open={restockModalOpen} handleClose={() => setRestockModalOpen(false)} product={selectedProduct} onRestocked={handleRestocked} />
        </Container>
    );
};

export default InventoryPage;
