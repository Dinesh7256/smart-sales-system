import { createTheme } from '@mui/material/styles';

export const groceryTheme = createTheme({
  palette: {
    primary: {
      main: '#FF6B6B', // Coral red
      light: '#FF8E8E',
      dark: '#E55555',
    },
    secondary: {
      main: '#4ECDC4', // Aqua
      light: '#7DD3CA',
      dark: '#3BA99E',
    },
    warning: {
      main: '#FFE66D', // Sunny yellow
      light: '#FFED8A',
      dark: '#E6CC5A',
    },
    background: {
      default: '#F9FAFB', // Very light grey
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C3E50', // Deep navy
      secondary: '#5D6D7E',
    },
    success: {
      main: '#4ECDC4', // Using aqua for good stock
    },
    error: {
      main: '#FF6B6B', // Using coral for out of stock
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#2C3E50',
    },
    h5: {
      fontWeight: 500,
      color: '#2C3E50',
    },
    h6: {
      fontWeight: 500,
      color: '#2C3E50',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 24px rgba(255, 107, 107, 0.3)',
        },
      },
    },
  },
});