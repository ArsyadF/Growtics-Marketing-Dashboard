<!-- src/views/PageUnit.vue -->
<template>
  <section id="page-unit" class="page-section space-y-4 md:space-y-6">
    <!-- Filter Header Card -->
    <div class="glass-card p-4 rounded-2xl space-y-3">
      <div
        class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
      >
        <div>
          <p class="text-slate-400 text-xs">
            Sesuaikan rekap berdasarkan bulan, divisi, atau platform.
          </p>
        </div>

        <!-- BUTTON GROUP: EXPORT, IMPORT & TAMBAH DATA -->
        <div class="flex items-center gap-2 flex-wrap shrink-0">
          <!-- Tombol Export Excel -->
          <button
            v-if="store.canExportImport()"
            @click="handleExportRevenue"
            class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-2 rounded-2xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
          >
            <i class="fa-solid fa-file-excel"></i>
            <span>Export Excel</span>
          </button>

          <!-- Tombol Import Excel -->
          <button
            v-if="store.canExportImport()"
            @click="isImportModalOpen = true"
            class="bg-slate-700 hover:bg-slate-800 text-white font-bold px-3 py-2 rounded-2xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
          >
            <i class="fa-solid fa-file-import"></i>
            <span>Import Excel</span>
          </button>

          <button
            v-if="store.canEditPage('unit-' + selectedUnitName)"
            @click="store.openModal('revenue', { Unit: selectedUnitName })"
            class="bg-button hover:from-[#149b73] hover:to-[#149b73] text-white px-4 py-2 rounded-xl font-medium text-xs shadow-md transition-all text-center cursor-pointer"
          >
            <i class="fa-solid fa-plus mr-1.5"></i>Input Revenue
            {{ selectedUnitName }}
          </button>
          <!-- MODAL IMPORT EXCEL DATA REVENUE -->
          <ModalImportExcel
            :isOpen="isImportModalOpen"
            schemaKey="REVENUE"
            :existingData="filteredRevenue"
            @close="isImportModalOpen = false"
            @confirm="handleImportRevenueConfirm"
          />
        </div>
      </div>

      <!-- Filters Row -->
      <div
        class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200/50 dark:border-slate-800/80"
      >
        <div>
          <label
            class="block text-[10px] font-semibold text-slate-400 uppercase mb-1"
            >Filter Bulan</label
          >
          <select
            v-model="filterMonth"
            class="w-full glass-input rounded-xl p-2 text-xs dark:bg-slate-800 outline-none"
          >
            <option value="ALL">Semua Bulan (Jan - Des)</option>
            <option
              v-for="(m, idx) in MONTH_NAMES"
              :key="idx"
              :value="String(idx)"
            >
              {{ m }}
            </option>
          </select>
        </div>

        <div>
          <label
            class="block text-[10px] font-semibold text-slate-400 uppercase mb-1"
            >Filter Divisi</label
          >
          <select
            v-model="filterDivisi"
            class="w-full glass-input rounded-xl p-2 text-xs dark:bg-slate-800 outline-none"
          >
            <option value="ALL">Semua Divisi</option>
            <option v-for="div in masterDivisiList" :key="div" :value="div">
              {{ div }}
            </option>
          </select>
        </div>

        <div>
          <label
            class="block text-[10px] font-semibold text-slate-400 uppercase mb-1"
            >Filter Platform</label
          >
          <select
            v-model="filterPlatform"
            class="w-full glass-input rounded-xl p-2 text-xs dark:bg-slate-800 outline-none"
          >
            <option value="ALL">Semua Platform</option>
            <option
              v-for="plat in masterPlatformList"
              :key="plat"
              :value="plat"
            >
              {{ plat }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Summary Metrics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6">
      <div
        class="glass-card p-4 md:p-5 rounded-2xl border-l-4 border-l-emerald-400"
      >
        <p class="text-slate-400 text-[11px] md:text-xs">
          Revenue Unit (Filtered)
        </p>
        <h3
          class="text-base md:text-xl font-bold mt-0.5 text-slate-800 dark:text-slate-100"
        >
          {{ formatRupiah(totalFilteredRevenue) }}
        </h3>
      </div>

      <div
        class="glass-card p-4 md:p-5 rounded-2xl border-l-4 border-l-blue-400"
      >
        <p class="text-slate-400 text-[11px] md:text-xs">Target Unit</p>
        <h3
          class="text-base md:text-xl font-bold mt-0.5 text-slate-800 dark:text-slate-100"
        >
          {{ formatRupiah(unitTarget) }}
        </h3>
      </div>

      <div
        class="glass-card p-4 md:p-5 rounded-2xl border-l-4 border-l-amber-400"
      >
        <p class="text-slate-400 text-[11px] md:text-xs">% Kontribusi Global</p>
        <h3
          class="text-base md:text-xl font-bold mt-0.5 text-slate-800 dark:text-slate-100"
        >
          {{ globalContribution }}%
        </h3>
      </div>
    </div>

    <!-- Monthly & Quarterly Rekap + Trend Chart -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start">
      <!-- 1. Rekap Revenue Per Bulan -->
      <div
        class="lg:col-span-4 glass-card p-4 md:p-5 rounded-2xl flex flex-col justify-start h-full"
      >
        <h3
          class="font-bold text-slate-800 dark:text-slate-100 mb-3 text-xs md:text-sm"
        >
          Rekap Revenue Per Bulan
        </h3>
        <div class="overflow-y-auto max-h-[260px] pr-1">
          <table class="min-w-full text-xs text-left">
            <thead
              class="bg-white/40 dark:bg-slate-800/60 text-slate-400 sticky top-0 backdrop-blur-md"
            >
              <tr>
                <th class="py-2 px-3">Bulan</th>
                <th class="py-2 px-3 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody class="divide-y dark:divide-slate-800/80">
              <tr v-if="monthlyRecap.length === 0">
                <td colspan="2" class="text-center py-3 text-slate-400">
                  Belum ada data.
                </td>
              </tr>
              <tr
                v-else
                v-for="(row, idx) in monthlyRecap"
                :key="idx"
                class="hover:bg-white/20 dark:hover:bg-slate-800/40"
              >
                <td class="py-2 px-3 font-medium">{{ row.bulan }}</td>
                <td class="py-2 px-3 text-right font-semibold text-theme">
                  {{ formatRupiah(row.revenue) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 2. Rekap Triwulan -->
      <div
        class="lg:col-span-3 glass-card p-4 md:p-5 rounded-2xl flex flex-col justify-start h-full"
      >
        <h3
          class="font-bold text-slate-800 dark:text-slate-100 mb-3 text-xs md:text-sm"
        >
          Rekap Triwulan
        </h3>
        <div class="space-y-2">
          <div
            v-for="(q, idx) in quarterlyRecap"
            :key="idx"
            class="p-2.5 bg-white/30 dark:bg-slate-800/40 rounded-xl border border-white/20 dark:border-slate-700/50 flex justify-between items-center"
          >
            <span
              class="text-xs font-bold text-slate-500 dark:text-slate-400"
              >{{ q.quarter }}</span
            >
            <span class="text-xs font-bold text-theme">{{
              formatRupiah(q.revenue)
            }}</span>
          </div>
        </div>
      </div>

      <!-- 3. Chart Trend Revenue Bulanan -->
      <div
        class="lg:col-span-5 glass-card p-4 md:p-5 rounded-2xl flex flex-col justify-start h-full"
      >
        <h3
          class="font-bold text-slate-800 dark:text-slate-100 mb-3 text-xs md:text-sm"
        >
          Grafik Trend Revenue Bulanan
        </h3>
        <div class="chart-container relative h-60 w-full">
          <canvas ref="chartUnitMonthlyTrendRef"></canvas>
        </div>
      </div>
    </div>

    <!-- Management Data Table (Scrollable, Paginated, Bulk Delete) -->
    <div class="glass-card p-4 md:p-6 rounded-2xl space-y-4">
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
      >
        <div class="flex items-center gap-2">
          <h3
            class="font-bold text-slate-800 dark:text-slate-100 text-xs md:text-sm"
          >
            Manajemen Data Revenue Unit {{ selectedUnitName }}
          </h3>
          <span
            v-if="selectedIds.length > 0"
            class="text-[10px] text-purple-600 font-bold bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20"
          >
            {{ selectedIds.length }} Dipilih
          </span>
        </div>

        <div
          class="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end"
        >
          <div v-if="selectedIds.length > 0" class="flex items-center gap-1.5">
            <button
              @click="clearSelection"
              class="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold px-2.5 py-1.5 rounded-xl text-xs cursor-pointer"
            >
              Batal
            </button>
            <button
              v-if="store.canEditPage('unit-' + selectedUnitName)"
              @click="promptBulkDelete"
              class="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-md cursor-pointer"
            >
              <i class="fa-solid fa-trash mr-1"></i>Hapus ({{
                selectedIds.length
              }})
            </button>
          </div>

          <div class="flex items-center gap-1.5">
            <span class="text-xs text-slate-400">Tampilkan:</span>
            <select
              v-model="itemsPerPage"
              @change="currentPage = 1"
              class="glass-input rounded-xl p-1.5 text-xs dark:bg-slate-800 outline-none"
            >
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="ALL">Semua</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Area Scrollable Tabel dengan Sticky Header -->
      <div class="overflow-x-auto max-h-[400px] overflow-y-auto pr-1">
        <table class="min-w-full text-xs text-left">
          <thead
            class="bg-white/80 dark:bg-slate-800/90 text-slate-400 sticky top-0 backdrop-blur-md z-10"
          >
            <tr>
              <th class="py-2.5 px-3 w-8 text-center">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  @change="toggleSelectAll"
                  class="accent-purple-600 rounded cursor-pointer w-3.5 h-3.5"
                />
              </th>
              <th
                @click="sortTable('Tanggal')"
                class="py-2.5 px-3 cursor-pointer select-none"
              >
                Tanggal <i class="fa-solid fa-sort text-[10px] ml-1"></i>
              </th>
              <th
                @click="sortTable('Divisi')"
                class="py-2.5 px-3 cursor-pointer select-none"
              >
                Divisi <i class="fa-solid fa-sort text-[10px] ml-1"></i>
              </th>
              <th
                @click="sortTable('Platform')"
                class="py-2.5 px-3 cursor-pointer select-none"
              >
                Platform <i class="fa-solid fa-sort text-[10px] ml-1"></i>
              </th>
              <th
                @click="sortTable('JumlahPesanan')"
                class="py-2.5 px-3 cursor-pointer select-none"
              >
                Jumlah Pesanan <i class="fa-solid fa-sort text-[10px] ml-1"></i>
              </th>
              <th
                @click="sortTable('Revenue')"
                class="py-2.5 px-3 cursor-pointer select-none"
              >
                Revenue <i class="fa-solid fa-sort text-[10px] ml-1"></i>
              </th>
              <th
                v-if="store.canEditPage('unit-' + selectedUnitName)"
                class="py-2.5 px-4 text-center"
              >
                Aksi
              </th>
            </tr>
          </thead>

          <tbody class="divide-y dark:divide-slate-800/80">
            <tr v-if="store.isLoading">
              <td colspan="7" class="text-center py-4 text-slate-400">
                Memuat data revenue...
              </td>
            </tr>

            <tr v-else-if="paginatedRevenue.length === 0">
              <td colspan="7" class="text-center py-4 text-slate-400">
                Tidak ada data revenue.
              </td>
            </tr>

            <tr
              v-else
              v-for="item in paginatedRevenue"
              :key="getDocId(item)"
              class="hover:bg-white/20 dark:hover:bg-slate-800/40"
              :class="{
                'bg-purple-500/10 dark:bg-purple-500/20': selectedIds.includes(
                  getDocId(item),
                ),
              }"
            >
              <td class="py-2 px-3 text-center" @click.stop>
                <input
                  type="checkbox"
                  :value="getDocId(item)"
                  v-model="selectedIds"
                  class="accent-purple-600 rounded cursor-pointer w-3.5 h-3.5"
                />
              </td>
              <td class="py-2 px-3">
                {{ item.Tanggal ? item.Tanggal.substring(0, 10) : "-" }}
              </td>
              <td class="py-2 px-3 font-medium">{{ item.Divisi || "-" }}</td>
              <td class="py-2 px-3">{{ item.Platform || "-" }}</td>
              <td class="py-2 px-3 font-semibold text-amber-500">
                {{
                  Number(
                    item.JumlahPesanan || item.pesanan || 0,
                  ).toLocaleString("id-ID")
                }}
                Pcs
              </td>
              <td class="py-2 px-3 font-semibold text-theme">
                {{ formatRupiah(item.Revenue) }}
              </td>

              <td
                v-if="store.canEditPage('unit-' + selectedUnitName)"
                class="py-2 px-3 text-center space-x-2 whitespace-nowrap"
              >
                <button
                  @click="store.openModal('revenue', item)"
                  class="text-theme hover:text-theme p-1 cursor-pointer"
                  title="Edit Revenue"
                >
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button
                  @click="promptSingleDelete(getDocId(item))"
                  class="text-rose-500 hover:text-rose-600 cursor-pointer"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer Pagination Kontrol -->
      <div
        v-if="itemsPerPage !== 'ALL' && totalPages > 1"
        class="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2 text-xs text-slate-400"
      >
        <div>
          Menampilkan {{ startItem }} - {{ endItem }} dari
          {{ sortedRevenue.length }} data
        </div>
        <div class="flex items-center gap-1.5">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-2.5 py-1.5 rounded-lg glass-input disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/40 dark:hover:bg-slate-800 cursor-pointer"
          >
            <i class="fa-solid fa-chevron-left text-[10px]"></i>
          </button>

          <span
            class="px-3 py-1.5 rounded-lg bg-[#25eba11a] text-theme font-bold"
          >
            {{ currentPage }} / {{ totalPages }}
          </span>

          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-2.5 py-1.5 rounded-lg glass-input disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/40 dark:hover:bg-slate-800 cursor-pointer"
          >
            <i class="fa-solid fa-chevron-right text-[10px]"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL CUSTOM CONFIRMATION POPUP -->
    <Teleport to="body">
      <div
        v-if="confirmModal.isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
        @click.self="closeConfirmModal"
      >
        <div
          class="glass-card bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl max-w-sm w-full space-y-4 border border-slate-100 dark:border-slate-800"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0"
            >
              <i class="fa-solid fa-triangle-exclamation text-lg"></i>
            </div>
            <div>
              <h4 class="font-bold text-sm text-slate-800 dark:text-slate-100">
                {{ confirmModal.title }}
              </h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {{ confirmModal.message }}
              </p>
            </div>
          </div>

          <div
            class="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800"
          >
            <button
              @click="closeConfirmModal"
              type="button"
              class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 cursor-pointer"
            >
              Batal
            </button>
            <button
              @click="executeConfirmAction"
              type="button"
              :disabled="store.isLoading"
              class="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <i v-if="store.isLoading" class="fa-solid fa-spinner fa-spin"></i>
              <span>Ya, Hapus</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup>
import { ref, computed, watch, reactive, onMounted } from "vue";
import { store } from "../store";
import { api } from "../services/api";
import Chart from "chart.js/auto";
import { exportToExcelBySchema } from "../utils/excelHandler.js";
import ModalImportExcel from "../components/ModalImportExcel.vue";

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const selectedUnitName = computed(() => {
  if (store.currentPage.startsWith("unit-")) {
    return store.currentPage.replace("unit-", "").toUpperCase();
  }
  return "NHP";
});

const masterDivisiList = computed(
  () =>
    store.db?.master?.divisiList || [
      "CS Deal",
      "Zona 1A",
      "Zona 1B",
      "Zona 2",
      "Zona 3",
      "Digital Marketing",
      "Offline",
    ],
);
const masterPlatformList = computed(
  () =>
    store.db?.master?.platformList || [
      "Shopee",
      "TikTok Shop",
      "WhatsApp",
      "Website",
      "Siplah",
      "Toko Ladang",
      "Blibli",
      "Event",
      "Mitra",
      "Kunjungan",
      "Konsinyasi",
    ],
);

const isImportModalOpen = ref(false);

// Ambil daftar revenue dari store
const revenueList = computed(() => store.db?.revenue || []);

// HANDLER EXPORT EXCEL REVENUE
// HANDLER EXPORT EXCEL REVENUE DENGAN FILTER AKTIF
const handleExportRevenue = () => {
  try {
    const dataToExport = filteredRevenue.value;
    if (!dataToExport || dataToExport.length === 0) {
      store.addNotification(
        "Peringatan",
        "Tidak ada data revenue pada filter saat ini untuk diexport",
        "warning",
      );
      return;
    }

    exportToExcelBySchema(
      `Data_Revenue_${selectedUnitName.value}`,
      dataToExport,
      "REVENUE",
    );
    store.addNotification(
      "Berhasil",
      "Data Revenue berhasil diexport ke Excel",
      "success",
    );
  } catch (err) {
    store.addNotification("Gagal", err.message, "warning");
  }
};

// HANDLER EKSEKUSI IMPORT EXCEL REVENUE
const handleImportRevenueConfirm = async ({ itemsToSave, stats }) => {
  store.isLoading = true;
  try {
    // Simpan data massal ke koleksi 'revenues' di Firestore
    const savePromises = itemsToSave.map((item) =>
      api.saveData("Revenue", item),
    );
    await Promise.all(savePromises);

    // Refresh database global
    await store.loadFullDatabase();

    store.addNotification(
      "Import Revenue Selesai",
      `Berhasil ditambahkan: ${stats.added}, Diperbarui: ${stats.updated}, Diabaikan: ${stats.ignored}`,
      "success",
    );
  } catch (err) {
    store.addNotification("Gagal Import", err.message, "warning");
  } finally {
    store.isLoading = false;
  }
};

const filterMonth = ref("ALL");
const filterDivisi = ref("ALL");
const filterPlatform = ref("ALL");

const currentPage = ref(1);
const itemsPerPage = ref("25");
const sortKey = ref("Tanggal");
const sortAsc = ref(false);
const selectedIds = ref([]);

const confirmModal = reactive({
  isOpen: false,
  title: "",
  message: "",
  targetId: null,
  isBulk: false,
});

const chartUnitMonthlyTrendRef = ref(null);
let trendChartInstance = null;

function getDocId(item) {
  return item.id || item.Timestamp;
}

const formatRupiah = (val) => {
  if (!val) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(val);
};

function isDateInFilter(dateStr) {
  if (!dateStr) return false;
  const targetDate = dateStr.substring(0, 10);
  const startDate = store.filterDates.start;
  const endDate = store.filterDates.end;

  if (startDate && targetDate < startDate) return false;
  if (endDate && targetDate > endDate) return false;
  return true;
}

const unitTarget = computed(() => {
  const master = store.db.master || {};
  return Number(master[`Target${selectedUnitName.value}`] || 400000000);
});

const globalTargetTotal = computed(() =>
  Number(store.db.master?.TargetTahunIni || 1000000000),
);

const filteredRevenue = computed(() => {
  const allRevenue = store.db.revenue || [];

  return allRevenue.filter((item) => {
    if (item.Unit !== selectedUnitName.value) return false;
    if (!isDateInFilter(item.Tanggal)) return false;

    if (filterMonth.value !== "ALL" && item.Tanggal) {
      const month = new Date(item.Tanggal).getMonth();
      if (month !== Number(filterMonth.value)) return false;
    }

    if (filterDivisi.value !== "ALL" && item.Divisi !== filterDivisi.value)
      return false;
    if (
      filterPlatform.value !== "ALL" &&
      item.Platform !== filterPlatform.value
    )
      return false;

    return true;
  });
});

const totalFilteredRevenue = computed(() =>
  filteredRevenue.value.reduce(
    (acc, curr) => acc + Number(curr.Revenue || 0),
    0,
  ),
);

const globalContribution = computed(() => {
  if (!globalTargetTotal.value) return "0.0";
  return ((totalFilteredRevenue.value / globalTargetTotal.value) * 100).toFixed(
    1,
  );
});

const monthlyRecap = computed(() => {
  const recapMap = {};
  filteredRevenue.value.forEach((item) => {
    if (!item.Tanggal) return;
    const mIdx = new Date(item.Tanggal).getMonth();
    if (isNaN(mIdx)) return;
    if (!recapMap[mIdx]) recapMap[mIdx] = 0;
    recapMap[mIdx] += Number(item.Revenue || 0);
  });

  return Object.keys(recapMap)
    .map(Number)
    .sort((a, b) => a - b)
    .map((idx) => ({
      bulan: MONTH_NAMES[idx],
      revenue: recapMap[idx],
    }));
});

const quarterlyRecap = computed(() => {
  const qMap = {
    "Q1 (Jan - Mar)": 0,
    "Q2 (Apr - Jun)": 0,
    "Q3 (Jul - Sep)": 0,
    "Q4 (Okt - Des)": 0,
  };
  filteredRevenue.value.forEach((item) => {
    if (!item.Tanggal) return;
    const month = new Date(item.Tanggal).getMonth();
    const rev = Number(item.Revenue || 0);

    if (month >= 0 && month <= 2) qMap["Q1 (Jan - Mar)"] += rev;
    else if (month >= 3 && month <= 5) qMap["Q2 (Apr - Jun)"] += rev;
    else if (month >= 6 && month <= 8) qMap["Q3 (Jul - Sep)"] += rev;
    else if (month >= 9 && month <= 11) qMap["Q4 (Okt - Des)"] += rev;
  });

  return Object.keys(qMap).map((q) => ({ quarter: q, revenue: qMap[q] }));
});

const sortedRevenue = computed(() => {
  return [...filteredRevenue.value].sort((a, b) => {
    let modifier = sortAsc.value ? 1 : -1;
    let aVal = a[sortKey.value];
    let bVal = b[sortKey.value];

    if (["Revenue", "JumlahPesanan"].includes(sortKey.value)) {
      aVal = Number(aVal || 0);
      bVal = Number(bVal || 0);
    } else {
      aVal = String(aVal || "").toLowerCase();
      bVal = String(bVal || "").toLowerCase();
    }

    if (aVal < bVal) return -1 * modifier;
    if (aVal > bVal) return 1 * modifier;
    return 0;
  });
});

const totalPages = computed(() => {
  if (itemsPerPage.value === "ALL") return 1;
  const perPage = Number(itemsPerPage.value);
  return Math.ceil(sortedRevenue.value.length / perPage) || 1;
});

const paginatedRevenue = computed(() => {
  if (itemsPerPage.value === "ALL") return sortedRevenue.value;
  const perPage = Number(itemsPerPage.value);
  const start = (currentPage.value - 1) * perPage;
  return sortedRevenue.value.slice(start, start + perPage);
});

const startItem = computed(() => {
  if (sortedRevenue.value.length === 0) return 0;
  return (currentPage.value - 1) * Number(itemsPerPage.value) + 1;
});

const endItem = computed(() => {
  const end = currentPage.value * Number(itemsPerPage.value);
  return Math.min(end, sortedRevenue.value.length);
});

const isAllSelected = computed(() => {
  if (paginatedRevenue.value.length === 0) return false;
  return paginatedRevenue.value.every((item) =>
    selectedIds.value.includes(getDocId(item)),
  );
});

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    const pageIds = paginatedRevenue.value.map((item) => getDocId(item));
    selectedIds.value = selectedIds.value.filter((id) => !pageIds.includes(id));
  } else {
    const pageIds = paginatedRevenue.value.map((item) => getDocId(item));
    const newSelected = new Set([...selectedIds.value, ...pageIds]);
    selectedIds.value = Array.from(newSelected);
  }
};

