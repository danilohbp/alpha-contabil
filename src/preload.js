const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  clientes: {
    criar: (cliente) => ipcRenderer.invoke('clientes:criar', cliente),
    listar: () => ipcRenderer.invoke('clientes:listar'),
    atualizar: (id, cliente) => ipcRenderer.invoke('clientes:atualizar', { id, cliente }),
    excluir: (id) => ipcRenderer.invoke('clientes:excluir', id),
  }
});