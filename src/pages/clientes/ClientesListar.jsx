// src/pages/clientes/ClientesListar.jsx
import React, { useState } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Button,
    Collapse,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Input,
    Avatar,
    Snackbar,
    Alert
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useNavigate } from 'react-router-dom';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DownloadIcon from '@mui/icons-material/Download';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';


const ClientesListar = () => {
  const [clientes, setClientes] = useState([]);
  const [clienteExpandido, setClienteExpandido] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [arquivoSelecionado, setArquivoSelecionado] = useState(null);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [dialogExcluirOpen, setDialogExcluirOpen] = useState(false);
  const [clienteParaExcluir, setClienteParaExcluir] = useState(null);  
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchClientes = async () => {
      try {
        const lista = await window.electron.clientes.listar();
        setClientes(lista);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    };
  
    fetchClientes();
  }, []);

  const toggleExpandirCliente = (idCliente) => {
    setClienteExpandido((prev) => (prev === idCliente ? null : idCliente));
  };

  const handleOpenDialog = (clienteId) => {
    setClienteSelecionado(clienteId);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setArquivoSelecionado(null);
  };

  const handleUploadDocumento = async () => {
    try {
      const resultado = await window.electron.clientes.uploadDocumento();
  
      if (resultado?.caminho) {
        const novoDocumento = {
          id: new Date().getTime(),
          nome: resultado.nome,
          url: `file://${resultado.caminho}`, // link local para abrir
        };
  
        setClientes((prevClientes) =>
          prevClientes.map((cliente) =>
            cliente.id === clienteSelecionado
              ? { ...cliente, documentos: [...cliente.documentos, novoDocumento] }
              : cliente
          )
        );
  
        setSnackbar({
          open: true,
          message: 'Documento salvo localmente!',
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Nenhum arquivo selecionado.',
          severity: 'warning',
        });
      }
  
      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao armazenar documento local:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao salvar documento local.',
        severity: 'error',
      });
    }
  };

  const handleBaixarDocumento = (url) => {
    window.open(url, '_blank');
  };

  const confirmarExcluirCliente = (cliente) => {
    setClienteParaExcluir(cliente);
    setDialogExcluirOpen(true);
  };  

  const handleExcluirConfirmado = async () => {
    try {
      await window.electron.clientes.excluir(clienteParaExcluir.id);
      setClientes((prevClientes) => prevClientes.filter((c) => c.id !== clienteParaExcluir.id));
      setDialogExcluirOpen(false);
      setClienteParaExcluir(null);
  
      // Mostrar Snackbar de sucesso
      setSnackbar({ open: true, message: 'Cliente excluído com sucesso!', severity: 'success' });
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      setSnackbar({ open: true, message: 'Erro ao excluir cliente.', severity: 'error' });
    }
  };    

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Listar Clientes
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map((cliente) => (
              <React.Fragment key={cliente.id}>
                <TableRow>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => toggleExpandirCliente(cliente.id)}
                    >
                      {clienteExpandido === cliente.id ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar
                        alt={cliente.nome}
                        src={cliente.avatarUrl || undefined}
                        sx={{
                          width: 40,
                          height: 40,
                          mr: 1,
                          bgcolor: cliente.avatarUrl ? 'transparent' : 'primary.main',
                          fontSize: 16,
                        }}
                      >
                        {!cliente.avatarUrl && cliente.nome
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </Avatar>

                      <Box>
                        <Typography variant="body2">{cliente.nome}</Typography>
                        <Box display="flex" alignItems="center" color="text.secondary" fontSize={12}>
                          {cliente.tipo === 'CPF' ? (
                            <PersonIcon fontSize="small" sx={{ mr: 0.5 }} />
                          ) : (
                            <BusinessIcon fontSize="small" sx={{ mr: 0.5 }} />
                          )}
                          {cliente.tipo}
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>{cliente.telefone}</TableCell>
                  <TableCell align="right">
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    variant="outlined"
                    color="primary"
                    sx={{ mr: 1 }}
                    onClick={() => navigate(`/clientes/cadastrar?id=${cliente.id}`)}
                    >
                    Editar
                    </Button>
                    <Button
                        size="small"
                        startIcon={<DeleteIcon />}
                        variant="outlined"
                        color="error"
                        onClick={() => confirmarExcluirCliente(cliente)}
                        >
                        Excluir
                        </Button>


                  </TableCell>
                </TableRow>

                {/* Linha expandida */}
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                    <Collapse in={clienteExpandido === cliente.id} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 2 }}>
                        <Paper elevation={2} sx={{ p: 2 }}>
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="subtitle1">
                              Documentos
                            </Typography>
                            <Button
                              size="small"
                              variant="contained"
                              startIcon={<FolderOpenIcon />}
                              onClick={() => handleUploadDocumento(cliente.id)}
                            >
                              Adicionar Documento
                            </Button>

                          </Box>

                          {cliente.documentos && cliente.documentos.length > 0 ? (
                            cliente.documentos.map((doc) => (
                              <Box
                                key={doc.id}
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                p={1}
                                mb={1}
                                sx={{
                                  bgcolor: 'background.paper',
                                  borderRadius: 1,
                                  border: '1px solid #ddd',
                                }}
                              >
                                <Box display="flex" alignItems="center">
                                  <InsertDriveFileIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                  <Typography variant="body2">{doc.nome}</Typography>
                                </Box>
                                <Button
                                  size="small"
                                  startIcon={<DownloadIcon />}
                                  variant="outlined"
                                  onClick={() => handleBaixarDocumento(doc.url)}
                                >
                                  Baixar
                                </Button>
                              </Box>
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Nenhum documento disponível.
                            </Typography>
                          )}
                        </Paper>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog Upload */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
  <DialogTitle>Adicionar Documento</DialogTitle>
  <DialogContent>
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ mt: 2, minWidth: 300 }}
    >
      <Typography variant="body2" color="text.secondary" mb={2}>
        O arquivo será selecionado após clicar em "Salvar".
      </Typography>
    </Box>
  </DialogContent>

  <DialogActions>
    <Button onClick={handleCloseDialog}>Cancelar</Button>
    <Button
      onClick={handleUploadDocumento}
      variant="contained"
    >
      Salvar
    </Button>
  </DialogActions>
</Dialog>


      <Dialog
        open={dialogExcluirOpen}
        onClose={() => setDialogExcluirOpen(false)}
        >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <WarningAmberIcon color="warning" fontSize="large" />
            <DialogContentText>
                Tem certeza que deseja excluir o cliente <strong>{clienteParaExcluir?.nome}</strong>?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setDialogExcluirOpen(false)}>
            Cancelar
            </Button>
            <Button 
            onClick={handleExcluirConfirmado} 
            variant="contained" 
            color="error"
            >
            Excluir
            </Button>
        </DialogActions>
        </Dialog>

        <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
            <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
                {snackbar.message}
            </Alert>
        </Snackbar>


    </Box>
  );
};

export default ClientesListar;
