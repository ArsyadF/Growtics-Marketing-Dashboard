<!-- src/views/PageSummary.vue -->
<template>
  <section
    id="page-main"
    class="page-section space-y-4 md:space-y-6 pb-20 md:pb-6"
  >
    <!-- Top Row: Kinerja Finansial & Funnel Marketing -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-stretch">
      <!-- Card Kinerja Finansial -->
      <div
        class="lg:col-span-7 glass-card bg-white/90 dark:bg-slate-900/90 rounded-2xl p-4 md:p-5 flex flex-col justify-between border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden"
      >
        <!-- Baris Atas: Nominal Utama -->
        <div class="flex items-end justify-between gap-3">
          <div class="min-w-0">
            <span
              class="text-sm md:text-xs font-semibold uppercase text-theme tracking-wider block mb-0.5"
            >
              Revenue Terfilter
            </span>
            <h2
              class="text-xl md:text-2xl font-semibold text-slate-800 dark:text-slate-100 leading-none truncate"
            >
              <!-- Tampilan Mobile (Ringkas) -->
              <span class="sm:hidden">{{
                formatRpDynamic(totRevFiltered, true)
              }}</span>
              <!-- Tampilan Desktop (Lengkap) -->
              <span class="hidden sm:inline">{{
                formatRpDynamic(totRevFiltered, false)
              }}</span>
            </h2>
          </div>

          <!-- Badge Target -->
          <div class="flex flex-col items-end shrink-0">
            <span
              class="inline-block text-sm md:text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 md:px-2.5 md:py-1 rounded-full border border-emerald-500/20 leading-tight"
            >
              {{ persenCapaian }}% Target
            </span>
            <p class="text-sm md:text-xs text-slate-400 mt-1 leading-none">
              Target:
              <span class="sm:hidden">{{
                formatRpDynamic(targetTahun, true)
              }}</span>
              <span class="hidden sm:inline">{{
                formatRpDynamic(targetTahun, false)
              }}</span>
            </p>
          </div>
        </div>

        <!-- Baris Bawah: Sub-Metrik Ringkas -->
        <div
          class="grid grid-cols-2 md:grid-cols-2 gap-2 text-center mt-4 pt-3 border-t border-slate-100 dark:border-slate-800"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <p class="text-slate-400 text-sm md:text-xs mb-0.5">
                Sisa Target
              </p>
              <p
                class="font-semibold text-rose-500 dark:text-rose-400 truncate text-base md:text-sm"
              >
                <span class="sm:hidden">{{
                  formatRpDynamic(gap > 0 ? gap : 0, true)
                }}</span>
                <span class="hidden sm:inline">{{
                  formatRpDynamic(gap > 0 ? gap : 0, false)
                }}</span>
              </p>
            </div>
            <div>
              <p class="text-slate-400 text-sm md:text-xs mb-0.5">
                vs Thn Lalu
              </p>
              <p class="font-semibold text-theme truncate text-base md:text-sm">
                <span class="sm:hidden">{{
                  formatRpDynamic(selisihThnLalu, true)
                }}</span>
                <span class="hidden sm:inline">{{
                  formatRpDynamic(selisihThnLalu, false)
                }}</span>
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <p class="text-slate-400 text-sm md:text-xs mb-0.5">
                Growth (%):
              </p>
              <p
                class="font-semibold truncate text-base md:text-sm"
                :class="
                  Number(persenThnLalu) >= 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-500 dark:text-rose-400'
                "
              >
                {{ persenThnLalu }}%
              </p>
            </div>
            <div>
              <p class="text-slate-400 text-sm md:text-xs mb-0.5">
                Biaya Promo
              </p>
              <p
                class="font-semibold text-slate-700 dark:text-slate-300 truncate text-base md:text-sm"
              >
                <span class="sm:hidden">{{
                  formatRpDynamic(totPromo, true)
                }}</span>
                <span class="hidden sm:inline">{{
                  formatRpDynamic(totPromo, false)
                }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Card Funnel Marketing -->
      <div
        class="lg:col-span-5 glass-card bg-white/90 dark:bg-slate-900/90 rounded-2xl p-4 md:p-6 flex flex-col justify-between border border-slate-100 dark:border-slate-800 shadow-sm"
      >
        <div class="flex justify-between items-center mb-3 md:mb-4">
          <span
            class="text-sm md:text-xs font-semibold uppercase text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20"
          >
            Funnel Marketing
          </span>
          <span
            class="text-sm md:text-xs font-semibold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20"
          >
            {{ pctOrderFromLeads }}% Konversi
          </span>
        </div>

        <div
          class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center my-auto py-2"
        >
          <div
            class="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60"
          >
            <p
              class="text-xs text-slate-400 uppercase font-semibold tracking-wider"
            >
              Campaign
            </p>
            <h4 class="text-base md:text-sm font-semibold text-theme mt-1">
              {{ totCamp.toLocaleString("id-ID") }}
            </h4>
          </div>
          <div
            class="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60"
          >
            <p
              class="text-xs text-slate-400 uppercase font-semibold tracking-wider"
            >
              Leads
            </p>
            <h4 class="text-base md:text-sm font-semibold text-sky-500 mt-1">
              {{ totLeads.toLocaleString("id-ID") }}
            </h4>
          </div>
          <div
            class="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60"
          >
            <p
              class="text-xs text-slate-400 uppercase font-semibold tracking-wider"
            >
              Follow Up
            </p>
            <h4 class="text-base md:text-sm font-semibold text-amber-500 mt-1">
              {{ totFu.toLocaleString("id-ID") }}
            </h4>
          </div>
          <div
            class="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60"
          >
            <p
              class="text-xs text-slate-400 uppercase font-semibold tracking-wider"
            >
              Pesanan
            </p>
            <h4 class="text-base md:text-sm font-semibold text-theme mt-1">
              {{ totOrder.toLocaleString("id-ID") }}
            </h4>
          </div>
        </div>
      </div>
    </div>

    <!-- Cards Performa Unit Usaha -->
    <div>
      <h3
        class="font-semibold text-slate-800 dark:text-slate-100 mb-2.5 text-base md:text-sm uppercase tracking-wider flex items-center gap-1.5"
      >
        <i class="fa-solid fa-building-user text-theme"></i>
        Rekap Performa Unit Usaha
      </h3>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3.5 md:gap-4">
        <div
          v-for="(u, index) in ['NHP', 'NHC', 'KG']"
          :key="u"
          @click="store.navigate(`unit-${u}`)"
          class="glass-card bg-white/90 dark:bg-slate-900/90 p-3.5 sm:p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-theme/40 transition-all cursor-pointer group flex flex-col justify-between"
          :class="{ 'col-span-2 sm:col-span-1': index === 0 }"
        >
          <div>
            <div class="flex items-center justify-between mb-2">
              <h4
                class="font-semibold text-slate-800 dark:text-slate-100 text-base md:text-sm group-hover:text-theme transition-colors"
              >
                Unit {{ u }}
              </h4>
              <span
                class="text-sm md:text-xs font-semibold text-theme bg-button/10 px-2 py-0.5 rounded-full border border-white/20 leading-none"
              >
                {{ getUnitCapaian(u) }}%
              </span>
            </div>

            <div class="mb-2">
              <span
                class="text-sm md:text-xs text-slate-400 font-semibold block leading-none mb-0.5"
                >Rev:</span
              >
              <h5
                class="text-base font-semibold text-theme truncate leading-tight"
              >
                <span class="sm:hidden">{{
                  formatRpDynamic(getUnitRev(u), true)
                }}</span>
                <span class="hidden sm:inline">{{
                  formatRpDynamic(getUnitRev(u), false)
                }}</span>
              </h5>
            </div>

            <div
              class="flex items-center gap-1 text-sm md:text-xs text-slate-500 dark:text-slate-400"
            >
              <span class="text-slate-400 shrink-0">Tgt:</span>
              <span
                class="font-semibold text-slate-700 dark:text-slate-300 truncate"
              >
                <span class="sm:hidden">{{
                  formatRpDynamic(getUnitTarget(u), true)
                }}</span>
                <span class="hidden sm:inline">{{
                  formatRpDynamic(getUnitTarget(u), false)
                }}</span>
              </span>
            </div>
          </div>

          <div
            class="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden"
          >
            <div
              class="bg-button h-full rounded-full transition-all duration-500"
              :style="{ width: `${Math.min(getUnitCapaian(u), 100)}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- BARIS 1 CHARTS -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
      <div
        class="lg:col-span-5 glass-card bg-white/90 dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between"
      >
        <h3
          class="font-semibold text-base md:text-sm mb-3 text-slate-800 dark:text-slate-100"
        >
          Rekap Penjualan Tiap Unit
        </h3>
        <div class="chart-container relative h-64">
          <canvas ref="chartUnitRef"></canvas>
        </div>
      </div>

      <div
        class="lg:col-span-3 glass-card bg-white/90 dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between"
      >
        <h3
          class="font-semibold text-base md:text-sm mb-3 text-slate-800 dark:text-slate-100"
        >
          Revenue vs Biaya Promosi
        </h3>
        <div class="chart-container relative h-64">
          <canvas ref="chartRevVsPromoRef"></canvas>
        </div>
      </div>

      <div
        class="lg:col-span-4 glass-card bg-white/90 dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between"
      >
        <h3
          class="font-semibold text-base md:text-sm mb-1 text-slate-800 dark:text-slate-100"
        >
          Penjualan per Platform
        </h3>
        <div
          class="chart-container relative h-36 md:h-40 flex items-center justify-center overflow-hidden"
        >
          <canvas ref="chartPlatPieRef"></canvas>
        </div>
      </div>
    </div>

    <!-- BARIS 2 CHARTS -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
      <div
        class="lg:col-span-5 glass-card bg-white/90 dark:bg-slate-900/90 p-4 md:p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between"
      >
        <h3
          class="font-semibold text-base md:text-sm mb-3 text-slate-800 dark:text-slate-100"
        >
          Rekap Penjualan Tiap Divisi
        </h3>
        <div class="chart-container relative h-64">
          <canvas ref="chartDivisiRef"></canvas>
        </div>
      </div>

      <div
        class="lg:col-span-7 glass-card bg-white/90 dark:bg-slate-900/90 p-4 md:p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between"
      >
        <h3
          class="font-semibold text-base md:text-sm mb-3 text-slate-800 dark:text-slate-100"
        >
          Trend Revenue Bulanan ({{ currentYear }} vs {{ lastYear }})
        </h3>
        <div class="chart-container relative h-64">
          <canvas ref="chartTrendCompareRef"></canvas>
        </div>
      </div>
    </div>
  </section>

  <!-- MOBILE FLOATING ACTION BUTTON (FAB) FILTER -->
  <div class="md:hidden fixed bottom-20 right-4 z-40">
    <button
      @click="isFilterModalOpen = true"
      class="flex flex-col text-slate-400 mb-4 items-center justify-center text-lg active:scale-95 transition-transform cursor-pointer"
      title="Buka Filter Tanggal"
    >
      <i
        class="fa-solid fa-filter flex items-center justify-center w-12 h-12 rounded-full bg-button text-white text-base shadow-md"
      ></i>
      <span class="text-xs font-semibold mt-1">Filter</span>
    </button>
  </div>

  <!-- POPUP MODAL FILTER TANGGAL (MOBILE) -->
  <Teleport to="body">
    <div
      v-if="isFilterModalOpen"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm transition-opacity"
      @click.self="isFilterModalOpen = false"
    >
      <div
        class="absolute mb-20 w-full max-w-sm glass-card bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl space-y-4 border border-slate-100 dark:border-slate-800"
      >
        <div
          class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3"
        >
          <h3
            class="font-semibold text-slate-800 dark:text-slate-100 text-base flex items-center gap-2"
          >
            <i class="fa-solid fa-filter text-theme"></i> Filter Rentang Tanggal
          </h3>
          <button
            @click="isFilterModalOpen = false"
            class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div class="space-y-3 text-sm">
          <div>
            <label
              class="block text-slate-500 dark:text-slate-400 font-semibold mb-1"
              >Tanggal Mulai:</label
            >
            <input
              v-model="tempStartDate"
              type="date"
              class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none focus:border-theme text-sm"
            />
          </div>
          <div>
            <label
              class="block text-slate-500 dark:text-slate-400 font-semibold mb-1"
              >Tanggal Akhir:</label
            >
            <input
              v-model="tempEndDate"
              type="date"
              class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none focus:border-theme text-sm"
            />
          </div>
        </div>

        <div class="flex items-center gap-2 pt-2">
          <button
            @click="resetFilterMobile"
            class="flex-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-200 py-3 rounded-xl font-semibold text-sm cursor-pointer"
          >
            Reset
          </button>
          <button
            @click="applyFilterMobile"
            class="flex-1 bg-button text-white py-3 rounded-xl font-semibold text-sm shadow-md cursor-pointer hover:opacity-95"
          >
            Terapkan
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, ref, onMounted, watch } from "vue";
import { store } from "../store";
import Chart from "chart.js/auto";

