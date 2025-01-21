import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import ProductList from '../components/ProductList';
import HeroSection from '../components/HeroSection';

const HomePage = () => {
  return (
    <Container>
      <HeroSection />
      {/* Contenedor para centrar el título */}
      <Box
        sx={{
          textAlign: 'center',
          mt: 4,
          mb: 4,
        }}
      >
        <Typography
        variant="h4"
        component="h1"
        color="primary" // Usar el color principal definido en el tema
        sx={{
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontSize: '2.2rem',
        }}
      >
        Productos Destacados
      </Typography>


        {/* Línea decorativa más moderna */}
        <Box
          sx={{
            margin: '0 auto',
            width: '120px', // Línea más ancha
            height: '3px',
            color: 'primary',
            borderRadius: '2px',
            mt: 1,
          }}
        />
      </Box>
      <ProductList />
    </Container>
  );
};

export default HomePage;
