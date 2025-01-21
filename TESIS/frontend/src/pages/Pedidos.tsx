import axios from 'axios';
import { useState, useEffect } from 'react';
import { getPedidos, addPedido, deletePedido } from '../services/pedidoService.ts';
import PedidosSummary from '../components/PedidosSummary';
import AddPedidoForm from '../components/AddPedidoForm.tsx';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import { Pedido } from '../interfaces/index.ts';

export default function Pedidos() {
  const [rows, setRows] = useState<Pedido[]>([]);
  const [filteredRows, setFilteredRows] = useState<Pedido[]>([]);
  const [searchTerm, setSearchTerm] = useState<Pedido[]>([]);
  const [open, setOpen] = useState(false);
  const [reload, setReload] = useState(false)

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const data = await getPedidos();
        setRows(data);
        setFilteredRows(data);
      } catch (error) {
        console.error('Error al obtener los pedidos:', error);
      }
    };

    fetchPedidos();
  }, [reload]);


  const handleAddPedido = async (newPedido: Pedido) => {
    try {
      const addedPedido = await addPedido(newPedido);
      const fullPedido: Pedido = {
        ID_Pedido: addedPedido.ID_Pedido, // Assuming the addedPedido response contains ID_Pedido
        ...newPedido
    };
      setRows((prevRows) => [...prevRows, fullPedido]);
      setFilteredRows((prevRows) => [...prevRows, fullPedido]);
      setTimeout(() => setReload(!reload), 100);
    } catch (error) {
      console.error('Error al agregar el pedido:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Respuesta del servidor:', error.response.data);
      }
    }
  };

  const handleDeletePedido = async (id: number) => {
    try {
      await deletePedido(id);
      setRows((prevRows) => prevRows.filter((row) => row.ID_Pedido !== id));
      setFilteredRows((prevRows) => prevRows.filter((row) => row.ID_Pedido !== id));
    } catch (error) {
      console.error('Error al eliminar el pedido:', error);
    }
  };

  const handleSearch = () => {
    rows.filter((row) =>
      row.toString
    );
    setSearchTerm(searchTerm);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Toolbar sx={{ mb: 2 }}>
        <TextField
          label="Buscar Pedido"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ flexGrow: 1, mr: 2 }}
        />
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Agregar Pedido
        </Button>
      </Toolbar>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <PedidosSummary rows={filteredRows} onDelete={handleDeletePedido} />
          </Paper>
        </Grid>
      </Grid>
      <AddPedidoForm
        open={open}
        onClose={() => setOpen(false)}
        onAdd={handleAddPedido}
      />
    </Container>
  );
}
