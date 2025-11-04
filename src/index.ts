import { distribuirProdutos, validarDistribuicao } from './distribuidor';
import { dataset } from './dataset';

// Executar o primeiro caso de teste
const casoTeste = dataset[0];
console.log('\n=== Executando:', casoTeste.nome, '===\n');

const resultado = distribuirProdutos(casoTeste.entrada, casoTeste.parametros);

console.log('Resultado:');
console.log(JSON.stringify(resultado, null, 2));

const validacao = validarDistribuicao(resultado, casoTeste.parametros);

console.log('\nValidação:');
console.log('Válido:', validacao.valida);
if (!validacao.valida) {
  console.log('Erros:', validacao.erros);
}
if (validacao.estatisticas) {
  console.log('Estatísticas:', validacao.estatisticas);
}
