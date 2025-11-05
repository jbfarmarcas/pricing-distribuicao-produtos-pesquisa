import type { DistribuicaoDados, InfoConcorrente, ResultadoValidacao } from '@distribuicao/core';

/**
 * Estados da execução do algoritmo
 */
export enum EstadoExecucao {
  INICIAL = 'INICIAL',
  CALCULOS_IDEAIS = 'CALCULOS_IDEAIS',
  DISTRIBUICAO_LOJA = 'DISTRIBUICAO_LOJA',
  AJUSTE_FINO = 'AJUSTE_FINO',
  BALANCEAMENTO = 'BALANCEAMENTO',
  FINAL = 'FINAL'
}

/**
 * Informação de transferência durante balanceamento
 */
export interface Transferencia {
  doador: string;
  receptor: string;
  quantidade: number;
  loja: string;
}

/**
 * Estado capturado em cada etapa do algoritmo
 */
export interface EstadoAlgoritmo {
  /** Tipo de estado */
  tipo: EstadoExecucao;
  /** Número da iteração (para balanceamento) */
  iteracao?: number;
  /** Distribuição atual */
  distribuicao: DistribuicaoDados;
  /** Informações dos concorrentes */
  concorrentes: InfoConcorrente[];
  /** Variância percentual atual */
  variancia?: number;
  /** Transferências realizadas (para balanceamento) */
  transferencias?: Transferencia[];
  /** Nome da loja sendo processada (para distribuição por loja) */
  lojaProcessada?: string;
  /** Descrição legível do estado */
  descricao: string;
}

/**
 * Resultado completo da execução com histórico
 */
export interface ResultadoExecucao {
  /** Distribuição final */
  distribuicaoFinal: DistribuicaoDados;
  /** Validação final */
  validacao: ResultadoValidacao;
  /** Histórico de estados */
  historico: EstadoAlgoritmo[];
}

/**
 * Configuração de entrada para teste de mesa
 */
export interface ConfiguracaoTeste {
  /** Nome do teste */
  nome: string;
  /** Descrição do teste (opcional) */
  descricao?: string;
  /** Dados de entrada */
  entrada: DistribuicaoDados;
  /** Parâmetros */
  parametros: {
    quantidadeMinimaPorConcorrente: number;
    varianciaMaximaPermitida: number;
    maxIteracoesBalanceamento?: number;
  };
}
