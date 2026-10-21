<!-- src/components/modals/ModalRevenue.vue -->
<template>
  <BaseModal
    :title="isEdit ? 'Edit Revenue' : 'Input Revenue'"
    maxWidth="max-w-lg"
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
          <option value="" disabled>-- Pilih Unit --</option>
          <option v-for="u in masterUnits" :key="u.code" :value="u.code">
            {{ u.code }} - {{ u.name }}
          </option>
        </select>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label
            class="block mb-1 font-semibold text-slate-600 dark:text-slate-300"
            >Revenue (Rp)</label
          >
          <input
            type="text"
            v-model="displayRevenue"
            @input="formatInput"
            required
            placeholder="0"
            class="w-full glass-input rounded-xl p-2.5 outline-none font-normal"
          />
        </div>
        <div>
          <label
            class="block mb-1 font-semibold text-slate-600 dark:text-slate-300"
            >Jumlah Pesanan</label
          >
          <input
            type="number"
            v-model.number="form.JumlahPesanan"
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
            >Divisi</label
          >
          <select
            v-model="form.Divisi"
            required
            class="w-full glass-input rounded-xl p-2.5 dark:bg-slate-800 outline-none font-semibold"
          >
            <option v-for="div in availableDivisions" :key="div" :value="div">
              {{ div }}
            </option>
          </select>
        </div>
        <div>
          <label
            class="block mb-1 font-semibold text-slate-600 dark:text-slate-300"
            >Platform</label
          >
          <select
            v-model="form.Platform"
            required
            class="w-full glass-input rounded-xl p-2.5 dark:bg-slate-800 outline-none font-semibold"
          >
            <option
              v-for="plat in availablePlatforms"
              :key="plat"
              :value="plat"
            >
              {{ plat }}
            </option>
          </select>
        </div>
      </div>
      <div>
        <label class="block font-semibold text-slate-500 mb-1"
          >Keterangan Tambahan</label
        >
        <textarea
          v-model="form.Keterangan"
          rows="2"
          class="w-full glass-input rounded-xl p-3 outline-none resize-none"
        ></textarea>
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
          class="bg-button text-white px-4 py-2 rounded-xl font-semibold shadow-md cursor-pointer"
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
