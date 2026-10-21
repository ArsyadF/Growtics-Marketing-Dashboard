<!-- src/components/modals/ModalKodeAkses.vue -->
<template>
  <BaseModal
    title="Update Passcode Publik"
    maxWidth="max-w-md"
    @close="$emit('close')"
  >
    <form @submit.prevent="saveData" class="space-y-3 text-sm md:text-xs">
      <div>
        <label
          class="block mb-1 font-semibold text-amber-600 dark:text-amber-400"
          >Kode Akses Publik (PIN)</label
        >
        <input
          type="text"
          v-model="form.code"
          required
          class="w-full glass-input rounded-xl p-2.5 outline-none font-mono font-normal"
        />
      </div>
      <button
        type="submit"
        class="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-2.5 rounded-xl mt-4 shadow-md cursor-pointer disabled:opacity-50"
        :disabled="store.isLoading"
      >
        Simpan Passcode
      </button>
    </form>
  </BaseModal>
</template>

<script setup>
import { reactive, watch } from "vue";
import { store } from "../../store";
import { api } from "../../services/api";
import BaseModal from "../BaseModal.vue";

const emit = defineEmits(["close"]);
const form = reactive({ code: "0" });

watch(
  () => store.db.master,
  (master) => {
    form.code = String(master?.KodeAkses || "0");
  },
  { immediate: true },
);

const saveData = async () => {
  store.isLoading = true;
  try {
    await api.saveMasterData({ KodeAkses: form.code });
    store.db.master.KodeAkses = form.code;
    store.addNotification("Berhasil", "Passcode diubah", "success");
    emit("close");
  } catch (err) {
    store.openAlert("Gagal", err.message, null, "warning");
  } finally {
    store.isLoading = false;
  }
};
</script>
