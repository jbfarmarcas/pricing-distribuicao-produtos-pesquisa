<template>
  <CollapsibleCard v-if="historico.length > 0" :default-expanded="false">
    <template #icon>
      <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </template>
    <template #title>
      <div class="flex items-center justify-between w-full pr-12">
        <span>Log de Execução</span>
        <button
          @click.stop="exportarLog"
          class="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md font-medium transition-colors flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Exportar
        </button>
      </div>
    </template>

    <!-- Resumo da Execução -->
    <div class="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p class="text-xs font-medium text-gray-600">Total de Etapas</p>
          <p class="text-2xl font-bold text-gray-900">{{ historico.length }}</p>
        </div>
        <div>
          <p class="text-xs font-medium text-gray-600">Total Produtos</p>
          <p class="text-2xl font-bold text-gray-900">{{ getTotalProdutos() }}</p>
        </div>
        <div>
          <p class="text-xs font-medium text-gray-600">Concorrentes</p>
          <p class="text-2xl font-bold text-gray-900">{{ getTotalConcorrentes() }}</p>
        </div>
        <div>
          <p class="text-xs font-medium text-gray-600">Variância Final</p>
          <p class="text-2xl font-bold" :class="getVarianciaColor()">
            {{ getVarianciaFinal() }}%
          </p>
        </div>
      </div>
    </div>

    <!-- Timeline de Execução -->
    <div class="relative">
      <!-- Linha vertical conectando os itens -->
      <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

      <div class="space-y-4">
        <div
          v-for="(estado, index) in historico"
          :key="index"
          class="relative pl-12 pb-4 group"
          :class="{ 'opacity-50': indiceAtual !== undefined && index > indiceAtual }"
        >
          <!-- Marcador na timeline -->
          <div
            class="absolute left-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all"
            :class="[
              getBadgeColor(estado.tipo),
              indiceAtual === index ? 'ring-4 ring-blue-200 scale-110' : ''
            ]"
          >
            {{ index + 1 }}
          </div>

          <!-- Conteúdo do log -->
          <div
            class="bg-gray-50 rounded-lg p-4 border-2 transition-all hover:border-blue-300"
            :class="indiceAtual === index ? 'border-blue-500 shadow-md' : 'border-gray-200'"
          >
            <!-- Cabeçalho -->
            <div class="flex items-start justify-between mb-2">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span
                    class="inline-block px-2 py-0.5 rounded text-xs font-semibold"
                    :class="getTypeClass(estado.tipo)"
                  >
                    {{ getEstadoLabel(estado.tipo) }}
                  </span>
                  <span v-if="estado.iteracao" class="text-xs text-gray-500">
                    Iteração #{{ estado.iteracao }}
                  </span>
                  <span v-if="estado.lojaProcessada" class="text-xs font-medium text-purple-600">
                    {{ estado.lojaProcessada }}
                  </span>
                </div>
                <p class="text-sm text-gray-700 font-medium">{{ estado.descricao }}</p>
              </div>
              <button
                v-if="indiceAtual !== index && irPara"
                @click="irPara(index)"
                class="ml-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Ir para
              </button>
            </div>

            <!-- Métricas Resumidas -->
            <div class="mt-3 grid grid-cols-4 gap-3 text-xs">
              <div>
                <span class="text-gray-500">Concorrentes:</span>
                <span class="ml-1 font-semibold text-gray-800">{{ estado.concorrentes.length }}</span>
              </div>
              <div v-if="estado.variancia !== undefined">
                <span class="text-gray-500">Variância:</span>
                <span class="ml-1 font-semibold" :class="getVarianciaTextColor(estado.variancia)">
                  {{ estado.variancia.toFixed(2) }}%
                </span>
              </div>
              <div>
                <span class="text-gray-500">Distribuídos:</span>
                <span class="ml-1 font-semibold text-gray-800">
                  {{ calcularTotalDistribuido(estado) }}
                </span>
              </div>
              <div v-if="estado.iteracao">
                <span class="text-gray-500">Iteração:</span>
                <span class="ml-1 font-semibold text-orange-600">#{{ estado.iteracao }}</span>
              </div>
            </div>

            <!-- Botão Ver Detalhes -->
            <button
              @click="toggleDetalhes(index)"
              class="mt-3 text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              <svg
                class="w-3 h-3 transition-transform"
                :class="{ 'rotate-90': detalhesExpandidos[index] }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              {{ detalhesExpandidos[index] ? 'Ocultar' : 'Ver' }} Detalhes
            </button>

            <!-- Detalhes Expandidos -->
            <div v-if="detalhesExpandidos[index]" class="mt-3 pt-3 border-t border-gray-300 space-y-3">
              <!-- Distribuição por Concorrente -->
              <div>
                <p class="text-xs font-semibold text-gray-700 mb-2">Distribuição por Concorrente:</p>
                <div class="grid grid-cols-2 gap-2">
                  <div
                    v-for="conc in estado.concorrentes"
                    :key="conc.nome"
                    class="text-xs bg-white border border-gray-200 rounded px-2 py-1.5"
                  >
                    <div class="flex justify-between items-center mb-1">
                      <span class="font-medium text-gray-900">{{ conc.nome }}</span>
                      <span class="text-gray-500">({{ conc.numeroDeAparicoes }} loja{{ conc.numeroDeAparicoes > 1 ? 's' : '' }})</span>
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-gray-600">Atual: <strong>{{ conc.totalAtual }}</strong></span>
                      <span class="text-gray-600">Ideal: <strong>{{ conc.totalIdeal.toFixed(1) }}</strong></span>
                      <span :class="conc.falta > 0 ? 'text-orange-600' : 'text-green-600'">
                        {{ conc.falta > 0 ? 'Falta' : 'OK' }}: <strong>{{ Math.abs(conc.falta).toFixed(1) }}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Transferências Completas (se houver) -->
              <div v-if="estado.transferencias && estado.transferencias.length > 0">
                <p class="text-xs font-semibold text-gray-700 mb-2">
                  Transferências Realizadas ({{ estado.transferencias.length }}):
                </p>
                <div class="space-y-1 max-h-40 overflow-y-auto">
                  <div
                    v-for="(t, tIndex) in estado.transferencias"
                    :key="tIndex"
                    class="text-xs bg-yellow-50 border border-yellow-200 rounded px-2 py-1"
                  >
                    <span class="font-medium text-gray-900">{{ t.doador }}</span>
                    <span class="text-gray-600 mx-1">→</span>
                    <span class="font-medium text-gray-900">{{ t.receptor }}</span>
                    <span class="text-gray-500 mx-1">|</span>
                    <span class="text-gray-700">{{ t.quantidade }} produto{{ t.quantidade > 1 ? 's' : '' }}</span>
                    <span class="text-gray-400 mx-1">@</span>
                    <span class="text-gray-600">{{ t.loja }}</span>
                  </div>
                </div>
              </div>

              <!-- Distribuição por Loja -->
              <div>
                <p class="text-xs font-semibold text-gray-700 mb-2">Distribuição por Loja:</p>
                <div class="space-y-2 max-h-60 overflow-y-auto">
                  <div
                    v-for="(loja, nomeLoja) in estado.distribuicao"
                    :key="nomeLoja"
                    class="text-xs bg-white border border-gray-200 rounded px-2 py-1.5"
                  >
                    <div class="flex justify-between items-center mb-1">
                      <span class="font-medium text-gray-900">{{ nomeLoja }}</span>
                      <span class="text-gray-600">
                        Total: <strong>{{ Object.values(loja.Concorrentes).reduce((a: number, b) => a + (b || 0), 0) }}</strong>
                        / {{ loja.QuantidadeProdutosPesquisa }}
                      </span>
                    </div>
                    <div class="flex flex-wrap gap-1 mt-1">
                      <span
                        v-for="(qtd, nomeConcorrente) in loja.Concorrentes"
                        :key="nomeConcorrente"
                        class="inline-block px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded"
                      >
                        {{ nomeConcorrente }}: {{ qtd || 0 }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Métricas Estatísticas -->
              <div>
                <p class="text-xs font-semibold text-gray-700 mb-2">Métricas Estatísticas:</p>
                <div class="grid grid-cols-2 gap-2 text-xs">
                  <div class="bg-white border border-gray-200 rounded px-2 py-1">
                    <span class="text-gray-600">Total de Lojas:</span>
                    <span class="ml-1 font-semibold text-gray-900">{{ Object.keys(estado.distribuicao).length }}</span>
                  </div>
                  <div class="bg-white border border-gray-200 rounded px-2 py-1">
                    <span class="text-gray-600">Média por Concorrente:</span>
                    <span class="ml-1 font-semibold text-gray-900">
                      {{ (calcularTotalDistribuido(estado) / estado.concorrentes.length).toFixed(1) }}
                    </span>
                  </div>
                  <div class="bg-white border border-gray-200 rounded px-2 py-1">
                    <span class="text-gray-600">Maior Alocação:</span>
                    <span class="ml-1 font-semibold text-gray-900">
                      {{ Math.max(...estado.concorrentes.map(c => c.totalAtual)) }}
                    </span>
                  </div>
                  <div class="bg-white border border-gray-200 rounded px-2 py-1">
                    <span class="text-gray-600">Menor Alocação:</span>
                    <span class="ml-1 font-semibold text-gray-900">
                      {{ Math.min(...estado.concorrentes.map(c => c.totalAtual)) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Timestamp (simulado) -->
            <div class="mt-3 flex items-center justify-between text-xs text-gray-400">
              <span>Etapa {{ index + 1 }} de {{ historico.length }}</span>
              <span v-if="indiceAtual === index" class="text-blue-600 font-medium">● Atual</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </CollapsibleCard>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { EstadoAlgoritmo, EstadoExecucao } from '../types/visualization';
import CollapsibleCard from './CollapsibleCard.vue';

const props = defineProps<{
  historico: EstadoAlgoritmo[];
  indiceAtual?: number;
  varianciaMaxima?: number;
  irPara?: (index: number) => void;
}>();

const detalhesExpandidos = ref<{ [index: number]: boolean }>({});

function toggleDetalhes(index: number) {
  detalhesExpandidos.value[index] = !detalhesExpandidos.value[index];
}

function getBadgeColor(tipo: EstadoExecucao): string {
  const colors: Record<string, string> = {
    INICIAL: 'bg-gray-500',
    CALCULOS_IDEAIS: 'bg-blue-500',
    DISTRIBUICAO_LOJA: 'bg-purple-500',
    AJUSTE_FINO: 'bg-yellow-500',
    BALANCEAMENTO: 'bg-orange-500',
    FINAL: 'bg-green-500'
  };
  return colors[tipo] || 'bg-gray-500';
}

function getTypeClass(tipo: EstadoExecucao): string {
  const classes: Record<string, string> = {
    INICIAL: 'bg-gray-100 text-gray-800',
    CALCULOS_IDEAIS: 'bg-blue-100 text-blue-800',
    DISTRIBUICAO_LOJA: 'bg-purple-100 text-purple-800',
    AJUSTE_FINO: 'bg-yellow-100 text-yellow-800',
    BALANCEAMENTO: 'bg-orange-100 text-orange-800',
    FINAL: 'bg-green-100 text-green-800'
  };
  return classes[tipo] || 'bg-gray-100 text-gray-800';
}

function getEstadoLabel(tipo: EstadoExecucao): string {
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

function getTotalProdutos(): number {
  if (props.historico.length === 0) return 0;
  const ultimoEstado = props.historico[props.historico.length - 1];
  if (!ultimoEstado) return 0;
  return Object.values(ultimoEstado.distribuicao).reduce(
    (sum, loja) => sum + loja.QuantidadeProdutosPesquisa,
    0
  );
}

function getTotalConcorrentes(): number {
  if (props.historico.length === 0) return 0;
  const ultimoEstado = props.historico[props.historico.length - 1];
  if (!ultimoEstado) return 0;
  return ultimoEstado.concorrentes.length;
}

function getVarianciaFinal(): string {
  if (props.historico.length === 0) return '0.00';
  const ultimoEstado = props.historico[props.historico.length - 1];
  if (!ultimoEstado) return '0.00';
  return ultimoEstado.variancia?.toFixed(2) || '0.00';
}

function getVarianciaColor(): string {
  const variancia = parseFloat(getVarianciaFinal());
  if (!props.varianciaMaxima) return 'text-gray-900';

  if (variancia <= props.varianciaMaxima) {
    return 'text-green-600';
  } else if (variancia <= props.varianciaMaxima * 1.2) {
    return 'text-yellow-600';
  } else {
    return 'text-red-600';
  }
}

function getVarianciaTextColor(variancia: number): string {
  if (!props.varianciaMaxima) return 'text-gray-800';

  if (variancia <= props.varianciaMaxima) {
    return 'text-green-600';
  } else if (variancia <= props.varianciaMaxima * 1.2) {
    return 'text-yellow-600';
  } else {
    return 'text-red-600';
  }
}

function calcularTotalDistribuido(estado: EstadoAlgoritmo): number {
  return estado.concorrentes.reduce((sum, c) => sum + c.totalAtual, 0);
}

function exportarLog(): void {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const logContent = gerarLogTexto();

  const blob = new Blob([logContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `log-distribuicao-${timestamp}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function gerarLogTexto(): string {
  const lines: string[] = [];

  lines.push('='.repeat(80));
  lines.push('LOG DE EXECUÇÃO - ALGORITMO DE DISTRIBUIÇÃO DE PRODUTOS');
  lines.push('='.repeat(80));
  lines.push('');
  lines.push(`Data/Hora: ${new Date().toLocaleString('pt-BR')}`);
  lines.push(`Total de Etapas: ${props.historico.length}`);
  lines.push(`Total de Produtos: ${getTotalProdutos()}`);
  lines.push(`Total de Concorrentes: ${getTotalConcorrentes()}`);
  lines.push(`Variância Final: ${getVarianciaFinal()}%`);
  if (props.varianciaMaxima) {
    lines.push(`Variância Máxima Permitida: ${props.varianciaMaxima}%`);
  }
  lines.push('');
  lines.push('='.repeat(80));
  lines.push('HISTÓRICO DE EXECUÇÃO');
  lines.push('='.repeat(80));
  lines.push('');

  props.historico.forEach((estado, index) => {
    lines.push(`[${index + 1}/${props.historico.length}] ${getEstadoLabel(estado.tipo).toUpperCase()}`);
    lines.push(`Descrição: ${estado.descricao}`);
    lines.push(`Concorrentes: ${estado.concorrentes.length}`);
    if (estado.variancia !== undefined) {
      lines.push(`Variância: ${estado.variancia.toFixed(2)}%`);
    }
    lines.push(`Total Distribuído: ${calcularTotalDistribuido(estado)}`);

    if (estado.transferencias && estado.transferencias.length > 0) {
      lines.push(`Transferências (${estado.transferencias.length}):`);
      estado.transferencias.forEach(t => {
        lines.push(`  - ${t.doador} → ${t.receptor}: ${t.quantidade} produtos @ ${t.loja}`);
      });
    }

    lines.push('-'.repeat(80));
    lines.push('');
  });

  lines.push('='.repeat(80));
  lines.push('FIM DO LOG');
  lines.push('='.repeat(80));

  return lines.join('\n');
}
</script>
