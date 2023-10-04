# sistema-bancario

Bem-vindo à documentação da API do Banco Digital! Esta API foi desenvolvida para permitir a gestão de contas bancárias, realização de transações e consulta de saldos e extratos. A seguir, você encontrará informações detalhadas sobre os endpoints disponíveis, suas funcionalidades e como utilizá-los.

## Visão Geral

A API do Banco Digital permite a realização das seguintes operações:

- Criar conta bancária
- Listar contas bancárias
- Atualizar os dados do usuário da conta bancária
- Excluir uma conta bancária
- Depositar em uma conta bancária
- Sacar de uma conta bancária
- Transferir valores entre contas bancárias
- Consultar saldo da conta bancária
- Emitir extrato bancário
### ⚠️Lembre-se sempre de responder com os códigos de erro e mensagens adequadas em caso de validação falhada.

## Persistência dos Dados

Os dados da API são armazenados em memória, no objeto existente dentro do arquivo bancodedados.js. Todas as transações e contas bancárias são inseridas dentro deste objeto, seguindo a estrutura que já existe.

## Estrutura do objeto no arquivo bancodedados.js

```javascript

{
    banco: {
        nome: "Cubos Bank",
        numero: "123",
        agencia: "0001",
        senha: "Cubos123Bank",
    },
    contas: [
        // array de contas bancárias
    ],
    saques: [
        // array de saques
    ],
    depositos: [
        // array de depósitos
    ],
    transferencias: [
        // array de transferências
    ],
}
```

## Requisitos Obrigatórios

Certifique-se de seguir os seguintes requisitos ao implementar a API:

- A API deve seguir o padrão REST.
- O código deve estar organizado, com responsabilidades de cada arquivo claramente definidas.
Represente todos os valores (dinheiro) em centavos (Ex.: R$ 10,00 reais = 1000 centavos).
Evite códigos duplicados, centralizando lógicas comuns em funções.

## Status Codes

Aqui estão os possíveis códigos de status HTTP que podem ser retornados pela API:

- 200 (OK) = Requisição bem-sucedida
- 201 (Created) = Requisição bem-sucedida e algo foi criado
- 204 (No Content) = Requisição bem-sucedida, sem conteúdo no corpo da resposta
- 400 (Bad Request) = O servidor não entendeu a requisição devido a uma sintaxe/formato inválido
- 401 (Unauthorized) = O usuário não está autenticado (não está logado)
- 403 (Forbidden) = O usuário não tem permissão para acessar o recurso solicitado
- 404 (Not Found) = O servidor não pôde encontrar o recurso solicitado
- 500 (Internal Server Error) = Erros causados pelo servidor

## Endpoints

A seguir, descrevemos cada endpoint disponível na API.

### Listar Contas Bancárias
#### GET /contas?senha_banco=Cubos123Bank
Este endpoint lista todas as contas bancárias existentes.

- Verifica se a senha do banco foi informada (passada como query params na URL).
- Valida se a senha do banco está correta.
- Requisição - Query params (respeitando este nome):

    -   senha_banco

    ### Resposta

- Listagem de todas as contas bancárias existentes.

**Exemplo de resposta:**

