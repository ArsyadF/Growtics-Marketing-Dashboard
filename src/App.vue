<!-- App.vue -->
<!-- src/App.vue -->
<template>
  <div 
    id="mainBody" 
    :class="[
      `pb-[env(safe-area-inset-bottom,16px)]`, 
      'flex min-h-screen w-full text-slate-800 dark:text-slate-100 transition-colors duration-300', 
      store.isDarkMode ? 'bg-gradient-dark dark' : 'bg-gradient-light'
    ]"
  >

    <!-- Indikator Loading Global -->
    <div 
      v-if="store.isLoading" 
      id="loader" 
      class="fixed inset-0 z-[10005] bg-slate-950/20 backdrop-blur-md flex items-center justify-center"
    >
      <div class="flex flex-col items-center gap-3 bg-white/20 dark:bg-slate-900/30 backdrop-blur-xl border border-white/30 dark:border-white/10 p-6 rounded-3xl shadow-2xl">
        <i class="fa-solid fa-circle-notch fa-spin text-3xl text-theme"></i>
        <span class="text-xs font-bold text-slate-800 dark:text-slate-100 drop-shadow-sm">
          Memuat...
        </span>
      </div>
    </div>

    <!-- Modal Login Pengelola -->
    <LoginModal v-if="store.activeModal === 'login'" @close="store.closeModal()" />

    <!-- Overlay Passcode Publik -->
    <Passcode />

    <!-- KONTEN UTAMA DASHBOARD -->
    <div 
      id="appContent" 
      class="flex w-full min-w-0 min-h-screen transition-all duration-300 relative" 
      :class="{ 'content-locked': !store.isAccessGranted }"
    >
      <!-- Spacer Sidebar Desktop -->
      <div 
        class="hidden md:block shrink-0 transition-all duration-300"
        :class="store.isSidebarCollapsed ? 'w-20' : 'w-64'"
      ></div>

      <!-- Sidebar Navigation -->
      <Sidebar 
        :is-open="isSidebarOpen"
        :active-page="store.currentPage"
        @close-sidebar="isSidebarOpen = false"
        @change-page="store.currentPage = $event"
        @open-login="store.openModal('login')"
      />

      <!-- Area Konten Utama -->
      <main class="flex-1 w-full min-w-0 relative flex flex-col pb-16 md:pb-6 z-0">
        <!-- Header -->
        <Header @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />

        <!-- Pembungkus View Utama -->
        <div class="p-4 md:p-6 flex-1 w-full space-y-4 md:space-y-6 relative z-10">
          <template v-if="store.isAccessGranted">
            
            <!-- 1. JIKA DI HALAMAN UTAMA / DASHBOARD STAFF -->
            <template v-if="store.currentPage === 'main' || store.currentPage === 'staff-dashboard'">
              <!-- Jika Superadmin / SPV, tampilkan Dashboard Utama Lengkap (Omset & Grafik) -->
              <PageMainDashboard v-if="isSuperadminOrSpv" />
              <!-- Jika Staff biasa, tampilkan Staff Dashboard (Grid Kotak & Ringkasan Non-Sensitif) -->
              <PageStaffDashboard v-else />
            </template>

            <!-- 2. JIKA DI HALAMAN MODUL KINERJA LAIN (Progress, Aduan, Reports, dll) -->
            <template v-else>
              <component :is="activeView" v-if="store.canAccessPage(store.currentPage)" />
              
              <!-- Peringatan jika akun tidak punya izin -->
              <div v-else class="glass-card p-12 text-center rounded-3xl space-y-3 mt-10">
                <i class="fa-solid fa-lock text-4xl text-rose-500 mb-2"></i>
                <h3 class="font-bold text-lg text-slate-800 dark:text-slate-100">Akses Terbatas !</h3>
                <p class="text-xs text-slate-400">Akun Anda tidak memiliki izin untuk mengakses halaman ini.</p>
              </div>
            </template>

          </template>
        </div>

        <!-- Bottom Navigation Mobile -->
        <BottomNav />
      </main>
    </div>

    <!-- Pop-up Modals Dynamic -->
    <Modals v-if="store.activeModal && store.activeModal !== 'login'" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { store } from './store/index.js';

let touchStartX = 0;
let touchStartY = 0;

// State Sidebar Mobile Open/Close
const isSidebarOpen = ref(false);

