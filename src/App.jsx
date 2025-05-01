// src/App.jsx
import React from 'react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Layout from './pages/Layout';
import ClientesListar from './pages/clientes/ClientesListar';
import ClientesCadastrar from './pages/clientes/ClientesCadastrar';
import Documentos from './pages/documentos/Documentos';
import Dashboard from './pages/clientes/Dashboard';

// Definindo o tema Material
const theme = createTheme({
  palette: {
    mode: 'light', // ou 'dark' se quiser tema escuro
    primary: {
      main: '#6200ea', // Roxo Material
    },
    secondary: {
      main: '#03dac6', // Ciano Material
    },
    background: {
      default: '#f5f5f5', // Fundo padrão
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AuthProvider>
      <MemoryRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="clientes/dashboard" element={<Dashboard />} />
            <Route path="clientes/listar" element={<ClientesListar />} />
            <Route path="clientes/cadastrar" element={<ClientesCadastrar />} />
            <Route path="documentos/:idCliente" element={<Documentos />} />
            <Route index element={<Navigate to="clientes/dashboard" />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  </ThemeProvider>
);

export default App;