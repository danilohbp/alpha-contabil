const { app, BrowserWindow, ipcMain, session } = require('electron');
const { escolherEArmazenarArquivo } = require('./arquivoService');
const path = require('path');
const db = require('./database/database'); // IMPORTANTE: novo módulo aqui!

const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const cspDev = "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; connect-src 'self' https://viacep.com.br ws://localhost:3000";
    const cspProd = "default-src 'self' 'unsafe-inline' data:; connect-src 'self' https://viacep.com.br";
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [isDev ? cspDev : cspProd],
      }
    });
  });

  win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
}

app.whenReady().then(() => {
  createWindow();

  // IPC listeners para clientes
  ipcMain.handle('clientes:criar', (_, cliente) => {
    return db.criarCliente(cliente);
  });

  ipcMain.handle('clientes:listar', () => {
    return db.listarClientes();
  });

  ipcMain.handle('clientes:atualizar', (_, { id, cliente }) => {
    return db.atualizarCliente(id, cliente);
  });

  ipcMain.handle('clientes:excluir', (_, id) => {
    return db.excluirCliente(id);
  });

  // Novo IPC: upload local
  ipcMain.handle('upload-local', async () => {
    return await escolherEArmazenarArquivo();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});