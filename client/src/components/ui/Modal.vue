<script setup lang="ts">
import { X } from 'lucide-vue-next';

interface Props {
  isOpen: boolean;
  title: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

withDefaults(defineProps<Props>(), {
  maxWidth: 'md',
});

defineEmits<{
  (e: 'close'): void;
}>();
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-in fade-in duration-200"
      @click.self="$emit('close')"
    >
      <div
        :class="[
          'bg-white rounded-2xl shadow-xl border border-stone-200 w-full overflow-hidden flex flex-col max-h-[90vh]',
          maxWidth === 'sm' && 'max-w-sm',
          maxWidth === 'md' && 'max-w-md',
          maxWidth === 'lg' && 'max-w-lg',
          maxWidth === 'xl' && 'max-w-xl',
        ]"
      >
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-cream-50">
          <h3 class="text-lg font-bold text-stone-900">{{ title }}</h3>
          <button
            @click="$emit('close')"
            class="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 overflow-y-auto">
          <slot />
        </div>

        <!-- Optional Footer -->
        <div v-if="$slots.footer" class="px-6 py-3 border-t border-stone-100 bg-cream-50/50 flex justify-end gap-3">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
