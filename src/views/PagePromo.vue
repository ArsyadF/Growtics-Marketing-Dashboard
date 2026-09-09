<!-- src/views/pagepromo.vue -->
<template>
  <section id="page-promo" class="page-section space-y-4 md:space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
      <div>
        <h2 class="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100">Biaya Promosi</h2>
        <p class="text-slate-500 dark:text-slate-400 text-xs md:text-sm">
          Rekapitulasi dan Tren Pengeluaran Promosi Tiap Unit.
        </p>
      </div>
      <button 
        @click="store.openModal('promo')" 
        class="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-4 py-2.5 rounded-xl md:rounded-1xl font-medium text-xs shadow-md transition-all w-full sm:w-auto text-center cursor-pointer"
      >
        <i class="fa-solid fa-plus mr-1.5"></i>Input Biaya Promosi
      </button>
    </div>

    <!-- 1. Metric Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
      <div class="glass-card p-4 rounded-2xl flex items-center justify-between">
        <div>
          <p class="text-xs text-slate-400 font-medium">Total Biaya Promosi</p>
          <h3 class="text-base md:text-lg font-bold text-rose-500 mt-0.5">{{ formatRupiah(totalBiayaPromosi) }}</h3>
        </div>
        <div class="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold">
          <i class="fa-solid fa-bullhorn text-sm"></i>
        </div>
      </div>

      <div class="glass-card p-4 rounded-2xl flex items-center justify-between">
        <div>
          <p class="text-xs text-slate-400 font-medium">Rata-rata / Bulan</p>
          <h3 class="text-base md:text-lg font-bold text-slate-700 dark:text-slate-200 mt-0.5">{{ formatRupiah(rataRataBulan) }}</h3>
        </div>
        <div class="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
          <i class="fa-solid fa-calculator text-sm"></i>
        </div>
      </div>

      <div class="glass-card p-4 rounded-2xl flex items-center justify-between">
        <div>
          <p class="text-xs text-slate-400 font-medium">Pengeluaran Tertinggi</p>
          <h3 class="text-base md:text-lg font-bold text-amber-500 mt-0.5">
            {{ maxMonth.bulan ? `${maxMonth.bulan} (${formatRupiah(maxMonth.total)})` : '-' }}
          </h3>
        </div>
        <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
          <i class="fa-solid fa-chart-line text-sm"></i>
        </div>
      </div>
    </div>

    <!-- 2. Layout 3 Kolom Sejajar: Rekap Bulan, Rekap Triwulan, & Grafik Trend Smooth -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start">
      
      <!-- Kolom 1: Rekap Biaya Per Bulan -->
      <div class="lg:col-span-4 glass-card p-4 md:p-5 rounded-2xl md:rounded-1xl flex flex-col justify-start h-full">
        <div>
          <h3 class="font-bold text-slate-800 dark:text-slate-100 mb-3 text-xs md:text-sm">
            Rekap Biaya Promosi Per Bulan
          </h3>
          <div class="overflow-y-auto max-h-[260px] pr-1">
            <table class="min-w-full text-xs text-left">
              <thead class="bg-white/40 dark:bg-slate-800/60 text-slate-400 sticky top-0 backdrop-blur-md">
                <tr>
                  <th class="py-2 px-3">Bulan</th>
                  <th class="py-2 px-3 text-right">Biaya Promosi</th>
                </tr>
              </thead>
              <tbody class="divide-y dark:divide-slate-800/80">
                <tr v-if="monthlyRecap.length === 0">
                  <td colspan="2" class="text-center py-4 text-slate-400">Belum ada data bulanan.</td>
                </tr>
                <tr 
                  v-else 
                  v-for="(row, idx) in monthlyRecap" 
                  :key="idx" 
                  class="hover:bg-white/20 dark:hover:bg-slate-800/40"
                >
                  <td class="py-2.5 px-3 font-medium">{{ row.bulan }}</td>
                  <td class="py-2.5 px-3 text-right font-semibold text-rose-500">
                    {{ formatRupiah(row.total) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Kolom 2: Rekap Biaya Per Triwulan -->
      <div class="lg:col-span-4 glass-card p-4 md:p-5 rounded-2xl md:rounded-1xl flex flex-col justify-start h-full">
        <div>
          <h3 class="font-bold text-slate-800 dark:text-slate-100 mb-3 text-xs md:text-sm">
            Rekap Triwulan
          </h3>
          <div class="grid grid-cols-1 gap-2.5">
            <div 
              v-for="(q, idx) in quarterlyRecap" 
              :key="idx" 
              class="p-3 bg-white/30 dark:bg-slate-800/40 rounded-xl border border-white/20 dark:border-slate-700/50 flex justify-between items-center"
            >
              <p class="text-xs font-bold text-slate-500 dark:text-slate-400">{{ q.quarter }}</p>
              <p class="text-xs md:text-sm font-bold text-rose-500">
                {{ formatRupiah(q.total) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Kolom 3: Grafik Trend Biaya Promosi Bulanan (Presisi Round Dots & Smooth Curve) -->
      <div class="lg:col-span-4 glass-card p-4 md:p-5 rounded-2xl md:rounded-1xl flex flex-col justify-start h-full">
        <div>
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-bold text-slate-800 dark:text-slate-100 text-xs md:text-sm flex items-center gap-1.5">
              <i class="fa-solid fa-chart-line text-rose-500"></i>Grafik Trend Promosi Bulanan
            </h3>
            <span class="text-[10px] text-slate-400 font-medium">Tahun {{ new Date().getFullYear() }}</span>
          </div>

          <div v-if="monthlyRecap.length === 0" class="h-52 flex items-center justify-center text-xs text-slate-400">
            Belum ada data grafik.
          </div>

          <!-- HTML/CSS + SVG Container Campuran (Menjamin Dot Selalu Bulat Sempurna) -->
          <div v-else class="relative h-52 w-full pt-4">
            <!-- Grid Lines Background -->
            <div class="absolute inset-x-0 top-6 bottom-8 flex flex-col justify-between pointer-events-none">
              <div class="border-b border-dashed border-slate-200 dark:border-slate-700/50"></div>
              <div class="border-b border-dashed border-slate-200 dark:border-slate-700/50"></div>
              <div class="border-b border-dashed border-slate-200 dark:border-slate-700/50"></div>
            </div>

            <!-- Area Garis Line SVG -->
            <svg class="w-full h-36 overflow-visible relative z-0" viewBox="0 0 300 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="roseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#f43f5e" stop-opacity="0.30"/>
                  <stop offset="100%" stop-color="#f43f5e" stop-opacity="0.0"/>
                </linearGradient>
              </defs>
              <path :d="areaPath" fill="url(#roseGradient)" />
              <path :d="linePath" fill="none" stroke="#f43f5e" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
            </svg>

            <!-- HTML Absolute Bulatan (Dot) - Garansi Anti Gepeng/Lonjong -->
            <div class="absolute inset-x-0 top-4 h-36 z-10 pointer-events-none">
              <div 
                v-for="(pt, idx) in chartPointsHTML" 
                :key="idx"
                class="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group cursor-pointer"
                :style="{ left: `${pt.xPct}%`, top: `${pt.yPct}%` }"
              >
                <!-- Dot Outer Rings & Core -->
                <div class="w-4 h-4 rounded-full bg-white border-2 border-rose-500 shadow-md transition-transform duration-200 group-hover:scale-125 group-hover:bg-rose-500"></div>
                
                <!-- Tooltip Popup Nominal -->
                <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[9px] font-bold py-1 px-2 rounded-md shadow-lg whitespace-nowrap pointer-events-none">
                  {{ formatRupiah(pt.val) }}
                </div>
              </div>
            </div>

            <!-- Label Bulan X-Axis -->
            <div class="flex justify-between items-center text-[10px] text-slate-400 font-medium mt-2 px-1">
              <span v-for="(m, idx) in monthlyRecap" :key="idx" class="text-center truncate w-full">
                {{ m.bulan.substring(0, 3) }}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- 3. Management Data Table (Scrollable & Paginated) -->
    <div class="glass-card rounded-2xl md:rounded-1xl p-4 md:p-6 space-y-4">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h3 class="font-bold text-slate-800 dark:text-slate-100 text-xs md:text-sm">
          Manajemen Data Biaya Promosi
        </h3>
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
              <th @click="sortTable('Tanggal')" class="py-2.5 px-4 md:px-6 cursor-pointer select-none">
                Tanggal <i class="fa-solid fa-sort text-[10px] ml-1"></i>
              </th>
              <th @click="sortTable('Unit')" class="py-2.5 px-4 md:px-6 cursor-pointer select-none">
                Unit Usaha <i class="fa-solid fa-sort text-[10px] ml-1"></i>
              </th>
              <th @click="sortTable('BiayaPromosi')" class="py-2.5 px-4 md:px-6 cursor-pointer select-none">
                Biaya Promosi <i class="fa-solid fa-sort text-[10px] ml-1"></i>
              </th>
              <th class="py-2.5 px-4 md:px-6 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody class="divide-y dark:divide-slate-800/80">
            <tr v-if="store.isLoading">
              <td colspan="4" class="text-center py-4 text-slate-400">Memuat data promosi...</td>
            </tr>

            <tr v-else-if="paginatedPromo.length === 0">
              <td colspan="4" class="text-center py-4 text-slate-400">Tidak ada data biaya promosi.</td>
            </tr>

            <tr 
              v-else 
              v-for="item in paginatedPromo" 
              :key="item.id || item.Timestamp" 
              class="hover:bg-white/20 dark:hover:bg-slate-800/40"
            >
              <td class="py-3 px-4 md:px-6">{{ item.Tanggal ? String(item.Tanggal).substring(0, 10) : '-' }}</td>
              <td class="py-3 px-4 md:px-6 font-medium">{{ item.Unit || '-' }}</td>
              <td class="py-3 px-4 md:px-6 font-semibold text-rose-500">
                {{ formatRupiah(item.BiayaPromosi) }}
              </td>
              <td class="py-3 px-4 md:px-6 text-center space-x-2" style="display:inline-flex">
                <button @click="store.openModal('promo', item)" class="text-blue-500 hover:text-blue-600 p-1 cursor-pointer" title="Edit Promo">
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button @click="hapusPromo(item.id || item.Timestamp)" class="text-rose-500 hover:text-rose-600 p-1 cursor-pointer" title="Hapus Promo">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer Navigasi Pagination Controls -->
      <div v-if="itemsPerPage !== 'ALL' && totalPages > 1" class="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2 text-xs text-slate-400">
        <div>
          Menampilkan {{ startItem }} - {{ endItem }} dari {{ sortedPromo.length }} data
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
import { ref, computed, watch } from 'vue';
import { store } from '../store';
import { api } from '../services/api';

const currentPage = ref(1);
const itemsPerPage = ref('25');
const sortKey = ref('Tanggal');
const sortAsc = ref(false);

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const formatRupiah = (number) => {
  if (!number) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
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
  return list.filter(p => isDateInFilter(p.Tanggal));
});

// Rekap Bulanan Terurut Kronologis
const monthlyRecap = computed(() => {
  const recapMap = {};
  
  rawPromo.value.forEach(item => {
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
    .map(idx => ({
      monthIndex: idx,
      bulan: MONTH_NAMES[idx],
      total: recapMap[idx]
    }));
});

// Rekap Triwulan
const quarterlyRecap = computed(() => {
  const qMap = { 'Q1 (Jan - Mar)': 0, 'Q2 (Apr - Jun)': 0, 'Q3 (Jul - Sep)': 0, 'Q4 (Okt - Des)': 0 };
  
  rawPromo.value.forEach(item => {
    if (!item.Tanggal) return;
    const month = new Date(item.Tanggal).getMonth();
    const cost = Number(item.BiayaPromosi || 0);

    if (month >= 0 && month <= 2) qMap['Q1 (Jan - Mar)'] += cost;
    else if (month >= 3 && month <= 5) qMap['Q2 (Apr - Jun)'] += cost;
    else if (month >= 6 && month <= 8) qMap['Q3 (Jul - Sep)'] += cost;
    else if (month >= 9 && month <= 11) qMap['Q4 (Okt - Des)'] += cost;
  });

  return Object.keys(qMap).map(q => ({ quarter: q, total: qMap[q] }));
});

const totalBiayaPromosi = computed(() => rawPromo.value.reduce((s, p) => s + Number(p.BiayaPromosi || 0), 0));

const rataRataBulan = computed(() => {
  if (monthlyRecap.value.length === 0) return 0;
  return totalBiayaPromosi.value / monthlyRecap.value.length;
});

const maxMonth = computed(() => {
  if (monthlyRecap.value.length === 0) return { bulan: '', total: 0 };
  return monthlyRecap.value.reduce((max, cur) => cur.total > max.total ? cur : max, monthlyRecap.value[0]);
});

// --- PERHITUNGAN GRAFIK LINE & DOT ANTI GEPENG ---
const chartPointsHTML = computed(() => {
  const data = monthlyRecap.value;
  if (data.length === 0) return [];

  const maxVal = Math.max(...data.map(d => d.total), 1);
  const stepXPct = data.length > 1 ? 100 / (data.length - 1) : 50;

  return data.map((d, i) => {
    const xPct = data.length === 1 ? 50 : i * stepXPct;
    const yPct = 85 - ((d.total / maxVal) * 70); // Rentang 15% - 85% Y-axis
    return { xPct, yPct, val: d.total };
  });
});

const linePath = computed(() => {
  const points = chartPointsHTML.value;
  if (points.length === 0) return '';
  const width = 300;
  const height = 100;

  return points.reduce((acc, p, i) => {
    const x = (p.xPct / 100) * width;
    const y = (p.yPct / 100) * height;
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');
});

const areaPath = computed(() => {
  const points = chartPointsHTML.value;
  if (points.length === 0) return '';
  const lastX = (points[points.length - 1].xPct / 100) * 300;
  const firstX = (points[0].xPct / 100) * 300;
  return `${linePath.value} L ${lastX} 100 L ${firstX} 100 Z`;
});

// --- LOGIKA TABLE SORTING & PAGINATION ---
const sortedPromo = computed(() => {
  return [...rawPromo.value].sort((a, b) => {
    let modifier = sortAsc.value ? 1 : -1;
    if (a[sortKey.value] < b[sortKey.value]) return -1 * modifier;
    if (a[sortKey.value] > b[sortKey.value]) return 1 * modifier;
    return 0;
  });
});

const totalPages = computed(() => {
  if (itemsPerPage.value === 'ALL') return 1;
  const perPage = Number(itemsPerPage.value);
  return Math.ceil(sortedPromo.value.length / perPage) || 1;
});

const paginatedPromo = computed(() => {
  if (itemsPerPage.value === 'ALL') return sortedPromo.value;
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

watch(() => store.filterDates, () => {
  currentPage.value = 1;
}, { deep: true });

const sortTable = (key) => {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortKey.value = key;
    sortAsc.value = true;
  }
};

const hapusPromo = (docId) => {
  if (!docId) return;

  store.openAlert(
    'Konfirmasi Hapus',
    'Apakah Anda yakin ingin menghapus data biaya promosi ini?',
    async () => {
      store.isLoading = true;
      try {
        const res = await api.deleteData('promosi', docId);
        if (res.success) {
          await store.loadFullDatabase();
        } else {
          store.openAlert('Gagal', 'Gagal menghapus: ' + res.message, null, 'warning');
        }
      } catch (err) {
        store.openAlert('Error', 'Error: ' + err.message, null, 'warning');
      } finally {
        store.isLoading = false;
      }
    },
    'warning'
  );
};
</script>