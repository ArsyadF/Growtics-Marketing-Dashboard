<!-- src/components/modals/ModalImportExcel.vue -->
<template>
  <BaseModal
    v-if="isOpen && canAccess"
    :title="`Import ${currentSchema?.title || 'Data'} (Excel)`"
    maxWidth="max-w-2xl"
    @close="close"
  >
    <!-- TAHAP 1: UPLOAD & UNDUH -->
    <div v-if="step === 'upload'" class="space-y-4 py-2 text-center">
      <div
        class="p-3 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between gap-3 text-left"
      >
        <div class="flex items-center gap-2.5">
          <div
            class="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0"
          >
            <i class="fa-solid fa-file-excel text-base"></i>
          </div>
          <div>
            <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Format Template
            </p>
            <p class="text-xs text-slate-400 font-normal">
              Unduh contoh template agar struktur kolom sesuai.
            </p>
          </div>
        </div>
        <button
          @click="handleDownloadTemplate"
          class="bg-emerald-600 text-white font-semibold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
        >
          <i class="fa-solid fa-download text-xs"></i> Unduh
        </button>
      </div>

      <label
        class="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-700/80 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors"
      >
        <i class="fa-solid fa-cloud-arrow-up text-xl text-emerald-600 mb-2"></i>
        <span class="text-sm font-semibold text-slate-700 dark:text-slate-200"
          >Pilih berkas Excel (.xlsx)</span
        >
        <input
          type="file"
          accept=".xlsx, .xls"
          @change="handleFileSelect"
          class="hidden"
        />
      </label>
    </div>

    <!-- TAHAP 2: PRATINJAU & KONFLIK -->
    <div v-else-if="step === 'preview'" class="space-y-4 text-sm md:text-xs">
      <div class="grid grid-cols-3 gap-3">
        <div
          class="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl"
        >
          <p class="text-xs text-emerald-600 font-semibold uppercase">
            Data Baru
          </p>
          <p class="text-xl font-semibold text-emerald-700">
            {{ diffResult.newItems.length }}
          </p>
        </div>
        <div class="p-3 bg-slate-500/10 border border-slate-500/20 rounded-xl">
          <p class="text-xs text-slate-500 font-semibold uppercase">
            Diabaikan
          </p>
          <p class="text-xl font-semibold text-slate-600">
            {{ diffResult.unchanged.length }}
          </p>
        </div>
        <div class="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <p class="text-xs text-amber-600 font-semibold uppercase">Konflik</p>
          <p class="text-xl font-semibold text-amber-700">
            {{ diffResult.conflicts.length }}
          </p>
        </div>
      </div>

      <div
        v-if="diffResult.conflicts.length > 0"
        class="p-3 bg-amber-50/50 border border-amber-200 rounded-xl"
      >
        <div class="flex items-center justify-between">
          <span class="font-semibold text-amber-800"
            >Aksi Seluruh Konflik:</span
          >
          <select
            v-model="globalConflictResolution"
            @change="applyGlobalResolution"
            class="glass-input text-xs font-semibold rounded-lg p-1.5"
          >
            <option value="overwrite">Timpa Data Lama</option>
            <option value="generate_new">Buat Data Baru</option>
            <option value="keep_existing">Abaikan</option>
          </select>
        </div>
      </div>

      <!-- FOOTER AKSI PREVIEW -->
      <div
        class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2 mt-4"
      >
        <button
          @click="close"
          class="px-4 py-2 rounded-xl text-slate-500 font-semibold hover:bg-slate-100 cursor-pointer text-xs"
        >
          Batal
        </button>
        <button
          @click="processImport"
          :disabled="isProcessing"
          class="bg-button text-white px-5 py-2 rounded-xl font-semibold text-xs shadow-md cursor-pointer disabled:opacity-50"
        >
          {{ isProcessing ? "Memproses..." : "Jalankan Import" }}
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref, computed } from "vue";
import { store } from "../../store";
import { EXCEL_SCHEMAS } from "../../utils/excelSchemas.js";
import {
  parseExcelWithSchema,
  analyzeImportDiff,
  downloadExcelTemplate,
} from "../../utils/excelHandler.js";
import BaseModal from "../BaseModal.vue";

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  schemaKey: { type: String, default: "ADUAN" },
  primaryKey: { type: String, default: "" },
  existingData: { type: Array, default: () => [] },
});
const emit = defineEmits(["close", "confirm"]);

const canAccess = computed(() => store.canExportImport());
const currentSchema = computed(() => EXCEL_SCHEMAS[props.schemaKey] || {});
const activePrimaryKey = computed(
  () => props.primaryKey || currentSchema.value.primaryKey || "id",
);

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
    store.addNotification("Gagal", err.message, "warning");
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
      activePrimaryKey.value,
    );
    step.value = "preview";
  } catch (err) {
    store.addNotification("Gagal", err.message, "warning");
  }
};

const applyGlobalResolution = () => {
  diffResult.value.conflicts.forEach(
    (c) => (c.resolution = globalConflictResolution.value),
  );
};

const processImport = () => {
  if (!canAccess.value) return;
  isProcessing.value = true;
  const finalToSave = [...diffResult.value.newItems];
  let updatedCount = 0,
    addedCount = diffResult.value.newItems.length;

  diffResult.value.conflicts.forEach((c) => {
    if (c.resolution === "overwrite") {
      finalToSave.push(c.incoming);
      updatedCount++;
    } else if (c.resolution === "generate_new") {
      finalToSave.push({
        ...c.incoming,
        [activePrimaryKey.value]: `${c.incoming[activePrimaryKey.value] || Date.now()}_NEW_${Date.now()}`,
      });
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
