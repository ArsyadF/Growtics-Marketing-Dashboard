<!-- src/views/PageStaffDashboard.vue -->
<template>
  <div class="space-y-4 md:space-y-6 pb-20 md:pb-6">
    <!-- 1. HEADER MENYAPA STAF DENGAN DINAMIS LANGIT & RUNNING TEXT BIO -->
    <div
      class="p-5 rounded-3xl text-white shadow-lg relative overflow-hidden -mb-16 pb-16 bg-theme-gradient"
    >
      <!-- ORNAMEN AWAN LATAR BELAKANG -->
      <div class="absolute inset-0 pointer-events-none opacity-25">
        <i
          class="fa-solid fa-cloud text-white text-6xl absolute top-2 right-12 animate-pulse"
        ></i>
        <i
          class="fa-solid fa-cloud text-white text-4xl absolute bottom-14 right-36 opacity-75"
        ></i>
        <i
          class="fa-solid fa-cloud text-white text-3xl absolute top-8 left-1/3 opacity-50"
        ></i>
      </div>

      <!-- MATAHARI / BULAN BERDASARKAN WAKTU -->
      <div class="absolute -right-4 -top-4 pointer-events-none">
        <div
          class="w-32 h-32 rounded-full blur-2xl opacity-60 transition-all duration-700"
          :class="skyTheme.glow"
        ></div>
        <div
          class="absolute top-8 right-8 w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-xl transition-all duration-700 backdrop-blur-xs"
          :class="skyTheme.celestialClass"
        >
          <i :class="skyTheme.celestialIcon"></i>
        </div>
      </div>

      <!-- KONTEN GREETING CARD -->
      <div class="relative z-10 flex flex-col justify-between space-y-3">
        <div>
          <span
            class="text-sm md:text-xs font-semibold uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-md"
          >
            {{ currentUser.role || "Staff Workspace" }}
          </span>
          <h2 class="text-base md:text-sm mt-2 leading-tight">
            Selamat {{ greetingTime }}
          </h2>
          <h2 class="text-xl md:text-2xl font-semibold leading-tight">
            {{ currentUser.nama || "Rekan Tim" }} 👋
          </h2>
          <p class="text-sm md:text-xs text-white/80 mt-1">
            Unit:
            <span class="font-semibold underline">{{
              currentUser.unit || "NHP"
            }}</span>
            • Pantau aktivitas & tugas harian Anda di sini.
          </p>
        </div>

        <!-- RUNNING TEXT BIO + EMOTICON ANIMASI KHAS TELEGRAM/WA -->
        <div class="mt-2 flex items-center gap-2">
          <!-- Kotak Running Text Bersih -->
          <div
            @click="openBioModal"
            class="flex-1 bg-black/25 hover:bg-black/35 backdrop-blur-md rounded-2xl px-4 py-2 flex items-center border border-white/20 cursor-pointer transition-all overflow-hidden"
            title="Klik untuk memperbarui status Anda"
          >
            <div class="overflow-hidden whitespace-nowrap w-full">
              <div
                class="inline-block animate-marquee pl-full text-sm md:text-xs font-semibold text-white/95"
              >
                {{ cleanedBioText }}
              </div>
            </div>
          </div>

          <!-- Emoticon Animasi Dinamis Bergaya Telegram / WhatsApp -->
          <div
            @click="openBioModal"
            class="shrink-0 text-4xl md:text-3xl cursor-pointer hover:scale-125 transition-transform drop-shadow-md select-none px-1 flex items-center justify-center"
            :class="emojiAnimationClass"
            title="Klik untuk ganti emoticon status"
          >
            {{ activeEmoji }}
          </div>
        </div>
      </div>
    </div>

    <!-- 4. AKTIVITAS TERKINI (JADWAL / TUGAS TERDEKAT STAF) -->
    <div
      class="glass-card bg-white/90 dark:bg-slate-900/90 rounded-3xl p-4 mx-4 md:p-5 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3 relative z-10"
    >
      <div class="flex items-center justify-between">
        <h3
          class="text-base md:text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5"
        >
          <i class="fa-solid fa-clock-rotate-left text-emerald-600"></i>
          Tugas Deadline Terdekat Anda
        </h3>
        <button
          @click="navTo('progress')"
          class="text-sm md:text-xs font-semibold text-theme hover:underline"
        >
          Lihat Semua
        </button>
      </div>

      <div class="space-y-2">
        <div
          v-for="task in myUpcomingTasks"
          :key="task.id"
          @click="navTo('progress')"
          class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-sm md:text-xs cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <div class="overflow-hidden">
            <p
              class="font-semibold text-slate-800 dark:text-slate-200 truncate"
            >
              {{ task.title || task.Judul }}
            </p>
            <p class="text-xs md:text-xs text-slate-400">
              DL: {{ task.deadline || task.Deadline || "-" }} • Unit
              {{ task.unit || task.Unit }}
            </p>
          </div>
          <span
            class="px-2.5 py-1 rounded-full text-xs md:text-xs font-semibold shrink-0 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
          >
            {{ task.progress || 0 }}%
          </span>
        </div>

        <div
          v-if="myUpcomingTasks.length === 0"
          class="text-center py-6 text-slate-400 text-sm md:text-xs"
        >
          <i class="fa-solid fa-circle-check text-xl mb-1 opacity-40"></i>
          <p>Tidak ada tugas mendekati deadline.</p>
        </div>
      </div>
    </div>

    <!-- 2. RINGKASAN LAPORAN OPERASIONAL -->
    <div>
      <h3
        class="text-sm md:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 px-1 flex items-center gap-1.5"
      >
        <i class="fa-solid fa-[#25eba1] fa-chart-pie"></i>
        Ringkasan Aktivitas Anda
      </h3>

      <!-- grid-cols-4 langsung aktif dari mobile hingga desktop -->
      <div class="grid grid-cols-4 gap-2 sm:gap-3">
        <!-- Kartu 1: Tugas Berjalan -->
        <div
          @click="navTo('progress')"
          class="glass-card bg-white/90 dark:bg-slate-900/90 p-2.5 sm:p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1.5 sm:gap-3 cursor-pointer hover:border-blue-500/40 transition-all"
        >
          <div
            class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm sm:text-base shrink-0"
          >
            <i class="fa-solid fa-list-check"></i>
          </div>
          <div class="overflow-hidden w-full">
            <p
              class="text-[10px] sm:text-xs font-semibold text-slate-400 truncate"
            >
              Tugas Aktif
            </p>
            <p
              class="text-sm sm:text-base md:text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight"
            >
              {{ myActiveTasksCount }}
            </p>
          </div>
        </div>

        <!-- Kartu 2: Tugas Selesai -->
        <div
          @click="navTo('progress')"
          class="glass-card bg-white/90 dark:bg-slate-900/90 p-2.5 sm:p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1.5 sm:gap-3 cursor-pointer hover:border-emerald-500/40 transition-all"
        >
          <div
            class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm sm:text-base shrink-0"
          >
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <div class="overflow-hidden w-full">
            <p
              class="text-[10px] sm:text-xs font-semibold text-slate-400 truncate"
            >
              Tugas Selesai
            </p>
            <p
              class="text-sm sm:text-base md:text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight"
            >
              {{ myCompletedTasksCount }}
            </p>
          </div>
        </div>

        <!-- Kartu 3: Aduan Menunggu -->
        <div
          @click="navTo('aduan')"
          class="glass-card bg-white/90 dark:bg-slate-900/90 p-2.5 sm:p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1.5 sm:gap-3 cursor-pointer hover:border-amber-500/40 transition-all"
        >
          <div
            class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-sm sm:text-base shrink-0"
          >
            <i class="fa-solid fa-headset"></i>
          </div>
          <div class="overflow-hidden w-full">
            <p
              class="text-[10px] sm:text-xs font-semibold text-slate-400 truncate"
            >
              Aduan Open
            </p>
            <p
              class="text-sm sm:text-base md:text-sm font-semibold text-amber-600 dark:text-amber-400 leading-tight"
            >
              {{ openTicketsCount }}
            </p>
          </div>
        </div>

        <!-- Kartu 4: Catatan/Notes -->
        <div
          @click="navTo('notes')"
          class="glass-card bg-white/90 dark:bg-slate-900/90 p-2.5 sm:p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1.5 sm:gap-3 cursor-pointer hover:border-purple-500/40 transition-all"
        >
          <div
            class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm sm:text-base shrink-0"
          >
            <i class="fa-solid fa-note-sticky"></i>
          </div>
          <div class="overflow-hidden w-full">
            <p
              class="text-[10px] sm:text-xs font-semibold text-slate-400 truncate"
            >
              Notes Tim
            </p>
            <p
              class="text-sm sm:text-base md:text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight"
            >
              {{ notesCount }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="p-4 md:p-6 rounded-3xl space-y-4">
      <div
        class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3"
      >
        <div>
          <h4
            class="text-base md:text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2"
          >
            <i class="fa-solid fa-shapes text-theme"></i>
            Akses Modul & Fitur
          </h4>
        </div>
      </div>

      <!-- GRID 3 KOLOM / RESPONSIVE ALAH FLIP (FLOATING ICON EFFECT) -->
      <div
        class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-3 gap-y-7 pt-6"
      >
        <button
          v-for="menu in filteredFeatures"
          :key="menu.id"
          @click="navigateTo(menu.id)"
          class="glass-card group flex flex-col items-center justify-start p-3 pt-2 pb-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-700/60 shadow-xs hover:shadow-md transition-all cursor-pointer relative"
        >
          <!-- Badge indikator jika ada fitur baru -->
          <span
            v-if="menu.badge"
            class="absolute -top-4 -right-1 bg-rose-500 text-white font-semibold text-[9px] px-1.5 py-0.2 rounded-full uppercase shadow-xs z-20"
          >
            {{ menu.badge }}
          </span>

          <!-- Floating Icon Container (Mengambang Keluar ke Atas) -->
          <div
            class="-mt-7 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-xl md:text-2xl mb-1.5 transition-transform duration-200 group-hover:-translate-y-1 group-hover:scale-105 shadow-md z-10"
            :class="menu.bgClass || 'bg-theme/10 text-theme'"
          >
            <i :class="menu.icon"></i>
          </div>

          <!-- Label Menu -->
          <span
            class="text-xs md:text-xs font-semibold text-slate-700 dark:text-slate-200 text-center leading-tight group-hover:text-theme line-clamp-2"
          >
            {{ menu.label }}
          </span>
        </button>
      </div>
    </div>

    <!-- POPUP MODAL GANTI BIO / STATUS PROFIL -->
    <Teleport to="body">
      <div
        v-if="isBioModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
        @click.self="isBioModalOpen = false"
      >
        <div
          class="w-full max-w-md glass-card bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-100 dark:border-slate-800"
        >
          <div
            class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800"
          >
            <h3
              class="font-semibold text-slate-800 dark:text-slate-100 text-base md:text-sm flex items-center gap-2"
            >
              <i class="fa-solid fa-comment-dots text-emerald-600"></i>
              <span>Ganti Status Harian</span>
            </h3>
            <button
              @click="isBioModalOpen = false"
              type="button"
              class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <form @submit.prevent="saveBio" class="space-y-4 text-sm md:text-xs">
            <!-- Pilihan Emoticon Ekspresif (Hanya Pilih 1, Tidak Masuk ke Teks) -->
            <div>
              <label
                class="block text-slate-500 dark:text-slate-400 font-semibold mb-1"
              >
                Pilih Emoticon Ekspresif:
              </label>
              <div
                class="flex items-center gap-1.5 overflow-x-auto pb-2 [scrollbar-width:none]"
              >
                <button
                  v-for="emoji in EXPRESSIVE_EMOJIS"
                  :key="emoji"
                  type="button"
                  @click="selectEmoji(emoji)"
                  class="w-9 h-9 rounded-xl text-base flex items-center justify-center shrink-0 border transition-all active:scale-95 cursor-pointer"
                  :class="
                    selectedEmoji === emoji
                      ? 'bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-200/60'
                  "
                >
                  {{ emoji }}
                </button>
              </div>
            </div>

            <!-- Form Textarea Status (Bersih tanpa tumpukan emoticon) -->
            <div>
              <label
                class="block text-slate-500 dark:text-slate-400 font-semibold mb-1"
              >
                Teks Status:
              </label>
              <textarea
                v-model="bioFormText"
                rows="3"
                placeholder="Tuliskan status harian Anda..."
                class="w-full glass-input rounded-xl p-3 text-sm md:text-xs outline-none text-slate-800 dark:text-slate-100 resize-none"
              ></textarea>
            </div>

            <!-- Modal Footer Controls -->
            <div
              class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800"
            >
              <button
                @click="isBioModalOpen = false"
                type="button"
                :disabled="isSavingBio"
                class="px-4 py-2.5 md:py-2 rounded-xl font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSavingBio"
                class="px-5 py-2.5 md:py-2 rounded-xl font-semibold bg-button text-white shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <i
                  v-if="isSavingBio"
                  class="fa-solid fa-spinner fa-spin text-xs"
                ></i>
                <span>{{
                  isSavingBio ? "Menyimpan..." : "Simpan Status"
                }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { store } from "../store/index.js";
import { api } from "../services/api.js";

const currentUser = computed(() => store.currentUser || {});

const EXPRESSIVE_EMOJIS = [
  "🚀",
  "🔥",
  "💡",
  "🎯",
  "⚡",
  "💪",
  "😎",
  "☕",
  "💻",
  "✨",
  "📊",
  "✅",
  "🎉",
  "🌟",
  "😏",
  "👍",
  "🙌",
  "📝",
  "🌈",
  "🏆",
];

const isBioModalOpen = ref(false);
const bioFormText = ref("");
const selectedEmoji = ref("🚀");
const isSavingBio = ref(false);

const rawBioText = computed(() => {
  return (
    currentUser.value.Bio ||
    currentUser.value.bio ||
    "lagi fokus, jangan diganggu 🚀"
  );
});

// MEMISAHKAN TEKS DARI EMOJI UNTUK RUNNING TEXT
const cleanedBioText = computed(() => {
  const emojiRegex =
    /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
  const clean = rawBioText.value.replace(emojiRegex, "").trim();
  return clean || rawBioText.value;
});

// MENGAMBIL EMOJI AKTIF
const activeEmoji = computed(() => {
  const emojiRegex =
    /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
  const matches = rawBioText.value.match(emojiRegex);
  return matches && matches.length > 0 ? matches[matches.length - 1] : "🚀";
});

// KELAS ANIMASI BERDASARKAN KARAKTER EMOJI (GAYA TELEGRAM / WHATSAPP)
const emojiAnimationClass = computed(() => {
  const emoji = activeEmoji.value;

  // 1. Api / Roket / Kilat -> Efek Meluncur / Membal Cepat
  if (["🚀", "🔥", "⚡"].includes(emoji)) {
    return "tg-anim-launch";
  }
  // 2. Senyum / Sinis / Keren -> Efek Geleng-geleng / Wiggle Unyu
  if (["😏", "😎", "🙌", "👍"].includes(emoji)) {
    return "tg-anim-wiggle";
  }
  // 3. Kopi / Komputer / Target -> Efek Detak Jantung / Pulse Jelas
  if (["☕", "💻", "🎯", "💡"].includes(emoji)) {
    return "tg-anim-heartbeat";
  }
  // 4. Bintang / Binar / Pelangi -> Efek Berputar & Bersinar
  if (["✨", "🌟", "🌈", "🎉"].includes(emoji)) {
    return "tg-anim-spin-glow";
  }
  // Default Animasi Bounce Telegram
  return "tg-anim-bounce";
});

const openBioModal = () => {
  // Ambil teks bersih tanpa emoji untuk ditaruh di textarea
  bioFormText.value = cleanedBioText.value;
  // Set emoticon terpilih saat ini
  selectedEmoji.value = activeEmoji.value;
  isBioModalOpen.value = true;
};

// Fungsi memilih emoticon (TIDAK menambahkan ke teks)
const selectEmoji = (emoji) => {
  selectedEmoji.value = emoji;
};

const saveBio = async () => {
  const myId = currentUser.value?.id;
  if (!myId) {
    store.addNotification(
      "Peringatan",
      "Sesi login tidak ditemukan",
      "warning",
    );
    return;
  }

  isSavingBio.value = true;
  try {
    // Gabungkan teks bersih dan 1 emoticon pilihan di akhir
    const finalBio =
      `${bioFormText.value.trim()} ${selectedEmoji.value}`.trim();

    const payload = {
      bio: finalBio,
      Bio: finalBio,
    };

    const res = await api.updateData("Users", myId, payload);
    if (res.success || res) {
      const updatedUser = {
        ...store.currentUser,
        ...payload,
      };
      store.setCurrentUser(updatedUser);
      store.addNotification(
        "Berhasil",
        "Status bio berhasil diperbarui!",
        "success",
      );
      isBioModalOpen.value = false;
    } else {
      store.addNotification(
        "Gagal",
        "Gagal memperbarui status bio.",
        "warning",
      );
    }
  } catch (err) {
    console.error("Gagal simpan bio:", err);
    store.addNotification("Error", err.message, "warning");
  } finally {
    isSavingBio.value = false;
  }
};

const greetingTime = computed(() => {
  const hour = new Date().getHours();
  if (hour >= 3 && hour < 11) return "Pagi";
  if (hour >= 11 && hour < 15) return "Siang";
  if (hour >= 15 && hour < 18) return "Sore";
  return "Malam";
});

const skyTheme = computed(() => {
  const hour = new Date().getHours();

  if (hour >= 3 && hour < 11) {
    return {
      background: "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600",
      glow: "bg-amber-300",
      celestialClass:
        "bg-amber-400/30 text-amber-200 border border-amber-300/40",
      celestialIcon: "fa-solid fa-sun",
    };
  }

  if (hour >= 11 && hour < 15) {
    return {
      background: "bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600",
      glow: "bg-yellow-200",
      celestialClass:
        "bg-yellow-300/40 text-yellow-100 border border-yellow-200/50",
      celestialIcon: "fa-solid fa-sun-bright",
    };
  }

  if (hour >= 15 && hour < 18) {
    return {
      background: "bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700",
      glow: "bg-amber-400",
      celestialClass:
        "bg-orange-400/30 text-amber-200 border border-amber-200/40",
      celestialIcon: "fa-solid fa-sun",
    };
  }

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

const openTicketsCount = computed(() => {
  const aduanList = store.db?.aduanList || store.aduanList || [];
  return aduanList.filter((a) => a.status === "Open").length;
});

const notesCount = computed(() => {
  const notes = store.db?.notes || store.notes || [];
  return notes.length;
});

const myUpcomingTasks = computed(() => {
  return myTasks.value
    .filter((t) => (t.status || t.Status) !== "Completed")
    .slice(0, 3);
});

const allSidebarFeatures = [
  {
    id: "summary",
    label: "Rekap Bisnis",
    icon: "fa-solid fa-chart-line",
    bgClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "notes",
    label: "Notes & Catatan",
    icon: "fa-solid fa-note-sticky",
    bgClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    id: "unit-NHP",
    label: "Nur Hidayah Press",
    icon: "fa-solid fa-building",
    bgClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    id: "unit-NHC",
    label: "Nusaragam x Pengaosan",
    icon: "fa-solid fa-building-user",
    bgClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  },
  {
    id: "unit-KG",
    label: "Karta Grafika",
    icon: "fa-solid fa-city",
    bgClass: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  },
  {
    id: "progress",
    label: "Kanban Progress",
    icon: "fa-solid fa-bars-progress",
    bgClass: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  {
    id: "digmar",
    label: "Socmed Analytics",
    icon: "fa-solid fa-share-nodes",
    bgClass: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  },
  {
    id: "leads",
    label: "Leads & Campaign",
    icon: "fa-solid fa-users-rays",
    bgClass: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
  {
    id: "promo",
    label: "Marketing Budget",
    icon: "fa-solid fa-wallet",
    bgClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
  {
    id: "spv-report",
    label: "Laporan Divisi",
    icon: "fa-solid fa-file-signature",
    bgClass: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
  },
  {
    id: "daily-report",
    label: "Laporan Harian",
    icon: "fa-solid fa-file-invoice",
    bgClass: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    badge: "Baru",
  },
  {
    id: "aduan",
    label: "Customer Support",
    icon: "fa-solid fa-headset",
    bgClass: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  {
    id: "report",
    label: "Laporan Executive",
    icon: "fa-solid fa-file-invoice-dollar",
    bgClass: "bg-emerald-600/10 text-emerald-700 dark:text-emerald-300",
  },
  {
    id: "master-data",
    label: "Master Data",
    icon: "fa-solid fa-sliders",
    bgClass: "bg-slate-500/10 text-slate-600 dark:text-slate-300",
  },
  {
    id: "users",
    label: "Akses Pengguna",
    icon: "fa-solid fa-users-gear",
    bgClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
];

// Menyaring menu berdasarkan hak akses pengguna
const filteredFeatures = computed(() => {
  const role = String(
    store.currentUser?.role || store.currentUser?.Role || "",
  ).toUpperCase();
  if (role === "SUPERADMIN") return allSidebarFeatures;

  const userPerms = store.currentUser?.permissions || {};
  return allSidebarFeatures.filter((menu) => {
    return userPerms[menu.id]?.access;
  });
});

const navigateTo = (pageId) => {
  store.currentPage = pageId;
};
</script>

<style scoped>
/* 1. ANIMASI RUNNING TEXT (MARQUEE) */
@keyframes marquee {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.animate-marquee {
  display: inline-block;
  animation: marquee 16s linear infinite;
}

.animate-marquee:hover {
  animation-play-state: paused;
}

/* 2. SPESIFIKASI ANIMASI EMOTICON BERGAYA TELEGRAM / WHATSAPP */

/* A. Membal Elastis (Bounce TG) */
@keyframes tgBounce {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  30% {
    transform: translateY(-6px) scale(1.15, 0.9);
  }
  50% {
    transform: translateY(0) scale(0.9, 1.1);
  }
  70% {
    transform: translateY(-3px) scale(1.05);
  }
}
.tg-anim-bounce {
  animation: tgBounce 1.8s ease-in-out infinite;
}

/* B. Meluncur / Mendorong (Launch) untuk Roket/Api */
@keyframes tgLaunch {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(3px, -5px) scale(1.18);
  }
}
.tg-anim-launch {
  animation: tgLaunch 1.4s ease-in-out infinite;
}

/* C. Geleng-geleng Unyu (Wiggle) untuk Senyum/Sinis */
@keyframes tgWiggle {
  0%,
  100% {
    transform: rotate(0deg) scale(1);
  }
  25% {
    transform: rotate(-12deg) scale(1.1);
  }
  75% {
    transform: rotate(12deg) scale(1.1);
  }
}
.tg-anim-wiggle {
  animation: tgWiggle 1.5s ease-in-out infinite;
}

/* D. Detak Jantung / Pompa (Heartbeat) untuk Kopi/Komputer */
@keyframes tgHeartbeat {
  0%,
  100% {
    transform: scale(1);
  }
  14% {
    transform: scale(1.25);
  }
  28% {
    transform: scale(1);
  }
  42% {
    transform: scale(1.2);
  }
  70% {
    transform: scale(1);
  }
}
.tg-anim-heartbeat {
  animation: tgHeartbeat 1.6s ease-in-out infinite;
}

/* E. Berputar & Memancar (Spin & Glow) untuk Bintang/Sparkle */
@keyframes tgSpinGlow {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.2);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}
.tg-anim-spin-glow {
  animation: tgSpinGlow 3s ease-in-out infinite;
}
</style>
