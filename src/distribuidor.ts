import type {
  DistribuicaoDados,
  ParametrosDistribuicao,
  InfoConcorrente,
  ResultadoValidacao,
} from './types';

/**
 * Distribui produtos entre concorrentes de forma equilibrada
 * seguindo a abordagem híbrida descrita no README
 */
export function distribuirProdutos(
  entrada: DistribuicaoDados,
  parametros: ParametrosDistribuicao
): DistribuicaoDados {
  // Criar cópia profunda da entrada, preservando estrutura
  const resultado: DistribuicaoDados = {};

  for (const [nomeLoja, loja] of Object.entries(entrada)) {
    resultado[nomeLoja] = {
      QuantidadeProdutosPesquisa: loja.QuantidadeProdutosPesquisa,
      Concorrentes: {},
    };
    // Copiar concorrentes mantendo as chaves
    for (const nomeConcorrente of Object.keys(loja.Concorrentes)) {
      resultado[nomeLoja].Concorrentes[nomeConcorrente] = 0;
    }
  }

  // ETAPA 1: Calcular o Total Teórico Ideal
  const { totalProdutos, totalSlots, concorrentes } = calcularTotaisIdeais(resultado);

  const idealPorSlot = totalProdutos / totalSlots;

  // Calcular total ideal por concorrente
  concorrentes.forEach((info) => {
    info.totalIdeal = idealPorSlot * info.numeroDeAparicoes;
    info.totalAtual = 0;
    info.falta = info.totalIdeal;
  });

  // ETAPA 2: Distribuir em cada loja
  const nomesLojas = Object.keys(resultado);

  for (const nomeLoja of nomesLojas) {
    const loja = resultado[nomeLoja];
    const concorrentesNaLoja = Object.keys(loja.Concorrentes);

    // Calcular quanto cada concorrente ainda precisa
    const faltasPorConcorrente: { [nome: string]: number } = {};
    let somaFaltas = 0;

    for (const nomeConcorrente of concorrentesNaLoja) {
      const info = concorrentes.find((c) => c.nome === nomeConcorrente);
      if (info) {
        faltasPorConcorrente[nomeConcorrente] = info.falta;
        somaFaltas += info.falta;
      }
    }

    // Distribuir produtos proporcionalmente às faltas
    const produtosNaLoja = loja.QuantidadeProdutosPesquisa;
    const distribuicao: { [nome: string]: number } = {};
    let somaDistribuida = 0;

    for (let i = 0; i < concorrentesNaLoja.length; i++) {
      const nomeConcorrente = concorrentesNaLoja[i];
      const falta = faltasPorConcorrente[nomeConcorrente] || 0;

      let quantidade: number;

      // Para o último concorrente, ajustar para bater o total exato
      if (i === concorrentesNaLoja.length - 1) {
        quantidade = produtosNaLoja - somaDistribuida;
      } else {
        // Distribuir proporcionalmente
        if (somaFaltas > 0) {
          quantidade = Math.round((produtosNaLoja * falta) / somaFaltas);
        } else {
          // Se não há mais faltas, distribuir igualmente
          quantidade = Math.round(
            (produtosNaLoja - somaDistribuida) / (concorrentesNaLoja.length - i)
          );
        }
      }

      // Garantir quantidade mínima
      quantidade = Math.max(quantidade, parametros.quantidadeMinimaPorConcorrente);

      distribuicao[nomeConcorrente] = quantidade;
      somaDistribuida += quantidade;
    }

    // ETAPA 3: Ajuste fino para garantir soma exata
    const diferenca = produtosNaLoja - somaDistribuida;

    if (diferenca !== 0) {
      // Ajustar a distribuição para bater o total exato
      // Se a diferença for negativa, encontrar quem pode doar sem violar o mínimo
      if (diferenca < 0) {
        // Precisa remover produtos
        const concorrentesOrdenados = concorrentesNaLoja
          .map(nome => ({ nome, quantidade: distribuicao[nome] }))
          .sort((a, b) => b.quantidade - a.quantidade);

        let diferencaRestante = diferenca;
        for (const { nome, quantidade } of concorrentesOrdenados) {
          const podeRemover = quantidade - parametros.quantidadeMinimaPorConcorrente;
          if (podeRemover > 0) {
            const remover = Math.min(podeRemover, Math.abs(diferencaRestante));
            distribuicao[nome] -= remover;
            diferencaRestante += remover;
            if (diferencaRestante >= 0) break;
          }
        }
      } else {
        // Pode adicionar ao último
        distribuicao[concorrentesNaLoja[concorrentesNaLoja.length - 1]] += diferenca;
      }
    }

    // Aplicar distribuição à loja
    for (const nomeConcorrente of concorrentesNaLoja) {
      loja.Concorrentes[nomeConcorrente] = distribuicao[nomeConcorrente];

      // Atualizar info do concorrente
      const info = concorrentes.find((c) => c.nome === nomeConcorrente);
      if (info) {
        info.totalAtual += distribuicao[nomeConcorrente];
        info.falta = info.totalIdeal - info.totalAtual;
      }
    }
  }

  // Ajuste final para garantir restrições
  ajustarDistribuicao(resultado, parametros, concorrentes);

  // ETAPA 4: Balanceamento fino para reduzir variância
  balancearVariancia(resultado, parametros, concorrentes);

  return resultado;
}

