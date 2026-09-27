<!-- src/views/PageStaffDashboard.vue -->
<template>
  <div
    class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 pb-24 relative overflow-x-hidden -mt-4 md:mt-0"
  >
    <!-- 1. HEADER BANNER UTAMA (LENGKUNGAN LEBAR BANNER ATAS) -->
    <div
      class="pb-40 bg-button text-white pt-[max(1.25rem,env(safe-area-inset-top))] px-4 relative"
    >
      <!-- <div class="bg-button text-white pt-[max(1.25rem,env(safe-area-inset-top))] px-4 pb-12 rounded-b-[2.5rem] relative shadow-lg"> -->

      <!-- Bar Sapaan Sejajar dengan Avatar -->
      <div class="relative z-10 flex items-center justify-between gap-3 pt-2">
        <div class="min-w-0 flex-1">
          <p class="text-xs text-white/80 font-medium leading-none">
            Selamat {{ greetingTime }},
          </p>
          <h2
            class="text-base md:text-lg font-black tracking-wide uppercase mt-1 leading-tight truncate"
          >
            {{ currentUser.Nama || currentUser.nama || "REKAN TIM" }}!
          </h2>
          <span
            class="inline-block text-[9px] font-extrabold uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-md backdrop-blur-md border border-white/20 mt-1.5"
          >
            Unit: {{ currentUser.Unit || currentUser.unit || "NHP" }}
          </span>
        </div>

        <!-- Avatar Profil Bulat -->
        <div
          class="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md p-0.5 border-2 border-white/40 overflow-hidden cursor-pointer active:scale-95 transition-transform shrink-0 shadow-sm"
          @click="navTo('profile')"
          title="Lihat Profil"
        >
          <img
            v-if="
              currentUser.Avatar || currentUser.avatarUrl || currentUser.avatar
            "
            :src="
              currentUser.Avatar || currentUser.avatarUrl || currentUser.avatar
            "
            class="w-full h-full object-cover rounded-full"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center font-extrabold text-xs bg-white/20 text-white rounded-full"
          >
            {{ (currentUser.Nama || currentUser.nama || "U").charAt(0) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 2. CTA BANNER CARD (MENGAMBANG SETENGAH DI ATAS LENGKUNGAN HEADER) -->
    <div class="px-4 -mt-32 relative z-30">
      <div
        class="glass-card bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3"
      >
        <div class="flex items-center gap-3 min-w-0">
          <div
            class="w-10 h-10 rounded-2xl bg-button/10 text-theme dark:text-theme flex items-center justify-center text-lg shrink-0"
          >
            <i class="fa-solid fa-rocket"></i>
          </div>
          <div class="min-w-0">
            <p
              class="text-[9px] text-slate-400 font-bold uppercase tracking-wider"
            >
              Status Workspace
            </p>
            <h4
              class="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight truncate"
            >
              {{ myActiveTasksCount }} Tugas Aktif •
              {{ openTicketsCount }} Tiket Aduan Open
            </h4>
          </div>
        </div>
        <button
          @click="navTo('progress')"
          class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs hover:bg-button hover:text-white transition-colors shrink-0 cursor-pointer"
        >
          <i class="fa-solid fa-chevron-right text-xs"></i>
        </button>
      </div>
    </div>

    <!-- 3. TAB NAVIGASI & GRID MENU FITUR (5 KOLOM) -->
    <!-- <div class="relative z-20 bg-white px-4 -mt-8 pt-12 rounded-t-xl"> -->
    <div
      class="relative z-20 bg-gradient-to-b from-white to-transparent px-4 -mt-8 pt-12 rounded-t-2xl"
    >
      <!-- Tabs Filter Menu -->
      <div
        class="flex items-center gap-6 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold"
      >
        <button
          v-for="tab in menuTabs"
          :key="tab"
          @click="activeMenuTab = tab"
          :class="
            activeMenuTab === tab
              ? 'text-theme dark:text-theme border-b-2 border-theme pb-2 -mb-2.5 font-black'
              : 'text-slate-400 hover:text-slate-600'
          "
          class="transition-all cursor-pointer"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Grid 5 Kolom Fitur Utama -->
      <div class="grid grid-cols-5 gap-y-4 gap-x-2 mt-5">
        <div
          v-for="item in filteredFeatureMenus"
          :key="item.label"
          @click="navTo(item.page)"
          class="flex flex-col items-center cursor-pointer group"
        >
          <div
            class="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-center text-theme dark:text-theme text-lg group-hover:scale-105 group-hover:border-theme/40 transition-all relative"
          >
            <i :class="item.icon"></i>
            <span
              v-if="item.badge"
              class="absolute -top-1.5 -right-1 bg-teal-500 text-white font-extrabold text-[8px] px-1 py-0.2 rounded-md shadow-xs"
            >
              {{ item.badge }}
            </span>
          </div>
          <span
            class="text-[10px] font-semibold text-slate-600 dark:text-slate-300 text-center leading-tight mt-1.5 line-clamp-2"
          >
            {{ item.label }}
          </span>
        </div>
      </div>
    </div>

    <!-- 4. SECTION BERITA & PROMOSI (CAROUSEL SLIDER) -->
    <div class="px-4 mt-8 space-y-3">
      <div class="flex items-center justify-between">
        <h3
          class="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider"
        >
          Tugas & Informasi
        </h3>
        <button
          @click="navTo('notes')"
          class="text-[11px] font-bold text-theme dark:text-theme hover:underline cursor-pointer"
        >
          Lihat Semua
        </button>
      </div>

      <!-- Sub Tabs Filter -->
      <div class="flex items-center gap-2">
        <button
          v-for="filter in ['Semua', 'Tugas DL', 'Notes']"
          :key="filter"
          @click="activePromoFilter = filter"
          :class="
            activePromoFilter === filter
              ? 'bg-button/10 text-theme border-theme/30'
              : 'bg-slate-100 dark:bg-slate-800/60 text-slate-500 border-transparent'
          "
          class="px-3.5 py-1 rounded-full text-[11px] font-bold border transition-colors cursor-pointer"
        >
          {{ filter }}
        </button>
      </div>

      <!-- Carousel Cards Slider -->
      <div class="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none]">
        <!-- Task Card 1 -->
        <div
          v-for="task in myUpcomingTasks"
          :key="task.id"
          @click="navTo('progress')"
          class="min-w-[280px] bg-slate-900 text-white rounded-2xl p-4 shadow-md shrink-0 flex flex-col justify-between h-36 relative overflow-hidden cursor-pointer group"
        >
          <div
            class="absolute -right-4 -bottom-4 w-24 h-24 bg-button opacity-20 rounded-full blur-xl"
          ></div>
          <div>
            <div class="flex justify-between items-center">
              <span
                class="bg-button text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full"
                >Tugas Tim</span
              >
              <span class="text-[10px] font-bold text-emerald-400"
                >{{ task.progress || 0 }}%</span
              >
            </div>
            <h4
              class="font-bold text-xs mt-2 line-clamp-1 group-hover:text-emerald-300 transition-colors"
            >
              {{ task.title || task.Judul }}
            </h4>
            <p class="text-[10px] text-slate-300 mt-1 line-clamp-2">
              DL: {{ task.deadline || task.Deadline || "-" }} • Unit
              {{ task.unit || task.Unit || "NHP" }}
            </p>
          </div>
          <span class="text-[9px] text-slate-400 flex items-center gap-1"
            >Buka Kanban <i class="fa-solid fa-arrow-right"></i
          ></span>
        </div>

        <!-- Banner Info Default -->
        <div
          class="min-w-[280px] bg-button text-white rounded-2xl p-4 shadow-md shrink-0 flex flex-col justify-between h-36 relative overflow-hidden"
        >
          <div>
            <span
              class="bg-white/20 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full backdrop-blur-md"
              >Pengumuman</span
            >
            <h4 class="font-bold text-xs mt-2">Update Sistem Operational</h4>
            <p class="text-[10px] text-white/80 mt-1 line-clamp-2">
              Pantau rekapitulasi data leads dan penanganan tiket aduan secara
              real-time.
            </p>
          </div>
          <span class="text-[9px] text-white/90 flex items-center gap-1"
            >Detail Info <i class="fa-solid fa-arrow-right"></i
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { store } from "../store/index.js";

const currentUser = computed(() => store.currentUser || {});

const activeMenuTab = ref("Untukmu");
const activePromoFilter = ref("Semua");

const menuTabs = ["Untukmu", "Operasional", "Workspace", "Lainnya"];

const featureMenus = [
  {
    label: "Progress Board",
    icon: "fa-solid fa-bars-progress",
    page: "progress",
    category: "Untukmu",
  },
  {
    label: "Customer Care",
    icon: "fa-solid fa-headset",
    page: "aduan",
    category: "Untukmu",
  },
  {
    label: "Leads & Campaign",
    icon: "fa-solid fa-users-rays",
    page: "leads",
    category: "Workspace",
    badge: "NEW",
  },
  {
    label: "Division Report",
    icon: "fa-solid fa-file-signature",
    page: "spv-report",
    category: "Operasional",
  },
  {
    label: "Sosmed Analytics",
    icon: "fa-solid fa-share-nodes",
    page: "digmar",
    category: "Workspace",
  },
  {
    label: "Notes & Catatan",
    icon: "fa-solid fa-note-sticky",
    page: "notes",
    category: "Untukmu",
  },
  {
    label: "Unit Summary",
    icon: "fa-solid fa-chart-pie",
    page: "rekap",
    category: "Operasional",
  },
  {
    label: "Biaya Promosi",
    icon: "fa-solid fa-bullhorn",
    page: "promo",
    category: "Operasional",
  },
  {
    label: "Master Data",
    icon: "fa-solid fa-database",
    page: "master-data",
    category: "Lainnya",
  },
  {
    label: "Profil Saya",
    icon: "fa-solid fa-user-gear",
    page: "profile",
    category: "Lainnya",
  },
];

const filteredFeatureMenus = computed(() => {
  if (activeMenuTab.value === "Untukmu") return featureMenus.slice(0, 10);
  return featureMenus.filter((m) => m.category === activeMenuTab.value);
});

const greetingTime = computed(() => {
  const hour = new Date().getHours();
  if (hour >= 3 && hour < 11) return "pagi";
  if (hour >= 11 && hour < 15) return "siang";
  if (hour >= 15 && hour < 18) return "sore";
  return "malam";
});

const navTo = (page) => {
  store.currentPage = page;
};

// Hitung Tugas Aktif
const myTasks = computed(() => {
  const allPrograms = store.db?.programs || store.programs || [];
  const myId = currentUser.value?.id || currentUser.value?.email;
  const myName = currentUser.value?.nama || currentUser.value?.Nama;

  return allPrograms.filter((p) => {
    const assignedIds = p.assignedPicIds || [];
    const assignedUsers = p.assignedUsers || [];
    const isAssigned =
      assignedIds.includes(myId) || (myName && assignedUsers.includes(myName));
    return isAssigned || p.createdBy === myId;
  });
});

const myActiveTasksCount = computed(() => {
  return myTasks.value.filter((t) => (t.status || t.Status) !== "Completed")
    .length;
});

// Hitung Tiket Open
const openTicketsCount = computed(() => {
  const aduanList = store.db?.aduanList || store.aduanList || [];
  return aduanList.filter((a) => a.status === "Open").length;
});

// Ambil Tugas Terdekat
const myUpcomingTasks = computed(() => {
  return myTasks.value
    .filter((t) => (t.status || t.Status) !== "Completed")
    .slice(0, 3);
});
</script>
