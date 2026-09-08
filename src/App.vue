<template>
  <div id="mainBody" :class="['flex h-screen w-full overflow-hidden text-slate-800 dark:text-slate-100', store.isDarkMode ? 'bg-gradient-dark dark' : 'bg-gradient-light']">

    <!-- Indikator Loading Global -->
    <div 
      v-if="store.isLoading" 
      id="loader" 
      class="fixed inset-0 z-[10005] bg-slate-950/20 backdrop-blur-md flex items-center justify-center"
    >
      <div class="flex flex-col items-center gap-3 bg-white/20 dark:bg-slate-900/30 backdrop-blur-xl border border-white/30 dark:border-white/10 p-6 rounded-3xl shadow-2xl">
        <i class="fa-solid fa-circle-notch fa-spin text-3xl text-blue-500"></i>
        <span class="text-xs font-bold text-slate-800 dark:text-slate-100 drop-shadow-sm">
          Memuat Database Firebase...
        </span>
      </div>
    </div>

    <!-- Modal Login Pengelola -->
    <LoginModal v-if="store.activeModal === 'login'" @close="store.closeModal()" />

    <!-- Overlay Passcode Publik -->
    <Passcode />

    <!-- KONTEN UTAMA DASHBOARD (FULL-WIDTH FIX) -->
    <div 
      id="appContent" 
      class="flex w-full min-w-0 h-full overflow-hidden transition-all duration-300 relative" 
      :class="{ 'content-locked': !store.isAccessGranted }"
    >
      <!-- Sidebar Navigation (Ditambahkan prop :is-open & event @close-sidebar) -->
      <Sidebar 
        :is-open="isSidebarOpen"
        :active-page="store.currentPage"
        @close-sidebar="isSidebarOpen = false"
        @change-page="store.currentPage = $event"
        @open-login="store.openModal('login')"
      />

      <!-- Area Konten Utama -->
      <main class="flex-1 w-full min-w-0 overflow-x-hidden overflow-y-auto relative flex flex-col">
        <!-- Header (Ditambahkan event @toggle-sidebar) -->
        <Header @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />

        <!-- Pembungkus View Utama Tanpa Pembatasan Max-Width -->
        <div class="p-4 md:p-6 flex-1 w-full space-y-4 md:space-y-6">
          <component :is="activeView" />
        </div>
      </main>
    </div>

    <!-- Pop-up Modals Dynamic (Revenue, Target, User, KodeAkses) -->
    <Modals v-if="store.activeModal && store.activeModal !== 'login'" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { store } from './store';

// State Sidebar Mobile Open/Close
const isSidebarOpen = ref(false);

// Import Komponen Layout & Modals
import Passcode from './components/Passcode.vue';
import Sidebar from './components/Sidebar.vue';
import Header from './components/Header.vue';
import LoginModal from './components/LoginModal.vue';
import Modals from './components/Modals.vue';

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

// --- HOOK INISIALISASI UTAMA ---
onMounted(async () => {
  if (store.currentUser) {
    store.isAccessGranted = true;
    await store.loadFullDatabase();
  } else {
    store.isAccessGranted = false;
  }
});
</script>

<style>
.content-locked {
  filter: blur(16px) grayscale(40%) !important;
  pointer-events: none !important;
  user-select: none !important;
}
</style>