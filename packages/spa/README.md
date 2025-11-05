# Sistema de Distribuição de Produtos - Interface Web

Interface web interativa para visualização e análise do algoritmo de distribuição de produtos.

## Funcionalidades

- 📊 **Visualização Interativa**: Navegue passo a passo pelo algoritmo de distribuição
- 📉 **Gráficos em Tempo Real**: Veja a evolução da variância e distribuição por concorrente
- 📋 **Cards Colapsáveis**: Organize o espaço de trabalho colapsando/expandindo seções
- ⚙️ **Controles de Navegação**: Avance, retroceda ou reproduza automaticamente as etapas
- 📝 **Log Detalhado**: Acompanhe cada etapa com informações completas
- ✨ **Editor de Casos Personalizados**: Crie seus próprios cenários de teste
- 📊 **Exportação para Excel**: Exporte resultados completos em formato .xlsx
- 💡 **Tooltips Informativos**: Explicações detalhadas para todas as métricas e indicadores

## Interface

### Cards Colapsáveis

Todos os painéis principais são colapsáveis, permitindo focar no que é importante:

- **Seletor de Caso de Teste**: Escolha entre diferentes cenários de teste
- **Controles**: Navegue pelas etapas do algoritmo
- **Avisos e Recomendações**: Veja alertas sobre a distribuição
- **Estatísticas**: Métricas detalhadas por concorrente
- **Gráficos**: Visualize a distribuição e evolução da variância
- **Log de Execução**: Histórico completo de todas as etapas (iniciado colapsado)

Clique no cabeçalho de qualquer card para expandir ou colapsar.

### Editor de Casos Personalizados

Crie seus próprios cenários de teste diretamente na interface:

1. **Preencha as informações básicas**: Nome e descrição do teste
2. **Configure os parâmetros**: Quantidade mínima e variância máxima
3. **Adicione lojas**: Nome e quantidade de produtos
4. **Adicione concorrentes**: Para cada loja, defina quais concorrentes participam
5. **Execute**: Clique em "Executar Distribuição" para ver os resultados

### Exportação para Excel

Exporte todos os resultados da distribuição em um arquivo Excel completo com múltiplas abas:

- **Resumo**: Métricas gerais e informações do caso de teste
- **Distribuição por Loja**: Tabela completa com todos os produtos distribuídos
- **Por Concorrente**: Estatísticas detalhadas de cada concorrente
- **Histórico**: Log completo de todas as etapas da execução
- **Transferências**: Lista de todas as transferências realizadas (se houver)

Clique no botão "Exportar Excel" no topo da área de conteúdo após executar uma distribuição.

## Instalação

Antes de executar pela primeira vez, instale as dependências:

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

## Build para Produção

```bash
npm run build
```

## Preview da Build

```bash
npm run preview
```

## Tecnologias

- **Vue 3**: Framework JavaScript progressivo
- **TypeScript**: Tipagem estática
- **Vite**: Build tool rápido
- **Chart.js**: Biblioteca de gráficos
- **Tailwind CSS**: Framework CSS utilitário
