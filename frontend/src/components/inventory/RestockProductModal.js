import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import productService from '../../services/productService';

const RestockProductModal = ({ open, handleClose, product, onRestocked }) => {
    const [quantity, setQuantity] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await productService.restockProduct(product._id, Number(quantity));
            onRestocked();
            handleClose();
        } catch (error) {
            console.error("Failed to restock product", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Restock Product</DialogTitle>
            <DialogContent>
                <div>Product: <b>{product?.productName}</b></div>
                <TextField autoFocus margin="dense" label="Quantity to Add" type="number" fullWidth value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={loading || !quantity}>Restock</Button>
            </DialogActions>
        </Dialog>
    );
};

export default RestockProductModal;
