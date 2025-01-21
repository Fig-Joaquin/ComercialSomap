import { isAxiosError } from 'axios';
import api from '../axiosConfig';
import { Pedido } from '../interfaces/index';

const getPedidos = async () => {
  const token = localStorage.getItem('token');
  const response = await api.get('/pedidos', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const addPedido = async (pedido: Pedido) => {
  const token = localStorage.getItem('token');
  console.log('Enviando pedido:', JSON.stringify(pedido, null, 2));
  
  try {
    const response = await api.post('/crear-pedido', pedido, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('Respuesta del servidor:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error('Error al enviar el pedido:', error);
    if (isAxiosError(error)) {
      console.error('Respuesta del servidor:', error.response?.data);
    } else {
      console.error('Error inesperado:', error);
    }
    throw error;
  }
};

const deletePedido = async (id: number) => {
  const token = localStorage.getItem('token');
  await api.delete(`/eliminar-pedido/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export { getPedidos, addPedido, deletePedido };
