# 🐾 mainoTestPoke - Pokedex Vue + Vuetify

Este é um projeto de Pokedex desenvolvido em Vue 3 com Vuetify, utilizando a API pública [PokeAPI](https://pokeapi.co/) para listar e buscar informações sobre Pokémon. A aplicação inclui funcionalidades como scroll infinito, design responsivo e integração com a PokeAPI para exibição dinâmica de dados.

---

## 🚀 Funcionalidades

- **Listagem de Pokémon**: Exibe uma lista paginada e infinita de Pokémon utilizando **vue3-infinite-loading**.
- **Detalhes do Pokémon**: Consulta e exibe informações detalhadas de cada Pokémon.
- **Interface moderna**: Desenvolvido com **Vuetify** para um design elegante e responsivo.
- **Busca otimizada**: Permite busca direta por nome ou ID do Pokémon.

---

## 📂 Estrutura do Projeto

```plaintext
.
├── src/
│   ├── assets/          # Arquivos estáticos (imagens, fontes, etc.)
│   ├── components/      # Componentes Vue reutilizáveis
│   ├── layouts/         # Layouts da aplicação (com vite-plugin-vue-layouts)
│   ├── pages/           # Páginas principais da aplicação
│   ├── plugins/         # Configuração de plugins Vue, como Vuetify
│   ├── router/          # Configuração das rotas (vue-router)
│   ├── services/        # Requisições e integração com APIs
│   ├── store/           # Gerenciamento de estado (Pinia)
│   ├── styles/          # Estilização global e modular
│   ├── App.vue          # Componente raiz
│   └── main.js          # Arquivo principal de inicialização
├── public/              # Arquivos públicos
├── tests/               # Testes (usando Jest)
├── package.json         # Dependências e scripts
├── vite.config.js       # Configurações do Vite
└── README.md            # Documentação
```

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Vue 3**: Framework principal
- **Vuetify 3**: Biblioteca de componentes de UI
- **Pinia**: Gerenciamento de estado
- **Vue Router**: Gerenciamento de rotas
- **axios**: Comunicação com APIs
- **vue3-infinite-loading**: Scroll infinito

### Ferramentas
- **Vite**: Build tool moderna e rápida
- **Jest**: Testes de unidade
- **ESLint**: Padronização de código
- **Sass**: Estilização avançada

---

## 🚀 Como executar o projeto

### 1️⃣ Pré-requisitos

- Node.js 16+
- Gerenciador de pacotes (npm ou yarn)

### 2️⃣ Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/mainoTestPoke.git
   cd mainoTestPoke
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

### 3️⃣ Executando a aplicação

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse no navegador: [http://localhost:5173](http://localhost:5173).

### 4️⃣ Construindo para produção

Gere os arquivos otimizados:

```bash
npm run build
```

---

## 🧪 Testes

Este projeto utiliza **Jest** para testes de unidade. Para executar os testes:

```bash
npm run test
```

---

## 🌐 Endpoints Utilizados

### **PokeAPI**

- **Listagem de Pokémon**: [https://pokeapi.co/api/v2/pokemon](https://pokeapi.co/api/v2/pokemon)
- **Detalhes do Pokémon**: [https://pokeapi.co/api/v2/pokemon/{id}](https://pokeapi.co/api/v2/pokemon/{id})

---

## 📜 Scripts Disponíveis

- **`npm run dev`**: Inicia o servidor de desenvolvimento.
- **`npm run build`**: Gera os arquivos otimizados para produção.
- **`npm run preview`**: Inicia o servidor local para pré-visualizar o build.
- **`npm run lint`**: Corrige problemas de lint.
- **`npm run test`**: Executa os testes unitários.

---

## 📧 Contato

Criado por **Lucas Emanuel Barboza Santos**.  
[LinkedIn](https://linkedin.com/in/lucasebsantos) | [GitHub](https://github.com/dore4n)

---

### 🌟 Agradecimentos

Agradecimentos à [PokeAPI](https://pokeapi.co/) pelo fornecimento de dados e à comunidade Vue/Vuetify pelos recursos incríveis para desenvolvedores.
