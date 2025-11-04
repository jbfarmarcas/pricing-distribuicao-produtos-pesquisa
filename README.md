# Distribuição Equilibrada de Produtos para Pesquisa de Preços

## 1. Contexto do Problema

### 1.1 Descrição Geral

Temos uma rede de lojas que precisa realizar pesquisas de preços em concorrentes. Cada loja possui:
- Uma quantidade específica de produtos que devem ser pesquisados
- Uma lista de concorrentes onde realizará as pesquisas

O desafio é **distribuir os produtos entre os concorrentes de forma equilibrada**, garantindo que:
- Nenhum concorrente receba uma quantidade desproporcional de produtos para pesquisar
- Todos os concorrentes tenham uma quantidade mínima de produtos alocados
- A distribuição seja justa considerando que alguns concorrentes aparecem em múltiplas lojas

### 1.2 Exemplo de Entrada de Dados

```javascript
{
    Loja1: {
        QuantidadeProdutosPesquisa: 180,
        Concorrentes: {
            ConcorrenteA: undefined,
            ConcorrenteB: undefined,
            ConcorrenteC: undefined,
        }
    },
    Loja2: {
        QuantidadeProdutosPesquisa: 200,
        Concorrentes: {
            ConcorrenteA: undefined,
            ConcorrenteB: undefined,
            ConcorrenteC: undefined,
            ConcorrenteE: undefined, 
        }
    },
    Loja3: {
        QuantidadeProdutosPesquisa: 400,
        Concorrentes: {
            ConcorrenteA: undefined,
            ConcorrenteB: undefined,
            ConcorrenteC: undefined,
            ConcorrenteD: undefined,
            ConcorrenteE: undefined
        }
    }
}
```

---

## 2. Restrições e Requisitos

### 2.1 Restrições Obrigatórias

**Soma por Loja**: A soma dos produtos distribuídos entre os concorrentes de cada loja deve ser exatamente igual à `QuantidadeProdutosPesquisa` daquela loja.

**Quantidade Mínima**: Cada concorrente deve receber no mínimo uma quantidade predefinida de produtos (exemplo: 20 produtos).

**Variância Controlada**: A diferença entre a quantidade total de produtos recebida por diferentes concorrentes não deve ultrapassar um limite percentual estabelecido (exemplo: 15% de variação máxima).

### 2.2 Objetivo

Distribuir os produtos de forma que:
- Concorrentes que aparecem no mesmo conjunto de lojas recebam quantidades similares no total
- A carga de trabalho seja equilibrada entre todos os concorrentes
- Não haja discrepâncias significativas que possam comprometer a qualidade ou viés da pesquisa

---

## 3. Solução Proposta: Abordagem Híbrida

### 3.1 Visão Geral do Algoritmo

A solução utiliza uma abordagem em três etapas:

1. **Cálculo do Total Teórico Ideal**: Determinar quanto cada concorrente deveria receber idealmente
2. **Distribuição por Loja**: Alocar produtos em cada loja priorizando quem está mais distante do ideal
3. **Ajuste Fino**: Corrigir pequenas discrepâncias para respeitar as restrições

### 3.2 Passo a Passo Detalhado

#### Etapa 1: Calcular o Total Teórico Ideal

**1.1** Somar o total de produtos de todas as lojas

**1.2** Contar quantas vezes cada concorrente aparece (número de "slots")

**1.3** Calcular o valor ideal por slot:
```
Ideal por slot = Total de produtos ÷ Total de slots
```

**1.4** Calcular o total ideal por concorrente:
```
Total ideal do concorrente = Ideal por slot × Número de aparições do concorrente
```

#### Etapa 2: Distribuir em Cada Loja

Para cada loja, na ordem de processamento:

**2.1** Identificar os concorrentes presentes naquela loja

**2.2** Calcular quanto cada um já recebeu e quanto ainda precisa para atingir o ideal

