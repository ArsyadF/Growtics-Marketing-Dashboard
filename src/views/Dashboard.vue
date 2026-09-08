<!-- dashboard.vue -->
<template>
  <section id="page-main" class="page-section space-y-4 md:space-y-6">
    <!-- Top Row: Kinerja Finansial & Funnel Marketing -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-stretch">
      
      <!-- Card Kinerja Finansial -->
      <div class="lg:col-span-7 glass-card rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col justify-between relative overflow-hidden">
        <div class="flex justify-between items-center mb-3 md:mb-4">
          <span class="text-[10px] md:text-[11px] font-bold uppercase text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
            Kinerja Finansial
          </span>
          <span class="text-[11px] md:text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            {{ persenCapaian }}% Target
          </span>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 md:gap-4 my-1 md:my-2">
          <div class="p-3 md:p-4 rounded-xl md:rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <p class="text-[11px] md:text-xs text-amber-700 dark:text-amber-300 font-medium">Target 1 Tahun</p>
            <h3 class="text-sm md:text-base font-bold text-amber-800 dark:text-amber-200 mt-0.5">
              {{ formatRp(targetTahun) }}
            </h3>
          </div>
          <div class="p-3 md:p-4 rounded-xl md:rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <p class="text-[11px] md:text-xs text-emerald-700 dark:text-emerald-300 font-medium">Revenue Terfilter</p>
            <h3 class="text-sm md:text-base font-bold text-emerald-800 dark:text-emerald-200 mt-0.5">
              {{ formatRp(totRevFiltered) }}
            </h3>
          </div>
          <div class="p-3 md:p-4 rounded-xl md:rounded-2xl bg-rose-500/10 border border-rose-500/20">
            <p class="text-[11px] md:text-xs text-rose-700 dark:text-rose-300 font-medium">Sisa Target</p>
            <h3 class="text-sm md:text-base font-bold text-rose-800 dark:text-rose-200 mt-0.5">
              {{ formatRp(gap > 0 ? gap : 0) }}
            </h3>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 md:gap-4 mt-2 pt-3 border-t border-slate-200/50 dark:border-slate-800/80 text-[11px] md:text-xs">
          <div>
            <span class="text-slate-400">Selisih vs Thn Lalu:</span>
            <span class="font-bold text-blue-600 dark:text-blue-400 ml-1">{{ formatRp(selisihThnLalu) }}</span>
          </div>
          <div>
            <span class="text-slate-400">Total Biaya Promo:</span>
            <span class="font-bold text-rose-500 dark:text-rose-400 ml-1">{{ formatRp(totPromo) }}</span>
          </div>
        </div>
      </div>

      <!-- Card Funnel Marketing -->
      <div class="lg:col-span-5 glass-card rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col justify-between">
        <div class="flex justify-between items-center mb-3 md:mb-4">
          <span class="text-[10px] md:text-[11px] font-bold uppercase text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20">
            Funnel Marketing
          </span>
          <span class="text-[11px] md:text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">
            {{ pctOrderFromLeads }}% Konversi
          </span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center my-auto py-2">
          <div class="p-2.5 bg-white/40 dark:bg-slate-900/50 rounded-2xl border border-white/20 dark:border-slate-800/60">
            <p class="text-[9px] text-slate-400 uppercase font-semibold tracking-wider">Campaign</p>
            <h4 class="text-sm md:text-base font-bold text-blue-600 dark:text-blue-400 mt-1">{{ totCamp.toLocaleString('id-ID') }}</h4>
          </div>
          <div class="p-2.5 bg-white/40 dark:bg-slate-900/50 rounded-2xl border border-white/20 dark:border-slate-800/60">
            <p class="text-[9px] text-slate-400 uppercase font-semibold tracking-wider">Leads</p>
            <h4 class="text-sm md:text-base font-bold text-sky-500 mt-1">{{ totLeads.toLocaleString('id-ID') }}</h4>
          </div>
          <div class="p-2.5 bg-white/40 dark:bg-slate-900/50 rounded-2xl border border-white/20 dark:border-slate-800/60">
            <p class="text-[9px] text-slate-400 uppercase font-semibold tracking-wider">Follow Up</p>
            <h4 class="text-sm md:text-base font-bold text-amber-500 mt-1">{{ totFu.toLocaleString('id-ID') }}</h4>
          </div>
          <div class="p-2.5 bg-white/40 dark:bg-slate-900/50 rounded-2xl border border-white/20 dark:border-slate-800/60">
            <p class="text-[9px] text-slate-400 uppercase font-semibold tracking-wider">Pesanan</p>
            <h4 class="text-sm md:text-base font-bold text-emerald-500 mt-1">{{ totOrder.toLocaleString('id-ID') }}</h4>
          </div>
        </div>
      </div>
    </div>

    <!-- Cards Performa Unit Usaha -->
    <div>
      <h3 class="font-bold text-slate-800 dark:text-slate-100 mb-2 text-xs uppercase tracking-wider">Rekap Performa Unit Usaha</h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <div v-for="u in ['NHP', 'NHC', 'KG']" :key="u" class="glass-card p-4 rounded-2xl">
          <div class="flex justify-between items-center mb-1">
            <h4 class="font-bold text-slate-700 dark:text-slate-200 text-xs">Unit {{ u }}</h4>
            <span class="text-[10px] font-semibold text-blue-500">{{ getUnitCapaian(u) }}%</span>
          </div>
          <p class="text-xs text-slate-400">Revenue: <span class="font-bold text-emerald-500">{{ formatRp(getUnitRev(u)) }}</span></p>
          <p class="text-xs text-slate-400">Target: <span class="font-bold text-slate-600 dark:text-slate-300">{{ formatRp(getUnitTarget(u)) }}</span></p>
        </div>
      </div>
    </div>

    <!-- BARIS 1 CHARTS: Horizontal Unit, Vertikal Rev vs Promo, Pie Platform -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
      
      <!-- 1. Horizontal Bar: Rekap Penjualan Tiap Unit -->
      <div class="lg:col-span-5 glass-card p-4 rounded-2xl flex flex-col justify-between">
        <h3 class="font-bold text-xs mb-3 text-slate-800 dark:text-slate-100">Rekap Penjualan Tiap Unit</h3>
        <div class="chart-container relative h-64"><canvas ref="chartUnitRef"></canvas></div>
      </div>

      <!-- 2. Vertikal Bar: Perbandingan Revenue vs Biaya Promosi -->
      <div class="lg:col-span-3 glass-card p-4 rounded-2xl flex flex-col justify-between">
        <h3 class="font-bold text-xs mb-3 text-slate-800 dark:text-slate-100">Revenue vs Biaya Promosi</h3>
        <div class="chart-container relative h-64"><canvas ref="chartRevVsPromoRef"></canvas></div>
      </div>

      <!-- 3. Pie/Doughnut Chart: Penjualan per Platform -->
      <div class="lg:col-span-4 glass-card p-4 rounded-2xl flex flex-col justify-between">
        <h3 class="font-bold text-xs mb-3 text-slate-800 dark:text-slate-100">Penjualan per Platform</h3>
        <div class="chart-container relative h-64 flex items-center justify-center">
          <canvas ref="chartPlatPieRef"></canvas>
        </div>
      </div>

    </div>

    <!-- BARIS 2 CHARTS: Rekap Per Divisi, Perbandingan Tahun Ini vs Lalu -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
      
      <!-- 1. Bar Chart: Rekap Penjualan Tiap Divisi -->
      <div class="lg:col-span-5 glass-card p-4 md:p-5 rounded-2xl md:rounded-3xl flex flex-col justify-between">
        <h3 class="font-bold text-xs mb-3 text-slate-800 dark:text-slate-100">Rekap Penjualan Tiap Divisi</h3>
        <div class="chart-container relative h-64"><canvas ref="chartDivisiRef"></canvas></div>
      </div>

      <!-- 2. Line Chart: Perbandingan Trend Revenue (Tahun Ini vs Tahun Lalu) -->
      <div class="lg:col-span-7 glass-card p-4 md:p-5 rounded-2xl md:rounded-3xl flex flex-col justify-between">
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
import { computed, ref, onMounted, watch } from 'vue';
import { store } from '../store';
import Chart from 'chart.js/auto';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