const isFilterModalOpen = ref(false);
const tempStartDate = ref("");
const tempEndDate = ref("");

watch(
  () => store.filterDates,
  (newDates) => {
    tempStartDate.value = newDates.start;
    tempEndDate.value = newDates.end;
  },
  { deep: true },
);

const applyFilter = () => {
  store.filterDates.start = tempStartDate.value;
  store.filterDates.end = tempEndDate.value;
};

const resetFilter = () => {
  const startOfYear = getStartOfYearString();
  const today = getTodayString();
  tempStartDate.value = startOfYear;
  tempEndDate.value = today;
  store.filterDates.start = startOfYear;
  store.filterDates.end = today;
};

const applyFilterMobile = () => {
  applyFilter();
  isFilterModalOpen.value = false;
};

const resetFilterMobile = () => {
  resetFilter();
  isFilterModalOpen.value = false;
};

function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

function getStartOfYearString() {
  const currentYear = new Date().getFullYear();
  return `${currentYear}-01-01`;
}

onMounted(() => {
  if (!store.filterDates.start) {
    store.filterDates.start = getStartOfYearString();
  }
  if (!store.filterDates.end) {
    store.filterDates.end = getTodayString();
  }
  tempStartDate.value = store.filterDates.start;
  tempEndDate.value = store.filterDates.end;
});

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];
const currentYear = ref(new Date().getFullYear());
const lastYear = ref(currentYear.value - 1);

