import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import logo from '../assets/logo.png'; // Ajusta la ruta si es necesario

const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setIsDrawerOpen(open);
  };

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        {/* Logo */}
        <Typography variant="h5" color="#D14031" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
  <img src={logo} alt="Somap Logo" style={{ height: '65x', width: '80px'}} />
</Typography>

        {/* Navegación (oculta en pantallas pequeñas) */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            gap: 3,
          }}
        >
          <Button color="inherit">Inicio</Button>
          <Button color="inherit">Sobre Nosotros</Button>
          <Button color="inherit">Productos</Button>
          <Button color="inherit">Contacto</Button>
        </Box>

        {/* Iconos de acción */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton color="inherit">
            <ShoppingCartIcon />
          </IconButton>
          <IconButton color="inherit">
            <AccountCircleIcon />
          </IconButton>

          {/* Menú para pantallas pequeñas */}
          <IconButton
            color="inherit"
            sx={{ display: { xs: 'block', md: 'none' } }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>

      {/* Drawer para navegación en pantallas pequeñas */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{
            width: 250,
          }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {['Home', 'About Us', 'Pages', 'Shop', 'Account'].map(
              (text, index) => (
                <ListItem button key={index}>
                  <ListItemText primary={text} />
                </ListItem>
              )
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;
