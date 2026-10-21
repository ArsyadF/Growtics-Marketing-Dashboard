<!-- src/components/Header.vue -->
<template>
  <header
    class="sticky top-0 z-40 pt-[max(1.5rem,env(safe-area-inset-top))] md:pt-4 px-4 md:px-6 pb-4 flex items-center justify-between gap-3 transition-all duration-300 transform"
    :class="[
      isHeaderHidden
        ? '-translate-y-full opacity-0 pointer-events-none'
        : 'translate-y-0 opacity-100',
      isScrolled
        ? // ? 'bg-gradient-to-b from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 dark:to-transparent backdrop-blur-md shadow-xs'
          // : 'bg-gradient-to-b from-white/90 to-transparent dark:from-slate-950/90 dark:to-transparent',
          'bg-[#f1f5f9] dark:bg-slate-950/80 shadow-xs'
        : 'bg-[#f1f5f9] dark:bg-slate-950/90',
    ]"
  >
    <!-- SISI KIRI: Judul Halaman Dinamis -->
    <div class="flex items-center gap-2 md:gap-3 shrink-0 md:min-w-0">
      <h2
        class="dynamic-page-title text-base md:text-xl font-semibold text-slate-800 dark:text-slate-100 truncate"
      >
        {{ dynamicPageTitle }}
      </h2>
    </div>

    <!-- SISI KANAN: Kontrol Ekstra -->
    <div class="flex items-center gap-2 md:gap-3 shrink-0 relative">
      <!-- Filter Tanggal Global (KHUSUS DESKTOP) -->
      <div
        class="hidden md:flex items-center space-x-2 glass-input p-1.5 rounded-xl text-xs overflow-x-auto"
      >
        <span class="text-slate-500 dark:text-slate-400 font-normal px-1"
          >Filter:</span
        >
        <input
          v-model="tempStartDate"
          type="date"
          class="bg-transparent rounded-lg px-1.5 py-1 dark:text-slate-100 outline-none w-auto text-xs font-normal"
        />
        <span class="dark:text-slate-400 font-normal">-</span>
        <input
          v-model="tempEndDate"
          type="date"
          class="bg-transparent rounded-lg px-1.5 py-1 dark:text-slate-100 outline-none w-auto text-xs font-normal"
        />

        <button
          @click="applyFilter"
          class="bg-button text-white px-3 py-1 rounded-lg font-semibold transition-all shadow-md text-xs cursor-pointer flex items-center gap-1 shrink-0 hover:opacity-95"
          title="Terapkan Filter Tanggal"
        >
          <i class="fa-solid fa-filter"></i> <span>Terapkan</span>
        </button>
        <button
          @click="resetFilter"
          class="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded-lg font-semibold transition-all text-xs cursor-pointer flex items-center gap-1 shrink-0"
          title="Reset ke Awal Tahun s/d Hari Ini"
        >
          <i class="fa-solid fa-rotate-left"></i> <span>Reset</span>
        </button>
      </div>

      <!-- ICON LONCENG NOTIFIKASI -->
      <div class="relative">
        <button
          @click="togglePopup('notif')"
          class="w-10 h-10 md:w-11 md:h-11 rounded-full glass-card text-slate-600 dark:text-slate-300 hover:scale-105 transition-all cursor-pointer flex items-center justify-center shrink-0 relative"
          title="Notifikasi Aktivitas"
        >
          <i class="fa-solid fa-bell text-base"></i>
          <span
            v-if="unreadCount > 0"
            class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white font-semibold text-xs rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-pulse"
          >
            {{ unreadCount > 9 ? "9+" : unreadCount }}
          </span>
        </button>

        <!-- POPUP CARD NOTIFIKASI -->
        <div
          v-if="activePopup === 'notif'"
          class="absolute right-0 mt-3 w-72 sm:w-80 glass-card bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-2xl border border-slate-100 dark:border-slate-800 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div
            class="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800"
          >
            <div class="flex items-center gap-2">
              <h4
                class="font-semibold text-xs text-slate-800 dark:text-slate-100"
              >
                Notifikasi
              </h4>
              <span
                v-if="unreadCount > 0"
                class="text-xs font-semibold text-theme bg-button/10 px-2 py-0.5 rounded-full"
                >{{ unreadCount }} Baru</span
              >
            </div>
            <button
              @click="store.clearNotifications()"
              class="text-xs font-semibold text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
            >
              Hapus Semua
            </button>
          </div>

          <!-- List Notifikasi -->
          <div
            class="max-h-64 overflow-y-auto py-2 space-y-2 [scrollbar-width:none]"
          >
            <template v-if="store.notifications?.length > 0">
              <div
                v-for="notif in store.notifications"
                :key="notif.id"
                :class="[
                  'p-2.5 rounded-2xl transition-all border text-xs flex gap-2.5 items-start',
                  notif.read
                    ? 'bg-transparent border-transparent opacity-70'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-100 dark:border-slate-700/50',
                ]"
              >
                <div
                  :class="[
                    'w-7 h-7 rounded-xl shrink-0 flex items-center justify-center text-xs mt-0.5',
                    getNotifStyle(notif.type).bgClass,
                  ]"
                >
                  <i
                    :class="['fa-solid', getNotifStyle(notif.type).iconClass]"
                  ></i>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-start">
                    <p
                      class="font-semibold text-slate-800 dark:text-slate-100 text-xs truncate"
                    >
                      {{ notif.title }}
                    </p>
                    <span
                      class="text-xs text-slate-400 shrink-0 ml-1 font-normal"
                      >{{ notif.time }}</span
                    >
                  </div>
                  <p
                    class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug font-normal"
                  >
                    {{ notif.message }}
                  </p>
                </div>
              </div>
            </template>
            <div
              v-else
              class="text-center py-6 text-slate-400 text-xs font-normal"
            >
              <i
                class="fa-solid fa-bell-slash text-base mb-1 opacity-40 block"
              ></i>
              Belum ada notifikasi
            </div>
          </div>
        </div>
      </div>

      <!-- MENU PROFIL -->
      <div class="relative">
        <button
          @click="togglePopup('profile')"
          class="w-10 h-10 md:w-11 md:h-11 rounded-full border-2 border-slate-200 dark:border-slate-700 hover:border-theme transition-all cursor-pointer shrink-0 overflow-hidden flex items-center justify-center"
          title="Profil Pengguna"
        >
          <img
            :src="userAvatar"
            alt="Profil"
            class="w-full h-full object-cover"
          />
        </button>

        <!-- Dropdown Profil -->
        <div
          v-if="activePopup === 'profile'"
          class="absolute right-0 mt-3 w-48 glass-card bg-white dark:bg-slate-900 rounded-2xl p-2 shadow-2xl border border-slate-100 dark:border-slate-800 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div
            class="p-2.5 border-b border-slate-100 dark:border-slate-800 mb-1"
          >
            <p
              class="font-semibold text-xs text-slate-800 dark:text-slate-100 truncate"
            >
              {{ userName }}
            </p>
            <p
              class="text-xs text-slate-400 truncate uppercase mt-0.5 font-normal"
            >
              {{ userRole }}
            </p>
          </div>
          <div class="space-y-1">
            <button
              @click="handleProfileMenu('profile')"
              class="w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <i class="fa-regular fa-user text-slate-400"></i> Profil Saya
            </button>
            <button
              @click="handleProfileMenu('theme')"
              class="w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <i class="fa-solid fa-palette text-slate-400"></i> Tema Tampilan
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- MODAL TEMA TAMPILAN -->
  <Teleport to="body">
    <div
      v-if="isThemeModalOpen"
      @click.self="isThemeModalOpen = false"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm transition-opacity"
    >
      <div
        class="w-full max-w-xs glass-card bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl space-y-4 border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150"
      >
        <div
          class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3"
        >
          <h3
            class="font-semibold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2"
          >
            <i class="fa-solid fa-palette text-theme"></i> Pengaturan Tampilan
          </h3>
          <button
            @click="isThemeModalOpen = false"
            class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
          >
            <i class="fa-solid fa-xmark text-base"></i>
          </button>
        </div>

        <div class="space-y-4">
          <!-- Mode Tampilan (Light / Dark / System) -->
          <div class="space-y-2">
            <h4
              class="font-semibold text-xs text-slate-400 dark:text-slate-400 uppercase tracking-wider"
            >
              Mode Tampilan
            </h4>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="mode in themeModes"
                :key="mode.id"
                @click="setTheme(mode.id)"
                :class="[
                  'p-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition-all cursor-pointer',
                  themePreference === mode.id
                    ? 'border-theme text-theme bg-button/10 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-normal',
                ]"
              >
                <i :class="['fa-solid', mode.iconClass]"></i> {{ mode.label }}
              </button>
            </div>
          </div>

          <!-- Warna Aksen (Presets + Color Wheel) -->
          <div
            class="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800"
          >
            <h4
              class="font-semibold text-xs text-slate-400 dark:text-slate-400 uppercase tracking-wider"
            >
              Warna Aksen
            </h4>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="color in store.colorPresets"
                :key="color.id"
                @click="store.setThemeColor(color.hex, color.lightHex)"
                :class="[
                  'flex items-center gap-2 p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer',
                  store.activeThemeColor === color.hex
                    ? 'border-theme text-theme bg-button/10 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 opacity-80 hover:opacity-100 font-normal',
                ]"
              >
                <span
                  class="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                  :style="{ backgroundColor: color.hex }"
                ></span>
                <span class="truncate text-xs">{{ color.name }}</span>
              </button>
            </div>
            <div class="flex items-center justify-between pt-2">
              <span
                class="text-xs font-normal text-slate-500 dark:text-slate-400"
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

