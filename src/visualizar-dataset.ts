import { dataset } from './dataset';

console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
console.log('║         DATASET DE CASOS DE TESTE - RESUMO ESTATÍSTICO           ║');
console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

dataset.forEach((caso, index) => {
  const numLojas = Object.keys(caso.entrada).length;
  const concorrentesUnicos = new Set<string>();
  let totalProdutos = 0;
  let maxConcorrentesPorLoja = 0;
  let minConcorrentesPorLoja = Infinity;

  Object.values(caso.entrada).forEach((loja) => {
    totalProdutos += loja.QuantidadeProdutosPesquisa;
    const numConcorrentes = Object.keys(loja.Concorrentes).length;
    maxConcorrentesPorLoja = Math.max(maxConcorrentesPorLoja, numConcorrentes);
    minConcorrentesPorLoja = Math.min(minConcorrentesPorLoja, numConcorrentes);
    Object.keys(loja.Concorrentes).forEach((c) => concorrentesUnicos.add(c));
  });

  console.log(`📊 ${caso.nome}`);
  console.log(`   ${caso.descricao}`);
  console.log(`   ├─ Lojas: ${numLojas}`);
  console.log(`   ├─ Concorrentes únicos: ${concorrentesUnicos.size}`);
  console.log(`   ├─ Concorrentes por loja: ${minConcorrentesPorLoja}-${maxConcorrentesPorLoja}`);
  console.log(`   ├─ Total de produtos: ${totalProdutos}`);
  console.log(`   ├─ Mínimo por concorrente: ${caso.parametros.quantidadeMinimaPorConcorrente}`);
  console.log(`   └─ Variância máxima: ${caso.parametros.varianciaMaximaPermitida}%`);
  console.log('');
});

console.log('═══════════════════════════════════════════════════════════════════');
console.log(`Total de casos de teste: ${dataset.length}`);
console.log('═══════════════════════════════════════════════════════════════════\n');
