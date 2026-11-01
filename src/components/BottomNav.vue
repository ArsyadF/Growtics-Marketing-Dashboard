<!-- src/components/BottomNav.vue -->
<template>
  <div
    class="bottom-nav fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-0 right-0 z-40 md:hidden pointer-events-none flex justify-center px-3"
  >
    <transition name="fade">
      <div
        v-if="activePopup"
        class="pointer-events-auto fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-30"
        @click.stop="closePopup"
        @touchstart.stop="closePopup"
      ></div>
    </transition>

    <div ref="navContainerRef" class="relative w-full max-w-lg pointer-events-auto z-40">
      <!-- Popup unit -->
      <transition name="pop-up">
        <div
          v-if="activePopup === 'unit'"
          id="bottom-nav-unit"
          class="ui-popup ui-bottom-popup absolute right-0 bottom-20 left-0 z-40 w-[94%] max-w-80 mx-auto flex flex-col gap-4"
        >
          <p class="ui-popup-title pt-1 px-3 pb-0.5 text-center">Pilih Unit Usaha</p>

          <div class="grid grid-cols-3 gap-2">
            <template v-for="menu in unitMenus" :key="menu.id">
              <button
                v-if="menu.condition()"
                type="button"
                class="ui-popup-menu-item flex flex-col items-center justify-center gap-1.5 min-w-0 p-2.5 text-center"
                @click.stop="menu.action"
              >
                <span class="ui-icon" :class="menu.iconClass">
                  <i :class="menu.icon"></i>
                </span>
                <span>{{ menu.label }}</span>
              </button>
            </template>
          </div>
        </div>
      </transition>

      <!-- Popup tambah data -->
      <transition name="pop-up">
        <div
          v-if="activePopup === 'add'"
          id="bottom-nav-add"
          class="ui-popup ui-bottom-popup absolute right-0 bottom-20 left-0 z-40 w-[94%] max-w-80 mx-auto flex flex-col gap-4"
        >
          <p class="ui-popup-title pt-1 px-3 pb-0.5 text-center">Input Data Baru</p>

          <div class="grid grid-cols-3 gap-2">
            <template v-for="menu in addMenus" :key="menu.id">
              <button
                v-if="menu.condition()"
                type="button"
                class="ui-popup-menu-item flex flex-col items-center justify-center gap-1.5 min-w-0 p-2.5 text-center"
                @click.stop="menu.action"
              >
                <span class="ui-icon ui-icon-sm" :class="menu.iconClass">
                  <i :class="menu.icon"></i>
                </span>
                <span>{{ menu.label }}</span>
              </button>
            </template>
          </div>
        </div>
      </transition>

      <!-- Popup workspace -->
      <transition name="pop-up">
        <div
          v-if="activePopup === 'workspace'"
          id="bottom-nav-workspace"
          class="ui-popup ui-bottom-popup absolute right-0 bottom-20 left-0 z-40 w-[94%] max-w-80 mx-auto flex flex-col gap-4"
        >
          <p class="ui-popup-title pt-1 px-3 pb-0.5 text-center">Modul Workspace</p>

          <div class="grid grid-cols-2 gap-2">
            <template v-for="menu in workspaceMenus" :key="menu.id">
              <button
                v-if="menu.condition()"
                type="button"
                class="ui-popup-menu-item flex flex-col items-center justify-center gap-1.5 min-w-0 p-2.5 text-center"
                @click.stop="menu.action"
              >
                <span class="ui-icon" :class="menu.iconClass">
                  <i :class="menu.icon"></i>
                </span>
                <span>{{ menu.label }}</span>
              </button>
            </template>
          </div>
        </div>
      </transition>

      <!-- Navigasi utama -->
      <nav
        aria-label="Navigasi utama"
        class="pointer-events-auto relative z-30 w-full h-16 flex items-center justify-between"
      >
        <svg
          aria-hidden="true"
          class="ui-bottom-background absolute inset-0 w-full h-full"
          viewBox="0 0 375 64"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M 0 20 C 0 8.954 8.954 0 20 0 L 140 0 C 149 0 153 5 158 11 C 164 19 171 25 187.5 25 C 204 25 211 19 217 11 C 222 5 226 0 235 0 L 355 0 C 366.046 0 375 8.954 375 20 L 375 44 C 375 55.046 366.046 64 355 64 L 20 64 C 8.954 64 0 55.046 0 44 Z"
          />
        </svg>

        <div class="relative z-10 w-full flex items-center justify-around h-full px-2">
          <button
            type="button"
            class="ui-bottom-item flex flex-col items-center justify-center"
            :class="{ 'is-active': store.currentPage === 'main' }"
            :aria-current="store.currentPage === 'main' ? 'page' : undefined"
            @click.stop="navTo('main')"
          >
            <span class="ui-bottom-icon flex items-center justify-center w-12 h-8">
              <i class="fa-solid fa-house"></i>
            </span>
            <span class="ui-bottom-label">Dashboard</span>
          </button>

          <button
            type="button"
            class="ui-bottom-item flex flex-col items-center justify-center"
            :class="{
              'is-active':
                activePopup === 'unit' ||
                store.currentPage.startsWith('unit-') ||
                store.currentPage === 'summary',
            }"
            :aria-expanded="activePopup === 'unit'"
            aria-controls="bottom-nav-unit"
            @click.stop="togglePopup('unit')"
          >
            <span class="ui-bottom-icon flex items-center justify-center w-12 h-8">
              <i class="fa-solid fa-building"></i>
            </span>
            <span class="ui-bottom-label">Unit</span>
          </button>

          <div class="relative flex justify-center items-center w-14 h-full shrink-0">
            <button
              type="button"
              class="ui-bottom-add absolute -top-4 z-20 flex items-center justify-center w-14 h-14 bg-theme-gradient"
              :aria-expanded="activePopup === 'add'"
              aria-controls="bottom-nav-add"
              :aria-label="
                activePopup === 'add' ? 'Tutup pilihan input data' : 'Buka pilihan input data'
              "
              @click.stop="togglePopup('add')"
            >
              <i
                class="fa-solid fa-plus transition-transform duration-300"
                :class="{ 'rotate-45': activePopup === 'add' }"
              ></i>
            </button>
          </div>

          <button
            type="button"
            class="ui-bottom-item flex flex-col items-center justify-center"
            :class="{
              'is-active':
                activePopup === 'workspace' ||
                ['progress', 'digmar', 'leads', 'spv-report'].includes(store.currentPage),
            }"
            :aria-expanded="activePopup === 'workspace'"
            aria-controls="bottom-nav-workspace"
            @click.stop="togglePopup('workspace')"
          >
            <span class="ui-bottom-icon flex items-center justify-center w-12 h-8">
              <i class="fa-solid fa-bars-progress"></i>
            </span>
            <span class="ui-bottom-label">Workspace</span>
          </button>

          <button
            type="button"
            class="ui-bottom-item flex flex-col items-center justify-center"
            :class="{ 'is-active': store.currentPage === 'aduan' }"
            :aria-current="store.currentPage === 'aduan' ? 'page' : undefined"
            @click.stop="navTo('aduan')"
          >
            <span class="ui-bottom-icon flex items-center justify-center w-12 h-8">
              <i class="fa-solid fa-headset"></i>
            </span>
            <span class="ui-bottom-label">Aduan</span>
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


