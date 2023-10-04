let { contas, numeroConta, saques, depositos, transferencias } = require('../../bancodedados');

const listarContas = (req, res) => {
    const { senha_banco } = req.query;
    const senhaValida = "Cubos123Bank";

    if (!senha_banco) {
        return res.status(401).json({ mensagem: "A senha é obrigatória" })
    }

    if (senha_banco !== senhaValida) {
        return res.status(401).json({ mensagem: "A senha do banco informada é inválida!" })
    }

    return res.status(200).json(contas);
}

const criarConta = async (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome) {
        return res.status(400).json({ mensagem: "O nome é obrigatório" })
    }
    if (!cpf) {
        return res.status(400).json({ mensagem: "O CPF é obrigatório" })
    }
    if (!data_nascimento) {
        return res.status(400).json({ mensagem: "A data de nascimento é obrigatória" })
    }
    if (!telefone) {
        return res.status(400).json({ mensagem: "O telefone é obrigatório" })
    }
    if (!email) {
        return res.status(400).json({ mensagem: "O email é obrigatório" })
    }
    if (!senha) {
        return res.status(400).json({ mensagem: "A senha é obrigatória" })
    }

    const verificarCpf = contas.find((conta) => {
        return conta.usuario.cpf === cpf;
    })
    const verificarEmail = contas.find((conta) => {
        return conta.usuario.email === email;
    })

    if (verificarCpf || verificarEmail) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o cpf ou e-mail informado!" })
    }

    const conta = {
        numero: numeroConta++,
        saldo: 0,
        usuario: {
            nome: nome,
            cpf: cpf,
            data_nascimento: data_nascimento,
            telefone: telefone,
            email: email,
            senha: senha
        }
    }
    contas.push(conta)
    return res.status(201).json();

}

const atualizarUsuario = (req, res) => {
    const { numeroConta } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome) {
        return res.status(400).json({ mensagem: "O nome é obrigatório" })
    }
    if (!cpf) {
        return res.status(400).json({ mensagem: "O CPF é obrigatório" })
    }
    if (!data_nascimento) {
        return res.status(400).json({ mensagem: "A data de nascimento é obrigatória" })
    }
    if (!telefone) {
        return res.status(400).json({ mensagem: "O telefone é obrigatório" })
    }
    if (!email) {
        return res.status(400).json({ mensagem: "O email é obrigatório" })
    }
    if (!senha) {
        return res.status(400).json({ mensagem: "A senha é obrigatória" })
    }

    const numeroContaValido = contas.find((conta) => {
        return conta.numero === Number(numeroConta);
    })

    if (!numeroContaValido) {
        return res.status(400).json({ mensagem: "Número da conta inválido" })
    }

    const verificarCpf = contas.find((conta) => {
        return conta.usuario.cpf === cpf;
    })
    const verificarEmail = contas.find((conta) => {
        return conta.usuario.email === email;
    })

    if (verificarCpf || verificarEmail) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o cpf ou e-mail informado!" })
    }

    numeroContaValido.usuario = {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha
    };
    return res.status(204).json()


}

const deletarConta = (req, res) => {
    const { numeroConta } = req.params;

    const numeroContaValido = contas.find((conta) => {
        return conta.numero === Number(numeroConta);
    })

    if (!numeroContaValido) {
        return res.status(400).json({ mensagem: "Número da conta inválido" })
    }

    if (numeroContaValido.saldo !== 0) {
        return res.status(400).json({ mensagem: "A conta só pode ser removida se o saldo for zero!" })
    }

    const index = contas.indexOf(numeroContaValido);
    contas.splice(index, 1);

    return res.status(204).send();
}

const verificarSaldo = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: "O número da conta e a senha são obrigatórios" })
    }

    const numeroContaValido = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    })

    if (!numeroContaValido) {
        return res.status(400).json({ mensagem: "Número da conta inválido" })
    }

    if (Number(senha) !== numeroContaValido.usuario.senha) {
        return res.status(400).json({ mensagem: "Senha inválida" })
    }

    return res.status(200).json(`Saldo: ${numeroContaValido.saldo}`);

}

const extrato = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: "O número da conta e a senha são obrigatórios" })
    }

    const numeroContaValido = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    })

    if (!numeroContaValido) {
        return res.status(400).json({ mensagem: "Número da conta inválido" })
    }

    if (Number(senha) !== numeroContaValido.usuario.senha) {
        return res.status(400).json({ mensagem: "Senha inválida" })
    }

    const depositosRealizados = depositos.filter((deposito) => {
        return deposito.numero_conta === Number(numero_conta);
    })

    const saquesRealizados = saques.filter((saque) => {
        return saque.numero_conta === Number(numero_conta);
    })

    const transferenciasEnviadas = transferencias.filter((transferencia) => {
        return transferencia.numero_conta_origem === Number(numero_conta);
    })

    const transferenciasRecebidas = transferencias.filter((transferencia) => {
        return transferencia.numero_conta_destino === Number(numero_conta);
    })

    const extrato = {
        depositos: depositosRealizados,
        saques: saquesRealizados,
        transferenciasEnviadas,
        transferenciasRecebidas,
    };
    return res.status(200).json(extrato);

}

module.exports = {
    listarContas,
    criarConta,
    atualizarUsuario,
    deletarConta,
    verificarSaldo,
    extrato
}