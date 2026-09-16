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

    <!-- Sidebar Main Container -->
    <aside 
      class="fixed top-0 left-0 shrink-0 h-screen glass-card floating-sidebar flex flex-col z-50 transform transition-all duration-300 overflow-hidden pt-4 pb-4"
      :class="[
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        isCollapsed ? 'w-20' : 'w-64'
      ]"
    >
      <!-- Header Sidebar -->
      <div 
        class="p-3 mb-2 flex items-center shrink-0 border-b border-slate-100/60 dark:border-slate-800/60"
        :class="isCollapsed ? 'justify-center' : 'justify-between px-4'"
      >
        <button 
          @click="toggleCollapse" 
          class="flex items-center gap-3 outline-none cursor-pointer" 
          :class="isCollapsed ? 'justify-center w-full' : 'justify-start'"
          :title="isCollapsed ? 'Buka Sidebar' : 'Kecilkan Sidebar'"
        >
          <span class="w-9 h-9 bg-theme-gradient text-white rounded-xl text-sm shrink-0 flex items-center justify-center shadow-sm">
            <i class="fa-solid fa-chart-pie"></i>
          </span>
          <h1 
            v-if="!isCollapsed" 
            class="text-sm font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap tracking-wide"
          >
            Growtics NHP-G3
          </h1>
        </button>

        <button 
          v-if="!isCollapsed" 
          @click="toggleCollapse" 
          class="hidden md:flex text-slate-400 hover:text-emerald-600 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Kecilkan Sidebar"
        >
          <i class="fa-solid fa-angles-left text-xs"></i>
        </button>

        <button 
          @click="$emit('close-sidebar')" 
          class="md:hidden text-slate-400 p-1 shrink-0 cursor-pointer ml-1"
          v-if="!isCollapsed"
        >
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <!-- FITUR PENCARIAN MENU -->
      <div v-if="!isCollapsed" class="px-3 mb-2 shrink-0">
        <div class="relative">
          <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          <input 
            v-model="searchMenuQuery" 
            type="text" 
            placeholder="Cari menu navigasi..." 
            class="w-full glass-input rounded-xl pl-8 pr-7 py-1.5 text-xs outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:bg-slate-800/80"
          />
          <button 
            v-if="searchMenuQuery" 
            @click="searchMenuQuery = ''" 
            type="button" 
            class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <!-- Menu Navigasi Utama -->
      <nav class="flex-1 overflow-y-auto py-1 px-2.5 space-y-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <ul class="space-y-1">

          <!-- 1. 🏠 DASHBOARD (Stand-Alone Paling Atas) -->
          <li v-if="store.canAccessPage('main') && isMenuVisible('Dashboard Utama', 'main')" class="flex justify-center">
            <a 
              href="#" 
              @click.prevent="navigate('main')" 
              class="w-full flex items-center py-2 text-xs font-semibold rounded-xl transition-all"
              :class="[
                activePage === 'main' 
                  ? 'bg-theme-gradient text-white font-bold shadow-sm' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60',
                isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'
              ]"
              :title="isCollapsed ? 'Dashboard' : ''"
            >
              <i class="fa-solid fa-house text-sm shrink-0"></i>
              <span v-if="!isCollapsed" class="whitespace-nowrap truncate">Dashboard</span>
            </a>
          </li>

          <!-- 2. 📝 NOTES / CATATAN (Stand-Alone) -->
          <li v-if="isLoggedIn && isMenuVisible('Catatan Pribadi Notes', 'notes')" class="flex justify-center">
            <a 
              href="#" 
              @click.prevent="navigate('notes')" 
              class="w-full flex items-center py-2 text-xs font-semibold rounded-xl transition-all"
              :class="[
                activePage === 'notes' 
                  ? 'bg-theme-gradient text-white font-bold shadow-sm' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60',
                isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'
              ]"
              :title="isCollapsed ? 'Notes / Catatan' : ''"
            >
              <i class="fa-solid fa-note-sticky text-sm shrink-0"></i>
              <span v-if="!isCollapsed" class="whitespace-nowrap truncate">Notes</span>
            </a>
          </li>

          <template v-if="isLoggedIn">
            <!-- 3. 🏢 UNIT BISNIS (ACCORDION GROUP) -->
            <li v-if="shouldShowGroup([
              { name: 'Nur Hidayah Press', page: 'unit-NHP', access: hasUnitAccess('NHP') },
              { name: 'Nusaragam x Pengaosan', page: 'unit-NHC', access: hasUnitAccess('NHC') },
              { name: 'Karta Grafika', page: 'unit-KG', access: hasUnitAccess('KG') }
            ])">
              <button 
                @click="toggleDropdown('units')"
                class="w-full flex items-center py-2 text-xs font-semibold rounded-xl transition-all outline-none cursor-pointer mt-1"
                :class="[
                  isGroupActive(['unit-NHP', 'unit-NHC', 'unit-KG']) 
                      ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60',
                  isCollapsed ? 'justify-center px-0' : 'justify-between px-3'
                ]"
                :title="isCollapsed ? 'Unit Bisnis' : ''"
              >
                <div class="flex items-center gap-3 min-w-0" :class="isCollapsed ? 'justify-center w-full' : ''">
                  <i class="fa-solid fa-building text-sm shrink-0"></i>
                  <span v-if="!isCollapsed" class="whitespace-nowrap truncate">Unit</span>
                </div>
                <i 
                  v-if="!isCollapsed" 
                  class="fa-solid fa-chevron-down text-[10px] transition-transform duration-200"
                  :class="{ 'rotate-180': dropdowns.units || searchMenuQuery }"
                ></i>
              </button>

              <transition enter-active-class="transition-all duration-200" leave-active-class="transition-all duration-150">
                <ul v-show="dropdowns.units || isCollapsed || searchMenuQuery" class="mt-1 space-y-1" :class="isCollapsed ? 'px-0' : 'pl-3 border-l-2 border-slate-200 dark:border-slate-800 ml-4'">
                  <li v-if="hasUnitAccess('NHP') && isMenuVisible('Nur Hidayah Press NHP', 'unit-NHP')">
                    <a href="#" @click.prevent="navigate('unit-NHP')" class="w-full flex items-center py-1.5 text-[11px] font-semibold rounded-lg" :class="activePage === 'unit-NHP' ? 'bg-theme-gradient text-white font-bold' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50', isCollapsed ? 'justify-center px-0' : 'gap-2.5 px-2.5'">
                      <i class="fa-solid fa-building-user text-xs"></i><span v-if="!isCollapsed" class="truncate">Nur Hidayah Press</span>
                    </a>
                  </li>
                  <li v-if="hasUnitAccess('NHC') && isMenuVisible('Nusaragam Pengaosan NHC', 'unit-NHC')">
                    <a href="#" @click.prevent="navigate('unit-NHC')" class="w-full flex items-center py-1.5 text-[11px] font-semibold rounded-lg" :class="activePage === 'unit-NHC' ? 'bg-theme-gradient text-white font-bold' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50', isCollapsed ? 'justify-center px-0' : 'gap-2.5 px-2.5'">
                      <i class="fa-solid fa-building-user text-xs"></i><span v-if="!isCollapsed" class="truncate">Nusaragam x Pengaosan</span>
                    </a>
                  </li>
                  <li v-if="hasUnitAccess('KG') && isMenuVisible('Karta Grafika KG', 'unit-KG')">
                    <a href="#" @click.prevent="navigate('unit-KG')" class="w-full flex items-center py-1.5 text-[11px] font-semibold rounded-lg" :class="activePage === 'unit-KG' ? 'bg-theme-gradient text-white font-bold' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50', isCollapsed ? 'justify-center px-0' : 'gap-2.5 px-2.5'">
                      <i class="fa-solid fa-building-user text-xs"></i><span v-if="!isCollapsed" class="truncate">Karta Grafika</span>
                    </a>
                  </li>
                </ul>
              </transition>
            </li>

            <!-- 4. 📢 WORKSPACE (ACCORDION GROUP) -->
            <li v-if="shouldShowGroup([
              { name: 'Campaign Progress', page: 'progress', access: store.canAccessPage('progress') },
              { name: 'Socmed Analytics', page: 'digmar', access: store.canAccessPage('digmar') },
              { name: 'Leads & Campaign', page: 'leads', access: store.canAccessPage('leads')  },
              { name: 'Laporan Divisi SPV Pekanan', page: 'spv-report', access: store.canAccessPage('spv-report') }             
            ])">
              <button 
                @click="toggleDropdown('campaign')"
                class="w-full flex items-center py-2 text-xs font-semibold rounded-xl transition-all outline-none cursor-pointer mt-1"
                :class="[
                  isGroupActive(['progress', 'digmar', 'leads', 'spv-report']) 
                    ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60',
                  isCollapsed ? 'justify-center px-0' : 'justify-between px-3'
                ]"
                :title="isCollapsed ? 'Campaign Hub' : ''"
              >
                <div class="flex items-center gap-3 min-w-0" :class="isCollapsed ? 'justify-center w-full' : ''">
                  <i class="fa-solid fa-bullhorn text-sm shrink-0"></i>
                  <span v-if="!isCollapsed" class="whitespace-nowrap truncate">Workspace</span>
                </div>
                <i 
                  v-if="!isCollapsed" 
                  class="fa-solid fa-chevron-down text-[10px] transition-transform duration-200"
                  :class="{ 'rotate-180': dropdowns.campaign || searchMenuQuery }"
                ></i>
              </button>

              <transition enter-active-class="transition-all duration-200" leave-active-class="transition-all duration-150">
                <ul v-show="dropdowns.campaign || isCollapsed || searchMenuQuery" class="mt-1 space-y-1" :class="isCollapsed ? 'px-0' : 'pl-3 border-l-2 border-slate-200 dark:border-slate-800 ml-4'">
                  <li v-if="store.canAccessPage('progress') && isMenuVisible('Campaign Progress Progres Program', 'progress')">
                    <a href="#" @click.prevent="navigate('progress')" class="w-full flex items-center py-1.5 text-[11px] font-semibold rounded-lg" :class="activePage === 'progress' ? 'bg-theme-gradient text-white font-bold' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50', isCollapsed ? 'justify-center px-0' : 'gap-2.5 px-2.5'">
                      <i class="fa-solid fa-bars-progress text-xs"></i><span v-if="!isCollapsed" class="truncate">Team Progress</span>
                    </a>
                  </li>
                  <li v-if="store.canAccessPage('digmar') && isMenuVisible('Socmed Analytics', 'digmar')">
                    <a href="#" @click.prevent="navigate('digmar')" class="w-full flex items-center py-1.5 text-[11px] font-semibold rounded-lg" :class="activePage === 'digmar' ? 'bg-theme-gradient text-white font-bold' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50', isCollapsed ? 'justify-center px-0' : 'gap-2.5 px-2.5'">
                      <i class="fa-solid fa-share-nodes text-xs"></i><span v-if="!isCollapsed" class="truncate">Socmed Analytics</span>
                    </a>
                  </li>
                  <li v-if="isMenuVisible('Leads & Campaign', 'leads')">
                    <a href="#" @click.prevent="navigate('leads')" class="w-full flex items-center py-1.5 text-[11px] font-semibold rounded-lg" :class="activePage === 'leads' ? 'bg-theme-gradient text-white font-bold' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50', isCollapsed ? 'justify-center px-0' : 'gap-2.5 px-2.5'">
                      <i class="fa-solid fa-users-rays text-xs"></i><span v-if="!isCollapsed" class="truncate">Leads & Campaign</span>
                    </a>
                  </li>
                   
                   <li v-if="store.canAccessPage('spv-report') && isMenuVisible('Laporan Divisi SPV Pekanan', 'spv-report')">
                    <a href="#" @click.prevent="navigate('spv-report')" class="w-full flex items-center py-1.5 text-[11px] font-semibold rounded-lg" :class="activePage === 'spv-report' ? 'bg-theme-gradient text-white font-bold' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50', isCollapsed ? 'justify-center px-0' : 'gap-2.5 px-2.5'">
                      <i class="fa-solid fa-file-signature text-xs"></i><span v-if="!isCollapsed" class="truncate">Division Report</span>
                    </a>
                  </li>
                </ul>
              </transition>
            </li>

                <li v-if="store.canAccessPage('aduan') && isMenuVisible('Customer Support Aduan Layanan', 'aduan')">
                    <a href="#" @click.prevent="navigate('aduan')" class="w-full flex items-center py-1.5 text-[11px] font-semibold rounded-lg" :class="activePage === 'aduan' ? 'bg-theme-gradient text-white font-bold' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50', isCollapsed ? 'justify-center px-0' : 'gap-2.5 px-2.5'">
                      <i class="fa-solid fa-headset text-xs"></i><span v-if="!isCollapsed" class="truncate">Customer Support</span>
                    </a>
                  </li>
                  <li v-if="store.canAccessPage('promo') && isMenuVisible('Marketing Budget Biaya Promosi Ads', 'promo')">
                    <a href="#" @click.prevent="navigate('promo')" class="w-full flex items-center py-1.5 text-[11px] font-semibold rounded-lg" :class="activePage === 'promo' ? 'bg-theme-gradient text-white font-bold' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50', isCollapsed ? 'justify-center px-0' : 'gap-2.5 px-2.5'">
                      <i class="fa-solid fa-wallet text-xs"></i><span v-if="!isCollapsed" class="truncate">Marketing Budget</span>
                    </a>
                  </li>
                <li v-if="store.canAccessPage('report') && isMenuVisible('Laporan Executive Export', 'report')">
                    <a href="#" @click.prevent="navigate('report')" class="w-full flex items-center py-1.5 text-[11px] font-semibold rounded-lg" :class="activePage === 'report' ? 'bg-theme-gradient text-white font-bold' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50', isCollapsed ? 'justify-center px-0' : 'gap-2.5 px-2.5'">
                      <i class="fa-solid fa-file-invoice-dollar text-xs"></i><span v-if="!isCollapsed" class="truncate">Executive Report</span>
                    </a>
                  </li>
        

            <!-- 7. ⚙️ SYSTEM SETTINGS (ACCORDION GROUP - SUPERADMIN KHUSUS) -->
            <li v-if="shouldShowGroup([
              { name: 'Master Data System Target', page: 'master-data', access: isSuperadmin },
              { name: 'Akses Pengguna User Role', page: 'users', access: isSuperadmin }
            ])">
              <button 
                @click="toggleDropdown('system')"
                class="w-full flex items-center py-2 text-xs font-semibold rounded-xl transition-all outline-none cursor-pointer mt-1"
                :class="[
                  isGroupActive(['master-data', 'users']) 
                    ? 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60',
                  isCollapsed ? 'justify-center px-0' : 'justify-between px-3'
                ]"
                :title="isCollapsed ? 'System Settings' : ''"
              >
                <div class="flex items-center gap-3 min-w-0" :class="isCollapsed ? 'justify-center w-full' : ''">
                  <i class="fa-solid fa-gear text-sm shrink-0"></i>
                  <span v-if="!isCollapsed" class="whitespace-nowrap truncate">System Settings</span>
                </div>
                <i 
                  v-if="!isCollapsed" 
                  class="fa-solid fa-chevron-down text-[10px] transition-transform duration-200"
                  :class="{ 'rotate-180': dropdowns.system || searchMenuQuery }"
                ></i>
              </button>

              <transition enter-active-class="transition-all duration-200" leave-active-class="transition-all duration-150">
                <ul v-show="dropdowns.system || isCollapsed || searchMenuQuery" class="mt-1 space-y-1" :class="isCollapsed ? 'px-0' : 'pl-3 border-l-2 border-slate-200 dark:border-slate-800 ml-4'">
                  <li v-if="isSuperadmin && isMenuVisible('Master Data System Target', 'master-data')">
                    <a href="#" @click.prevent="navigate('master-data')" class="w-full flex items-center py-1.5 text-[11px] font-semibold rounded-lg" :class="activePage === 'master-data' ? 'bg-theme-gradient text-white font-bold' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50', isCollapsed ? 'justify-center px-0' : 'gap-2.5 px-2.5'">
                      <i class="fa-solid fa-sliders text-xs"></i><span v-if="!isCollapsed" class="truncate">Master Data</span>
                    </a>
                  </li>
                  <li v-if="isSuperadmin && isMenuVisible('Akses Pengguna User Role', 'users')">
                    <a href="#" @click.prevent="navigate('users')" class="w-full flex items-center py-1.5 text-[11px] font-semibold rounded-lg" :class="activePage === 'users' ? 'bg-theme-gradient text-white font-bold' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50', isCollapsed ? 'justify-center px-0' : 'gap-2.5 px-2.5'">
                      <i class="fa-solid fa-users-gear text-xs"></i><span v-if="!isCollapsed" class="truncate">Akses Pengguna</span>
                    </a>
                  </li>
                </ul>
              </transition>
            </li>
          </template>

        </ul>
      </nav>

      <!-- Bottom Widget: Profil User -->
      <div class="p-1.5 m-2 mb-16 md:mb-2 bg-slate-100/60 dark:bg-slate-800/40 rounded-2xl border border-slate-200/50 dark:border-slate-700/40 flex items-center justify-center shrink-0">
        <button 
          v-if="!isLoggedIn" 
          @click="$emit('open-login')" 
          class="w-full bg-theme-gradient hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          :class="isCollapsed ? 'px-0' : 'px-3'"
          :title="isCollapsed ? 'Masuk / Login' : ''"
        >
          <i class="fa-solid fa-right-to-bracket shrink-0"></i>
          <span v-if="!isCollapsed" class="whitespace-nowrap truncate">Masuk / Login</span>
        </button>

        <button 
          v-else 
          @click="navigate('profile')" 
          class="w-full flex items-center gap-2.5 text-left group outline-none overflow-hidden cursor-pointer p-1 rounded-xl hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors"
          :class="isCollapsed ? 'justify-center' : ''"
          :title="isCollapsed ? (userData?.nama || 'Profil') : ''"
        >
          <img 
            :src="userData?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.nama || 'User')}&background=0D8ABC&color=fff`" 
            class="w-8 h-8 rounded-full object-cover shrink-0 aspect-square border border-emerald-500/40 group-hover:scale-105 transition-transform"
          >
          <div v-if="!isCollapsed" class="min-w-0 flex-1 overflow-hidden">
            <p class="font-bold text-xs truncate leading-tight group-hover:text-emerald-600">
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
import { ref, reactive, computed, watch } from 'vue';
import { store } from '../store/index.js';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  activePage: { type: String, default: 'main' }
});