```javascript
// HTTP Status 200 / 201 / 204
// 2 contas encontradas
[
    {
        "numero": "1",
        "saldo": 0,
        "usuario": {
            "nome": "Foo Bar",
            "cpf": "00011122233",
            "data_nascimento": "2021-03-15",
            "telefone": "71999998888",
            "email": "foo@bar.com",
            "senha": "1234"
        }
    },
    {
        "numero": "2",
        "saldo": 1000,
        "usuario": {
            "nome": "Foo Bar 2",
            "cpf": "00011122234",
            "data_nascimento": "2021-03-15",
            "telefone": "71999998888",
            "email": "foo@bar2.com",
            "senha": "12345"
        }
    }
]

// Nenhuma conta encontrada
[]
```
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "A senha do banco informada é inválida!"
}
```

## Criar Conta Bancária
### POST /contas
Este endpoint cria uma conta bancária, gerando um número único para identificação da conta.

- Cria uma nova conta com um número único.
- CPF e e-mail devem ser campos únicos.
- Verifica se todos os campos obrigatórios foram informados.
- Define o saldo inicial da conta como 0.

-   **Requisição** - O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   nome
    -   cpf
    -   data_nascimento
    -   telefone
    -   email
    -   senha

    -   **Resposta**

    Em caso de **sucesso**, não deveremos enviar conteúdo no corpo (body) da resposta.  
    Em caso de **falha na validação**, a resposta deverá possuir ***status code*** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

#### Exemplo de Requisição

```javascript
// POST /contas
{
    "nome": "Foo Bar 2",
    "cpf": "00011122234",
    "data_nascimento": "2021-03-15",
    "telefone": "71999998888",
    "email": "foo@bar2.com",
    "senha": "12345"
}
```

#### Exemplo de Resposta

```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Já existe uma conta com o cpf ou e-mail informado!"
}
```

## Atualizar Usuário da Conta Bancária
### PUT /contas/:numeroConta/usuario
Este endpoint atualiza os dados do usuário de uma conta bancária.

- Verifica se todos os campos foram informados no body da requisição.
- Verifica se o número da conta passado como parâmetro na URL é válido.
- Se o CPF for informado, verifica se já existe outro registro com o mesmo CPF.
- Se o e-mail for informado, verifica se já existe outro registro com o mesmo e-mail.
- Atualiza os dados do usuário de uma conta bancária.

-   **Requisição** - O corpo (body) deverá possuir um objeto com todas as seguintes propriedades (respeitando estes nomes):

    -   nome
    -   cpf
    -   data_nascimento
    -   telefone
    -   email
    -   senha

-   **Resposta**

    Em caso de **sucesso**, não deveremos enviar conteúdo no corpo (body) da resposta.  
    Em caso de **falha na validação**, a resposta deverá possuir ***status code*** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

#### Exemplo de Requisição
```javascript
// PUT /contas/:numeroConta/usuario
{
    "nome": "Foo Bar 3",
    "cpf": "99911122234",
    "data_nascimento": "2021-03-15",
    "telefone": "71999998888",
    "email": "foo@bar3.com",
    "senha": "12345"
{
```


#### Exemplo de Resposta

```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "O CPF informado já existe cadastrado!"
}
```

### Excluir Conta

#### `DELETE` `/contas/:numeroConta`

Esse endpoint deve excluir uma conta bancária existente.

- Verifica se o número da conta passado como parâmetro na URL é válido.
- Permite a exclusão de uma conta bancária apenas se o saldo for 0 (zero).
- Remove a conta do objeto de persistência de dados.

-   **Requisição**

    -   Numero da conta bancária (passado como parâmetro na rota)

-   **Resposta**

    Em caso de **sucesso**, não deveremos enviar conteúdo no corpo (body) da resposta.  
    Em caso de **falha na validação**, a resposta deverá possuir ***status code*** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

#### Exemplo de Resposta

```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "A conta só pode ser removida se o saldo for zero!"
}
```

### Depositar

#### `POST` `/transacoes/depositar`

Esse endpoint deverá somar o valor do depósito ao saldo de uma conta válida e registrar essa transação.

-   Você deverá, **OBRIGATORIAMENTE**:

    -   Verificar se o numero da conta e o valor do deposito foram informados no body
    -   Verificar se a conta bancária informada existe
    -   Não permitir depósitos com valores negativos ou zerados
    -   Somar o valor de depósito ao saldo da conta encontrada

-   **Requisição** - O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   numero_conta
    -   valor

-   **Resposta**

    Em caso de **sucesso**, não deveremos enviar conteúdo no corpo (body) da resposta.  
    Em caso de **falha na validação**, a resposta deverá possuir ***status code*** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

#### Exemplo de Requisição
```javascript
// POST /transacoes/depositar
{
	"numero_conta": "1",
	"valor": 1900
}
```

#### Exemplo de Resposta

```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "O número da conta e o valor são obrigatórios!"
}
```

#### Exemplo do registro de um depósito

```javascript
{
    "data": "2021-08-10 23:40:35",
    "numero_conta": "1",
    "valor": 10000
}
```

### Sacar

#### `POST` `/transacoes/sacar`

Esse endpoint deverá realizar o saque de um valor em uma determinada conta bancária e registrar essa transação.

- Verifica se o número da conta, o valor do saque e a senha foram informados no body.
- Verifica se a conta bancária informada existe.
- Verifica se a senha informada é válida para a conta informada.
- Verifica se há saldo disponível para saque.
- Subtrai o valor do saque do saldo da conta encontrada.

-   **Requisição** - O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   numero_conta
    -   valor
    -   senha

-   **Resposta**

    Em caso de **sucesso**, não deveremos enviar conteúdo no corpo (body) da resposta.  
    Em caso de **falha na validação**, a resposta deverá possuir ***status code*** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

#### Exemplo de Requisição
```javascript
// POST /transacoes/sacar
{
	"numero_conta": "1",
	"valor": 1900,
    "senha": "123456"
}
```
#### Exemplo de Resposta
```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "O valor não pode ser menor que zero!"
}
```

#### Exemplo do registro de um saque

```javascript
{
    "data": "2021-08-10 23:40:35",
    "numero_conta": "1",
    "valor": 10000
}
```

### Tranferir

#### `POST` `/transacoes/transferir`

Esse endpoint deverá permitir a transferência de recursos (dinheiro) de uma conta bancária para outra e registrar essa transação.

- Verifica se o número da conta de origem, o número da conta de destino, a senha da conta de origem e o valor da transferência foram informados no body.
- Verifica se a conta bancária de origem informada existe.
- Verifica se a conta bancária de destino informada existe.
- Verifica se a senha informada é válida para a conta de origem informada.
- Verifica se há saldo disponível na conta de origem para a transferência.
- Subtrai o valor da transferência do saldo na conta de origem.
- Soma o valor da transferência no saldo da conta de destino.

-   **Requisição** - O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   numero_conta_origem
    -   numero_conta_destino
    -   valor
    -   senha

-   **Resposta**

    Em caso de **sucesso**, não deveremos enviar conteúdo no corpo (body) da resposta.  
    Em caso de **falha na validação**, a resposta deverá possuir ***status code*** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

#### Exemplo de Requisição
```javascript
// POST /transacoes/transferir
{
	"numero_conta_origem": "1",
	"numero_conta_destino": "2",
	"valor": 200,
	"senha": "123456"
}
```
#### Exemplo de Resposta

```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Saldo insuficiente!"
}
```

#### Exemplo do registro de uma transferência

```javascript
{
    "data": "2021-08-10 23:40:35",
    "numero_conta_origem": "1",
    "numero_conta_destino": "2",
    "valor": 10000
}
```

### Saldo

#### `GET` `/contas/saldo?numero_conta=123&senha=123`

Esse endpoint deverá retornar o saldo de uma conta bancária.

    -   Verificar se o numero da conta e a senha foram informadas (passado como query params na url)
    -   Verificar se a conta bancária informada existe
    -   Verificar se a senha informada é uma senha válida
    -   Exibir o saldo da conta bancária em questão

-   **Requisição** - query params

    -   numero_conta
    -   senha

-   **Resposta**

    -   Saldo da conta

#### Exemplo de Resposta

```javascript
// HTTP Status 200 / 201 / 204
{
    "saldo": 13000
}
```
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Conta bancária não encontada!"
}
```
### Extrato

