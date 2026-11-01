<!-- src/views/PageSummary.vue -->
<template>
  <section id="page-summary" class="ui-page flex flex-col pb-20 md:pb-6 gap-4 md:gap-6">
    <!-- Akses dibatasi -->
    <div
      v-if="!canViewPage"
      class="ui-card ui-card-large ui-card-bordered ui-access-denied flex flex-col items-center gap-3 mt-10 p-12 text-center"
    >
      <i class="fa-solid fa-lock"></i>

      <h3 class="ui-access-title">Akses Modul Dibatasi</h3>

      <p class="ui-caption">Anda tidak memiliki hak akses ke modul ini.</p>
    </div>

    <template v-else>
      <!-- Finansial dan funnel -->
      <div class="grid grid-cols-1 items-stretch gap-4 md:gap-6 lg:grid-cols-12">
        <div
          class="ui-card flex flex-col justify-between gap-3 overflow-hidden p-4 md:p-5 lg:col-span-7"
        >
          <div class="flex items-end justify-between gap-3">
            <div class="flex-1 min-w-0">
              <span class="ui-metric-eyebrow block mb-0.5"> Revenue Terfilter </span>

              <h2 class="ui-metric-total overflow-hidden text-ellipsis whitespace-nowrap">
                <span class="sm:hidden">
                  {{ formatRpDynamic(totRevFiltered, true) }}
                </span>
                <span class="ui-money-full hidden">
                  {{ formatRpDynamic(totRevFiltered, false) }}
                </span>
              </h2>
            </div>

            <div class="flex flex-col items-end gap-1 shrink-0">
              <span class="ui-badge ui-badge-success ui-badge-pill ui-badge-target">
                {{ persenCapaian }}% Target
              </span>

              <p class="ui-metric-target-note">
                Target:
                <span class="sm:hidden">
                  {{ formatRpDynamic(targetTahun, true) }}
                </span>
                <span class="ui-money-full hidden">
                  {{ formatRpDynamic(targetTahun, false) }}
                </span>
              </p>
            </div>
          </div>

          <div class="ui-metric-breakdown grid grid-cols-2 gap-2 mt-1 pt-3 text-center">
            <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
              <div>
                <p class="ui-metric-label mb-0.5">Sisa Target</p>

                <p
                  class="ui-metric-value overflow-hidden text-ellipsis whitespace-nowrap ui-metric-danger"
                >
                  <span class="sm:hidden">
                    {{ formatRpDynamic(gap > 0 ? gap : 0, true) }}
                  </span>
                  <span class="ui-money-full hidden">
                    {{ formatRpDynamic(gap > 0 ? gap : 0, false) }}
                  </span>
                </p>
              </div>

              <div>
                <p class="ui-metric-label mb-0.5">vs Thn Lalu</p>

                <p
                  class="ui-metric-value overflow-hidden text-ellipsis whitespace-nowrap ui-metric-theme"
                >
                  <span class="sm:hidden">
                    {{ formatRpDynamic(selisihThnLalu, true) }}
                  </span>
                  <span class="ui-money-full hidden">
                    {{ formatRpDynamic(selisihThnLalu, false) }}
                  </span>
                </p>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
              <div>
                <p class="ui-metric-label mb-0.5">Growth (%):</p>

                <p
                  class="ui-metric-value overflow-hidden text-ellipsis whitespace-nowrap"
                  :class="Number(persenThnLalu) >= 0 ? 'ui-metric-success' : 'ui-metric-danger'"
                >
                  {{ persenThnLalu }}%
                </p>
              </div>

              <div>
                <p class="ui-metric-label mb-0.5">Biaya Promo</p>

                <p class="ui-metric-value overflow-hidden text-ellipsis whitespace-nowrap">
                  <span class="sm:hidden">
                    {{ formatRpDynamic(totPromo, true) }}
                  </span>
                  <span class="ui-money-full hidden">
                    {{ formatRpDynamic(totPromo, false) }}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Funnel marketing -->
        <div
          class="ui-card flex flex-col justify-between gap-3 overflow-hidden p-4 md:p-6 lg:col-span-5"
        >
          <div class="flex items-center justify-between gap-3 min-w-0">
            <span class="ui-badge ui-badge-sky ui-badge-pill"> Funnel Marketing </span>

            <span class="ui-badge ui-badge-teal ui-badge-pill">
              {{ pctOrderFromLeads }}% Konversi
            </span>
          </div>

          <div class="grid grid-cols-2 gap-2 my-auto py-2 sm:grid-cols-4">
            <div class="ui-funnel-item min-w-0 p-2.5 text-center">
              <p class="ui-funnel-label">Campaign</p>
              <h4
                class="ui-metric-value overflow-hidden text-ellipsis whitespace-nowrap ui-metric-theme"
              >
                {{ totCamp.toLocaleString("id-ID") }}
              </h4>
            </div>

            <div class="ui-funnel-item min-w-0 p-2.5 text-center">
              <p class="ui-funnel-label">Leads</p>
              <h4
                class="ui-metric-value overflow-hidden text-ellipsis whitespace-nowrap ui-metric-sky"
              >
                {{ totLeads.toLocaleString("id-ID") }}
              </h4>
            </div>

            <div class="ui-funnel-item min-w-0 p-2.5 text-center">
              <p class="ui-funnel-label">Follow Up</p>
              <h4
                class="ui-metric-value overflow-hidden text-ellipsis whitespace-nowrap ui-metric-warning"
              >
                {{ totFu.toLocaleString("id-ID") }}
              </h4>
            </div>

            <div class="ui-funnel-item min-w-0 p-2.5 text-center">
              <p class="ui-funnel-label">Pesanan</p>
              <h4
                class="ui-metric-value overflow-hidden text-ellipsis whitespace-nowrap ui-metric-theme"
              >
                {{ totOrder.toLocaleString("id-ID") }}
              </h4>
            </div>
          </div>
        </div>
      </div>

      <!-- Performa unit usaha -->
      <div class="flex flex-col gap-2">
        <h3 class="ui-title">
          <i class="fa-solid fa-building-user"></i>
          Rekap Performa Unit Usaha
        </h3>

        <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3.5 md:gap-4">
          <button
            v-for="(u, index) in ['NHP', 'NHC', 'KG']"
            :key="u"
            type="button"
            class="ui-unit-card flex flex-col justify-between gap-2.5 min-w-0 p-3.5 text-left sm:p-4"
            :class="{ 'col-span-full sm:col-auto': index === 0 }"
            @click="store.navigate(`unit-${u}`)"
          >
            <span class="flex flex-col gap-2">
              <span class="flex items-center justify-between gap-3 min-w-0">
                <span class="ui-text-strong">Unit {{ u }}</span>

                <span class="ui-badge ui-badge-info ui-badge-pill"> {{ getUnitCapaian(u) }}% </span>
              </span>

              <span>
                <span class="block ui-metric-label mb-0.5">Rev:</span>

                <span class="block ui-unit-revenue overflow-hidden text-ellipsis whitespace-nowrap">
                  <span class="sm:hidden">
                    {{ formatRpDynamic(getUnitRev(u), true) }}
                  </span>
                  <span class="ui-money-full hidden">
                    {{ formatRpDynamic(getUnitRev(u), false) }}
                  </span>
                </span>
              </span>

              <span class="ui-unit-target flex items-center gap-1 min-w-0">
                <span class="ui-unit-target-label shrink-0">Tgt:</span>

                <span class="ui-unit-target-value overflow-hidden text-ellipsis whitespace-nowrap">
                  <span class="sm:hidden">
                    {{ formatRpDynamic(getUnitTarget(u), true) }}
                  </span>
                  <span class="ui-money-full hidden">
                    {{ formatRpDynamic(getUnitTarget(u), false) }}
                  </span>
                </span>
              </span>
            </span>

            <span class="ui-progress" aria-hidden="true">
              <span
                class="ui-progress-fill"
                :style="{
                  width: `${Math.max(0, Math.min(Number(getUnitCapaian(u)), 100))}%`,
                }"
              ></span>
            </span>
          </button>
        </div>
      </div>

      <!-- Grafik baris pertama -->
      <div class="grid grid-cols-1 items-stretch gap-4 md:gap-6 lg:grid-cols-12">
        <div class="ui-card flex flex-col justify-between gap-3 overflow-hidden lg:col-span-5">
          <h3 class="ui-title">Rekap Penjualan Tiap Unit</h3>

          <div class="relative w-full min-w-0 h-64">
            <canvas
              ref="chartUnitRef"
              role="img"
              aria-label="Grafik rekap penjualan tiap unit"
            ></canvas>
          </div>
        </div>

        <div class="ui-card flex flex-col justify-between gap-3 overflow-hidden lg:col-span-3">
          <h3 class="ui-title">Revenue vs Biaya Promosi</h3>

          <div class="relative w-full min-w-0 h-64">
            <canvas
              ref="chartRevVsPromoRef"
              role="img"
              aria-label="Grafik perbandingan revenue dan biaya promosi"
            ></canvas>
          </div>
        </div>

        <div class="ui-card flex flex-col justify-between gap-3 overflow-hidden lg:col-span-4">
          <h3 class="ui-title">Penjualan per Platform</h3>

          <div
            class="relative w-full min-w-0 flex items-center justify-center h-36 overflow-hidden md:h-40"
          >
            <canvas
              ref="chartPlatPieRef"
              role="img"
              aria-label="Grafik penjualan per platform"
            ></canvas>
          </div>
        </div>
      </div>

      <!-- Grafik baris kedua -->
      <div class="grid grid-cols-1 items-stretch gap-4 md:gap-6 lg:grid-cols-12">
        <div class="ui-card flex flex-col justify-between gap-3 overflow-hidden lg:col-span-5">
          <h3 class="ui-title">Rekap Penjualan Tiap Divisi</h3>

          <div class="relative w-full min-w-0 h-64">
            <canvas
              ref="chartDivisiRef"
              role="img"
              aria-label="Grafik rekap penjualan tiap divisi"
            ></canvas>
          </div>
        </div>

        <div class="ui-card flex flex-col justify-between gap-3 overflow-hidden lg:col-span-7">
          <h3 class="ui-title">Trend Revenue Bulanan ({{ currentYear }} vs {{ lastYear }})</h3>

          <div class="relative w-full min-w-0 h-64">
            <canvas
              ref="chartTrendCompareRef"
              role="img"
              aria-label="Grafik perbandingan revenue bulanan tahun ini dan tahun lalu"
            ></canvas>
          </div>
        </div>
      </div>
    </template>
  </section>

  <!-- Filter mobile -->
  <button
    type="button"
    class="ui-filter-fab fixed right-4 bottom-24 z-40 flex flex-col items-center gap-1 md:hidden"
    title="Buka Filter Tanggal"
    aria-label="Buka filter tanggal"
    @click="isFilterModalOpen = true"
  >
    <span class="ui-filter-fab-icon flex items-center justify-center w-12 h-12">
      <i class="fa-solid fa-filter"></i>
    </span>
    <span class="ui-filter-fab-label">Filter</span>
  </button>

  <!-- Modal filter -->
  <Teleport to="body">
    <div
      v-if="isFilterModalOpen"
      class="ui-modal-overlay items-end sm:items-center"
      @click.self="isFilterModalOpen = false"
    >
      <div
        class="ui-modal ui-filter-modal max-w-96 mb-20 max-h-[calc(100dvh_-_7rem)] animate-fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="summary-filter-title"
      >
        <div class="ui-modal-header">
          <h3 id="summary-filter-title" class="ui-title">
            <i class="fa-solid fa-filter"></i>
            Filter Rentang Tanggal
          </h3>

          <button
            type="button"
            class="ui-close"
            aria-label="Tutup filter tanggal"
            @click="isFilterModalOpen = false"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="ui-modal-body flex flex-col gap-4">
          <div class="min-w-0">
            <label for="summary-start-date" class="ui-label"> Tanggal Mulai: </label>
            <input id="summary-start-date" v-model="tempStartDate" type="date" class="ui-input" />
          </div>

          <div class="min-w-0">
            <label for="summary-end-date" class="ui-label"> Tanggal Akhir: </label>
            <input id="summary-end-date" v-model="tempEndDate" type="date" class="ui-input" />
          </div>
        </div>

        <div class="ui-modal-footer">
          <button type="button" class="ui-button ui-button-secondary" @click="resetFilterMobile">
            Reset
          </button>

          <button
            type="button"
            class="ui-button ui-button-primary ui-button-shadow"
            @click="applyFilterMobile"
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
import { api } from "../services/api.js";
import Chart from "chart.js/auto";