<!-- Gaya khusus komponen; layout utama berada di template. -->
<style scoped>
.ui-bottom-item {
  color: var(--ui-text-muted);
  cursor: pointer;
}

.ui-bottom-icon {
  border-radius: var(--ui-radius-card);
  font-size: var(--ui-font-xs);
}

.ui-bottom-label {
  font-size: var(--ui-font-xs);
  font-weight: 600;
  line-height: 1.5;
}

.ui-bottom-item.is-active .ui-bottom-icon {
  background-color: var(--primary-color);
  color: var(--ui-text-on-primary);
  box-shadow: var(--ui-shadow-sm);
}

.ui-bottom-item.is-active .ui-bottom-label {
  color: var(--ui-selected-text);
}

.dark .ui-bottom-item {
  color: #f1f5f9;
}

@media (hover: hover) and (pointer: fine) {
  .ui-bottom-item:not(.is-active):hover .ui-bottom-icon {
    background-color: var(--glass-hover);
  }
}
.ui-bottom-background {
  fill: var(--input-background);
  filter: drop-shadow(0 10px 15px rgb(0 0 0 / 0.15));
}

.ui-bottom-popup {
  pointer-events: auto;
}

.ui-popup-title {
  color: var(--ui-text-muted);
  font-size: var(--ui-font-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.ui-popup-menu-item {
  border: 1px solid var(--input-border);
  border-radius: var(--ui-radius-card);
  background-color: var(--input-background);
  color: var(--ui-text-secondary);
  font-size: var(--ui-font-xs);
  font-weight: 600;
  line-height: 1.3;
  cursor: pointer;
}

.ui-bottom-add {
  border: 4px solid var(--page-background);
  border-radius: 999px;
  color: #ffffff;
  font-size: 1.25rem;
  box-shadow: var(--ui-shadow-button);
  cursor: pointer;
}
</style>
