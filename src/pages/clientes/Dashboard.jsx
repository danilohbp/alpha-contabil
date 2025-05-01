// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import {
  PieChart, Pie, Cell, Legend,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';

const cores = ['#6200ea', '#03dac6', '#ff9800', '#f44336', '#4caf50'];

const Dashboard = () => {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const lista = await window.electron.clientes.listar();
        setClientes(lista);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    };

    fetchDados();
  }, []);

  const contarPorCampo = (campo) => {
    const contagem = {};
    clientes.forEach((c) => {
      const valor = c[campo] || 'Não informado';
      contagem[valor] = (contagem[valor] || 0) + 1;
    });
    return Object.entries(contagem).map(([chave, valor]) => ({
      name: chave,
      value: valor,
    }));
  };

  const dadosTipo = contarPorCampo('tipo').map((item) => ({
    ...item,
    name: item.name === 'CPF'
      ? 'Pessoa Física (CPF)'
      : item.name === 'CNPJ'
      ? 'Pessoa Jurídica (CNPJ)'
      : item.name,
  }));

  const dadosUF = contarPorCampo('uf');
  const dadosCidade = contarPorCampo('cidade')
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5 cidades

  const renderPercentOnly = ({ percent }) => `${(percent * 100).toFixed(0)}%`;

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>Dashboard de Clientes</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Clientes por Tipo</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={dadosTipo}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={renderPercentOnly}
                >
                  {dadosTipo.map((_, i) => (
                    <Cell key={i} fill={cores[i % cores.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Clientes por UF</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={dadosUF}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#03dac6" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Top 5 Cidades</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={dadosCidade} layout="vertical">
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="#ff9800" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;