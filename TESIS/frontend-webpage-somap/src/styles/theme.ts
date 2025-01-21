import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#D14031', // Rojo vibrante
      light: '#FF6E5D', // Rojo claro
      dark: '#A83025', // Rojo oscuro
    },
    secondary: {
      main: '#640C6F', // Morado oscuro
      light: '#8A3A94', // Morado claro
      dark: '#48014B', // Morado profundo
    },
    text: {
      primary: '#333333', // Texto principal (oscuro)
      secondary: '#555555', // Texto secundario (menos oscuro)
      disabled: '#9E9E9E', // Texto deshabilitado
    },
    background: {
      default: '#F9F9F9', // Fondo general (claro)
      paper: '#FFFFFF', // Fondo de tarjetas, papel
    },
    error: {
      main: '#E53935', // Color para errores
    },
    warning: {
      main: '#FFB74D', // Color para advertencias
    },
    info: {
      main: '#29B6F6', // Color para información
    },
    success: {
      main: '#43A047', // Color para éxito
    },
    divider: '#E0E0E0', // Líneas divisorias
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.75rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      color: '#333333',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: '#555555',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
        containedPrimary: {
          backgroundColor: '#D14031',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#A83025',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export default theme;
