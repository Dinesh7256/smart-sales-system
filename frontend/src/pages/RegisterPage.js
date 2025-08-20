import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Link, Paper, Switch, FormControlLabel } from '@mui/material';
import authService from '../services/authService';

const RegisterPage = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [businessName, setBusinessName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLanguageChange = (event) => {
        const lang = event.target.checked ? 'hi' : 'en';
        i18n.changeLanguage(lang);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        try {
            await authService.signup(businessName, email, password);
            navigate('/login'); // Redirect to login page after successful signup
        } catch (err) {
            setError('Registration failed. Please try again.');
            console.error('Registration error:', err);
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper elevation={6} sx={{ borderRadius: 4, width: '100%', p: 4, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="h1" variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                        {t('register.title')}
                    </Typography>
                    <FormControlLabel
                        control={<Switch checked={i18n.language === 'hi'} onChange={handleLanguageChange} />}
                        label={i18n.language === 'hi' ? 'हिंदी' : 'English'}
                        sx={{ mb: 2 }}
                    />
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
                        <TextField
                            margin="normal" required fullWidth autoFocus
                            label={t('register.businessName')}
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            sx={{ borderRadius: 2, background: '#fff' }}
                            InputProps={{ style: { borderRadius: 16 } }}
                        />
                        <TextField
                            margin="normal" required fullWidth
                            label={t('register.email')}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ borderRadius: 2, background: '#fff' }}
                            InputProps={{ style: { borderRadius: 16 } }}
                        />
                        <TextField
                            margin="normal" required fullWidth
                            label={t('register.password')}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ borderRadius: 2, background: '#fff' }}
                            InputProps={{ style: { borderRadius: 16 } }}
                        />
                        {error && <Typography color="error" align="center" sx={{ mt: 2 }}>{error}</Typography>}
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, borderRadius: 3, fontWeight: 600, fontSize: '1rem', boxShadow: 2 }}>
                            {t('register.button')}
                        </Button>
                        <Link component={RouterLink} to="/login" variant="body2" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                            {t('register.backToLogin')}
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default RegisterPage;
