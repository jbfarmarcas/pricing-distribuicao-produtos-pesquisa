import type { DistribuicaoDados, ParametrosDistribuicao } from './types';

/**
 * Interface para um caso de teste
 */
export interface CasoTeste {
  nome: string;
  descricao: string;
  entrada: DistribuicaoDados;
  parametros: ParametrosDistribuicao;
}

/**
 * Dataset com casos de teste para o algoritmo de distribuição
 */
export const dataset: CasoTeste[] = [
  {
    nome: 'Caso 1: Exemplo do README',
    descricao: 'Caso básico com 3 lojas e 5 concorrentes conforme documentado no README',
    parametros: {
      quantidadeMinimaPorConcorrente: 20,
      varianciaMaximaPermitida: 15,
    },
    entrada: {
      Loja1: {
        QuantidadeProdutosPesquisa: 180,
        Concorrentes: {
          ConcorrenteA: undefined,
          ConcorrenteB: undefined,
          ConcorrenteC: undefined,
        },
      },
      Loja2: {
        QuantidadeProdutosPesquisa: 200,
        Concorrentes: {
          ConcorrenteA: undefined,
          ConcorrenteB: undefined,
          ConcorrenteC: undefined,
          ConcorrenteE: undefined,
        },
      },
      Loja3: {
        QuantidadeProdutosPesquisa: 400,
        Concorrentes: {
          ConcorrenteA: undefined,
          ConcorrenteB: undefined,
          ConcorrenteC: undefined,
          ConcorrenteD: undefined,
          ConcorrenteE: undefined,
        },
      },
    },
  },
  {
    nome: 'Caso 2: Distribuição simples com 2 lojas',
    descricao: 'Caso simples com apenas 2 lojas e 3 concorrentes',
    parametros: {
      quantidadeMinimaPorConcorrente: 10,
      varianciaMaximaPermitida: 15,
    },
    entrada: {
      Loja1: {
        QuantidadeProdutosPesquisa: 100,
        Concorrentes: {
          ConcorrenteA: undefined,
          ConcorrenteB: undefined,
        },
      },
      Loja2: {
        QuantidadeProdutosPesquisa: 150,
        Concorrentes: {
          ConcorrenteA: undefined,
          ConcorrenteB: undefined,
          ConcorrenteC: undefined,
        },
      },
    },
  },
  {
    nome: 'Caso 3: Uma loja com múltiplos concorrentes',
    descricao: 'Caso com apenas uma loja distribuindo entre vários concorrentes',
    parametros: {
      quantidadeMinimaPorConcorrente: 15,
      varianciaMaximaPermitida: 10,
    },
    entrada: {
      Loja1: {
        QuantidadeProdutosPesquisa: 200,
        Concorrentes: {
          ConcorrenteA: undefined,
          ConcorrenteB: undefined,
          ConcorrenteC: undefined,
          ConcorrenteD: undefined,
        },
      },
    },
  },
  {
    nome: 'Caso 4: Concorrentes exclusivos por loja',
    descricao: 'Cada loja tem concorrentes completamente diferentes',
    parametros: {
      quantidadeMinimaPorConcorrente: 20,
      varianciaMaximaPermitida: 50, // Maior porque não há sobreposição de concorrentes
    },
    entrada: {
      Loja1: {
        QuantidadeProdutosPesquisa: 100,
        Concorrentes: {
          ConcorrenteA: undefined,
          ConcorrenteB: undefined,
        },
      },
      Loja2: {
        QuantidadeProdutosPesquisa: 120,
        Concorrentes: {
          ConcorrenteC: undefined,
          ConcorrenteD: undefined,
        },
      },
      Loja3: {
        QuantidadeProdutosPesquisa: 80,
        Concorrentes: {
          ConcorrenteE: undefined,
          ConcorrenteF: undefined,
        },
      },
    },
  },
  {
    nome: 'Caso 5: Números que não dividem exatamente',
    descricao: 'Teste de arredondamento com números que não dividem perfeitamente',
    parametros: {
      quantidadeMinimaPorConcorrente: 10,
      varianciaMaximaPermitida: 20,
    },
    entrada: {
      Loja1: {
        QuantidadeProdutosPesquisa: 100,
        Concorrentes: {
          ConcorrenteA: undefined,
          ConcorrenteB: undefined,
          ConcorrenteC: undefined,
        },
      },
      Loja2: {
        QuantidadeProdutosPesquisa: 100,
        Concorrentes: {
          ConcorrenteA: undefined,
          ConcorrenteB: undefined,
          ConcorrenteC: undefined,
        },
      },
    },
  },
  {
    nome: 'Caso 6: Quantidade mínima testada',
    descricao: 'Verifica se todos os concorrentes recebem pelo menos o mínimo',
    parametros: {
      quantidadeMinimaPorConcorrente: 30,
      varianciaMaximaPermitida: 20,
    },
    entrada: {
      Loja1: {
        QuantidadeProdutosPesquisa: 150,
        Concorrentes: {
          ConcorrenteA: undefined,
          ConcorrenteB: undefined,
          ConcorrenteC: undefined,
          ConcorrenteD: undefined,
        },
      },
      Loja2: {
        QuantidadeProdutosPesquisa: 90,
        Concorrentes: {
          ConcorrenteA: undefined,
          ConcorrenteB: undefined,
          ConcorrenteC: undefined,
        },
      },
    },
  },
  {
    nome: 'Caso 7: Rede média com 5 lojas e 8 concorrentes',
    descricao: 'Simula uma rede de médio porte com distribuição variada',
    parametros: {
      quantidadeMinimaPorConcorrente: 25,
      varianciaMaximaPermitida: 15,
    },
    entrada: {
      Loja1: {
        QuantidadeProdutosPesquisa: 250,
        Concorrentes: {
          ConcorrenteA: undefined,
          ConcorrenteB: undefined,
          ConcorrenteC: undefined,
          ConcorrenteD: undefined,
        },
      },
      Loja2: {
        QuantidadeProdutosPesquisa: 180,
        Concorrentes: {
          ConcorrenteA: undefined,
          ConcorrenteB: undefined,
          ConcorrenteE: undefined,
        },
      },
      Loja3: {
        QuantidadeProdutosPesquisa: 320,
        Concorrentes: {
          ConcorrenteA: undefined,
          ConcorrenteC: undefined,
          ConcorrenteF: undefined,
          ConcorrenteG: undefined,
          ConcorrenteH: undefined,
        },
      },
      Loja4: {
        QuantidadeProdutosPesquisa: 200,
        Concorrentes: {
          ConcorrenteB: undefined,
          ConcorrenteD: undefined,
          ConcorrenteF: undefined,
          ConcorrenteH: undefined,
        },
      },
      Loja5: {
        QuantidadeProdutosPesquisa: 280,
        Concorrentes: {
          ConcorrenteC: undefined,
          ConcorrenteE: undefined,
          ConcorrenteG: undefined,
          ConcorrenteH: undefined,
        },
      },
    },
  },
  {
    nome: 'Caso 8: Rede grande com 10 lojas e 12 concorrentes',
    descricao: 'Simula uma rede grande com alta complexidade',
    parametros: {
      quantidadeMinimaPorConcorrente: 30,
      varianciaMaximaPermitida: 20,
    },
    entrada: {
      Loja1: {
        QuantidadeProdutosPesquisa: 300,
        Concorrentes: {
          ConcorrenteA: undefined,
          ConcorrenteB: undefined,
          ConcorrenteC: undefined,
          ConcorrenteD: undefined,
          ConcorrenteE: undefined,
        },
      },
      Loja2: {
        QuantidadeProdutosPesquisa: 250,
        Concorrentes: {
          ConcorrenteA: undefined,
          ConcorrenteC: undefined,
          ConcorrenteF: undefined,
          ConcorrenteG: undefined,
        },
      },
      Loja3: {
        QuantidadeProdutosPesquisa: 400,
        Concorrentes: {
          ConcorrenteB: undefined,
          ConcorrenteD: undefined,
          ConcorrenteE: undefined,
          ConcorrenteH: undefined,
          ConcorrenteI: undefined,
          ConcorrenteJ: undefined,
        },
      },
      Loja4: {
        QuantidadeProdutosPesquisa: 180,
        Concorrentes: {
          ConcorrenteA: undefined,
          ConcorrenteF: undefined,
          ConcorrenteK: undefined,
        },
      },
      Loja5: {
        QuantidadeProdutosPesquisa: 350,
        Concorrentes: {
          ConcorrenteC: undefined,
          ConcorrenteG: undefined,
          ConcorrenteH: undefined,
          ConcorrenteL: undefined,
          ConcorrenteJ: undefined,
        },
      },
      Loja6: {
        QuantidadeProdutosPesquisa: 220,
        Concorrentes: {
          ConcorrenteB: undefined,
          ConcorrenteE: undefined,
          ConcorrenteI: undefined,
          ConcorrenteK: undefined,
        },
      },
      Loja7: {
        QuantidadeProdutosPesquisa: 280,
        Concorrentes: {
          ConcorrenteD: undefined,
          ConcorrenteF: undefined,
          ConcorrenteH: undefined,
          ConcorrenteL: undefined,
        },
      },
      Loja8: {
        QuantidadeProdutosPesquisa: 320,
        Concorrentes: {
          ConcorrenteA: undefined,
          ConcorrenteC: undefined,
          ConcorrenteG: undefined,
          ConcorrenteI: undefined,
          ConcorrenteK: undefined,
        },
      },
      Loja9: {
        QuantidadeProdutosPesquisa: 240,
        Concorrentes: {
          ConcorrenteB: undefined,
          ConcorrenteE: undefined,
          ConcorrenteJ: undefined,
          ConcorrenteL: undefined,
        },
      },
      Loja10: {
        QuantidadeProdutosPesquisa: 380,
        Concorrentes: {
          ConcorrenteD: undefined,
          ConcorrenteF: undefined,
          ConcorrenteH: undefined,
          ConcorrenteI: undefined,
          ConcorrenteK: undefined,
          ConcorrenteL: undefined,
        },
      },
    },
  },
  {
    nome: 'Caso 9: Cenário assimétrico com lojas pequenas e grandes',
    descricao: 'Mix de lojas com quantidades muito diferentes',
    parametros: {
      quantidadeMinimaPorConcorrente: 15,
      varianciaMaximaPermitida: 20,
    },
    entrada: {
      LojaGrande1: {
        QuantidadeProdutosPesquisa: 500,
        Concorrentes: {
          ConcorrenteA: undefined,
          ConcorrenteB: undefined,
          ConcorrenteC: undefined,
          ConcorrenteD: undefined,
          ConcorrenteE: undefined,
          ConcorrenteF: undefined,
        },
      },
      LojaPequena1: {
        QuantidadeProdutosPesquisa: 80,
        Concorrentes: {
          ConcorrenteA: undefined,
          ConcorrenteB: undefined,
        },
      },
      LojaMédia1: {
        QuantidadeProdutosPesquisa: 200,
        Concorrentes: {
          ConcorrenteC: undefined,
          ConcorrenteD: undefined,
          ConcorrenteG: undefined,
        },
      },
      LojaGrande2: {
        QuantidadeProdutosPesquisa: 450,
        Concorrentes: {
          ConcorrenteA: undefined,
          ConcorrenteE: undefined,
          ConcorrenteF: undefined,
          ConcorrenteG: undefined,
          ConcorrenteH: undefined,
        },
      },
      LojaPequena2: {
        QuantidadeProdutosPesquisa: 90,
        Concorrentes: {
          ConcorrenteB: undefined,
          ConcorrenteC: undefined,
        },
      },
      LojaMédia2: {
        QuantidadeProdutosPesquisa: 180,
        Concorrentes: {
          ConcorrenteD: undefined,
          ConcorrenteH: undefined,
          ConcorrenteG: undefined,
        },
      },
    },
  },
  {
    nome: 'Caso 10: Alta densidade de concorrentes',
    descricao: 'Poucas lojas mas muitos concorrentes por loja',
    parametros: {
      quantidadeMinimaPorConcorrente: 20,
      varianciaMaximaPermitida: 18,
    },
    entrada: {
      LojaA: {
        QuantidadeProdutosPesquisa: 400,
        Concorrentes: {
          Concorrente1: undefined,
          Concorrente2: undefined,
          Concorrente3: undefined,
          Concorrente4: undefined,
          Concorrente5: undefined,
          Concorrente6: undefined,
          Concorrente7: undefined,
          Concorrente8: undefined,
        },
      },
      LojaB: {
        QuantidadeProdutosPesquisa: 350,
        Concorrentes: {
          Concorrente1: undefined,
          Concorrente3: undefined,
          Concorrente5: undefined,
          Concorrente7: undefined,
          Concorrente9: undefined,
          Concorrente10: undefined,
        },
      },
      LojaC: {
        QuantidadeProdutosPesquisa: 380,
        Concorrentes: {
          Concorrente2: undefined,
          Concorrente4: undefined,
          Concorrente6: undefined,
          Concorrente8: undefined,
          Concorrente9: undefined,
          Concorrente10: undefined,
          Concorrente11: undefined,
        },
      },
    },
  },
  {
    nome: 'Caso 11: Rede realista com 8 lojas e padrão de sobreposição',
    descricao: 'Simula cenário realista com concorrentes comuns em regiões',
    parametros: {
      quantidadeMinimaPorConcorrente: 25,
      varianciaMaximaPermitida: 20,
      maxIteracoesBalanceamento: 5000, // Mais iterações devido à complexidade
    },
    entrada: {
      LojaZonaNorte1: {
        QuantidadeProdutosPesquisa: 280,
        Concorrentes: {
          SupermercadoA: undefined,
          SupermercadoB: undefined,
          AtacadistaX: undefined,
          FarmáciaY: undefined,
          SupermercadoC: undefined, // Adicionar para permitir balanceamento
        },
      },
      LojaZonaNorte2: {
        QuantidadeProdutosPesquisa: 240,
        Concorrentes: {
          SupermercadoA: undefined,
          SupermercadoB: undefined,
          AtacadistaX: undefined,
        },
      },
      LojaZonaSul1: {
        QuantidadeProdutosPesquisa: 320,
        Concorrentes: {
          SupermercadoC: undefined,
          SupermercadoD: undefined,
          AtacadistaZ: undefined,
          FarmáciaW: undefined,
          PetShopP: undefined,
          FarmáciaY: undefined, // Adicionar para permitir balanceamento
        },
      },
      LojaZonaSul2: {
        QuantidadeProdutosPesquisa: 260,
        Concorrentes: {
          SupermercadoC: undefined,
          SupermercadoD: undefined,
          AtacadistaZ: undefined,
          PetShopP: undefined,
        },
      },
      LojaZonaLeste1: {
        QuantidadeProdutosPesquisa: 300,
        Concorrentes: {
          SupermercadoA: undefined,
          SupermercadoE: undefined,
          AtacadistaX: undefined,
          FarmáciaY: undefined,
          PetShopQ: undefined,
        },
      },
      LojaZonaLeste2: {
        QuantidadeProdutosPesquisa: 220,
        Concorrentes: {
          SupermercadoE: undefined,
          AtacadistaZ: undefined,
          PetShopQ: undefined,
        },
      },
      LojaZonaOeste1: {
        QuantidadeProdutosPesquisa: 290,
        Concorrentes: {
          SupermercadoB: undefined,
          SupermercadoD: undefined,
          SupermercadoE: undefined,
          FarmáciaW: undefined,
        },
      },
      LojaZonaOeste2: {
        QuantidadeProdutosPesquisa: 270,
        Concorrentes: {
          SupermercadoB: undefined,
          SupermercadoD: undefined,
          FarmáciaW: undefined,
          PetShopP: undefined,
        },
      },
    },
  },
];
