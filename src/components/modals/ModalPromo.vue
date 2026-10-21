<!-- src/components/modals/ModalPromo.vue -->
<template>
  <BaseModal
    :title="isEdit ? 'Edit Biaya Promosi' : 'Input Biaya Promosi'"
    maxWidth="max-w-md"
    @close="$emit('close')"
  >
    <form @submit.prevent="saveData" class="space-y-3 text-sm md:text-xs">
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
      <div>
        <label class="block mb-1 font-semibold text-rose-500"
          >Biaya Promosi (Rp)</label
        >
        <input
          type="text"
          v-model="displayBiaya"
          @input="formatInput"
          required
          placeholder="0"
          class="w-full glass-input rounded-xl p-2.5 outline-none font-normal"
        />
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
          class="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-xl font-semibold shadow-md cursor-pointer disabled:opacity-50"
          :disabled="store.isLoading"
        >
          Simpan Promosi
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { store } from "../../store";
import { api } from "../../services/api";
import BaseModal from "../BaseModal.vue";

const emit = defineEmits(["close"]);
const isEdit = computed(() => !!store.selectedItemForEdit?.Timestamp);
const masterUnits = computed(() => store.db?.master?.unitList || []);

const form = reactive({
  Tanggal: new Date().toISOString().split("T")[0],
  Unit: "NHP",
  BiayaPromosi: 0,
});
const displayBiaya = ref("");

watch(
  () => store.selectedItemForEdit,
  (raw) => {
    if (raw && raw.Timestamp) {
      Object.assign(form, {
        ...raw,
        Tanggal: raw.Tanggal.substring(0, 10),
        BiayaPromosi: Number(raw.BiayaPromosi),
      });
    }
    displayBiaya.value = new Intl.NumberFormat("id-ID").format(
      form.BiayaPromosi,
    );
  },
  { immediate: true },
);

const formatInput = (e) => {
  const clean = e.target.value.replace(/\D/g, "");
  form.BiayaPromosi = Number(clean);
  displayBiaya.value = new Intl.NumberFormat("id-ID").format(clean);
};

const saveData = async () => {
  store.isLoading = true;
  try {
    const docId =
      store.selectedItemForEdit?.id || store.selectedItemForEdit?.Timestamp;
    isEdit.value
      ? await api.updateData("promosi", docId, form)
      : await api.saveData("promosi", form);
    store.addNotification("Berhasil", "Biaya Promosi disimpan", "success");
    await store.loadFullDatabase();
    emit("close");
  } catch (err) {
    store.openAlert("Gagal", err.message, null, "warning");
  } finally {
    store.isLoading = false;
  }
};
</script>
