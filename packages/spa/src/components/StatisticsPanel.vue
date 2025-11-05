<template>
  <CollapsibleCard :default-expanded="true">
    <template #title>
      Estatísticas da Distribuição
    </template>

    <div v-if="estado" class="space-y-4">
      <!-- Status Badge -->
      <div class="flex items-center gap-2">
        <span class="px-3 py-1 rounded-full text-sm font-medium"
          :class="getBadgeClass(estado.tipo)">
          {{ getEstadoLabel(estado.tipo) }}
        </span>
        <span v-if="estado.iteracao" class="text-sm text-gray-600">
          Iteração {{ estado.iteracao }}
        </span>
      </div>

      <!-- Descrição -->
      <div class="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
        <p class="text-sm text-gray-700">{{ estado.descricao }}</p>
      </div>

      <!-- Métricas Principais -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-3 bg-gray-50 rounded-lg">
          <Tooltip text="Quantidade total de lojas que receberão produtos da pesquisa">
            <div class="text-xs text-gray-500 uppercase tracking-wide">Total Lojas</div>
          </Tooltip>
          <div class="text-2xl font-bold text-gray-800 mt-1">
            {{ Object.keys(estado.distribuicao).length }}
          </div>
        </div>

        <div class="p-3 bg-gray-50 rounded-lg">
          <Tooltip text="Número de concorrentes que terão produtos distribuídos">
            <div class="text-xs text-gray-500 uppercase tracking-wide">Concorrentes</div>
          </Tooltip>
          <div class="text-2xl font-bold text-gray-800 mt-1">
            {{ estado.concorrentes.length }}
          </div>
        </div>

        <div class="p-3 bg-gray-50 rounded-lg">
          <Tooltip text="Soma total de todos os produtos a serem distribuídos entre as lojas">
            <div class="text-xs text-gray-500 uppercase tracking-wide">Total Produtos</div>
          </Tooltip>
          <div class="text-2xl font-bold text-gray-800 mt-1">
            {{ calcularTotalProdutos() }}
          </div>
        </div>

        <div class="p-3 rounded-lg"
          :class="estado.variancia !== undefined ? getVarianciaClass() : 'bg-gray-50'">
          <Tooltip text="Medida de desequilíbrio entre concorrentes. Quanto menor, mais equilibrada a distribuição">
            <div class="text-xs uppercase tracking-wide"
              :class="estado.variancia !== undefined ? 'text-gray-700' : 'text-gray-500'">
              Variância
            </div>
          </Tooltip>
          <div class="text-2xl font-bold mt-1"
            :class="estado.variancia !== undefined ? 'text-gray-900' : 'text-gray-800'">
            {{ estado.variancia !== undefined ? estado.variancia.toFixed(2) + '%' : 'N/A' }}
          </div>
        </div>
      </div>

      <!-- Tabela de Concorrentes -->
      <div class="mt-6">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Detalhes por Concorrente</h3>
        <div class="overflow-x-auto overflow-y-visible">
          <table class="min-w-full divide-y divide-gray-200 text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Concorrente
                </th>
                <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Tooltip text="Número de lojas onde este concorrente aparece" :show-icon="false" position="bottom">
                    <span class="cursor-help border-b border-dashed border-gray-400">Lojas</span>
                  </Tooltip>
                </th>
                <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Tooltip text="Quantidade ideal calculada para este concorrente receber" :show-icon="false" position="bottom">
                    <span class="cursor-help border-b border-dashed border-gray-400">Ideal</span>
                  </Tooltip>
                </th>
                <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Tooltip text="Quantidade que este concorrente já recebeu na distribuição" :show-icon="false" position="bottom">
                    <span class="cursor-help border-b border-dashed border-gray-400">Atual</span>
                  </Tooltip>
                </th>
                <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Tooltip text="Diferença entre ideal e atual. Verde: próximo/completo, Amarelo: moderado, Vermelho: significativo" :show-icon="false" position="bottom">
                    <span class="cursor-help border-b border-dashed border-gray-400">Diferença</span>
                  </Tooltip>
                </th>
                <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Tooltip text="Percentual do ideal já distribuído para este concorrente" :show-icon="false" position="bottom">
                    <span class="cursor-help border-b border-dashed border-gray-400">% Ideal</span>
                  </Tooltip>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="concorrente in estado.concorrentes" :key="concorrente.nome"
                class="hover:bg-gray-50">
                <td class="px-4 py-2 font-medium text-gray-900">
                  {{ concorrente.nome }}
                </td>
                <td class="px-4 py-2 text-right text-gray-600">
                  {{ concorrente.numeroDeAparicoes }}
                </td>
                <td class="px-4 py-2 text-right text-gray-600">
                  {{ Math.round(concorrente.totalIdeal) }}
                </td>
                <td class="px-4 py-2 text-right font-medium"
                  :class="concorrente.totalAtual > 0 ? 'text-green-600' : 'text-gray-400'">
                  {{ concorrente.totalAtual }}
                </td>
                <td class="px-4 py-2 text-right font-medium"
                  :class="getDiferencaClass(concorrente)">
                  {{ Math.abs(Math.round(concorrente.falta)) }}
                </td>
                <td class="px-4 py-2 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <div class="w-20 bg-gray-200 rounded-full h-2">
                      <div class="bg-blue-500 h-2 rounded-full"
                        :style="{ width: getProgresso(concorrente) + '%' }">
                      </div>
                    </div>
                    <span class="text-xs text-gray-600 w-10 text-right">
                      {{ getProgresso(concorrente) }}%
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Transferências (se houver) -->
      <div v-if="estado.transferencias && estado.transferencias.length > 0" class="mt-6">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Transferências Realizadas</h3>
        <div class="space-y-2">
          <div v-for="(t, i) in estado.transferencias" :key="i"
            class="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400 text-sm">
            <span class="font-medium text-gray-900">{{ t.doador }}</span>
            <span class="text-gray-600 mx-2">→</span>
            <span class="font-medium text-gray-900">{{ t.receptor }}</span>
            <span class="text-gray-600 mx-2">|</span>
            <span class="text-gray-700">{{ t.quantidade }} produtos</span>
            <span class="text-gray-500 mx-2">em</span>
            <span class="text-gray-700">{{ t.loja }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 py-8">
      Selecione um caso de teste e execute para ver as estatísticas
    </div>
  </CollapsibleCard>
</template>

<script setup lang="ts">
import type { InfoConcorrente } from '@distribuicao/core';
import type { EstadoAlgoritmo, EstadoExecucao } from '../types/visualization';
import CollapsibleCard from './CollapsibleCard.vue';
import Tooltip from './Tooltip.vue';

const props = defineProps<{
  estado?: EstadoAlgoritmo | null;
  varianciaMaxima?: number;
}>();

function getBadgeClass(tipo: EstadoExecucao): string {
  const classes: Record<string, string> = {
    INICIAL: 'bg-gray-200 text-gray-800',
    CALCULOS_IDEAIS: 'bg-blue-200 text-blue-800',
    DISTRIBUICAO_LOJA: 'bg-purple-200 text-purple-800',
    AJUSTE_FINO: 'bg-yellow-200 text-yellow-800',
    BALANCEAMENTO: 'bg-orange-200 text-orange-800',
    FINAL: 'bg-green-200 text-green-800'
  };
  return classes[tipo] || 'bg-gray-200 text-gray-800';
}

function getEstadoLabel(tipo: EstadoExecucao): string {
  const labels: Record<string, string> = {
    INICIAL: 'Inicial',
    CALCULOS_IDEAIS: 'Cálculos Ideais',
    DISTRIBUICAO_LOJA: 'Distribuição por Loja',
    AJUSTE_FINO: 'Ajuste Fino',
    BALANCEAMENTO: 'Balanceamento',
    FINAL: 'Finalizado'
  };
  return labels[tipo] || tipo;
}

function getVarianciaClass(): string {
  if (!props.estado?.variancia || !props.varianciaMaxima) {
    return 'bg-gray-50';
  }

  if (props.estado.variancia <= props.varianciaMaxima) {
    return 'bg-green-100';
  } else if (props.estado.variancia <= props.varianciaMaxima * 1.2) {
    return 'bg-yellow-100';
  } else {
    return 'bg-red-100';
  }
}

function calcularTotalProdutos(): number {
  if (!props.estado) return 0;
  return Object.values(props.estado.distribuicao).reduce(
    (sum, loja) => sum + loja.QuantidadeProdutosPesquisa,
    0
  );
}

function getProgresso(concorrente: InfoConcorrente): number {
  if (concorrente.totalIdeal === 0) return 100;
  return Math.min(100, Math.round((concorrente.totalAtual / concorrente.totalIdeal) * 100));
}

function getDiferencaClass(concorrente: InfoConcorrente): string {
  const diferenca = concorrente.falta;
  const percentualFalta = concorrente.totalIdeal > 0 
    ? (diferenca / concorrente.totalIdeal) * 100 
    : 0;

  // Já atingiu ou ultrapassou o ideal
  if (diferenca <= 0) {
    return 'text-green-600';
  }
  
  // Falta menos de 10% do ideal - próximo de concluir
  if (percentualFalta < 10) {
    return 'text-green-600';
  }
  
  // Falta entre 10% e 30% - atenção moderada
  if (percentualFalta < 30) {
    return 'text-yellow-600';
  }
  
  // Falta mais de 30% - necessita atenção
  return 'text-red-600';
}
</script>
