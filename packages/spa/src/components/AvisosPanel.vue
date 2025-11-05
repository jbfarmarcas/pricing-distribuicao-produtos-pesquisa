<template>
  <CollapsibleCard v-if="avisos && avisos.length > 0" :default-expanded="true">
    <template #icon>
      <svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
    </template>
    <template #title>
      Avisos e Recomendações
    </template>

    <div class="space-y-3">
      <div
        v-for="(aviso, index) in avisos"
        :key="index"
        class="border-l-4 p-4 rounded-r-lg"
        :class="getBorderColor(aviso.nivel)"
      >
        <!-- Cabeçalho do aviso -->
        <div class="flex items-start gap-3">
          <div class="flex-shrink-0">
            <svg
              v-if="aviso.nivel === 'critico'"
              class="w-6 h-6 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <svg
              v-else-if="aviso.nivel === 'atencao'"
              class="w-6 h-6 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <svg
              v-else
              class="w-6 h-6 text-blue-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>

          <div class="flex-1">
            <h3 class="font-semibold text-gray-900" :class="getTitleColor(aviso.nivel)">
              {{ aviso.titulo }}
            </h3>
            <p class="mt-1 text-sm text-gray-600">
              {{ aviso.descricao }}
            </p>

            <!-- Sugestões -->
            <div v-if="aviso.sugestoes && aviso.sugestoes.length > 0" class="mt-3">
              <p class="text-sm font-medium text-gray-700 mb-2">Sugestões:</p>
              <ul class="space-y-1">
                <li
                  v-for="(sugestao, sIndex) in aviso.sugestoes"
                  :key="sIndex"
                  class="text-sm text-gray-600 flex items-start gap-2"
                >
                  <span class="text-green-500 mt-0.5">•</span>
                  <span>{{ sugestao }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </CollapsibleCard>
</template>

<script setup lang="ts">
import type { Aviso } from '@distribuicao/core';
import { NivelAviso } from '@distribuicao/core';
import CollapsibleCard from './CollapsibleCard.vue';

defineProps<{
  avisos?: Aviso[]
}>();

function getBorderColor(nivel: NivelAviso | string): string {
  switch (nivel) {
    case 'critico':
      return 'border-red-500 bg-red-50';
    case 'atencao':
      return 'border-yellow-500 bg-yellow-50';
    case 'info':
      return 'border-blue-500 bg-blue-50';
    default:
      return 'border-gray-500 bg-gray-50';
  }
}

function getTitleColor(nivel: NivelAviso | string): string {
  switch (nivel) {
    case 'critico':
      return 'text-red-800';
    case 'atencao':
      return 'text-yellow-800';
    case 'info':
      return 'text-blue-800';
    default:
      return 'text-gray-800';
  }
}
</script>
