<!-- src/views/PageStaffDashboard.vue -->
<template>
  <div
    class="min-h-screen bg-[#f3f6fd] dark:bg-slate-950 text-slate-800 dark:text-slate-100 pb-28 pt-2 px-4 space-y-5 max-w-md md:max-w-4xl mx-auto relative overflow-x-hidden font-sans"
  >
    <!-- 1. HEADER BANNER GAYA NEUMORPHISM (BIRU GRADASI) -->
    <div
      class="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 rounded-3xl p-5 text-white shadow-lg shadow-blue-500/25 space-y-3 relative overflow-hidden"
    >
      <!-- Decorative Ornaments -->
      <div
        class="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"
      ></div>

      <div class="flex justify-between items-center relative z-10">
        <div>
          <p class="text-xs text-blue-100 font-medium">
            Selamat {{ greetingTime }},
          </p>
          <h2 class="text-lg font-black tracking-wide mt-0.5">
            Hello {{ currentUser.Nama || currentUser.nama || "Rekan Tim" }}
          </h2>
        </div>

        <!-- Profil Avatar Ringkas -->
        <div
          @click="navTo('profile')"
          class="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md p-0.5 border border-white/40 overflow-hidden cursor-pointer active:scale-95 transition-transform shrink-0"
        >
          <img
            v-if="
              currentUser.Avatar || currentUser.avatarUrl || currentUser.avatar
            "
            :src="
              currentUser.Avatar || currentUser.avatarUrl || currentUser.avatar
            "
            class="w-full h-full object-cover rounded-xl"
          />
          <div
            v-else
            class="w-full h-full bg-white text-blue-600 font-black text-xs flex items-center justify-center rounded-xl"
          >
            {{ (currentUser.Nama || currentUser.nama || "U").charAt(0) }}
          </div>
        </div>
      </div>

      <!-- Search Job / Feature Input Bar (Gaya Pill Capsule) -->
      <div class="relative z-10">
        <div
          @click="navTo('progress')"
          class="w-full bg-white dark:bg-slate-900 rounded-full px-4 py-2.5 flex items-center gap-2.5 shadow-md border border-white/50 text-xs text-slate-400 cursor-pointer"
        >
          <div
            class="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px]"
          >
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
          <span class="truncate font-medium text-slate-400"
            >Cari tugas, modul, atau catatan...</span
          >
        </div>
      </div>
    </div>

    <!-- 2. RECOMMENDED / TUGAS TERDEKAT (CARD DENGAN SOFT SHADOW & PANAH SEJAJAR) -->
    <div class="space-y-3">
      <div class="flex justify-between items-center px-1">
        <h3
          class="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider"
        >
          Rekomendasi / Tugas Terdekat
        </h3>
        <button
          @click="navTo('progress')"
          class="w-7 h-7 rounded-full bg-white dark:bg-slate-900 shadow-md border border-slate-100 dark:border-slate-800 text-blue-600 flex items-center justify-center text-xs hover:scale-105 transition-transform cursor-pointer"
        >
          <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>

      <!-- Horizontal Cards Slider -->
      <div class="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none]">
        <template v-if="myUpcomingTasks.length > 0">
          <div
            v-for="task in myUpcomingTasks"
            :key="task.id"
            @click="navTo('progress')"
            class="min-w-[240px] bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100/80 dark:border-slate-800 shrink-0 space-y-3 cursor-pointer hover:scale-[1.01] transition-transform"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center text-base shrink-0 shadow-xs"
              >
                <i class="fa-solid fa-bars-progress"></i>
              </div>
              <div class="overflow-hidden">
                <p class="text-[10px] font-bold text-slate-400">
                  Unit {{ task.unit || task.Unit || "NHP" }}
                </p>
                <h4
                  class="font-extrabold text-xs text-slate-800 dark:text-slate-100 truncate"
                >
                  {{ task.title || task.Judul }}
                </h4>
              </div>
            </div>

            <div class="flex justify-between items-center pt-1 text-[10px]">
              <span
                class="px-3 py-1 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold"
              >
                DL: {{ task.deadline || task.Deadline || "-" }}
              </span>
              <span class="font-black text-emerald-500"
                >{{ task.progress || 0 }}%</span
              >
            </div>
          </div>
        </template>

        <!-- Fallback Card -->
        <div
          v-else
          class="w-full bg-white dark:bg-slate-900 rounded-3xl p-5 text-center text-slate-400 shadow-lg shadow-slate-200/50 border border-slate-100"
        >
          <p class="text-xs font-bold text-slate-700 dark:text-slate-200">
            Tidak ada tugas terdekat.
          </p>
        </div>
      </div>
    </div>

    <!-- 3. RECENTLY POSTED / METRIK ACTIVITY HUB (SOFT NEUMORPHIC CARDS) -->
    <div class="space-y-3">
      <div class="flex justify-between items-center px-1">
        <h3
          class="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider"
        >
          Kategori Modul Utama
        </h3>
        <button
          @click="navTo('notes')"
          class="w-7 h-7 rounded-full bg-white dark:bg-slate-900 shadow-md border border-slate-100 dark:border-slate-800 text-blue-600 flex items-center justify-center text-xs hover:scale-105 transition-transform cursor-pointer"
        >
          <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>

      <!-- Grid Fitur 2 Kolom (Card Neumorphism) -->
      <div class="grid grid-cols-2 gap-3">
        <div
          v-for="item in featureMenus"
          :key="item.label"
          @click="navTo(item.page)"
          class="bg-white dark:bg-slate-900 rounded-3xl p-3.5 shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100/80 dark:border-slate-800 flex items-center gap-3 cursor-pointer hover:scale-[1.02] transition-transform group"
        >
          <div
            class="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center text-base shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors"
          >
            <i :class="item.icon"></i>
          </div>
          <div class="overflow-hidden">
            <h4
              class="font-extrabold text-xs text-slate-800 dark:text-slate-100 truncate group-hover:text-blue-600 transition-colors"
            >
              {{ item.label }}
            </h4>
            <p class="text-[9px] text-slate-400 mt-0.5 truncate">
              Modul {{ item.category }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { store } from "../store/index.js";

const currentUser = computed(() => store.currentUser || {});

const greetingTime = computed(() => {
  const hour = new Date().getHours();
  if (hour >= 3 && hour < 11) return "Pagi";
  if (hour >= 11 && hour < 15) return "Siang";
  if (hour >= 15 && hour < 18) return "Sore";
  return "Malam";
});

const navTo = (page) => {
  store.currentPage = page;
};

// Hitung Tugas Aktif Milik User
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

// Ambil Tugas Terdekat
const myUpcomingTasks = computed(() => {
  return myTasks.value
    .filter((t) => (t.status || t.Status) !== "Completed")
    .slice(0, 3);
});

// Fitur Menus
const featureMenus = [
  {
    label: "Progress Board",
    icon: "fa-solid fa-bars-progress",
    page: "progress",
    category: "Tugas",
  },
  {
    label: "Customer Care",
    icon: "fa-solid fa-headset",
    page: "aduan",
    category: "Aduan",
  },
  {
    label: "Leads Campaign",
    icon: "fa-solid fa-users-rays",
    page: "leads",
    category: "Marketing",
  },
  {
    label: "Division Report",
    icon: "fa-solid fa-file-signature",
    page: "spv-report",
    category: "Laporan",
  },
  {
    label: "Sosmed Analytics",
    icon: "fa-solid fa-share-nodes",
    page: "digmar",
    category: "Sosmed",
  },
  {
    label: "Notes & Catatan",
    icon: "fa-solid fa-note-sticky",
    page: "notes",
    category: "Internal",
  },
  {
    label: "Unit Summary",
    icon: "fa-solid fa-chart-pie",
    page: "rekap",
    category: "Ringkasan",
  },
  {
    label: "Profil Saya",
    icon: "fa-solid fa-user-gear",
    page: "profile",
    category: "Akun",
  },
];
</script>
