<template>
  <CollapsibleCard :default-expanded="true">
    <template #title>
      Distribuição por Concorrente
    </template>
    <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
  </CollapsibleCard>
</template>

<script setup lang="ts">
import type { InfoConcorrente } from '@distribuicao/core';
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip
} from 'chart.js';
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import CollapsibleCard from './CollapsibleCard.vue';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const props = defineProps<{
  concorrentes: InfoConcorrente[];
}>();

const chartData = computed(() => {
  if (!props.concorrentes || props.concorrentes.length === 0) {
    return null;
  }

  const labels = props.concorrentes.map(c => c.nome);
  const ideal = props.concorrentes.map(c => Math.round(c.totalIdeal));
  const atual = props.concorrentes.map(c => c.totalAtual);

  return {
    labels,
    datasets: [
      {
        label: 'Ideal',
        data: ideal,
        backgroundColor: 'rgba(59, 130, 246, 0.7)', // blue-500
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      },
      {
        label: 'Atual',
        data: atual,
        backgroundColor: 'rgba(34, 197, 94, 0.7)', // green-500
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1
      }
    ]
  };
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 2,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false
    },
    tooltip: {
      callbacks: {
        afterLabel: (context: any) => {
          const index = context.dataIndex;
          const concorrente = props.concorrentes[index];
          if (!concorrente) return [];
          return [
            `Aparições: ${concorrente.numeroDeAparicoes} lojas`,
            `Falta: ${Math.round(concorrente.falta)} produtos`
          ];
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Quantidade de Produtos'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Concorrentes'
      }
    }
  }
}));
</script>
