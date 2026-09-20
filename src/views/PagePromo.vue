<!-- src/views/PagePromo.vue -->
<template>
  <section id="page-promo" class="page-section space-y-4 md:space-y-6">
    <!-- Header Section -->
    <div
      class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
    >
      <div>
        <p class="text-slate-500 dark:text-slate-400 text-xs md:text-sm">
          Rekapitulasi dan Tren Pengeluaran Promosi Tiap Unit.
        </p>
      </div>
      <button
        v-if="store.canEditPage('promo')"
        @click="store.openModal('promo')"
        class="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-4 py-2.5 rounded-xl font-medium text-xs shadow-md transition-all w-full sm:w-auto text-center cursor-pointer"
      >
        <i class="fa-solid fa-plus mr-1.5"></i>Input Biaya Promosi
      </button>
    </div>

    <!-- 1. Metric Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
      <div class="glass-card p-4 rounded-2xl flex items-center justify-between">
        <div>
          <p class="text-xs text-slate-400 font-medium">Total Biaya Promosi</p>
          <h3 class="text-base md:text-lg font-bold text-rose-500 mt-0.5">
            {{ formatRupiah(totalBiayaPromosi) }}
          </h3>
        </div>
        <div
          class="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold"
        >
          <i class="fa-solid fa-bullhorn text-sm"></i>
        </div>
      </div>

      <div class="glass-card p-4 rounded-2xl flex items-center justify-between">
        <div>
          <p class="text-xs text-slate-400 font-medium">Rata-rata / Bulan</p>
          <h3
            class="text-base md:text-lg font-bold text-slate-700 dark:text-slate-200 mt-0.5"
          >
            {{ formatRupiah(rataRataBulan) }}
          </h3>
        </div>
        <div
          class="w-10 h-10 rounded-xl bg-[#25eba11a] text-[#1caa80] flex items-center justify-center font-bold"
        >
          <i class="fa-solid fa-calculator text-sm"></i>
        </div>
      </div>

      <div class="glass-card p-4 rounded-2xl flex items-center justify-between">
        <div>
          <p class="text-xs text-slate-400 font-medium">
            Pengeluaran Tertinggi
          </p>
          <h3 class="text-base md:text-lg font-bold text-amber-500 mt-0.5">
            {{
              maxMonth && maxMonth.bulan
                ? `${maxMonth.bulan} (${formatRupiah(maxMonth.total)})`
                : "-"
            }}
          </h3>
        </div>
        <div
          class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold"
        >
          <i class="fa-solid fa-chart-line text-sm"></i>
        </div>
      </div>
    </div>

    <!-- 2. Management Data Table dengan Bulk Action & Sorting -->
    <div class="glass-card rounded-2xl p-4 md:p-6 space-y-4">
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
      >
        <div class="flex items-center gap-2">
          <h3
            class="font-bold text-slate-800 dark:text-slate-100 text-xs md:text-sm"
          >
            Manajemen Data Biaya Promosi
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
              v-if="store.canEditPage('promo')"
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

      <!-- Area Scrollable Tabel -->
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
                class="py-2.5 px-4 cursor-pointer select-none"
              >
                Tanggal <i class="fa-solid fa-sort text-[10px] ml-1"></i>
              </th>
              <th
                @click="sortTable('Unit')"
                class="py-2.5 px-4 cursor-pointer select-none"
              >
                Unit Usaha <i class="fa-solid fa-sort text-[10px] ml-1"></i>
              </th>
              <th
                @click="sortTable('BiayaPromosi')"
                class="py-2.5 px-4 cursor-pointer select-none"
              >
                Biaya Promosi <i class="fa-solid fa-sort text-[10px] ml-1"></i>
              </th>
              <th
                v-if="store.canEditPage('promo')"
                class="py-2.5 px-4 text-center"
              >
                Aksi
              </th>
            </tr>
          </thead>

          <tbody class="divide-y dark:divide-slate-800/80">
            <tr v-if="store.isLoading">
              <td colspan="5" class="text-center py-4 text-slate-400">
                Memuat data promosi...
              </td>
            </tr>

            <tr v-else-if="paginatedPromo.length === 0">
              <td colspan="5" class="text-center py-4 text-slate-400">
                Tidak ada data biaya promosi.
              </td>
            </tr>

            <tr
              v-else
              v-for="item in paginatedPromo"
              :key="getDocId(item)"
              class="hover:bg-white/20 dark:hover:bg-slate-800/40"
              :class="{
                'bg-purple-500/10 dark:bg-purple-500/20': selectedIds.includes(
                  getDocId(item),
                ),
              }"
            >
              <td class="py-3 px-3 text-center" @click.stop>
                <input
                  type="checkbox"
                  :value="getDocId(item)"
                  v-model="selectedIds"
                  class="accent-purple-600 rounded cursor-pointer w-3.5 h-3.5"
                />
              </td>
              <td class="py-3 px-4">
                {{ item.Tanggal ? String(item.Tanggal).substring(0, 10) : "-" }}
              </td>
              <td class="py-3 px-4 font-medium">{{ item.Unit || "-" }}</td>
              <td class="py-3 px-4 font-semibold text-rose-500">
                {{ formatRupiah(item.BiayaPromosi) }}
              </td>
              <td
                v-if="store.canEditPage('promo')"
                class="py-3 px-4 text-center space-x-2 whitespace-nowrap"
              >
                <button
                  @click="store.openModal('promo', item)"
                  class="text-[#1caa80] hover:text-[#1caa80] p-1 cursor-pointer"
                  title="Edit Promo"
                >
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button
                  @click="promptSingleDelete(getDocId(item))"
                  class="text-rose-500 hover:text-rose-600 p-1 cursor-pointer"
                  title="Hapus Promo"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer Navigasi Pagination -->
      <div
        v-if="itemsPerPage !== 'ALL' && totalPages > 1"
        class="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2 text-xs text-slate-400"
      >
        <div>
          Menampilkan {{ startItem }} - {{ endItem }} dari
          {{ sortedPromo.length }} data
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
            class="px-3 py-1.5 rounded-lg bg-[#25eba11a] text-[#1caa80] font-bold"
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
import { ref, computed, reactive, watch } from "vue";
import { store } from "../store";
import { api } from "../services/api";

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

