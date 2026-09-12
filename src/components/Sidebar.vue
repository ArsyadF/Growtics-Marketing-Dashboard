<!-- src/components/Sidebar.vue -->
<template>
  <div>
    <!-- Overlay Mobile -->
    <div 
      v-if="isOpen" 
      @click="$emit('close-sidebar')" 
      class="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
    ></div>

  <!-- Sidebar Main -->
  <aside 
    class="fixed top-0 left-0 shrink-0 h-screen glass-card floating-sidebar shadow-2xl flex flex-col z-50 transform transition-all duration-300 overflow-hidden pt-6 pb-8 md:pt-4 md:pb-4"
    :class="[
      isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      isCollapsed ? 'w-18' : 'w-60'
    ]"
  >
      <!-- Header Sidebar: Logo & Toggle Collapse (Ditambahkan pt-6 khusus Mobile untuk Safe-Area Status Bar) -->
      <div 
        class="p-4 pt-8 md:pt-4 border-b border-blue-100/50 dark:border-slate-800/80 flex items-center justify-between sidebar-header shrink-0"
        :class="isCollapsed ? 'justify-center' : 'justify-between'"
      >
        <!-- Logo / Icon Brand -->
        <button 
          @click="toggleCollapse" 
          class="flex items-center gap-3 outline-none focus:outline-none cursor-pointer" 
          :class="isCollapsed ? 'justify-center' : 'justify-start'"
          :title="isCollapsed ? 'Buka Sidebar' : 'Kecilkan Sidebar'"
        >
          <span class="p-2.5 bg-gradient-to-tr from-[#149B73] to-[#2EE59D] text-white rounded-xl shadow-md text-base shrink-0 flex items-center justify-center">
            <i class="fa-solid fa-chart-pie"></i>
          </span>
          <h1 
            v-if="!isCollapsed" 
            class="text-lg font-bold text-slate-800 dark:text-slate-100 sidebar-text whitespace-nowrap transition-all duration-200"
          >
            Marketing
          </h1>
        </button>

        <!-- Tombol Toggle Collapse -->
        <button 
          v-if="!isCollapsed" 
          @click="toggleCollapse" 
          class="text-slate-400 hover:text-[#1caa80] p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center"
          title="Kecilkan Sidebar"
        >
          <i class="fa-solid fa-angles-left text-sm"></i>
        </button>

        <!-- Tombol Close Mobile -->
        <button 
          @click="$emit('close-sidebar')" 
          class="md:hidden text-slate-400 p-1 shrink-0 cursor-pointer ml-1"
          v-if="!isCollapsed"
        >
          <i class="fa-solid fa-xmark text-xl"></i>
        </button>
      </div>
      
      <!-- Menu Navigasi (Aktifkan Scrollbar jika Menu Panjang) -->
      <nav class="flex-1 overflow-y-auto py-4">
        <ul class="space-y-1 px-2">
          <!-- 1. Dashboard Utama -->
          <li v-if="store.canAccessPage('main')">
            <a 
              href="#" 
              @click.prevent="navigate('main')" 
              class="nav-item flex items-center px-3 py-3 text-sm rounded-xl transition-all"
              :class="[
                activePage === 'main' 
                  ? 'bg-[#25eba11a] text-[#1caa80] font-bold dark:text-[#1caa80] border-l-4 border-[#ffc600]' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-800/50',
                isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'
              ]"
              :title="isCollapsed ? 'Dashboard Utama' : ''"
            >
              <i class="fa-solid fa-house text-base shrink-0"></i>
              <span v-if="!isCollapsed" class="sidebar-text whitespace-nowrap">Dashboard Utama</span>
            </a>
          </li>
          
          <!-- 2. Unit Usaha -->
          <template v-if="isLoggedIn">
            <li 
              class="py-2 text-[10px] font-bold text-[#1caa80] dark:text-[#1caa80] uppercase tracking-widest mt-4 sidebar-category"
              :class="isCollapsed ? 'text-center px-0' : 'px-4'"
            >
              <span v-if="!isCollapsed">Unit Usaha</span>
              <span v-else class="text-[8px]">UNIT</span>
            </li>
            
            <li v-if="hasUnitAccess('NHP')">
              <a 
                href="#" 
                @click.prevent="navigate('unit-NHP')" 
                class="nav-item flex items-center px-3 py-3 text-sm rounded-xl transition-all"
                :class="[
                  activePage === 'unit-NHP' 
                    ? 'bg-[#25eba11a] text-[#1caa80] font-bold dark:text-[#1caa80] border-l-4 border-[#ffc600]' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-800/50',
                  isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'
                ]"
                :title="isCollapsed ? 'Unit NHP' : ''"
              >
                <i class="fa-solid fa-building text-base shrink-0"></i>
                <span v-if="!isCollapsed" class="sidebar-text whitespace-nowrap">Unit NHP</span>
              </a>
            </li>

            <li v-if="hasUnitAccess('NHC')">
              <a 
                href="#" 
                @click.prevent="navigate('unit-NHC')" 
                class="nav-item flex items-center px-3 py-3 text-sm rounded-xl transition-all"
                :class="[
                  activePage === 'unit-NHC' 
                    ? 'bg-[#25eba11a] text-[#1caa80] font-bold dark:text-[#1caa80] border-l-4 border-[#ffc600]' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-800/50',
                  isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'
                ]"
                :title="isCollapsed ? 'Unit NHC' : ''"
              >
                <i class="fa-solid fa-building text-base shrink-0"></i>
                <span v-if="!isCollapsed" class="sidebar-text whitespace-nowrap">Unit NHC</span>
              </a>
            </li>

            <li v-if="hasUnitAccess('KG')">
              <a 
                href="#" 
                @click.prevent="navigate('unit-KG')" 
                class="nav-item flex items-center px-3 py-3 text-sm rounded-xl transition-all"
                :class="[
                  activePage === 'unit-KG' 
                    ? 'bg-[#25eba11a] text-[#1caa80] font-bold dark:text-[#1caa80] border-l-4 border-[#ffc600]' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-800/50',
                  isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'
                ]"
                :title="isCollapsed ? 'Unit KG' : ''"
              >
                <i class="fa-solid fa-building text-base shrink-0"></i>
                <span v-if="!isCollapsed" class="sidebar-text whitespace-nowrap">Unit KG</span>
              </a>
            </li>

            <!-- 3. Lainnya -->
            <li 
              class="py-2 text-[10px] font-bold text-[#1caa80] dark:text-[#1caa80] uppercase tracking-widest mt-4 sidebar-category"
              :class="isCollapsed ? 'text-center px-0' : 'px-4'"
            >
              <span v-if="!isCollapsed">Lainnya</span>
              <span v-else class="text-[8px]">MORE</span>
            </li>
            
            <li>
              <a 
                href="#" 
                @click.prevent="navigate('leads')" 
                class="nav-item flex items-center px-3 py-3 text-sm rounded-xl transition-all"
                :class="[
                  activePage === 'leads' 
                    ? 'bg-[#25eba11a] text-[#1caa80] font-bold dark:text-[#1caa80] border-l-4 border-[#ffc600]' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-800/50',
                  isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'
                ]"
                :title="isCollapsed ? 'Leads & Campaign' : ''"
              >
                <i class="fa-solid fa-users-rays text-base shrink-0"></i>
                <span v-if="!isCollapsed" class="sidebar-text whitespace-nowrap">Leads & Campaign</span>
              </a>
            </li>

            <li v-if="store.canAccessPage('promo')">
              <a 
                href="#" 
                @click.prevent="navigate('promo')" 
                class="nav-item flex items-center px-3 py-3 text-sm rounded-xl transition-all"
                :class="[
                  activePage === 'promo' 
                    ? 'bg-[#25eba11a] text-[#1caa80] font-bold dark:text-[#1caa80] border-l-4 border-[#ffc600]' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-800/50',
                  isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'
                ]"
                :title="isCollapsed ? 'Biaya Promosi' : ''"
              >
                <i class="fa-solid fa-bullhorn text-base shrink-0"></i>
                <span v-if="!isCollapsed" class="sidebar-text whitespace-nowrap">Biaya Promosi</span>
              </a>
            </li>

            <li v-if="store.canAccessPage('targets')">
                <a 
                  href="#" 
                  @click.prevent="navigate('targets')" 
                  class="nav-item flex items-center px-3 py-3 text-sm rounded-xl transition-all"
                  :class="[
                    activePage === 'targets' 
                      ? 'bg-[#25eba11a] text-[#1caa80] font-bold dark:text-[#1caa80] border-l-4 border-[#ffc600]' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-800/50',
                    isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'
                  ]"
                  :title="isCollapsed ? 'Target Revenue' : ''"
                >
                  <i class="fa-solid fa-bullseye text-base shrink-0"></i>
                  <span v-if="!isCollapsed" class="sidebar-text whitespace-nowrap">Target Revenue</span>
                </a>
              </li>

            <!-- 4. Pengaturan Master -->
            <template v-if="isSuperadmin">
              <li 
                class="py-2 text-[10px] font-bold text-[#1caa80] dark:text-[#1caa80] uppercase tracking-widest mt-4 sidebar-category"
                :class="isCollapsed ? 'text-center px-0' : 'px-4'"
              >
                <span v-if="!isCollapsed">Pengaturan Master</span>
                <span v-else class="text-[8px]">ADMIN</span>
              </li>
              
              <li>
                <a 
                  href="#" 
                  @click.prevent="navigate('users')" 
                  class="nav-item flex items-center px-3 py-3 text-sm rounded-xl transition-all"
                  :class="[
                    activePage === 'users' 
                      ? 'bg-[#25eba11a] text-[#1caa80] font-bold dark:text-[#1caa80] border-l-4 border-[#ffc600]' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-800/50',
                    isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'
                  ]"
                  :title="isCollapsed ? 'Akses Pengguna' : ''"
                >
                  <i class="fa-solid fa-users-gear text-base shrink-0"></i>
                  <span v-if="!isCollapsed" class="sidebar-text whitespace-nowrap">Akses Pengguna</span>
                </a>
              </li>
            </template>
          </template>
        </ul>
      </nav>

      <!-- Bottom Widget: Profil User -->
