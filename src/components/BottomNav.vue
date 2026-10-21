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
            class="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 pt-1 pb-0.5 text-center"
          >
            Pilih Unit Usaha
          </p>
          <div class="grid grid-cols-3 gap-2">
            <template v-for="menu in unitMenus" :key="menu.id">
              <button
                v-if="menu.condition()"
                @click.stop="menu.action"
                class="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-[#25eba11a] border border-slate-100 dark:border-slate-700/50 transition-all cursor-pointer group"
              >
                <div
                  :class="[
                    'w-9 h-9 rounded-xl flex items-center justify-center text-sm mb-1 group-hover:scale-110 transition-transform',
                    menu.iconClass,
                  ]"
                >
                  <i :class="menu.icon"></i>
                </div>
                <span
                  class="text-xs font-semibold text-slate-700 dark:text-slate-200"
                  >{{ menu.label }}</span
                >
              </button>
            </template>
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
            class="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 pt-1 pb-0.5 text-center"
          >
            Input Data Baru
          </p>
          <div class="grid grid-cols-3 gap-2">
            <template v-for="menu in addMenus" :key="menu.id">
              <button
                v-if="menu.condition()"
                @click.stop="menu.action"
                class="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-[#25eba11a] border border-slate-100 dark:border-slate-700/50 transition-all cursor-pointer group"
              >
                <span
                  :class="[
                    'w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0',
                    menu.iconClass,
                  ]"
                >
                  <i :class="menu.icon"></i>
                </span>
                <span
                  class="text-xs font-semibold text-slate-700 dark:text-slate-200 text-center"
                  >{{ menu.label }}</span
                >
              </button>
            </template>
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
            class="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 pt-1 pb-0.5 text-center"
          >
            Modul Workspace
          </p>
          <div class="grid grid-cols-2 gap-2">
            <template v-for="menu in workspaceMenus" :key="menu.id">
              <button
                v-if="menu.condition()"
                @click.stop="menu.action"
                class="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 transition-all cursor-pointer group"
                :class="menu.hoverBg"
              >
                <div
                  :class="[
                    'w-9 h-9 rounded-xl flex items-center justify-center text-sm mb-1.5 group-hover:scale-110 transition-transform',
                    menu.iconClass,
                  ]"
                >
                  <i :class="menu.icon"></i>
                </div>
                <span
                  class="text-xs font-semibold text-slate-700 dark:text-slate-200 text-center leading-tight"
                  >{{ menu.label }}</span
                >
              </button>
            </template>
          </div>
        </div>
      </transition>

      <!-- MAIN NAVBAR -->
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
          <path
            d="M 0 20 C 0 8.954 8.954 0 20 0 L 140 0 C 149 0 153 5 158 11 C 164 19 171 25 187.5 25 C 204 25 211 19 217 11 C 222 5 226 0 235 0 L 355 0 C 366.046 0 375 8.954 375 20 L 375 44 C 375 55.046 366.046 64 355 64 L 20 64 C 8.954 64 0 55.046 0 44 Z"
            fill="url(#nav-glass-gradient)"
          />
        </svg>

        <!-- CONTAINER ITEM NAVIGASI UTAMA -->
        <div
          class="relative z-10 w-full flex items-center justify-around h-full px-2"
        >
          <!-- 1. DASHBOARD -->
          <div class="flex flex-col items-center justify-center">
            <button
              @click.stop="navTo('main')"
              class="items-center transition-all cursor-pointer h-8 w-12 rounded-2xl shrink-0 focus:outline-none"
              :class="
                store.currentPage === 'main'
                  ? 'bg-white text-theme shadow-sm font-semibold'
                  : 'text-white/80 hover:text-white font-normal'
              "
            >
              <i class="fa-solid fa-house text-sm"></i>
            </button>
            <span
              class="text-xs text-white dark:text-slate-100 mt-0.5 whitespace-nowrap font-normal"
              >Dashboard</span
            >
          </div>

          <!-- 2. UNIT -->
          <div class="flex flex-col items-center justify-center">
            <button
              @click.stop="togglePopup('unit')"
              class="items-center transition-all cursor-pointer h-8 w-12 rounded-2xl shrink-0 focus:outline-none"
              :class="
                activePopup === 'unit' ||
                store.currentPage.startsWith('unit-') ||
                store.currentPage === 'summary'
                  ? 'bg-white text-theme shadow-sm font-semibold'
                  : 'text-white/80 hover:text-white font-normal'
              "
            >
              <i class="fa-solid fa-building text-sm"></i>
            </button>
            <span
              class="text-xs text-white mt-0.5 whitespace-nowrap font-normal"
              >Unit</span
            >
          </div>

          <!-- 3. SLOT TENGAH (TOMBOL PLUS) -->
          <div
            class="relative flex justify-center items-center w-14 h-full shrink-0"
          >
            <button
              @click.stop="togglePopup('add')"
              class="absolute -top-4 w-14 h-14 bg-theme-gradient text-white rounded-full shadow-lg flex items-center justify-center text-xl transition-all duration-300 active:scale-90 cursor-pointer border-4 border-slate-100 dark:border-slate-900 z-20 focus:outline-none"
              :class="{
                '!bg-slate-200 dark:!bg-slate-700': activePopup === 'add',
              }"
            >
              <i
                class="fa-solid fa-plus transition-transform duration-300"
                :class="{ 'rotate-45': activePopup === 'add' }"
              ></i>
            </button>
          </div>

          <!-- 4. WORKSPACE -->
          <div class="flex flex-col items-center justify-center">
            <button
              @click.stop="togglePopup('workspace')"
              class="items-center transition-all cursor-pointer h-8 w-12 rounded-2xl shrink-0 focus:outline-none"
              :class="
                activePopup === 'workspace' ||
                ['progress', 'digmar', 'leads', 'spv-report'].includes(
                  store.currentPage,
                )
                  ? 'bg-white text-theme shadow-sm font-semibold'
                  : 'text-white/80 hover:text-white font-normal'
              "
            >
              <i class="fa-solid fa-bars-progress text-sm"></i>
            </button>
            <span
              class="text-xs text-white mt-0.5 whitespace-nowrap font-normal"
              >Workspace</span
            >
          </div>

          <!-- 5. ADUAN -->
          <div class="flex flex-col items-center justify-center">
            <button
              @click.stop="navTo('aduan')"
              class="items-center transition-all cursor-pointer h-8 w-12 rounded-3xl shrink-0 focus:outline-none"
              :class="
                store.currentPage === 'aduan'
                  ? 'bg-white text-theme shadow-sm font-semibold'
                  : 'text-white/80 hover:text-white font-normal'
              "
            >
              <i class="fa-solid fa-headset text-sm"></i>
            </button>
            <span
              class="text-xs text-white mt-0.5 whitespace-nowrap font-normal"
              >Aduan</span
            >
          </div>
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
  activePopup.value = activePopup.value === type ? null : type;
};

