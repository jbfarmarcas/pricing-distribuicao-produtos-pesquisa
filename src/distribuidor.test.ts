import { describe, it, expect } from '@jest/globals';
import { distribuirProdutos, validarDistribuicao } from './distribuidor';
import { dataset } from './dataset';
import type { DistribuicaoDados } from './types';

describe('Distribuição de Produtos para Pesquisa', () => {
  describe('Casos do Dataset', () => {
    dataset.forEach((caso) => {
      it(caso.nome, () => {
        const resultado = distribuirProdutos(caso.entrada, caso.parametros);

        // Verifica se a estrutura está correta
        expect(resultado).toBeDefined();
        expect(Object.keys(resultado)).toHaveLength(Object.keys(caso.entrada).length);

        // Verifica se a soma por loja está correta (RESTRIÇÃO OBRIGATÓRIA)
        Object.keys(resultado).forEach((nomeLoja) => {
          const loja = resultado[nomeLoja];
          const somaReal = Object.values(loja.Concorrentes).reduce(
            (acc: number, val) => acc + (val || 0),
            0
          );
          expect(somaReal).toBe(loja.QuantidadeProdutosPesquisa);
        });

        // Verifica quantidade mínima (RESTRIÇÃO OBRIGATÓRIA)
        Object.keys(resultado).forEach((nomeLoja) => {
          const loja = resultado[nomeLoja];
          Object.values(loja.Concorrentes).forEach((quantidade) => {
            expect(quantidade).toBeGreaterThanOrEqual(
              caso.parametros.quantidadeMinimaPorConcorrente
            );
          });
        });

        // Valida a distribuição (variância, etc)
        const validacao = validarDistribuicao(resultado, caso.parametros);
        expect(validacao.valida).toBe(true);
        if (!validacao.valida) {
          console.log('Erros de validação:', validacao.erros);
        }

        // Verifica equilíbrio: concorrentes no mesmo grupo devem ter totais similares
        const totaisPorConcorrente: { [nome: string]: { total: number; lojas: number } } = {};

        Object.values(resultado).forEach((loja) => {
          Object.entries(loja.Concorrentes).forEach(([concorrente, quantidade]) => {
            if (!totaisPorConcorrente[concorrente]) {
              totaisPorConcorrente[concorrente] = { total: 0, lojas: 0 };
            }
            totaisPorConcorrente[concorrente].total += quantidade || 0;
            totaisPorConcorrente[concorrente].lojas++;
          });
        });

        // Agrupar por número de lojas e verificar variância dentro do grupo
        const grupos: { [numLojas: number]: number[] } = {};
        Object.values(totaisPorConcorrente).forEach((info) => {
          if (!grupos[info.lojas]) grupos[info.lojas] = [];
          grupos[info.lojas].push(info.total);
        });

        Object.entries(grupos).forEach(([numLojas, totais]) => {
          if (totais.length > 1) {
            const media = totais.reduce((a, b) => a + b, 0) / totais.length;
            const maxDiff = Math.max(...totais) - Math.min(...totais);
            const variancia = (maxDiff / media) * 100;

            // Permitir margem de 5% além do limite para arredondamento
            expect(variancia).toBeLessThanOrEqual(
              caso.parametros.varianciaMaximaPermitida + 5
            );
          }
        });
      });
    });
  });

  describe('Validação de Restrições', () => {
    it('deve respeitar a soma exata por loja', () => {
      const entrada = dataset[0].entrada;
      const parametros = dataset[0].parametros;
      const resultado = distribuirProdutos(entrada, parametros);

      Object.keys(resultado).forEach((nomeLoja) => {
        const loja = resultado[nomeLoja];
        const somaCalculada = Object.values(loja.Concorrentes).reduce(
          (acc: number, val) => acc + (val || 0),
          0
        );
        expect(somaCalculada).toBe(loja.QuantidadeProdutosPesquisa);
      });
    });

    it('deve garantir quantidade mínima para todos os concorrentes', () => {
      const entrada = dataset[0].entrada;
      const parametros = dataset[0].parametros;
      const resultado = distribuirProdutos(entrada, parametros);

      Object.keys(resultado).forEach((nomeLoja) => {
        const loja = resultado[nomeLoja];
        Object.entries(loja.Concorrentes).forEach(([nome, quantidade]) => {
          expect(quantidade).toBeGreaterThanOrEqual(
            parametros.quantidadeMinimaPorConcorrente
          );
        });
      });
    });

    it('deve manter variância dentro do limite', () => {
      const entrada = dataset[0].entrada;
      const parametros = dataset[0].parametros;
      const resultado = distribuirProdutos(entrada, parametros);

      const validacao = validarDistribuicao(resultado, parametros);
      expect(validacao.valida).toBe(true);

      if (validacao.estatisticas) {
        expect(validacao.estatisticas.varianciaPercentual).toBeLessThanOrEqual(
          parametros.varianciaMaximaPermitida
        );
      }
    });
  });

  describe('Cálculo de Totais por Concorrente', () => {
    it('deve calcular totais corretos para concorrentes que aparecem em múltiplas lojas', () => {
      const entrada = dataset[0].entrada;
      const parametros = dataset[0].parametros;
      const resultado = distribuirProdutos(entrada, parametros);

      // Calcular totais por concorrente
      const totaisPorConcorrente: { [key: string]: number } = {};

      Object.values(resultado).forEach((loja) => {
        Object.entries(loja.Concorrentes).forEach(([concorrente, quantidade]) => {
          if (!totaisPorConcorrente[concorrente]) {
            totaisPorConcorrente[concorrente] = 0;
          }
          totaisPorConcorrente[concorrente] += quantidade || 0;
        });
      });

      // Verificar se todos os concorrentes têm valores positivos
      Object.values(totaisPorConcorrente).forEach((total) => {
        expect(total).toBeGreaterThan(0);
      });

      // Verificar se a soma total está correta
      const somaTotal = Object.values(totaisPorConcorrente).reduce(
        (acc, val) => acc + val,
        0
      );
      const somaTotalEsperada = Object.values(entrada).reduce(
        (acc, loja) => acc + loja.QuantidadeProdutosPesquisa,
        0
      );
      expect(somaTotal).toBe(somaTotalEsperada);
    });
  });

  describe('Casos Especiais', () => {
    it('deve lidar com uma única loja', () => {
      const entrada: DistribuicaoDados = {
        Loja1: {
          QuantidadeProdutosPesquisa: 100,
          Concorrentes: {
            ConcorrenteA: undefined,
            ConcorrenteB: undefined,
          },
        },
      };

      const parametros = {
        quantidadeMinimaPorConcorrente: 20,
        varianciaMaximaPermitida: 15,
      };

      const resultado = distribuirProdutos(entrada, parametros);

      expect(resultado.Loja1.Concorrentes.ConcorrenteA).toBe(50);
      expect(resultado.Loja1.Concorrentes.ConcorrenteB).toBe(50);
    });

    it('deve lidar com um único concorrente por loja', () => {
      const entrada: DistribuicaoDados = {
        Loja1: {
          QuantidadeProdutosPesquisa: 100,
          Concorrentes: {
            ConcorrenteA: undefined,
          },
        },
        Loja2: {
          QuantidadeProdutosPesquisa: 150,
          Concorrentes: {
            ConcorrenteB: undefined,
          },
        },
      };

      const parametros = {
        quantidadeMinimaPorConcorrente: 20,
        varianciaMaximaPermitida: 15,
      };

      const resultado = distribuirProdutos(entrada, parametros);

      expect(resultado.Loja1.Concorrentes.ConcorrenteA).toBe(100);
      expect(resultado.Loja2.Concorrentes.ConcorrenteB).toBe(150);
    });
  });

  describe('Função de Validação', () => {
    it('deve retornar válido para distribuição correta', () => {
      const entrada = dataset[0].entrada;
      const parametros = dataset[0].parametros;
      const distribuicao = distribuirProdutos(entrada, parametros);

      const validacao = validarDistribuicao(distribuicao, parametros);

      expect(validacao.valida).toBe(true);
      expect(validacao.erros).toHaveLength(0);
      expect(validacao.estatisticas).toBeDefined();
    });

    it('deve detectar soma incorreta por loja', () => {
      const distribuicao: DistribuicaoDados = {
        Loja1: {
          QuantidadeProdutosPesquisa: 100,
          Concorrentes: {
            ConcorrenteA: 40,
            ConcorrenteB: 50, // Soma = 90, mas deveria ser 100
          },
        },
      };

      const parametros = {
        quantidadeMinimaPorConcorrente: 20,
        varianciaMaximaPermitida: 15,
      };

      const validacao = validarDistribuicao(distribuicao, parametros);

      expect(validacao.valida).toBe(false);
      expect(validacao.erros.length).toBeGreaterThan(0);
    });

    it('deve calcular estatísticas corretamente', () => {
      const entrada = dataset[0].entrada;
      const parametros = dataset[0].parametros;
      const distribuicao = distribuirProdutos(entrada, parametros);

      const validacao = validarDistribuicao(distribuicao, parametros);

      expect(validacao.estatisticas).toBeDefined();
      if (validacao.estatisticas) {
        expect(validacao.estatisticas.totalProdutos).toBe(780);
        expect(validacao.estatisticas.totalConcorrentes).toBe(5);
      }
    });
  });
});
