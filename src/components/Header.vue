<!-- src/components/Header.vue -->
<template>
  <header
    class="sticky top-0 z-40 pt-[max(1.5rem,env(safe-area-inset-top))] md:pt-4 px-4 md:px-6 pb-4 flex items-center justify-between gap-3 transition-all duration-300 transform"
    :class="[
      isHeaderHidden
        ? '-translate-y-full opacity-0 pointer-events-none'
        : 'translate-y-0 opacity-100',
      isScrolled
        ? 'bg-gradient-to-b from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 dark:to-transparent backdrop-blur-md shadow-xs'
        : 'bg-gradient-to-b from-white/90 to-transparent dark:from-slate-950/90 dark:to-transparent',
    ]"
  >
    <!-- SISI KIRI: Hamburger Mobile (Khusus Mobile) -->
    <div class="flex items-center gap-2 md:gap-3 shrink-0 md:min-w-0">
      <button
        @click.stop="$emit('toggle-sidebar')"
        type="button"
        class="md:hidden text-slate-600 dark:text-amber-400 w-10 h-10 rounded-full glass-card hover:scale-105 transition-all cursor-pointer flex items-center justify-center shrink-0 z-20 relative"
        title="Buka Menu"
      >
        <i class="fa-solid fa-bars text-lg"></i>
      </button>
    </div>

    <!-- TENGAH (Mobile) / KIRI (Desktop): Judul Halaman Dinamis -->
    <div class="flex-1 text-center md:text-left min-w-0 px-2">
      <h2
        class="dynamic-page-title text-base md:text-xl font-bold text-slate-800 dark:text-slate-100 truncate"
      >
        {{ dynamicPageTitle }}
      </h2>
    </div>

    <!-- SISI KANAN: Filter Tanggal Desktop, Lonceng Notifikasi & Toggle Theme -->
    <div class="flex items-center gap-2 md:gap-3 shrink-0 relative">
      <!-- Filter Tanggal Global (KHUSUS DESKTOP) -->
      <div
        class="hidden md:flex items-center space-x-2 glass-input p-1.5 rounded-xl text-xs overflow-x-auto"
      >
        <span class="text-slate-500 dark:text-slate-400 font-medium px-1"
          >Filter:</span
        >

        <input
          v-model="tempStartDate"
          type="date"
          class="bg-transparent rounded-lg px-1.5 py-1 dark:text-slate-100 outline-none w-auto text-xs"
        />
        <span class="dark:text-slate-400">-</span>
        <input
          v-model="tempEndDate"
          type="date"
          class="bg-transparent rounded-lg px-1.5 py-1 dark:text-slate-100 outline-none w-auto text-xs"
        />

        <!-- Tombol Terapkan -->
        <button
          @click="applyFilter"
          class="bg-button text-white px-3 py-1 rounded-lg font-medium transition-all shadow-md text-xs cursor-pointer flex items-center gap-1 shrink-0 hover:opacity-95"
          title="Terapkan Filter Tanggal"
        >
          <i class="fa-solid fa-filter"></i>
          <span>Terapkan</span>
        </button>

        <!-- Tombol Reset -->
        <button
          @click="resetFilter"
          class="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded-lg font-medium transition-all text-xs cursor-pointer flex items-center gap-1 shrink-0"
          title="Reset ke Awal Tahun s/d Hari Ini"
        >
          <i class="fa-solid fa-rotate-left"></i>
          <span>Reset</span>
        </button>
      </div>

      <!-- ================= POPUP ICON LONCENG NOTIFIKASI ================= -->
      <div class="relative">
        <button
          @click="toggleNotifPopup"
          class="w-10 h-10 md:w-11 md:h-11 rounded-full glass-card text-slate-600 dark:text-slate-300 hover:scale-105 transition-all cursor-pointer flex items-center justify-center shrink-0 relative"
          title="Notifikasi Aktivitas"
        >
          <i class="fa-solid fa-bell text-base md:text-lg"></i>
          <!-- Badge Jumlah Belum Dibaca -->
          <span
            v-if="unreadCount > 0"
            class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-pulse"
          >
            {{ unreadCount > 9 ? "9+" : unreadCount }}
          </span>
        </button>

        <!-- POPUP CARD NOTIFIKASI -->
        <div
          v-if="isNotifOpen"
          class="absolute right-0 mt-3 w-72 sm:w-80 glass-card bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-2xl border border-slate-100 dark:border-slate-800 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div
            class="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800"
          >
            <div class="flex items-center gap-2">
              <h4 class="font-bold text-xs text-slate-800 dark:text-slate-100">
                Notifikasi
              </h4>
              <span
                v-if="unreadCount > 0"
                class="text-[9px] font-bold text-theme bg-button/10 px-2 py-0.5 rounded-full"
              >
                {{ unreadCount }} Baru
              </span>
            </div>
            <button
              @click="store.clearNotifications()"
              class="text-[10px] font-semibold text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
            >
              Hapus Semua
            </button>
          </div>

          <!-- List Notifikasi Aktivitas CRUD -->
          <div
            class="max-h-64 overflow-y-auto py-2 space-y-2 [scrollbar-width:none]"
          >
            <template
              v-if="store.notifications && store.notifications.length > 0"
            >
              <div
                v-for="notif in store.notifications"
                :key="notif.id"
                class="p-2.5 rounded-2xl transition-all border text-xs flex gap-2.5 items-start"
                :class="
                  notif.read
                    ? 'bg-transparent border-transparent opacity-70'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-100 dark:border-slate-700/50'
                "
              >
                <!-- Icon Tipe Notif -->
                <div
                  class="w-7 h-7 rounded-xl shrink-0 flex items-center justify-center text-xs mt-0.5"
                  :class="{
                    'bg-emerald-500/10 text-emerald-500':
                      notif.type === 'success',
                    'bg-rose-500/10 text-rose-500': notif.type === 'danger',
                    'bg-amber-500/10 text-amber-500': notif.type === 'warning',
                    'bg-button/10 text-theme': notif.type === 'info',
                  }"
                >
                  <i
                    class="fa-solid"
                    :class="{
                      'fa-check': notif.type === 'success',
                      'fa-trash-can': notif.type === 'danger',
                      'fa-pen-to-square': notif.type === 'warning',
                      'fa-info': notif.type === 'info',
                    }"
                  ></i>
                </div>

                <!-- Konten Pesan -->
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-start">
                    <p
                      class="font-bold text-slate-800 dark:text-slate-100 text-[11px] truncate"
                    >
                      {{ notif.title }}
                    </p>
                    <span class="text-[9px] text-slate-400 shrink-0 ml-1">{{
                      notif.time
                    }}</span>
                  </div>
                  <p
                    class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug"
                  >
                    {{ notif.message }}
                  </p>
                </div>
              </div>
            </template>

            <!-- Kosong -->
            <div v-else class="text-center py-6 text-slate-400 text-xs">
              <i
                class="fa-solid fa-bell-slash text-xl mb-1 opacity-40 block"
              ></i>
              Belum ada notifikasi
            </div>
          </div>
        </div>
      </div>

      <!-- Tombol Pilihan Mode Tampilan (Theme Switcher) -->
      <button
        @click="isThemeModalOpen = true"
        class="w-10 h-10 md:w-11 md:h-11 rounded-full glass-card text-slate-600 dark:text-amber-400 hover:scale-105 transition-all cursor-pointer flex items-center justify-center shrink-0"
        title="Ganti Mode Tampilan"
      >
        <i class="fa-solid" :class="themeIcon"></i>
      </button>
    </div>
  </header>

  <!-- ==================== POPUP MODAL TEMA (LIGHT / DARK / SYSTEM + ACCENT COLOR) ==================== -->
  <Teleport to="body">
    <div
      v-if="isThemeModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm transition-opacity"
      @click.self="isThemeModalOpen = false"
    >
      <div
        class="w-full max-w-xs glass-card bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl space-y-4 border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150"
      >
        <div
          class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3"
        >
          <h3
            class="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2"
          >
            <i class="fa-solid fa-palette text-theme"></i>
            Pengaturan Tampilan
          </h3>
          <button
            @click="isThemeModalOpen = false"
            class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
          >
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div class="space-y-4">
          <!-- Mode Tampilan (Light / Dark / System) -->
          <div class="space-y-2">
            <h4
              class="font-bold text-[11px] text-slate-400 dark:text-slate-400 uppercase tracking-wider"
            >
              Mode Tampilan
            </h4>
            <div class="grid grid-cols-3 gap-2">
              <button
                @click="setTheme('light')"
                class="p-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all cursor-pointer"
                :class="
                  themePreference === 'light'
                    ? 'border-theme text-theme bg-button/10 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                "
              >
                <i class="fa-solid fa-sun text-amber-500"></i> Terang
              </button>

              <button
                @click="setTheme('dark')"
                class="p-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all cursor-pointer"
                :class="
                  themePreference === 'dark'
                    ? 'border-theme text-theme bg-button/10 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                "
              >
                <i class="fa-solid fa-moon text-indigo-400"></i> Gelap
              </button>

              <button
                @click="setTheme('system')"
                class="p-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all cursor-pointer"
                :class="
                  themePreference === 'system'
                    ? 'border-theme text-theme bg-button/10 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                "
              >
                <i class="fa-solid fa-desktop text-blue-400"></i> OS
              </button>
            </div>
          </div>

          <!-- Warna Aksen (Presets + Color Wheel) -->
          <div
            class="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800"
          >
            <h4
              class="font-bold text-[11px] text-slate-400 dark:text-slate-400 uppercase tracking-wider"
            >
              Warna Aksen
            </h4>

            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="color in store.colorPresets"
                :key="color.id"
                @click="store.setThemeColor(color.hex, color.lightHex)"
                class="flex items-center gap-2 p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer"
                :class="
                  store.activeThemeColor === color.hex
                    ? 'border-theme text-theme bg-button/10 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 opacity-80 hover:opacity-100'
                "
              >
                <span
                  class="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                  :style="{ backgroundColor: color.hex }"
                ></span>
                <span class="truncate text-[11px]">{{ color.name }}</span>
              </button>
            </div>

            <div class="flex items-center justify-between pt-2">
              <span
                class="text-xs font-medium text-slate-500 dark:text-slate-400"
                >Warna Bebas (Wheel):</span
              >
              <input
                type="color"
                :value="store.activeThemeColor"
                @input="(e) => store.setThemeColor(e.target.value)"
                class="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent p-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { store } from "../store";
