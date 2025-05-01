// src/pages/documentos/Documentos.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

const Documentos = () => {
  const { idCliente } = useParams();
  const [clienteNome, setClienteNome] = useState('');
  const [documentos, setDocumentos] = useState([]);

  useEffect(() => {
    if (idCliente) {
      // Aqui você poderia fazer um fetch real baseado no idCliente
      console.log('Cliente selecionado:', idCliente);
      setClienteNome(`Cliente ID ${idCliente}`);
      setDocumentos([
        { id: 1, nome: 'Contrato Social.pdf' },
        { id: 2, nome: 'Alvará Funcionamento.pdf' },
      ]);
    }
  }, [idCliente]);

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Documentos do Cliente
      </Typography>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="subtitle1" mb={2}>
          Cliente: {clienteNome}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
          onClick={() => alert('Abrir modal ou página para upload de novo documento')}
        >
          Adicionar Novo Documento
        </Button>

        <List>
          {documentos.map((doc) => (
            <ListItem key={doc.id} divider>
              <ListItemText primary={doc.nome} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Documentos;