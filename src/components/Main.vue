<!-- src/App.vue (atau main.vue) -->
<template>
  <div id="mainBody" :class="['flex h-screen overflow-hidden text-slate-800 dark:text-slate-100', store.isDarkMode ? 'bg-gradient-dark dark' : 'bg-gradient-light']">

    <!-- Indikator Loading Global -->
    <div 
      v-if="store.isLoading" 
      id="loader" 
      class="fixed inset-0 z-[10001] bg-slate-950/20 backdrop-blur-md flex items-center justify-center"
    >
      <div class="flex flex-col items-center gap-3 bg-white/20 dark:bg-slate-900/30 backdrop-blur-xl border border-white/30 dark:border-white/10 p-6 rounded-3xl shadow-2xl">
        <i class="fa-solid fa-circle-notch fa-spin text-3xl from-[#149B73]"></i>
        <span class="text-xs font-bold text-slate-800 dark:text-slate-100 drop-shadow-sm">
          Memuat Database...
        </span>
      </div>
    </div>

    <!-- Modal Login Pengelola -->
    <LoginModal v-if="store.activeModal === 'login'" @close="store.closeModal()" />

    <!-- OVERLAY PASSCODE PUBLIK (Menggunakan Komponen Passcode.vue) -->
    <Passcode />

    <!-- KONTEN UTAMA DASHBOARD -->
    <div 
      id="appContent" 
      class="flex w-full h-full overflow-hidden transition-all duration-300" 
      :class="{ 'content-locked': !store.isAccessGranted }"
    >
      <Sidebar 
        :active-page="store.currentPage"
        @change-page="store.currentPage = $event"
        @open-login="store.openModal('login')"
      />

      <main class="flex-1 overflow-x-hidden overflow-y-auto relative flex flex-col">
        <Header />
      
        <div class="p-4 md:p-6 flex-1 space-y-4 md:space-y-6">
          <!-- Dynamic Component berdasarkan store.currentPage -->
          <component :is="activeView" />
        </div>
      </main>
    </div>

    <!-- Pop-up Dynamic Modals (Revenue, Target, Leads, Users) -->
    <Modals v-if="store.activeModal && store.activeModal !== 'login'" />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { store } from '../store';

// Import Komponen Layout & Modal
import Sidebar from '../components/Sidebar.vue';
import Header from '../components/Header.vue';
import Passcode from '../components/Passcode.vue';
import LoginModal from '../components/LoginModal.vue';
import Modals from '../components/Modals.vue';


// Import Komponen Halaman (View)
import DashboardMain from '../views/Dashboard.vue';
import PageUnit from '../views/PageUnit.vue';
import PageLeads from '../views/PageLeads.vue';
import PagePromo from '../views/PagePromo.vue';
import PageTargets from '../views/PageTargets.vue';
import PageUsers from '../views/PageUsers.vue';
import PageProfile from '../views/PageProfile.vue';

// --- DYNAMIC ROUTING VIEW ---
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

// --- CEK SESI AWAL ---
onMounted(() => {
  if (store.currentUser) {
    store.isAccessGranted = true;
    store.loadFullDatabase();
  } else {
    store.isAccessGranted = false; // Kunci akses halaman jika belum terautentikasi
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

