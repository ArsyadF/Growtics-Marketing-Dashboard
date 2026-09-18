<!-- dashboard.vue -->
<template>
  <section id="page-main" class="page-section space-y-4 md:space-y-6">
    <!-- Top Row: Kinerja Finansial & Funnel Marketing -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-stretch">
      <!-- Card Kinerja Finansial -->
      <div
        class="lg:col-span-7 glass-card rounded-2xl p-4 md:p-5 flex flex-col justify-start relative overflow-hidden"
      >
        <!-- Baris Atas: Nominal Utama -->
        <div class="flex items-end justify-between gap-3">
          <div class="min-w-0">
            <span
              class="text-[9px] md:text-[10px] font-bold uppercase text-theme tracking-wider block mb-0.5"
            >
              Revenue Terfilter
            </span>
            <h2
              class="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100 leading-none truncate"
            >
              <!-- Tampilan Mobile (Ringkas: Rp 14,4 M) -->
              <span class="sm:hidden">{{
                formatRpDynamic(totRevFiltered, true)
              }}</span>
              <!-- Tampilan Desktop (Lengkap: Rp 14.424.470.067) -->
              <span class="hidden sm:inline">{{
                formatRpDynamic(totRevFiltered, false)
              }}</span>
            </h2>
          </div>

          <!-- Badge Target -->
          <div class="flex flex-col items-end shrink-0">
            <span
              class="inline-block text-[10px] md:text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 leading-tight"
            >
              {{ persenCapaian }}% Target
            </span>
            <p
              class="text-[9px] md:text-[10px] text-slate-400 mt-1 leading-none"
            >
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
          class="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800/80 text-[10px] md:text-xs"
        >
          <div>
            <p class="text-slate-400 text-[9px] md:text-[10px] mb-0.5">
              Sisa Target
            </p>
            <p class="font-bold text-rose-500 dark:text-rose-400 truncate">
              <span class="sm:hidden">{{
                formatRpDynamic(gap > 0 ? gap : 0, true)
              }}</span>
              <span class="hidden sm:inline">{{
                formatRpDynamic(gap > 0 ? gap : 0, false)
              }}</span>
            </p>
          </div>
          <div>
            <p class="text-slate-400 text-[9px] md:text-[10px] mb-0.5">
              vs Thn Lalu
            </p>
            <p class="font-bold text-theme truncate">
              <span class="sm:hidden">{{
                formatRpDynamic(selisihThnLalu, true)
              }}</span>
              <span class="hidden sm:inline">{{
                formatRpDynamic(selisihThnLalu, false)
              }}</span>
            </p>
          </div>
          <div>
            <p class="text-slate-400 text-[9px] md:text-[10px] mb-0.5">
              Biaya Promo
            </p>
            <p class="font-bold text-slate-700 dark:text-slate-300 truncate">
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

      <!-- Card Funnel Marketing -->
      <div
        class="lg:col-span-5 glass-card rounded-2xl md:rounded-1xl p-4 md:p-6 flex flex-col justify-between"
      >
        <div class="flex justify-between items-center mb-3 md:mb-4">
          <span
            class="text-[10px] md:text-[11px] font-bold uppercase text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20"
          >
            Funnel Marketing
          </span>
          <span
            class="text-[11px] md:text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20"
          >
            {{ pctOrderFromLeads }}% Konversi
          </span>
        </div>

        <div
          class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center my-auto py-2"
        >
          <div
            class="p-2.5 bg-[#f1f5f9] dark:bg-slate-900/50 rounded-2xl border border-white/20 dark:border-slate-800/60"
          >
            <p
              class="text-[9px] text-slate-400 uppercase font-semibold tracking-wider"
            >
              Campaign
            </p>
            <h4
              class="text-sm md:text-base font-bold text-theme dark:text-theme mt-1"
            >
              {{ totCamp.toLocaleString("id-ID") }}
            </h4>
          </div>
          <div
            class="p-2.5 bg-[#f1f5f9] dark:bg-slate-900/50 rounded-2xl border border-white/20 dark:border-slate-800/60"
          >
            <p
              class="text-[9px] text-slate-400 uppercase font-semibold tracking-wider"
            >
              Leads
            </p>
            <h4 class="text-sm md:text-base font-bold text-sky-500 mt-1">
              {{ totLeads.toLocaleString("id-ID") }}
            </h4>
          </div>
          <div
            class="p-2.5 bg-[#f1f5f9] dark:bg-slate-900/50 rounded-2xl border border-white/20 dark:border-slate-800/60"
          >
            <p
              class="text-[9px] text-slate-400 uppercase font-semibold tracking-wider"
            >
              Follow Up
            </p>
            <h4 class="text-sm md:text-base font-bold text-amber-500 mt-1">
              {{ totFu.toLocaleString("id-ID") }}
            </h4>
          </div>
          <div
            class="p-2.5 bg-[#f1f5f9] dark:bg-slate-900/50 rounded-2xl border border-white/20 dark:border-slate-800/60"
          >
            <p
              class="text-[9px] text-slate-400 uppercase font-semibold tracking-wider"
            >
              Pesanan
            </p>
            <h4
              class="text-sm md:text-base font-bold text-theme dark:text-theme mt-1"
            >
              {{ totOrder.toLocaleString("id-ID") }}
            </h4>
          </div>
        </div>
      </div>
    </div>

    <!-- Cards Performa Unit Usaha -->
    <div>
      <!-- Header Section -->
      <h3
        class="font-bold text-slate-800 dark:text-slate-100 mb-2.5 text-xs uppercase tracking-wider flex items-center gap-1.5"
      >
        <i class="fa-solid fa-building-user text-theme"></i>
        Rekap Performa Unit Usaha
      </h3>

      <!-- Grid Responsive: 2 Kolom di Mobile (NHP Span 2), 3 Kolom di Desktop -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3.5 md:gap-4">
        <div
          v-for="(u, index) in ['NHP', 'NHC', 'KG']"
          :key="u"
          @click="store.navigate(`unit-${u}`)"
          class="glass-card p-3 sm:p-3.5 rounded-2xl dark:border-slate-800 hover:border-theme/40 transition-all cursor-pointer group flex flex-col justify-between"
          :class="{ 'col-span-2 sm:col-span-1': index === 0 }"
        >
          <div>
            <!-- BARIS 1: Nama Unit & Badge Persentase -->
            <div class="flex items-center justify-between mb-2">
              <h4
                class="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-xs group-hover:text-theme transition-colors"
              >
                Unit {{ u }}
              </h4>
              <span
                class="text-[9px] sm:text-[10px] font-extrabold text-theme bg-button/10 px-2 py-0.5 rounded-full border border-white/20 leading-none"
              >
                {{ getUnitCapaian(u) }}%
              </span>
            </div>

            <!-- BARIS 2 & 3: Label Rev & Nilai Rev Menonjol (Hero Value) -->
            <div class="mb-2">
              <span
                class="text-[9px] sm:text-[10px] text-slate-400 font-medium block leading-none mb-0.5"
              >
                Rev:
              </span>
              <h5
                class="text-sm sm:text-base font-black text-theme truncate leading-tight"
              >
                <span class="sm:hidden">{{
                  formatRpDynamic(getUnitRev(u), true)
                }}</span>
                <span class="hidden sm:inline">{{
                  formatRpDynamic(getUnitRev(u), false)
                }}</span>
              </h5>
            </div>

            <!-- BARIS 4: Label Tgt & Nilai Target Ringkas -->
            <div
              class="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400"
            >
              <span class="text-slate-400 shrink-0">Tgt:</span>
              <span
                class="font-bold text-slate-700 dark:text-slate-300 truncate"
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

          <!-- Progress Bar -->
          <div
            class="w-full bg-slate-100 dark:bg-slate-800 h-1 sm:h-1.5 rounded-full mt-2.5 overflow-hidden"
          >
            <div
              class="bg-button h-full rounded-full transition-all duration-500"
              :style="{ width: `${Math.min(getUnitCapaian(u), 100)}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- BARIS 1 CHARTS: Horizontal Unit, Vertikal Rev vs Promo, Pie Platform -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
      <!-- 1. Horizontal Bar: Rekap Penjualan Tiap Unit -->
      <div
        class="lg:col-span-5 glass-card p-4 rounded-2xl flex flex-col justify-between"
      >
        <h3 class="font-bold text-xs mb-3 text-slate-800 dark:text-slate-100">
          Rekap Penjualan Tiap Unit
        </h3>
        <div class="chart-container relative h-64">
          <canvas ref="chartUnitRef"></canvas>
        </div>
      </div>

      <!-- 2. Vertikal Bar: Perbandingan Revenue vs Biaya Promosi -->
      <div
        class="lg:col-span-3 glass-card p-4 rounded-2xl flex flex-col justify-between"
      >
        <h3 class="font-bold text-xs mb-3 text-slate-800 dark:text-slate-100">
          Revenue vs Biaya Promosi
        </h3>
        <div class="chart-container relative h-64">
          <canvas ref="chartRevVsPromoRef"></canvas>
        </div>
      </div>

      <!-- 3. Pie/Doughnut Chart: Penjualan per Platform -->
      <div
        class="lg:col-span-4 glass-card p-4 rounded-2xl flex flex-col justify-between"
      >
        <h3 class="font-bold text-xs mb-1 text-slate-800 dark:text-slate-100">
          Penjualan per Platform
        </h3>

        <!-- Ketinggian disesuaikan ke h-36/h-40 agar pas dengan setengah donat -->
        <div
          class="chart-container relative h-36 md:h-40 flex items-center justify-center overflow-hidden"
        >
          <canvas ref="chartPlatPieRef"></canvas>
        </div>
      </div>
    </div>

    <!-- BARIS 2 CHARTS: Rekap Per Divisi, Perbandingan Tahun Ini vs Lalu -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
      <!-- 1. Bar Chart: Rekap Penjualan Tiap Divisi -->
      <div
        class="lg:col-span-5 glass-card p-4 md:p-5 rounded-2xl md:rounded-1xl flex flex-col justify-between"
      >
        <h3 class="font-bold text-xs mb-3 text-slate-800 dark:text-slate-100">
          Rekap Penjualan Tiap Divisi
        </h3>
        <div class="chart-container relative h-64">
          <canvas ref="chartDivisiRef"></canvas>
        </div>
      </div>

      <!-- 2. Line Chart: Perbandingan Trend Revenue (Tahun Ini vs Tahun Lalu) -->
      <div
        class="lg:col-span-7 glass-card p-4 md:p-5 rounded-2xl md:rounded-1xl flex flex-col justify-between"
      >
        <h3 class="font-bold text-xs mb-3 text-slate-800 dark:text-slate-100">
          Trend Revenue Bulanan ({{ currentYear }} vs {{ lastYear }})
        </h3>
        <div class="chart-container relative h-64">
          <canvas ref="chartTrendCompareRef"></canvas>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted, watch } from "vue";
