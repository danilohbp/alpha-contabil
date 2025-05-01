const { app } = require('electron');
const Database = require('better-sqlite3');
const path = require('path');

// Caminho seguro para o banco
const dbPath = path.join(app.getPath('userData'), 'alpha-contabil.db');
const db = new Database(dbPath);

// Atualizar estrutura do banco
db.prepare(`
  CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT NOT NULL,
    nome TEXT NOT NULL,
    cpf_cnpj TEXT NOT NULL,
    email TEXT,
    telefone TEXT,
    cep TEXT,
    logradouro TEXT,
    bairro TEXT,
    cidade TEXT,
    uf TEXT,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`).run();

module.exports = {
    criarCliente: ({ tipo, nome, cpf_cnpj, email, telefone, cep, logradouro, bairro, cidade, uf }) => {
        const stmt = db.prepare(`
        INSERT INTO clientes (tipo, nome, cpf_cnpj, email, telefone, cep, logradouro, bairro, cidade, uf)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(tipo, nome, cpf_cnpj, email, telefone, cep, logradouro, bairro, cidade, uf);
    return info.lastInsertRowid;
    },      

  listarClientes: () => {
    return db.prepare(`SELECT * FROM clientes ORDER BY id DESC`).all();
  },

  atualizarCliente: (id, { tipo, nome, cpf_cnpj, email, telefone, cep, logradouro, bairro, cidade, uf }) => {
    const stmt = db.prepare(`
      UPDATE clientes
      SET tipo = ?, nome = ?, cpf_cnpj = ?, email = ?, telefone = ?, cep = ?, logradouro = ?, bairro = ?, cidade = ?, uf = ?
      WHERE id = ?
    `);
    stmt.run(tipo, nome, cpf_cnpj, email, telefone, cep, logradouro, bairro, cidade, uf, id);
  },  

  excluirCliente: (id) => {
    db.prepare(`DELETE FROM clientes WHERE id = ?`).run(id);
  }
};