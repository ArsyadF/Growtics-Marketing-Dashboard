<!-- src/components/BottomNav.vue -->
<template>
  <div
    class="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-0 right-0 z-40 md:hidden pointer-events-none flex justify-center px-3"
  >
    <!-- BACKDROP GELAP -->
    <transition name="fade">
      <div
        v-if="activePopup"
        @click.stop="closePopup"
        @touchstart.stop="closePopup"
        class="pointer-events-auto fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-30"
      ></div>
    </transition>

    <!-- CONTAINER NAVBAR -->
    <div
      ref="navContainerRef"
      class="relative w-full max-w-lg pointer-events-auto z-40"
    >
      <!-- POPUP 1: Pilihan Unit Usaha -->
      <transition name="pop-up">
        <div
          v-if="activePopup === 'unit'"
          class="pointer-events-auto absolute bottom-20 left-0 right-0 mx-auto w-[94%] max-w-xs z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-slate-800 p-4 rounded-3xl shadow-2xl space-y-3"
        >
          <p
            class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-1 pb-0.5 text-center"
          >
            Pilih Unit Usaha
          </p>

          <div class="grid grid-cols-3 gap-2">
            <!-- Unit NHP -->
            <button
              v-if="store.canAccessPage('unit-NHP')"
              @click.stop="selectUnit('unit-NHP')"
              class="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-[#25eba11a] border border-slate-100 dark:border-slate-700/50 transition-all cursor-pointer group"
            >
              <div
                class="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center text-sm mb-1 group-hover:scale-110 transition-transform"
              >
                <i class="fa-solid fa-book-open"></i>
              </div>
              <span
                class="text-[10px] font-bold text-slate-700 dark:text-slate-200"
                >NHP</span
              >
            </button>

            <!-- Unit NHC -->
            <button
              v-if="store.canAccessPage('unit-NHC')"
              @click.stop="selectUnit('unit-NHC')"
              class="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-[#25eba11a] border border-slate-100 dark:border-slate-700/50 transition-all cursor-pointer group"
            >
              <div
                class="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-sm mb-1 group-hover:scale-110 transition-transform"
              >
                <i class="fa-solid fa-shirt"></i>
              </div>
              <span
                class="text-[10px] font-bold text-slate-700 dark:text-slate-200"
                >NHC</span
              >
            </button>

            <!-- Unit KG -->
            <button
              v-if="store.canAccessPage('unit-KG')"
              @click.stop="selectUnit('unit-KG')"
              class="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-[#25eba11a] border border-slate-100 dark:border-slate-700/50 transition-all cursor-pointer group"
            >
              <div
                class="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm mb-1 group-hover:scale-110 transition-transform"
              >
                <i class="fa-solid fa-print"></i>
              </div>
              <span
                class="text-[10px] font-bold text-slate-700 dark:text-slate-200"
                >KG</span
              >
            </button>

            <!-- Summary Unit -->
            <button
              v-if="store.canAccessPage('summary')"
              @click.stop="selectUnit('summary')"
              class="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-[#25eba11a] border border-slate-100 dark:border-slate-700/50 transition-all cursor-pointer group"
            >
              <div
                class="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center text-sm mb-1 group-hover:scale-110 transition-transform"
              >
                <i class="fa-solid fa-building"></i>
              </div>
              <span
                class="text-[10px] font-bold text-slate-700 dark:text-slate-200"
                >Rekap Unit</span
              >
            </button>
          </div>
        </div>
      </transition>

      <!-- POPUP 2: Input Data Baru -->
      <transition name="pop-up">
        <div
          v-if="activePopup === 'add'"
          class="pointer-events-auto absolute bottom-20 left-0 right-0 mx-auto w-[94%] max-w-xs z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-slate-800 p-4 rounded-3xl shadow-2xl space-y-3"
        >
          <p
            class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-1 pb-0.5 text-center"
          >
            Input Data Baru
          </p>

          <div class="grid grid-cols-3 gap-2">
            <button
              v-if="store.canEditPage('revenue')"
              @click.stop="openAddModal('revenue')"
              class="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-[#25eba11a] border border-slate-100 dark:border-slate-700/50 transition-all cursor-pointer group"
            >
              <span
                class="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs shrink-0"
              >
                <i class="fa-solid fa-sack-dollar"></i>
              </span>
              <span
                class="text-[10px] font-bold text-slate-700 dark:text-slate-200"
                >Revenue</span
              >
            </button>

            <button
              v-if="store.canEditPage('leads')"
              @click.stop="openAddModal('leads')"
              class="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-[#25eba11a] border border-slate-100 dark:border-slate-700/50 transition-all cursor-pointer group"
            >
              <span
                class="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center text-xs shrink-0"
              >
                <i class="fa-solid fa-users-rays"></i>
              </span>
              <span
                class="text-[10px] font-bold text-slate-700 dark:text-slate-200"
                >Leads</span
              >
            </button>

            <button
              v-if="store.canEditPage('promo')"
              @click.stop="openAddModal('promo')"
              class="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-[#25eba11a] border border-slate-100 dark:border-slate-700/50 transition-all cursor-pointer group"
            >
              <span
                class="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs shrink-0"
              >
                <i class="fa-solid fa-bullhorn"></i>
              </span>
              <span
                class="text-[10px] font-bold text-slate-700 dark:text-slate-200"
                >Promosi</span
              >
            </button>

            <button
              v-if="store.canEditPage('progress')"
              @click.stop="openAddModal('progress')"
              class="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-[#25eba11a] border border-slate-100 dark:border-slate-700/50 transition-all cursor-pointer group"
            >
              <span
                class="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs shrink-0"
              >
                <i class="fa-solid fa-bars-progress"></i>
              </span>
              <span
                class="text-[10px] font-bold text-slate-700 dark:text-slate-200"
                >Progress</span
              >
            </button>

            <button
              v-if="store.canEditPage('spv-report')"
              @click.stop="openAddModal('spv-report')"
              class="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-[#25eba11a] border border-slate-100 dark:border-slate-700/50 transition-all cursor-pointer group"
            >
              <span
                class="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs shrink-0"
              >
                <i class="fa-solid fa-file-signature"></i>
              </span>
              <span
                class="text-[10px] font-bold text-slate-700 dark:text-slate-200"
                >Divisi</span
              >
            </button>

            <button
              v-if="store.canEditPage('notes')"
              @click.stop="openAddModal('notes')"
              class="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-[#25eba11a] border border-slate-100 dark:border-slate-700/50 transition-all cursor-pointer group"
            >
              <span
                class="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xs shrink-0"
              >
                <i class="fa-solid fa-note-sticky"></i>
              </span>
              <span
                class="text-[10px] font-bold text-slate-700 dark:text-slate-200"
                >Notes</span
              >
            </button>
          </div>
        </div>
      </transition>

      <!-- POPUP 3: Modul Workspace -->
      <transition name="pop-up">
        <div
          v-if="activePopup === 'workspace'"
          class="pointer-events-auto absolute bottom-20 left-0 right-0 mx-auto w-[94%] max-w-xs z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-slate-800 p-4 rounded-3xl shadow-2xl space-y-3"
        >
          <p
            class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-1 pb-0.5 text-center"
          >
            Modul Workspace
          </p>

          <div class="grid grid-cols-2 gap-2">
            <button
              v-if="store.canAccessPage('progress')"
              @click.stop="navTo('progress')"
              class="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-500/10 border border-slate-100 dark:border-slate-700/50 transition-all cursor-pointer group"
            >
              <div
                class="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm mb-1.5 group-hover:scale-110 transition-transform"
              >
                <i class="fa-solid fa-bars-progress"></i>
              </div>
              <span
                class="text-[10px] font-bold text-slate-700 dark:text-slate-200 text-center leading-tight"
                >Team Progress</span
              >
            </button>

            <button
              v-if="store.canAccessPage('digmar')"
              @click.stop="navTo('digmar')"
              class="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-500/10 border border-slate-100 dark:border-slate-700/50 transition-all cursor-pointer group"
            >
              <div
                class="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm mb-1.5 group-hover:scale-110 transition-transform"
              >
                <i class="fa-solid fa-share-nodes"></i>
              </div>
              <span
                class="text-[10px] font-bold text-slate-700 dark:text-slate-200 text-center leading-tight"
                >Sosmed Analytics</span
              >
            </button>

            <button
              v-if="store.canAccessPage('leads')"
              @click.stop="navTo('leads')"
              class="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-teal-500/10 border border-slate-100 dark:border-slate-700/50 transition-all cursor-pointer group"
            >
              <div
                class="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center text-sm mb-1.5 group-hover:scale-110 transition-transform"
              >
                <i class="fa-solid fa-users-rays"></i>
              </div>
              <span
                class="text-[10px] font-bold text-slate-700 dark:text-slate-200 text-center leading-tight"
                >Leads & Campaign</span
              >
            </button>

            <button
              v-if="store.canAccessPage('spv-report')"
              @click.stop="navTo('spv-report')"
              class="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-purple-500/10 border border-slate-100 dark:border-slate-700/50 transition-all cursor-pointer group"
            >
              <div
                class="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm mb-1.5 group-hover:scale-110 transition-transform"
              >
                <i class="fa-solid fa-file-signature"></i>
              </div>
              <span
                class="text-[10px] font-bold text-slate-700 dark:text-slate-200 text-center leading-tight"
                >Division Report</span
              >
            </button>
          </div>
        </div>
      </transition>

      <!-- MAIN NAVBAR LEBIH PRESISI TANPA CLIPPATH YANG MERUSAK RADIUS -->
      <nav
        class="pointer-events-auto relative z-30 w-full h-16 flex items-center justify-between"
      >
        <!-- SVG BACKGROUND LAYOUT -->
        <svg
          class="absolute inset-0 w-full h-full transition-all duration-300"
          style="filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.15))"
          viewBox="0 0 375 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="nav-glass-gradient"
              x1="0%"
              y1="100%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                stop-color="var(--primary-color)"
                stop-opacity="0.9"
              />
              <stop
                offset="100%"
                stop-color="var(--primary-light)"
                stop-opacity="0.9"
              />
            </linearGradient>
          </defs>

          <!-- Path SVG dengan sudut atas lebih tegas/normal (r=16/rounded-2xl) -->
          <path
            d="M 0 20 C 0 8.954 8.954 0 20 0 L 140 0 C 149 0 153 5 158 11 C 164 19 171 25 187.5 25 C 204 25 211 19 217 11 C 222 5 226 0 235 0 L 355 0 C 366.046 0 375 8.954 375 20 L 375 44 C 375 55.046 366.046 64 355 64 L 20 64 C 8.954 64 0 55.046 0 44 Z"
            fill="url(#nav-glass-gradient)"
          />
        </svg>

        <!-- CONTAINER ITEM NAVIGASI -->
        <div
          class="relative z-10 w-full flex items-center justify-around h-full px-2"
        >
          <!-- 1. DASHBOARD -->
          <button
            @click.stop="navTo('main')"
            class="flex flex-col items-center justify-center transition-all cursor-pointer h-11 w-16 rounded-2xl shrink-0 focus:outline-none"
            :class="
              store.currentPage === 'main'
                ? 'bg-white text-theme dark:bg-slate-800 shadow-sm font-bold'
                : 'text-white/80 hover:text-white'
            "
          >
            <i class="fa-solid fa-house text-xs"></i>
            <span class="text-[9px] mt-0.5 whitespace-nowrap">Dashboard</span>
          </button>

          <!-- 2. UNIT -->
          <button
            @click.stop="togglePopup('unit')"
            class="flex flex-col items-center justify-center transition-all cursor-pointer h-11 w-16 rounded-2xl shrink-0 focus:outline-none"
            :class="
              activePopup === 'unit' ||
              store.currentPage.startsWith('unit-') ||
              store.currentPage === 'summary'
                ? 'bg-white text-theme dark:bg-slate-800 shadow-sm font-bold'
                : 'text-white/80 hover:text-white'
            "
          >
            <i class="fa-solid fa-building text-xs"></i>
            <span class="text-[9px] mt-0.5 whitespace-nowrap">Unit</span>
          </button>

          <!-- 3. SLOT TENGAH (TOMBOL PLUS) -->
          <div
            class="relative flex justify-center items-center w-14 h-full shrink-0"
          >
            <button
              @click.stop="togglePopup('add')"
              class="absolute -top-4 w-14 h-14 bg-white text-theme dark:bg-slate-800 dark:text-emerald-400 rounded-full shadow-lg flex items-center justify-center text-xl transition-all duration-300 active:scale-90 cursor-pointer border-4 border-slate-100 dark:border-slate-900 z-20 focus:outline-none"
              :class="{
                '!bg-emerald-100 dark:!bg-slate-700': activePopup === 'add',
              }"
            >
              <i
                class="fa-solid fa-plus transition-transform duration-300"
                :class="{ 'rotate-45': activePopup === 'add' }"
              ></i>
            </button>
          </div>

          <!-- 4. WORKSPACE -->
          <button
            @click.stop="togglePopup('workspace')"
            class="flex flex-col items-center justify-center transition-all cursor-pointer h-11 w-16 rounded-2xl shrink-0 focus:outline-none"
            :class="
              activePopup === 'workspace' ||
              ['progress', 'digmar', 'leads', 'spv-report'].includes(
                store.currentPage,
              )
                ? 'bg-white text-theme dark:bg-slate-800 shadow-sm font-bold'
                : 'text-white/80 hover:text-white'
            "
          >
            <i class="fa-solid fa-bullhorn text-xs"></i>
            <span class="text-[9px] mt-0.5 whitespace-nowrap">Workspace</span>
          </button>

          <!-- 5. ADUAN -->
          <button
            @click.stop="navTo('aduan')"
            class="flex flex-col items-center justify-center transition-all cursor-pointer h-11 w-16 rounded-2xl shrink-0 focus:outline-none"
            :class="
              store.currentPage === 'aduan'
                ? 'bg-white text-theme dark:bg-slate-800 shadow-sm font-bold'
                : 'text-white/80 hover:text-white'
            "
          >
            <i class="fa-solid fa-headset text-xs"></i>
            <span class="text-[9px] mt-0.5 whitespace-nowrap">Aduan</span>
          </button>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { store } from "../store";

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

const handleDocumentClick = (event) => {
  if (activePopup.value && navContainerRef.value) {
    if (!navContainerRef.value.contains(event.target)) {
      closePopup();
    }
  }
};

onMounted(() => {
  window.addEventListener("click", handleDocumentClick);
  window.addEventListener("touchstart", handleDocumentClick, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("click", handleDocumentClick);
  window.removeEventListener("touchstart", handleDocumentClick);
});

const openAddModal = (modalName) => {
  activePopup.value = null;

  if (modalName === "progress") {
    store.currentPage = "progress";
    store.openModal("progress");
  } else if (modalName === "spv-report") {
    store.currentPage = "spv-report";
    store.openModal("spv-report");
  } else if (modalName === "notes") {
    if (store.canAccessPage && store.canAccessPage("notes")) {
      store.currentPage = "notes";
    }
    store.openModal("notes");
  } else {
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
