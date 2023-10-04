const express = require('express');
const { listarContas, criarConta, atualizarUsuario, deletarConta, verificarSaldo, extrato } = require('./src/controladores/contas');
const { depositar, sacar, transferir } = require('./src/controladores/transacoes');

const rotas = express();

rotas.get('/contas', listarContas);
rotas.post('/contas', criarConta);
rotas.put('/contas/:numeroConta/usuario', atualizarUsuario);
rotas.delete('/contas/:numeroConta', deletarConta);
rotas.post('/transacoes/depositar', depositar);
rotas.post('/transacoes/sacar', sacar);
rotas.post('/transacoes/transferir', transferir);
rotas.get('/contas/saldo', verificarSaldo);
rotas.get('/contas/extrato', extrato);

module.exports = rotas;