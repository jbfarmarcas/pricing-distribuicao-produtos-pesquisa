<script setup lang="ts">
import { ref } from 'vue';
import AvisosPanel from './components/AvisosPanel.vue';
import CollapsibleCard from './components/CollapsibleCard.vue';
import DatasetSelector from './components/DatasetSelector.vue';
import DistributionBars from './components/DistributionBars.vue';
import ExecutionLog from './components/ExecutionLog.vue';
import StatisticsPanel from './components/StatisticsPanel.vue';
import VarianceChart from './components/VarianceChart.vue';
import { useDistributionSteps } from './composables/useDistributionSteps';
import type { ConfiguracaoTeste } from './types/visualization';

const {
  historico,
  estadoAtual,
  indiceAtual,
  progresso,
  temProximo,
  temAnterior,
  avisos,
  executar,
  proximo,
  anterior,
  primeiro,
  ultimo,
  irPara
} = useDistributionSteps();

const casoSelecionado = ref<ConfiguracaoTeste | null>(null);
const modoAutomatico = ref(false);
const velocidadeMs = ref(1000);
let intervaloAutomatico: number | null = null;

async function handleSelecionar(caso: ConfiguracaoTeste) {
  pararModoAutomatico();
  casoSelecionado.value = caso;
  await executar(caso.entrada, caso.parametros);
}

function iniciarModoAutomatico() {
  if (!historico.value.length) return;

  modoAutomatico.value = true;
  primeiro();

  intervaloAutomatico = window.setInterval(() => {
    if (temProximo.value) {
      proximo();
    } else {
      pararModoAutomatico();
    }
  }, velocidadeMs.value);
}

function pararModoAutomatico() {
  modoAutomatico.value = false;
  if (intervaloAutomatico !== null) {
    clearInterval(intervaloAutomatico);
    intervaloAutomatico = null;
  }
}

function handleProximo() {
  pararModoAutomatico();
  proximo();
}

function handleAnterior() {
  pararModoAutomatico();
  anterior();
}

function handlePrimeiro() {
  pararModoAutomatico();
  primeiro();
}

function handleUltimo() {
  pararModoAutomatico();
  ultimo();
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 class="text-3xl font-bold text-gray-900">
          Sistema de Distribuição de Produtos
        </h1>
        <p class="mt-2 text-sm text-gray-600">
          Visualização interativa do algoritmo de distribuição e balanceamento
        </p>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-6">
          <DatasetSelector @selecionar="handleSelecionar" />

          <!-- Controles -->
          <CollapsibleCard v-if="historico.length > 0" :default-expanded="true">
            <template #title>
              Controles
            </template>

            <!-- Progresso -->
            <div class="mb-4">
              <div class="flex justify-between text-sm text-gray-600 mb-2">
                <span>Etapa {{ progresso.atual }} de {{ progresso.total }}</span>
                <span>{{ progresso.percentual }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  :style="{ width: progresso.percentual + '%' }"
                ></div>
              </div>
            </div>

            <!-- Botões de Navegação -->
            <div class="grid grid-cols-2 gap-2 mb-4">
              <button
                @click="handlePrimeiro"
                :disabled="!temAnterior || modoAutomatico"
                class="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 rounded-md text-sm font-medium transition-colors"
              >
                ⏮ Primeiro
              </button>
              <button
                @click="handleAnterior"
                :disabled="!temAnterior || modoAutomatico"
                class="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 rounded-md text-sm font-medium transition-colors"
              >
                ◀ Anterior
              </button>
              <button
                @click="handleProximo"
                :disabled="!temProximo || modoAutomatico"
                class="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 rounded-md text-sm font-medium transition-colors"
              >
                Próximo ▶
              </button>
              <button
                @click="handleUltimo"
                :disabled="!temProximo || modoAutomatico"
                class="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 rounded-md text-sm font-medium transition-colors"
              >
                Último ⏭
              </button>
            </div>

            <!-- Modo Automático -->
            <div class="border-t border-gray-200 pt-4">
              <div class="flex items-center justify-between mb-3">
                <label class="text-sm font-medium text-gray-700">Velocidade</label>
                <span class="text-sm text-gray-600">{{ velocidadeMs }}ms</span>
              </div>
              <input
                v-model.number="velocidadeMs"
                type="range"
                min="300"
                max="3000"
                step="100"
                :disabled="modoAutomatico"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <button
                v-if="!modoAutomatico"
                @click="iniciarModoAutomatico"
                class="mt-3 w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium transition-colors"
              >
                ▶ Reproduzir Automático
              </button>
              <button
                v-else
                @click="pararModoAutomatico"
                class="mt-3 w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium transition-colors"
              >
                ⏸ Pausar
              </button>
            </div>
          </CollapsibleCard>
        </div>

        <!-- Content Area -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Avisos Panel -->
          <AvisosPanel :avisos="avisos" />

          <!-- Statistics Panel -->
          <StatisticsPanel
            :estado="estadoAtual"
            :variancia-maxima="casoSelecionado?.parametros.varianciaMaximaPermitida"
          />

          <!-- Charts -->
          <div v-if="estadoAtual" class="space-y-6">
            <DistributionBars :concorrentes="estadoAtual.concorrentes" />
            <VarianceChart
              :historico="historico"
              :variancia-maxima="casoSelecionado?.parametros.varianciaMaximaPermitida || 0"
              :indice-atual="indiceAtual"
            />

            <!-- Execution Log -->
            <ExecutionLog
              :historico="historico"
              :indice-atual="indiceAtual"
              :variancia-maxima="casoSelecionado?.parametros.varianciaMaximaPermitida"
              :ir-para="irPara"
            />
          </div>

          <!-- Empty State -->
          <div
            v-else
            class="bg-white rounded-lg shadow-md p-12 text-center"
          >
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum caso selecionado</h3>
            <p class="mt-1 text-sm text-gray-500">
              Selecione um caso de teste na barra lateral para começar
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
