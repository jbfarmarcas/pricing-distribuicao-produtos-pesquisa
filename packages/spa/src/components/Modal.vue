<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 overflow-y-auto"
      >
        <!-- Overlay -->
        <div 
          class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          @click="handleClose"
        ></div>

        <!-- Modal Container -->
        <div class="flex min-h-full items-center justify-center p-4 pointer-events-none">
          <div
            class="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col pointer-events-auto"
            @click.stop
          >
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div class="flex items-center gap-3">
                <slot name="icon" />
                <h2 class="text-xl font-bold text-gray-900">
                  <slot name="title">Modal</slot>
                </h2>
              </div>
              <button
                @click="handleClose"
                class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Fechar"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto px-6 py-6">
              <slot />
            </div>

            <!-- Footer (optional) -->
            <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    closeOnEscape?: boolean;
    closeOnOverlay?: boolean;
  }>(),
  {
    closeOnEscape: true,
    closeOnOverlay: true
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'close': [];
}>();

function handleClose() {
  if (props.closeOnOverlay) {
    emit('update:modelValue', false);
    emit('close');
  }
}

function handleEscape(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.modelValue && props.closeOnEscape) {
    emit('update:modelValue', false);
    emit('close');
  }
}

// Adicionar/remover listener apenas quando necessário
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', handleEscape);
    // Prevenir scroll do body quando modal está aberto
    document.body.style.overflow = 'hidden';
  } else {
    document.removeEventListener('keydown', handleEscape);
    document.body.style.overflow = '';
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape);
  document.body.style.overflow = '';
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}
</style>