function isDateInFilter(dStr) {
  if (!dStr) return false;
  const d = new Date(dStr).setHours(0, 0, 0, 0);
  const s = store.filterDates?.start
    ? new Date(store.filterDates.start).setHours(0, 0, 0, 0)
    : null;
  const e = store.filterDates?.end
    ? new Date(store.filterDates.end).setHours(23, 59, 59, 999)
    : null;
  if (s && d < s) return false;
  if (e && d > e) return false;
  return true;
}

const filteredRev = computed(() =>
  (store.db?.revenue || []).filter((r) => isDateInFilter(r.Tanggal)),
);
const filteredPromo = computed(() =>
  (store.db?.promo || []).filter((p) => isDateInFilter(p.Tanggal)),
);
const filteredLeads = computed(() =>
  (store.db?.leads || []).filter((l) => isDateInFilter(l.Tanggal)),
);

const targetTahun = computed(() =>
  Number(store.db.master?.TargetTahunIni || 0),
);
const totRevFiltered = computed(() =>
  filteredRev.value.reduce((s, r) => s + Number(r.Revenue || 0), 0),
);
const gap = computed(() => targetTahun.value - totRevFiltered.value);
const persenCapaian = computed(() =>
  targetTahun.value > 0
    ? ((totRevFiltered.value / targetTahun.value) * 100).toFixed(1)
    : "0",
);

