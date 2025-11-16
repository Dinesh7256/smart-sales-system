import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import expenseService from '../../services/expenseService';

const LogExpenseModal = ({ open, handleClose, onExpenseLogged }) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await expenseService.addExpense({ amount, description });
            onExpenseLogged();
            handleClose();
        } catch (error) {
            console.error("Failed to log expense", error);
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
                Log Expense
            </DialogTitle>
            <DialogContent sx={{ pt: { xs: 1, sm: 2 } }}>
                <TextField 
                    autoFocus 
                    margin="dense" 
                    label="Amount (₹)" 
                    type="number" 
                    fullWidth 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
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
                    label="Description" 
                    type="text" 
                    fullWidth 
                    multiline
                    rows={3}
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{
                        '& .MuiInputBase-root': {
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
                    disabled={loading || !amount || !description}
                    variant="contained"
                    sx={{
                        width: { xs: '100%', sm: 'auto' },
                        height: { xs: 44, sm: 36 },
                        fontSize: { xs: '1rem', sm: '0.875rem' }
                    }}
                >
                    {loading ? 'Logging...' : 'Log Expense'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LogExpenseModal;
