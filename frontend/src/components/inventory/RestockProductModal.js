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
        <Dialog 
            open={open} 
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    mx: { xs: 1, sm: 2 },
                    my: { xs: 2, sm: 4 },
                    maxHeight: { xs: '90vh', sm: '80vh' }
                }
            }}
        >
            <DialogTitle sx={{ 
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                fontWeight: 600,
                pb: { xs: 1, sm: 2 }
            }}>
                Restock Product
            </DialogTitle>
            <DialogContent sx={{ pt: { xs: 1, sm: 2 } }}>
                <div style={{ 
                    marginBottom: '16px',
                    padding: '12px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px'
                }}>
                    <span style={{ fontSize: '0.875rem' }}>
                        Product: <b>{product?.productName}</b>
                    </span>
                </div>
                <TextField 
                    autoFocus 
                    margin="dense" 
                    label="Quantity to Add" 
                    type="number" 
                    fullWidth 
                    value={quantity} 
                    onChange={(e) => setQuantity(e.target.value)}
                    sx={{
                        '& .MuiInputBase-root': {
                            height: { xs: 52, sm: 48 },
                            fontSize: { xs: '1rem', sm: '0.875rem' }
                        },
                        '& .MuiInputLabel-root': {
                            fontSize: { xs: '1rem', sm: '0.875rem' }
                        }
                    }}
                />
            </DialogContent>
            <DialogActions sx={{ 
                p: { xs: 2, sm: 3 },
                gap: { xs: 1, sm: 0 },
                flexDirection: { xs: 'column-reverse', sm: 'row' }
            }}>
                <Button 
                    onClick={handleClose}
                    sx={{
                        width: { xs: '100%', sm: 'auto' },
                        height: { xs: 44, sm: 36 },
                        fontSize: { xs: '1rem', sm: '0.875rem' }
                    }}
                >
                    Cancel
                </Button>
                <Button 
                    onClick={handleSubmit} 
                    disabled={loading || !quantity}
                    variant="contained"
                    sx={{
                        width: { xs: '100%', sm: 'auto' },
                        height: { xs: 44, sm: 36 },
                        fontSize: { xs: '1rem', sm: '0.875rem' }
                    }}
                >
                    {loading ? 'Restocking...' : 'Restock'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RestockProductModal;