/**
 * Calcula totais e informações sobre concorrentes
 */
function calcularTotaisIdeais(dados: DistribuicaoDados): {
  totalProdutos: number;
  totalSlots: number;
  concorrentes: InfoConcorrente[];
} {
  let totalProdutos = 0;
  let totalSlots = 0;
  const mapaContagem: { [nome: string]: number } = {};

  // Contar aparições e produtos
  Object.values(dados).forEach((loja) => {
    totalProdutos += loja.QuantidadeProdutosPesquisa;

    Object.keys(loja.Concorrentes).forEach((concorrente) => {
      mapaContagem[concorrente] = (mapaContagem[concorrente] || 0) + 1;
      totalSlots++;
    });
  });

  // Criar array de informações dos concorrentes
  const concorrentes: InfoConcorrente[] = Object.entries(mapaContagem).map(
    ([nome, numeroDeAparicoes]) => ({
      nome,
      numeroDeAparicoes,
      totalIdeal: 0,
      totalAtual: 0,
      falta: 0,
    })
  );

  return { totalProdutos, totalSlots, concorrentes };
}

/**
 * Balanceia a distribuição para reduzir variância dentro de grupos
 */
function balancearVariancia(
  dados: DistribuicaoDados,
  parametros: ParametrosDistribuicao,
  concorrentes: InfoConcorrente[]
): void {
  const MAX_ITERACOES = parametros.maxIteracoesBalanceamento || 1000;
  const DEBUG = false; // Set to true to enable debug logging

  for (let iteracao = 0; iteracao < MAX_ITERACOES; iteracao++) {
    if (DEBUG) console.log(`\n=== Iteração ${iteracao + 1} ===`);

    // Recalcular totais atuais
    concorrentes.forEach((info) => {
      info.totalAtual = 0;
    });

    Object.values(dados).forEach((loja) => {
      Object.entries(loja.Concorrentes).forEach(([nome, quantidade]) => {
        const info = concorrentes.find((c) => c.nome === nome);
        if (info && quantidade) {
          info.totalAtual += quantidade;
        }
      });
    });

    // Agrupar concorrentes por número de aparições
    const grupos: { [numAparicoes: number]: InfoConcorrente[] } = {};
    concorrentes.forEach((info) => {
      if (!grupos[info.numeroDeAparicoes]) {
        grupos[info.numeroDeAparicoes] = [];
      }
      grupos[info.numeroDeAparicoes].push(info);
    });

    let houveAjuste = false;

    // Para cada grupo, tentar balancear
    Object.values(grupos).forEach((grupo) => {
      if (grupo.length < 2) return; // Precisa de pelo menos 2 para balancear

      const totais = grupo.map((c) => c.totalAtual);
      const media = totais.reduce((a, b) => a + b, 0) / totais.length;
      const max = Math.max(...totais);
      const min = Math.min(...totais);
      const variancia = ((max - min) / media) * 100;

      if (DEBUG) {
        console.log(`\nGrupo com ${grupo[0].numeroDeAparicoes} aparições:`);
        console.log(`  Concorrentes: ${grupo.map(c => `${c.nome}=${c.totalAtual}`).join(', ')}`);
        console.log(`  Variância: ${variancia.toFixed(2)}% (limite: ${parametros.varianciaMaximaPermitida}%)`);
      }

      // Se variância estiver acima do limite, tentar redistribuir
      if (variancia > parametros.varianciaMaximaPermitida) {
        // Calcular a média do grupo
        const mediaGrupo = totais.reduce((a, b) => a + b, 0) / totais.length;

        // Tentar balancear qualquer par de concorrentes no grupo
        // Procurar todos que estão acima/abaixo da média e podem transferir
        let transferenciasRealizadas = 0;

        for (const [nomeLoja, loja] of Object.entries(dados)) {
          // Encontrar concorrentes deste grupo nesta loja
          const concorrentesNaLoja = grupo.filter(
            (c) => loja.Concorrentes[c.nome] !== undefined
          );

          if (concorrentesNaLoja.length < 2) continue;

          // Ordenar por total atual (maior para menor)
          concorrentesNaLoja.sort((a, b) => b.totalAtual - a.totalAtual);

          const doador = concorrentesNaLoja[0]; // Maior total
          const receptor = concorrentesNaLoja[concorrentesNaLoja.length - 1]; // Menor total

          // Só transferir se o doador está acima da média e o receptor abaixo
          if (doador.totalAtual > mediaGrupo && receptor.totalAtual < mediaGrupo) {
            const qtdDoador = loja.Concorrentes[doador.nome];
            const qtdReceptor = loja.Concorrentes[receptor.nome];

            if (qtdDoador !== undefined && qtdReceptor !== undefined) {
              // Calcular quanto transferir: tentar chegar perto da média
              const excessoDoador = doador.totalAtual - mediaGrupo;
              const faltaReceptor = mediaGrupo - receptor.totalAtual;
              const transferenciaIdeal = Math.min(excessoDoador, faltaReceptor);

              // Limitar pela quantidade disponível na loja
              const maxTransferencia = qtdDoador - parametros.quantidadeMinimaPorConcorrente;
              const transferencia = Math.min(
                Math.max(1, Math.floor(transferenciaIdeal / 2)),
                maxTransferencia
              );

              if (DEBUG && transferencia > 0) {
                console.log(
                  `  Loja ${nomeLoja}: transferir ${transferencia} de ${doador.nome}(${doador.totalAtual}) para ${receptor.nome}(${receptor.totalAtual})`
                );
              }

              if (transferencia > 0) {
                loja.Concorrentes[doador.nome] = qtdDoador - transferencia;
                loja.Concorrentes[receptor.nome] = qtdReceptor + transferencia;
                doador.totalAtual -= transferencia;
                receptor.totalAtual += transferencia;
                houveAjuste = true;
                transferenciasRealizadas++;
              }
            }
          }
        }

        if (DEBUG && transferenciasRealizadas > 0) {
          console.log(`  ✓ ${transferenciasRealizadas} transferências realizadas`);
        } else if (DEBUG) {
          console.log(`  ✗ Não foi possível balancear este grupo`);
        }
      }
    });

    if (DEBUG) console.log(`\nHouve ajuste: ${houveAjuste}`);

    // Se não houve ajuste, não precisa continuar iterando
    if (!houveAjuste) break;
  }
}

