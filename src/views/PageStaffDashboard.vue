<!-- src/views/PageStaffDashboard.vue -->
<template>
  <div class="space-y-4 md:space-y-6 pb-20 md:pb-6">
    <!-- 1. HEADER MENYAPA STAF DENGAN DINAMIS LANGIT, MATAHARI/BULAN & AWAN -->
    <div
      class="p-5 rounded-3xl text-white shadow-lg relative overflow-hidden -mb-16 pb-16 transition-all duration-700"
      :class="skyTheme.background"
    >
      <!-- ORNAMEN AWAN LATAR BELAKANG -->
      <div class="absolute inset-0 pointer-events-none opacity-25">
        <!-- Awan 1 -->
        <i
          class="fa-solid fa-cloud text-white text-6xl absolute top-2 right-12 animate-pulse"
        ></i>
        <!-- Awan 2 -->
        <i
          class="fa-solid fa-cloud text-white text-4xl absolute bottom-14 right-36 opacity-75"
        ></i>
        <!-- Awan 3 (Kecil di Kiri) -->
        <i
          class="fa-solid fa-cloud text-white text-3xl absolute top-8 left-1/3 opacity-50"
        ></i>
      </div>

      <!-- MATAHARI / BULAN BERDASARKAN WAKTU -->
      <div class="absolute -right-4 -top-4 pointer-events-none">
        <!-- Sun Glow / Moon Glow Effect -->
        <div
          class="w-32 h-32 rounded-full blur-2xl opacity-60 transition-all duration-700"
          :class="skyTheme.glow"
        ></div>

        <!-- Element Matahari / Bulan -->
        <div
          class="absolute top-8 right-8 w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-xl transition-all duration-700 backdrop-blur-xs"
          :class="skyTheme.celestialClass"
        >
          <i :class="skyTheme.celestialIcon"></i>
        </div>
      </div>

      <!-- KONTEN GREETING CARD -->
      <div class="relative z-10 flex items-center justify-between">
        <div>
          <span
            class="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-md"
          >
            {{ currentUser.role || "Staff Workspace" }}
          </span>
          <h2 class="text-l md:text-l mt-2 leading-tight">
            Selamat {{ greetingTime }}
          </h2>
          <h2 class="text-lg md:text-xl font-extrabold leading-tight">
            {{ currentUser.nama || "Rekan Tim" }} 👋
          </h2>
          <p class="text-xs text-white/80 mt-2">
            Unit:
            <span class="font-bold underline">{{
              currentUser.unit || "NHP"
            }}</span>
            • Pantau aktivitas & tugas harian Anda di sini.
          </p>
        </div>
      </div>
    </div>

    <!-- 4. AKTIVITAS TERKINI (JADWAL / TUGAS TERDEKAT STAF) -->
    <div
      class="glass-card bg-white/90 dark:bg-slate-900/90 rounded-3xl p-4 mx-4 md:p-5 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3 relative z-10"
    >
      <div class="flex items-center justify-between">
        <h3
          class="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5"
        >
          <i class="fa-solid fa-clock-rotate-left text-emerald-600"></i>
          Tugas Deadline Terdekat Anda
        </h3>
        <button
          @click="navTo('progress')"
          class="text-[10px] font-bold text-theme hover:underline"
        >
          Lihat Semua
        </button>
      </div>

      <div class="space-y-2">
        <div
          v-for="task in myUpcomingTasks"
          :key="task.id"
          @click="navTo('progress')"
          class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <div class="overflow-hidden">
            <p class="font-bold text-slate-800 dark:text-slate-200 truncate">
              {{ task.title || task.Judul }}
            </p>
            <p class="text-[10px] text-slate-400">
              DL: {{ task.deadline || task.Deadline || "-" }} • Unit
              {{ task.unit || task.Unit }}
            </p>
          </div>
          <span
            class="px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
          >
            {{ task.progress || 0 }}%
          </span>
        </div>

        <div
          v-if="myUpcomingTasks.length === 0"
          class="text-center py-6 text-slate-400 text-xs"
        >
          <i class="fa-solid fa-circle-check text-xl mb-1 opacity-40"></i>
          <p>Tidak ada tugas mendekati deadline.</p>
        </div>
      </div>
    </div>

    <!-- 2. RINGKASAN LAPORAN OPERASIONAL -->
    <div>
      <h3
        class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-1 flex items-center gap-1.5"
      >
        <i class="fa-solid fa-[#25eba1] fa-chart-pie"></i>
        Ringkasan Aktivitas Anda
      </h3>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <!-- Kartu 1: Tugas Berjalan -->
        <div
          @click="navTo('progress')"
          class="glass-card bg-white/90 dark:bg-slate-900/90 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center gap-3 cursor-pointer hover:border-blue-500/40 transition-all"
        >
          <div
            class="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-base shrink-0"
          >
            <i class="fa-solid fa-list-check"></i>
          </div>
          <div class="overflow-hidden">
            <p class="text-[10px] font-medium text-slate-400 truncate">
              Tugas Aktif
            </p>
            <p
              class="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight"
            >
              {{ myActiveTasksCount }}
            </p>
          </div>
        </div>

        <!-- Kartu 2: Tugas Selesai -->
        <div
          @click="navTo('progress')"
          class="glass-card bg-white/90 dark:bg-slate-900/90 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center gap-3 cursor-pointer hover:border-emerald-500/40 transition-all"
        >
          <div
            class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-base shrink-0"
          >
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <div class="overflow-hidden">
            <p class="text-[10px] font-medium text-slate-400 truncate">
              Tugas Selesai
            </p>
            <p
              class="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight"
            >
              {{ myCompletedTasksCount }}
            </p>
          </div>
        </div>

        <!-- Kartu 3: Aduan Menunggu -->
        <div
          @click="navTo('aduan')"
          class="glass-card bg-white/90 dark:bg-slate-900/90 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center gap-3 cursor-pointer hover:border-amber-500/40 transition-all"
        >
          <div
            class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-base shrink-0"
          >
            <i class="fa-solid fa-headset"></i>
          </div>
          <div class="overflow-hidden">
            <p class="text-[10px] font-medium text-slate-400 truncate">
              Aduan Open
            </p>
            <p
              class="text-base md:text-lg font-bold text-amber-600 dark:text-amber-400 leading-tight"
            >
              {{ openTicketsCount }}
            </p>
          </div>
        </div>

        <!-- Kartu 4: Catatan/Notes -->
        <div
          @click="navTo('notes')"
          class="glass-card bg-white/90 dark:bg-slate-900/90 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center gap-3 cursor-pointer hover:border-purple-500/40 transition-all"
        >
          <div
            class="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-base shrink-0"
          >
            <i class="fa-solid fa-note-sticky"></i>
          </div>
          <div class="overflow-hidden">
            <p class="text-[10px] font-medium text-slate-400 truncate">
              Notes Tim
            </p>
            <p
              class="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight"
            >
              {{ notesCount }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. MENU AKSES FITUR -->
    <div>
      <h3
        class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-1 flex items-center gap-1.5"
      >
        <i class="fa-solid fa-shapes"></i>
        Menu & Fitur Utama
      </h3>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <!-- Fitur 1: Progress Board -->
        <button
          v-if="store.canAccessPage('progress')"
          @click="navTo('progress')"
          class="glass-card bg-white/80 dark:bg-slate-900/80 p-4 rounded-3xl border border-slate-100 dark:border-slate-800/80 hover:bg-emerald-500/5 transition-all text-left flex flex-col justify-between h-32 group cursor-pointer shadow-sm relative overflow-hidden"
        >
          <div
            class="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg group-hover:scale-110 transition-transform"
          >
            <i class="fa-solid fa-bars-progress"></i>
          </div>
          <div>
            <h4
              class="font-bold text-xs text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 transition-colors"
            >
              Team Progress
            </h4>
            <p class="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
              Kanban board tugas kerja
            </p>
          </div>
        </button>

        <!-- Fitur 2: Customer Care / Aduan -->
        <button
          v-if="store.canAccessPage('aduan')"
          @click="navTo('aduan')"
          class="glass-card bg-white/80 dark:bg-slate-900/80 p-4 rounded-3xl border border-slate-100 dark:border-slate-800/80 hover:bg-blue-500/5 transition-all text-left flex flex-col justify-between h-32 group cursor-pointer shadow-sm"
        >
          <div
            class="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg group-hover:scale-110 transition-transform"
          >
            <i class="fa-solid fa-headset"></i>
          </div>
          <div>
            <h4
              class="font-bold text-xs text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors"
            >
              Customer Care
            </h4>
            <p class="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
              Kelola tiket keluhan
            </p>
          </div>
        </button>

        <!-- Fitur 3: Leads & Campaign -->
        <button
          v-if="store.canAccessPage('leads')"
          @click="navTo('leads')"
          class="glass-card bg-white/80 dark:bg-slate-900/80 p-4 rounded-3xl border border-slate-100 dark:border-slate-800/80 hover:bg-teal-500/5 transition-all text-left flex flex-col justify-between h-32 group cursor-pointer shadow-sm"
        >
          <div
            class="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center text-lg group-hover:scale-110 transition-transform"
          >
            <i class="fa-solid fa-users-rays"></i>
          </div>
          <div>
            <h4
              class="font-bold text-xs text-slate-800 dark:text-slate-100 group-hover:text-teal-600 transition-colors"
            >
              Leads & Campaign
            </h4>
            <p class="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
              Data prospek & leads
            </p>
          </div>
        </button>

        <!-- Fitur 4: Division Report -->
        <button
          v-if="store.canAccessPage('spv-report')"
          @click="navTo('spv-report')"
          class="glass-card bg-white/80 dark:bg-slate-900/80 p-4 rounded-3xl border border-slate-100 dark:border-slate-800/80 hover:bg-purple-500/5 transition-all text-left flex flex-col justify-between h-32 group cursor-pointer shadow-sm"
        >
          <div
            class="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-lg group-hover:scale-110 transition-transform"
          >
            <i class="fa-solid fa-file-signature"></i>
          </div>
          <div>
            <h4
              class="font-bold text-xs text-slate-800 dark:text-slate-100 group-hover:text-purple-600 transition-colors"
            >
              Division Report
            </h4>
            <p class="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
              Laporan pekanan divisi
            </p>
          </div>
        </button>

        <!-- Fitur 5: Sosmed Analytics -->
        <button
          v-if="store.canAccessPage('digmar')"
          @click="navTo('digmar')"
          class="glass-card bg-white/80 dark:bg-slate-900/80 p-4 rounded-3xl border border-slate-100 dark:border-slate-800/80 hover:bg-amber-500/5 transition-all text-left flex flex-col justify-between h-32 group cursor-pointer shadow-sm"
        >
          <div
            class="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg group-hover:scale-110 transition-transform"
          >
            <i class="fa-solid fa-share-nodes"></i>
          </div>
          <div>
            <h4
              class="font-bold text-xs text-slate-800 dark:text-slate-100 group-hover:text-amber-600 transition-colors"
            >
              Sosmed Analytics
            </h4>
            <p class="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
              Performa media sosial
            </p>
          </div>
        </button>

        <!-- Fitur 6: Notes & Catatan Tim -->
        <button
          v-if="store.canAccessPage('notes')"
          @click="navTo('notes')"
          class="glass-card bg-white/80 dark:bg-slate-900/80 p-4 rounded-3xl border border-slate-100 dark:border-slate-800/80 hover:bg-rose-500/5 transition-all text-left flex flex-col justify-between h-32 group cursor-pointer shadow-sm"
        >
          <div
            class="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center text-lg group-hover:scale-110 transition-transform"
          >
            <i class="fa-solid fa-note-sticky"></i>
          </div>
          <div>
            <h4
              class="font-bold text-xs text-slate-800 dark:text-slate-100 group-hover:text-rose-600 transition-colors"
            >
              Notes & Catatan
            </h4>
            <p class="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
              Catatan internal tim
            </p>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { store } from "../store/index.js";

const currentUser = computed(() => store.currentUser || {});

// Waktu Menyapa User
const greetingTime = computed(() => {
  const hour = new Date().getHours();
  if (hour >= 3 && hour < 11) return "Pagi";
  if (hour >= 11 && hour < 15) return "Siang";
  if (hour >= 15 && hour < 18) return "Sore";
  return "Malam";
});

// Konfigurasi Dinamis Tema Langit & Benda Langit (Matahari / Bulan)
const skyTheme = computed(() => {
  const hour = new Date().getHours();

  // PAGI (03:00 - 10:59) -> Langit Cerah Gradasi Hijau-Teal & Matahari Terbit
  if (hour >= 3 && hour < 11) {
    return {
      background: "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600",
      glow: "bg-amber-300",
      celestialClass:
        "bg-amber-400/30 text-amber-200 border border-amber-300/40",
      celestialIcon: "fa-solid fa-sun",
    };
  }

  // SIANG (11:00 - 14:59) -> Langit Biru Terang & Matahari Terik
  if (hour >= 11 && hour < 15) {
    return {
      background: "bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600",
      glow: "bg-yellow-200",
      celestialClass:
        "bg-yellow-300/40 text-yellow-100 border border-yellow-200/50",
      celestialIcon: "fa-solid fa-sun-bright",
    };
  }

  // SORE (15:00 - 17:59) -> Langit Sunset Oranye & Matahari Senja
  if (hour >= 15 && hour < 18) {
    return {
      background: "bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700",
      glow: "bg-amber-400",
      celestialClass:
        "bg-orange-400/30 text-amber-200 border border-amber-200/40",
      celestialIcon: "fa-solid fa-sun",
    };
  }

  // MALAM (18:00 - 02:59) -> Langit Malam Indigo Gelap & Bulan Sabit
  return {
    background: "bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900",
    glow: "bg-indigo-400",
    celestialClass:
      "bg-indigo-400/20 text-yellow-200 border border-indigo-300/30",
    celestialIcon: "fa-solid fa-moon",
  };
});

const navTo = (page) => {
  store.currentPage = page;
};

// Hitung Tugas Aktif Milik User yang Sedang Login
const myTasks = computed(() => {
  const allPrograms = store.db?.programs || store.programs || [];
  const myId = currentUser.value?.id || currentUser.value?.email;
  const myName = currentUser.value?.nama;

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

const myCompletedTasksCount = computed(() => {
  return myTasks.value.filter((t) => (t.status || t.Status) === "Completed")
    .length;
});

// Hitung Tiket Open
const openTicketsCount = computed(() => {
  const aduanList = store.db?.aduanList || store.aduanList || [];
  return aduanList.filter((a) => a.status === "Open").length;
});

// Hitung Notes
const notesCount = computed(() => {
  const notes = store.db?.notes || store.notes || [];
  return notes.length;
});

// Ambil 3 Tugas Terdekat
const myUpcomingTasks = computed(() => {
  return myTasks.value
    .filter((t) => (t.status || t.Status) !== "Completed")
    .slice(0, 3);
});
</script>