// Tumpukan Riwayat Halaman untuk Back di Dalam App
const pageHistory = ref([]);
const isBackAction = ref(false);

// Import Komponen Layout & Modals
import Passcode from './components/Passcode.vue';
import Sidebar from './components/Sidebar.vue';
import Header from './components/Header.vue';
import LoginModal from './components/LoginModal.vue';
import Modals from './components/Modals.vue';
import BottomNav from './components/BottomNav.vue';

// Import Views Utama (Existing)
import PageStaffDashboard from './views/PageStaffDashboard.vue';
import PageSummary from './views/PageSummary.vue';
import PageUnit from './views/PageUnit.vue';
import PageLeads from './views/PageLeads.vue';
import PagePromo from './views/PagePromo.vue';
import PageUsers from './views/PageUsers.vue';
import PageProfile from './views/PageProfile.vue';
import PageNote from './views/PageNote.vue';
import PageProgress from './views/PageProgress.vue';
import PageDigmar from './views/PageDigmar.vue';
import PageReport from './views/PageReport.vue';
import PageSpvReport from './views/PageSpvReport.vue';
import PageMasterData from './views/PageMasterData.vue';
import PageCustomerCare from './views/PageCustomerCare.vue';
// --- DYNAMIC COMPONENT ROUTING ---
const activeView = computed(() => {
  if (store.currentPage.startsWith('unit-')) {
    return PageUnit;
  }

  switch (store.currentPage) {
    case 'main':
      return PageStaffDashboard;
    case 'summary':
      return PageSummary;
    case 'notes':
      return PageNote;
    case 'progress':
      return PageProgress;
    case 'digmar':
      return PageDigmar;
    case 'leads':
      return PageLeads;
    case 'spv-report': 
      return PageSpvReport;
    case 'aduan':
      return PageCustomerCare;
    case 'promo':
      return PagePromo;
    case 'report':
      return PageReport;
    case 'master-data':
      return PageMasterData;
    case 'users':
      return PageUsers;
    case 'profile':
      return PageProfile;
    default:
      return DashboardMain;
  }
});

// --- RECORD NAVIGASI DALAM APP ---
watch(() => store.currentPage, (newPage, oldPage) => {
  if (isBackAction.value) {
    isBackAction.value = false;
    return;
  }

  if (oldPage && newPage !== oldPage) {
    if (pageHistory.value[pageHistory.value.length - 1] !== oldPage) {
      pageHistory.value.push(oldPage);
    }
  }
});

const handleTouchStart = (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
};

const handleTouchEnd = (e) => {
  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;

  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  // Pastikan swipe mendatar (bukan scroll vertikal) dan jarak swipe > 70px
  if (deltaX > 70 && Math.abs(deltaY) < 50) {
    // Jika swipe dari pinggir kiri (kurang dari 50px dari tepi layar)
    if (touchStartX < 50) {
      // Buka sidebar
      isSidebarOpen.value = true;
    }
  }
};


// --- HOOK INISIALISASI UTAMA & RESTORE LOGIN ---

onUnmounted(() => {
  window.removeEventListener('touchstart', handleTouchStart);
  window.removeEventListener('touchend', handleTouchEnd);
});

onMounted(() => {
  window.addEventListener('touchstart', handleTouchStart, { passive: true });
  window.addEventListener('touchend', handleTouchEnd, { passive: true });
});

onMounted(async () => {
  store.initTheme();
  store.initThemeColor();

  const savedUser = localStorage.getItem('SESSION_USER');
  if (savedUser) {
    try {
      store.currentUser = JSON.parse(savedUser);
      store.isAccessGranted = true;
      await store.loadFullDatabase();
    } catch (e) {
      console.error("Gagal restore session:", e);
    }
  }

  window.handleAndroidBack = () => {
    if (pageHistory.value.length > 0) {
      const previousPage = pageHistory.value.pop();
      isBackAction.value = true;
      store.currentPage = previousPage;
      return "true";
    } 
    else if (store.currentPage !== 'main') {
      isBackAction.value = true;
      store.currentPage = 'main';
      return "true";
    }
    return "false";
  };
});
</script>

<style>
.content-locked {
  filter: blur(16px) grayscale(40%) !important;
  pointer-events: none !important;
  user-select: none !important;
}
</style>