const revThnLalu = computed(() => {
  // Mengambil data tahun lalu yang disesuaikan dengan rentang bulan/hari dari filter aktif
  const startDateStr = store.filterDates?.start;
  const endDateStr = store.filterDates?.end;

  return (store.db?.revenue || []).filter((r) => {
    if (!r.Tanggal) return false;
    const d = new Date(r.Tanggal);
    if (d.getFullYear() !== lastYear.value) return false;

    if (startDateStr && endDateStr) {
      const startD = new Date(startDateStr);
      const endD = new Date(endDateStr);

      // Memetakan ke tanggal di tahun lalu untuk perbandingan yang apple-to-apple
      const mappedStart = new Date(
        lastYear.value,
        startD.getMonth(),
        startD.getDate(),
      ).setHours(0, 0, 0, 0);
      const mappedEnd = new Date(
        lastYear.value,
        endD.getMonth(),
        endD.getDate(),
      ).setHours(23, 59, 59, 999);
      const currentD = d.setHours(0, 0, 0, 0);

      return currentD >= mappedStart && currentD <= mappedEnd;
    }
    return true;
  });
});

const revThnLaluTotal = computed(() =>
  revThnLalu.value.reduce((s, r) => s + Number(r.Revenue || 0), 0),
);

const selisihThnLalu = computed(
  () => totRevFiltered.value - revThnLaluTotal.value,
);

