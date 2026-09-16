<!-- src/components/BottomNav.vue -->
<template>
  <div class="fixed bottom-4 left-4 right-4 z-40 md:hidden pointer-events-none flex justify-center">
    
    <!-- BACKDROP GELAP (Transparan / Blur - Menghentikan event click ke elemen belakang) -->
    <transition name="fade">
      <div 
        v-if="activePopup" 
        @click.stop="closePopup"
        @touchstart.stop="closePopup" 
        class="pointer-events-auto fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-30"
      ></div>
    </transition>

    <div ref="navContainerRef" class="relative w-full max-w-md pointer-events-auto z-40">

      <!-- POPUP 1: Pilihan Unit Usaha (3 Kotak) -->
      <transition name="pop-up">
        <div 
          v-if="activePopup === 'unit'" 
          class="pointer-events-auto absolute bottom-20 left-0 right-0 mx-auto w-[92%] max-w-xs z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-slate-800 p-4 rounded-3xl shadow-2xl space-y-3"
        >
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-1 pb-0.5 text-center">Pilih Unit Usaha</p>
          
          <div class="grid grid-cols-3 gap-2">
            <!-- Unit NHP -->
            <button 
              v-if="store.canAccessPage('unit-NHP')"
              @click.stop="selectUnit('unit-NHP')" 
              class="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-[#25eba11a] border border-slate-100 dark:border-slate-700/50 transition-all cursor-pointer group"
            >
              <div class="w-9 h-9 rounded-xl bg-[#25eba11a] text-theme flex items-center justify-center text-sm mb-1 group-hover:scale-110 transition-transform">
                <i class="fa-solid fa-building"></i>
              </div>
              <span class="text-[10px] font-bold text-slate-700 dark:text-slate-200">NHP</span>
            </button>

            <!-- Unit NHC -->
            <button 
              v-if="store.canAccessPage('unit-NHC')"
              @click.stop="selectUnit('unit-NHC')" 
              class="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-[#25eba11a] border border-slate-100 dark:border-slate-700/50 transition-all cursor-pointer group"
            >
              <div class="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center text-sm mb-1 group-hover:scale-110 transition-transform">
                <i class="fa-solid fa-building-user"></i>
              </div>
              <span class="text-[10px] font-bold text-slate-700 dark:text-slate-200">NHC</span>
            </button>

            <!-- Unit KG -->
            <button 
              v-if="store.canAccessPage('unit-KG')"
              @click.stop="selectUnit('unit-KG')" 
              class="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-[#25eba11a] border border-slate-100 dark:border-slate-700/50 transition-all cursor-pointer group"
            >
              <div class="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm mb-1 group-hover:scale-110 transition-transform">
                <i class="fa-solid fa-city"></i>
              </div>
              <span class="text-[10px] font-bold text-slate-700 dark:text-slate-200">KG</span>
            </button>
          </div>
        </div>
      </transition>

      <!-- POPUP 2: Pilihan Tambah Data Melayang (Slot Tengah +) -->
      <transition name="pop-up">
        <div 
          v-if="activePopup === 'add'" 
          class="pointer-events-auto absolute bottom-20 left-0 right-0 mx-auto w-[92%] max-w-xs z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-slate-800 p-4 rounded-3xl shadow-2xl space-y-2"
        >
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-1 pb-0.5 text-center">Input Data Baru</p>
          
          <!-- Input Revenue -->
          <button 
            v-if="store.canEditPage('revenue')"
            @click.stop="openAddModal('revenue')" 
            class="w-full flex items-center gap-2.5 p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left transition-colors cursor-pointer"
          >
            <span class="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs shrink-0">
              <i class="fa-solid fa-sack-dollar"></i>
            </span>
            <span class="text-xs font-bold text-slate-700 dark:text-slate-200">Input Revenue</span>
          </button>

          <!-- Data Leads -->
          <button 
            v-if="store.canEditPage('leads')"
            @click.stop="openAddModal('leads')" 
            class="w-full flex items-center gap-2.5 p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left transition-colors cursor-pointer"
          >
            <span class="w-7 h-7 rounded-lg bg-[#25eba11a] text-theme flex items-center justify-center text-xs shrink-0">
              <i class="fa-solid fa-users-rays"></i>
            </span>
            <span class="text-xs font-bold text-slate-700 dark:text-slate-200">Data Leads</span>
          </button>

          <!-- Biaya Promosi -->
          <button 
            v-if="store.canEditPage('promo')"
            @click.stop="openAddModal('promo')" 
            class="w-full flex items-center gap-2.5 p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left transition-colors cursor-pointer"
          >
            <span class="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs shrink-0">
              <i class="fa-solid fa-bullhorn"></i>
            </span>
            <span class="text-xs font-bold text-slate-700 dark:text-slate-200">Biaya Promosi</span>
          </button>

          <!-- Tambah Progress Kanban -->
          <button 
            v-if="store.canEditPage('progress')"
            @click.stop="openAddModal('progress')" 
            class="w-full flex items-center gap-2.5 p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left transition-colors cursor-pointer"
          >
            <span class="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs shrink-0">
              <i class="fa-solid fa-bars-progress"></i>
            </span>
            <span class="text-xs font-bold text-slate-700 dark:text-slate-200">Tambah Progress</span>
          </button>

          <!-- Laporan Divisi -->
          <button 
            v-if="store.canEditPage('spv-report')"
            @click.stop="openAddModal('spv-report')" 
            class="w-full flex items-center gap-2.5 p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left transition-colors cursor-pointer"
          >
            <span class="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs shrink-0">
              <i class="fa-solid fa-file-signature"></i>
            </span>
            <span class="text-xs font-bold text-slate-700 dark:text-slate-200">Laporan Divisi</span>
          </button>

          <!-- Tambah Notes (PALING BAWAH) -->
          <button 
            v-if="store.canEditPage('notes')"
            @click.stop="openAddModal('notes')" 
            class="w-full flex items-center gap-2.5 p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left transition-colors cursor-pointer border-t border-slate-100 dark:border-slate-800/60 pt-2 mt-1"
          >
            <span class="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xs shrink-0">
              <i class="fa-solid fa-note-sticky"></i>
            </span>
            <span class="text-xs font-bold text-slate-700 dark:text-slate-200">Tambah Notes</span>
          </button>
        </div>
      </transition>

      <!-- POPUP 3: Pilihan Workspace -->
      <transition name="pop-up">
        <div 
          v-if="activePopup === 'workspace'" 
          class="pointer-events-auto absolute bottom-20 left-0 right-0 mx-auto w-[92%] max-w-xs z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-slate-800 p-4 rounded-3xl shadow-2xl space-y-2"
        >
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-1 pb-0.5 text-center">Modul Workspace</p>

          <button 
            v-if="store.canAccessPage('progress')"
            @click.stop="navTo('progress')" 
            class="w-full flex items-center gap-2.5 p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left transition-colors cursor-pointer"
          >
            <span class="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs shrink-0">
              <i class="fa-solid fa-bars-progress"></i>
            </span>
            <span class="text-xs font-bold text-slate-700 dark:text-slate-200">Team Progress</span>
          </button>

          <button 
            v-if="store.canAccessPage('digmar')"
            @click.stop="navTo('digmar')" 
            class="w-full flex items-center gap-2.5 p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left transition-colors cursor-pointer"
          >
            <span class="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs shrink-0">
              <i class="fa-solid fa-share-nodes"></i>
            </span>
            <span class="text-xs font-bold text-slate-700 dark:text-slate-200">Sosmed Analytics</span>
          </button>

          <button 
            v-if="store.canAccessPage('leads')"
            @click.stop="navTo('leads')" 
            class="w-full flex items-center gap-2.5 p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left transition-colors cursor-pointer"
          >
            <span class="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center text-xs shrink-0">
              <i class="fa-solid fa-users-rays"></i>
            </span>
            <span class="text-xs font-bold text-slate-700 dark:text-slate-200">Leads & Campaign</span>
          </button>

          <button 
            v-if="store.canAccessPage('spv-report')"
            @click.stop="navTo('spv-report')" 
            class="w-full flex items-center gap-2.5 p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left transition-colors cursor-pointer"
          >
            <span class="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs shrink-0">
              <i class="fa-solid fa-file-signature"></i>
            </span>
            <span class="text-xs font-bold text-slate-700 dark:text-slate-200">Division Report</span>
          </button>
        </div>
      </transition>

      <!-- MAIN NAVBAR MENGGUNAKAN GRID 5 KOLOM -->
      <nav class="pointer-events-auto relative z-30 w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/20 dark:border-slate-800/80 rounded-3xl shadow-2xl grid grid-cols-5 items-center h-16 px-3">
        
        <!-- 1. DASHBOARD -->
        <button 
          @click.stop="navTo('main')" 
          class="flex flex-col items-center justify-center gap-0.5 text-slate-400 hover:text-theme dark:hover:text-theme transition-colors cursor-pointer"
          :class="{ 'text-theme dark:text-theme font-bold': store.currentPage === 'main' }"
        >
          <i class="fa-solid fa-house text-[1.25rem]"></i>
          <span class="text-[10px]">Dashboard</span>
          <span v-if="store.currentPage === 'main'" class="w-1 h-1 bg-theme-gradient rounded-full"></span>
        </button>

        <!-- 2. UNIT -->
        <button 
          @click.stop="togglePopup('unit')" 
          class="flex flex-col items-center justify-center gap-0.5 text-slate-400 hover:text-theme dark:hover:text-theme transition-colors cursor-pointer"
          :class="{ 'text-theme dark:text-theme font-bold': activePopup === 'unit' || store.currentPage.startsWith('unit-') }"
        >
          <i class="fa-solid fa-building text-[1.25rem]"></i>
          <span class="text-[10px]">Unit</span>
          <span v-if="store.currentPage.startsWith('unit-')" class="w-1 h-1 bg-theme-gradient rounded-full"></span>
        </button>

        <!-- 3. SLOT TENGAH (TOMBOL PLUS MELAYANG) -->
        <div class="relative flex justify-center items-center">
          <button 
            @click.stop="togglePopup('add')" 
            class="absolute -top-10 w-14 h-14 bg-theme-gradient text-white rounded-full shadow-xl shadow-[#6060604f] flex items-center justify-center text-lg transition-all duration-300 active:scale-90 cursor-pointer border-4 border-slate-100 dark:border-slate-900"
            :class="{ '!from-[#2EE59D] !to-[#149B73]': activePopup === 'add' }"
          >
            <i class="fa-solid fa-plus transition-transform duration-300"
            :class="{ 'rotate-45': activePopup === 'add' }"></i>
          </button>
        </div>

        <!-- 4. WORKSPACE -->
        <button 
          @click.stop="togglePopup('workspace')" 
          class="flex flex-col items-center justify-center gap-0.5 text-slate-400 hover:text-theme dark:hover:text-theme transition-colors cursor-pointer"
          :class="{ 'text-theme dark:text-theme font-bold': activePopup === 'workspace' || ['progress', 'digmar', 'leads', 'spv-report'].includes(store.currentPage) }"
        >
          <i class="fa-solid fa-bullhorn text-[1.25rem]"></i>
          <span class="text-[10px]">Workspace</span>
          <span v-if="['progress', 'digmar', 'leads', 'spv-report'].includes(store.currentPage)" class="w-1 h-1 bg-theme-gradient rounded-full"></span>
        </button>

        <!-- 5. CUSTOMER CARE -->
        <button 
          v-if="store.canAccessPage('aduan')"
          @click.stop="navTo('aduan')" 
          class="flex flex-col items-center justify-center gap-0.5 text-slate-400 hover:text-theme dark:hover:text-theme transition-colors cursor-pointer"
          :class="{ 'text-theme dark:text-theme font-bold': store.currentPage === 'aduan' }"
        >
          <i class="fa-solid fa-headset text-[1.25rem]"></i>
          <span class="text-[10px]">Customer Care</span>
          <span v-if="store.currentPage === 'aduan'" class="w-1 h-1 bg-theme-gradient rounded-full"></span>
        </button>

      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { store } from '../store';

