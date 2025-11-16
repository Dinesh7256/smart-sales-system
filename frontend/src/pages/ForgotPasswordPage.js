import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Link, Paper, Backdrop, CircularProgress, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import authService from '../services/authService';

const MIN_LOADING_TIME = 1500;

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage('');
        const start = Date.now();
        try {
            await authService.forgotPassword(email);
            const elapsed = Date.now() - start;
            const delay = Math.max(0, MIN_LOADING_TIME - elapsed);
            setTimeout(() => {
                setLoading(false);
                setMessage('If an account with this email exists, a password reset link has been sent.');
            }, delay);
        } catch (error) {
            const elapsed = Date.now() - start;
            const delay = Math.max(0, MIN_LOADING_TIME - elapsed);
            setTimeout(() => {
                setLoading(false);
                setMessage('An error occurred. Please try again.');
            }, delay);
            console.error('Forgot password error:', error);
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, width: '100%' }}>
                        <IconButton 
                            onClick={() => navigate(-1)}
                            sx={{ 
                                color: 'text.primary',
                                '&:hover': { bgcolor: 'action.hover' }
                            }}
                        >
                            <ArrowBack />
                        </IconButton>
                        <Typography component="h1" variant="h5" sx={{ flex: 1, textAlign: 'center' }}>
                            Forgot Your Password?
                        </Typography>
                        <Box sx={{ width: 40 }} />
                    </Box>
                    <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                        Enter your email address and we'll send you a link to reset your password.
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
                        <TextField
                            margin="normal" required fullWidth autoFocus
                            label="Email Address" type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ borderRadius: 2, background: '#fff' }}
                            InputProps={{ style: { borderRadius: 16 } }}
                        />
                        {message && <Typography color="primary" align="center" sx={{ mt: 2 }}>{message}</Typography>}
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, borderRadius: 3, fontWeight: 600, fontSize: '1rem', boxShadow: 2 }}>
                            Send Reset Link
                        </Button>
                        <Link component={RouterLink} to="/login" variant="body2" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                            Back to Login
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default ForgotPasswordPage;