import "../style.css";

const props = defineProps({
  pageTitle: {
    type: String,
    default: "",
  },
});

defineEmits(["toggle-sidebar"]);

// State Modal & Popup

const isThemeModalOpen = ref(false);
const isNotifOpen = ref(false);

// State Preferensi Tema
const themePreference = ref("system");

// State Sementara Input Tanggal
const tempStartDate = ref("");
const tempEndDate = ref("");

// State Scroll & Hide Header
const isScrolled = ref(false);
const isHeaderHidden = ref(false);
let lastScrollY = 0;

// Dynamic Page Title
const dynamicPageTitle = computed(() => {
  if (props.pageTitle) return props.pageTitle;

  const current = store.currentPage || "main";

  const titleMap = {
    main: "Dashboard Utama",
    "staff-dashboard": "Dashboard Staff",
    rekap: "Unit Summary",
    summary: "Ringkasan Laporan",
    "unit-NHP": "Performa Unit NHP",
    "unit-NHC": "Performa Unit NHC",
    "unit-KG": "Performa Unit KG",
    progress: "Team Progress Board",
    notes: "Catatan & Notes Tim",
    digmar: "Sosmed Analytics",
    leads: "Leads & Campaign",
    promo: "Biaya Promosi",
    aduan: "Customer Care & Aduan",
    "spv-report": "Laporan Divisi",
    report: "Laporan Kinerja",
    targets: "Pengaturan Target Revenue",
    "master-data": "Master Data Sistem",
    users: "Manajemen Akses Pengguna",
    profile: "Profil Pengguna",
  };

  if (titleMap[current]) {
    return titleMap[current];
  }

  if (current.startsWith("unit-")) {
    const unitCode = current.replace("unit-", "").toUpperCase();
    return `Performa Unit ${unitCode}`;
  }

  return "Dashboard Utama";
});