#### `GET` `/contas/extrato?numero_conta=123&senha=123`

Esse endpoint deverá listar as transações realizadas de uma conta específica.

- Verifica se o número da conta e a senha foram informadas (passado como query params na URL).
- Verifica se a conta bancária informada existe.
- Verifica se a senha informada é válida.
- Retorna a lista de transferências, depósitos e saques da conta em questão.

-   **Requisição** - query params

    -   numero_conta
    -   senha

-   **Resposta**
    -   Relatório da conta

#### Exemplo de Resposta

```javascript
// HTTP Status 200 / 201 / 204
{
  "depositos": [
    {
      "data": "2021-08-18 20:46:03",
      "numero_conta": "1",
      "valor": 10000
    },
    {
      "data": "2021-08-18 20:46:06",
      "numero_conta": "1",
      "valor": 10000
    }
  ],
  "saques": [
    {
      "data": "2021-08-18 20:46:18",
      "numero_conta": "1",
      "valor": 1000
    }
  ],
  "transferenciasEnviadas": [
    {
      "data": "2021-08-18 20:47:10",
      "numero_conta_origem": "1",
      "numero_conta_destino": "2",
      "valor": 5000
    }
  ],
  "transferenciasRecebidas": [
    {
      "data": "2021-08-18 20:47:24",
      "numero_conta_origem": "2",
      "numero_conta_destino": "1",
      "valor": 2000
    },
    {
      "data": "2021-08-18 20:47:26",
      "numero_conta_origem": "2",
      "numero_conta_destino": "1",
      "valor": 2000
    }
  ]
}
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Conta bancária não encontada!"
}
```

## Desenvolvimento

Você deve criar uma API RESTful que atenda aos requisitos especificados.
Organize seu código de forma a separar as responsabilidades em diferentes arquivos e pastas.
Utilize a estrutura de dados em memória fornecida no arquivo bancodedados.js para armazenar as contas bancárias e transações.
Lembre-se de validar todas as requisições e retornar os status codes apropriados em caso de falha.
Implemente os endpoints definidos acima de acordo com as especificações.

## Testes

Certifique-se de testar sua API com diferentes cenários, incluindo casos de sucesso e casos de erro.
Teste cada um dos endpoints especificados.
Garanta que os status codes retornados sejam os corretos em cada situação.
Considere também testar a validação de dados, como a senha do banco e a senha da conta.
Certifique-se de que sua API está de acordo com os requisitos e a estrutura especificados.

## Uso da API

Documente claramente como utilizar sua API, incluindo os endpoints disponíveis e como fazer requisições para cada um deles.
Forneça exemplos de requisições e respostas para ajudar os desenvolvedores a entender como sua API funciona.
Certifique-se de incluir informações sobre os status codes que sua API pode retornar e o que cada um deles significa.
Dê detalhes sobre como as transações são registradas e como o saldo é atualizado.
Documente o uso da estrutura de dados em memória fornecida no arquivo ```bancodedados.js.```

## Considerações Finais

Este é um projeto que envolve a implementação de uma API RESTful de um banco digital. Certifique-se de seguir as especificações e requisitos detalhados acima. 

Tenha em mente que a validação das operações bancárias é uma parte crítica deste projeto, portanto, dedique tempo para garantir que todas as validações estejam funcionando corretamente.