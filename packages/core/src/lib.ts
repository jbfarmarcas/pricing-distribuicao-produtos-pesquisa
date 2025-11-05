// Re-export principais funções e tipos para uso como biblioteca
export { distribuirProdutos, validarDistribuicao } from './distribuidor';
export { dataset as casosDeTeste } from './dataset';
export type {
  DistribuicaoDados,
  ParametrosDistribuicao,
  ResultadoValidacao,
  InfoConcorrente,
  Aviso
} from './types';
export { NivelAviso } from './types';
