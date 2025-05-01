// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
} from '@mui/material';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ usuario: '', senha: '' });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(form.usuario, form.senha);
    if (ok) {
      navigate('/');
    } else {
      setError('Usuário ou senha inválidos');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right, #1e293b, #475569)', // Slate dark gradient
        px: 2,
      }}
    >
      <Paper elevation={6} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" component="h1" align="center" fontWeight="bold" mb={3}>
          Acesso ao Sistema
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            margin="normal"
            label="Usuário"
            variant="outlined"
            value={form.usuario}
            onChange={(e) => setForm({ ...form, usuario: e.target.value })}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Senha"
            type="password"
            variant="outlined"
            value={form.senha}
            onChange={(e) => setForm({ ...form, senha: e.target.value })}
            required
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
          >
            Entrar
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;