function getDocId(item) {
  return item.id || item.Timestamp;
}

const formatRupiah = (number) => {
  if (!number) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number);
};

function isDateInFilter(dateStr) {
  if (!dateStr) return false;
  const targetDate = String(dateStr).substring(0, 10);
  const startDate = store.filterDates?.start;
  const endDate = store.filterDates?.end;

  if (startDate && targetDate < startDate) return false;
  if (endDate && targetDate > endDate) return false;
  return true;
}

const rawPromo = computed(() => {
  const list = store.db.promo || [];
  return list.filter((p) => isDateInFilter(p.Tanggal));
});

// Rekap Bulanan
const monthlyRecap = computed(() => {
  const recapMap = {};
  rawPromo.value.forEach((item) => {
    if (!item.Tanggal) return;
    const dateObj = new Date(item.Tanggal);
    const monthIdx = dateObj.getMonth();
    if (isNaN(monthIdx)) return;

    if (!recapMap[monthIdx]) recapMap[monthIdx] = 0;
    recapMap[monthIdx] += Number(item.BiayaPromosi || 0);
  });

  return Object.keys(recapMap)
    .map(Number)
    .sort((a, b) => a - b)
    .map((idx) => ({
      monthIndex: idx,
      bulan: MONTH_NAMES[idx],
      total: recapMap[idx],
    }));
});

const totalBiayaPromosi = computed(() =>
  rawPromo.value.reduce((s, p) => s + Number(p.BiayaPromosi || 0), 0),
);

const rataRataBulan = computed(() => {
  if (monthlyRecap.value.length === 0) return 0;
  return totalBiayaPromosi.value / monthlyRecap.value.length;
});

// PERBAIKAN: Safe-guard untuk maxMonth agar tidak undefined saat data kosong
const maxMonth = computed(() => {
  if (!monthlyRecap.value || monthlyRecap.value.length === 0) {
    return { bulan: "", total: 0 };
  }
  return monthlyRecap.value.reduce(
    (max, cur) => (cur.total > max.total ? cur : max),
    monthlyRecap.value[0] || { bulan: "", total: 0 },
  );
});

const sortedPromo = computed(() => {
  return [...rawPromo.value].sort((a, b) => {
    let modifier = sortAsc.value ? 1 : -1;
    let aVal = a[sortKey.value];
    let bVal = b[sortKey.value];

    if (sortKey.value === "BiayaPromosi") {
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
  return Math.ceil(sortedPromo.value.length / perPage) || 1;
});

const paginatedPromo = computed(() => {
  if (itemsPerPage.value === "ALL") return sortedPromo.value;
  const perPage = Number(itemsPerPage.value);
  const start = (currentPage.value - 1) * perPage;
  return sortedPromo.value.slice(start, start + perPage);
});

const startItem = computed(() => {
  if (sortedPromo.value.length === 0) return 0;
  return (currentPage.value - 1) * Number(itemsPerPage.value) + 1;
});

const endItem = computed(() => {
  const end = currentPage.value * Number(itemsPerPage.value);
  return Math.min(end, sortedPromo.value.length);
});

const isAllSelected = computed(() => {
  if (paginatedPromo.value.length === 0) return false;
  return paginatedPromo.value.every((item) =>
    selectedIds.value.includes(getDocId(item)),
  );
});

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    const pageIds = paginatedPromo.value.map((item) => getDocId(item));
    selectedIds.value = selectedIds.value.filter((id) => !pageIds.includes(id));
  } else {
    const pageIds = paginatedPromo.value.map((item) => getDocId(item));
    const newSelected = new Set([...selectedIds.value, ...pageIds]);
    selectedIds.value = Array.from(newSelected);
  }
};

const clearSelection = () => {
  selectedIds.value = [];
};

watch(
  () => store.filterDates,
  () => {
    currentPage.value = 1;
    clearSelection();
  },
  { deep: true },
);

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
  confirmModal.title = "Hapus Biaya Promosi";
  confirmModal.message =
    "Apakah Anda yakin ingin menghapus data biaya promosi ini?";
  confirmModal.targetId = docId;
  confirmModal.isBulk = false;
};

const promptBulkDelete = () => {
  if (selectedIds.value.length === 0) return;
  confirmModal.isOpen = true;
  confirmModal.title = "Hapus Banyak Data Promosi";
  confirmModal.message = `Apakah Anda yakin ingin menghapus ${selectedIds.value.length} data biaya promosi terpilih?`;
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
        await api.deleteData("promosi", docId);
      }
      clearSelection();
    } else if (confirmModal.targetId) {
      const res = await api.deleteData("promosi", confirmModal.targetId);
      if (res.success) {
        selectedIds.value = selectedIds.value.filter(
          (id) => id !== confirmModal.targetId,
        );
      }
    }
    await store.loadFullDatabase();
  } catch (err) {
    console.error("Gagal menghapus promosi:", err);
  } finally {
    store.isLoading = false;
    closeConfirmModal();
  }
};
</script>
