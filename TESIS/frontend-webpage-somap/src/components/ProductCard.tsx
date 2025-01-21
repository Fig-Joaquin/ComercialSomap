import React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActions, Button } from '@mui/material';
import MinimalButton from './Button';

interface ProductProps {
  product: {
    id_producto: number;
    nombre: string;
    descripcion: string;
    precio_venta: string;
    unidad_medida: { nombre: string };
    imagen: string;
  };
}

// Función para formatear el precio
const formatPrecio = (precio: string) => {
  const precioNumerico = parseFloat(precio); // Convertimos el string a número
  return new Intl.NumberFormat('es-CL').format(precioNumerico);
};
const ProductCard: React.FC<ProductProps> = ({ product }) => {
  console.log('Producto recibido en ProductCard:', product);
  // Formateamos el precio para que aparezca con puntos y el símbolo de peso chileno
 

  return (
    <Card
      sx={{
        maxWidth: 345,
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.imagen}
        alt={product.nombre}
      />
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {product.nombre}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {product.descripcion}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Unidad de Medida: {product.unidad_medida.nombre}
        </Typography>
        <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mt: 1 }}>
        ${formatPrecio(product.precio_venta)}
        </Typography>
      </CardContent>
      <CardActions>
      <CardActions>
      <MinimalButton fullWidth>
          Agregar al Carrito
        </MinimalButton>
      </CardActions>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
