# Guia de Instalação

## Pré-requisitos

- Node.js (versão 18 ou superior)
- npm (versão 9 ou superior)

## Instalação

### 1. Instalar as dependências do projeto

Na raiz do projeto, execute:

```bash
npm install
```

Este comando instalará as dependências de todos os workspaces (core e spa).

### 2. Compilar o pacote core

```bash
npm run build --workspace=@distribuicao/core
```

ou

```bash
cd packages/core
npm run build
cd ../..
```

### 3. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

## Comandos Úteis

### Desenvolvimento

```bash
# Iniciar o SPA em modo de desenvolvimento
npm run dev

# Iniciar o core em modo watch
npm run dev:core
```

### Testes

```bash
# Executar testes do core
npm run test

# Executar testes em modo watch
npm run test:watch

# Gerar relatório de cobertura
npm run test:coverage
```

### Build

```bash
# Build de todos os pacotes
npm run build

# Build apenas do SPA
npm run build --workspace=@distribuicao/spa

# Build apenas do core
npm run build --workspace=@distribuicao/core
```

## Resolução de Problemas

### Erro ao instalar dependências

Se houver erro ao executar `npm install`, tente:

```bash
# Limpar cache do npm
npm cache clean --force

# Deletar node_modules e package-lock.json
rm -rf node_modules package-lock.json
rm -rf packages/*/node_modules

# Reinstalar
npm install
```

### Erro de tipos TypeScript

Se houver erros de tipos, certifique-se de que o pacote core foi compilado:

```bash
cd packages/core
npm run build
```

### Problema com xlsx

Se houver problemas com a biblioteca xlsx, instale manualmente:

```bash
cd packages/spa
npm install xlsx
```

## Estrutura do Projeto

```
distribuicao-produtos-pesquisa/
├── packages/
│   ├── core/          # Lógica do algoritmo de distribuição
│   └── spa/           # Interface web (Vue 3)
├── package.json       # Configuração do monorepo
└── README.md          # Documentação principal
```

## Próximos Passos

Após a instalação bem-sucedida:

1. Acesse `http://localhost:5173` no navegador
2. Selecione um caso de teste pré-definido ou crie um personalizado
3. Navegue pelas etapas do algoritmo usando os controles
4. Exporte os resultados para Excel quando desejar

Para mais informações, consulte o README.md principal.

