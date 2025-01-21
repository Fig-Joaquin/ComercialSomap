import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import Badge from '@mui/material/Badge';
import { useNavigate } from 'react-router-dom';

export function MainListItems(){
  const navigate = useNavigate();
  
  return (
    <React.Fragment>
      <ListItemButton onClick={() => navigate('/Dashboard')}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Panel" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate('/pedidos')}>
        <ListItemIcon>
          <Badge badgeContent={3} color="secondary">
            <LocalShippingIcon />
          </Badge>
        </ListItemIcon>
        <ListItemText primary="Pedidos" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <InventoryIcon />
        </ListItemIcon>
        <ListItemText primary="Inventario" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <LibraryBooksIcon />
        </ListItemIcon>
        <ListItemText primary="Registros" />
      </ListItemButton>
    </React.Fragment>
  );
}

export function SecondaryListItems() {
  return (
    <React.Fragment>
      <ListSubheader component="div" inset>
        Informes
      </ListSubheader>
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Informe Junio" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Informe Mayo" />
      </ListItemButton>
    </React.Fragment>
  );
}
