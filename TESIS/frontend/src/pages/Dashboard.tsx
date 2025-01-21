import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import PedidosSummary from '../components/PedidosSummary.tsx';
import Chart from './Chart.tsx';
import { getPedidos, deletePedido } from '../services/pedidoService.ts';
import Title from '../components/Title.tsx';
import { Pedido } from '../interfaces/index.ts';

const Dashboard = () => {
  const [rows, setRows] = useState<Pedido[]>([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const data = await getPedidos();
        setRows(data);
      } catch (error) {
        console.error('Error al obtener los pedidos:', error);
      }
    };

    fetchPedidos();
  }, []);

  const handleDeletePedido = async (id: number) => {
    try {
      await deletePedido(id);
      setRows((prevRows) => prevRows.filter((row) => row.ID_Pedido !== id));
    } catch (error) {
      console.error('Error al eliminar el pedido:', error);
    }
  };

  return (
    <Grid container spacing={3}>
      {/*Pedidos recientes */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <Title>Pedidos</Title>
          <PedidosSummary rows={rows} onDelete={handleDeletePedido} />
        </Paper>
      </Grid>
      {/* Chart grafico */}
      <Grid item xs={12} md={8} lg={9}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 240,
          }}
        >
          <Chart />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
