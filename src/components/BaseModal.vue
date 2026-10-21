<!-- src/components/BaseModal.vue -->
<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[10050] bg-slate-950/70 backdrop-blur-md flex justify-center items-center p-4 animate-fade-in"
    >
      <!-- Container Utama Modal -->
      <div
        :class="[
          'glass-card bg-white/95 dark:bg-slate-900/95 rounded-3xl w-full max-h-[95vh] flex flex-col shadow-2xl relative',
          maxWidth,
        ]"
      >
        <!-- Header Default (Bisa ditimpa menggunakan <template #header>) -->
        <slot name="header">
          <div
            v-if="title"
            class="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0"
          >
            <h3
              class="font-semibold text-slate-800 dark:text-slate-100 text-base md:text-sm flex items-center gap-2"
            >
              <slot name="icon"></slot>
              {{ title }}
            </h3>
            <button
              @click="$emit('close')"
              class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
            >
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>
        </slot>

        <!-- Body / Konten Utama (Scrollable) -->
        <div class="p-6 overflow-y-auto custom-scrollbar flex-1">
          <slot></slot>
        </div>

        <!-- Footer Default (Opsional, untuk tombol aksi terpisah) -->
        <div
          v-if="$slots.footer"
          class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 shrink-0 flex justify-end gap-2"
        >
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  title: { type: String, default: "" },
  maxWidth: { type: String, default: "max-w-md" }, // Opsi: max-w-sm, max-w-lg, max-w-2xl, dsb.
});
defineEmits(["close"]);
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
