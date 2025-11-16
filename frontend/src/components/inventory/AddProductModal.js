import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';
import productService from '../../services/productService';

const AddProductModal = ({ open, handleClose, onProductAdded }) => {
    const [productName, setProductName] = useState('');
    const [costPrice, setCostPrice] = useState('');
    const [sellingPrice, setSellingPrice] = useState('');
    const [quantityInStock, setQuantityInStock] = useState('');
    const [productType, setProductType] = useState('unit');
    const [baseUnit, setBaseUnit] = useState('gram');

    const handleSubmit = async () => {
        const productData = { 
            productName, 
            costPrice, 
            sellingPrice, 
            quantityInStock, 
            productType,
            baseUnit: productType === 'weight' ? baseUnit : 'gram'
        };
        try {
            await productService.addProduct(productData);
            onProductAdded();
            handleClose();
            // Reset form
            setProductName('');
            setCostPrice('');
            setSellingPrice('');
            setQuantityInStock('');
            setProductType('unit');
            setBaseUnit('gram');
        } catch (error) {
            console.error("Failed to add product", error);
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
                Add New Product
            </DialogTitle>
            <DialogContent sx={{ pt: { xs: 1, sm: 2 } }}>
                <TextField 
                    autoFocus 
                    margin="dense" 
                    label="Product Name" 
                    type="text" 
                    fullWidth 
                    value={productName} 
                    onChange={(e) => setProductName(e.target.value)}
                    sx={{
                        mb: 2,
                        '& .MuiInputBase-root': {
                            height: { xs: 52, sm: 48 },
                            fontSize: { xs: '1rem', sm: '0.875rem' }
                        },
                        '& .MuiInputLabel-root': {
                            fontSize: { xs: '1rem', sm: '0.875rem' }
                        }
                    }}
                />
                <TextField 
                    margin="dense" 
                    label="Cost Price" 
                    type="number" 
                    fullWidth 
                    value={costPrice} 
                    onChange={(e) => setCostPrice(e.target.value)}
                    sx={{
                        mb: 2,
                        '& .MuiInputBase-root': {
                            height: { xs: 52, sm: 48 },
                            fontSize: { xs: '1rem', sm: '0.875rem' }
                        },
                        '& .MuiInputLabel-root': {
                            fontSize: { xs: '1rem', sm: '0.875rem' }
                        }
                    }}
                />
                <TextField 
                    margin="dense" 
                    label="Selling Price" 
                    type="number" 
                    fullWidth 
                    value={sellingPrice} 
                    onChange={(e) => setSellingPrice(e.target.value)}
                    sx={{
                        mb: 2,
                        '& .MuiInputBase-root': {
                            height: { xs: 52, sm: 48 },
                            fontSize: { xs: '1rem', sm: '0.875rem' }
                        },
                        '& .MuiInputLabel-root': {
                            fontSize: { xs: '1rem', sm: '0.875rem' }
                        }
                    }}
                />
                <TextField 
                    margin="dense" 
                    label="Quantity in Stock" 
                    type="number" 
                    fullWidth 
                    value={quantityInStock} 
                    onChange={(e) => setQuantityInStock(e.target.value)}
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
                
                <Box sx={{ mt: 2, mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        Product Type
                    </Typography>
                    <FormControl fullWidth>
                        <InputLabel sx={{ fontSize: { xs: '1rem', sm: '0.875rem' } }}>
                            Product Type
                        </InputLabel>
                        <Select
                            value={productType}
                            onChange={(e) => setProductType(e.target.value)}
                            label="Product Type"
                            sx={{
                                '& .MuiInputBase-root': {
                                    height: { xs: 52, sm: 48 },
                                    fontSize: { xs: '1rem', sm: '0.875rem' }
                                }
                            }}
                        >
                            <MenuItem value="unit">Unit Product (pieces, bottles, packets)</MenuItem>
                            <MenuItem value="weight">Weight-Based Product (rice, oil, sugar)</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                
                {productType === 'weight' && (
                    <Box sx={{ mb: 1 }}>
                        <FormControl fullWidth>
                            <InputLabel sx={{ fontSize: { xs: '1rem', sm: '0.875rem' } }}>
                                Base Unit
                            </InputLabel>
                            <Select
                                value={baseUnit}
                                onChange={(e) => setBaseUnit(e.target.value)}
                                label="Base Unit"
                                sx={{
                                    '& .MuiInputBase-root': {
                                        height: { xs: 52, sm: 48 },
                                        fontSize: { xs: '1rem', sm: '0.875rem' }
                                    }
                                }}
                            >
                                <MenuItem value="gram">Gram (for solid items like rice, sugar)</MenuItem>
                                <MenuItem value="ml">Milliliter (for liquids like oil, milk)</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                )}
                
                {productType === 'weight' && (
                    <Box sx={{ p: 1.5, bgcolor: 'info.light', borderRadius: 1, mt: 1 }}>
                        <Typography variant="caption" color="info.contrastText">
                            💡 For weight products: Price should be per KG/Liter, Stock should be total grams/ml
                        </Typography>
                    </Box>
                )}
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
                    variant="contained"
                    sx={{
                        width: { xs: '100%', sm: 'auto' },
                        height: { xs: 44, sm: 36 },
                        fontSize: { xs: '1rem', sm: '0.875rem' }
                    }}
                >
                    Add Product
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddProductModal;
