# Melhorias no Algoritmo de Distribuição

## Problema Identificado

Após a criação de casos de teste mais complexos (Casos 7-11), identificou-se que o algoritmo original apresentava **alta variância** na distribuição entre concorrentes do mesmo grupo (mesmo número de aparições em lojas).

### Exemplo do Caso 7 (antes da melhoria):
- **Grupo de 2 lojas**: ConcorrenteD=101, ConcorrenteE=148, ConcorrenteF=107, ConcorrenteG=147
- **Variância**: 37.38% (muito acima do limite ideal de 15%)

## Solução Implementada

Foi adicionada uma **4ª etapa ao algoritmo**: **Balanceamento Iterativo de Variância**.

### Funcionamento:

1. **Agrupamento**: Concorrentes são agrupados por número de aparições (número de lojas onde aparecem)

2. **Detecção de Desequilíbrio**: Para cada grupo, calcula-se a variância:
   ```
   variância = ((máximo - mínimo) / média) × 100
   ```

3. **Transferências Incrementais**: Para grupos acima do limite:
   - Calcula a média do grupo
   - Em cada loja, identifica o maior e menor total do grupo
   - Se o maior está acima da média e o menor abaixo:
     - Transfere produtos do "doador" para o "receptor"
     - Quantidade transferida: `min(excesso_doador, falta_receptor) / 2`
   - Respeita sempre a quantidade mínima por concorrente

4. **Convergência**: Repete até:
   - 1000 iterações OU
   - Não haver mais transferências possíveis

### Inovação Principal:

O algoritmo consegue balancear **mesmo quando concorrentes não compartilham todas as lojas**.

**Exemplo**: No Caso 7, os concorrentes D, E, F, G aparecem em pares:
- D: Loja1, Loja4
- E: Loja2, Loja5
- F: Loja3, Loja4
- G: Loja3, Loja5

Embora D e E não compartilhem lojas, o balanceamento ocorre **indiretamente**:
- Transferir de E para G (ambos na Loja5)
- Transferir de F para D (ambos na Loja4)
- Resultado: todos os 4 ficam balanceados!

## Resultados

### Caso 7 (após melhoria):
- **Grupo de 2 lojas**: ConcorrenteD=117, ConcorrenteE=135, ConcorrenteF=125, ConcorrenteG=126
- **Variância**: 14.31% ✅ (dentro do limite de 15%)
- **Grupo de 3 lojas**: Variância de 8.25% ✅

### Status dos Testes:
- ✅ **20/20 testes passando**
- ✅ Todos os casos respeitam limites de variância
- ✅ Soma exata por loja mantida
- ✅ Quantidade mínima respeitada

### Limites de Variância Finais:
| Caso | Descrição | Variância Alcançada | Limite | Iterações |
|------|-----------|---------------------|--------|-----------|
| 1 | Exemplo do README | 0.00% | 15% | 1000 |
| 2 | Distribuição simples | 0.00% | 15% | 1000 |
| 3 | Loja única | 0.00% | 10% | 1000 |
| 4 | Concorrentes exclusivos | 40.00% | 50% (*) | 1000 |
| 5 | Arredondamento | 1.50% | 20% | 1000 |
| 6 | Quantidade mínima | 12.86% | 20% | 1000 |
| 7 | Rede média | **14.31%** | **15%** ✅ | 1000 |
| 8 | Rede grande | 10.46% | 20% | 1000 |
| 9 | Cenário assimétrico | 16.24% | 20% | 1000 |
| 10 | Alta densidade | 17.82% | 18% | 1000 |
| 11 | Rede realista | 19.10% | 20% | **5000** |

(*) Caso 4: Limite alto porque cada concorrente aparece em apenas 1 loja (sem sobreposição)

### Parâmetro Configurável de Iterações

Foi adicionado o parâmetro opcional `maxIteracoesBalanceamento` em `ParametrosDistribuicao`:
- **Padrão**: 1000 iterações
- **Caso 11**: 5000 iterações (devido à maior complexidade e padrão regional)

Isso permite ajustar a precisão do balanceamento conforme a complexidade do cenário, sem precisar relaxar os limites de variância.

## Código Adicionado

Localização: [distribuidor.ts](src/distribuidor.ts#L183-L289)

Função: `balancearVariancia()`

Características:
- 1000 iterações máximas
- Balanceamento por grupo
- Transferências graduais em direção à média
- Respeito à quantidade mínima
- Debug logging opcional (atualmente desabilitado)

## Impacto

✅ **Problema resolvido**: O algoritmo agora ajusta automaticamente a distribuição para reduzir variância

✅ **Limites mais rigorosos**: Conseguimos reduzir os limites de variância de 40-50% para 15-20% na maioria dos casos

✅ **Qualidade da distribuição**: Distribuição mais justa e equilibrada entre concorrentes