const emit = defineEmits(['close-sidebar', 'change-page', 'open-login']);

const searchMenuQuery = ref('');

// State Akordeon Dropdown Setiap Group
const dropdowns = reactive({
  units: false,
  campaign: true,
  marketing: false,
  executive: false,
  system: false
});

const toggleDropdown = (key) => {
  if (isCollapsed.value) {
    store.toggleSidebarCollapse();
    dropdowns[key] = true;
  } else {
    dropdowns[key] = !dropdowns[key];
  }
};

const isGroupActive = (pages) => pages.includes(props.activePage);

// Auto Open Group saat Halaman Aktif Diganti
watch(() => props.activePage, (newPage) => {
  if (['unit-NHP', 'unit-NHC', 'unit-KG'].includes(newPage)) dropdowns.units = true;
  if (['progress', 'digmar', 'leads'].includes(newPage)) dropdowns.campaign = true;
  if (['promo', 'spv-report', 'aduan'].includes(newPage)) dropdowns.marketing = true;
  if (['report'].includes(newPage)) dropdowns.executive = true;
  if (['master-data', 'users'].includes(newPage)) dropdowns.system = true;
}, { immediate: true });

watch(() => props.isOpen, (newVal) => {
  if (window.innerWidth < 768) {
    document.body.style.overflow = newVal ? 'hidden' : '';
  }
});

const isCollapsed = computed(() => store.isSidebarCollapsed);
const toggleCollapse = () => store.toggleSidebarCollapse();

const isLoggedIn = computed(() => !!store.currentUser);
const userData = computed(() => store.currentUser || {});

const isSuperadmin = computed(() => {
  const role = userData.value?.role || userData.value?.Role;
  return role ? role.toUpperCase() === 'SUPERADMIN' : false;
});

const hasUnitAccess = (unitName) => store.canAccessPage(`unit-${unitName}`);

const isMenuVisible = (menuName, pageKey) => {
  if (!searchMenuQuery.value) return true;
  const q = searchMenuQuery.value.toLowerCase();
  return menuName.toLowerCase().includes(q) || pageKey.toLowerCase().includes(q);
};

const shouldShowGroup = (menuItems) => {
  return menuItems.some(item => item.access && isMenuVisible(item.name, item.page));
};

const navigate = (page) => {
  emit('change-page', page);
  if (window.innerWidth < 768) {
    document.body.style.overflow = '';
    emit('close-sidebar');
  }
};
</script>