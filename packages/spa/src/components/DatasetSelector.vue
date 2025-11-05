<template>
  <CollapsibleCard :default-expanded="true">
    <template #title>
      Casos de Teste Pré-definidos
    </template>

    <div class="space-y-2 max-h-[600px] overflow-y-auto pr-2">
      <div
        v-for="(caso, index) in casos"
        :key="index"
        @click="selecionarCaso(caso, index)"
        class="p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-500 hover:shadow-md"
        :class="casoSelecionadoIndex === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200'"
      >
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="font-semibold text-gray-800">{{ caso.nome }}</h3>
            <p v-if="caso.descricao" class="text-sm text-gray-600 mt-1">{{ caso.descricao }}</p>
          </div>
          <div class="ml-4 text-right">
            <span class="inline-block px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700">
              Caso {{ index + 1 }}
            </span>
          </div>
        </div>

        <div class="mt-3 grid grid-cols-3 gap-3 text-sm">
          <div>
            <span class="text-gray-500">Lojas:</span>
            <span class="ml-1 font-medium text-gray-700">{{ Object.keys(caso.entrada).length }}</span>
          </div>
          <div>
            <span class="text-gray-500">Concorrentes:</span>
            <span class="ml-1 font-medium text-gray-700">{{ contarConcorrentes(caso.entrada) }}</span>
          </div>
          <div>
            <span class="text-gray-500">Produtos:</span>
            <span class="ml-1 font-medium text-gray-700">{{ contarProdutos(caso.entrada) }}</span>
          </div>
        </div>

        <div class="mt-2 flex gap-3 text-xs">
          <span class="text-gray-500">
            Mín: <span class="font-medium text-gray-700">{{ caso.parametros.quantidadeMinimaPorConcorrente }}</span>
          </span>
          <span class="text-gray-500">
            Variância máx: <span class="font-medium text-gray-700">{{ caso.parametros.varianciaMaximaPermitida }}%</span>
          </span>
        </div>
      </div>
    </div>
  </CollapsibleCard>
</template>

<script setup lang="ts">
import type { DistribuicaoDados } from '@distribuicao/core';
import { casosDeTeste } from '@distribuicao/core';
import { ref } from 'vue';
import type { ConfiguracaoTeste } from '../types/visualization';
import CollapsibleCard from './CollapsibleCard.vue';

// Transformar os casos de teste para o formato esperado
const casos = ref<ConfiguracaoTeste[]>(
  casosDeTeste.map((caso: any) => ({
    nome: caso.nome,
    descricao: caso.descricao,
    entrada: caso.entrada,
    parametros: caso.parametros
  }))
);

const casoSelecionadoIndex = ref<number | null>(null);

const emit = defineEmits<{
  selecionar: [caso: ConfiguracaoTeste]
}>();

function selecionarCaso(caso: ConfiguracaoTeste, index: number) {
  casoSelecionadoIndex.value = index;
  emit('selecionar', caso);
}

function contarConcorrentes(entrada: DistribuicaoDados): number {
  const concorrentes = new Set<string>();
  for (const loja of Object.values(entrada)) {
    for (const concorrente of Object.keys(loja.Concorrentes)) {
      concorrentes.add(concorrente);
    }
  }
  return concorrentes.size;
}

function contarProdutos(entrada: DistribuicaoDados): number {
  return Object.values(entrada).reduce(
    (sum, loja) => sum + loja.QuantidadeProdutosPesquisa,
    0
  );
}
</script>
