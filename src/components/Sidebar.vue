<!-- src/components/Sidebar.vue -->
<template>
  <div>
    <!-- Overlay Mobile -->
    <div 
      v-if="isOpen" 
      @click="$emit('close-sidebar')" 
      @touchmove.prevent
      class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
    ></div>

    <!-- Sidebar Main -->
    <aside 
      class="fixed top-0 left-0 shrink-0 h-screen glass-card floating-sidebar flex flex-col z-50 transform transition-all duration-300 overflow-hidden pt-6 pb-8 md:pt-4 md:pb-4"
      :class="[
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        isCollapsed ? 'w-18' : 'w-60'
      ]"
    >
      <!-- Header Sidebar -->
      <div 
        class="p-4 pt-6 md:pt-3 flex items-center justify-between sidebar-header shrink-0"
        :class="isCollapsed ? 'justify-center' : 'justify-between'"
      >
        <!-- Logo / Brand Header -->
        <button 
          @click="toggleCollapse" 
          class="flex items-center gap-3 outline-none cursor-pointer" 
          :class="isCollapsed ? 'justify-center' : 'justify-start'"
          :title="isCollapsed ? 'Buka Sidebar' : 'Kecilkan Sidebar'"
        >
          <span class="p-2 bg-theme-gradient text-white rounded-lg text-sm shrink-0 flex items-center justify-center shadow-sm">
            <i class="fa-solid fa-chart-pie"></i>
          </span>
          <h1 
            v-if="!isCollapsed" 
            class="text-base font-bold text-slate-800 dark:text-slate-100 sidebar-text whitespace-nowrap tracking-wide"
          >
            Marketing
          </h1>
        </button>

        <!-- Tombol Toggle Collapse Mobile -->
        <button 
          v-if="!isCollapsed" 
          @click="toggleCollapse" 
          class="md:hidden text-slate-400 hover:text-theme p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <i class="fa-solid fa-angles-left text-xs"></i>
        </button>

        <!-- Tombol Close Mobile -->
        <button 
          @click="$emit('close-sidebar')" 
          class="md:hidden text-slate-400 p-1 shrink-0 cursor-pointer ml-1"
          v-if="!isCollapsed"
        >
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>
      
      <!-- Menu Navigasi Ringkas (Gaya macOS/Minimalist) -->
      <nav class="flex-1 overflow-y-auto py-3 px-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <ul class="space-y-1">
          
          <!-- KATEGORI: WORKSPACE -->
          <li 
            class="pt-2 pb-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider sidebar-category"
            :class="isCollapsed ? 'text-center px-0' : 'px-3'"
          >
            <span v-if="!isCollapsed">Workspace</span>
            <span v-else class="text-[8px]">CORE</span>
          </li>

          <!-- 1. Dashboard Utama -->
          <li v-if="store.canAccessPage('main')">
            <a 
              href="#" 
              @click.prevent="navigate('main')" 
              class="nav-item flex items-center py-2 text-xs  rounded-xl transition-all"
              :class="[
                activePage === 'main' 
                  ? 'bg-theme-gradient text-white shadow-md' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60',
                isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'
              ]"
              :title="isCollapsed ? 'Dashboard Utama' : ''"
            >
              <i class="fa-solid fa-house text-sm shrink-0"></i>
              <span v-if="!isCollapsed" class="sidebar-text whitespace-nowrap">Dashboard Utama</span>
            </a>
          </li>

          <!-- KATEGORI: UNIT USAHA -->
          <template v-if="isLoggedIn">
            <li 
              class="pt-3 pb-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider sidebar-category"
              :class="isCollapsed ? 'text-center px-0' : 'px-3'"
            >
              <span v-if="!isCollapsed">Unit Usaha</span>
              <span v-else class="text-[8px]">UNIT</span>
            </li>
            
            <li v-if="hasUnitAccess('NHP')">
              <a 
                href="#" 
                @click.prevent="navigate('unit-NHP')" 
                class="nav-item flex items-center py-2 text-xs  rounded-xl transition-all"
                :class="[
                  activePage === 'unit-NHP' 
                    ? 'bg-theme-gradient text-white shadow-md' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60',
                  isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'
                ]"
                :title="isCollapsed ? 'Unit NHP' : ''"
              >
                <i class="fa-solid fa-building text-sm shrink-0"></i>
                <span v-if="!isCollapsed" class="sidebar-text whitespace-nowrap">Unit NHP</span>
              </a>
            </li>

            <li v-if="hasUnitAccess('NHC')">
              <a 
                href="#" 
                @click.prevent="navigate('unit-NHC')" 
                class="nav-item flex items-center py-2 text-xs  rounded-xl transition-all"
                :class="[
                  activePage === 'unit-NHC' 
                    ? 'bg-theme-gradient text-white shadow-md' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60',
                  isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'
                ]"
                :title="isCollapsed ? 'Unit NHC' : ''"
              >
                <i class="fa-solid fa-building text-sm shrink-0"></i>
                <span v-if="!isCollapsed" class="sidebar-text whitespace-nowrap">Unit NHC</span>
              </a>
            </li>

            <li v-if="hasUnitAccess('KG')">
              <a 
                href="#" 
                @click.prevent="navigate('unit-KG')" 
                class="nav-item flex items-center py-2 text-xs  rounded-xl transition-all"
                :class="[
                  activePage === 'unit-KG' 
                    ? 'bg-theme-gradient text-white shadow-md' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60',
                  isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'
                ]"
                :title="isCollapsed ? 'Unit KG' : ''"
              >
                <i class="fa-solid fa-building text-sm shrink-0"></i>
                <span v-if="!isCollapsed" class="sidebar-text whitespace-nowrap">Unit KG</span>
              </a>
            </li>

            <!-- KATEGORI: LAINNYA -->
            <li 
              class="pt-3 pb-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider sidebar-category"
              :class="isCollapsed ? 'text-center px-0' : 'px-3'"
            >
              <span v-if="!isCollapsed">Lainnya</span>
              <span v-else class="text-[8px]">MORE</span>
            </li>
            
            <li>
              <a 
                href="#" 
                @click.prevent="navigate('leads')" 
                class="nav-item flex items-center py-2 text-xs  rounded-xl transition-all"
                :class="[
                  activePage === 'leads' 
                    ? 'bg-theme-gradient text-white shadow-md' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60',
                  isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'
                ]"
                :title="isCollapsed ? 'Leads & Campaign' : ''"
              >
                <i class="fa-solid fa-users-rays text-sm shrink-0"></i>
                <span v-if="!isCollapsed" class="sidebar-text whitespace-nowrap">Leads & Campaign</span>
              </a>
            </li>

            <li v-if="store.canAccessPage('promo')">
              <a 
                href="#" 
                @click.prevent="navigate('promo')" 
                class="nav-item flex items-center py-2 text-xs  rounded-xl transition-all"
                :class="[
                  activePage === 'promo' 
                    ? 'bg-theme-gradient text-white shadow-md' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60',
                  isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'
                ]"
                :title="isCollapsed ? 'Biaya Promosi' : ''"
              >
                <i class="fa-solid fa-bullhorn text-sm shrink-0"></i>
                <span v-if="!isCollapsed" class="sidebar-text whitespace-nowrap">Biaya Promosi</span>
              </a>
            </li>

            <li v-if="store.canAccessPage('targets')">
              <a 
                href="#" 
                @click.prevent="navigate('targets')" 
                class="nav-item flex items-center py-2 text-xs  rounded-xl transition-all"
                :class="[
                  activePage === 'targets' 
                    ? 'bg-theme-gradient text-white shadow-md' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60',
                  isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'
                ]"
                :title="isCollapsed ? 'Target Revenue' : ''"
              >
                <i class="fa-solid fa-bullseye text-sm shrink-0"></i>
                <span v-if="!isCollapsed" class="sidebar-text whitespace-nowrap">Target Revenue</span>
              </a>
            </li>

            <!-- KATEGORI: PENGATURAN MASTER -->
            <template v-if="isSuperadmin">
              <li 
                class="pt-3 pb-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider sidebar-category"
                :class="isCollapsed ? 'text-center px-0' : 'px-3'"
              >
                <span v-if="!isCollapsed">Admin</span>
                <span v-else class="text-[8px]">ADM</span>
              </li>
              
              <li>
                <a 
                  href="#" 
                  @click.prevent="navigate('users')" 
                  class="nav-item flex items-center py-2 text-xs  rounded-xl transition-all"
                  :class="[
                    activePage === 'users' 
                      ? 'bg-theme-gradient text-white shadow-md' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60',
                    isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'
                  ]"
                  :title="isCollapsed ? 'Akses Pengguna' : ''"
                >
                  <i class="fa-solid fa-users-gear text-sm shrink-0"></i>
                  <span v-if="!isCollapsed" class="sidebar-text whitespace-nowrap">Akses Pengguna</span>
                </a>
              </li>
            </template>
          </template>
        </ul>
      </nav>

      <!-- Bottom Widget: Profil User -->
      <div class="p-1.5 m-2 mb-16 md:mb-2 bg-slate-100/50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/50 dark:border-slate-700/40 flex items-center justify-center shrink-0">
        
        <!-- MODE GUEST -->
        <button 
          v-if="!isLoggedIn" 
          @click="$emit('open-login')" 
          class="w-full bg-theme-gradient text-white font-bold py-2 rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          :class="isCollapsed ? 'px-0' : 'px-3'"
          :title="isCollapsed ? 'Masuk / Login' : ''"
        >
          <i class="fa-solid fa-right-to-bracket shrink-0"></i>
          <span v-if="!isCollapsed" class="sidebar-text whitespace-nowrap">Masuk / Login</span>
        </button>

        <!-- MODE LOGGED IN -->
        <button 
          v-else 
          @click="navigate('profile')" 
          class="w-full flex items-center gap-2.5 text-left group outline-none overflow-hidden cursor-pointer p-1 rounded-xl hover:bg-white/40 dark:hover:bg-slate-700/50 transition-colors"
          :class="isCollapsed ? 'justify-center' : ''"
          :title="isCollapsed ? (userData?.nama || 'Profil') : ''"
        >
          <img 
            :src="userData?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.nama || 'User')}&background=0D8ABC&color=fff`" 
            class="w-8 h-8 rounded-full object-cover shrink-0 aspect-square border border-theme/50 group-hover:scale-105 transition-transform"
          >
          <div v-if="!isCollapsed" class="user-info min-w-0 flex-1 overflow-hidden sidebar-text">
            <p class="font-bold text-xs truncate leading-tight group-hover:text-theme">
              {{ userData?.nama || 'Admin User' }}
            </p>
            <p class="text-[9px] text-slate-400 font-medium uppercase truncate mt-0.5">
              {{ userData?.role || 'User' }}
            </p>
          </div>
        </button>

      </div>
    </aside>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import { store } from '../store';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  activePage: {
    type: String,
    default: 'main'
  }
});

const emit = defineEmits(['close-sidebar', 'change-page', 'open-login']);

watch(() => props.isOpen, (newVal) => {
  if (window.innerWidth < 768) {
    if (newVal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
});

const isCollapsed = computed(() => store.isSidebarCollapsed);

const toggleCollapse = () => {
  store.toggleSidebarCollapse();
};

const isLoggedIn = computed(() => !!store.currentUser);
const userData = computed(() => store.currentUser || {});

const isSuperadmin = computed(() => {
  const role = userData.value?.role || userData.value?.Role;
  return role ? role.toUpperCase() === 'SUPERADMIN' : false;
});

const hasUnitAccess = (unitName) => {
  return store.canAccessPage(`unit-${unitName}`);
};

const navigate = (page) => {
  emit('change-page', page);
  if (window.innerWidth < 768) {
    document.body.style.overflow = '';
    emit('close-sidebar');
  }
};
</script>