const clearSelection = () => {
  selectedIds.value = [];
};

watch([selectedUnitName, filterMonth, filterDivisi, filterPlatform], () => {
  currentPage.value = 1;
  clearSelection();
});

const sortTable = (key) => {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortKey.value = key;
    sortAsc.value = true;
  }
};

const promptSingleDelete = (docId) => {
  confirmModal.isOpen = true;
  confirmModal.title = "Hapus Data Revenue";
  confirmModal.message = "Apakah Anda yakin ingin menghapus data revenue ini?";
  confirmModal.targetId = docId;
  confirmModal.isBulk = false;
};

const promptBulkDelete = () => {
  if (selectedIds.value.length === 0) return;
  confirmModal.isOpen = true;
  confirmModal.title = "Hapus Banyak Data Revenue";
  confirmModal.message = `Apakah Anda yakin ingin menghapus ${selectedIds.value.length} data revenue terpilih secara permanen?`;
  confirmModal.targetId = null;
  confirmModal.isBulk = true;
};

const closeConfirmModal = () => {
  confirmModal.isOpen = false;
  confirmModal.targetId = null;
  confirmModal.isBulk = false;
};

const executeConfirmAction = async () => {
  store.isLoading = true;
  try {
    if (confirmModal.isBulk) {
      for (const docId of selectedIds.value) {
        await api.deleteData("revenues", docId);
      }
      clearSelection();
    } else if (confirmModal.targetId) {
      const res = await api.deleteData("revenues", confirmModal.targetId);
      if (res.success) {
        selectedIds.value = selectedIds.value.filter(
          (id) => id !== confirmModal.targetId,
        );
      }
    }
    await store.loadFullDatabase();
  } catch (err) {
    console.error("Gagal menghapus revenue:", err);
  } finally {
    store.isLoading = false;
    closeConfirmModal();
  }
};

const initCharts = () => {
  if (!chartUnitMonthlyTrendRef.value) return;
  if (trendChartInstance) trendChartInstance.destroy();

  trendChartInstance = new Chart(chartUnitMonthlyTrendRef.value, {
    type: "line",
    data: {
      labels: monthlyRecap.value.map((m) => m.bulan.substring(0, 3)),
      datasets: [
        {
          label: "Revenue",
          data: monthlyRecap.value.map((m) => m.revenue),
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          fill: true,
          tension: 0.3,
          pointRadius: 4,
        },
      ],
    },
    options: { responsive: true, maintainAspectRatio: false },
  });
};

watch(
  [filteredRevenue, selectedUnitName],
  () => {
    initCharts();
  },
  { deep: true },
);
onMounted(() => {
  initCharts();
});
</script>
