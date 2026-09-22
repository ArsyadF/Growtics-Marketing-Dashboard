<!-- src/components/ModalImportExcel.vue -->
<template>
  <Teleport to="body">
    <div
      v-if="isOpen && canAccess"
      class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        class="glass-card w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-100 dark:border-slate-800 max-h-[90vh] flex flex-col"
      >
        <!-- HEADER -->
        <div
          class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3"
        >
          <div>
            <h3
              class="font-bold text-slate-800 dark:text-slate-100 text-base flex items-center gap-2"
            >
              <i class="fa-solid fa-file-excel text-emerald-600"></i>
              Import {{ currentSchema?.title || "Data" }} (Excel)
            </h3>
            <p class="text-[11px] text-slate-400 mt-0.5">
              Unggah berkas Excel (.xlsx / .xls) untuk kelola data massal.
            </p>
          </div>
          <button
            @click="close"
            class="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <!-- TAHAP 1: UPLOAD FILE & UNDUH SAMPLE -->
        <div v-if="step === 'upload'" class="space-y-4 py-4 text-center">
          <!-- TOMBOL UNDUH TEMPLATE SAMPLE EXCEL -->
          <div
            class="p-3 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between gap-3 text-left"
          >
            <div class="flex items-center gap-2.5">
              <div
                class="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0"
              >
                <i class="fa-solid fa-file-excel text-base"></i>
              </div>
              <div>
                <p class="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Format kolom untuk modul ini
                </p>
                <p class="text-[10px] text-slate-400">
                  Unduh template contoh Excel agar urutan kolom sesuai.
                </p>
              </div>
            </div>
            <button
              @click="handleDownloadTemplate"
              type="button"
              class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
            >
              <i class="fa-solid fa-download text-[11px]"></i>
              <span>Unduh Template (.xlsx)</span>
            </button>
          </div>

          <!-- DROPZONE UPLOAD -->
          <label
            class="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-700/80 rounded-2xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
          >
            <i
              class="fa-solid fa-cloud-arrow-up text-4xl text-emerald-600 mb-2"
            ></i>
            <span
              class="text-xs font-semibold text-slate-700 dark:text-slate-200"
              >Pilih berkas Excel (.xlsx / .xls)</span
            >
            <span class="text-[10px] text-slate-400 mt-1"
              >Data akan otomatis dicocokkan dengan kolom database</span
            >
            <input
              type="file"
              accept=".xlsx, .xls"
              @change="handleFileSelect"
              class="hidden"
            />
          </label>
        </div>

        <!-- TAHAP 2: PRATINJAU & PENANGANAN KONFLIK -->
        <div
          v-else-if="step === 'preview'"
          class="space-y-4 overflow-y-auto flex-1 pr-1 text-xs"
        >
          <!-- RINGKASAN REKAP DATA -->
          <div class="grid grid-cols-3 gap-3">
            <div
              class="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl"
            >
              <p class="text-[10px] text-emerald-600 font-bold uppercase">
                Data Baru
              </p>
              <p
                class="text-lg font-bold text-emerald-700 dark:text-emerald-400"
              >
                {{ diffResult.newItems.length }}
              </p>
            </div>
            <div
              class="p-3 bg-slate-500/10 border border-slate-500/20 rounded-xl"
            >
              <p class="text-[10px] text-slate-500 font-bold uppercase">
                Sama (Diabaikan)
              </p>
              <p class="text-lg font-bold text-slate-600 dark:text-slate-400">
                {{ diffResult.unchanged.length }}
              </p>
            </div>
            <div
              class="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl"
            >
              <p class="text-[10px] text-amber-600 font-bold uppercase">
                Konflik Data
              </p>
              <p class="text-lg font-bold text-amber-700 dark:text-amber-400">
                {{ diffResult.conflicts.length }}
              </p>
            </div>
          </div>

          <!-- PENGATURAN KONFLIK MASSAL -->
          <div
            v-if="diffResult.conflicts.length > 0"
            class="p-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl space-y-2"
          >
            <div class="flex items-center justify-between">
              <span class="font-bold text-amber-800 dark:text-amber-300"
                >Aksi untuk Seluruh Data Konflik:</span
              >
              <select
                v-model="globalConflictResolution"
                @change="applyGlobalResolution"
                class="glass-input text-xs rounded-lg p-1.5 dark:bg-slate-800"
              >
                <option value="overwrite">Timpa Data Lama</option>
                <option value="generate_new">
                  Buat Sebagai Data Baru (Ganti ID)
                </option>
                <option value="keep_existing">
                  Abaikan (Gunakan Data Lama)
                </option>
              </select>
            </div>
          </div>

          <!-- DAFTAR RINCIAN KONFLIK -->
          <div v-if="diffResult.conflicts.length > 0" class="space-y-2">
            <h4 class="font-bold text-slate-700 dark:text-slate-300">
              Rincian Konflik:
            </h4>
            <div
              v-for="(item, idx) in diffResult.conflicts"
              :key="idx"
              class="p-3 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 bg-slate-50/50 dark:bg-slate-800/30"
            >
              <div class="flex items-center justify-between">
                <span class="font-mono font-bold text-emerald-600"
                  >ID Key: #{{ item.incoming[primaryKey] }}</span
                >
                <select
                  v-model="item.resolution"
                  class="glass-input text-[11px] rounded-lg p-1 dark:bg-slate-800"
                >
                  <option value="overwrite">Timpa Data</option>
                  <option value="generate_new">Ganti ID Baru</option>
                  <option value="keep_existing">Abaikan</option>
                </select>
              </div>
              <p class="text-[11px] text-slate-500">
                <strong>Perubahan:</strong>
                {{ getDiffDescription(item.existing, item.incoming) }}
              </p>
            </div>
          </div>
        </div>

        <!-- FOOTER / TOMBOL AKSI -->
        <div
          class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2"
        >
          <button
            @click="close"
            class="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            Batal
          </button>
          <button
            v-if="step === 'preview'"
            @click="processImport"
            :disabled="isProcessing"
            class="bg-button text-white px-5 py-2 rounded-xl font-bold shadow-md cursor-pointer disabled:opacity-50"
          >
            {{ isProcessing ? "Memproses..." : "Jalankan Import" }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from "vue";
import { store } from "../store/index.js";
import { EXCEL_SCHEMAS } from "../utils/excelSchemas.js";
import {
  parseExcelWithSchema,
  analyzeImportDiff,
  downloadExcelTemplate,
} from "../utils/excelHandler.js";

const props = defineProps({
  isOpen: Boolean,
  schemaKey: { type: String, required: true },
  existingData: { type: Array, default: () => [] },
});

const emit = defineEmits(["close", "confirm"]);

const canAccess = computed(() => store.canExportImport());
const currentSchema = computed(() => EXCEL_SCHEMAS[props.schemaKey] || {});
const primaryKey = computed(() => currentSchema.value.primaryKey || "id");

const step = ref("upload");
const isProcessing = ref(false);
const diffResult = ref({ newItems: [], unchanged: [], conflicts: [] });
const globalConflictResolution = ref("overwrite");

const close = () => {
  step.value = "upload";
  diffResult.value = { newItems: [], unchanged: [], conflicts: [] };
  emit("close");
};

const handleDownloadTemplate = () => {
  try {
    downloadExcelTemplate(props.schemaKey);
  } catch (err) {
    store.addNotification("Gagal Unduh Template", err.message, "warning");
  }
};

const handleFileSelect = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const rawParsed = await parseExcelWithSchema(file, props.schemaKey);
    diffResult.value = analyzeImportDiff(
      rawParsed,
      props.existingData,
      primaryKey.value,
    );
    step.value = "preview";
  } catch (err) {
    store.addNotification("Gagal Membaca File", err.message, "warning");
  }
};

