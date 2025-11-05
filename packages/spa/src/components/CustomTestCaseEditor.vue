<template>
  <div class="space-y-6">
      <!-- Informações Básicas -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Nome do Caso de Teste
          </label>
          <input
            v-model="testCase.nome"
            type="text"
            placeholder="Ex: Teste com 5 lojas"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Descrição (opcional)
          </label>
          <input
            v-model="testCase.descricao"
            type="text"
            placeholder="Breve descrição do teste"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <!-- Parâmetros -->
      <div class="bg-blue-50 p-4 rounded-lg">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Parâmetros de Distribuição</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Quantidade Mínima por Concorrente
            </label>
            <input
              v-model.number="testCase.parametros.quantidadeMinimaPorConcorrente"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Variância Máxima Permitida (%)
            </label>
            <input
              v-model.number="testCase.parametros.varianciaMaximaPermitida"
              type="number"
              min="0"
              step="0.1"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <!-- Editor de Lojas -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-gray-700">Lojas e Produtos</h3>
          <button
            @click="adicionarLoja"
            class="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded-md font-medium transition-colors flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Adicionar Loja
          </button>
        </div>

        <div v-if="lojas.length === 0" class="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p class="mt-2 text-sm text-gray-600">Nenhuma loja adicionada ainda</p>
          <p class="text-xs text-gray-500">Clique em "Adicionar Loja" para começar</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="(loja, lojaIndex) in lojas"
            :key="lojaIndex"
            class="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">Nome da Loja</label>
                  <input
                    v-model="loja.nome"
                    type="text"
                    placeholder="Ex: Loja Centro"
                    class="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">Quantidade de Produtos</label>
                  <input
                    v-model.number="loja.quantidadeProdutos"
                    type="number"
                    min="1"
                    class="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <button
                @click="removerLoja(lojaIndex)"
                class="ml-3 p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Remover loja"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <!-- Concorrentes da Loja -->
            <div class="mt-3 pl-4 border-l-2 border-blue-200">
              <div class="flex items-center justify-between mb-2">
                <label class="block text-xs font-medium text-gray-600">Concorrentes</label>
                <button
                  @click="adicionarConcorrente(lojaIndex)"
                  class="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs rounded font-medium transition-colors"
                >
                  + Concorrente
                </button>
              </div>
              
              <div v-if="loja.concorrentes.length === 0" class="text-xs text-gray-500 italic py-2">
                Nenhum concorrente adicionado
              </div>

              <div v-else class="space-y-2">
                <div
                  v-for="(conc, concIndex) in loja.concorrentes"
                  :key="concIndex"
                  class="flex items-center gap-2 bg-gray-50 p-2 rounded"
                >
                  <input
                    v-model="conc.nome"
                    type="text"
                    placeholder="Nome do concorrente"
                    class="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    @click="removerConcorrente(lojaIndex, concIndex)"
                    class="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                    title="Remover concorrente"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Validação e Ações -->
      <div v-if="mensagemErro" class="p-3 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-start gap-2">
          <svg class="w-5 h-5 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <p class="text-sm text-red-800">{{ mensagemErro }}</p>
        </div>
      </div>

      <div class="flex gap-3 justify-end">
        <button
          @click="emit('cancel')"
          class="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium transition-colors"
        >
          Cancelar
        </button>
        <button
          @click="limparFormulario"
          class="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md font-medium transition-colors flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Limpar
        </button>
        <button
          @click="validarEExecutar"
          :disabled="lojas.length === 0"
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-md font-medium transition-colors flex items-center justify-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Criar e Executar
        </button>
      </div>
  </div>
</template>

<script setup lang="ts">
import type { DistribuicaoDados } from '@distribuicao/core';
import { reactive, ref } from 'vue';
import type { ConfiguracaoTeste } from '../types/visualization';

interface LojaEditor {
  nome: string;
  quantidadeProdutos: number;
  concorrentes: { nome: string }[];
}

const emit = defineEmits<{
  executar: [caso: ConfiguracaoTeste];
  cancel: [];
}>();

const testCase = reactive({
  nome: '',
  descricao: '',
  parametros: {
    quantidadeMinimaPorConcorrente: 5,
    varianciaMaximaPermitida: 10
  }
});

const lojas = ref<LojaEditor[]>([]);
const mensagemErro = ref('');

function adicionarLoja() {
  lojas.value.push({
    nome: `Loja ${lojas.value.length + 1}`,
    quantidadeProdutos: 10,
    concorrentes: []
  });
}

function removerLoja(index: number) {
  lojas.value.splice(index, 1);
}

function adicionarConcorrente(lojaIndex: number) {
  const loja = lojas.value[lojaIndex];
  if (!loja) return;
  loja.concorrentes.push({
    nome: `Concorrente ${loja.concorrentes.length + 1}`
  });
}

function removerConcorrente(lojaIndex: number, concIndex: number) {
  const loja = lojas.value[lojaIndex];
  if (!loja) return;
  loja.concorrentes.splice(concIndex, 1);
}

function validarEExecutar() {
  mensagemErro.value = '';

  // Validações
  if (!testCase.nome.trim()) {
    mensagemErro.value = 'Por favor, insira um nome para o caso de teste';
    return;
  }

  if (lojas.value.length === 0) {
    mensagemErro.value = 'Adicione pelo menos uma loja';
    return;
  }

  // Validar lojas
  for (let i = 0; i < lojas.value.length; i++) {
    const loja = lojas.value[i];
    if (!loja) continue;
    
    if (!loja.nome.trim()) {
      mensagemErro.value = `Loja ${i + 1}: Nome é obrigatório`;
      return;
    }
    if (loja.quantidadeProdutos < 1) {
      mensagemErro.value = `Loja ${i + 1}: Quantidade de produtos deve ser maior que zero`;
      return;
    }
    if (loja.concorrentes.length === 0) {
      mensagemErro.value = `Loja ${i + 1}: Adicione pelo menos um concorrente`;
      return;
    }
    // Validar concorrentes
    for (let j = 0; j < loja.concorrentes.length; j++) {
      const conc = loja.concorrentes[j];
      if (!conc || !conc.nome.trim()) {
        mensagemErro.value = `Loja ${i + 1}, Concorrente ${j + 1}: Nome é obrigatório`;
        return;
      }
    }
  }

  // Converter para formato de entrada
  const entrada: DistribuicaoDados = {};
  lojas.value.forEach(loja => {
    const concorrentes: { [key: string]: number } = {};
    loja.concorrentes.forEach(conc => {
      concorrentes[conc.nome.trim()] = 0;
    });

    entrada[loja.nome.trim()] = {
      QuantidadeProdutosPesquisa: loja.quantidadeProdutos,
      Concorrentes: concorrentes
    };
  });

  const caso: ConfiguracaoTeste = {
    nome: testCase.nome.trim(),
    descricao: testCase.descricao?.trim(),
    entrada,
    parametros: { ...testCase.parametros }
  };

  emit('executar', caso);
}

function limparFormulario() {
  testCase.nome = '';
  testCase.descricao = '';
  testCase.parametros.quantidadeMinimaPorConcorrente = 5;
  testCase.parametros.varianciaMaximaPermitida = 10;
  lojas.value = [];
  mensagemErro.value = '';
}
</script>

