<!-- src/components/modals/ModalAlert.vue -->
<template>
  <BaseModal maxWidth="max-w-sm" @close="closeAlert">
    <template #header><div class="hidden"></div></template>
    <!-- Hilangkan header bawaan -->
    <div class="text-center space-y-4 pt-2">
      <div
        class="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-xl"
        :class="
          store.alertPayload.type === 'warning'
            ? 'bg-amber-500/10 text-amber-500'
            : 'bg-emerald-500/10 text-theme'
        "
      >
        <i
          class="fa-solid"
          :class="
            store.alertPayload.type === 'warning'
              ? 'fa-triangle-exclamation'
              : 'fa-circle-check'
          "
        ></i>
      </div>
      <div>
        <h3 class="font-semibold text-slate-800 dark:text-slate-100 text-base">
          {{ store.alertPayload.title || "Pemberitahuan" }}
        </h3>
        <p class="text-xs text-slate-500 mt-1 font-normal">
          {{ store.alertPayload.message }}
        </p>
      </div>
      <div class="flex gap-2 pt-4">
        <button
          v-if="store.alertPayload.onConfirm"
          @click="closeAlert"
          class="flex-1 bg-slate-200 dark:bg-slate-800 font-semibold py-2.5 rounded-xl text-xs cursor-pointer"
        >
          Batal
        </button>
        <button
          @click="confirm"
          class="flex-1 bg-button text-white font-semibold py-2.5 rounded-xl text-xs shadow-md cursor-pointer"
        >
          {{ store.alertPayload.onConfirm ? "Ya, Lanjutkan" : "OK" }}
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { store } from "../../store";
import BaseModal from "../BaseModal.vue";

const emit = defineEmits(["close"]);
const closeAlert = () => {
  store.closeAlert();
  emit("close");
};
const confirm = () => {
  if (store.alertPayload.onConfirm) store.alertPayload.onConfirm();
  closeAlert();
};
</script>
