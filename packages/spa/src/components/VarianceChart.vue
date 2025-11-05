<template>
  <CollapsibleCard :default-expanded="true">
    <template #title>
      Evolução da Variância
    </template>
    <Line v-if="chartData" :data="chartData" :options="chartOptions" />
    <div v-else class="text-center text-gray-500 py-8">
      Execute o algoritmo para ver a evolução da variância
    </div>
  </CollapsibleCard>
</template>

<script setup lang="ts">
import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from 'chart.js';
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import type { EstadoAlgoritmo } from '../types/visualization';
import CollapsibleCard from './CollapsibleCard.vue';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const props = defineProps<{
  historico: EstadoAlgoritmo[];
  varianciaMaxima: number;
  indiceAtual?: number;
}>();

const chartData = computed(() => {
  if (!props.historico || props.historico.length === 0) {
    return null;
  }

  // Pegar apenas estados que têm variância calculada
  const estadosComVariancia = props.historico
    .map((estado, index) => ({ estado, index }))
    .filter(({ estado }) => estado.variancia !== undefined);

  if (estadosComVariancia.length === 0) {
    return null;
  }

  const labels = estadosComVariancia.map(({ index }) => `Etapa ${index + 1}`);
  const variancias = estadosComVariancia.map(({ estado }) => estado.variancia ?? 0);

  // Criar array com a linha de variância máxima
  const varMax = Array(labels.length).fill(props.varianciaMaxima);

  return {
    labels,
    datasets: [
      {
        label: 'Variância (%)',
        data: variancias,
        borderColor: 'rgb(59, 130, 246)', // blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: variancias.map((_, i) =>
          props.indiceAtual !== undefined && estadosComVariancia[i]?.index === props.indiceAtual
            ? 'rgb(239, 68, 68)' // red-500 para ponto atual
            : 'rgb(59, 130, 246)' // blue-500
        ),
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      },
      {
        label: 'Variância Máxima Permitida',
        data: varMax,
        borderColor: 'rgb(239, 68, 68)', // red-500
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false
      }
    ]
  };
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 2.5,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const label = context.dataset.label || '';
          const value = context.parsed.y;
          return `${label}: ${value?.toFixed(2)}%`;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Variância (%)'
      },
      ticks: {
        callback: (value: any) => `${value}%`
      }
    },
    x: {
      title: {
        display: true,
        text: 'Etapas do Algoritmo'
      }
    }
  }
}));
</script>
