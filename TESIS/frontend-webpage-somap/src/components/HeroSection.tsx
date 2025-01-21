import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const HeroSection = () => {
  // Enlaces a imágenes de prueba
  const images = [
    'https://d2w1ef2ao9g8r9.cloudfront.net/otl-images/_1600x897_crop_center-center_82_line/BakeryHero_2022-12-12-210752_zfsl.jpg',
    'https://m.media-amazon.com/images/S/assets.wholefoodsmarket.com//content/df/98/6168c1c449489ffa778a198d6a9a/bakery-hero1500x600-2x-v2._TTW_._CR0,0,3000,1200_._SR2000,800_._QL100_.jpg',
    'https://images.crowdspring.com/blog/wp-content/uploads/2023/05/16174534/bakery-hero.png',
    'https://bimpos.com/sites/default/files/images/posts/french-bakeries-in-london-720x471.jpg',
    'https://images.contentstack.io/v3/assets/bltcedd8dbd5891265b/blt129ac890fccb2073/66707fb996797677dcc35696/bread-hero.jpg',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Función para avanzar a la siguiente imagen
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Función para retroceder a la imagen anterior
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Cambio automático de imágenes cada 10 segundos
  useEffect(() => {
    const interval = setInterval(nextImage, 10000);
    return () => clearInterval(interval); // Limpiar intervalo al desmontar
  }, []);

  return (
    <Box
      sx={{
        height: '45vh',
        position: 'relative',
        backgroundImage: `url(${images[currentImageIndex]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Capa de opacidad */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Oscurecer el fondo
          zIndex: 1,
        }}
      />

      {/* Contenido */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          color: '#fff',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Distribuidora Somap
        </Typography>
        <Typography
          variant="h2"
          sx={{ fontWeight: 'bold', mb: 2 }}
        >
          Tenemos la mayor variedad de <span style={{ color: '#D14031' }}>Productos</span>
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{
            textTransform: 'none',
            fontWeight: 'bold',
          }}
        >
          Ver catálogo
        </Button>
      </Box>

      {/* Botones de navegación */}
      <IconButton
        onClick={prevImage}
        sx={{
          position: 'absolute',
          top: '50%',
          left: 20,
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
          zIndex: 3,
        }}
      >
        <ArrowBackIosIcon />
      </IconButton>

      <IconButton
        onClick={nextImage}
        sx={{
          position: 'absolute',
          top: '50%',
          right: 20,
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
          zIndex: 3,
        }}
      >
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  );
};

export default HeroSection;