// Tahun Dinamis
const currentYear = ref(new Date().getFullYear());
const lastYear = ref(currentYear.value - 1);

const formatRp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);

function isDateInFilter(dStr) {
  if (!dStr) return false;
  const d = new Date(dStr).setHours(0,0,0,0);
  const s = store.filterDates?.start ? new Date(store.filterDates.start).setHours(0,0,0,0) : null;
  const e = store.filterDates?.end ? new Date(store.filterDates.end).setHours(23,59,59,999) : null;
  if (s && d < s) return false;
  if (e && d > e) return false;
  return true;
}

const filteredRev = computed(() => {
  const revData = store.db?.revenue || [];
  return revData.filter(r => isDateInFilter(r.Tanggal));
});

const filteredPromo = computed(() => {
  const promoData = store.db?.promo || [];
  return promoData.filter(p => isDateInFilter(p.Tanggal));
});

const filteredLeads = computed(() => {
  const leadsData = store.db?.leads || [];
  return leadsData.filter(l => isDateInFilter(l.Tanggal));
});

const targetTahun = computed(() => Number(store.db.master?.TargetTahunIni || 0));
const totRevFiltered = computed(() => filteredRev.value.reduce((s, r) => s + Number(r.Revenue || 0), 0));
const gap = computed(() => targetTahun.value - totRevFiltered.value);
const persenCapaian = computed(() => targetTahun.value > 0 ? ((totRevFiltered.value / targetTahun.value) * 100).toFixed(1) : '0');

