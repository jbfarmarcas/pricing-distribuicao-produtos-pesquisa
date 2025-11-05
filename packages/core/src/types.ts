/**
 * Representa a distribuição de produtos entre concorrentes de uma loja
 */
export interface Concorrentes {
  [concorrente: string]: number | undefined;
}

/**
 * Representa uma loja com sua quantidade de produtos e concorrentes
 */
export interface Loja {
  QuantidadeProdutosPesquisa: number;
  Concorrentes: Concorrentes;
}

/**
 * Estrutura de dados de entrada/saída do algoritmo
 */
export interface DistribuicaoDados {
  [loja: string]: Loja;
}

/**
 * Parâmetros de configuração do algoritmo
 */
export interface ParametrosDistribuicao {
  /** Quantidade mínima de produtos que cada concorrente deve receber */
  quantidadeMinimaPorConcorrente: number;
  /** Variância máxima permitida entre concorrentes (em percentual) */
  varianciaMaximaPermitida: number;
  /** Número máximo de iterações para balanceamento de variância (padrão: 1000) */
  maxIteracoesBalanceamento?: number;
}

/**
 * Informações sobre cada concorrente durante o processamento
 */
export interface InfoConcorrente {
  /** Nome do concorrente */
  nome: string;
  /** Número de lojas em que aparece */
  numeroDeAparicoes: number;
  /** Total ideal que deveria receber */
  totalIdeal: number;
  /** Total atual que já recebeu */
  totalAtual: number;
  /** Quanto ainda precisa receber */
  falta: number;
}

/**
 * Nível de severidade de um aviso
 */
export enum NivelAviso {
  INFO = 'info',
  ATENCAO = 'atencao',
  CRITICO = 'critico'
}

/**
 * Aviso sobre limitações da distribuição
 */
export interface Aviso {
  /** Nível de severidade */
  nivel: NivelAviso;
  /** Título do aviso */
  titulo: string;
  /** Descrição detalhada */
  descricao: string;
  /** Sugestões de melhoria (opcional) */
  sugestoes?: string[];
}

/**
 * Resultado da validação da distribuição
 */
export interface ResultadoValidacao {
  /** Se a distribuição é válida */
  valida: boolean;
  /** Mensagens de erro, se houver */
  erros: string[];
  /** Avisos sobre a distribuição */
  avisos?: Aviso[];
  /** Estatísticas da distribuição */
  estatisticas?: {
    totalProdutos: number;
    totalConcorrentes: number;
    mediaPorConcorrente: number;
    varianciaPercentual: number;
    concorrentes: {
      [nome: string]: {
        total: number;
        numeroDeLojas: number;
      };
    };
  };
}