import { store } from "../store";
import Chart from "chart.js/auto";

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

// Tahun Dinamis
const currentYear = ref(new Date().getFullYear());
const lastYear = ref(currentYear.value - 1);

const formatRp = (num) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num || 0);

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

const filteredRev = computed(() => {
  const revData = store.db?.revenue || [];
  return revData.filter((r) => isDateInFilter(r.Tanggal));
});

const filteredPromo = computed(() => {
  const promoData = store.db?.promo || [];
  return promoData.filter((p) => isDateInFilter(p.Tanggal));
});

const filteredLeads = computed(() => {
  const leadsData = store.db?.leads || [];
  return leadsData.filter((l) => isDateInFilter(l.Tanggal));
});

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

const revThnLalu = computed(() =>
  (store.db?.revenue || []).filter(
    (r) => r.Tanggal && new Date(r.Tanggal).getFullYear() === lastYear.value,
  ),
);
const revThnLaluTotal = computed(() =>
  revThnLalu.value.reduce((s, r) => s + Number(r.Revenue || 0), 0),
);
const selisihThnLalu = computed(
  () => totRevFiltered.value - revThnLaluTotal.value,
);
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
  const revList = filteredRev.value || [];
  return revList
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

// Canvas References
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

// Array Warna Variatif untuk Bar Chart
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

  // 1. Horizontal Bar: Rekap Penjualan Tiap Unit (dengan Rounded Bar)
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
            borderRadius: 8, // <-- Ujung Rounded
          },
        ],
      },
      options: { indexAxis: "y", responsive: true, maintainAspectRatio: false },
    });
  }

  // 2. Vertikal Bar: Perbandingan Revenue vs Biaya Promosi
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
            borderRadius: 8, // <-- Ujung Rounded
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });
  }

  // 3. Pie/Doughnut Chart: Rekap Penjualan per Platform
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
        rotation: -90, // Mulai menggambar dari sudut kiri (-90°)
        circumference: 180, // Hanya menggambar setengah lingkaran (180°)
        cutout: "65%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              boxWidth: 10,
              padding: 6,
              font: { size: 10 },
            },
          },
        },
      },
    });
  }

  // 4. Bar Chart: Rekap Penjualan Tiap Divisi (URUT ABJAD + WARNA VARIAN + ROUNDED)
  const divMap = {};
  filteredRev.value.forEach((r) => {
    const divKey = r.Divisi || r.Kategori || "Umum";
    divMap[divKey] = (divMap[divKey] || 0) + Number(r.Revenue || 0);
  });

  // Logika Pengurutan Abjad A-Z
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
            backgroundColor: CHART_COLORS.slice(0, sortedDivisiLabels.length), // Warna bervariasi tiap balok
            borderRadius: 8, // <-- Ujung Rounded
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }, // Sembunyikan legend tunggal agar warna variatif bersih
        },
      },
    });
  }

  // 5. Line Chart: Perbandingan Tahun Ini vs Tahun Lalu
  const monthlyCurrentYear = Array(12).fill(0);
  const monthlyLastYear = Array(12).fill(0);

  const allRevenue = store.db?.revenue || [];
  allRevenue.forEach((r) => {
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

// Helper Format Rupiah Dinamis (Lengkap di Desktop, Ringkas di Mobile)
const formatRpDynamic = (val, isCompact = false) => {
  if (!val || isNaN(val)) return "Rp 0";
  const num = Number(val);

  // Jika opsi compact aktif (biasanya di mobile)
  if (isCompact) {
    if (Math.abs(num) >= 1_000_000_000) {
      // Format Miliar: 14.424.470.067 -> Rp 14,4 M
      return `Rp ${(num / 1_000_000_000).toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} M`;
    }
    if (Math.abs(num) >= 1_000_000) {
      // Format Juta: 4.735.529.933 -> Rp 4.735,5 jt
      return `Rp ${(num / 1_000_000).toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} jt`;
    }
  }

  // Format Standar Lengkap
  return `Rp ${new Intl.NumberFormat("id-ID").format(num)}`;
};
</script>
