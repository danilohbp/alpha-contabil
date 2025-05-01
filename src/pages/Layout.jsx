// src/pages/Layout.jsx
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DescriptionIcon from '@mui/icons-material/Description';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const drawerWidth = 240;

const Layout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = useState(true);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const handleLogoutConfirm = () => {
    logout();
    navigate('/login');
  };

  const openLogoutDialog = () => {
    setLogoutDialogOpen(true);
  };

  const closeLogoutDialog = () => {
    setLogoutDialogOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* AppBar no topo */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={toggleDrawer} sx={{ mr: 2 }}>
            {openDrawer ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Alpha Contábil
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button color="inherit" onClick={openLogoutDialog}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Drawer lateral */}
      <Drawer
        variant="persistent"
        open={openDrawer}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem button component={NavLink} to="clientes/dashboard">
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={NavLink} to="clientes/listar">
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Listar Clientes" />
            </ListItem>
            <ListItem button component={NavLink} to="clientes/cadastrar">
              <ListItemIcon>
                <PersonAddIcon />
              </ListItemIcon>
              <ListItemText primary="Cadastrar Cliente" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Conteúdo principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          transition: (theme) => theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar /> {/* Espaço reservado para o AppBar */}
        <Outlet />
      </Box>

      {/* Dialog de confirmação de Logout */}
      <Dialog
        open={logoutDialogOpen}
        onClose={closeLogoutDialog}
      >
        <DialogTitle>Confirmar Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja sair do sistema?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeLogoutDialog}>Cancelar</Button>
          <Button onClick={handleLogoutConfirm} color="primary" variant="contained">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Layout;