<div class="p-2 m-2 bg-white/40 dark:bg-slate-800/50 rounded-2xl border border-white/20 dark:border-slate-700/50 flex items-center justify-center shrink-0">
  
  <!-- MODE GUEST -->
  <button 
    v-if="!isLoggedIn" 
    @click="$emit('open-login')" 
    class="w-full bg-gradient-to-r from-[#149B73] to-[#2EE59D] hover:from-[#149b73] hover:to-[#149b73] text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
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
    class="w-full flex items-center justify-center gap-3 text-left group outline-none overflow-hidden cursor-pointer pb-[env(safe-area-inset-bottom,16px)]"
    :title="isCollapsed ? (userData?.nama || 'Profil') : ''"
  >
    <img 
      :src="userData?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.nama || 'User')}&background=0D8ABC&color=fff`" 
      class="w-9 h-9 rounded-full object-cover shrink-0 aspect-square border border-[#1caa80] group-hover:scale-105 transition-transform"
    >
    <div v-if="!isCollapsed" class="user-info min-w-0 flex-1 overflow-hidden sidebar-text">
      <p class="font-bold text-xs truncate leading-tight group-hover:text-[#1caa80] dark:group-hover:text-[#1caa80]">
        {{ userData?.nama || 'Admin User' }}
      </p>
      <p class="text-[9px] text-[#1caa80] font-semibold uppercase truncate mt-0.5">
        {{ userData?.role || 'User' }}
      </p>
    </div>
  </button>

