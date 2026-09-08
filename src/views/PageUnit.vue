<!-- src/views/PageUnit.vue -->
<template>
  <section id="page-unit" class="page-section space-y-4 md:space-y-6">
    <!-- Filter Header Card -->
    <div class="glass-card p-4 rounded-2xl md:rounded-3xl space-y-3">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h3 class="text-base font-bold text-slate-800 dark:text-slate-100">
            Filter Khusus Unit <span class="text-blue-500">{{ selectedUnitName }}</span>
          </h3>
          <p class="text-slate-400 text-xs">Sesuaikan rekap berdasarkan bulan, divisi, atau platform.</p>
        </div>
        <button 
          @click="store.openModal('revenue', { Unit: selectedUnitName })" 
          class="bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white px-4 py-2 rounded-xl font-medium text-xs shadow-md transition-all text-center cursor-pointer"
        >
          <i class="fa-solid fa-plus mr-1.5"></i>Input Revenue {{ selectedUnitName }}
        </button>
      </div>

      <!-- Filters Row -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200/50 dark:border-slate-800/80">
        <div>
          <label class="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Filter Bulan</label>
          <select v-model="filterMonth" class="w-full glass-input rounded-xl p-2 text-xs dark:bg-slate-800 outline-none">
            <option value="ALL">Semua Bulan (Jan - Des)</option>
            <option value="0">Januari</option>
            <option value="1">Februari</option>
            <option value="2">Maret</option>
            <option value="3">April</option>
            <option value="4">Mei</option>
            <option value="5">Juni</option>
            <option value="6">Juli</option>
            <option value="7">Agustus</option>
            <option value="8">September</option>
            <option value="9">Oktober</option>
            <option value="10">November</option>
            <option value="11">Desember</option>
          </select>
        </div>

        <div>
          <label class="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Filter Divisi</label>
          <select v-model="filterDivisi" class="w-full glass-input rounded-xl p-2 text-xs dark:bg-slate-800 outline-none">
            <option value="ALL">Semua Divisi</option>
            <option value="CS Deal">CS Deal</option>
            <option value="Zona 1A">Zona 1A</option>
            <option value="Zona 1B">Zona 1B</option>
            <option value="Zona 2">Zona 2</option>
            <option value="Zona 3">Zona 3</option>
            <option value="Digital Marketing">Digital Marketing</option>
            <option value="Offline">Offline</option>
          </select>
        </div>

        <div>
          <label class="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Filter Platform</label>
          <select v-model="filterPlatform" class="w-full glass-input rounded-xl p-2 text-xs dark:bg-slate-800 outline-none">
            <option value="ALL">Semua Platform</option>
            <option value="Shopee">Shopee</option>
            <option value="TikTok Shop">TikTok Shop</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Website">Website</option>
            <option value="Siplah">Siplah</option>
            <option value="Toko Ladang">Toko Ladang</option>
            <option value="Blibli">Blibli</option>
            <option value="Event">Event</option>
            <option value="Mitra">Mitra</option>
            <option value="Kunjungan">Kunjungan</option>
            <option value="Konsinyasi">Konsinyasi</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Summary Metrics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6">
      <div class="glass-card p-4 md:p-5 rounded-2xl md:rounded-3xl border-l-4 border-l-emerald-400">
        <p class="text-slate-400 text-[11px] md:text-xs">Revenue Unit (Filtered)</p>
        <h3 class="text-base md:text-xl font-bold mt-0.5 text-slate-800 dark:text-slate-100">
          {{ formatRupiah(totalFilteredRevenue) }}
        </h3>
      </div>

      <div class="glass-card p-4 md:p-5 rounded-2xl md:rounded-3xl border-l-4 border-l-blue-400">
        <p class="text-slate-400 text-[11px] md:text-xs">Target Unit</p>
        <h3 class="text-base md:text-xl font-bold mt-0.5 text-slate-800 dark:text-slate-100">
          {{ formatRupiah(unitTarget) }}
        </h3>
      </div>

      <div class="glass-card p-4 md:p-5 rounded-2xl md:rounded-3xl border-l-4 border-l-amber-400">
        <p class="text-slate-400 text-[11px] md:text-xs">% Kontribusi Global</p>
        <h3 class="text-base md:text-xl font-bold mt-0.5 text-slate-800 dark:text-slate-100">
          {{ globalContribution }}%
        </h3>
      </div>
    </div>

    <!-- Monthly & Quarterly Rekap + Trend Chart -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start">
      
      <!-- 1. Rekap Revenue Per Bulan -->
      <div class="lg:col-span-4 glass-card p-4 md:p-5 rounded-2xl md:rounded-3xl flex flex-col justify-start h-full">
        <h3 class="font-bold text-slate-800 dark:text-slate-100 mb-3 text-xs md:text-sm">Rekap Revenue Per Bulan</h3>
        <div class="overflow-y-auto max-h-[260px] pr-1">
          <table class="min-w-full text-xs text-left">
            <thead class="bg-white/40 dark:bg-slate-800/60 text-slate-400 sticky top-0 backdrop-blur-md">
              <tr>
                <th class="py-2 px-3">Bulan</th>
                <th class="py-2 px-3 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody class="divide-y dark:divide-slate-800/80">
              <tr v-if="monthlyRecap.length === 0">
                <td colspan="2" class="text-center py-3 text-slate-400">Belum ada data.</td>
              </tr>
              <tr v-else v-for="(row, idx) in monthlyRecap" :key="idx" class="hover:bg-white/20 dark:hover:bg-slate-800/40">
                <td class="py-2 px-3 font-medium">{{ row.bulan }}</td>
                <td class="py-2 px-3 text-right font-semibold text-emerald-500">{{ formatRupiah(row.revenue) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 2. Rekap Triwulan -->
      <div class="lg:col-span-3 glass-card p-4 md:p-5 rounded-2xl md:rounded-3xl flex flex-col justify-start h-full">
        <h3 class="font-bold text-slate-800 dark:text-slate-100 mb-3 text-xs md:text-sm">Rekap Triwulan</h3>
        <div class="space-y-2">
          <div 
            v-for="(q, idx) in quarterlyRecap" 
            :key="idx" 
            class="p-2.5 bg-white/30 dark:bg-slate-800/40 rounded-xl border border-white/20 dark:border-slate-700/50 flex justify-between items-center"
          >
            <span class="text-xs font-bold text-slate-500 dark:text-slate-400">{{ q.quarter }}</span>
            <span class="text-xs font-bold text-emerald-500">{{ formatRupiah(q.revenue) }}</span>
          </div>
        </div>
      </div>

      <!-- 3. Chart Trend Revenue Bulanan -->
      <div class="lg:col-span-5 glass-card p-4 md:p-5 rounded-2xl md:rounded-3xl flex flex-col justify-start h-full">
        <h3 class="font-bold text-slate-800 dark:text-slate-100 mb-3 text-xs md:text-sm">Grafik Trend Revenue Bulanan</h3>
        <div class="chart-container relative h-60 w-full">
          <canvas ref="chartUnitMonthlyTrendRef"></canvas>
        </div>
      </div>
    </div>

    <!-- Detail Rekap Divisi/Platform & Platform Contribution Chart -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start">
      <div class="lg:col-span-6 glass-card p-4 md:p-6 rounded-2xl md:rounded-3xl flex flex-col justify-start h-full">
        <h3 class="font-bold text-slate-800 dark:text-slate-100 mb-3 md:mb-4 text-xs md:text-sm">Rekap per Divisi & Platform</h3>
        <div class="overflow-x-auto max-h-[260px]">
          <table class="min-w-full text-xs text-left">
            <thead class="bg-white/40 dark:bg-slate-800/60 text-slate-400 sticky top-0 backdrop-blur-md">
              <tr>
                <th class="py-2 px-3">Divisi / Platform</th>
                <th class="py-2 px-3 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody class="divide-y dark:divide-slate-800/80">
              <tr v-if="detailRecap.length === 0">
                <td colspan="2" class="text-center py-3 text-slate-400">Tidak ada detail rekap.</td>
              </tr>
              <tr v-else v-for="(item, idx) in detailRecap" :key="idx" class="hover:bg-white/20 dark:hover:bg-slate-800/40">
                <td class="py-2 px-3 font-medium">{{ item.label }}</td>
                <td class="py-2 px-3 text-right font-semibold text-emerald-500">{{ formatRupiah(item.revenue) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="lg:col-span-6 glass-card p-4 md:p-6 rounded-2xl md:rounded-3xl flex flex-col justify-start h-full">
        <h3 class="font-bold text-slate-800 dark:text-slate-100 mb-3 md:mb-4 text-xs md:text-sm">Kontribusi Platform</h3>
        <div class="chart-container relative h-60 w-full">
          <canvas ref="chartUnitPlatformRef"></canvas>
        </div>
      </div>
    </div>

    <!-- Management Data Table (Scrollable & Paginated) -->
    <div class="glass-card p-4 md:p-6 rounded-2xl md:rounded-3xl space-y-4">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h3 class="font-bold text-slate-800 dark:text-slate-100 text-xs md:text-sm">Manajemen Data Revenue Unit {{ selectedUnitName }}</h3>
        <div class="flex items-center gap-2">
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

      <!-- Area Scrollable Tabel dengan Sticky Header -->
      <div class="overflow-x-auto max-h-[400px] overflow-y-auto pr-1">
        <table class="min-w-full text-xs text-left">
          <thead class="bg-white/80 dark:bg-slate-800/90 text-slate-400 sticky top-0 backdrop-blur-md z-10">
            <tr>
              <th @click="sortTable('Tanggal')" class="py-2.5 px-3 cursor-pointer select-none">
                Tanggal <i class="fa-solid fa-sort text-[10px] ml-1"></i>
              </th>
              <th @click="sortTable('Divisi')" class="py-2.5 px-3 cursor-pointer select-none">
                Divisi <i class="fa-solid fa-sort text-[10px] ml-1"></i>
              </th>
              <th @click="sortTable('Platform')" class="py-2.5 px-3 cursor-pointer select-none">
                Platform <i class="fa-solid fa-sort text-[10px] ml-1"></i>
              </th>
              <th @click="sortTable('Revenue')" class="py-2.5 px-3 cursor-pointer select-none">
                Revenue <i class="fa-solid fa-sort text-[10px] ml-1"></i>
              </th>
              <th class="py-2.5 px-4 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody class="divide-y dark:divide-slate-800/80">
            <tr v-if="store.isLoading">
              <td colspan="5" class="text-center py-4 text-slate-400">Memuat data revenue...</td>
            </tr>

            <tr v-else-if="paginatedRevenue.length === 0">
              <td colspan="5" class="text-center py-4 text-slate-400">Tidak ada data revenue.</td>
            </tr>

            <tr 
              v-else 
              v-for="item in paginatedRevenue" 
              :key="item.id || item.Timestamp" 
              class="hover:bg-white/20 dark:hover:bg-slate-800/40"
            >
              <td class="py-2 px-3">{{ item.Tanggal ? item.Tanggal.substring(0, 10) : '-' }}</td>
              <td class="py-2 px-3 font-medium">{{ item.Divisi || '-' }}</td>
              <td class="py-2 px-3">{{ item.Platform || '-' }}</td>
              <td class="py-2 px-3 font-semibold text-emerald-500">{{ formatRupiah(item.Revenue) }}</td>
              <td class="py-2 px-3 text-center space-x-2">
                <button 
                  @click="store.openModal('revenue', item)" 
                  class="text-blue-500 hover:text-blue-600 p-1 cursor-pointer"
                  title="Edit Revenue"
                >
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button @click="hapusRevenue(item.id || item.Timestamp)" class="text-rose-500 hover:text-rose-600 cursor-pointer">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer Pagination Kontrol -->
      <div v-if="itemsPerPage !== 'ALL' && totalPages > 1" class="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2 text-xs text-slate-400">
        <div>
          Menampilkan {{ startItem }} - {{ endItem }} dari {{ sortedRevenue.length }} data
        </div>
        <div class="flex items-center gap-1.5">
          <button 
            @click="currentPage--" 
            :disabled="currentPage === 1"
            class="px-2.5 py-1.5 rounded-lg glass-input disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/40 dark:hover:bg-slate-800 cursor-pointer"
          >
            <i class="fa-solid fa-chevron-left text-[10px]"></i>
          </button>

          <span class="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-500 font-bold">
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
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { store } from '../store';
import { api } from '../services/api';
import Chart from 'chart.js/auto';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const selectedUnitName = computed(() => {
  if (store.currentPage.startsWith('unit-')) {
    return store.currentPage.replace('unit-', '').toUpperCase();
  }
  return 'NHP';
});

const filterMonth = ref('ALL');
const filterDivisi = ref('ALL');
const filterPlatform = ref('ALL');

// State Pagination & Sorting
const currentPage = ref(1);
const itemsPerPage = ref('25');
const sortKey = ref('Tanggal');
const sortAsc = ref(false);

const chartUnitMonthlyTrendRef = ref(null);
const chartUnitPlatformRef = ref(null);
let trendChartInstance = null;
let platformChartInstance = null;

const formatRupiah = (val) => {
  if (!val) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
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

const globalTargetTotal = computed(() => {
  return Number(store.db.master?.TargetTahunIni || 1000000000);
});

const filteredRevenue = computed(() => {
  const allRevenue = store.db.revenue || [];
  
  return allRevenue.filter(item => {
    if (item.Unit !== selectedUnitName.value) return false;
    if (!isDateInFilter(item.Tanggal)) return false;

    if (filterMonth.value !== 'ALL' && item.Tanggal) {
      const month = new Date(item.Tanggal).getMonth();
      if (month !== Number(filterMonth.value)) return false;
    }

    if (filterDivisi.value !== 'ALL' && item.Divisi !== filterDivisi.value) return false;
    if (filterPlatform.value !== 'ALL' && item.Platform !== filterPlatform.value) return false;

    return true;
  });
});

const totalFilteredRevenue = computed(() => {
  return filteredRevenue.value.reduce((acc, curr) => acc + Number(curr.Revenue || 0), 0);
});

const globalContribution = computed(() => {
  if (!globalTargetTotal.value) return '0.0';
  return ((totalFilteredRevenue.value / globalTargetTotal.value) * 100).toFixed(1);
});

// Rekap Bulanan Terurut Kronologis
const monthlyRecap = computed(() => {
  const recapMap = {};
  filteredRevenue.value.forEach(item => {
    if (!item.Tanggal) return;
    const mIdx = new Date(item.Tanggal).getMonth();
    if (isNaN(mIdx)) return;
    if (!recapMap[mIdx]) recapMap[mIdx] = 0;
    recapMap[mIdx] += Number(item.Revenue || 0);
  });

  return Object.keys(recapMap)
    .map(Number)
    .sort((a, b) => a - b)
    .map(idx => ({
      bulan: MONTH_NAMES[idx],
      revenue: recapMap[idx]
    }));
});

const quarterlyRecap = computed(() => {
  const qMap = { 'Q1 (Jan - Mar)': 0, 'Q2 (Apr - Jun)': 0, 'Q3 (Jul - Sep)': 0, 'Q4 (Okt - Des)': 0 };
  
  filteredRevenue.value.forEach(item => {
    if (!item.Tanggal) return;
    const month = new Date(item.Tanggal).getMonth();
    const rev = Number(item.Revenue || 0);

    if (month >= 0 && month <= 2) qMap['Q1 (Jan - Mar)'] += rev;
    else if (month >= 3 && month <= 5) qMap['Q2 (Apr - Jun)'] += rev;
    else if (month >= 6 && month <= 8) qMap['Q3 (Jul - Sep)'] += rev;
    else if (month >= 9 && month <= 11) qMap['Q4 (Okt - Des)'] += rev;
  });

  return Object.keys(qMap).map(q => ({ quarter: q, revenue: qMap[q] }));
});

const detailRecap = computed(() => {
  const map = {};
  filteredRevenue.value.forEach(item => {
    const key = `${item.Divisi || 'Lainnya'} - ${item.Platform || 'Lainnya'}`;
    if (!map[key]) map[key] = 0;
    map[key] += Number(item.Revenue || 0);
  });

  return Object.keys(map).map(k => ({ label: k, revenue: map[k] }));
});

// Sorting Logic
const sortedRevenue = computed(() => {
  return [...filteredRevenue.value].sort((a, b) => {
    let modifier = sortAsc.value ? 1 : -1;
    if (a[sortKey.value] < b[sortKey.value]) return -1 * modifier;
    if (a[sortKey.value] > b[sortKey.value]) return 1 * modifier;
    return 0;
  });
});

// Pagination Calculations
const totalPages = computed(() => {
  if (itemsPerPage.value === 'ALL') return 1;
  const perPage = Number(itemsPerPage.value);
  return Math.ceil(sortedRevenue.value.length / perPage) || 1;
});

const paginatedRevenue = computed(() => {
  if (itemsPerPage.value === 'ALL') return sortedRevenue.value;
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

// Reset Halaman Saat Filter Berganti
watch([selectedUnitName, filterMonth, filterDivisi, filterPlatform], () => {
  currentPage.value = 1;
});

const sortTable = (key) => {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortKey.value = key;
    sortAsc.value = true;
  }
};

const hapusRevenue = async (docId) => {
  if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
    store.isLoading = true;
    try {
      const res = await api.deleteData('revenues', docId);
      if (res.success) {
        await store.loadFullDatabase();
      } else {
        alert("Gagal menghapus: " + res.message);
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      store.isLoading = false;
    }
  }
};

const initCharts = () => {
  if (!chartUnitMonthlyTrendRef.value || !chartUnitPlatformRef.value) return;

  if (trendChartInstance) trendChartInstance.destroy();
  if (platformChartInstance) platformChartInstance.destroy();

  trendChartInstance = new Chart(chartUnitMonthlyTrendRef.value, {
    type: 'line',
    data: {
      labels: monthlyRecap.value.map(m => m.bulan.substring(0, 3)),
      datasets: [{
        label: 'Revenue',
        data: monthlyRecap.value.map(m => m.revenue),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  const platformData = {};
  filteredRevenue.value.forEach(i => {
    const p = i.Platform || 'Lainnya';
    platformData[p] = (platformData[p] || 0) + Number(i.Revenue || 0);
  });

  platformChartInstance = new Chart(chartUnitPlatformRef.value, {
    type: 'doughnut',
    data: {
      labels: Object.keys(platformData),
      datasets: [{
        data: Object.values(platformData),
        backgroundColor: ['#3b82f6', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
};

watch([filteredRevenue, selectedUnitName], () => {
  initCharts();
}, { deep: true });

onMounted(() => {
  initCharts();
});
</script>