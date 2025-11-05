<template>
  <div ref="triggerRef" class="tooltip-wrapper" @mouseenter="show = true" @mouseleave="show = false">
    <!-- Conteúdo que ativa o tooltip -->
    <div class="inline-flex items-center">
      <slot />
      
      <!-- Ícone de informação (opcional) -->
      <svg
        v-if="showIcon"
        class="w-4 h-4 ml-1 text-gray-400 hover:text-gray-600 cursor-help flex-shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clip-rule="evenodd"
        />
      </svg>
    </div>

    <!-- Tooltip Portal -->
    <Teleport to="body">
      <div
        v-if="show"
        ref="tooltipRef"
        class="fixed px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl z-[9999] max-w-xs leading-relaxed"
        :style="tooltipStyle"
      >
        <span class="block">{{ text }}</span>
        <!-- Seta do tooltip -->
        <div
          class="absolute"
          :class="arrowClass"
        >
          <div class="border-4 border-transparent" :class="arrowBorderClass"></div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';

const props = withDefaults(
  defineProps<{
    text: string;
    showIcon?: boolean;
    position?: 'top' | 'bottom' | 'left' | 'right';
  }>(),
  {
    showIcon: true,
    position: 'top'
  }
);

const show = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const tooltipRef = ref<HTMLElement | null>(null);
const tooltipStyle = ref<Record<string, string>>({});

// Calcular posição do tooltip quando ele é exibido
watch(show, async (newShow) => {
  if (newShow) {
    await nextTick();
    updatePosition();
  }
});

function updatePosition() {
  if (!triggerRef.value) return;

  const rect = triggerRef.value.getBoundingClientRect();
  const spacing = 8; // espaçamento entre o elemento e o tooltip

  let top = 0;
  let left = 0;

  switch (props.position) {
    case 'bottom':
      top = rect.bottom + spacing;
      left = rect.left + rect.width / 2;
      break;
    case 'left':
      top = rect.top + rect.height / 2;
      left = rect.left - spacing;
      break;
    case 'right':
      top = rect.top + rect.height / 2;
      left = rect.right + spacing;
      break;
    default: // top
      top = rect.top - spacing;
      left = rect.left + rect.width / 2;
      break;
  }

  const styles: Record<string, string> = {
    top: `${top}px`,
    left: `${left}px`,
  };

  // Transformações para centralizar baseado na posição
  if (props.position === 'top' || props.position === 'bottom') {
    styles.transform = 'translateX(-50%)';
    if (props.position === 'top') {
      styles.transform += ' translateY(-100%)';
    }
  } else if (props.position === 'left') {
    styles.transform = 'translate(-100%, -50%)';
  } else if (props.position === 'right') {
    styles.transform = 'translateY(-50%)';
  }

  tooltipStyle.value = styles;
}

const arrowClass = computed(() => {
  switch (props.position) {
    case 'bottom':
      return 'bottom-full left-1/2 -translate-x-1/2 mb-[-4px]';
    case 'left':
      return 'left-full top-1/2 -translate-y-1/2 ml-[-4px]';
    case 'right':
      return 'right-full top-1/2 -translate-y-1/2 mr-[-4px]';
    default: // top
      return 'top-full left-1/2 -translate-x-1/2 mt-[-4px]';
  }
});

const arrowBorderClass = computed(() => {
  switch (props.position) {
    case 'bottom':
      return 'border-b-gray-900';
    case 'left':
      return 'border-l-gray-900';
    case 'right':
      return 'border-r-gray-900';
    default: // top
      return 'border-t-gray-900';
  }
});
</script>

<style scoped>
.tooltip-wrapper {
  display: inline-block;
}
</style>

