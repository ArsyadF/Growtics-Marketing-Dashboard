<!-- src/components/Header.vue -->
<template>
  <header
    class="ui-app-header sticky top-0 z-40 flex items-center justify-between gap-3 md:py-4 md:px-6"
    :class="{
      'is-hidden': isHeaderHidden,
      'is-scrolled': isScrolled,
    }"
  >
    <div class="flex-1 min-w-0">
      <h2 class="ui-header-title overflow-hidden text-ellipsis whitespace-nowrap">
        {{ dynamicPageTitle }}
      </h2>
    </div>

    <div class="flex items-center gap-2 shrink-0 relative md:gap-3">
      <!-- Filter tanggal -->
      <div class="ui-date-filter hidden items-center gap-2 p-1.5 md:flex">
        <span class="ui-date-filter-label px-1">Filter:</span>

        <input
          v-model="tempStartDate"
          type="date"
          class="ui-date-filter-input w-auto min-w-0 py-1 px-1.5"
          aria-label="Tanggal awal"
        />

        <span class="ui-caption">-</span>

        <input
          v-model="tempEndDate"
          type="date"
          class="ui-date-filter-input w-auto min-w-0 py-1 px-1.5"
          aria-label="Tanggal akhir"
        />

        <button
          type="button"
          class="ui-button ui-button-primary ui-button-sm ui-button-shadow"
          @click="applyFilter"
          title="Terapkan Filter Tanggal"
        >
          <i class="fa-solid fa-filter"></i>
          Terapkan
        </button>

        <button
          type="button"
          class="ui-button ui-button-secondary ui-button-sm"
          @click="resetFilter"
          title="Reset ke Awal Tahun s/d Hari Ini"
        >
          <i class="fa-solid fa-rotate-left"></i>
          Reset
        </button>
      </div>

      <!-- Mode terang / gelap -->
      <button
        type="button"
        role="switch"
        class="ui-theme-switch flex items-center w-14 h-8 px-1"
        :class="{ 'is-dark': store.isDarkMode }"
        :aria-checked="store.isDarkMode"
        aria-label="Mode gelap"
        :title="store.isDarkMode ? 'Ubah ke Mode Terang' : 'Ubah ke Mode Gelap'"
        @click="toggleThemeSwitch"
      >
        <span class="ui-theme-switch-thumb flex items-center justify-center w-6 h-6">
          <i :class="['fa-solid', store.isDarkMode ? 'fa-moon' : 'fa-sun']"></i>
        </span>
      </button>

      <!-- Notifikasi -->
      <div class="relative">
        <button
          type="button"
          class="ui-header-icon inline-flex items-center justify-center w-10 h-10 shrink-0 relative md:w-11 md:h-11"
          :aria-expanded="activePopup === 'notif'"
          aria-controls="header-notifications"
          aria-label="Notifikasi Aktivitas"
          title="Notifikasi Aktivitas"
          @click="togglePopup('notif')"
        >
          <i class="fa-solid fa-bell"></i>

          <span
            v-if="unreadCount > 0"
            class="ui-notification-count absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4"
          >
            {{ unreadCount > 9 ? "9+" : unreadCount }}
          </span>
        </button>

        <div
          v-if="activePopup === 'notif'"
          id="header-notifications"
          class="ui-popup absolute top-full right-0 z-50 mt-3 w-72 sm:w-80 animate-fade-in"
        >
          <div class="ui-popup-header">
            <div class="flex items-center gap-2 min-w-0">
              <h4 class="ui-text-strong">Notifikasi</h4>

              <span v-if="unreadCount > 0" class="ui-badge ui-badge-info ui-badge-pill">
                {{ unreadCount }} Baru
              </span>
            </div>

            <button
              type="button"
              class="ui-link ui-link-danger"
              @click="store.clearNotifications()"
            >
              Hapus Semua
            </button>
          </div>

          <div class="flex flex-col gap-2 max-h-64 py-2 overflow-y-auto no-scrollbar">
            <template v-if="store.notifications?.length > 0">
              <div
                v-for="notif in store.notifications"
                :key="notif.id"
                class="ui-notification flex items-start gap-2.5 p-2.5"
                :class="{ 'is-read': notif.read }"
              >
                <span class="ui-icon ui-icon-sm" :class="getNotifStyle(notif.type).bgClass">
                  <i :class="['fa-solid', getNotifStyle(notif.type).iconClass]"></i>
                </span>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-3 min-w-0">
                    <p class="ui-text-strong ui-truncate">
                      {{ notif.title }}
                    </p>
                    <span class="ui-caption shrink-0">
                      {{ notif.time }}
                    </span>
                  </div>

                  <p class="ui-description">{{ notif.message }}</p>
                </div>
              </div>
            </template>

            <div v-else class="ui-empty">
              <i class="fa-solid fa-bell-slash"></i>
              <p>Belum ada notifikasi</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Profil -->
      <div class="relative">
        <button
          type="button"
          class="ui-avatar inline-flex items-center justify-center w-10 h-10 shrink-0 overflow-hidden md:w-11 md:h-11"
          :aria-expanded="activePopup === 'profile'"
          aria-controls="header-profile"
          aria-label="Profil Pengguna"
          title="Profil Pengguna"
          @click="togglePopup('profile')"
        >
          <img :src="userAvatar" alt="Profil" />
        </button>

        <div
          v-if="activePopup === 'profile'"
          id="header-profile"
          class="ui-popup ui-popup-compact absolute top-full right-0 z-50 mt-3 w-48 animate-fade-in"
        >
          <div v-if="isLoggedIn" class="ui-profile-summary p-2.5 mb-1">
            <p class="ui-text-strong ui-truncate">{{ userName }}</p>
            <p class="ui-caption ui-truncate">{{ userRole }}</p>
          </div>

          <div class="ui-menu-list">
            <button
              v-if="isLoggedIn"
              type="button"
              class="ui-menu-item"
              @click="handleProfileMenu('profile')"
            >
              <i class="fa-regular fa-user"></i>
              Kelola Profil
            </button>

            <button
              v-else
              type="button"
              class="ui-menu-item ui-menu-item-success"
              @click="handleProfileMenu('login')"
            >
              <i class="fa-solid fa-right-to-bracket"></i>
              Login
            </button>

            <button type="button" class="ui-menu-item" @click="handleProfileMenu('theme')">
              <i class="fa-solid fa-palette"></i>
              Tema Tampilan
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Pengaturan tampilan -->
  <Teleport to="body">
    <div v-if="isThemeModalOpen" class="ui-modal-overlay" @click.self="isThemeModalOpen = false">
      <div
        class="ui-modal ui-modal-xs animate-fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="theme-modal-title"
      >
        <div class="ui-modal-header">
          <h3 id="theme-modal-title" class="ui-title">
            <i class="fa-solid fa-palette"></i>
            Pengaturan Tampilan
          </h3>

          <button
            type="button"
            class="ui-close"
            aria-label="Tutup pengaturan tampilan"
            @click="isThemeModalOpen = false"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="ui-modal-body flex flex-col gap-4">
          <div>
            <h4 class="ui-section-label">Mode Tampilan</h4>

            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="mode in themeModes"
                :key="mode.id"
                type="button"
                class="ui-option"
                :class="{ 'is-active': themePreference === mode.id }"
                :aria-pressed="themePreference === mode.id"
                @click="setTheme(mode.id)"
              >
                <i :class="['fa-solid', mode.iconClass]"></i>
                {{ mode.label }}
              </button>
            </div>
          </div>

          <div class="ui-subsection flex flex-col gap-3 pt-3">
            <h4 class="ui-section-label">Warna Aksen</h4>

            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="color in store.colorPresets"
                :key="color.id"
                type="button"
                class="ui-option"
                :class="{
                  'is-active': store.activeThemeColor === color.hex,
                }"
                :aria-pressed="store.activeThemeColor === color.hex"
                @click="store.setThemeColor(color.hex, color.lightHex)"
              >
                <span
                  class="ui-color-dot w-3.5 h-3.5 shrink-0"
                  :style="{ backgroundColor: color.hex }"
                ></span>
                <span class="ui-truncate">{{ color.name }}</span>
              </button>
            </div>

            <div class="flex items-center justify-between gap-3 min-w-0">
              <label for="header-accent-color" class="ui-caption"> Warna Bebas (Wheel): </label>

              <input
                id="header-accent-color"
                type="color"
                class="ui-color-input w-7 h-7 p-0"
                :value="store.activeThemeColor"
                @input="(e) => store.setThemeColor(e.target.value)"
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

