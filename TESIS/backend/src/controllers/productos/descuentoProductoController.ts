import { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { Descuentos } from '../../entities/productos/descuentoProductoEntity';
import { Productos } from '../../entities/productos/productosEntity';
import { Cliente } from '../../entities/clienteEntity';

export const createDescuento = async (req: Request, res: Response) => {
  const { id_producto, id_cliente, porcentaje_descuento, fecha_inicio, fecha_fin } = req.body;

  try {
    const productoRepository = AppDataSource.getRepository(Productos);
    const clienteRepository = AppDataSource.getRepository(Cliente);
    const descuentoRepository = AppDataSource.getRepository(Descuentos);

    // Verificar si el producto existe
    const producto = await productoRepository.findOne({ where: { id_producto } });
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    // Verificar si el cliente existe (si se proporcionó)
    let cliente = null;
    if (id_cliente) {
      cliente = await clienteRepository.findOne({ where: { id_cliente } });
      if (!cliente) {
        return res.status(404).json({ message: 'Cliente no encontrado.' });
      }
    }

    // Crear y guardar el descuento
    const nuevoDescuento = new Descuentos(); // Crear la instancia manualmente
    nuevoDescuento.producto = producto; // Relación cargada completamente
    nuevoDescuento.cliente = cliente; // Relación opcional cargada completamente
    nuevoDescuento.porcentaje_descuento = porcentaje_descuento;
    nuevoDescuento.fecha_inicio = new Date(fecha_inicio);
    nuevoDescuento.fecha_fin = fecha_fin ? new Date(fecha_fin) : null;

    await descuentoRepository.save(nuevoDescuento);

    res.status(201).json({ message: 'Descuento registrado con éxito', descuento: nuevoDescuento });
  } catch (err) {
    console.error('Error al registrar descuento:', err);
    res.status(500).json({ message: 'Error al registrar el descuento' });
  }
};
