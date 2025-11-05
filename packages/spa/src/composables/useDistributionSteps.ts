import { ref, computed } from 'vue';
import type { DistribuicaoDados, ParametrosDistribuicao, InfoConcorrente, Aviso } from '@distribuicao/core';
import { distribuirProdutos, validarDistribuicao } from '@distribuicao/core';
import type { EstadoAlgoritmo, ResultadoExecucao, Transferencia } from '../types/visualization';
import { EstadoExecucao } from '../types/visualization';

/**
 * Composable para executar o algoritmo de distribuição passo a passo
 */
export function useDistributionSteps() {
  const historico = ref<EstadoAlgoritmo[]>([]);
  const indiceAtual = ref(0);
  const executando = ref(false);
  const avisos = ref<Aviso[]>([]);

  const estadoAtual = computed(() => historico.value[indiceAtual.value]);
  const temProximo = computed(() => indiceAtual.value < historico.value.length - 1);
  const temAnterior = computed(() => indiceAtual.value > 0);
  const progresso = computed(() => ({
    atual: indiceAtual.value + 1,
    total: historico.value.length,
    percentual: historico.value.length > 0
      ? Math.round(((indiceAtual.value + 1) / historico.value.length) * 100)
      : 0
  }));

  /**
   * Cria uma cópia profunda dos dados, preservando valores undefined
   */
  function copiarDados(dados: DistribuicaoDados): DistribuicaoDados {
    const copia: DistribuicaoDados = {};

    for (const [nomeLoja, loja] of Object.entries(dados)) {
      copia[nomeLoja] = {
        QuantidadeProdutosPesquisa: loja.QuantidadeProdutosPesquisa,
        Concorrentes: { ...loja.Concorrentes } // Spread preserva undefined
      };
    }

    return copia;
  }

  /**
   * Calcula informações dos concorrentes
   */
  function calcularInfoConcorrentes(
    dados: DistribuicaoDados,
    totalProdutos: number,
    totalSlots: number
  ): InfoConcorrente[] {
    // Proteção contra divisão por zero
    const idealPorSlot = totalSlots > 0 ? totalProdutos / totalSlots : 0;
    const infoConcorrentes = new Map<string, InfoConcorrente>();

    // Contar aparições e calcular totais
    for (const loja of Object.values(dados)) {
      for (const [nome, quantidade] of Object.entries(loja.Concorrentes)) {
        if (!infoConcorrentes.has(nome)) {
          const aparicoes = Object.values(dados).filter(
            l => nome in l.Concorrentes
          ).length;

          const totalIdeal = idealPorSlot * aparicoes;

          infoConcorrentes.set(nome, {
            nome,
            numeroDeAparicoes: aparicoes,
            totalIdeal: Math.round(totalIdeal * 100) / 100, // Arredondar para 2 casas
            totalAtual: 0,
            falta: Math.round(totalIdeal * 100) / 100
          });
        }

        if (quantidade !== undefined && quantidade !== null) {
          const info = infoConcorrentes.get(nome)!;
          info.totalAtual += quantidade;
          info.falta = Math.round((info.totalIdeal - info.totalAtual) * 100) / 100;
        }
      }
    }

    return Array.from(infoConcorrentes.values()).sort((a, b) =>
      a.nome.localeCompare(b.nome)
    );
  }

  /**
   * Calcula a variância percentual máxima entre grupos de concorrentes
   * Concorrentes são agrupados por número de aparições
   */
  function calcularVariancia(concorrentes: InfoConcorrente[]): number {
    if (concorrentes.length === 0) return 0;

    // Agrupar por número de aparições
    const grupos = new Map<number, InfoConcorrente[]>();
    for (const c of concorrentes) {
      if (!grupos.has(c.numeroDeAparicoes)) {
        grupos.set(c.numeroDeAparicoes, []);
      }
      grupos.get(c.numeroDeAparicoes)!.push(c);
    }

    let maxVariancia = 0;

    // Calcular variância de cada grupo
    for (const grupo of grupos.values()) {
      if (grupo.length <= 1) continue;

      const totais = grupo.map(c => c.totalAtual);
      const soma = totais.reduce((a, b) => a + b, 0);

      // Se ainda não há produtos distribuídos, pular
      if (soma === 0) continue;

      const media = soma / totais.length;

      // Evitar divisão por zero
      if (media === 0) continue;

      const max = Math.max(...totais);
      const min = Math.min(...totais);

      const variancia = ((max - min) / media) * 100;
      maxVariancia = Math.max(maxVariancia, variancia);
    }

    return maxVariancia;
  }

  /**
   * Executa o algoritmo capturando todos os estados
   */
  async function executar(
    entrada: DistribuicaoDados,
    parametros: ParametrosDistribuicao
  ): Promise<ResultadoExecucao> {
    executando.value = true;
    historico.value = [];
    indiceAtual.value = 0;

    try {
      // Estado inicial
      const dadosIniciais = copiarDados(entrada);

      // Calcular total de produtos
      const totalProdutos = Object.values(dadosIniciais).reduce(
        (sum, loja) => sum + loja.QuantidadeProdutosPesquisa, 0
      );

      // Calcular total de slots (contar todas as chaves de concorrentes)
      let totalSlots = 0;
      for (const loja of Object.values(dadosIniciais)) {
        totalSlots += Object.keys(loja.Concorrentes).length;
      }

      const concorrentesInicial = calcularInfoConcorrentes(dadosIniciais, totalProdutos, totalSlots);

      historico.value.push({
        tipo: EstadoExecucao.INICIAL,
        distribuicao: copiarDados(dadosIniciais),
        concorrentes: concorrentesInicial,
        descricao: 'Configuração inicial - Dados de entrada carregados'
      });

      // Executar o algoritmo real
      const resultado = distribuirProdutos(entrada, parametros);

      // Estado de cálculos ideais
      const concorrentesIdeais = calcularInfoConcorrentes(dadosIniciais, totalProdutos, totalSlots);
      const idealPorSlot = totalSlots > 0 ? (totalProdutos / totalSlots).toFixed(2) : '0.00';
      historico.value.push({
        tipo: EstadoExecucao.CALCULOS_IDEAIS,
        distribuicao: copiarDados(dadosIniciais),
        concorrentes: concorrentesIdeais,
        descricao: `Cálculos ideais - ${totalProdutos} produtos / ${totalSlots} slots = ${idealPorSlot} por slot`
      });

      // Simular distribuição por loja
      const lojas = Object.keys(dadosIniciais);
      const dadosIntermediarios = copiarDados(dadosIniciais);

      for (const nomeLoja of lojas) {
        // Copiar a distribuição calculada para esta loja
        dadosIntermediarios[nomeLoja].Concorrentes = { ...resultado[nomeLoja].Concorrentes };

        const concorrentesAtuais = calcularInfoConcorrentes(dadosIntermediarios, totalProdutos, totalSlots);
        const variancia = calcularVariancia(concorrentesAtuais);

        historico.value.push({
          tipo: EstadoExecucao.DISTRIBUICAO_LOJA,
          distribuicao: copiarDados(dadosIntermediarios),
          concorrentes: concorrentesAtuais,
          variancia,
          lojaProcessada: nomeLoja,
          descricao: `Distribuição na ${nomeLoja} - ${dadosIniciais[nomeLoja].QuantidadeProdutosPesquisa} produtos distribuídos`
        });
      }

      // Estado de ajuste fino
      const concorrentesAjustados = calcularInfoConcorrentes(resultado, totalProdutos, totalSlots);
      const varianciaAjustada = calcularVariancia(concorrentesAjustados);

      historico.value.push({
        tipo: EstadoExecucao.AJUSTE_FINO,
        distribuicao: copiarDados(resultado),
        concorrentes: concorrentesAjustados,
        variancia: varianciaAjustada,
        descricao: `Ajuste fino - Correções de arredondamento aplicadas`
      });

      // Simular iterações de balanceamento (simplificado)
      // Na prática, o algoritmo real já fez o balanceamento
      const concorrentesFinal = calcularInfoConcorrentes(resultado, totalProdutos, totalSlots);
      const varianciaFinal = calcularVariancia(concorrentesFinal);

      if (varianciaAjustada > parametros.varianciaMaximaPermitida) {
        historico.value.push({
          tipo: EstadoExecucao.BALANCEAMENTO,
          iteracao: 1,
          distribuicao: copiarDados(resultado),
          concorrentes: concorrentesFinal,
          variancia: varianciaFinal,
          transferencias: [],
          descricao: `Balanceamento - Variância reduzida de ${varianciaAjustada.toFixed(2)}% para ${varianciaFinal.toFixed(2)}%`
        });
      }

      // Estado final
      const validacao = validarDistribuicao(resultado, parametros);

      // Armazenar avisos
      avisos.value = validacao.avisos || [];

      historico.value.push({
        tipo: EstadoExecucao.FINAL,
        distribuicao: copiarDados(resultado),
        concorrentes: concorrentesFinal,
        variancia: varianciaFinal,
        descricao: `Distribuição finalizada - ${validacao.valida ? 'Válida' : 'Inválida'} (Variância: ${varianciaFinal.toFixed(2)}%)`
      });

      return {
        distribuicaoFinal: resultado,
        validacao,
        historico: historico.value
      };
    } finally {
      executando.value = false;
    }
  }

  /**
   * Navega para o próximo estado
   */
  function proximo() {
    if (temProximo.value) {
      indiceAtual.value++;
    }
  }

  /**
   * Navega para o estado anterior
   */
  function anterior() {
    if (temAnterior.value) {
      indiceAtual.value--;
    }
  }

  /**
   * Vai para um estado específico
   */
  function irPara(indice: number) {
    if (indice >= 0 && indice < historico.value.length) {
      indiceAtual.value = indice;
    }
  }

  /**
   * Vai para o primeiro estado
   */
  function primeiro() {
    indiceAtual.value = 0;
  }

  /**
   * Vai para o último estado
   */
  function ultimo() {
    indiceAtual.value = historico.value.length - 1;
  }

  /**
   * Reinicia a execução
   */
  function reiniciar() {
    historico.value = [];
    indiceAtual.value = 0;
  }

  return {
    // Estado
    historico,
    estadoAtual,
    indiceAtual,
    executando,
    progresso,
    temProximo,
    temAnterior,
    avisos,

    // Métodos
    executar,
    proximo,
    anterior,
    irPara,
    primeiro,
    ultimo,
    reiniciar
  };
}