const isFilterModalOpen = ref(false);
const tempStartDate = ref("");
const tempEndDate = ref("");
const isLoadingSummary = ref(false);

watch(
  () => store.filterDates,
  (newDates) => {
    tempStartDate.value = newDates.start;
    tempEndDate.value = newDates.end;
  },
  { deep: true },
);

// Di dalam script setup PageSummary.vue
const canViewPage = computed(() => {
  const user = store.currentUser;
  if (!user) return false;
  const role = String(user.role || "").toUpperCase();
  if (role === "SUPERADMIN") return true;
  return store.canAccessPage("");
});

onMounted(async () => {
  // 1. Validasi akses view
  if (!canViewPage.value) return;

  // 2. Tarik data spesifik halaman ini secara lazy (hanya jika diakses)
  isLoadingSummary.value = true;
  try {
    const [revRes, promoRes, leadsRes] = await Promise.all([
      api.getRevenues(200), // Batasi limit agar cepat
      api.getPromos(100),
      api.getLeads(100),
    ]);

    if (!store.db) store.db = {};
    store.db.revenue = revRes || [];
    store.db.promo = promoRes || [];
    store.db.leads = leadsRes || [];
  } catch (err) {
    store.addNotification("Gagal", "Gagal memuat rekap bisnis", "warning");
  } finally {
    isLoadingSummary.value = false;
    renderCharts();
  }
});

