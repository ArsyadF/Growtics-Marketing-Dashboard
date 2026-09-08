<!-- src/components/Header.vue -->
<template>
  <header class="transparent-header sticky top-0 z-10 px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row gap-3 md:gap-0 justify-between md:items-center">
    <div class="flex justify-between items-center w-full md:w-auto">
      <div class="flex items-center space-x-3">
        <!-- Tombol Hamburger Mobile -->
       <button 
        @click.stop="$emit('toggle-sidebar')" 
        type="button"
        class="md:hidden text-slate-600 dark:text-slate-300 hover:text-blue-600 p-2.5 rounded-xl glass-card flex items-center justify-center shrink-0 cursor-pointer z-20 relative"
        title="Buka Menu"
         >
      <i class="fa-solid fa-bars text-lg"></i>
      </button>
        <h2 class="text-base glass-input p-1.5 rounded-xl md:text-xl font-bold text-slate-800 dark:text-slate-100 truncate">
          {{ dynamicPageTitle }}
        </h2>
      </div>
      
      <!-- Tombol Dark Mode Mobile -->
      <button 
        @click="store.toggleDarkMode()" 
        class="md:hidden p-2 rounded-xl glass-card text-slate-600 dark:text-amber-400 cursor-pointer"
      >
        <i class="fa-solid" :class="store.isDarkMode ? 'fa-sun text-amber-400' : 'fa-moon text-slate-600'"></i>
      </button>
    </div>
    
    <div class="flex items-center justify-between md:justify-end space-x-2 md:space-x-3">
      <!-- Filter Tanggal Global -->
      <div class="flex items-center space-x-1.5 md:space-x-2 glass-input p-1.5 rounded-xl text-xs w-full md:w-auto overflow-x-auto">
        <span class="text-slate-500 dark:text-slate-400 font-medium px-1 hidden sm:inline">Filter:</span>
        
        <input 
          v-model="tempStartDate" 
          type="date" 
          class="bg-transparent rounded-lg px-1.5 py-1 dark:text-slate-100 outline-none w-28 sm:w-auto text-[11px] sm:text-xs"
        >
        <span class="dark:text-slate-400">-</span>
        <input 
          v-model="tempEndDate" 
          type="date" 
          class="bg-transparent rounded-lg px-1.5 py-1 dark:text-slate-100 outline-none w-28 sm:w-auto text-[11px] sm:text-xs"
        >
        
        <!-- Tombol Terapkan -->
        <button 
          @click="applyFilter" 
          class="bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white px-2.5 sm:px-3 py-1 rounded-lg font-medium transition-all shadow-md text-[11px] sm:text-xs cursor-pointer flex items-center gap-1"
          title="Terapkan Filter Tanggal"
        >
          <i class="fa-solid fa-filter"></i>
          <span class="hidden sm:inline">Terapkan</span>
        </button>

        <!-- Tombol Reset (1 Jan Awal Tahun - Hari Ini) -->
        <button 
          @click="resetFilter" 
          class="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 sm:px-2.5 py-1 rounded-lg font-medium transition-all text-[11px] sm:text-xs cursor-pointer flex items-center gap-1"
          title="Reset ke Awal Tahun s/d Hari Ini"
        >
          <i class="fa-solid fa-rotate-left"></i>
          <span class="hidden sm:inline">Reset</span>
        </button>
      </div>

      <!-- Desktop Dark Mode Toggle -->
      <button 
        @click="store.toggleDarkMode()" 
        class="hidden md:block p-2.5 rounded-2xl glass-card text-slate-600 dark:text-amber-400 hover:scale-105 transition-all cursor-pointer"
      >
        <i class="fa-solid" :class="store.isDarkMode ? 'fa-sun text-amber-400 text-lg' : 'fa-moon text-slate-600 text-lg'"></i>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { store } from '../store';

const props = defineProps({
  pageTitle: {
    type: String,
    default: ''
  }
});

defineEmits(['toggle-sidebar']);

// State Sementara (Lokal Input)
const tempStartDate = ref('');
const tempEndDate = ref('');

// Computed Pemetaan Judul Halaman Dinamis dari Store
const dynamicPageTitle = computed(() => {
  // Jika props.pageTitle di-pass eksplisit dan tidak kosong, utamakan props
  if (props.pageTitle) return props.pageTitle;

  const current = store.currentPage || 'main';

  // Pemetaan ID Halaman ke Judul Resmi Header
  const titleMap = {
    'main': 'Dashboard Utama',
    'unit-NHP': 'Performa Unit NHP',
    'unit-NHC': 'Performa Unit NHC',
    'unit-KG': 'Performa Unit KG',
    'leads': 'Leads & Campaign',
    'promo': 'Biaya Promosi',
    'targets': 'Pengaturan Target Revenue',
    'users': 'Manajemen Akses Pengguna',
    'profile': 'Profil Pengguna'
  };

  if (titleMap[current]) {
    return titleMap[current];
  }

  // Handle jika ada format dinamis 'unit-xxx' yang belum terdaftar
  if (current.startsWith('unit-')) {
    const unitCode = current.replace('unit-', '').toUpperCase();
    return `Performa Unit ${unitCode}`;
  }

  return 'Dashboard Utama';
});

// Helper: Format Tanggal Hari Ini (YYYY-MM-DD)
function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

// Helper: Format Tanggal 1 Januari Tahun Berjalan (YYYY-01-01)
function getStartOfYearString() {
  const currentYear = new Date().getFullYear();
  return `${currentYear}-01-01`;
}

// Inisialisasi Lokal State dari Store
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

// Sync saat store.filterDates berubah dari tempat lain
watch(() => store.filterDates, (newDates) => {
  tempStartDate.value = newDates.start;
  tempEndDate.value = newDates.end;
}, { deep: true });

// 1. Eksekusi Filter Baru Saat Klik "Terapkan"
const applyFilter = () => {
  store.filterDates.start = tempStartDate.value;
  store.filterDates.end = tempEndDate.value;
};

// 2. Reset Filter ke (1 Jan Awal Tahun - Today)
const resetFilter = () => {
  const startOfYear = getStartOfYearString();
  const today = getTodayString();

  tempStartDate.value = startOfYear;
  tempEndDate.value = today;

  store.filterDates.start = startOfYear;
  store.filterDates.end = today;
};
</script>