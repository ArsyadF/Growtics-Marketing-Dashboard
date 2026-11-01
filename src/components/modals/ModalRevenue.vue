<!-- src/components/modals/ModalRevenue.vue -->
<template>
  <BaseModal
    :title="isEdit ? 'Edit Revenue' : 'Input Revenue'"
    maxWidth="max-w-lg"
    @close="$emit('close')"
  >
    <form @submit.prevent="saveData" class="space-y-4 ui-text-body">
      <div>
        <label class="ui-label leading-4">Tanggal</label>
        <input
          type="date"
          v-model="form.Tanggal"
          required
          class="w-full rounded-xl p-2.5 font-semibold transition-all ui-input ui-input-inherit min-h-0 ui-text-primary ui-text-body"
        />
      </div>
      <div>
        <label class="ui-label leading-4">Unit Usaha</label>
        <select
          v-model="form.Unit"
          required
          class="w-full rounded-xl p-2.5 font-semibold transition-all ui-input ui-input-inherit min-h-0 ui-text-primary ui-text-body"
        >
          <option value="" disabled>-- Pilih Unit --</option>
          <option v-for="u in masterUnits" :key="u.code" :value="u.code">
            {{ u.code }} - {{ u.name }}
          </option>
        </select>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="ui-label leading-4">Revenue (Rp)</label>
          <input
            type="text"
            v-model="displayRevenue"
            @input="formatInput"
            required
            placeholder="0"
            class="w-full rounded-xl p-2.5 font-semibold transition-all ui-input ui-input-inherit min-h-0 ui-text-primary ui-text-body"
          />
        </div>
        <div>
          <label class="ui-label leading-4">Jumlah Pesanan</label>
          <input
            type="number"
            v-model.number="form.JumlahPesanan"
            required
            placeholder="0"
            class="w-full rounded-xl p-2.5 font-semibold transition-all ui-input ui-input-inherit min-h-0 ui-text-primary ui-text-body"
          />
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="ui-label leading-4">Divisi</label>
          <select
            v-model="form.Divisi"
            required
            class="w-full rounded-xl p-2.5 font-semibold transition-all ui-input ui-input-inherit min-h-0 ui-text-primary ui-text-body"
          >
            <option v-for="div in availableDivisions" :key="div" :value="div">
              {{ div }}
            </option>
          </select>
        </div>
        <div>
          <label class="ui-label leading-4">Platform</label>
          <select
            v-model="form.Platform"
            required
            class="w-full rounded-xl p-2.5 font-semibold transition-all ui-input ui-input-inherit min-h-0 ui-text-primary ui-text-body"
          >
            <option v-for="plat in availablePlatforms" :key="plat" :value="plat">
              {{ plat }}
            </option>
          </select>
        </div>
      </div>
      <div>
        <label class="ui-label leading-4">Keterangan Tambahan</label>
        <textarea
          v-model="form.Keterangan"
          rows="2"
          class="w-full rounded-xl p-2.5 resize-y transition-all ui-input ui-input-inherit min-h-0 ui-text-primary ui-text-body"
        ></textarea>
      </div>
      <div class="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 mt-4">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2.5 md:py-2 rounded-xl cursor-pointer transition-all ui-button min-h-0 gap-0 ui-button-glass glass-hover ui-text-secondary ui-text-body"
        >
          Batal
        </button>
        <button
          type="submit"
          class="px-5 py-2.5 md:py-2 rounded-xl shadow-sm cursor-pointer transition-all hover:shadow-md ui-button min-h-0 gap-0 ui-button-primary ui-text-body border-0"
        >
          Simpan Revenue
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
const availableDivisions = computed(
  () => store.db?.master?.divisiList || ["CS Deal"],
);
const availablePlatforms = computed(
  () => store.db?.master?.platformList || ["Shopee"],
);

const form = reactive({
  Tanggal: new Date().toISOString().split("T")[0],
  Unit: "NHP",
  Revenue: 0,
  JumlahPesanan: 0,
  Divisi: "CS Deal",
  Platform: "Shopee",
  Keterangan: "",
});
const displayRevenue = ref("");

watch(
  () => store.selectedItemForEdit,
  (raw) => {
    if (raw && raw.Timestamp) {
      Object.assign(form, {
        ...raw,
        Tanggal: raw.Tanggal.substring(0, 10),
        Revenue: Number(raw.Revenue),
        JumlahPesanan: Number(raw.JumlahPesanan || raw.pesanan),
      });
    }
    displayRevenue.value = new Intl.NumberFormat("id-ID").format(form.Revenue);
  },
  { immediate: true },
);

const formatInput = (e) => {
  const clean = e.target.value.replace(/\D/g, "");
  form.Revenue = Number(clean);
  displayRevenue.value = new Intl.NumberFormat("id-ID").format(clean);
};

const saveData = async () => {
  store.isLoading = true;
  try {
    const docId =
      store.selectedItemForEdit?.id || store.selectedItemForEdit?.Timestamp;
    isEdit.value
      ? await api.updateData("revenues", docId, form)
      : await api.saveData("revenues", form);
    store.addNotification("Berhasil", "Data Revenue disimpan", "success");
    await store.loadFullDatabase();
    emit("close");
  } catch (err) {
    store.openAlert("Gagal", err.message, null, "warning");
  } finally {
    store.isLoading = false;
  }
};
</script>
