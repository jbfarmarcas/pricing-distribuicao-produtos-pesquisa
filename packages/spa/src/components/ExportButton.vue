<template>
  <button
    @click="exportar"
    :disabled="!habilitado"
    class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-md font-medium transition-colors flex items-center gap-2"
    title="Exportar resultados para Excel"
  >
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
    Exportar Excel
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useExcelExport } from '../composables/useExcelExport';
import type { EstadoAlgoritmo } from '../types/visualization';

const props = defineProps<{
  historico: EstadoAlgoritmo[];
  casoNome?: string;
  varianciaMaxima?: number;
}>();

const { exportarParaExcel } = useExcelExport();

const habilitado = computed(() => props.historico.length > 0);

function exportar() {
  if (!habilitado.value) return;
  
  const nome = props.casoNome || 'Caso de Teste';
  exportarParaExcel(props.historico, nome, props.varianciaMaxima);
}
</script>

