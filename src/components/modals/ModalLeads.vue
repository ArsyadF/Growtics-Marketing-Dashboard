<!-- src/components/modals/ModalLeads.vue -->
<template>
  <BaseModal
    :title="isEdit ? 'Edit Leads & Campaign' : 'Input Leads & Campaign'"
    maxWidth="max-w-lg"
    @close="$emit('close')"
  >
    <form @submit.prevent="saveData" class="space-y-3 text-sm md:text-xs">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label
            class="block mb-1 font-semibold text-slate-600 dark:text-slate-300"
            >Tanggal</label
          >
          <input
            type="date"
            v-model="form.Tanggal"
            required
            class="w-full glass-input rounded-xl p-2.5 outline-none font-normal"
          />
        </div>
        <div>
          <label
            class="block mb-1 font-semibold text-slate-600 dark:text-slate-300"
            >Unit Usaha</label
          >
          <select
            v-model="form.Unit"
            required
            class="w-full glass-input rounded-xl p-2.5 dark:bg-slate-800 outline-none font-semibold"
          >
            <option v-for="u in masterUnits" :key="u.code" :value="u.code">
              {{ u.code }} - {{ u.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label
            class="block mb-1 font-semibold text-slate-600 dark:text-slate-300"
            >Campaign</label
          >
          <input
            type="number"
            v-model.number="form.Campaign"
            required
            placeholder="0"
            class="w-full glass-input rounded-xl p-2.5 outline-none font-normal"
          />
        </div>
        <div>
          <label
            class="block mb-1 font-semibold text-slate-600 dark:text-slate-300"
            >Database Leads</label
          >
          <input
            type="number"
            v-model.number="form.DatabaseLeads"
            required
            placeholder="0"
            class="w-full glass-input rounded-xl p-2.5 outline-none font-normal"
          />
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label
            class="block mb-1 font-semibold text-slate-600 dark:text-slate-300"
            >Follow Up</label
          >
          <input
            type="number"
            v-model.number="form.FollowUp"
            required
            placeholder="0"
            class="w-full glass-input rounded-xl p-2.5 outline-none font-normal"
          />
        </div>
        <div>
          <label
            class="block mb-1 font-semibold text-slate-600 dark:text-slate-300"
            >Pesanan (Closing)</label
          >
          <input
            type="number"
            v-model.number="form.Pesanan"
            required
            placeholder="0"
            class="w-full glass-input rounded-xl p-2.5 outline-none font-normal"
          />
        </div>
      </div>
      <div
        class="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 mt-4"
      >
        <button
          type="button"
          @click="$emit('close')"
          class="bg-slate-200 dark:bg-slate-800 px-4 py-2 rounded-xl font-semibold cursor-pointer"
        >
          Batal
        </button>
        <button
          type="submit"
          class="bg-button text-white px-4 py-2 rounded-xl font-semibold shadow-md cursor-pointer disabled:opacity-50"
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