const persenThnLalu = computed(() => {
  if (revThnLaluTotal.value === 0)
    return totRevFiltered.value > 0 ? "100.0" : "0.0";
  return (
    ((totRevFiltered.value - revThnLaluTotal.value) / revThnLaluTotal.value) *
    100
  ).toFixed(1);
});

const totPromo = computed(() =>
  filteredPromo.value.reduce((s, p) => s + Number(p.BiayaPromosi || 0), 0),
);

const totCamp = computed(() =>
  filteredLeads.value.reduce((s, l) => s + Number(l.Campaign || 0), 0),
);
const totLeads = computed(() =>
  filteredLeads.value.reduce((s, l) => s + Number(l.DatabaseLeads || 0), 0),
);
const totFu = computed(() =>
  filteredLeads.value.reduce((s, l) => s + Number(l.FollowUp || 0), 0),
);
const totOrder = computed(() =>
  filteredLeads.value.reduce((s, l) => s + Number(l.Pesanan || 0), 0),
);
const pctOrderFromLeads = computed(() =>
  totLeads.value > 0
    ? ((totOrder.value / totLeads.value) * 100).toFixed(1)
    : "0",
);

function getUnitRev(unit) {
  return (filteredRev.value || [])
    .filter((r) => r.Unit === unit)
    .reduce((s, r) => s + Number(r.Revenue || 0), 0);
}
function getUnitTarget(unit) {
  return Number(store.db.master?.[`Target${unit}`] || 0);
}
function getUnitCapaian(unit) {
  const t = getUnitTarget(unit);
  return t > 0 ? ((getUnitRev(unit) / t) * 100).toFixed(1) : "0";
}

const chartUnitRef = ref(null);
const chartRevVsPromoRef = ref(null);
const chartPlatPieRef = ref(null);
const chartDivisiRef = ref(null);
const chartTrendCompareRef = ref(null);

let cUnitInstance = null,
  cRevVsPromoInstance = null,
  cPlatPieInstance = null,
  cDivisiInstance = null,
  cTrendCompareInstance = null;

const CHART_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#0ea5e9",
  "#6366f1",
  "#14b8a6",
  "#f97316",
  "#a855f7",
  "#06b6d4",
  "#84cc16",
];

