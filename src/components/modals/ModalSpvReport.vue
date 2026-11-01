<!-- src/components/modals/ModalSpvReport.vue -->
<template>
  <BaseModal title="Input Laporan Pekanan SPV" maxWidth="max-w-lg" @close="$emit('close')">
    <form @submit.prevent="saveData" class="space-y-3 ui-text-body">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block mb-1 font-semibold ui-text-secondary">Tanggal Laporan</label>
          <input
            type="date"
            v-model="form.tanggal"
            required
            class="w-full rounded-xl p-2.5 font-normal ui-input ui-input-inherit min-h-0"
          />
        </div>
        <div>
          <label class="block mb-1 font-semibold ui-text-secondary">Divisi</label>
          <select
            v-model="form.divisi"
            required
            class="w-full rounded-xl p-2.5 font-semibold ui-input ui-input-inherit min-h-0"
          >
            <option v-for="div in availableDivisions" :key="div" :value="div">
              {{ div }}
            </option>
          </select>
        </div>
      </div>
      <div>
        <label class="block font-semibold mb-1 ui-text-secondary"
          >Capaian & Rangkuman Pekan Ini</label
        >
        <textarea
          v-model="form.capaian"
          rows="3"
          required
          class="w-full rounded-xl p-3 resize-none ui-input ui-input-inherit min-h-0"
        ></textarea>
      </div>
      <div>
        <label class="block font-semibold mb-1 ui-text-secondary">Kendala & Problem Field</label>
        <textarea
          v-model="form.kendala"
          rows="2"
          class="w-full rounded-xl p-3 resize-none ui-input ui-input-inherit min-h-0"
        ></textarea>
      </div>
      <div class="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800 mt-4">
        <button
          type="submit"
          class="w-full px-4 py-2.5 rounded-xl shadow-md cursor-pointer disabled:opacity-50 ui-button min-h-0 gap-0 ui-button-primary border-0 ui-button-inherit"
          :disabled="store.isLoading"
        >
          Simpan Laporan Divisi
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { reactive, computed } from "vue";
import { store } from "../../store";
import { api } from "../../services/api";
import BaseModal from "../BaseModal.vue";

const emit = defineEmits(["close"]);
const availableDivisions = computed(() => store.db?.master?.divisiList || []);

const form = reactive({
  tanggal: new Date().toISOString().split("T")[0],
  divisi: "CS Deal",
  capaian: "",
  kendala: "",
});

const saveData = async () => {
  store.isLoading = true;
  try {
    const payload = {
      id: Date.now(),
      ...form,
      pembuat: store.currentUser?.nama || store.currentUser?.email,
    };
    if (api.saveSpvReportData) await api.saveSpvReportData(payload);
    if (!store.db.spvReports) store.db.spvReports = [];
    store.db.spvReports.unshift(payload);
    store.addNotification("Berhasil", "Laporan SPV disimpan", "success");
    emit("close");
  } catch (err) {
    store.openAlert("Gagal", err.message, null, "warning");
  } finally {
    store.isLoading = false;
  }
};
</script>