// --- SISTEM NOTIFIKASI ---
const unreadCount = computed(() => {
  return (store.notifications || []).filter((n) => !n.read).length;
});

const toggleNotifPopup = () => {
  isNotifOpen.value = !isNotifOpen.value;
  if (isNotifOpen.value) {
    store.markAllNotifsAsRead();
  }
};

// --- SISTEM TEMA / DARK MODE ---
const themeIcon = computed(() => {
  if (themePreference.value === "system") {
    return "fa-desktop text-blue-400 text-base md:text-lg";
  }
  return store.isDarkMode
    ? "fa-sun text-amber-400 text-base md:text-lg"
    : "fa-moon text-slate-600 text-base md:text-lg";
});

let systemThemeQuery = null;

const handleSystemThemeChange = (e) => {
  if (themePreference.value === "system") {
    applyDarkModeState(e.matches);
  }
};

const applyDarkModeState = (isDark) => {
  store.isDarkMode = isDark;
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

const setTheme = (mode) => {
  themePreference.value = mode;
  localStorage.setItem("APP_THEME", mode);

  // Jika store mendukung method setTheme
  if (typeof store.setTheme === "function") {
    store.setTheme(mode);
  }

  if (mode === "dark") {
    applyDarkModeState(true);
  } else if (mode === "light") {
    applyDarkModeState(false);
  } else if (mode === "system") {
    const isSysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyDarkModeState(isSysDark);
  }

  isThemeModalOpen.value = false;
};

// --- EFEK SCROLL & AUTO HIDE HEADER ---
const handleScroll = () => {
  const currentScrollY = window.scrollY;

  // 1. Ubah background ke gradasi lebih tebal + blur saat scrolled > 20px
  if (currentScrollY > 20) {
    isScrolled.value = true;
  } else {
    isScrolled.value = false;
  }

  // 2. Hide header jika swipe up (scroll ke bawah) > 80px, show jika swipe down (scroll ke atas)
  if (currentScrollY > 80 && currentScrollY > lastScrollY) {
    isHeaderHidden.value = true;
  } else {
    isHeaderHidden.value = false;
  }

  lastScrollY = currentScrollY;
};

// --- HELPER DATES ---
function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

function getStartOfYearString() {
  const currentYear = new Date().getFullYear();
  return `${currentYear}-01-01`;
}

// --- INITIALIZATION ---
onMounted(() => {
  if (!store.filterDates.start) {
    store.filterDates.start = getStartOfYearString();
  }
  if (!store.filterDates.end) {
    store.filterDates.end = getTodayString();
  }

  tempStartDate.value = store.filterDates.start;
  tempEndDate.value = store.filterDates.end;

  const savedTheme = localStorage.getItem("APP_THEME") || "system";
  themePreference.value = savedTheme;

  systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  if (systemThemeQuery.addEventListener) {
    systemThemeQuery.addEventListener("change", handleSystemThemeChange);
  }

  // Pasang scroll listener
  window.addEventListener("scroll", handleScroll, { passive: true });

  // Terapkan tema awal
  setTheme(savedTheme);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  if (systemThemeQuery && systemThemeQuery.removeEventListener) {
    systemThemeQuery.removeEventListener("change", handleSystemThemeChange);
  }
});

watch(
  () => store.filterDates,
  (newDates) => {
    tempStartDate.value = newDates.start;
    tempEndDate.value = newDates.end;
  },
  { deep: true },
);

// --- FILTER ACTIONS ---
const applyFilter = () => {
  store.filterDates.start = tempStartDate.value;
  store.filterDates.end = tempEndDate.value;
};

const resetFilter = () => {
  const startOfYear = getStartOfYearString();
  const today = getTodayString();

  tempStartDate.value = startOfYear;
  tempEndDate.value = today;

  store.filterDates.start = startOfYear;
  store.filterDates.end = today;
};
</script>
