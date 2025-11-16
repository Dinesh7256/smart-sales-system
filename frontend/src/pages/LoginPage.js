import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Switch, FormControlLabel, Paper, CircularProgress, Backdrop, Link } from '@mui/material';
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
        <Container 
            component="main" 
            maxWidth="xs" 
            sx={{ 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                px: { xs: 2, sm: 3 },
                py: { xs: 2, sm: 0 }
            }}
        >
            <Backdrop open={loading} sx={{ color: '#1976d2', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <CircularProgress size={64} thickness={5} color="primary" />
                </Box>
            </Backdrop>
            <Paper 
                elevation={6} 
                sx={{ 
                    borderRadius: { xs: 3, sm: 4 }, 
                    width: '100%', 
                    p: { xs: 3, sm: 4 }, 
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                    maxWidth: { xs: '100%', sm: '400px' }
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography 
                        component="h1" 
                        variant={{ xs: 'h6', sm: 'h5' }} 
                        sx={{ 
                            mb: 2, 
                            fontWeight: 600,
                            fontSize: { xs: '1.25rem', sm: '1.5rem' },
                            textAlign: 'center'
                        }}
                    >
                        {t('login.title')}
                    </Typography>
                    <FormControlLabel
                        control={<Switch onChange={handleLanguageChange} />}
                        label={i18n.language === 'hi' ? 'हिंदी' : 'English'}
                        sx={{ 
                            mb: 2,
                            '& .MuiFormControlLabel-label': {
                                fontSize: { xs: '0.9rem', sm: '1rem' }
                            }
                        }}
                    />
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label={t('login.email')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ 
                                borderRadius: 2, 
                                background: '#fff',
                                '& .MuiInputBase-root': {
                                    height: { xs: 52, sm: 48 },
                                    fontSize: { xs: '1rem', sm: '0.875rem' }
                                },
                                '& .MuiInputLabel-root': {
                                    fontSize: { xs: '1rem', sm: '0.875rem' }
                                }
                            }}
                            InputProps={{ 
                                style: { 
                                    borderRadius: 16
                                }
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label={t('login.password')}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ 
                                borderRadius: 2, 
                                background: '#fff',
                                '& .MuiInputBase-root': {
                                    height: { xs: 52, sm: 48 },
                                    fontSize: { xs: '1rem', sm: '0.875rem' }
                                },
                                '& .MuiInputLabel-root': {
                                    fontSize: { xs: '1rem', sm: '0.875rem' }
                                }
                            }}
                            InputProps={{ 
                                style: { 
                                    borderRadius: 16
                                }
                            }}
                        />
                        {error && (
                            <Typography 
                                color="error" 
                                align="center" 
                                sx={{ 
                                    mt: 2,
                                    fontSize: { xs: '0.875rem', sm: '0.875rem' }
                                }}
                            >
                                {error}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ 
                                mt: 3, 
                                mb: 2, 
                                borderRadius: 3, 
                                fontWeight: 600, 
                                fontSize: { xs: '1rem', sm: '1rem' }, 
                                boxShadow: 2,
                                height: { xs: 48, sm: 44 }
                            }}
                            disabled={loading}
                        >
                            {t('login.button')}
                        </Button>
                        <Link component={RouterLink} to="/register" variant="body2" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                            {t('registerTitle')}
                        </Link>
                        <Link component={RouterLink} to="/forgot-password" variant="body2" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                            Forgot Password?
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default LoginPage;
