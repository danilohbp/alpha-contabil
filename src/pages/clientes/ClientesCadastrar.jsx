import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';

const ClientesCadastrar = () => {
  const location = useLocation(); // <-- Mover aqui para dentro do componente
  const queryParams = new URLSearchParams(location.search);
  const clienteId = queryParams.get('id');

  const [form, setForm] = useState({
    tipo: 'CPF',
    nome: '',
    cpfCnpj: '',
    rg: '',
    inscricaoEstadual: '',
    dataNascimento: '',
    email: '',
    telefone: '',
    cep: '',
    logradouro: '',
    bairro: '',
    cidade: '',
    uf: '',
  });

  const [cepLoading, setCepLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (clienteId) {
      const carregarCliente = async () => {
        try {
          const clientes = await window.electron.clientes.listar();
          const clienteEncontrado = clientes.find(c => c.id === parseInt(clienteId));
  
          if (clienteEncontrado) {
            setForm({
              tipo: clienteEncontrado.tipo || 'CPF',
              nome: clienteEncontrado.nome,
              cpfCnpj: clienteEncontrado.cpf_cnpj,
              email: clienteEncontrado.email,
              telefone: clienteEncontrado.telefone,
              cep: clienteEncontrado.cep || '',
              logradouro: clienteEncontrado.logradouro || '',
              bairro: clienteEncontrado.bairro || '',
              cidade: clienteEncontrado.cidade || '',
              uf: clienteEncontrado.uf || ''
            });
          }          
        } catch (error) {
          console.error('Erro ao carregar cliente:', error);
        }
      };
  
      carregarCliente();
    }
  }, [clienteId]);


  const formatarCPF = (valor) => {
    return valor.replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const formatarCNPJ = (valor) => {
    return valor.replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  };

  const formatarTelefone = (valor) => {
    return valor.replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d{5})(\d{4})$/, '$1-$2');
  };

  const validarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (sum % 11);
    if (rev >= 10) rev = 0;
    if (rev !== parseInt(cpf.charAt(9))) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (sum % 11);
    if (rev >= 10) rev = 0;
    return rev === parseInt(cpf.charAt(10));
  };

  const validarCNPJ = (cnpj) => {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj.length !== 14) return false;
    let length = cnpj.length - 2;
    let numbers = cnpj.substring(0, length);
    let digits = cnpj.substring(length);
    let sum = 0;
    let pos = length - 7;
    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(digits.charAt(0))) return false;
    length++;
    numbers = cnpj.substring(0, length);
    sum = 0;
    pos = length - 7;
    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    return result === parseInt(digits.charAt(1));
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === 'cpfCnpj') {
      value = form.tipo === 'CPF' ? formatarCPF(value) : formatarCNPJ(value);
    }
    if (name === 'telefone') {
      value = formatarTelefone(value);
    }

    setForm({ ...form, [name]: value });
  };

  const handleBuscarCEP = async () => {
    if (form.cep.replace(/\D/g, '').length !== 8) return;
    try {
      setCepLoading(true);
      console.log(form.cep.replace(/\D/g, ''))
      const response = await fetch(`https://viacep.com.br/ws/${form.cep.replace(/\D/g, '')}/json/`);
      const data = await response.json();
      if (data.erro) {
        throw new Error('CEP não encontrado');
      }
      setForm((prev) => ({
        ...prev,
        logradouro: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        uf: data.uf || '',
      }));
      setSnackbar({ open: true, message: 'Endereço encontrado com sucesso!', severity: 'success' });
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      setSnackbar({ open: true, message: 'Erro ao buscar CEP.', severity: 'error' });
    } finally {
      setCepLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (form.tipo === 'CPF' && !validarCPF(form.cpfCnpj)) {
      setSnackbar({ open: true, message: 'CPF inválido!', severity: 'error' });
      return;
    }
    if (form.tipo === 'CNPJ' && !validarCNPJ(form.cpfCnpj)) {
      setSnackbar({ open: true, message: 'CNPJ inválido!', severity: 'error' });
      return;
    }
  
    try {
      if (clienteId) {
        // Se existe clienteId, é Atualização
        await window.electron.clientes.atualizar(parseInt(clienteId), {
          tipo: form.tipo,
          nome: form.nome,
          cpf_cnpj: form.cpfCnpj,
          email: form.email,
          telefone: form.telefone,
          cep: form.cep,
          logradouro: form.logradouro,
          bairro: form.bairro,
          cidade: form.cidade,
          uf: form.uf
        });
               
        setSnackbar({ open: true, message: 'Cliente atualizado com sucesso!', severity: 'success' });
      } else {
        // Senão, é Cadastro
        await window.electron.clientes.criar({
          tipo: form.tipo,
          nome: form.nome,
          cpf_cnpj: form.cpfCnpj,
          email: form.email,
          telefone: form.telefone,
          cep: form.cep,
          logradouro: form.logradouro,
          bairro: form.bairro,
          cidade: form.cidade,
          uf: form.uf
        });               
        setSnackbar({ open: true, message: 'Cliente cadastrado com sucesso!', severity: 'success' });
      }
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: 'Erro ao salvar cliente.', severity: 'error' });
    }
  };  

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Cadastrar Cliente
      </Typography>

      <Paper sx={{ p: 4 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>

          <TextField select label="Tipo de Cliente" name="tipo" value={form.tipo} onChange={handleChange} fullWidth margin="normal">
            <MenuItem value="CPF">Pessoa Física (CPF)</MenuItem>
            <MenuItem value="CNPJ">Pessoa Jurídica (CNPJ)</MenuItem>
          </TextField>

          <TextField label={form.tipo === 'CPF' ? 'Nome Completo' : 'Razão Social'} name="nome" value={form.nome} onChange={handleChange} fullWidth margin="normal" required />

          <TextField label={form.tipo === 'CPF' ? 'CPF' : 'CNPJ'} name="cpfCnpj" value={form.cpfCnpj} onChange={handleChange} fullWidth margin="normal" required />

          {form.tipo === 'CPF' && (
            <TextField label="RG" name="rg" value={form.rg} onChange={handleChange} fullWidth margin="normal" />
          )}

          {form.tipo === 'CNPJ' && (
            <TextField label="Inscrição Estadual" name="inscricaoEstadual" value={form.inscricaoEstadual} onChange={handleChange} fullWidth margin="normal" />
          )}

          {form.tipo === 'CPF' && (
            <TextField label="Data de Nascimento" name="dataNascimento" type="date" InputLabelProps={{ shrink: true }} value={form.dataNascimento} onChange={handleChange} fullWidth margin="normal" />
          )}

          <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth margin="normal" required />

          <TextField label="Telefone" name="telefone" value={form.telefone} onChange={handleChange} fullWidth margin="normal" required />

          <TextField label="CEP" name="cep" value={form.cep} onChange={handleChange} onBlur={handleBuscarCEP} fullWidth margin="normal" required InputProps={{
            endAdornment: cepLoading && <CircularProgress size={20} />
          }} />

          <TextField label="Logradouro" name="logradouro" value={form.logradouro} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Bairro" name="bairro" value={form.bairro} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Cidade" name="cidade" value={form.cidade} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="UF" name="uf" value={form.uf} onChange={handleChange} fullWidth margin="normal" />

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
            Salvar
          </Button>

        </Box>
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClientesCadastrar;