# Sistema de Distribuição de Produtos - Interface Web

Interface web interativa para visualização e análise do algoritmo de distribuição de produtos.

## Funcionalidades

- 📊 **Visualização Interativa**: Navegue passo a passo pelo algoritmo de distribuição
- 📉 **Gráficos em Tempo Real**: Veja a evolução da variância e distribuição por concorrente
- 📋 **Cards Colapsáveis**: Organize o espaço de trabalho colapsando/expandindo seções
- ⚙️ **Controles de Navegação**: Avance, retroceda ou reproduza automaticamente as etapas
- 📝 **Log Detalhado**: Acompanhe cada etapa com informações completas
- 💾 **Exportação**: Exporte o log de execução para análise offline

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
