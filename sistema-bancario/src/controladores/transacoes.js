const { contas, depositos, saques, transferencias } = require("../../bancodedados");

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;

    if (!numero_conta || !valor) {
        return res.status(400).json({ mensagem: "O número da conta e o valor são obrigatórios!" })
    }

    const conta = contas.find((conta) => {
        return conta.numero === numero_conta;
    })

    if (!conta) {
        return res.status(400).json({ mensagem: "Número da conta inválido" })
    }

    if (valor <= 0) {
        return res.status(400).json({ mensagem: "O valor do depósito deve ser maior que zero!" });
    }

    conta.saldo += valor;

    const data = new Date().toISOString();

    const deposito = {
        data,
        numero_conta,
        valor
    }

    depositos.push(deposito)
    return res.status(204).json();
}

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    if (!numero_conta || !valor || !senha) {
        return res.status(400).json({ mensagem: "O número da conta, o valor e a senha são obrigatórios!" })
    }

    const conta = contas.find((conta) => {
        return conta.numero === numero_conta;
    })

    if (!conta) {
        return res.status(400).json({ mensagem: "Número da conta inválido" })
    }

    if (conta.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: "Senha inválida" })
    }

    if (conta.saldo < valor) {
        return res.status(400).json({ mensagem: "Saldo insuficiente" })
    }

    if (valor <= 0) {
        return res.status(400).json({ mensagem: "O valor não pode ser menor que 0" })
    }

    conta.saldo -= valor;

    const data = new Date().toISOString();

    const saque = {
        data,
        numero_conta,
        valor
    }

    saques.push(saque);
    return res.status(204).send();
}

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_origem) {
        return res.status(400).json({ mensagem: "O número da conta de origem é obrigatório" })
    }
    if (!numero_conta_destino) {
        return res.status(400).json({ mensagem: "O número da conta de destino é obrigatório" })
    }
    if (!valor) {
        return res.status(400).json({ mensagem: "O valor é obrigatório" })
    }
    if (!senha) {
        return res.status(400).json({ mensagem: "A senha é obrigatória" })
    }

    const contaOrigem = contas.find((conta) => {
        return conta.numero === numero_conta_origem;
    })

    if (!contaOrigem) {
        return res.status(400).json({ mensagem: "Número da conta de origem inválido" })
    }

    const contaDestino = contas.find((conta) => {
        return conta.numero === numero_conta_destino;
    })

    if (!contaDestino) {
        return res.status(400).json({ mensagem: "Número da conta de destino inválido" })
    }

    if (contaOrigem.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: "Senha inválida" })
    }

    if (contaOrigem.saldo < valor) {
        return res.status(400).json({ mensagem: "Saldo insuficiente" })
    }

    contaOrigem.saldo -= valor;
    contaDestino.saldo += valor;


    const data = new Date().toISOString();

    transferencias.push({
        data,
        numero_conta_origem,
        numero_conta_destino,
        valor
    })

    return res.status(204).send();
}

module.exports = {
    depositar,
    sacar,
    transferir
}