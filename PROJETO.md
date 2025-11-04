# Projeto: Distribuição de Produtos para Pesquisa de Preços

## Visão Geral

Este projeto implementa um algoritmo de distribuição equilibrada de produtos entre concorrentes para pesquisa de preços, conforme especificado no [README.md](README.md).

## Estrutura do Projeto

```
distribuicao-produtos-pesquisa/
├── src/
│   ├── types.ts              # Definições de tipos TypeScript
│   ├── distribuidor.ts       # Implementação do algoritmo
│   ├── dataset.ts            # Casos de teste com dados de entrada
│   ├── distribuidor.test.ts  # Testes automatizados com Jest
│   └── index.ts              # Exemplo de uso
├── jest.config.js            # Configuração do Jest
├── tsconfig.json             # Configuração do TypeScript
├── package.json              # Dependências e scripts
└── README.md                 # Documentação do algoritmo
```

## Tecnologias Utilizadas

- **TypeScript**: Linguagem tipada para desenvolvimento
- **Jest**: Framework de testes
- **ts-jest**: Integração do Jest com TypeScript
- **Node.js**: Ambiente de execução

## Instalação

```bash
npm install
```

## Scripts Disponíveis

### Executar Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage
```

### Build

```bash
# Compilar TypeScript para JavaScript
npm run build

# Compilar em modo watch
npm run dev
```

### Executar Exemplo

```bash
npx tsx src/index.ts
```

## Uso

### Exemplo Básico

```typescript
import { distribuirProdutos, validarDistribuicao } from './distribuidor';
import type { DistribuicaoDados, ParametrosDistribuicao } from './types';

// Definir dados de entrada
const entrada: DistribuicaoDados = {
  Loja1: {
    QuantidadeProdutosPesquisa: 180,
    Concorrentes: {
      ConcorrenteA: undefined,
      ConcorrenteB: undefined,
      ConcorrenteC: undefined,
    },
  },
  // ... outras lojas
};

// Definir parâmetros
const parametros: ParametrosDistribuicao = {
  quantidadeMinimaPorConcorrente: 20,
  varianciaMaximaPermitida: 15,
};

// Executar distribuição
const resultado = distribuirProdutos(entrada, parametros);

// Validar resultado
const validacao = validarDistribuicao(resultado, parametros);

console.log('Válido:', validacao.valida);
console.log('Resultado:', JSON.stringify(resultado, null, 2));
```

## Algoritmo

O algoritmo implementado segue uma abordagem híbrida em quatro etapas:

### 1. Cálculo do Total Teórico Ideal
- Soma o total de produtos de todas as lojas
- Conta quantas vezes cada concorrente aparece
- Calcula o valor ideal por slot e por concorrente

### 2. Distribuição por Loja
Para cada loja:
- Identifica os concorrentes presentes
- Calcula quanto cada um ainda precisa para atingir o ideal
- Distribui proporcionalmente às necessidades
- Garante quantidade mínima para todos

### 3. Ajuste Fino
- Verifica se a soma por loja está correta
- Ajusta pequenas diferenças mantendo o mínimo

### 4. Balanceamento Iterativo de Variância (NOVO)
- Agrupa concorrentes por número de aparições
- Para cada grupo que excede o limite de variância:
  - Calcula a média do grupo
  - Em cada loja, identifica pares de concorrentes (doador/receptor)
  - Transfere produtos de quem está acima da média para quem está abaixo
  - Repete até 1000 iterações ou até não haver mais ajustes
- Esta abordagem permite balanceamento **indireto** através de transferências incrementais
- Funciona mesmo quando concorrentes não compartilham todas as lojas

## Restrições Garantidas

✅ **Soma Exata por Loja**: A soma dos produtos distribuídos é exatamente igual à `QuantidadeProdutosPesquisa`

✅ **Quantidade Mínima**: Cada concorrente recebe pelo menos `quantidadeMinimaPorConcorrente` produtos

✅ **Variância Controlada**: A diferença entre concorrentes do mesmo grupo não excede `varianciaMaximaPermitida`

## Dataset de Testes

O projeto inclui **11 casos de teste** abrangentes que cobrem diferentes cenários:

### Casos Básicos (1-6)
1. **Caso 1**: Exemplo do README - 3 lojas, 5 concorrentes, 780 produtos
2. **Caso 2**: Distribuição simples - 2 lojas, 3 concorrentes, 250 produtos
3. **Caso 3**: Loja única - 1 loja, 4 concorrentes, 200 produtos
4. **Caso 4**: Concorrentes exclusivos - 3 lojas, 6 concorrentes únicos, 300 produtos
5. **Caso 5**: Arredondamento - 2 lojas, 3 concorrentes, 200 produtos
6. **Caso 6**: Quantidade mínima - 2 lojas, 4 concorrentes, 240 produtos

### Casos Complexos (7-11)
7. **Caso 7**: Rede média - **5 lojas, 8 concorrentes, 1.230 produtos**
8. **Caso 8**: Rede grande - **10 lojas, 12 concorrentes, 2.920 produtos**
9. **Caso 9**: Cenário assimétrico - **6 lojas (pequenas/médias/grandes), 8 concorrentes, 1.500 produtos**
10. **Caso 10**: Alta densidade - **3 lojas, 11 concorrentes, 1.130 produtos**
11. **Caso 11**: Rede realista - **8 lojas por região, 11 concorrentes, 2.180 produtos**

## Testes

Os testes validam:

- ✅ Estrutura correta do resultado
- ✅ Soma exata por loja
- ✅ Quantidade mínima respeitada
- ✅ Variância dentro do limite
- ✅ Equilíbrio entre concorrentes do mesmo grupo
- ✅ Cálculo correto de totais por concorrente
- ✅ Casos especiais (loja única, concorrente único)
- ✅ Detecção de erros de validação
- ✅ Cálculo de estatísticas

**Resultado**: 20/20 testes passando ✅

### Visualizar Estatísticas do Dataset

```bash
npx tsx src/visualizar-dataset.ts
```

## Exemplo de Saída

```json
{
  "Loja1": {
    "QuantidadeProdutosPesquisa": 180,
    "Concorrentes": {
      "ConcorrenteA": 60,
      "ConcorrenteB": 60,
      "ConcorrenteC": 60
    }
  },
  "Loja2": {
    "QuantidadeProdutosPesquisa": 200,
    "Concorrentes": {
      "ConcorrenteA": 50,
      "ConcorrenteB": 50,
      "ConcorrenteC": 50,
      "ConcorrenteE": 50
    }
  },
  "Loja3": {
    "QuantidadeProdutosPesquisa": 400,
    "Concorrentes": {
      "ConcorrenteA": 85,
      "ConcorrenteB": 85,
      "ConcorrenteC": 85,
      "ConcorrenteD": 65,
      "ConcorrenteE": 80
    }
  }
}
```

## Validação

```typescript
{
  valida: true,
  erros: [],
  estatisticas: {
    totalProdutos: 780,
    totalConcorrentes: 5,
    mediaPorConcorrente: 156,
    varianciaPercentual: 0,
    concorrentes: {
      ConcorrenteA: { total: 195, numeroDeLojas: 3 },
      ConcorrenteB: { total: 195, numeroDeLojas: 3 },
      ConcorrenteC: { total: 195, numeroDeLojas: 3 },
      ConcorrenteD: { total: 65, numeroDeLojas: 1 },
      ConcorrenteE: { total: 130, numeroDeLojas: 2 }
    }
  }
}
```

## Contribuindo

Para adicionar novos casos de teste, edite o arquivo `src/dataset.ts` seguindo a estrutura existente.

## Licença

ISC