const navTo = (page) => {
  store.currentPage = page;
  closePopup();
};

const selectUnit = (unitPage) => {
  store.currentPage = unitPage;
  closePopup();
};

const openAddModal = (modalName) => {
  closePopup();
  // Menyederhanakan logika if-else yang panjang
  const pageOverrides = [
    "revenue",
    "leads",
    "promo",
    "progress",
    "spv-report",
    "daily-report",
    "notes",
  ];
  if (pageOverrides.includes(modalName)) {
    if (
      modalName !== "notes" ||
      (store.canAccessPage && store.canAccessPage("notes"))
    ) {
      store.currentPage = modalName;
    }
  }
  store.openModal(modalName);
};

// ==========================================
// KONFIGURASI MENU DATA-DRIVEN
// ==========================================
const unitMenus = [
  {
    id: "unit-NHP",
    label: "NHP",
    icon: "fa-solid fa-book-open",
    iconClass: "bg-teal-500/10 text-teal-600",
    condition: () => store.canAccessPage("unit-NHP"),
    action: () => selectUnit("unit-NHP"),
  },
  {
    id: "unit-NHC",
    label: "NHC",
    icon: "fa-solid fa-shirt",
    iconClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    condition: () => store.canAccessPage("unit-NHC"),
    action: () => selectUnit("unit-NHC"),
  },
  {
    id: "unit-KG",
    label: "KG",
    icon: "fa-solid fa-print",
    iconClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    condition: () => store.canAccessPage("unit-KG"),
    action: () => selectUnit("unit-KG"),
  },
  {
    id: "summary",
    label: "Rekap Unit",
    icon: "fa-solid fa-chart-line",
    iconClass: "bg-teal-500/10 text-teal-600",
    condition: () => store.canAccessPage("summary"),
    action: () => selectUnit("summary"),
  },
];