const activePopup = ref(null);
const navContainerRef = ref(null);

const closePopup = () => {
  activePopup.value = null;
};

const togglePopup = (type) => {
  if (activePopup.value === type) {
    activePopup.value = null;
  } else {
    activePopup.value = type;
  }
};

const navTo = (page) => {
  store.currentPage = page;
  activePopup.value = null;
};

const selectUnit = (unitPage) => {
  store.currentPage = unitPage;
  activePopup.value = null;
};

// HANDLER METODE DOCUMENT CLICK DENGAN STOP PROPAGATION SAFEGUARD
const handleDocumentClick = (event) => {
  if (activePopup.value && navContainerRef.value) {
    if (!navContainerRef.value.contains(event.target)) {
      closePopup();
    }
  }
};

onMounted(() => {
  window.addEventListener('click', handleDocumentClick);
  window.addEventListener('touchstart', handleDocumentClick, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('click', handleDocumentClick);
  window.removeEventListener('touchstart', handleDocumentClick);
});

const openAddModal = (modalName) => {
  activePopup.value = null;

  // Jika tombol yang diklik adalah modul halaman khusus
  if (modalName === 'progress') {
    store.currentPage = 'progress';
    store.openModal('progress');
  } else if (modalName === 'spv-report') {
    store.currentPage = 'spv-report';
    store.openModal('spv-report');
  } else if (modalName === 'notes') {
    // Jika ada halaman khusus notes atau membuka modal global notes
    if (store.canAccessPage && store.canAccessPage('notes')) {
      store.currentPage = 'notes';
    }
    store.openModal('notes');
  } else {
    // Untuk modal global (revenue, leads, promo, dll)
    store.openModal(modalName);
  }
};
</script>

<style scoped>
.pop-up-enter-active,
.pop-up-leave-active {
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pop-up-enter-from,
.pop-up-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.9);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>