const applyGlobalResolution = () => {
  diffResult.value.conflicts.forEach((c) => {
    c.resolution = globalConflictResolution.value;
  });
};

const getDiffDescription = (existing, incoming) => {
  const changedKeys = Object.keys(incoming).filter(
    (k) => JSON.stringify(incoming[k]) !== JSON.stringify(existing[k]),
  );
  return changedKeys.join(", ") || "Perbedaan data";
};

const processImport = () => {
  if (!canAccess.value) return;

  isProcessing.value = true;

  const finalToSave = [...diffResult.value.newItems];
  let updatedCount = 0;
  let addedCount = diffResult.value.newItems.length;

  diffResult.value.conflicts.forEach((c) => {
    if (c.resolution === "overwrite") {
      finalToSave.push(c.incoming);
      updatedCount++;
    } else if (c.resolution === "generate_new") {
      const pKey = primaryKey.value;
      const newItem = {
        ...c.incoming,
        [pKey]: `${c.incoming[pKey]}_NEW_${Date.now()}`,
      };
      finalToSave.push(newItem);
      addedCount++;
    }
  });

  emit("confirm", {
    itemsToSave: finalToSave,
    stats: {
      added: addedCount,
      updated: updatedCount,
      ignored:
        diffResult.value.unchanged.length +
        diffResult.value.conflicts.filter(
          (c) => c.resolution === "keep_existing",
        ).length,
    },
  });

  isProcessing.value = false;
  close();
};
</script>
