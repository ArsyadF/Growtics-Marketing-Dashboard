<template>
  <div class="fixed bottom-4 left-4 right-4 z-40 md:hidden pointer-events-none flex justify-center">
    
    <!-- BACKDROP GELAP -->
    <div 
      v-if="activePopup" 
      @click="activePopup = null" 
      class="pointer-events-auto fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-30"
    ></div>

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
            @click="selectUnit('unit-NHP')" 
            class="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-500/10 border border-slate-100 dark:border-slate-700/50 transition-all cursor-pointer group"
          >
            <div class="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm mb-1 group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-building"></i>
            </div>
            <span class="text-[10px] font-bold text-slate-700 dark:text-slate-200">NHP</span>
          </button>

          <!-- Unit NHC -->
          <button 
            @click="selectUnit('unit-NHC')" 
            class="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-500/10 border border-slate-100 dark:border-slate-700/50 transition-all cursor-pointer group"
          >
            <div class="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center text-sm mb-1 group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-building-user"></i>
            </div>
            <span class="text-[10px] font-bold text-slate-700 dark:text-slate-200">NHC</span>
          </button>

          <!-- Unit KG -->
          <button 
            @click="selectUnit('unit-KG')" 
            class="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-500/10 border border-slate-100 dark:border-slate-700/50 transition-all cursor-pointer group"
          >
            <div class="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm mb-1 group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-city"></i>
            </div>
            <span class="text-[10px] font-bold text-slate-700 dark:text-slate-200">KG</span>
          </button>
        </div>
      </div>
    </transition>

    <!-- POPUP 2: Pilihan Tambah Data -->
    <transition name="pop-up">
      <div 
        v-if="activePopup === 'add'" 
       class="pointer-events-auto absolute bottom-20 left-0 right-0 mx-auto w-[92%] max-w-xs z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-slate-800 p-4 rounded-3xl shadow-2xl space-y-3"
      >
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-1 pb-0.5 text-center">Input Data Baru</p>
        
        <button 
          @click="openAddModal('revenue')" 
          class="w-full flex items-center gap-2.5 p-2 rounded-2xl hover:bg-blue-50 dark:hover:bg-slate-800/80 text-left transition-colors cursor-pointer"
        >
          <span class="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs shrink-0">
            <i class="fa-solid fa-sack-dollar"></i>
          </span>
          <span class="text-xs font-bold text-slate-700 dark:text-slate-200">Input Revenue</span>
        </button>

        <button 
          @click="openAddModal('leads')" 
          class="w-full flex items-center gap-2.5 p-2 rounded-2xl hover:bg-blue-50 dark:hover:bg-slate-800/80 text-left transition-colors cursor-pointer"
        >
          <span class="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs shrink-0">
            <i class="fa-solid fa-users-rays"></i>
          </span>
          <span class="text-xs font-bold text-slate-700 dark:text-slate-200">Data Leads</span>
        </button>

        <button 
          @click="openAddModal('promo')" 
          class="w-full flex items-center gap-2.5 p-2 rounded-2xl hover:bg-blue-50 dark:hover:bg-slate-800/80 text-left transition-colors cursor-pointer"
        >
          <span class="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs shrink-0">
            <i class="fa-solid fa-bullhorn"></i>
          </span>
          <span class="text-xs font-bold text-slate-700 dark:text-slate-200">Biaya Promosi</span>
        </button>
      </div>
    </transition>

    <!-- MAIN NAVBAR MENGGUNAKAN GRID 5 KOLOM -->
    <nav class="pointer-events-auto relative z-30 w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/20 dark:border-slate-800/80 rounded-3xl shadow-2xl grid grid-cols-5 items-center h-16 px-3">
      
      <!-- 1. HOME -->
      <button 
        @click="navTo('main')" 
        class="flex flex-col items-center justify-center gap-0.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
        :class="{ 'text-blue-600 dark:text-blue-400 font-bold': store.currentPage === 'main' }"
      >
        <i class="fa-solid fa-house text-sm"></i>
        <span class="text-[9px]">Home</span>
        <span v-if="store.currentPage === 'main'" class="w-1 h-1 bg-blue-600 rounded-full"></span>
      </button>

      <!-- 2. UNIT -->
      <button 
        @click="togglePopup('unit')" 
        class="flex flex-col items-center justify-center gap-0.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
        :class="{ 'text-blue-600 dark:text-blue-400 font-bold': activePopup === 'unit' || store.currentPage.startsWith('unit-') }"
      >
        <i class="fa-solid fa-building text-sm"></i>
        <span class="text-[9px]">Unit</span>
        <span v-if="store.currentPage.startsWith('unit-')" class="w-1 h-1 bg-blue-600 rounded-full"></span>
      </button>

      <!-- 3. SLOT TENGAH (TEMPAT TOMBOL PLUS MELAYANG) -->
      <div class="relative flex justify-center items-center">
        <button 
          @click="togglePopup('add')" 
          class="absolute -top-10 w-14 h-14 bg-gradient-to-tr from-blue-600 to-sky-400 text-white rounded-full shadow-xl shadow-blue-500/40 flex items-center justify-center text-lg transition-all duration-300 active:scale-90 cursor-pointer border-4 border-slate-100 dark:border-slate-950"
          :class="{ 'rotate-45 !from-rose-500 !to-pink-500 shadow-rose-500/40': activePopup === 'add' }"
        >
          <i class="fa-solid fa-plus transition-transform duration-300"></i>
        </button>
      </div>

      <!-- 4. LEADS -->
      <button 
        @click="navTo('leads')" 
        class="flex flex-col items-center justify-center gap-0.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
        :class="{ 'text-blue-600 dark:text-blue-400 font-bold': store.currentPage === 'leads' }"
      >
        <i class="fa-solid fa-users-rays text-sm"></i>
        <span class="text-[9px]">Leads</span>
        <span v-if="store.currentPage === 'leads'" class="w-1 h-1 bg-blue-600 rounded-full"></span>
      </button>

      <!-- 5. PROMOSI -->
      <button 
        @click="navTo('promo')" 
        class="flex flex-col items-center justify-center gap-0.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
        :class="{ 'text-blue-600 dark:text-blue-400 font-bold': store.currentPage === 'promo' }"
      >
        <i class="fa-solid fa-bullhorn text-sm"></i>
        <span class="text-[9px]">Promosi</span>
        <span v-if="store.currentPage === 'promo'" class="w-1 h-1 bg-blue-600 rounded-full"></span>
      </button>

    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { store } from '../store';

const activePopup = ref(null);

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

const openAddModal = (modalName) => {
  activePopup.value = null;
  store.openModal(modalName);
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
</style>