const addMenus = [
  {
    id: "revenue",
    label: "Revenue",
    icon: "fa-solid fa-sack-dollar",
    iconClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    condition: () => store.canEditPage("revenue"),
    action: () => openAddModal("revenue"),
  },
  {
    id: "leads",
    label: "Leads",
    icon: "fa-solid fa-users-rays",
    iconClass: "bg-teal-500/10 text-teal-600",
    condition: () => store.canEditPage("leads"),
    action: () => openAddModal("leads"),
  },
  {
    id: "promo",
    label: "Promosi",
    icon: "fa-solid fa-bullhorn",
    iconClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    condition: () => store.canEditPage("promo"),
    action: () => openAddModal("promo"),
  },
  {
    id: "progress",
    label: "Progress",
    icon: "fa-solid fa-bars-progress",
    iconClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    condition: () => store.canEditPage("progress"),
    action: () => openAddModal("progress"),
  },
  {
    id: "spv-report",
    label: "Divisi",
    icon: "fa-solid fa-file-signature",
    iconClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    condition: () => store.canEditPage("spv-report"),
    action: () => openAddModal("spv-report"),
  },
  {
    id: "notes",
    label: "Notes",
    icon: "fa-solid fa-note-sticky",
    iconClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    condition: () => store.canEditPage("notes"),
    action: () => openAddModal("notes"),
  },
  {
    id: "daily-report",
    label: "Laporan Harian",
    icon: "fa-solid fa-file-invoice",
    iconClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    condition: () => store.canEditPage("daily-report"),
    action: () => openAddModal("daily-report"),
  },
];

const workspaceMenus = [
  {
    id: "progress",
    label: "Team Progress",
    icon: "fa-solid fa-bars-progress",
    iconClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    hoverBg: "hover:bg-emerald-500/10",
    condition: () => store.canAccessPage("progress"),
    action: () => navTo("progress"),
  },
  {
    id: "digmar",
    label: "Socmed Analytics",
    icon: "fa-solid fa-share-nodes",
    iconClass: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
    hoverBg: "hover:bg-blue-500/10",
    condition: () => store.canAccessPage("digmar"),
    action: () => navTo("digmar"),
  },
  {
    id: "leads",
    label: "Leads & Campaign",
    icon: "fa-solid fa-users-rays",
    iconClass: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    hoverBg: "hover:bg-teal-500/10",
    condition: () => store.canAccessPage("leads"),
    action: () => navTo("leads"),
  },
  {
    id: "spv-report",
    label: "Division Report",
    icon: "fa-solid fa-file-signature",
    iconClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    hoverBg: "hover:bg-purple-500/10",
    condition: () => store.canAccessPage("spv-report"),
    action: () => navTo("spv-report"),
  },
];

const handleDocumentClick = (event) => {
  if (
    activePopup.value &&
    navContainerRef.value &&
    !navContainerRef.value.contains(event.target)
  ) {
    closePopup();
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