function renderCharts() {
  if (cUnitInstance) cUnitInstance.destroy();
  if (cRevVsPromoInstance) cRevVsPromoInstance.destroy();
  if (cPlatPieInstance) cPlatPieInstance.destroy();
  if (cDivisiInstance) cDivisiInstance.destroy();
  if (cTrendCompareInstance) cTrendCompareInstance.destroy();

  const uNames = ["NHP", "NHC", "KG"];
  const uRevs = uNames.map((u) => getUnitRev(u));
  if (chartUnitRef.value) {
    cUnitInstance = new Chart(chartUnitRef.value, {
      type: "bar",
      data: {
        labels: uNames,
        datasets: [
          {
            label: "Revenue Unit",
            data: uRevs,
            backgroundColor: CHART_COLORS,
            borderRadius: 8,
          },
        ],
      },
      options: { indexAxis: "y", responsive: true, maintainAspectRatio: false },
    });
  }

  if (chartRevVsPromoRef.value) {
    cRevVsPromoInstance = new Chart(chartRevVsPromoRef.value, {
      type: "bar",
      data: {
        labels: ["Revenue", "Biaya Promo"],
        datasets: [
          {
            label: "Nominal (Rp)",
            data: [totRevFiltered.value, totPromo.value],
            backgroundColor: ["#10b981", "#f43f5e"],
            borderRadius: 8,
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });
  }

  const pMap = {};
  filteredRev.value.forEach((r) => {
    pMap[r.Platform || "Lainnya"] =
      (pMap[r.Platform || "Lainnya"] || 0) + Number(r.Revenue || 0);
  });

  if (chartPlatPieRef.value) {
    cPlatPieInstance = new Chart(chartPlatPieRef.value, {
      type: "doughnut",
      data: {
        labels: Object.keys(pMap),
        datasets: [
          {
            data: Object.values(pMap),
            backgroundColor: CHART_COLORS,
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        rotation: -90,
        circumference: 180,
        cutout: "65%",
        plugins: {
          legend: {
            position: "bottom",
            labels: { boxWidth: 10, padding: 6, font: { size: 10 } },
          },
        },
      },
    });
  }

  const divMap = {};
  filteredRev.value.forEach((r) => {
    const divKey = r.Divisi || r.Kategori || "Umum";
    divMap[divKey] = (divMap[divKey] || 0) + Number(r.Revenue || 0);
  });

  const sortedDivisiLabels = Object.keys(divMap).sort((a, b) =>
    a.localeCompare(b, "id", { sensitivity: "base" }),
  );
  const sortedDivisiValues = sortedDivisiLabels.map((label) => divMap[label]);

  if (chartDivisiRef.value) {
    cDivisiInstance = new Chart(chartDivisiRef.value, {
      type: "bar",
      data: {
        labels:
          sortedDivisiLabels.length > 0
            ? sortedDivisiLabels
            : ["Belum Ada Data"],
        datasets: [
          {
            label: "Revenue Divisi",
            data: sortedDivisiValues.length > 0 ? sortedDivisiValues : [0],
            backgroundColor: CHART_COLORS.slice(0, sortedDivisiLabels.length),
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
      },
    });
  }

  const monthlyCurrentYear = Array(12).fill(0);
  const monthlyLastYear = Array(12).fill(0);

  (store.db?.revenue || []).forEach((r) => {
    if (!r.Tanggal) return;
    const dateObj = new Date(r.Tanggal);
    const yr = dateObj.getFullYear();
    const mo = dateObj.getMonth();
    const rev = Number(r.Revenue || 0);

    if (yr === currentYear.value && isDateInFilter(r.Tanggal)) {
      monthlyCurrentYear[mo] += rev;
    } else if (yr === lastYear.value) {
      monthlyLastYear[mo] += rev;
    }
  });

  if (chartTrendCompareRef.value) {
    cTrendCompareInstance = new Chart(chartTrendCompareRef.value, {
      type: "line",
      data: {
        labels: MONTH_NAMES,
        datasets: [
          {
            label: `Revenue ${currentYear.value}`,
            data: monthlyCurrentYear,
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.15)",
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: "#3b82f6",
          },
          {
            label: `Revenue ${lastYear.value}`,
            data: monthlyLastYear,
            borderColor: "#64748b",
            borderDash: [5, 5],
            fill: false,
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: "#64748b",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "top" } },
      },
    });
  }
}

onMounted(() => renderCharts());
watch([filteredRev, filteredPromo, store.filterDates], () => renderCharts(), {
  deep: true,
});

const formatRpDynamic = (val, isCompact = false) => {
  if (!val || isNaN(val)) return "Rp 0";
  const num = Number(val);
  if (isCompact) {
    if (Math.abs(num) >= 1_000_000_000) {
      return `Rp ${(num / 1_000_000_000).toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 3 })} M`;
    }
    if (Math.abs(num) >= 1_000_000) {
      return `Rp ${(num / 1_000_000).toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 3 })} jt`;
    }
  }
  return `Rp ${new Intl.NumberFormat("id-ID").format(num)}`;
};
</script>
