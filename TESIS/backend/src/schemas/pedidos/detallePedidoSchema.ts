import { z } from 'zod';

export const detallePedidoSchema = z.object({
  id_pedido: z.number()
    .int('id_pedido debe ser un número entero')
    .positive('id_pedido debe ser un número positivo') // Estrictamente mayor a 0
    .min(1, 'id_pedido es obligatorio'), // Falta validación para verificar que exista Pedido
  id_producto: z.number()
    .int('id_producto debe ser un número entero')
    .positive('id_producto debe ser un número positivo')
    .min(1, 'id_producto es obligatorio'), // Falta validación para verificar que exista Producto
  cantidad: z.number()
    .int('La cantidad debe ser un número entero')
    .positive('La cantidad debe ser un número positivo')
    .min(1, 'cantidad es obligatorio'),
  precio_total: z.number()
    .positive('El precio_total debe ser un número positivo')
    .min(1, 'precio_total es obligatorio'), // Precio mínimo mayor a 0
  descuento: z.number()
    .min(0, 'El descuento no puede ser negativo') // Mayor o igual a 0
    .max(100, 'El descuento no puede ser mayor a 100')
});

export type DetallePedidoSchema = z.infer<typeof detallePedidoSchema>;