</div>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
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

// State Collapse Sidebar
// const isCollapsed = ref(false);
const isCollapsed = computed(() => store.isSidebarCollapsed);

// Fungsi Toggle Collapse (Berfungsi untuk Semua Ukuran Layar)
// const toggleCollapse = () => {
//   isCollapsed.value = !isCollapsed.value;
// };

const toggleCollapse = () => {
  store.toggleSidebarCollapse();
};

// Status Login dari Store
const isLoggedIn = computed(() => !!store.currentUser);

// Data User dari Store
const userData = computed(() => store.currentUser || {});

// Role Check Superadmin
const isSuperadmin = computed(() => {
  const role = userData.value?.role || userData.value?.Role;
  return role ? role.toUpperCase() === 'SUPERADMIN' : false;
});

// Hak Akses Unit
// const hasUnitAccess = (unitName) => {
//   if (isSuperadmin.value) return true;
  
//   const unit = userData.value?.unit || userData.value?.Unit || userData.value?.aksesUnit;
//   if (!unit) return false;

//   if (Array.isArray(unit)) {
//     return unit.includes(unitName);
//   }
//   return String(unit).toUpperCase() === String(unitName).toUpperCase();
// };

const hasUnitAccess = (unitName) => {
  // Langsung serahkan pengecekan ke sistem Granular Permission di store
  return store.canAccessPage(`unit-${unitName}`);
};

// Navigasi
const navigate = (page) => {
  emit('change-page', page);
  if (window.innerWidth < 768) {
    emit('close-sidebar');
  }
};
</script>