**2.3** Distribuir os produtos da loja proporcionalmente ao que cada concorrente ainda precisa:
```
Produtos para concorrente X = (Produtos da loja) × (Falta do X) ÷ (Soma das faltas de todos)
```

**2.4** Garantir que todos recebam pelo menos o mínimo estabelecido

#### Etapa 3: Ajuste Fino

**3.1** Verificar se a soma por loja está correta (pode haver arredondamentos)

**3.2** Ajustar pequenas diferenças de ±1 ou ±2 produtos onde necessário

**3.3** Validar se a variância está dentro do limite estabelecido

---

## 4. Exemplo Prático (Teste de Mesa)

### 4.1 Dados de Entrada

```
Loja1: 180 produtos → Concorrentes: A, B, C
Loja2: 200 produtos → Concorrentes: A, B, C, E
Loja3: 400 produtos → Concorrentes: A, B, C, D, E

Total de produtos: 780
Parâmetros:
- Mínimo por concorrente: 20 produtos
- Variância máxima: 15%
```

### 4.2 Etapa 1: Cálculo do Ideal

**Contagem de aparições:**
- Concorrente A: 3 lojas
- Concorrente B: 3 lojas
- Concorrente C: 3 lojas
- Concorrente D: 1 loja
- Concorrente E: 2 lojas
- **Total de slots: 12**

**Cálculo do ideal:**
```
Ideal por slot = 780 ÷ 12 = 65 produtos

Totais ideais:
- Concorrente A: 65 × 3 = 195 produtos
- Concorrente B: 65 × 3 = 195 produtos
- Concorrente C: 65 × 3 = 195 produtos
- Concorrente D: 65 × 1 = 65 produtos
- Concorrente E: 65 × 2 = 130 produtos
```

### 4.3 Etapa 2: Distribuição por Loja

**Loja 1 (180 produtos):**

Concorrentes: A, B, C (todos precisam de 195)

Distribuição igual:
- A: 60 produtos
- B: 60 produtos
- C: 60 produtos
- **Total: 180 ✓**

Status após Loja1:
- A: 60 (falta 135)
- B: 60 (falta 135)
- C: 60 (falta 135)

---

**Loja 2 (200 produtos):**

Concorrentes: A, B, C, E

Faltas atuais:
- A precisa de 135
- B precisa de 135
- C precisa de 135
- E precisa de 130
- **Total de faltas: 535**

Distribuição proporcional:
- A: 200 × (135/535) ≈ 50 → ajustado para 48
- B: 200 × (135/535) ≈ 50 → ajustado para 48
- C: 200 × (135/535) ≈ 50 → ajustado para 48
- E: 200 × (130/535) ≈ 49 → ajustado para 56
- **Total: 200 ✓**

Status após Loja2:
- A: 108 (falta 87)
- B: 108 (falta 87)
- C: 108 (falta 87)
- E: 56 (falta 74)

---

**Loja 3 (400 produtos):**

Concorrentes: A, B, C, D, E

Faltas atuais:
- A precisa de 87
- B precisa de 87
- C precisa de 87
- D precisa de 65
- E precisa de 74
- **Total de faltas: 400** (perfeito!)

Distribuição final:
- A: 87 produtos
- B: 87 produtos
- C: 87 produtos
- D: 65 produtos
- E: 74 produtos
- **Total: 400 ✓**

### 4.4 Resultado Final

```javascript
{
    Loja1: {
        QuantidadeProdutosPesquisa: 180,
        Concorrentes: {
            ConcorrenteA: 60,
            ConcorrenteB: 60,
            ConcorrenteC: 60,
        }
    },
    Loja2: {
        QuantidadeProdutosPesquisa: 200,
        Concorrentes: {
            ConcorrenteA: 48,
            ConcorrenteB: 48,
            ConcorrenteC: 48,
            ConcorrenteE: 56,
        }
    },
    Loja3: {
        QuantidadeProdutosPesquisa: 400,
        Concorrentes: {
            ConcorrenteA: 87,
            ConcorrenteB: 87,
            ConcorrenteC: 87,
            ConcorrenteD: 65,
            ConcorrenteE: 74
        }
    }
}
```

