import { useState } from 'react';
import { TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import {Pedido} from '../interfaces/index.ts';

export default function AddPedidoForm({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd: (newPedido: Pedido) => void }) {
  const [ID_Cliente, setID_Cliente] = useState('');
  const [ID_Proveedor, setID_Proveedor] = useState('');
  const [Tipo_Pedido, setTipo_Pedido] = useState('');
  const [Fecha_Pedido, setFecha_Pedido] = useState('');
  const [Fecha_Entrega, setFecha_Entrega] = useState('');
  const [Comentarios, setComentarios] = useState('');
  const [Estado, setEstado] = useState('');

  const handleAdd = () => {
    const newPedido = {
      ID_Cliente: Number(ID_Cliente),
      ID_Proveedor: Number(ID_Proveedor),
      Tipo_Pedido,
      Fecha_Pedido,
      Fecha_Entrega,
      Comentarios,
      Estado,
    };
    console.log('Datos del nuevo pedido:', newPedido);
    onAdd(newPedido);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Agregar Pedido</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Complete el formulario para agregar un nuevo pedido.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="ID Cliente"
          type="number"
          fullWidth
          variant="standard"
          value={ID_Cliente}
          onChange={(e) => setID_Cliente(e.target.value)}
        />
        <TextField
          margin="dense"
          label="ID Proveedor"
          type="number"
          fullWidth
          variant="standard"
          value={ID_Proveedor}
          onChange={(e) => setID_Proveedor(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Tipo Pedido"
          type="text"
          fullWidth
          variant="standard"
          value={Tipo_Pedido}
          onChange={(e) => setTipo_Pedido(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Fecha Pedido"
          type="date"
          fullWidth
          variant="standard"
          InputLabelProps={{
            shrink: true,
          }}
          value={Fecha_Pedido}
          onChange={(e) => setFecha_Pedido(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Fecha Entrega"
          type="date"
          fullWidth
          variant="standard"
          InputLabelProps={{
            shrink: true,
          }}
          value={Fecha_Entrega}
          onChange={(e) => setFecha_Entrega(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Comentarios"
          type="text"
          fullWidth
          variant="standard"
          value={Comentarios}
          onChange={(e) => setComentarios(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Estado"
          type="text"
          fullWidth
          variant="standard"
          value={Estado}
          onChange={(e) => setEstado(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleAdd} color="primary">Agregar</Button>
      </DialogActions>
    </Dialog>
  );
}