const revThnLalu = computed(() => (store.db?.revenue || []).filter(r => r.Tanggal && new Date(r.Tanggal).getFullYear() === lastYear.value));
const revThnLaluTotal = computed(() => revThnLalu.value.reduce((s, r) => s + Number(r.Revenue || 0), 0));
const selisihThnLalu = computed(() => totRevFiltered.value - revThnLaluTotal.value);
const totPromo = computed(() => filteredPromo.value.reduce((s, p) => s + Number(p.BiayaPromosi || 0), 0));

const totCamp = computed(() => filteredLeads.value.reduce((s, l) => s + Number(l.Campaign || 0), 0));
const totLeads = computed(() => filteredLeads.value.reduce((s, l) => s + Number(l.DatabaseLeads || 0), 0));
const totFu = computed(() => filteredLeads.value.reduce((s, l) => s + Number(l.FollowUp || 0), 0));
const totOrder = computed(() => filteredLeads.value.reduce((s, l) => s + Number(l.Pesanan || 0), 0));
const pctOrderFromLeads = computed(() => totLeads.value > 0 ? ((totOrder.value / totLeads.value) * 100).toFixed(1) : '0');

function getUnitRev(unit) { 
  const revList = filteredRev.value || [];
  return revList.filter(r => r.Unit === unit).reduce((s, r) => s + Number(r.Revenue || 0), 0); 
}
function getUnitTarget(unit) { return Number(store.db.master?.[`Target${unit}`] || 0); }
function getUnitCapaian(unit) { const t = getUnitTarget(unit); return t > 0 ? ((getUnitRev(unit) / t) * 100).toFixed(1) : '0'; }

// Canvas References
const chartUnitRef = ref(null);
const chartRevVsPromoRef = ref(null);
const chartPlatPieRef = ref(null);
const chartDivisiRef = ref(null);
const chartTrendCompareRef = ref(null);

let cUnitInstance = null, cRevVsPromoInstance = null, cPlatPieInstance = null, cDivisiInstance = null, cTrendCompareInstance = null;

// Array Warna Variatif untuk Bar Chart
const CHART_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', 
  '#ec4899', '#0ea5e9', '#6366f1', '#14b8a6', 
  '#f97316', '#a855f7', '#06b6d4', '#84cc16'
];