// Status Login & Data Pengguna
const isLoggedIn = computed(
  () => !!store.currentUser && Object.keys(store.currentUser).length > 0,
);
const currentUser = computed(() => store.currentUser || {});
const userName = computed(
  () => currentUser.value.nama || currentUser.value.Nama || "Pengguna",
);
const userRole = computed(
  () => currentUser.value.role || currentUser.value.Role || "User",
);
const userAvatar = computed(() => {
  if (
    isLoggedIn.value &&
    (currentUser.value.avatarUrl || currentUser.value.Avatar)
  ) {
    return currentUser.value.avatarUrl || currentUser.value.Avatar;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(isLoggedIn.value ? userName.value : "Guest")}&background=94a3b8&color=fff`;
});

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
  if (action === "profile" && typeof store.navigate === "function") {
    store.navigate("profile");
  }
  if (action === "login") {
    // Membuka modal login atau navigasi ke halaman login jika tersedia pada store/props
    if (typeof store.openModal === "function") {
      store.openModal("login");
    } else if (typeof store.navigate === "function") {
      store.navigate("login");
    }
  }
  if (action === "theme") isThemeModalOpen.value = true;
};

// --- STYLING HELPERS ---
const getNotifStyle = (type) => {
  const styles = {
    success: {
      bgClass: "ui-icon-success",
      iconClass: "fa-check",
    },
    danger: {
      bgClass: "ui-icon-danger",
      iconClass: "fa-trash-can",
    },
    warning: {
      bgClass: "ui-icon-warning",
      iconClass: "fa-pen-to-square",
    },
    info: {
      bgClass: "ui-icon-info",
      iconClass: "fa-info",
    },
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

// --- TOGGLE THEME SWITCH (GESER) ---
const toggleThemeSwitch = () => {
  const newMode = store.isDarkMode ? "light" : "dark";
  setTheme(newMode);
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


<!-- Gaya khusus komponen; layout utama berada di template. -->
<style scoped>
.ui-app-header {
  padding: max(1.5rem, env(safe-area-inset-top)) 1rem 1rem;
  background-color: var(--page-background);
  transition:
    transform 300ms var(--ui-ease),
    opacity 300ms var(--ui-ease);
}

.ui-app-header.is-hidden {
  transform: translateY(-100%);
  opacity: 0;
  pointer-events: none;
}

.ui-app-header.is-scrolled {
  box-shadow: var(--ui-shadow-xs);
}

.ui-avatar {
  border-radius: 999px;
  cursor: pointer;
}

.ui-header-icon {
  border-radius: 999px;
  cursor: pointer;
}

.ui-avatar {
  border: 2px solid var(--ui-border);
  transition: border-color var(--hover-duration);
}

.ui-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ui-header-icon {
  background-color: var(--card-background);
  color: var(--ui-text-secondary);
}

@media (hover: hover) and (pointer: fine) {
  .ui-avatar:hover {
    border-color: var(--primary-color);
  }
}

.ui-header-title {
  color: var(--ui-text);
  font-size: 1rem;
  font-weight: 600;
}

.ui-date-filter {
  border: 1px solid var(--input-border);
  border-radius: var(--ui-radius-control);
  background-color: var(--input-background);
  font-size: var(--ui-font-xs);
}

.ui-date-filter-label {
  color: var(--ui-text-description);
  font-weight: 400;
}

.ui-date-filter-input {
  border: 1px solid transparent;
  border-radius: var(--ui-radius-sm);
  outline: none;
  background: transparent;
  color: var(--ui-text);
  font-family: inherit;
  font-size: var(--ui-font-xs);
}

.ui-date-filter-input:focus {
  border-color: var(--input-border-focus);
}

.ui-date-filter .ui-button {
  min-height: 0;
  padding: 0.25rem 0.625rem;
}

.ui-theme-switch {
  border: 1px solid var(--input-border);
  border-radius: 999px;
  background-color: var(--input-background);
  box-shadow: var(--ui-shadow-xs);
  cursor: pointer;
}

.ui-theme-switch-thumb {
  border-radius: 999px;
  background: #ffffff;
  color: #f59e0b;
  font-size: var(--ui-font-xs);
  box-shadow: var(--ui-shadow-button);
  transition: transform 300ms var(--ui-ease);
}

.ui-theme-switch.is-dark .ui-theme-switch-thumb {
  transform: translateX(1.5rem);
  color: #4f46e5;
}

.ui-theme-switch:focus-visible {
  outline: 1px solid var(--input-border-focus);
  outline-offset: 2px;
}

.ui-notification {
  border: 1px solid var(--input-border);
  border-radius: var(--ui-radius-card);
  background-color: var(--input-background);
  font-size: var(--ui-font-xs);
}

.ui-notification.is-read {
  border-color: transparent;
  background: transparent;
  opacity: 0.7;
}

.ui-notification-count {
  border: 2px solid var(--card-background);
  border-radius: 999px;
  background-color: #f43f5e;
  color: #ffffff;
  font-size: var(--ui-font-xs);
  font-weight: 600;
}

.ui-profile-summary {
  border-bottom: 1px solid var(--ui-border-soft);
}

.ui-color-dot {
  border-radius: 999px;
  box-shadow: var(--ui-shadow-sm);
}

.ui-color-input {
  border: 0;
  background: transparent;
  cursor: pointer;
}

@media print {
  header,
  nav,
  .bottom-nav,
  .no-print,
  .ui-app-header,
  .ui-tabs,
  .ui-actions,
  button,
  select,
  .glass-card:not(.print-active),
  .ui-card:not(.print-active),
  .ui-popup,
  .ui-modal-overlay {
    display: none !important;
  }
}
</style>