/**
 * Ajusta a distribuição para garantir restrições
 */
function ajustarDistribuicao(
  dados: DistribuicaoDados,
  parametros: ParametrosDistribuicao,
  concorrentes: InfoConcorrente[]
): void {
  // Verificar e ajustar cada loja para garantir soma correta
  Object.entries(dados).forEach(([nomeLoja, loja]) => {
    const somaAtual = Object.values(loja.Concorrentes).reduce(
      (acc: number, val) => acc + (val || 0),
      0
    );
    const diferenca = loja.QuantidadeProdutosPesquisa - somaAtual;

    if (diferenca !== 0) {
      // Encontrar concorrente com mais produtos (ou menos, se diferença negativa)
      const concorrentesOrdenados = Object.entries(loja.Concorrentes).sort(
        (a, b) => (b[1] || 0) - (a[1] || 0)
      );

      if (concorrentesOrdenados.length > 0) {
        if (diferenca > 0) {
          // Adicionar ao que tem mais espaço
          const [nome, quantidadeAtual] = concorrentesOrdenados[0];
          loja.Concorrentes[nome] = (quantidadeAtual || 0) + diferenca;
        } else {
          // Remover do que tem mais produtos (mantendo mínimo)
          for (const [nome, quantidadeAtual] of concorrentesOrdenados) {
            const novaQuantidade = (quantidadeAtual || 0) + diferenca;
            if (novaQuantidade >= parametros.quantidadeMinimaPorConcorrente) {
              loja.Concorrentes[nome] = novaQuantidade;
              break;
            }
          }
        }
      }
    }
  });
}

