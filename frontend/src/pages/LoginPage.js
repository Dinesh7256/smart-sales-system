import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Switch, FormControlLabel, Paper, CircularProgress, Backdrop } from '@mui/material';
import authService from '../services/authService';

const MIN_LOADING_TIME = 1500; // 1.5 seconds for smooth transition

const LoginPage = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLanguageChange = (event) => {
        const lang = event.target.checked ? 'hi' : 'en';
        i18n.changeLanguage(lang);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);
        const start = Date.now();
        try {
            await authService.login(email, password);
            const elapsed = Date.now() - start;
            const delay = Math.max(0, MIN_LOADING_TIME - elapsed);
            setTimeout(() => {
                setLoading(false);
                navigate('/dashboard');
            }, delay);
        } catch (err) {
            const elapsed = Date.now() - start;
            const delay = Math.max(0, MIN_LOADING_TIME - elapsed);
            setTimeout(() => {
                setLoading(false);
                setError(t('login.error'));
            }, delay);
            console.error('Login error:', err);
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Backdrop open={loading} sx={{ color: '#1976d2', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <CircularProgress size={64} thickness={5} color="primary" />
                    <Typography variant="h6" sx={{ mt: 2, color: '#1976d2', fontWeight: 500 }}>
                        {t('login.loading') || 'Logging in...'}
                    </Typography>
                </Box>
            </Backdrop>
            <Paper elevation={6} sx={{ borderRadius: 4, width: '100%', p: 4, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="h1" variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                        {t('login.title')}
                    </Typography>
                    <FormControlLabel
                        control={<Switch onChange={handleLanguageChange} />}
                        label={i18n.language === 'hi' ? 'हिंदी' : 'English'}
                        sx={{ mb: 2 }}
                    />
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label={t('login.email')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ borderRadius: 2, background: '#fff' }}
                            InputProps={{ style: { borderRadius: 16 } }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label={t('login.password')}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ borderRadius: 2, background: '#fff' }}
                            InputProps={{ style: { borderRadius: 16 } }}
                        />
                        {error && (
                            <Typography color="error" align="center" sx={{ mt: 2 }}>
                                {error}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, borderRadius: 3, fontWeight: 600, fontSize: '1rem', boxShadow: 2 }}
                            disabled={loading}
                        >
                            {t('login.button')}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default LoginPage;
