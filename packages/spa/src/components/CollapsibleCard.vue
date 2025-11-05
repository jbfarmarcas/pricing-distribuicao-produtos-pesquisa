<template>
  <div class="bg-white rounded-lg shadow-md transition-all duration-300">
    <!-- Header - sempre visível -->
    <div
      @click="toggle"
      class="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
      :class="{ 'border-b border-gray-200': isExpanded }"
    >
      <div class="flex items-center gap-3 flex-1">
        <!-- Slot para ícone opcional -->
        <slot name="icon" />
        
        <div class="flex-1">
          <h2 class="text-xl font-bold text-gray-800">
            <slot name="title">Título</slot>
          </h2>
          <p v-if="$slots.subtitle" class="text-sm text-gray-600 mt-1">
            <slot name="subtitle" />
          </p>
        </div>
      </div>

      <!-- Botão de colapso/expansão -->
      <button
        class="ml-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
        :class="{ 'rotate-180': isExpanded }"
        aria-label="Toggle section"
      >
        <svg
          class="w-5 h-5 text-gray-600 transition-transform duration-300"
          :class="{ 'rotate-180': isExpanded }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>

    <!-- Conteúdo colapsável -->
    <transition
      name="collapse"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div v-show="isExpanded" class="overflow-hidden">
        <div class="p-6 pt-4">
          <slot>Conteúdo do card</slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    defaultExpanded?: boolean;
    title?: string;
  }>(),
  {
    defaultExpanded: true
  }
);

const isExpanded = ref(props.defaultExpanded);

function toggle() {
  isExpanded.value = !isExpanded.value;
}

// Animações suaves para colapso/expansão
function enter(el: Element) {
  const element = el as HTMLElement;
  element.style.height = '0';
  requestAnimationFrame(() => {
    element.style.height = element.scrollHeight + 'px';
  });
}

function afterEnter(el: Element) {
  const element = el as HTMLElement;
  element.style.height = '';
}

function leave(el: Element) {
  const element = el as HTMLElement;
  element.style.height = element.scrollHeight + 'px';
  requestAnimationFrame(() => {
    element.style.height = '0';
  });
}

function afterLeave(el: Element) {
  const element = el as HTMLElement;
  element.style.height = '';
}

// Expor método para controle externo
defineExpose({
  toggle,
  isExpanded
});
</script>

<style scoped>
.collapse-enter-active,
.collapse-leave-active {
  transition: height 0.3s ease;
}

.collapse-enter-from,
.collapse-leave-to {
  height: 0;
}
</style>