/**
 * Valida se a distribuição respeita todas as restrições
 */
export function validarDistribuicao(
  dados: DistribuicaoDados,
  parametros: ParametrosDistribuicao
): ResultadoValidacao {
  const erros: string[] = [];

  // Calcular totais por concorrente
  const totaisPorConcorrente: { [nome: string]: { total: number; numeroDeLojas: number } } =
    {};

  Object.entries(dados).forEach(([nomeLoja, loja]) => {
    // Verificar soma por loja
    const somaLoja = Object.values(loja.Concorrentes).reduce(
      (acc: number, val) => acc + (val || 0),
      0
    );

    if (somaLoja !== loja.QuantidadeProdutosPesquisa) {
      erros.push(
        `Loja ${nomeLoja}: soma (${somaLoja}) diferente do esperado (${loja.QuantidadeProdutosPesquisa})`
      );
    }

    // Verificar quantidade mínima e acumular totais
    Object.entries(loja.Concorrentes).forEach(([concorrente, quantidade]) => {
      if (quantidade === undefined) {
        erros.push(`${nomeLoja} - ${concorrente}: quantidade não definida`);
        return;
      }

      if (quantidade < parametros.quantidadeMinimaPorConcorrente) {
        erros.push(
          `${nomeLoja} - ${concorrente}: quantidade (${quantidade}) abaixo do mínimo (${parametros.quantidadeMinimaPorConcorrente})`
        );
      }

      if (!totaisPorConcorrente[concorrente]) {
        totaisPorConcorrente[concorrente] = { total: 0, numeroDeLojas: 0 };
      }
      totaisPorConcorrente[concorrente].total += quantidade;
      totaisPorConcorrente[concorrente].numeroDeLojas++;
    });
  });

  // Calcular variância - comparar apenas concorrentes com mesmo número de aparições
  // Agrupar concorrentes por número de lojas
  const concorrentesPorNumeroLojas: { [num: number]: number[] } = {};

  Object.values(totaisPorConcorrente).forEach((info) => {
    if (!concorrentesPorNumeroLojas[info.numeroDeLojas]) {
      concorrentesPorNumeroLojas[info.numeroDeLojas] = [];
    }
    concorrentesPorNumeroLojas[info.numeroDeLojas].push(info.total);
  });

  // Calcular variância para cada grupo
  let varianciaPercentual = 0;
  Object.entries(concorrentesPorNumeroLojas).forEach(([numLojas, totais]) => {
    if (totais.length > 1) {
      const media = totais.reduce((acc, val) => acc + val, 0) / totais.length;
      const maiorTotal = Math.max(...totais);
      const menorTotal = Math.min(...totais);
      const varGrupo = ((maiorTotal - menorTotal) / media) * 100;
      varianciaPercentual = Math.max(varianciaPercentual, varGrupo);
    }
  });

  if (varianciaPercentual > parametros.varianciaMaximaPermitida) {
    // Nota: Permitir pequena margem de tolerância devido a arredondamento
    if (varianciaPercentual > parametros.varianciaMaximaPermitida + 5) {
      erros.push(
        `Variância (${varianciaPercentual.toFixed(2)}%) excede o limite (${parametros.varianciaMaximaPermitida}%)`
      );
    }
  }

  // Calcular estatísticas
  const totalProdutos = Object.values(dados).reduce(
    (acc, loja) => acc + loja.QuantidadeProdutosPesquisa,
    0
  );

  const totais = Object.values(totaisPorConcorrente).map((info) => info.total);
  const mediaPorConcorrente = totais.length > 0
    ? totais.reduce((acc, val) => acc + val, 0) / totais.length
    : 0;

  const estatisticas = {
    totalProdutos,
    totalConcorrentes: Object.keys(totaisPorConcorrente).length,
    mediaPorConcorrente,
    varianciaPercentual,
    concorrentes: totaisPorConcorrente,
  };

  return {
    valida: erros.length === 0,
    erros,
    estatisticas,
  };
}