function renderCharts() {
  if (cUnitInstance) cUnitInstance.destroy();
  if (cRevVsPromoInstance) cRevVsPromoInstance.destroy();
  if (cPlatPieInstance) cPlatPieInstance.destroy();
  if (cDivisiInstance) cDivisiInstance.destroy();
  if (cTrendCompareInstance) cTrendCompareInstance.destroy();

  // 1. Horizontal Bar: Rekap Penjualan Tiap Unit (dengan Rounded Bar)
  const uNames = ['NHP', 'NHC', 'KG'];
  const uRevs = uNames.map(u => getUnitRev(u));
  if (chartUnitRef.value) {
    cUnitInstance = new Chart(chartUnitRef.value, {
      type: 'bar',
      data: { 
        labels: uNames, 
        datasets: [{ 
          label: 'Revenue Unit', 
          data: uRevs, 
          backgroundColor: CHART_COLORS,
          borderRadius: 8 // <-- Ujung Rounded
        }] 
      },
      options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false }
    });
  }

  // 2. Vertikal Bar: Perbandingan Revenue vs Biaya Promosi
  if (chartRevVsPromoRef.value) {
    cRevVsPromoInstance = new Chart(chartRevVsPromoRef.value, {
      type: 'bar',
      data: {
        labels: ['Revenue', 'Biaya Promo'],
        datasets: [{
          label: 'Nominal (Rp)',
          data: [totRevFiltered.value, totPromo.value],
          backgroundColor: ['#10b981', '#f43f5e'],
          borderRadius: 8 // <-- Ujung Rounded
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  // 3. Pie/Doughnut Chart: Rekap Penjualan per Platform
  const pMap = {};
  filteredRev.value.forEach(r => { pMap[r.Platform || 'Lainnya'] = (pMap[r.Platform || 'Lainnya'] || 0) + Number(r.Revenue || 0); });
  if (chartPlatPieRef.value) {
    cPlatPieInstance = new Chart(chartPlatPieRef.value, {
      type: 'doughnut',
      data: {
        labels: Object.keys(pMap),
        datasets: [{
          data: Object.values(pMap),
          backgroundColor: CHART_COLORS,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        cutout: '65%'
      }
    });
  }

  // 4. Bar Chart: Rekap Penjualan Tiap Divisi (URUT ABJAD + WARNA VARIAN + ROUNDED)
  const divMap = {};
  filteredRev.value.forEach(r => { 
    const divKey = r.Divisi || r.Kategori || 'Umum';
    divMap[divKey] = (divMap[divKey] || 0) + Number(r.Revenue || 0); 
  });

  // Logika Pengurutan Abjad A-Z
  const sortedDivisiLabels = Object.keys(divMap).sort((a, b) => a.localeCompare(b, 'id', { sensitivity: 'base' }));
  const sortedDivisiValues = sortedDivisiLabels.map(label => divMap[label]);

  if (chartDivisiRef.value) {
    cDivisiInstance = new Chart(chartDivisiRef.value, {
      type: 'bar',
      data: {
        labels: sortedDivisiLabels.length > 0 ? sortedDivisiLabels : ['Belum Ada Data'],
        datasets: [{
          label: 'Revenue Divisi',
          data: sortedDivisiValues.length > 0 ? sortedDivisiValues : [0],
          backgroundColor: CHART_COLORS.slice(0, sortedDivisiLabels.length), // Warna bervariasi tiap balok
          borderRadius: 8, // <-- Ujung Rounded
        }]
      },
      options: { 
        responsive: true, 
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false } // Sembunyikan legend tunggal agar warna variatif bersih
        }
      }
    });
  }

  // 5. Line Chart: Perbandingan Tahun Ini vs Tahun Lalu
  const monthlyCurrentYear = Array(12).fill(0);
  const monthlyLastYear = Array(12).fill(0);

  const allRevenue = store.db?.revenue || [];
  allRevenue.forEach(r => {
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
      type: 'line',
      data: {
        labels: MONTH_NAMES,
        datasets: [
          {
            label: `Revenue ${currentYear.value}`,
            data: monthlyCurrentYear,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#3b82f6'
          },
          {
            label: `Revenue ${lastYear.value}`,
            data: monthlyLastYear,
            borderColor: '#64748b',
            borderDash: [5, 5],
            fill: false,
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: '#64748b'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } }
      }
    });
  }
}

onMounted(() => renderCharts());
watch([filteredRev, filteredPromo, store.filterDates], () => renderCharts(), { deep: true });
</script>