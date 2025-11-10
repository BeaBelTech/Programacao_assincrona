# 💡 Programação Assíncrona — Sistema de Ideias

Este projeto é uma aplicação **Node.js com Express**, desenvolvida como parte do aprendizado de **programação assíncrona**.
O sistema permite o **cadastro de usuários**, **criação e gerenciamento de ideias**, e **votação** entre membros da comunidade.
Ele combina uma arquitetura modular e o uso de renderização de páginas dinâmicas com **Handlebars**.

---

## 🚀 Funcionalidades

* **Autenticação de usuários** (registro, login e logout)
* **Criptografia de senhas com bcrypt**
* **CRUD completo de ideias** (criar, visualizar, atualizar e excluir)
* **Sistema de votos** em ideias
* **Associação de ideias a usuários**
* **Proteção de rotas com middleware de sessão**
* **Renderização de páginas com Handlebars**
* **Conexão segura com MongoDB Atlas via Mongoose**

---
Proteção de rotas com middleware de sessão
## 🧩 Estrutura do Projeto

```
Programacao_assincrona/
│
├── config/            # Configuração da conexão com o banco MongoDB Atlas
├── controllers/       # Lógica das rotas (auth, ideias, votos)
├── middlewares/       # Funções intermediárias (autenticação, validação, etc.)
├── models/            # Schemas e models Mongoose (Usuário, Ideia, Voto)
├── public/            # Arquivos estáticos (CSS, JS, imagens)
├── routes/            # Definições de rotas Express
├── seed/              # Scripts de popular o banco com dados iniciais
├── views/             # Páginas renderizadas com Handlebars (.hbs)
│
├── .env               # Variáveis de ambiente
├── app.js             # Configuração principal do Express
└── server.js          # Inicialização do servidor
```

---

## 🧠 Principais Rotas

### 🔐 Autenticação (`/auth`)

| Método   | Rota        | Descrição                                 |
| -------- | ----------- | ----------------------------------------- |
| **GET**  | `/register` | Exibe página de registro                  |
| **POST** | `/register` | Cria novo usuário com senha criptografada |
| **GET**  | `/login`    | Exibe página de login                     |
| **POST** | `/login`    | Autentica usuário                         |
| **GET**  | `/logout`   | Encerra sessão do usuário                 |

---

### 💡 Ideias (`/ideas`)

| Método     | Rota                        | Descrição                            |
| ---------- | --------------------------- | ------------------------------------ |
| **GET**    | `/create`                   | Renderiza página de criação de ideia |
| **POST**   | `/create`                   | Cria nova ideia                      |
| **GET**    | `/centro`                   | Lista todas as ideias                |
| **GET**    | `/get/:id`                  | Retorna uma ideia específica         |
| **PUT**    | `/update/:id`               | Atualiza uma ideia existente         |
| **DELETE** | `/delete/:id`               | Remove uma ideia                     |
| **GET**    | `/user/getByUserId/:userId` | Lista ideias criadas por um usuário  |

---

### 🗳️ Votos (`/votes`)

| Método     | Rota                      | Descrição                           |
| ---------- | ------------------------- | ----------------------------------- |
| **POST**   | `/vote`                   | Adiciona voto a uma ideia           |
| **DELETE** | `/remove`                 | Remove voto de uma ideia            |
| **GET**    | `/getVotesByIdea/:ideaId` | Retorna todos os votos de uma ideia |
| **GET**    | `/:ideaId/count`          | Retorna contagem total de votos     |

---

## ⚙️ Tecnologias Utilizadas

| Categoria                            | Tecnologias                                             |
| ------------------------------------ | ------------------------------------------------------- |
| **Linguagem**                        | Node.js                     |
| **Framework**                        | Express              |
| **Renderização de Views**            | Handlebars
| **Banco de Dados**                   | MongoDB Atlas
| **Modelagem ODM**                    | Mongoose                   |
| **Criptografia de Senhas**           | bcrypt        |
| **Variáveis de Ambiente**            | Dotenv    |
| **Monitoramento em Desenvolvimento** | Nodemon       |

---


## 🗄️ Banco de Dados

O projeto utiliza o **MongoDB Atlas** como banco de dados principal, garantindo escalabilidade e segurança na nuvem.
A conexão é feita via **Mongoose**, responsável por mapear os modelos e gerenciar consultas.



---

## 🛠️ Instalação e Execução

### 1. Clone o repositório

```bash
git clone https://github.com/BeaBelTech/Programacao_assincrona.git
cd Programacao_assincrona
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o ambiente com .env

O arquivo .env será enviado via teams.


### 4. Inicie o servidor

```bash
npm run dev
```

Acesse no navegador:
👉 **[http://localhost:3000](http://localhost:3000)**
