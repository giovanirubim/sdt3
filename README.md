# Servidor de demonstração de autenticação OTP

Este servidor oferece um pequeno _website_ onde um usuário pode se cadastrar, realizar _log-in_ e _log-out_ utilizando autenticação de dois fatores.

O segundo fator de autenticação utilizado foi o fator de posse, realizado através da autenticação por senha descartável (OTP).

## Dependências

- Node.js v14+
- npm v6+

## Instalação

Após clonar o repositório a instalação do projeto se dá através da seguinte linha de comando
`npm install --only=prod`

## Execução

Para iniciar a execução do projeto execute o seguinte comando
`npm start:prod`