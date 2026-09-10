<template>
  <div id="mainBody" :class="[ `pb-[env(safe-area-inset-bottom,16px)]`, 'flex min-h-screen w-full text-slate-800 dark:text-slate-100', store.isDarkMode ? 'bg-gradient-dark dark' : 'bg-gradient-light' ]">

    <!-- Indikator Loading Global -->
    <div 
      v-if="store.isLoading" 
      id="loader" 
      class="fixed inset-0 z-[10005] bg-slate-950/20 backdrop-blur-md flex items-center justify-center"
    >
      <div class="flex flex-col items-center gap-3 bg-white/20 dark:bg-slate-900/30 backdrop-blur-xl border border-white/30 dark:border-white/10 p-6 rounded-3xl shadow-2xl">
        <i class="fa-solid fa-circle-notch fa-spin text-3xl text-blue-500"></i>
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

      <!-- Area Konten Utama (Scroll Alami untuk WebView Android) -->
      <main class="flex-1 w-full min-w-0 relative flex flex-col pb-16 md:pb-6">
        <!-- Header -->
        <Header @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />

        <!-- Pembungkus View Utama -->
          <div class="p-4 md:p-6 flex-1 w-full space-y-4 md:space-y-6">
           <template v-if="store.isAccessGranted">
            <component :is="activeView" v-if="store.canAccessPage(store.currentPage)" />
            
            <!-- Jika tidak punya akses ke halaman tersebut -->
            <div v-else class="glass-card p-12 text-center rounded-3xl space-y-3 mt-10">
              <i class="fa-solid fa-lock text-4xl text-rose-500 mb-2"></i>
              <h3 class="font-bold text-lg text-slate-800 dark:text-slate-100">Akses Terbatas !</h3>
              <p class="text-xs text-slate-400">Akun Anda hanya dapat mengakses menu yang diperbolehkan.</p>
            </div>
          </template>
          </div>
        <BottomNav class="pb-[env(safe-area-inset-bottom,16px)]"/>
      </main>
    </div>

    <!-- Pop-up Modals Dynamic -->
    <Modals v-if="store.activeModal && store.activeModal !== 'login'" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { store } from './store';

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

// Import Views
import DashboardMain from './views/Dashboard.vue';
import PageUnit from './views/PageUnit.vue';
import PageLeads from './views/PageLeads.vue';
import PagePromo from './views/PagePromo.vue';
import PageTargets from './views/PageTargets.vue';
import PageUsers from './views/PageUsers.vue';
import PageProfile from './views/PageProfile.vue';

// --- DYNAMIC COMPONENT ROUTING ---
const activeView = computed(() => {
  if (store.currentPage.startsWith('unit')) {
    return PageUnit;
  }

  switch (store.currentPage) {
    case 'main':
      return DashboardMain;
    case 'leads':
      return PageLeads;
    case 'promo':
      return PagePromo;
    case 'targets':
      return PageTargets;
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
  // Jika perpindahan karena tombol back ditekan, abaikan agar tidak loop
  if (isBackAction.value) {
    isBackAction.value = false;
    return;
  }

  // Catat riwayat halaman jika user berpindah menu
  if (oldPage && newPage !== oldPage) {
    if (pageHistory.value[pageHistory.value.length - 1] !== oldPage) {
      pageHistory.value.push(oldPage);
    }
  }
});

// --- HOOK INISIALISASI UTAMA & RESTORE LOGIN ---
onMounted(async () => {
  // 1. Memulihkan Sesi Pengguna saat Refresh / Buka Aplikasi
  const savedUser = localStorage.getItem('SESSION_USER');
  if (savedUser) {
    try {
      store.currentUser = JSON.parse(savedUser);
      store.isAccessGranted = true; // Langsung beri akses tanpa passcode
      await store.loadFullDatabase(); // Load data terbaru dari Firestore
    } catch (e) {
      console.error("Gagal restore session:", e);
    }
  }

  // 2. Bridge Khusus Tombol Back HP (Murni untuk Navigasi Dalam App)
  window.handleAndroidBack = () => {
    // Jika masih ada riwayat halaman sebelumnya, mundurkan 1 langkah
    if (pageHistory.value.length > 0) {
      const previousPage = pageHistory.value.pop();
      isBackAction.value = true;
      store.currentPage = previousPage;
    } 
    // Jika riwayat habis tapi posisi tidak di 'main', kembalikan ke 'main'
    else if (store.currentPage !== 'main') {
      isBackAction.value = true;
      store.currentPage = 'main';
    }
    // Jika sudah di 'main', TIDAK MELAKUKAN APA-APA (App tetap diam di Dashboard Utama)
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