### 4.5 Validação dos Resultados

**Totais por concorrente:**
- Concorrente A: 60 + 48 + 87 = **195 produtos** ✓ (igual ao ideal)
- Concorrente B: 60 + 48 + 87 = **195 produtos** ✓ (igual ao ideal)
- Concorrente C: 60 + 48 + 87 = **195 produtos** ✓ (igual ao ideal)
- Concorrente D: 65 = **65 produtos** ✓ (igual ao ideal)
- Concorrente E: 56 + 74 = **130 produtos** ✓ (igual ao ideal)

**Verificação de variância:**
- Entre A, B e C (mesmo conjunto de lojas): **0% de variação** ✓
- Todos acima do mínimo de 20 produtos ✓
- Soma por loja correta ✓

---

## 5. Resultado Esperado

### 5.1 Características da Solução

**Equilíbrio Global**: Concorrentes que aparecem no mesmo conjunto de lojas recebem a mesma quantidade total de produtos.

**Proporcionalidade**: Concorrentes que aparecem em mais lojas naturalmente recebem mais produtos, mas de forma proporcional.

**Respeito às Restrições**: Todas as quantidades por loja são respeitadas e os mínimos são garantidos.

**Distribuição Justa**: A carga de trabalho é equilibrada, evitando sobrecarga ou subutilização de qualquer concorrente.

### 5.2 Benefícios da Abordagem

**Qualidade da Pesquisa**: Com distribuição equilibrada, evita-se viés causado por amostragem desproporcional.

**Eficiência Operacional**: Nenhum concorrente fica com carga excessiva ou insuficiente.

**Flexibilidade**: O algoritmo se adapta a diferentes configurações de lojas e concorrentes.

**Transparência**: O processo é claro e auditável, facilitando ajustes se necessário.

### 5.3 Casos Especiais

**Concorrente em uma única loja**: Receberá sua quota proporcional apenas naquela loja (como o Concorrente D no exemplo).

**Números que não dividem exatamente**: O algoritmo faz ajustes de ±1 produto para fechar os totais corretamente.

**Restrição de mínimo não atendível**: Se o mínimo for muito alto para a quantidade de produtos disponíveis, o sistema deve alertar e sugerir ajustes.

---

## 6. Considerações de Implementação

### 6.1 Parâmetros Configuráveis

- **Quantidade mínima por concorrente**: Geralmente entre 15-30 produtos
- **Variância máxima permitida**: Recomendado entre 10-20%
- **Ordem de processamento das lojas**: Pode impactar o resultado em casos extremos

### 6.2 Validações Necessárias

- Verificar se existe solução viável (quantidade mínima × número de concorrentes ≤ total de produtos)
- Alertar sobre concorrentes que aparecem em poucas lojas (podem ficar com menos produtos)
- Validar a soma final em cada loja

### 6.3 Possíveis Extensões

- Priorizar determinados concorrentes (pesos diferentes)
- Considerar histórico de pesquisas anteriores
- Agrupar produtos por categorias e distribuir dentro de cada categoria
- Adicionar restrições de capacidade máxima por concorrente

---

## 7. Conclusão

O algoritmo de distribuição híbrida proposto resolve o problema de forma eficiente e equilibrada, garantindo que:

- Todos os produtos sejam alocados corretamente
- A distribuição seja justa entre os concorrentes
- As restrições operacionais sejam respeitadas
- O resultado seja previsível e auditável

Esta abordagem oferece um bom equilíbrio entre simplicidade de implementação e qualidade dos resultados, sendo adequada para cenários reais de pesquisa de preços em redes de varejo.