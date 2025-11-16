import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Container, Box, Typography, Button, Grid, Card, CardContent, 
    IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
    Alert, Snackbar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalculatorIcon from '@mui/icons-material/Calculate';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ScaleIcon from '@mui/icons-material/Scale';
import ClearIcon from '@mui/icons-material/Clear';
import BackspaceIcon from '@mui/icons-material/Backspace';
import productService from '../services/productService';
import salesService from '../services/salesService';

const SalesPadPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentValue, setCurrentValue] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [saleType, setSaleType] = useState(''); // 'price' or 'weight'
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch weight-based products
    useEffect(() => {
        const fetchWeightProducts = async () => {
            try {
                setLoading(true);
                const response = await productService.getProductsByType('weight');
                setProducts(response.data || []);
            } catch (err) {
                setError('Failed to load products. Please try again.');
                console.error('Failed to fetch weight products:', err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchWeightProducts();
    }, []);

    // Number pad handlers
    const handleNumberClick = (num) => {
        if (currentValue.length < 8) { // Limit input length
            setCurrentValue(prev => prev === "0" ? num.toString() : prev + num.toString());
        }
    };

    const handleDecimalClick = () => {
        if (!currentValue.includes('.') && currentValue.length > 0) {
            setCurrentValue(prev => prev + '.');
        }
    };

    const handleBackspace = () => {
        setCurrentValue(prev => prev.slice(0, -1));
    };

    const handleClear = () => {
        setCurrentValue("");
        setSelectedProduct(null);
        setSaleType('');
    };

    // Product selection
    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setCurrentValue("");
    };

    // Sale type handlers
    const handleSellByPrice = () => {
        if (!selectedProduct || !currentValue || parseFloat(currentValue) <= 0) {
            setError('Please select a product and enter a valid amount');
            return;
        }
        setSaleType('price');
        setConfirmDialogOpen(true);
    };

    const handleSellByWeight = (unit) => {
        if (!selectedProduct || !currentValue || parseFloat(currentValue) <= 0) {
            setError('Please select a product and enter a valid amount');
            return;
        }
        setSaleType(unit); // 'gram' or 'kg'
        setConfirmDialogOpen(true);
    };

    // Confirm and submit sale
    const confirmSale = async () => {
        try {
            let quantityInGrams;
            const inputValue = parseFloat(currentValue);

            if (saleType === 'price') {
                // Calculate grams from price (sellingPrice is per KG)
                quantityInGrams = (inputValue / selectedProduct.sellingPrice) * 1000;
            } else if (saleType === 'kg') {
                // Convert kg to grams
                quantityInGrams = inputValue * 1000;
            } else {
                // Already in grams
                quantityInGrams = inputValue;
            }

            // Check if enough stock
            if (quantityInGrams > selectedProduct.quantityInStock) {
                setError(`Insufficient stock! Available: ${selectedProduct.quantityInStock}${selectedProduct.baseUnit === 'ml' ? 'ml' : 'g'}`);
                setConfirmDialogOpen(false);
                return;
            }

            // Submit sale with Smart Sales Calculator format
            const saleData = {
                productId: selectedProduct._id,
                saleType: saleType, // 'price', 'gram', or 'kg'
            };

            if (saleType === 'price') {
                // For price-based sales, send the exact price amount
                saleData.totalAmount = parseFloat(currentValue);
                saleData.quantitySold = Math.round(quantityInGrams); // For display/backup
            } else if (saleType === 'grams' || saleType === 'gram') {
                // For gram-based sales
                saleData.saleType = 'grams';
                saleData.quantitySold = Math.round(quantityInGrams);
                saleData.totalAmount = 0; // Backend will calculate
            } else if (saleType === 'kg') {
                // For kg-based sales
                saleData.quantitySold = parseFloat(currentValue); // Keep original kg value
                saleData.totalAmount = 0; // Backend will calculate
            }

            await salesService.addSale([saleData]);

            setSuccessMessage(`Sale recorded successfully! Sold ${Math.round(quantityInGrams)}${selectedProduct.baseUnit === 'ml' ? 'ml' : 'g'} of ${selectedProduct.productName}`);
            
            // Update local product stock (convert grams to kg for weight products)
            const stockToDeduct = selectedProduct.productType === 'weight' ? quantityInGrams / 1000 : quantityInGrams;
            setProducts(prev => prev.map(p => 
                p._id === selectedProduct._id 
                    ? { ...p, quantityInStock: p.quantityInStock - stockToDeduct }
                    : p
            ));

            // Reset state
            handleClear();
            setConfirmDialogOpen(false);

        } catch (err) {
            setError('Failed to record sale. Please try again.');
            console.error('Sale error:', err);
            setConfirmDialogOpen(false);
        }
    };

    // Calculate display values for confirmation
    const getConfirmationDetails = () => {
        if (!selectedProduct || !currentValue) return {};

        const inputValue = parseFloat(currentValue);
        let quantity, price;

        if (saleType === 'price') {
            price = inputValue;
            quantity = (inputValue / selectedProduct.sellingPrice) * 1000;
        } else if (saleType === 'kg') {
            quantity = inputValue * 1000;
            price = (quantity / 1000) * selectedProduct.sellingPrice;
        } else {
            quantity = inputValue;
            price = (quantity / 1000) * selectedProduct.sellingPrice;
        }

        return {
            quantity: Math.round(quantity),
            price: price.toFixed(2),
            unit: selectedProduct.baseUnit === 'ml' ? 'ml' : 'g'
        };
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="h6">Loading Smart Sales Pad...</Typography>
            </Container>
        );
    }

    const confirmDetails = getConfirmationDetails();

    return (
        <Container maxWidth="lg" sx={{ py: 2, px: { xs: 1, sm: 2 } }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <IconButton 
                    onClick={() => navigate(-1)}
                    sx={{ color: 'text.primary' }}
                >
                    <ArrowBackIcon />
                </IconButton>
                <CalculatorIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant={{ xs: 'h5', sm: 'h4' }} sx={{ fontWeight: 'bold', flex: 1 }}>
                    Smart Sales Pad
                </Typography>
                <Chip 
                    label="Quick Sales" 
                    color="primary" 
                    size="small"
                    sx={{ display: { xs: 'none', sm: 'flex' } }}
                />
            </Box>

            <Grid container spacing={{ xs: 2, sm: 3 }}>
                {/* Product Grid */}
                <Grid item xs={12} md={7}>
                    <Card sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ShoppingCartIcon color="primary" />
                                Select Product
                            </Typography>
                            
                            {products.length === 0 ? (
                                <Alert severity="info">
                                    No weight-based products found. Add some loose items like rice, sugar, or oil in inventory first.
                                </Alert>
                            ) : (
                                <Grid container spacing={2}>
                                    {products.map((product) => (
                                        <Grid item xs={6} sm={4} md={3} key={product._id}>
                                            <Button
                                                fullWidth
                                                variant={selectedProduct?._id === product._id ? "contained" : "outlined"}
                                                onClick={() => handleProductClick(product)}
                                                sx={{
                                                    height: { xs: 80, sm: 100 },
                                                    flexDirection: 'column',
                                                    gap: 1,
                                                    textTransform: 'none',
                                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                                    p: 1
                                                }}
                                                color="primary"
                                            >
                                                <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'center' }}>
                                                    {product.productName}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    ₹{product.sellingPrice}/kg
                                                </Typography>
                                                <Typography variant="caption" color={product.quantityInStock < 100 ? "error" : "text.secondary"}>
                                                    Stock: {product.quantityInStock}{product.baseUnit === 'ml' ? 'ml' : 'g'}
                                                </Typography>
                                            </Button>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Calculator Pad */}
                <Grid item xs={12} md={5}>
                    <Card>
                        <CardContent>
                            {/* Display */}
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {selectedProduct ? `Selected: ${selectedProduct.productName}` : 'Select a product first'}
                                </Typography>
                                <Box sx={{
                                    bgcolor: 'grey.100',
                                    p: 2,
                                    borderRadius: 1,
                                    minHeight: 60,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    border: '2px solid',
                                    borderColor: 'primary.main'
                                }}>
                                    <Typography variant="h4" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                                        {currentValue || "0"}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Number Pad */}
                            <Grid container spacing={1} sx={{ mb: 2 }}>
                                {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => (
                                    <Grid item xs={4} key={num}>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            onClick={() => handleNumberClick(num)}
                                            sx={{ height: 50, fontSize: '1.2rem', fontWeight: 'bold' }}
                                        >
                                            {num}
                                        </Button>
                                    </Grid>
                                ))}
                                <Grid item xs={4}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        onClick={() => handleNumberClick(0)}
                                        sx={{ height: 50, fontSize: '1.2rem', fontWeight: 'bold' }}
                                    >
                                        0
                                    </Button>
                                </Grid>
                                <Grid item xs={4}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        onClick={handleDecimalClick}
                                        sx={{ height: 50, fontSize: '1.2rem', fontWeight: 'bold' }}
                                    >
                                        .
                                    </Button>
                                </Grid>
                                <Grid item xs={4}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        onClick={handleBackspace}
                                        sx={{ height: 50 }}
                                        color="warning"
                                    >
                                        <BackspaceIcon />
                                    </Button>
                                </Grid>
                            </Grid>

                            {/* Action Buttons */}
                            <Grid container spacing={1} sx={{ mb: 1 }}>
                                <Grid item xs={12}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={handleSellByPrice}
                                        disabled={!selectedProduct || !currentValue}
                                        startIcon={<MonetizationOnIcon />}
                                        sx={{ 
                                            height: 50, 
                                            fontSize: '1rem', 
                                            fontWeight: 'bold',
                                            bgcolor: 'success.main',
                                            '&:hover': { bgcolor: 'success.dark' }
                                        }}
                                    >
                                        Sell for ₹{currentValue || '0'}
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={() => handleSellByWeight('gram')}
                                        disabled={!selectedProduct || !currentValue}
                                        startIcon={<ScaleIcon />}
                                        sx={{ 
                                            height: 45, 
                                            fontSize: '0.9rem',
                                            bgcolor: 'info.main',
                                            '&:hover': { bgcolor: 'info.dark' }
                                        }}
                                    >
                                        {currentValue || '0'}g
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={() => handleSellByWeight('kg')}
                                        disabled={!selectedProduct || !currentValue}
                                        startIcon={<ScaleIcon />}
                                        sx={{ 
                                            height: 45, 
                                            fontSize: '0.9rem',
                                            bgcolor: 'secondary.main',
                                            '&:hover': { bgcolor: 'secondary.dark' }
                                        }}
                                    >
                                        {currentValue || '0'}kg
                                    </Button>
                                </Grid>
                            </Grid>

                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={handleClear}
                                startIcon={<ClearIcon />}
                                color="error"
                                sx={{ height: 40 }}
                            >
                                Clear All
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Confirmation Dialog */}
            <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
                <DialogTitle>Confirm Sale</DialogTitle>
                <DialogContent>
                    {selectedProduct && (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                {selectedProduct.productName}
                            </Typography>
                            <Typography variant="body1">
                                Quantity: {confirmDetails.quantity}{confirmDetails.unit}
                            </Typography>
                            <Typography variant="body1">
                                Total Price: ₹{confirmDetails.price}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Rate: ₹{selectedProduct.sellingPrice}/kg
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
                    <Button onClick={confirmSale} variant="contained" color="primary">
                        Confirm Sale
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success/Error Messages */}
            <Snackbar 
                open={!!successMessage} 
                autoHideDuration={4000} 
                onClose={() => setSuccessMessage('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" onClose={() => setSuccessMessage('')}>
                    {successMessage}
                </Alert>
            </Snackbar>

            <Snackbar 
                open={!!error} 
                autoHideDuration={4000} 
                onClose={() => setError('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="error" onClose={() => setError('')}>
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default SalesPadPage;