const fetchSummaryData = async () => {
  isLoadingSummary.value = true;
  try {
    // Tarik data revenue, promo, dan leads terbaru secukupnya (misal limit 200 data terakhir)
    const [revRes, promoRes, leadsRes] = await Promise.all([
      api && api.getRevenues ? api.getRevenues() : [],
      api && api.getPromos ? api.getPromos() : [],
      api && api.getLeads ? api.getLeads() : [],
    ]);

    if (!store.db) store.db = {};
    if (revRes && revRes.length > 0) store.db.revenue = revRes;
    if (promoRes && promoRes.length > 0) store.db.promo = promoRes;
    if (leadsRes && leadsRes.length > 0) store.db.leads = leadsRes;
  } catch (err) {
    console.error("Gagal memuat data summary:", err);
  } finally {
    isLoadingSummary.value = false;
    renderCharts(); // Render ulang chart setelah data masuk
  }
};

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

  fetchSummaryData();
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


<!-- Gaya khusus komponen; layout utama berada di template. -->
<style scoped>
.ui-access-denied > i {
  color: var(--ui-danger);
  font-size: 2.25rem;
}

.ui-access-title {
  color: var(--ui-text);
  font-size: var(--ui-font-lg);
  font-weight: 600;
}

.ui-metric-eyebrow {
  color: var(--ui-selected-text);
  font-size: var(--ui-body-size);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.ui-metric-total {
  color: var(--ui-text);
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1;
}

.ui-metric-target-note {
  color: var(--ui-text-muted);
  font-size: var(--ui-body-size);
  line-height: 1.25;
}
.ui-metric-breakdown {
  border-top: 1px solid var(--ui-border-soft);
}

.ui-metric-label {
  color: var(--ui-text-muted);
  font-size: var(--ui-body-size);
  font-weight: 400;
}

.ui-metric-value {
  color: var(--ui-text-secondary);
  font-size: var(--ui-title-size);
  font-weight: 600;
  line-height: 1.4;
}

.ui-metric-theme {
  color: var(--ui-selected-text);
}

.ui-metric-success {
  color: var(--ui-success);
}

.ui-metric-danger {
  color: var(--ui-danger);
}

.ui-metric-warning {
  color: var(--ui-warning);
}

.ui-metric-sky {
  color: var(--ui-sky);
}

.ui-funnel-item {
  border: 1px solid var(--input-border);
  border-radius: var(--ui-radius-control);
  background-color: var(--input-background);
}

.ui-funnel-label {
  color: var(--ui-text-muted);
  font-size: var(--ui-font-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.ui-funnel-item .ui-metric-value {
  margin-top: 0.25rem;
}

.ui-unit-card {
  border-radius: var(--ui-radius-card);
  background-color: var(--card-background);
  color: var(--ui-text);
  box-shadow: var(--ui-shadow-sm);
  cursor: pointer;
}

.ui-unit-revenue {
  color: var(--ui-selected-text);
  font-size: var(--ui-font-base);
  font-weight: 600;
  line-height: 1.25;
}

.ui-unit-target {
  font-size: var(--ui-body-size);
}

.ui-unit-target-label {
  color: var(--ui-text-muted);
}

.ui-unit-target-value {
  color: var(--ui-text-secondary);
  font-weight: 600;
}
.ui-filter-fab {
  color: var(--ui-text-muted);
  cursor: pointer;
}

.ui-filter-fab-icon {
  border-radius: 999px;
  background-color: var(--primary-color);
  color: var(--ui-text-on-primary);
  font-size: var(--ui-font-base);
  box-shadow: var(--ui-shadow-button);
}

.ui-filter-fab-label {
  font-size: var(--ui-font-xs);
  font-weight: 600;
}

.ui-filter-modal .ui-modal-footer > .ui-button {
  flex: 1;
}
.ui-unit-card:focus-visible,
.ui-filter-fab:focus-visible {
  outline: 1px solid var(--input-border-focus);
  outline-offset: 3px;
}
@media (hover: hover) and (pointer: fine) {
  .ui-unit-card:hover {
    background-image: linear-gradient(var(--glass-hover), var(--glass-hover));
  }
}
@media (hover: hover) and (pointer: fine) {
  .ui-filter-fab:hover .ui-filter-fab-icon {
    filter: brightness(1.06);
  }
}
@media (min-width: 640px) {
  .ui-money-full {
    display: inline;
  }
}
@media (min-width: 768px) {
  .ui-metric-total {
    font-size: 1.5rem;
  }
}
@media print {
  .ui-filter-fab {
    display: none !important;
  }
}
</style>
