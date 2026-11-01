<!-- src/components/Sidebar.vue -->
<template>
  <div>
    <!-- Overlay mobile -->
    <div
      v-if="isOpen"
      class="ui-sidebar-overlay fixed inset-0 z-40 md:hidden"
      @click="$emit('close-sidebar')"
      @touchmove.prevent
    ></div>

    <!-- Sidebar -->
    <aside
      id="app-sidebar"
      class="ui-sidebar fixed top-0 left-0 z-50 flex flex-col w-60 h-[100dvh] pt-4 pb-[max(0.375rem,_env(safe-area-inset-bottom))] overflow-hidden md:h-[calc(100dvh_-_2rem)] md:m-4"
      :class="{
        'is-open': isOpen,
        'is-collapsed': isCollapsed,
      }"
      aria-label="Sidebar navigasi"
    >
      <!-- Brand dan kontrol -->
      <div
        class="ui-sidebar-header flex items-center justify-between gap-1 py-3 px-4 mb-2 shrink-0"
      >
        <button
          type="button"
          class="ui-sidebar-brand flex items-center gap-3 min-w-0"
          :title="isCollapsed ? 'Buka Sidebar' : 'Kecilkan Sidebar'"
          :aria-label="isCollapsed ? 'Buka Sidebar' : 'Kecilkan Sidebar'"
          :aria-expanded="!isCollapsed"
          @click="toggleCollapse"
        >
          <span class="ui-sidebar-logo flex items-center justify-center w-9 h-9 shrink-0">
            <i class="fa-solid fa-chart-pie"></i>
          </span>

          <span
            v-if="!isCollapsed"
            class="ui-sidebar-brand-title overflow-hidden text-ellipsis whitespace-nowrap"
          >
            NHP-Group3
          </span>
        </button>

        <button
          v-if="!isCollapsed"
          type="button"
          class="ui-sidebar-control items-center justify-center w-7 h-7 p-0 shrink-0 hidden md:inline-flex"
          title="Kecilkan Sidebar"
          aria-label="Kecilkan Sidebar"
          @click="toggleCollapse"
        >
          <i class="fa-solid fa-angles-left"></i>
        </button>

        <button
          v-if="!isCollapsed"
          type="button"
          class="ui-sidebar-control inline-flex items-center justify-center w-7 h-7 p-0 shrink-0 md:hidden"
          aria-label="Tutup Sidebar"
          @click="$emit('close-sidebar')"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Pencarian menu -->
      <div v-if="!isCollapsed" class="px-3 mb-2 shrink-0">
        <div class="ui-search relative">
          <i class="fa-solid fa-magnifying-glass ui-search-icon absolute top-[50%] left-3"></i>

          <input
            v-model="searchMenuQuery"
            type="text"
            class="ui-input"
            placeholder="Cari menu navigasi..."
            aria-label="Cari menu navigasi"
          />

          <button
            v-if="searchMenuQuery"
            type="button"
            class="ui-search-clear absolute top-[50%] right-1.5 inline-flex items-center justify-center w-5 h-5"
            aria-label="Hapus pencarian menu"
            @click="searchMenuQuery = ''"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <!-- Navigasi -->
      <nav class="flex-1 min-h-0 py-1 px-2.5 overflow-y-auto no-scrollbar" aria-label="Menu utama">
        <ul class="flex flex-col gap-1">
          <template v-for="menu in filteredMenus" :key="menu.id">
            <!-- Menu tunggal -->
            <li v-if="menu.type === 'link'">
              <a
                href="#"
                class="ui-sidebar-item flex items-center gap-3 w-full min-w-0 py-2 px-3 text-left"
                :class="{ 'is-active': activePage === menu.id }"
                :aria-current="activePage === menu.id ? 'page' : undefined"
                :aria-label="isCollapsed ? menu.label : undefined"
                :title="isCollapsed ? menu.label : ''"
                @click.prevent="navigate(menu.id)"
              >
                <i :class="['fa-solid ui-sidebar-item-icon shrink-0', menu.icon]"></i>

                <span
                  v-if="!isCollapsed"
                  class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  {{ menu.label }}
                </span>

                <i
                  v-if="!isMenuAllowed(menu.id) && !isCollapsed"
                  class="fa-solid fa-lock ui-sidebar-lock ml-auto shrink-0"
                  title="Terkunci"
                ></i>
              </a>
            </li>

            <!-- Grup menu -->
            <li v-else-if="menu.type === 'group'" class="mt-1">
              <button
                type="button"
                class="ui-sidebar-item flex items-center gap-3 w-full min-w-0 py-2 px-3 text-left ui-sidebar-group-button justify-between"
                :class="{
                  'is-group-active': isGroupActive(menu.children.map((child) => child.id)),
                  'ui-sidebar-group-system': menu.id === 'system',
                }"
                :title="isCollapsed ? menu.label : ''"
                :aria-label="isCollapsed ? menu.label : undefined"
                :aria-expanded="!!(dropdowns[menu.id] || isCollapsed || searchMenuQuery)"
                :aria-controls="`sidebar-group-${menu.id}`"
                @click="toggleDropdown(menu.id)"
              >
                <span class="ui-sidebar-group-content flex items-center gap-3 min-w-0">
                  <i :class="['fa-solid ui-sidebar-item-icon shrink-0', menu.icon]"></i>

                  <span
                    v-if="!isCollapsed"
                    class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    {{ menu.label }}
                  </span>
                </span>

                <i
                  v-if="!isCollapsed"
                  class="fa-solid fa-chevron-down ui-sidebar-chevron shrink-0"
                  :class="{
                    'is-expanded': dropdowns[menu.id] || searchMenuQuery,
                  }"
                ></i>
              </button>

              <!-- Submenu -->
              <ul
                v-show="dropdowns[menu.id] || isCollapsed || searchMenuQuery"
                :id="`sidebar-group-${menu.id}`"
                class="ui-sidebar-submenu flex flex-col gap-1 pl-3 mt-1 ml-4"
              >
                <li v-for="child in menu.children" :key="child.id">
                  <a
                    href="#"
                    class="ui-sidebar-item flex items-center gap-3 w-full min-w-0 py-2 px-3 text-left"
                    :class="{ 'is-active': activePage === child.id }"
                    :aria-current="activePage === child.id ? 'page' : undefined"
                    :aria-label="isCollapsed ? child.label : undefined"
                    :title="isCollapsed ? child.label : ''"
                    @click.prevent="navigate(child.id)"
                  >
                    <i :class="['fa-solid ui-sidebar-item-icon shrink-0', child.icon]"></i>

                    <span
                      v-if="!isCollapsed"
                      class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
                    >
                      {{ child.label }}
                    </span>

                    <i
                      v-if="!isMenuAllowed(child.id) && !isCollapsed"
                      class="fa-solid fa-lock ui-sidebar-lock ml-auto shrink-0"
                      title="Terkunci"
                    ></i>
                  </a>
                </li>
              </ul>
            </li>
          </template>
        </ul>
      </nav>

      <!-- Profil / login -->
      <div class="ui-sidebar-user flex items-center justify-center m-2 shrink-0">
        <button
          v-if="!isLoggedIn"
          type="button"
          class="ui-button ui-button-primary ui-button-block"
          :title="isCollapsed ? 'Masuk / Login' : ''"
          :aria-label="isCollapsed ? 'Masuk / Login' : undefined"
          @click="$emit('open-login')"
        >
          <i class="fa-solid fa-right-to-bracket"></i>
          <span v-if="!isCollapsed">Login</span>
        </button>

        <button
          v-else
          type="button"
          class="ui-sidebar-profile flex items-center gap-2.5 w-full min-w-0 p-1 overflow-hidden text-left"
          :title="isCollapsed ? userData?.nama || 'Profil' : ''"
          aria-label="Buka profil pengguna"
          @click="navigate('profile')"
        >
          <img
            :src="
              userData?.avatarUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                userData?.nama || 'User',
              )}&background=0D8ABC&color=fff`
            "
            alt=""
            class="ui-sidebar-profile-avatar w-8 h-8 object-cover shrink-0"
          />

          <span v-if="!isCollapsed" class="flex-1 min-w-0">
            <span
              class="block ui-sidebar-profile-name overflow-hidden text-ellipsis whitespace-nowrap"
            >
              {{ userData?.nama || "Admin User" }}
            </span>

            <span
              class="block ui-sidebar-profile-role overflow-hidden mt-0.5 text-ellipsis whitespace-nowrap"
            >
              {{ userData?.role || "User" }}
            </span>
          </span>
        </button>
      </div>
    </aside>

    <ModalHakAkses
      :is-open="isAlertModalOpen"
      @close="isAlertModalOpen = false"
      @open-login="$emit('open-login')"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { store } from "../store/index.js";
import ModalHakAkses from "./modals/ModalHakAkses.vue";

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

const isMenuAllowed = (pageId) => {
  // Halaman utama dan profil selalu dibebaskan
  if (pageId === "main" || pageId === "profile") return true;

  // Jika belum login, anggap terkunci
  if (!isLoggedIn.value) return false;

  // Superadmin bebas akses
  if (isSuperadmin.value) return true;

  // Gunakan fungsi canAccessPage dari store yang sudah ada
  return store.canAccessPage(pageId);
};

// ==========================================
// KONFIGURASI MENU DATA-DRIVEN
// ==========================================

// Menu konfigurasi dengan kondisi akses
const menuConfig = computed(() => [
  {
    type: "link",
    id: "main",
    label: "Dashboard",
    icon: "fa-house",
    keywords: "dashboard utama",
    condition: () => true, // Selalu tampilkan
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

// semua menu tampilkan jika user belum login, tapi terkunci (lock) jika tidak memiliki akses
// const menuConfig = computed(() => [
//   {
//     type: "link",
//     id: "main",
//     label: "Dashboard",
//     icon: "fa-house",
//     keywords: "dashboard utama",
//   },
//   {
//     type: "link",
//     id: "daily-report",
//     label: "Laporan Harian",
//     icon: "fa-file-invoice",
//     keywords: "laporan harian",
//   },
//   {
//     type: "link",
//     id: "summary",
//     label: "Business Summary",
//     icon: "fa-chart-line",
//     keywords: "unit summary rekap",
//   },
//   {
//     type: "group",
//     id: "units",
//     label: "Business Unit",
//     icon: "fa-building",
//     children: [
//       {
//         id: "unit-NHP",
//         label: "Nur Hidayah Press",
//         icon: "fa-book-open",
//         keywords: "nur hidayah press nhp",
//       },
//       {
//         id: "unit-NHC",
//         label: "Nusaragam x Pengaosan",
//         icon: "fa-shirt",
//         keywords: "nusaragam pengaosan nhc",
//       },
//       {
//         id: "unit-KG",
//         label: "Karta Grafika",
//         icon: "fa-print",
//         keywords: "karta grafika kg",
//       },
//     ],
//   },
//   {
//     type: "group",
//     id: "campaign",
//     label: "Workspace",
//     icon: "fa-bullhorn",
//     children: [
//       {
//         id: "progress",
//         label: "Team Progress",
//         icon: "fa-bars-progress",
//         keywords: "campaign progress progres program",
//       },
//       {
//         id: "digmar",
//         label: "Socmed Analytics",
//         icon: "fa-share-nodes",
//         keywords: "socmed analytics",
//       },
//       {
//         id: "leads",
//         label: "Leads & Campaign",
//         icon: "fa-users-rays",
//         keywords: "leads campaign",
//       },
//       {
//         id: "spv-report",
//         label: "Division Report",
//         icon: "fa-file-signature",
//         keywords: "laporan divisi spv pekanan",
//       },
//     ],
//   },
//   {
//     type: "link",
//     id: "notes",
//     label: "Notes",
//     icon: "fa-note-sticky",
//     keywords: "catatan pribadi notes",
//   },
//   {
//     type: "link",
//     id: "aduan",
//     label: "Customer Support",
//     icon: "fa-headset",
//     keywords: "customer support aduan layanan",
//   },
//   {
//     type: "link",
//     id: "promo",
//     label: "Marketing Budget",
//     icon: "fa-wallet",
//     keywords: "marketing budget biaya promosi ads",
//   },
//   {
//     type: "link",
//     id: "report",
//     label: "Executive Report",
//     icon: "fa-file-invoice-dollar",
//     keywords: "laporan executive export",
//   },
//   {
//     type: "group",
//     id: "system",
//     label: "System Settings",
//     icon: "fa-gear",
//     activeColor:
//       "bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-semibold",
//     children: [
//       {
//         id: "master-data",
//         label: "Master Data",
//         icon: "fa-sliders",
//         keywords: "master data system target",
//       },
//       {
//         id: "users",
//         label: "Akses Pengguna",
//         icon: "fa-users-gear",
//         keywords: "akses pengguna user role",
//       },
//     ],
//   },
// ]);

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

// menu tampilkan semua jika user belum login, tapi terkunci (lock) jika tidak memiliki akses
// const filteredMenus = computed(() => {
//   const query = searchMenuQuery.value.toLowerCase();
//   return menuConfig.value.reduce((acc, menu) => {
//     if (menu.type === "link") {
//       if (
//         !query ||
//         menu.label.toLowerCase().includes(query) ||
//         menu.keywords.includes(query)
//       ) {
//         acc.push(menu);
//       }
//     } else if (menu.type === "group") {
//       const validChildren = menu.children.filter(
//         (child) =>
//           !query ||
//           child.label.toLowerCase().includes(query) ||
//           child.keywords.includes(query),
//       );
//       if (validChildren.length > 0) {
//         acc.push({ ...menu, children: validChildren });
//       }
//     }
//     return acc;
//   }, []);
// });

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

// const navigate = (page) => {
//   if (!isMenuAllowed(page)) {
//     store.addNotification(
//       "Akses Terbatas",
//       "Anda tidak memiliki hak akses ke modul ini. Hubungi Supervisor/Admin.",
//       "warning",
//     );
//     return; // Blokir perpindahan halaman
//   }

//   emit("change-page", page);
//   if (window.innerWidth < 768) {
//     document.body.style.overflow = "";
//     emit("close-sidebar");
//   }
// };

const isAlertModalOpen = ref(false);
const alertMessage = ref("");

// const navigate = (page) => {
//   if (!isMenuAllowed(page)) {
//     isAlertModalOpen.value = true; // Munculkan pop-up kustom
//     return;
//   }
//   emit("change-page", page);
//   if (window.innerWidth < 768) {
//     document.body.style.overflow = "";
//     emit("close-sidebar");
//   }
// };

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


<!-- Gaya khusus komponen; layout utama berada di template. -->
<style scoped>
.ui-sidebar-overlay {
  background-color: var(--ui-overlay);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.ui-sidebar {
  border: 1px solid var(--ui-border-soft);
  border-radius: 0 1rem 1rem 0;
  background-color: var(--card-background);
  color: var(--ui-text);
  transform: translateX(-100%);
  transition:
    transform 300ms var(--ui-ease),
    width 300ms var(--ui-ease);
}

.ui-sidebar.is-open {
  transform: translateX(0);
}

.ui-sidebar.is-collapsed {
  width: var(--ui-sidebar-collapsed-width);
}
.ui-sidebar-header {
  border-bottom: 1px solid var(--ui-border-soft);
}

.ui-sidebar-brand {
  color: var(--ui-text);
  cursor: pointer;
}

.ui-sidebar-logo {
  border-radius: var(--ui-radius-control);
  background-color: var(--primary-color);
  color: var(--ui-text-on-primary);
  font-size: var(--ui-font-sm);
  box-shadow: var(--ui-shadow-sm);
}

.ui-sidebar-brand-title {
  font-size: var(--ui-font-sm);
  font-weight: 600;
  letter-spacing: 0.025em;
}

.ui-sidebar-control {
  border-radius: var(--ui-radius-sm);
  color: var(--ui-text-muted);
  font-size: var(--ui-font-xs);
  cursor: pointer;
}

.ui-search-icon {
  color: var(--ui-text-muted);
  font-size: var(--ui-font-xs);
  transform: translateY(-50%);
  pointer-events: none;
}

.ui-search .ui-input {
  min-height: 0;
  padding: 0.375rem 1.75rem 0.375rem 2rem;
  font-size: var(--ui-font-xs);
}

.ui-search-clear {
  border-radius: var(--ui-radius-sm);
  color: var(--ui-text-muted);
  font-size: var(--ui-font-xs);
  transform: translateY(-50%);
  cursor: pointer;
}

.ui-sidebar-item {
  border-radius: var(--ui-radius-control);
  background-color: transparent;
  color: var(--ui-text-secondary);
  font-size: var(--ui-font-xs);
  font-weight: 400;
  line-height: 1.5;
  text-decoration: none;
  cursor: pointer;
}

.ui-sidebar-item.is-active {
  background-color: var(--primary-color);
  color: var(--ui-text-on-primary);
  font-weight: 600;
  box-shadow: var(--ui-shadow-sm);
}

.ui-sidebar-item-icon {
  font-size: var(--ui-font-sm);
}

.ui-sidebar-lock {
  color: var(--ui-text-muted);
  font-size: 10px;
}

.ui-sidebar-group-button.is-group-active {
  background-color: var(--glass-selected);
  color: var(--ui-selected-text);
  font-weight: 600;
}

.ui-sidebar-group-system.is-group-active {
  background-color: var(--ui-danger-bg);
  color: var(--ui-danger);
}

.ui-sidebar-chevron {
  font-size: var(--ui-font-xs);
  transition: transform 200ms var(--ui-ease);
}

.ui-sidebar-chevron.is-expanded {
  transform: rotate(180deg);
}
.ui-sidebar-submenu {
  border-left: 2px solid var(--ui-sidebar-submenu-border);
}

.ui-sidebar-submenu .ui-sidebar-item {
  gap: 0.625rem;
  padding: 0.375rem 0.625rem;
  border-radius: var(--ui-radius-sm);
}

.ui-sidebar-submenu .ui-sidebar-item-icon {
  font-size: var(--ui-font-xs);
}

.ui-sidebar-submenu .ui-sidebar-lock {
  font-size: 9px;
}
.ui-sidebar-user {
  border: 1px solid var(--input-border);
  border-radius: var(--ui-radius-card);
  background-color: var(--input-background);
}

.ui-sidebar-profile {
  border-radius: var(--ui-radius-control);
  color: var(--ui-text);
  cursor: pointer;
}

.ui-sidebar-profile-avatar {
  border: 1px solid var(--primary-text);
  border-radius: 999px;
}

.ui-sidebar-profile-name {
  color: var(--ui-text);
  font-size: var(--ui-font-xs);
  font-weight: 600;
  line-height: 1.25;
}

.ui-sidebar-profile-role {
  color: var(--ui-text-muted);
  font-size: var(--ui-font-xs);
  font-weight: 400;
  text-transform: uppercase;
}
.ui-sidebar.is-collapsed .ui-sidebar-header {
  justify-content: center;
  padding-inline: 0.75rem;
}

.ui-sidebar.is-collapsed .ui-sidebar-brand {
  justify-content: center;
  width: 100%;
}

.ui-sidebar.is-collapsed .ui-sidebar-item {
  justify-content: center;
  padding-inline: 0;
}

.ui-sidebar.is-collapsed .ui-sidebar-group-content {
  justify-content: center;
  width: 100%;
}

.ui-sidebar.is-collapsed .ui-sidebar-submenu {
  padding-left: 0;
  margin-left: 0;
  border-left: none;
}

.ui-sidebar.is-collapsed .ui-sidebar-profile {
  justify-content: center;
}

.ui-sidebar.is-collapsed .ui-sidebar-user .ui-button {
  padding-inline: 0;
}

@media (hover: hover) and (pointer: fine) {
  .ui-sidebar-item:not(.is-active):not(.is-group-active):hover,
  .ui-sidebar-control:hover,
  .ui-search-clear:hover,
  .ui-sidebar-profile:hover {
    background-image: linear-gradient(var(--glass-hover), var(--glass-hover));
  }
}
.ui-sidebar-brand:focus-visible,
.ui-sidebar-control:focus-visible,
.ui-sidebar-item:focus-visible,
.ui-search-clear:focus-visible,
.ui-sidebar-profile:focus-visible {
  outline: 1px solid currentColor;
  outline-offset: 1px;
}
@media (min-width: 768px) {
  .ui-sidebar {
    border-radius: var(--ui-radius-card);
    transform: translateX(0);
  }
}
@media print {
  .ui-sidebar,
  .ui-sidebar-overlay {
    display: none !important;
  }
}
</style>
