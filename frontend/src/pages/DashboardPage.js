import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const DashboardPage = () => {
    return (
        <Container maxWidth="md" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper elevation={6} sx={{ borderRadius: 4, width: '100%', p: 4, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h4" sx={{ mt: 4, fontWeight: 600 }}>
                        Welcome to your Dashboard!
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default DashboardPage;
