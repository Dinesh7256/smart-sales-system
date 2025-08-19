import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';
import authService from '../services/authService';

const DashboardPage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <Container>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px' }}>
                <Typography variant="h4">
                    Welcome to your Dashboard!
                </Typography>
                <Button variant="contained" onClick={handleLogout}>
                    Logout
                </Button>
            </div>
        </Container>
    );
};

export default DashboardPage;
