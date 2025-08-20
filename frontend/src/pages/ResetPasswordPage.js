import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Paper, Backdrop, CircularProgress } from '@mui/material';
import authService from '../services/authService';

const MIN_LOADING_TIME = 1500;

const ResetPasswordPage = () => {
    const { token } = useParams(); // Gets the token from the URL
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setLoading(true);
        setError('');
        setMessage('');
        const start = Date.now();
        try {
            await authService.resetPassword(token, password);
            const elapsed = Date.now() - start;
            const delay = Math.max(0, MIN_LOADING_TIME - elapsed);
            setTimeout(() => {
                setLoading(false);
                setMessage('Your password has been reset successfully! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            }, delay);
        } catch (err) {
            const elapsed = Date.now() - start;
            const delay = Math.max(0, MIN_LOADING_TIME - elapsed);
            setTimeout(() => {
                setLoading(false);
                setError('Failed to reset password. The link may be invalid or expired.');
            }, delay);
            console.error('Reset password error:', err);
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Backdrop open={loading} sx={{ color: '#1976d2', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <CircularProgress size={64} thickness={5} color="primary" />
                </Box>
            </Backdrop>
            <Paper elevation={6} sx={{ borderRadius: 4, width: '100%', p: 4, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                <Box sx={{ marginTop: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="h1" variant="h5">
                        Reset Your Password
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
                        <TextField
                            margin="normal" required fullWidth
                            label="New Password" type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ borderRadius: 2, background: '#fff' }}
                            InputProps={{ style: { borderRadius: 16 } }}
                        />
                        <TextField
                            margin="normal" required fullWidth
                            label="Confirm New Password" type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            sx={{ borderRadius: 2, background: '#fff' }}
                            InputProps={{ style: { borderRadius: 16 } }}
                        />
                        {error && <Typography color="error" align="center" sx={{ mt: 2 }}>{error}</Typography>}
                        {message && <Typography color="primary" align="center" sx={{ mt: 2 }}>{message}</Typography>}
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, borderRadius: 3, fontWeight: 600, fontSize: '1rem', boxShadow: 2 }}>
                            Reset Password
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default ResetPasswordPage;
