<!-- src/components/modals/ModalLeads.vue -->
<template>
  <BaseModal
    :title="isEdit ? 'Edit Leads & Campaign' : 'Input Leads & Campaign'"
    maxWidth="max-w-lg"
    @close="$emit('close')"
  >
    <form @submit.prevent="saveData" class="space-y-3 ui-text-body">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block mb-1 font-semibold ui-text-secondary">Tanggal</label>
          <input
            type="date"
            v-model="form.Tanggal"
            required
            class="w-full rounded-xl p-2.5 font-normal ui-input ui-input-inherit min-h-0"
          />
        </div>
        <div>
          <label class="block mb-1 font-semibold ui-text-secondary">Unit Usaha</label>
          <select
            v-model="form.Unit"
            required
            class="w-full rounded-xl p-2.5 font-semibold ui-input ui-input-inherit min-h-0"
          >
            <option v-for="u in masterUnits" :key="u.code" :value="u.code">
              {{ u.code }} - {{ u.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block mb-1 font-semibold ui-text-secondary">Campaign</label>
          <input
            type="number"
            v-model.number="form.Campaign"
            required
            placeholder="0"
            class="w-full rounded-xl p-2.5 font-normal ui-input ui-input-inherit min-h-0"
          />
        </div>
        <div>
          <label class="block mb-1 font-semibold ui-text-secondary">Database Leads</label>
          <input
            type="number"
            v-model.number="form.DatabaseLeads"
            required
            placeholder="0"
            class="w-full rounded-xl p-2.5 font-normal ui-input ui-input-inherit min-h-0"
          />
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block mb-1 font-semibold ui-text-secondary">Follow Up</label>
          <input
            type="number"
            v-model.number="form.FollowUp"
            required
            placeholder="0"
            class="w-full rounded-xl p-2.5 font-normal ui-input ui-input-inherit min-h-0"
          />
        </div>
        <div>
          <label class="block mb-1 font-semibold ui-text-secondary">Pesanan (Closing)</label>
          <input
            type="number"
            v-model.number="form.Pesanan"
            required
            placeholder="0"
            class="w-full rounded-xl p-2.5 font-normal ui-input ui-input-inherit min-h-0"
          />
        </div>
      </div>
      <div class="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 mt-4">
        <button
          type="button"
          @click="$emit('close')"
          class="bg-slate-200 dark:bg-slate-800 px-4 py-2 rounded-xl cursor-pointer ui-button min-h-0 gap-0 border-0 ui-button-inherit"
        >
          Batal
        </button>
        <button
          type="submit"
          class="px-4 py-2 rounded-xl shadow-md cursor-pointer disabled:opacity-50 ui-button min-h-0 gap-0 ui-button-primary border-0 ui-button-inherit"
          :disabled="store.isLoading"
        >
          Simpan Data
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { reactive, computed, watch } from "vue";
import { store } from "../../store";
import { api } from "../../services/api";
import BaseModal from "../BaseModal.vue";

const emit = defineEmits(["close"]);
const isEdit = computed(() => !!store.selectedItemForEdit?.Timestamp);
const masterUnits = computed(() => store.db?.master?.unitList || []);

const form = reactive({
  Tanggal: new Date().toISOString().split("T")[0],
  Unit: "NHP",
  Campaign: 0,
  DatabaseLeads: 0,
  FollowUp: 0,
  Pesanan: 0,
});

watch(
  () => store.selectedItemForEdit,
  (raw) => {
    if (raw && raw.Timestamp) {
      Object.assign(form, {
        ...raw,
        Tanggal: raw.Tanggal.substring(0, 10),
        Campaign: Number(raw.Campaign),
        DatabaseLeads: Number(raw.DatabaseLeads),
        FollowUp: Number(raw.FollowUp),
        Pesanan: Number(raw.Pesanan),
      });
    }
  },
  { immediate: true },
);

const saveData = async () => {
  store.isLoading = true;
  try {
    const docId =
      store.selectedItemForEdit?.id || store.selectedItemForEdit?.Timestamp;
    isEdit.value
      ? await api.updateData("leads", docId, form)
      : await api.saveData("leads", form);
    store.addNotification("Berhasil", "Data Leads disimpan", "success");
    await store.loadFullDatabase();
    emit("close");
  } catch (err) {
    store.openAlert("Gagal", err.message, null, "warning");
  } finally {
    store.isLoading = false;
  }
};
</script>
