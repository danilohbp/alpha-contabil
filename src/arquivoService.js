// src/main/arquivoService.js
const fs = require('fs');
const path = require('path');
const { dialog, app } = require('electron');

const pastaUploads = path.join(app.getPath('userData'), 'uploads');

// Garante que a pasta de uploads exista
if (!fs.existsSync(pastaUploads)) {
  fs.mkdirSync(pastaUploads, { recursive: true });
}

async function escolherEArmazenarArquivo() {
  const resultado = await dialog.showOpenDialog({
    properties: ['openFile']
  });

  if (resultado.canceled || resultado.filePaths.length === 0) return null;

  const caminhoOriginal = resultado.filePaths[0];
  const nomeArquivo = path.basename(caminhoOriginal);
  const destino = path.join(pastaUploads, `${Date.now()}-${nomeArquivo}`);

  // Copiar o arquivo para a pasta de uploads
  fs.copyFileSync(caminhoOriginal, destino);

  return {
    nome: nomeArquivo,
    caminho: destino,
  };
}

module.exports = { escolherEArmazenarArquivo };
