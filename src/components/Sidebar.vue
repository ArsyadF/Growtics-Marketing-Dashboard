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
      class="fixed top-0 left-0 shrink-0 h-100% glass-card floating-sidebar flex flex-col z-50 transform transition-all duration-300 overflow-hidden pt-4 pb-4"
      :class="[
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        isCollapsed ? 'w-20' : 'w-60',
      ]"
      style="padding-bottom: max(0.375rem, env(safe-area-inset-bottom))"
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
          <span
            class="w-9 h-9 bg-button text-white rounded-xl text-sm shrink-0 flex items-center justify-center shadow-sm"
            ><i class="fa-solid fa-chart-pie"></i
          ></span>
          <h1
            v-if="!isCollapsed"
            class="text-sm font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap tracking-wide"
          >
            NHP-Group3
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
          v-if="!isCollapsed"
          @click="$emit('close-sidebar')"
          class="md:hidden text-slate-400 p-1 shrink-0 cursor-pointer ml-1"
        >
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <!-- FITUR PENCARIAN MENU -->
      <div v-if="!isCollapsed" class="px-3 mb-2 shrink-0">
        <div class="relative">
          <i
            class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"
          ></i>
          <input
            v-model="searchMenuQuery"
            type="text"
            placeholder="Cari menu navigasi..."
            class="w-full glass-input rounded-xl pl-8 pr-7 py-1.5 text-xs outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 font-normal dark:bg-slate-800/80"
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

      <!-- Menu Navigasi Utama (Data-Driven) -->
      <nav
        class="flex-1 overflow-y-auto py-1 px-2.5 space-y-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <ul class="space-y-1">
          <template v-for="menu in filteredMenus" :key="menu.id">
            <!-- Tipe 1: Link Tunggal -->
            <li v-if="menu.type === 'link'" class="flex justify-center">
              <a
                href="#"
                @click.prevent="navigate(menu.id)"
                class="w-full flex items-center py-2 text-xs rounded-xl transition-all"
                :class="[
                  activePage === menu.id
                    ? 'bg-button text-white font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 font-normal',
                  isCollapsed ? 'justify-center px-0' : 'gap-3 px-3',
                ]"
                :title="isCollapsed ? menu.label : ''"
              >
                <i :class="['fa-solid text-sm shrink-0', menu.icon]"></i>
                <span v-if="!isCollapsed" class="whitespace-nowrap truncate">{{
                  menu.label
                }}</span>
              </a>
            </li>

            <!-- Tipe 2: Grup Akordeon (Dropdown) -->
            <li v-else-if="menu.type === 'group'">
              <button
                @click="toggleDropdown(menu.id)"
                class="w-full flex items-center py-2 text-xs rounded-xl transition-all outline-none cursor-pointer mt-1"
                :class="[
                  isGroupActive(menu.children.map((c) => c.id))
                    ? menu.activeColor ||
                      'text-theme dark:text-theme font-semibold bg-button/20 dark:bg-button/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 font-normal',
                  isCollapsed ? 'justify-center px-0' : 'justify-between px-3',
                ]"
                :title="isCollapsed ? menu.label : ''"
              >
                <div
                  class="flex items-center gap-3 min-w-0"
                  :class="isCollapsed ? 'justify-center w-full' : ''"
                >
                  <i :class="['fa-solid text-sm shrink-0', menu.icon]"></i>
                  <span
                    v-if="!isCollapsed"
                    class="whitespace-nowrap truncate"
                    >{{ menu.label }}</span
                  >
                </div>
                <i
                  v-if="!isCollapsed"
                  class="fa-solid fa-chevron-down text-xs transition-transform duration-200"
                  :class="{
                    'rotate-180': dropdowns[menu.id] || searchMenuQuery,
                  }"
                ></i>
              </button>

              <!-- Sub-menu -->
              <transition
                enter-active-class="transition-all duration-200"
                leave-active-class="transition-all duration-150"
              >
                <ul
                  v-show="dropdowns[menu.id] || isCollapsed || searchMenuQuery"
                  class="mt-1 space-y-1"
                  :class="
                    isCollapsed
                      ? 'px-0'
                      : 'pl-3 border-l-2 border-slate-200 dark:border-slate-800 ml-4'
                  "
                >
                  <li v-for="child in menu.children" :key="child.id">
                    <a
                      href="#"
                      @click.prevent="navigate(child.id)"
                      class="w-full flex items-center py-1.5 text-xs rounded-lg"
                      :class="[
                        activePage === child.id
                          ? 'bg-button text-white font-semibold'
                          : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 font-normal',
                        isCollapsed ? 'justify-center px-0' : 'gap-2.5 px-2.5',
                      ]"
                    >
                      <i :class="['fa-solid text-xs', child.icon]"></i>
                      <span v-if="!isCollapsed" class="truncate">{{
                        child.label
                      }}</span>
                    </a>
                  </li>
                </ul>
              </transition>
            </li>
          </template>
        </ul>
      </nav>

      <!-- Bottom Widget: Profil User -->
      <div
        class="p-1.5 m-2 bg-slate-100/60 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/40 flex items-center justify-center shrink-0 transition-all"
      >
        <button
          v-if="!isLoggedIn"
          @click="$emit('open-login')"
          class="w-full bg-button hover:bg-button text-white font-semibold py-2 rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          :class="isCollapsed ? 'px-0' : 'px-3'"
          :title="isCollapsed ? 'Masuk / Login' : ''"
        >
          <i class="fa-solid fa-right-to-bracket shrink-0"></i>
          <span v-if="!isCollapsed" class="whitespace-nowrap truncate"
            >Masuk / Login</span
          >
        </button>

        <button
          v-else
          @click="navigate('profile')"
          class="w-full flex items-center gap-2.5 text-left group outline-none overflow-hidden cursor-pointer p-1 rounded-xl hover:bg-button dark:hover:bg-button transition-colors"
          :class="isCollapsed ? 'justify-center' : ''"
          :title="isCollapsed ? userData?.nama || 'Profil' : ''"
        >
          <img
            :src="
              userData?.avatarUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.nama || 'User')}&background=0D8ABC&color=fff`
            "
            class="w-8 h-8 rounded-full object-cover shrink-0 aspect-square border border-theme group-hover:scale-105 transition-transform"
          />
          <div v-if="!isCollapsed" class="min-w-0 flex-1 overflow-hidden">
            <p
              class="font-semibold text-xs truncate leading-tight group-hover:text-theme"
            >
              {{ userData?.nama || "Admin User" }}
            </p>
            <p
              class="text-xs text-slate-400 font-normal uppercase truncate mt-0.5"
            >
              {{ userData?.role || "User" }}
            </p>
          </div>
        </button>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { store } from "../store/index.js";

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  activePage: { type: String, default: "main" },
});

const emit = defineEmits(["close-sidebar", "change-page", "open-login"]);

const searchMenuQuery = ref("");
const dropdowns = reactive({ units: false, campaign: false, system: false });

const isCollapsed = computed(() => store.isSidebarCollapsed);
const toggleCollapse = () => store.toggleSidebarCollapse();
const isLoggedIn = computed(() => !!store.currentUser);
const userData = computed(() => store.currentUser || {});
const isSuperadmin = computed(
  () =>
    (userData.value?.role || userData.value?.Role || "").toUpperCase() ===
    "SUPERADMIN",
);
const hasUnitAccess = (unitName) => store.canAccessPage(`unit-${unitName}`);

// ==========================================
// KONFIGURASI MENU DATA-DRIVEN
// ==========================================
const menuConfig = computed(() => [
  {
    type: "link",
    id: "main",
    label: "Dashboard",
    icon: "fa-house",
    keywords: "dashboard utama",
    condition: () => store.canAccessPage("main"),
  },
  {
    type: "link",
    id: "daily-report",
    label: "Laporan Harian",
    icon: "fa-file-invoice",
    keywords: "laporan harian",
    condition: () => store.canAccessPage("daily-report"),
  },
  {
    type: "link",
    id: "summary",
    label: "Business Summary",
    icon: "fa-chart-line",
    keywords: "unit summary rekap",
    condition: () => store.canAccessPage("summary"),
  },
  {
    type: "group",
    id: "units",
    label: "Business Unit",
    icon: "fa-building",
    condition: () =>
      isLoggedIn.value &&
      (hasUnitAccess("NHP") || hasUnitAccess("NHC") || hasUnitAccess("KG")),
    children: [
      {
        id: "unit-NHP",
        label: "Nur Hidayah Press",
        icon: "fa-book-open",
        keywords: "nur hidayah press nhp",
        condition: () => hasUnitAccess("NHP"),
      },
      {
        id: "unit-NHC",
        label: "Nusaragam x Pengaosan",
        icon: "fa-shirt",
        keywords: "nusaragam pengaosan nhc",
        condition: () => hasUnitAccess("NHC"),
      },
      {
        id: "unit-KG",
        label: "Karta Grafika",
        icon: "fa-print",
        keywords: "karta grafika kg",
        condition: () => hasUnitAccess("KG"),
      },
    ],
  },
  {
    type: "group",
    id: "campaign",
    label: "Workspace",
    icon: "fa-bullhorn",
    condition: () =>
      isLoggedIn.value &&
      (store.canAccessPage("progress") ||
        store.canAccessPage("digmar") ||
        store.canAccessPage("leads") ||
        store.canAccessPage("spv-report")),
    children: [
      {
        id: "progress",
        label: "Team Progress",
        icon: "fa-bars-progress",
        keywords: "campaign progress progres program",
        condition: () => store.canAccessPage("progress"),
      },
      {
        id: "digmar",
        label: "Socmed Analytics",
        icon: "fa-share-nodes",
        keywords: "socmed analytics",
        condition: () => store.canAccessPage("digmar"),
      },
      {
        id: "leads",
        label: "Leads & Campaign",
        icon: "fa-users-rays",
        keywords: "leads campaign",
        condition: () => store.canAccessPage("leads"),
      },
      {
        id: "spv-report",
        label: "Division Report",
        icon: "fa-file-signature",
        keywords: "laporan divisi spv pekanan",
        condition: () => store.canAccessPage("spv-report"),
      },
    ],
  },
  {
    type: "link",
    id: "notes",
    label: "Notes",
    icon: "fa-note-sticky",
    keywords: "catatan pribadi notes",
    condition: () => store.canAccessPage("notes"),
  },
  {
    type: "link",
    id: "aduan",
    label: "Customer Support",
    icon: "fa-headset",
    keywords: "customer support aduan layanan",
    condition: () => store.canAccessPage("aduan"),
  },
  {
    type: "link",
    id: "promo",
    label: "Marketing Budget",
    icon: "fa-wallet",
    keywords: "marketing budget biaya promosi ads",
    condition: () => store.canAccessPage("promo"),
  },
  {
    type: "link",
    id: "report",
    label: "Executive Report",
    icon: "fa-file-invoice-dollar",
    keywords: "laporan executive export",
    condition: () => store.canAccessPage("report"),
  },
  {
    type: "group",
    id: "system",
    label: "System Settings",
    icon: "fa-gear",
    activeColor:
      "bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-semibold",
    condition: () => isLoggedIn.value && isSuperadmin.value,
    children: [
      {
        id: "master-data",
        label: "Master Data",
        icon: "fa-sliders",
        keywords: "master data system target",
        condition: () => isSuperadmin.value,
      },
      {
        id: "users",
        label: "Akses Pengguna",
        icon: "fa-users-gear",
        keywords: "akses pengguna user role",
        condition: () => isSuperadmin.value,
      },
    ],
  },
]);

// Logika Filter Pencarian yang Lebih Bersih
const filteredMenus = computed(() => {
  const query = searchMenuQuery.value.toLowerCase();
  return menuConfig.value.reduce((acc, menu) => {
    if (!menu.condition()) return acc;

    if (menu.type === "link") {
      if (
        !query ||
        menu.label.toLowerCase().includes(query) ||
        menu.keywords.includes(query)
      )
        acc.push(menu);
    } else if (menu.type === "group") {
      const validChildren = menu.children.filter(
        (child) =>
          child.condition() &&
          (!query ||
            child.label.toLowerCase().includes(query) ||
            child.keywords.includes(query)),
      );
      if (validChildren.length > 0)
        acc.push({ ...menu, children: validChildren });
    }
    return acc;
  }, []);
});

// --- HELPER FUNCTIONS ---
const toggleDropdown = (key) => {
  if (isCollapsed.value) {
    store.toggleSidebarCollapse();
    dropdowns[key] = true;
  } else {
    dropdowns[key] = !dropdowns[key];
  }
};

const isGroupActive = (pageIds) => pageIds.includes(props.activePage);

const navigate = (page) => {
  emit("change-page", page);
  if (window.innerWidth < 768) {
    document.body.style.overflow = "";
    emit("close-sidebar");
  }
};

// --- WATCHERS ---
watch(
  () => props.activePage,
  (newPage) => {
    // Auto-expand grup jika anak menu sedang aktif
    menuConfig.value.forEach((menu) => {
      if (
        menu.type === "group" &&
        menu.children.some((c) => c.id === newPage)
      ) {
        dropdowns[menu.id] = true;
      }
    });
  },
  { immediate: true },
);

watch(
  () => props.isOpen,
  (newVal) => {
    if (window.innerWidth < 768)
      document.body.style.overflow = newVal ? "hidden" : "";
  },
);
</script>