const props = defineProps({ pageTitle: { type: String, default: "" } });
defineEmits(["toggle-sidebar"]);

// State UI Management
const activePopup = ref(null); // 'notif' atau 'profile'
const isThemeModalOpen = ref(false);
const isScrolled = ref(false);
const isHeaderHidden = ref(false);
let lastScrollY = 0;

// State Filter
const tempStartDate = ref("");
const tempEndDate = ref("");

// Data Pengguna
const currentUser = computed(() => store.currentUser || {});
const userName = computed(
  () => currentUser.value.nama || currentUser.value.Nama || "Pengguna",
);
const userRole = computed(
  () => currentUser.value.role || currentUser.value.Role || "User",
);
const userAvatar = computed(
  () =>
    currentUser.value.avatarUrl ||
    currentUser.value.Avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(userName.value)}&background=0D8ABC&color=fff`,
);

// Dynamic Title Mapping
const titleMap = {
  main: "Dashboard Utama",
  "staff-dashboard": "Dashboard Staff",
  "daily-report": "Laporan harian",
  rekap: "Unit Summary",
  summary: "Rekap Unit",
  "unit-NHP": "Performa Unit NHP",
  "unit-NHC": "Performa Unit NHC",
  "unit-KG": "Performa Unit KG",
  progress: "Team Progress Board",
  notes: "Catatan",
  digmar: "Socmed Analytics",
  leads: "Leads & Campaign",
  promo: "Biaya Promosi",
  aduan: "Customer Care & Aduan",
  "spv-report": "Laporan Divisi",
  report: "Laporan Executive",
  targets: "Pengaturan Target Revenue",
  "master-data": "Master Data Sistem",
  users: "Manajemen Akses Pengguna",
  profile: "Profil Pengguna",
};

const dynamicPageTitle = computed(() => {
  if (props.pageTitle) return props.pageTitle;
  const current = store.currentPage || "main";
  if (titleMap[current]) return titleMap[current];
  if (current.startsWith("unit-"))
    return `Performa Unit ${current.replace("unit-", "").toUpperCase()}`;
  return "Dashboard Utama";
});

// --- UI TOGGLER ---
const togglePopup = (popupName) => {
  if (activePopup.value === popupName) {
    activePopup.value = null;
  } else {
    activePopup.value = popupName;
    if (popupName === "notif") store.markAllNotifsAsRead();
  }
};

const handleProfileMenu = (action) => {
  activePopup.value = null;
  if (action === "profile" && typeof store.navigate === "function")
    store.navigate("profile");
  if (action === "theme") isThemeModalOpen.value = true;
};

// --- STYLING HELPERS ---
const getNotifStyle = (type) => {
  const styles = {
    success: {
      bgClass: "bg-emerald-500/10 text-emerald-500",
      iconClass: "fa-check",
    },
    danger: {
      bgClass: "bg-rose-500/10 text-rose-500",
      iconClass: "fa-trash-can",
    },
    warning: {
      bgClass: "bg-amber-500/10 text-amber-500",
      iconClass: "fa-pen-to-square",
    },
    info: { bgClass: "bg-button/10 text-theme", iconClass: "fa-info" },
  };
  return styles[type] || styles.info;
};

const themeModes = [
  { id: "light", label: "Terang", iconClass: "fa-sun text-amber-500" },
  { id: "dark", label: "Gelap", iconClass: "fa-moon text-indigo-400" },
  { id: "system", label: "OS", iconClass: "fa-desktop text-blue-400" },
];

// --- NOTIFIKASI ---
const unreadCount = computed(
  () => (store.notifications || []).filter((n) => !n.read).length,
);

// --- TEMA MANAGEMENT ---
const themePreference = ref("system");
let systemThemeQuery = null;

const applyDarkModeState = (isDark) => {
  store.isDarkMode = isDark;
  isDark
    ? document.documentElement.classList.add("dark")
    : document.documentElement.classList.remove("dark");
};

const handleSystemThemeChange = (e) => {
  if (themePreference.value === "system") applyDarkModeState(e.matches);
};

const setTheme = (mode) => {
  themePreference.value = mode;
  localStorage.setItem("APP_THEME", mode);
  if (typeof store.setTheme === "function") store.setTheme(mode);

  if (mode === "dark") applyDarkModeState(true);
  else if (mode === "light") applyDarkModeState(false);
  else
    applyDarkModeState(
      window.matchMedia("(prefers-color-scheme: dark)").matches,
    );

  isThemeModalOpen.value = false;
};

// --- SCROLL MANAGEMENT ---
const handleScroll = () => {
  const currentScrollY = window.scrollY;
  isScrolled.value = currentScrollY > 20;
  isHeaderHidden.value = currentScrollY > 80 && currentScrollY > lastScrollY;
  lastScrollY = currentScrollY;
};

// --- FILTER MANAGEMENT ---
const getTodayString = () => new Date().toISOString().split("T")[0];
const getStartOfYearString = () => `${new Date().getFullYear()}-01-01`;

const applyFilter = () => {
  store.filterDates.start = tempStartDate.value;
  store.filterDates.end = tempEndDate.value;
};

const resetFilter = () => {
  const start = getStartOfYearString();
  const end = getTodayString();
  tempStartDate.value = start;
  tempEndDate.value = end;
  store.filterDates.start = start;
  store.filterDates.end = end;
};

// --- LIFECYCLE ---
onMounted(() => {
  if (!store.filterDates.start)
    store.filterDates.start = getStartOfYearString();
  if (!store.filterDates.end) store.filterDates.end = getTodayString();
  tempStartDate.value = store.filterDates.start;
  tempEndDate.value = store.filterDates.end;

  const savedTheme = localStorage.getItem("APP_THEME") || "system";
  themePreference.value = savedTheme;
  systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  if (systemThemeQuery.addEventListener)
    systemThemeQuery.addEventListener("change", handleSystemThemeChange);

  window.addEventListener("scroll", handleScroll, { passive: true });
  setTheme(savedTheme);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  if (systemThemeQuery?.removeEventListener)
    systemThemeQuery.removeEventListener("change", handleSystemThemeChange);
});

watch(
  () => store.filterDates,
  (newDates) => {
    tempStartDate.value = newDates.start;
    tempEndDate.value = newDates.end;
  },
  { deep: true },
);
</script>
