import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import ProductCard from './ProductCard';
import { Grid, Container, CircularProgress } from '@mui/material';

interface Product {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio_venta: string;
  unidad_medida: { nombre: string };
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axiosInstance.get('/productos');
        const productsWithImages = await Promise.all(
          data.map(async (product: Product) => {
            console.log(product.id_producto)
            const { data: images } = await axiosInstance.get(`/producto/${product.id_producto}/imagenes`);
            console.log('Imágenes del producto:', images); // Verifica las imágenes
            return { ...product, imagen: images[0]?.url };
          })
        );
        console.log('Productos con imágenes:', productsWithImages); // Verifica los productos finales
        setProducts(productsWithImages);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);
  

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Grid container spacing={4}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product.id_producto}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductList;
