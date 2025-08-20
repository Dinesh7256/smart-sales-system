import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import productService from '../../services/productService';

const AddProductModal = ({ open, handleClose, onProductAdded }) => {
    const [productName, setProductName] = useState('');
    const [costPrice, setCostPrice] = useState('');
    const [sellingPrice, setSellingPrice] = useState('');
    const [quantityInStock, setQuantityInStock] = useState('');

    const handleSubmit = async () => {
        const productData = { productName, costPrice, sellingPrice, quantityInStock };
        try {
            await productService.addProduct(productData);
            onProductAdded();
            handleClose();
        } catch (error) {
            console.error("Failed to add product", error);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogContent>
                <TextField autoFocus margin="dense" label="Product Name" type="text" fullWidth value={productName} onChange={(e) => setProductName(e.target.value)} />
                <TextField margin="dense" label="Cost Price" type="number" fullWidth value={costPrice} onChange={(e) => setCostPrice(e.target.value)} />
                <TextField margin="dense" label="Selling Price" type="number" fullWidth value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} />
                <TextField margin="dense" label="Quantity in Stock" type="number" fullWidth value={quantityInStock} onChange={(e) => setQuantityInStock(e.target.value)} />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Add Product</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddProductModal;
