<!-- src/components/modals/ModalTarget.vue -->
<template>
  <BaseModal title="Update Target Revenue" maxWidth="max-w-md" @close="$emit('close')">
    <form @submit.prevent="saveData" class="space-y-3 ui-text-body">
      <div>
        <label class="block mb-1 font-semibold ui-text-secondary">Target Global (Rp)</label>
        <input
          type="text"
          v-model="displayTargetGlobal"
          @input="formatInputGlobal"
          required
          class="w-full rounded-xl p-2.5 font-normal ui-input ui-input-inherit min-h-0"
        />
      </div>
      <div v-for="u in masterUnits" :key="u.code">
        <label class="block mb-1 font-semibold ui-text-secondary">Target {{ u.code }} (Rp)</label>
        <input
          type="number"
          v-model.number="form['Target' + u.code]"
          required
          class="w-full rounded-xl p-2.5 font-normal ui-input ui-input-inherit min-h-0"
        />
      </div>
      <button
        type="submit"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl mt-4 shadow-md cursor-pointer disabled:opacity-50 ui-button min-h-0 px-0 gap-0 border-0 ui-button-inherit"
        :disabled="store.isLoading"
      >
        Simpan Master Targets
      </button>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { store } from "../../store";
import { api } from "../../services/api";
import BaseModal from "../BaseModal.vue";

const emit = defineEmits(["close"]);
const masterUnits = computed(() => store.db?.master?.unitList || []);
const form = reactive({ TargetTahunIni: 0 });
const displayTargetGlobal = ref("");

watch(
  () => store.db.master,
  (master) => {
    if (master) Object.assign(form, JSON.parse(JSON.stringify(master)));
    displayTargetGlobal.value = new Intl.NumberFormat("id-ID").format(
      form.TargetTahunIni,
    );
  },
  { immediate: true },
);

const formatInputGlobal = (e) => {
  const clean = e.target.value.replace(/\D/g, "");
  form.TargetTahunIni = Number(clean);
  displayTargetGlobal.value = new Intl.NumberFormat("id-ID").format(clean);
};

const saveData = async () => {
  store.isLoading = true;
  try {
    await api.saveMasterTargetsOnly(form);
    store.addNotification(
      "Target Diperbarui",
      "Master target disesuaikan",
      "warning",
    );
    await store.loadFullDatabase();
    emit("close");
  } catch (err) {
    store.openAlert("Gagal", err.message, null, "warning");
  } finally {
    store.isLoading = false;
  }
};
</script>
