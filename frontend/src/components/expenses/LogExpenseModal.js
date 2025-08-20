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
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Log Expense</DialogTitle>
            <DialogContent>
                <TextField autoFocus margin="dense" label="Amount" type="number" fullWidth value={amount} onChange={(e) => setAmount(e.target.value)} />
                <TextField margin="dense" label="Description" type="text" fullWidth value={description} onChange={(e) => setDescription(e.target.value)} />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={loading}>Log Expense</Button>
            </DialogActions>
        </Dialog>
    );
};

export default LogExpenseModal;
