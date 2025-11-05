import * as XLSX from 'xlsx';
import type { EstadoAlgoritmo } from '../types/visualization';
import type { DistribuicaoDados } from '@distribuicao/core';

export function useExcelExport() {
  function exportarParaExcel(
    historico: EstadoAlgoritmo[],
    casoNome: string,
    varianciaMaxima?: number
  ) {
    if (historico.length === 0) {
      alert('Nenhum dado para exportar');
      return;
    }

    const workbook = XLSX.utils.book_new();
    const estadoFinal = historico[historico.length - 1];

    // Aba 1: Resumo
    const resumoData = criarAbaResumo(historico, casoNome, varianciaMaxima);
    const wsResumo = XLSX.utils.aoa_to_sheet(resumoData);
    XLSX.utils.book_append_sheet(workbook, wsResumo, 'Resumo');

    // Aba 2: Distribuição Detalhada (Lista)
    const distribuicaoDetalhadaData = criarAbaDistribuicaoDetalhada(estadoFinal.distribuicao);
    const wsDistribuicaoDetalhada = XLSX.utils.aoa_to_sheet(distribuicaoDetalhadaData);
    XLSX.utils.book_append_sheet(workbook, wsDistribuicaoDetalhada, 'Distribuição Detalhada');

    // Aba 3: Distribuição por Loja (Tabela Cruzada)
    const distribuicaoData = criarAbaDistribuicao(estadoFinal.distribuicao);
    const wsDistribuicao = XLSX.utils.aoa_to_sheet(distribuicaoData);
    XLSX.utils.book_append_sheet(workbook, wsDistribuicao, 'Visão por Loja');

    // Aba 4: Estatísticas por Concorrente
    const concorrentesData = criarAbaConcorrentes(estadoFinal);
    const wsConcorrentes = XLSX.utils.aoa_to_sheet(concorrentesData);
    XLSX.utils.book_append_sheet(workbook, wsConcorrentes, 'Por Concorrente');

    // Aba 5: Histórico de Execução
    const historicoData = criarAbaHistorico(historico);
    const wsHistorico = XLSX.utils.aoa_to_sheet(historicoData);
    XLSX.utils.book_append_sheet(workbook, wsHistorico, 'Histórico');

    // Aba 6: Transferências (se houver)
    const transferencias = historico
      .filter(e => e.transferencias && e.transferencias.length > 0)
      .flatMap(e => e.transferencias || []);
    
    if (transferencias.length > 0) {
      const transferenciasData = criarAbaTransferencias(transferencias);
      const wsTransferencias = XLSX.utils.aoa_to_sheet(transferenciasData);
      XLSX.utils.book_append_sheet(workbook, wsTransferencias, 'Transferências');
    }

    // Gerar e baixar arquivo
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const fileName = `distribuicao-${casoNome.replace(/[^a-z0-9]/gi, '_')}-${timestamp}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }

  function criarAbaResumo(
    historico: EstadoAlgoritmo[],
    casoNome: string,
    varianciaMaxima?: number
  ): any[][] {
    const estadoFinal = historico[historico.length - 1];
    const totalProdutos = Object.values(estadoFinal.distribuicao).reduce(
      (sum, loja) => sum + loja.QuantidadeProdutosPesquisa,
      0
    );

    return [
      ['RESUMO DA DISTRIBUIÇÃO'],
      [],
      ['Caso de Teste:', casoNome],
      ['Data/Hora:', new Date().toLocaleString('pt-BR')],
      [],
      ['MÉTRICAS GERAIS'],
      ['Total de Lojas:', Object.keys(estadoFinal.distribuicao).length],
      ['Total de Concorrentes:', estadoFinal.concorrentes.length],
      ['Total de Produtos:', totalProdutos],
      ['Variância Final:', estadoFinal.variancia?.toFixed(2) + '%' || 'N/A'],
      ['Variância Máxima Permitida:', varianciaMaxima ? varianciaMaxima.toFixed(2) + '%' : 'N/A'],
      [
        'Status:',
        estadoFinal.variancia && varianciaMaxima && estadoFinal.variancia <= varianciaMaxima
          ? '✓ Dentro do limite'
          : '✗ Acima do limite'
      ],
      [],
      ['ETAPAS DA EXECUÇÃO'],
      ['Total de Etapas:', historico.length],
      ['Estado Inicial:', historico[0]?.descricao || ''],
      ['Estado Final:', estadoFinal.descricao]
    ];
  }

  function criarAbaDistribuicaoDetalhada(distribuicao: DistribuicaoDados): any[][] {
    const data: any[][] = [
      ['DISTRIBUIÇÃO DETALHADA - LOJA POR CONCORRENTE'],
      [],
      ['Loja', 'Concorrente', 'Quantidade Distribuída', 'Total de Produtos da Loja']
    ];

    // Criar uma linha para cada combinação loja-concorrente
    Object.entries(distribuicao).forEach(([nomeLoja, loja]) => {
      Object.entries(loja.Concorrentes).forEach(([nomeConcorrente, quantidade]) => {
        data.push([
          nomeLoja,
          nomeConcorrente,
          quantidade || 0,
          loja.QuantidadeProdutosPesquisa
        ]);
      });
    });

    // Adicionar totais
    data.push([]);
    data.push(['TOTAIS']);
    data.push([]);

    // Total por loja
    data.push(['Total de Produtos por Loja:']);
    Object.entries(distribuicao).forEach(([nomeLoja, loja]) => {
      const totalDistribuido = Object.values(loja.Concorrentes).reduce((sum, qtd) => sum + (qtd || 0), 0);
      data.push([
        nomeLoja,
        '',
        totalDistribuido,
        loja.QuantidadeProdutosPesquisa
      ]);
    });

    data.push([]);
    
    // Total por concorrente
    data.push(['Total Distribuído por Concorrente:']);
    const concorrentes = getConcorrentesUnicos(distribuicao);
    concorrentes.forEach(conc => {
      const total = Object.values(distribuicao).reduce((sum, loja) => 
        sum + (loja.Concorrentes[conc] || 0), 0
      );
      data.push([
        '',
        conc,
        total,
        ''
      ]);
    });

    data.push([]);
    
    // Total geral
    const totalGeral = Object.values(distribuicao).reduce((sum, loja) => 
      sum + Object.values(loja.Concorrentes).reduce((s, qtd) => s + (qtd || 0), 0), 0
    );
    const totalProdutos = Object.values(distribuicao).reduce((sum, loja) => 
      sum + loja.QuantidadeProdutosPesquisa, 0
    );
    
    data.push(['TOTAL GERAL', '', totalGeral, totalProdutos]);

    return data;
  }

  function criarAbaDistribuicao(distribuicao: DistribuicaoDados): any[][] {
    const data: any[][] = [
      ['DISTRIBUIÇÃO POR LOJA'],
      [],
      ['Loja', 'Total de Produtos', ...getConcorrentesUnicos(distribuicao)]
    ];

    Object.entries(distribuicao).forEach(([nomeLoja, loja]) => {
      const concorrentes = getConcorrentesUnicos(distribuicao);
      const row = [
        nomeLoja,
        loja.QuantidadeProdutosPesquisa,
        ...concorrentes.map(conc => loja.Concorrentes[conc] || 0)
      ];
      data.push(row);
    });

    // Totais
    const concorrentes = getConcorrentesUnicos(distribuicao);
    const totais = ['TOTAL', 
      Object.values(distribuicao).reduce((sum, l) => sum + l.QuantidadeProdutosPesquisa, 0),
      ...concorrentes.map(conc => 
        Object.values(distribuicao).reduce((sum, l) => sum + (l.Concorrentes[conc] || 0), 0)
      )
    ];
    data.push([]);
    data.push(totais);

    return data;
  }

  function criarAbaConcorrentes(estado: EstadoAlgoritmo): any[][] {
    const data: any[][] = [
      ['ESTATÍSTICAS POR CONCORRENTE'],
      [],
      ['Concorrente', 'Nº de Lojas', 'Ideal', 'Atual', 'Diferença', '% do Ideal']
    ];

    estado.concorrentes.forEach(conc => {
      const percentual = conc.totalIdeal > 0 
        ? ((conc.totalAtual / conc.totalIdeal) * 100).toFixed(1) + '%'
        : '0%';
      
      data.push([
        conc.nome,
        conc.numeroDeAparicoes,
        Math.round(conc.totalIdeal),
        conc.totalAtual,
        Math.abs(Math.round(conc.falta)),
        percentual
      ]);
    });

    return data;
  }

  function criarAbaHistorico(historico: EstadoAlgoritmo[]): any[][] {
    const data: any[][] = [
      ['HISTÓRICO DE EXECUÇÃO'],
      [],
      ['Etapa', 'Tipo', 'Descrição', 'Variância (%)', 'Total Distribuído', 'Iteração']
    ];

    historico.forEach((estado, index) => {
      const totalDistribuido = estado.concorrentes.reduce((sum, c) => sum + c.totalAtual, 0);
      data.push([
        index + 1,
        getEstadoLabel(estado.tipo),
        estado.descricao,
        estado.variancia?.toFixed(2) || '-',
        totalDistribuido,
        estado.iteracao || '-'
      ]);
    });

    return data;
  }

  function criarAbaTransferencias(transferencias: any[]): any[][] {
    const data: any[][] = [
      ['TRANSFERÊNCIAS REALIZADAS'],
      [],
      ['#', 'Doador', 'Receptor', 'Quantidade', 'Loja']
    ];

    transferencias.forEach((t, index) => {
      data.push([
        index + 1,
        t.doador,
        t.receptor,
        t.quantidade,
        t.loja
      ]);
    });

    return data;
  }

  function getConcorrentesUnicos(distribuicao: DistribuicaoDados): string[] {
    const concorrentes = new Set<string>();
    Object.values(distribuicao).forEach(loja => {
      Object.keys(loja.Concorrentes).forEach(conc => concorrentes.add(conc));
    });
    return Array.from(concorrentes).sort();
  }

  function getEstadoLabel(tipo: string): string {
    const labels: Record<string, string> = {
      INICIAL: 'Inicial',
      CALCULOS_IDEAIS: 'Cálculos Ideais',
      DISTRIBUICAO_LOJA: 'Distribuição',
      AJUSTE_FINO: 'Ajuste Fino',
      BALANCEAMENTO: 'Balanceamento',
      FINAL: 'Finalizado'
    };
    return labels[tipo] || tipo;
  }

  return {
    exportarParaExcel
  };
}

