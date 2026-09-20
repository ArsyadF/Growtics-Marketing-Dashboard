<!-- src/views/PageLeads.vue -->
<template>
  <section id="page-leads" class="page-section space-y-4 md:space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row justify-between items-center gap-3">
      <div>
        <p class="text-slate-500 dark:text-slate-400 text-xs md:text-sm">
          Progres Campaign, Database Leads, Follow Up, & Pesanan.
        </p>
      </div>
      <button
        v-if="store.canEditPage('leads')"
        @click="store.openModal('leads')"
        class="bg-button text-white px-4 py-2.5 rounded-xl font-medium text-xs shadow-md hover:from-[#149b73] hover:to-[#149b73] w-full sm:w-auto cursor-pointer"
      >
        <i class="fa-solid fa-plus mr-1.5"></i>Input Leads & Campaign
      </button>
    </div>

    <!-- 1. Metric Summary Boxes -->
    <div class="grid grid-cols-2 sm:grid-cols-5 gap-2.5 md:gap-4">
      <div class="glass-card p-3 rounded-xl text-center">
        <p class="text-xs text-slate-400">Total Campaign</p>
        <h3 class="text-lg font-bold mt-0.5">
          {{ sumCamp.toLocaleString("id-ID") }}
        </h3>
      </div>
      <div class="glass-card p-3 rounded-xl text-center">
        <p class="text-xs text-slate-400">Database Leads</p>
        <h3 class="text-lg font-bold text-theme mt-0.5">
          {{ sumLeads.toLocaleString("id-ID") }}
        </h3>
      </div>
      <div class="glass-card p-3 rounded-xl text-center">
        <p class="text-xs text-slate-400">Follow Up</p>
        <h3 class="text-lg font-bold text-amber-500 mt-0.5">
          {{ sumFu.toLocaleString("id-ID") }}
        </h3>
      </div>
      <div class="glass-card p-3 rounded-xl text-center">
        <p class="text-xs text-slate-400">Jumlah Pesanan</p>
        <h3 class="text-lg font-bold text-emerald-500 mt-0.5">
          {{ sumOrder.toLocaleString("id-ID") }}
        </h3>
      </div>
      <div
        class="glass-card p-3 rounded-xl text-center col-span-2 sm:col-span-1"
      >
        <p class="text-xs text-slate-400">% Konversi</p>
        <h3 class="text-lg font-bold text-teal-500 mt-0.5">
          {{ pctOrderPerCamp }}%
        </h3>
      </div>
    </div>

    <!-- 2. Layout 3 Kolom Sejajar -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start">
      <!-- Kolom 1: Rekap Leads Per Bulan -->
      <div
        class="lg:col-span-4 glass-card p-4 md:p-5 rounded-2xl flex flex-col justify-start h-full"
      >
        <div>
          <h3
            class="font-bold text-slate-800 dark:text-slate-100 mb-3 text-xs md:text-sm"
          >
            Rekap Leads Per Bulan
          </h3>
          <div class="overflow-y-auto max-h-[260px] pr-1">
            <table class="min-w-full text-xs text-left">
              <thead
                class="bg-white/40 dark:bg-slate-800/60 text-slate-400 sticky top-0 backdrop-blur-md"
              >
                <tr>
                  <th class="py-2 px-3">Bulan</th>
                  <th class="py-2 px-3 text-right">Database Leads</th>
                </tr>
              </thead>
              <tbody class="divide-y dark:divide-slate-800/80">
                <tr v-if="monthlyRecap.length === 0">
                  <td colspan="2" class="text-center py-4 text-slate-400">
                    Belum ada data bulanan.
                  </td>
                </tr>
                <tr
                  v-else
                  v-for="(row, idx) in monthlyRecap"
                  :key="idx"
                  class="hover:bg-white/20 dark:hover:bg-slate-800/40"
                >
                  <td class="py-2.5 px-3 font-medium">{{ row.bulan }}</td>
                  <td class="py-2.5 px-3 text-right font-semibold text-theme">
                    {{ row.total.toLocaleString("id-ID") }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Kolom 2: Rekap Leads Per Triwulan -->
      <div
        class="lg:col-span-4 glass-card p-4 md:p-5 rounded-2xl flex flex-col justify-start h-full"
      >
        <div>
          <h3
            class="font-bold text-slate-800 dark:text-slate-100 mb-3 text-xs md:text-sm"
          >
            Rekap Triwulan
          </h3>
          <div class="grid grid-cols-1 gap-2.5">
            <div
              v-for="(q, idx) in quarterlyRecap"
              :key="idx"
              class="p-3 bg-white/30 dark:bg-slate-800/40 rounded-xl border border-white/20 dark:border-slate-700/50 flex justify-between items-center"
            >
              <p class="text-xs font-bold text-slate-500 dark:text-slate-400">
                {{ q.quarter }}
              </p>
              <p class="text-xs md:text-sm font-bold text-emerald-600">
                {{ q.total.toLocaleString("id-ID") }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Kolom 3: Grafik Trend Leads Bulanan -->
      <div
        class="lg:col-span-4 glass-card p-4 md:p-5 rounded-2xl flex flex-col justify-start h-full"
      >
        <div>
          <div class="flex justify-between items-center mb-3">
            <h3
              class="font-bold text-slate-800 dark:text-slate-100 text-xs md:text-sm flex items-center gap-1.5"
            >
              <i class="fa-solid fa-chart-line text-emerald-600"></i>Grafik
              Trend Leads Bulanan
            </h3>
            <span class="text-[10px] text-slate-400 font-medium"
              >Tahun {{ new Date().getFullYear() }}</span
            >
          </div>

          <div
            v-if="monthlyRecap.length === 0"
            class="h-52 flex items-center justify-center text-xs text-slate-400"
          >
            Belum ada data grafik.
          </div>

          <div v-else class="relative h-52 w-full pt-4">
            <div
              class="absolute inset-x-0 top-6 bottom-8 flex flex-col justify-between pointer-events-none"
            >
              <div
                class="border-b border-dashed border-slate-200 dark:border-slate-700/50"
              ></div>
              <div
                class="border-b border-dashed border-slate-200 dark:border-slate-700/50"
              ></div>
              <div
                class="border-b border-dashed border-slate-200 dark:border-slate-700/50"
              ></div>
            </div>

            <svg
              class="w-full h-36 overflow-visible relative z-0"
              viewBox="0 0 300 100"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#1caa80" stop-opacity="0.30" />
                  <stop offset="100%" stop-color="#1caa80" stop-opacity="0.0" />
                </linearGradient>
              </defs>
              <path :d="areaPath" fill="url(#blueGradient)" />
              <path
                :d="linePath"
                fill="none"
                stroke="#1caa80"
                stroke-width="3.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                vector-effect="non-scaling-stroke"
              />
            </svg>

            <div class="absolute inset-x-0 top-4 h-36 z-10 pointer-events-none">
              <div
                v-for="(pt, idx) in chartPointsHTML"
                :key="idx"
                class="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group cursor-pointer"
                :style="{ left: `${pt.xPct}%`, top: `${pt.yPct}%` }"
              >
                <div
                  class="w-4 h-4 rounded-full bg-white border-2 border-[#1caa80] shadow-md transition-transform duration-200 group-hover:scale-125 group-hover:bg-emerald-500"
                ></div>
                <div
                  class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[9px] font-bold py-1 px-2 rounded-md shadow-lg whitespace-nowrap pointer-events-none"
                >
                  {{ pt.val.toLocaleString("id-ID") }}
                </div>
              </div>
            </div>

            <div
              class="flex justify-between items-center text-[10px] text-slate-400 font-medium mt-2 px-1"
            >
              <span
                v-for="(m, idx) in monthlyRecap"
                :key="idx"
                class="text-center truncate w-full"
              >
                {{ m.bulan.substring(0, 3) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Management Data Table dengan Bulk Action & Sorting -->
    <div class="glass-card p-4 md:p-6 rounded-2xl space-y-4">
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
      >
        <div class="flex items-center gap-2">
          <h3
            class="font-bold text-slate-800 dark:text-slate-100 text-xs md:text-sm"
          >
            Manajemen Data Leads
          </h3>
          <span
            v-if="selectedIds.length > 0"
            class="text-[10px] text-purple-600 font-bold bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20"
          >
            {{ selectedIds.length }} Dipilih
          </span>
        </div>

        <!-- Controls: Bulk Action & Page Size -->
        <div
          class="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end"
        >
          <div v-if="selectedIds.length > 0" class="flex items-center gap-1.5">
            <button
              @click="clearSelection"
              class="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold px-2.5 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1 cursor-pointer"
            >
              <i class="fa-solid fa-xmark"></i>
              <span>Batal</span>
            </button>
            <button
              v-if="store.canEditPage('leads')"
              @click="promptBulkDelete"
              class="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-1 cursor-pointer"
            >
              <i class="fa-solid fa-trash"></i>
              <span>Hapus ({{ selectedIds.length }})</span>
            </button>
          </div>

          <div class="flex items-center gap-1.5">
            <span class="text-xs text-slate-400">Tampilkan:</span>
            <select
              v-model="limit"
              @change="currentPage = 1"
              class="glass-input rounded-xl p-1.5 text-xs outline-none dark:bg-slate-800"
            >
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="ALL">Semua</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Area Scrollable Tabel dengan Sticky Header & Sorting -->
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
                  title="Pilih Semua di Halaman Ini"
                />
              </th>
              <th
                @click="sortTable('Tanggal')"
                class="py-2.5 px-3 cursor-pointer select-none"
              >
                Tanggal
                <i
                  class="fa-solid text-[10px] ml-1"
                  :class="
                    sortKey === 'Tanggal'
                      ? sortAsc
                        ? 'fa-sort-up text-purple-600'
                        : 'fa-sort-down text-purple-600'
                      : 'fa-sort text-slate-300'
                  "
                ></i>
              </th>
              <th
                @click="sortTable('Unit')"
                class="py-2.5 px-3 cursor-pointer select-none"
              >
                Unit
                <i
                  class="fa-solid text-[10px] ml-1"
                  :class="
                    sortKey === 'Unit'
                      ? sortAsc
                        ? 'fa-sort-up text-purple-600'
                        : 'fa-sort-down text-purple-600'
                      : 'fa-sort text-slate-300'
                  "
                ></i>
              </th>
              <th
                @click="sortTable('Campaign')"
                class="py-2.5 px-3 cursor-pointer select-none"
              >
                Campaign
                <i
                  class="fa-solid text-[10px] ml-1"
                  :class="
                    sortKey === 'Campaign'
                      ? sortAsc
                        ? 'fa-sort-up text-purple-600'
                        : 'fa-sort-down text-purple-600'
                      : 'fa-sort text-slate-300'
                  "
                ></i>
              </th>
              <th
                @click="sortTable('DatabaseLeads')"
                class="py-2.5 px-3 cursor-pointer select-none"
              >
                Leads
                <i
                  class="fa-solid text-[10px] ml-1"
                  :class="
                    sortKey === 'DatabaseLeads'
                      ? sortAsc
                        ? 'fa-sort-up text-purple-600'
                        : 'fa-sort-down text-purple-600'
                      : 'fa-sort text-slate-300'
                  "
                ></i>
              </th>
              <th
                @click="sortTable('FollowUp')"
                class="py-2.5 px-3 cursor-pointer select-none"
              >
                FU
                <i
                  class="fa-solid text-[10px] ml-1"
                  :class="
                    sortKey === 'FollowUp'
                      ? sortAsc
                        ? 'fa-sort-up text-purple-600'
                        : 'fa-sort-down text-purple-600'
                      : 'fa-sort text-slate-300'
                  "
                ></i>
              </th>
              <th
                @click="sortTable('Pesanan')"
                class="py-2.5 px-3 cursor-pointer select-none"
              >
                Pesanan
                <i
                  class="fa-solid text-[10px] ml-1"
                  :class="
                    sortKey === 'Pesanan'
                      ? sortAsc
                        ? 'fa-sort-up text-purple-600'
                        : 'fa-sort-down text-purple-600'
                      : 'fa-sort text-slate-300'
                  "
                ></i>
              </th>
              <th
                v-if="store.canEditPage('leads')"
                class="py-2.5 px-3 text-center"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="divide-y dark:divide-slate-800/80">
            <tr v-if="store.isLoading">
              <td colspan="8" class="text-center py-4 text-slate-400">
                Memuat data leads...
              </td>
            </tr>
            <tr v-else-if="paginatedLeads.length === 0">
              <td colspan="8" class="text-center py-4 text-slate-400">
                Tidak ada data leads terfilter.
              </td>
            </tr>
            <tr
              v-else
              v-for="l in paginatedLeads"
              :key="getLeadId(l)"
              class="hover:bg-white/20 dark:hover:bg-slate-800/40"
              :class="{
                'bg-purple-500/10 dark:bg-purple-500/20': selectedIds.includes(
                  getLeadId(l),
                ),
              }"
            >
              <td class="py-2 px-3 text-center" @click.stop>
                <input
                  type="checkbox"
                  :value="getLeadId(l)"
                  v-model="selectedIds"
                  class="accent-purple-600 rounded cursor-pointer w-3.5 h-3.5"
                />
              </td>
              <td class="py-2 px-3">
                {{ l.Tanggal ? String(l.Tanggal).substring(0, 10) : "-" }}
              </td>
              <td class="py-2 px-3 font-bold">{{ l.Unit || "-" }}</td>
              <td class="py-2 px-3">
                {{ (Number(l.Campaign) || 0).toLocaleString("id-ID") }}
              </td>
              <td class="py-2 px-3 text-theme font-semibold">
                {{ (Number(l.DatabaseLeads) || 0).toLocaleString("id-ID") }}
              </td>
              <td class="py-2 px-3 text-amber-500 font-semibold">
                {{ (Number(l.FollowUp) || 0).toLocaleString("id-ID") }}
              </td>
              <td class="py-2 px-3 text-emerald-500 font-semibold">
                {{ (Number(l.Pesanan) || 0).toLocaleString("id-ID") }}
              </td>
              <td
                v-if="store.canEditPage('leads')"
                class="py-2 px-3 text-center whitespace-nowrap"
              >
                <button
                  @click="store.openModal('leads', l)"
                  class="text-theme hover:text-theme p-1 mr-1 cursor-pointer"
                  title="Edit Leads"
                >
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button
                  @click="promptSingleDelete(getLeadId(l))"
                  class="text-rose-500 hover:text-rose-600 p-1 cursor-pointer"
                  title="Hapus Leads"
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
        v-if="limit !== 'ALL' && totalPages > 1"
        class="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2 text-xs text-slate-400"
      >
        <div>
          Menampilkan {{ startItem }} - {{ endItem }} dari
          {{ filteredLeads.length }} data
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

    <!-- MODAL CUSTOM POPUP CONFIRMATION (GANTI ALERT/DEFAULT POPUP) -->
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
import { computed, ref, reactive, watch } from "vue";
import { store } from "../store";
import { api } from "../services/api";

const currentPage = ref(1);
const limit = ref("25");

// State untuk Sorting
const sortKey = ref("Tanggal");
const sortAsc = ref(false);

// State untuk Bulk Select
const selectedIds = ref([]);

// State Custom Modal Popup Konfirmasi (Bukan Alert)
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

function getLeadId(lead) {
  return lead.id || lead.Timestamp;
}

function isDateInFilter(dateStr) {
  if (!dateStr) return false;
  const targetDate = String(dateStr).substring(0, 10);
  const startDate = store.filterDates?.start;
  const endDate = store.filterDates?.end;

  if (startDate && targetDate < startDate) return false;
  if (endDate && targetDate > endDate) return false;
  return true;
}

const filteredLeads = computed(() => {
  const list = store.db.leads || [];
  return list.filter((l) => isDateInFilter(l.Tanggal));
});

// Computed Data terurut
const sortedLeads = computed(() => {
  return [...filteredLeads.value].sort((a, b) => {
    let modifier = sortAsc.value ? 1 : -1;
    let aVal = a[sortKey.value];
    let bVal = b[sortKey.value];

    if (
      ["Campaign", "DatabaseLeads", "FollowUp", "Pesanan"].includes(
        sortKey.value,
      )
    ) {
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

const sortTable = (key) => {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortKey.value = key;
    sortAsc.value = true;
  }
};

// Summary metrics
const sumCamp = computed(() =>
  filteredLeads.value.reduce((s, l) => s + Number(l.Campaign || 0), 0),
);
const sumLeads = computed(() =>
  filteredLeads.value.reduce((s, l) => s + Number(l.DatabaseLeads || 0), 0),
);
const sumFu = computed(() =>
  filteredLeads.value.reduce((s, l) => s + Number(l.FollowUp || 0), 0),
);
const sumOrder = computed(() =>
  filteredLeads.value.reduce((s, l) => s + Number(l.Pesanan || 0), 0),
);
const pctOrderPerCamp = computed(() =>
  sumCamp.value > 0 ? ((sumOrder.value / sumCamp.value) * 100).toFixed(1) : "0",
);

// Pagination Calculations
const totalPages = computed(() => {
  if (limit.value === "ALL") return 1;
  const perPage = Number(limit.value);
  return Math.ceil(sortedLeads.value.length / perPage) || 1;
});

const paginatedLeads = computed(() => {
  if (limit.value === "ALL") return sortedLeads.value;
  const perPage = Number(limit.value);
  const start = (currentPage.value - 1) * perPage;
  return sortedLeads.value.slice(start, start + perPage);
});

const startItem = computed(() => {
  if (sortedLeads.value.length === 0) return 0;
  return (currentPage.value - 1) * Number(limit.value) + 1;
});

const endItem = computed(() => {
  const end = currentPage.value * Number(limit.value);
  return Math.min(end, sortedLeads.value.length);
});

// Checkbox Select All / Deselect
const isAllSelected = computed(() => {
  if (paginatedLeads.value.length === 0) return false;
  return paginatedLeads.value.every((l) =>
    selectedIds.value.includes(getLeadId(l)),
  );
});

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    const pageIds = paginatedLeads.value.map((l) => getLeadId(l));
    selectedIds.value = selectedIds.value.filter((id) => !pageIds.includes(id));
  } else {
    const pageIds = paginatedLeads.value.map((l) => getLeadId(l));
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

// Rekap Bulanan
const monthlyRecap = computed(() => {
  const recapMap = {};
  filteredLeads.value.forEach((item) => {
    if (!item.Tanggal) return;
    const dateObj = new Date(item.Tanggal);
    const monthIdx = dateObj.getMonth();
    if (isNaN(monthIdx)) return;

    if (!recapMap[monthIdx]) recapMap[monthIdx] = 0;
    recapMap[monthIdx] += Number(item.DatabaseLeads || 0);
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

// Rekap Triwulan
const quarterlyRecap = computed(() => {
  const qMap = {
    "Q1 (Jan - Mar)": 0,
    "Q2 (Apr - Jun)": 0,
    "Q3 (Jul - Sep)": 0,
    "Q4 (Okt - Des)": 0,
  };
  filteredLeads.value.forEach((item) => {
    if (!item.Tanggal) return;
    const month = new Date(item.Tanggal).getMonth();
    const total = Number(item.DatabaseLeads || 0);

    if (month >= 0 && month <= 2) qMap["Q1 (Jan - Mar)"] += total;
    else if (month >= 3 && month <= 5) qMap["Q2 (Apr - Jun)"] += total;
    else if (month >= 6 && month <= 8) qMap["Q3 (Jul - Sep)"] += total;
    else if (month >= 9 && month <= 11) qMap["Q4 (Okt - Des)"] += total;
  });

  return Object.keys(qMap).map((q) => ({ quarter: q, total: qMap[q] }));
});

// Perhitungan Grafik
const chartPointsHTML = computed(() => {
  const data = monthlyRecap.value;
  if (data.length === 0) return [];

  const maxVal = Math.max(...data.map((d) => d.total), 1);
  const stepXPct = data.length > 1 ? 100 / (data.length - 1) : 50;

  return data.map((d, i) => {
    const xPct = data.length === 1 ? 50 : i * stepXPct;
    const yPct = 85 - (d.total / maxVal) * 70;
    return { xPct, yPct, val: d.total };
  });
});

const linePath = computed(() => {
  const points = chartPointsHTML.value;
  if (points.length === 0) return "";
  const width = 300;
  const height = 100;

  return points.reduce((acc, p, i) => {
    const x = (p.xPct / 100) * width;
    const y = (p.yPct / 100) * height;
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, "");
});

const areaPath = computed(() => {
  const points = chartPointsHTML.value;
  if (points.length === 0) return "";
  const lastX = (points[points.length - 1].xPct / 100) * 300;
  const firstX = (points[0].xPct / 100) * 300;
  return `${linePath.value} L ${lastX} 100 L ${firstX} 100 Z`;
});

// FUNGSI UNTUK MEMBUKA CUSTOM MODAL POPUP (TANPA ALERT)
const promptSingleDelete = (docId) => {
  confirmModal.isOpen = true;
  confirmModal.title = "Hapus Data Leads";
  confirmModal.message = "Apakah Anda yakin ingin menghapus data leads ini?";
  confirmModal.targetId = docId;
  confirmModal.isBulk = false;
};

const promptBulkDelete = () => {
  if (selectedIds.value.length === 0) return;
  confirmModal.isOpen = true;
  confirmModal.title = "Hapus Banyak Data Leads";
  confirmModal.message = `Apakah Anda yakin ingin menghapus ${selectedIds.value.length} data leads terpilih secara permanen?`;
  confirmModal.targetId = null;
  confirmModal.isBulk = true;
};

const closeConfirmModal = () => {
  confirmModal.isOpen = false;
  confirmModal.targetId = null;
  confirmModal.isBulk = false;
};

// EKSEKUSI PENGHAPUSAN SETELAH DIKONFIRMASI DI MODAL
const executeConfirmAction = async () => {
  store.isLoading = true;
  try {
    if (confirmModal.isBulk) {
      for (const docId of selectedIds.value) {
        await api.deleteData("leads", docId);
      }
      clearSelection();
    } else if (confirmModal.targetId) {
      const res = await api.deleteData("leads", confirmModal.targetId);
      if (res.success) {
        selectedIds.value = selectedIds.value.filter(
          (id) => id !== confirmModal.targetId,
        );
      }
    }
    await store.loadFullDatabase();
  } catch (err) {
    console.error("Gagal menghapus data:", err);
  } finally {
    store.isLoading = false;
    closeConfirmModal();
  }
};
</script>
