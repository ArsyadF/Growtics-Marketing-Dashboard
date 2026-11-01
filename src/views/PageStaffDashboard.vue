<!-- src/views/PageStaffDashboard.vue -->
<template>
  <div class="flex flex-col gap-4 pb-12 md:gap-6 md:pb-6">
    <!-- Sapaan -->
    <div
      class="ui-staff-greeting relative overflow-hidden -mb-16 pt-5 px-5 pb-16 bg-theme-gradient"
    >
      <div class="absolute inset-0 pointer-events-none opacity-25">
        <i class="fa-solid fa-cloud text-white text-6xl absolute top-2 right-12 animate-pulse"></i>
        <i class="fa-solid fa-cloud text-white text-4xl absolute bottom-14 right-36 opacity-75"></i>
        <i class="fa-solid fa-cloud text-white text-3xl absolute top-8 left-1/3 opacity-50"></i>
      </div>

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

      <div class="relative z-10 flex flex-col gap-4">
        <div>
          <span class="ui-staff-role inline-block py-1 px-2.5">
            {{ currentUser.role || "Staff Workspace" }}
          </span>

          <h2 class="ui-staff-salutation mt-2">Selamat {{ greetingTime }}</h2>

          <h2 class="ui-staff-name">{{ currentUser.nama || "Rekan Tim" }} 👋</h2>

          <p class="ui-staff-description mt-1">
            Unit:
            <span class="font-semibold underline">
              {{ currentUser.unit || "NHP" }}
            </span>
            • Pantau aktivitas & tugas harian Anda di sini.
          </p>
        </div>

        <div class="flex items-center gap-2 min-w-0">
          <button
            type="button"
            class="ui-staff-status flex items-center flex-1 min-w-0 overflow-hidden py-2 px-4 text-left glass-hover"
            title="Klik untuk memperbarui status Anda"
            @click="openBioModal"
          >
            <span class="overflow-hidden whitespace-nowrap w-full">
              <span class="inline-block animate-marquee pl-full">
                {{ cleanedBioText }}
              </span>
            </span>
          </button>

          <button
            type="button"
            class="ui-staff-emoji flex items-center justify-center px-1 shrink-0"
            :class="emojiAnimationClass"
            title="Klik untuk ganti emoticon status"
            @click="openBioModal"
          >
            {{ activeEmoji }}
          </button>
        </div>
      </div>
    </div>

    <!-- Deadline -->
    <div class="ui-card ui-card-large relative z-10 mx-4 flex flex-col gap-4">
      <div class="flex items-center justify-between gap-3 min-w-0">
        <h3 class="ui-title">
          <i class="fa-solid fa-clock-rotate-left ui-text-success"></i>
          Tugas Deadline Terdekat
        </h3>

        <button type="button" class="ui-link" @click="navigateTo('progress')">Lihat Semua</button>
      </div>

      <div class="flex flex-col gap-2">
        <button
          v-for="task in myUpcomingTasks"
          :key="task.id"
          type="button"
          class="ui-list-item ui-list-item-action"
          @click="navigateTo('progress')"
        >
          <span class="flex-1 min-w-0">
            <span class="block ui-text-strong ui-truncate">
              {{ task.title || task.Judul }}
            </span>
            <span class="block ui-caption">
              DL: {{ task.deadline || task.Deadline || "-" }} • Unit
              {{ task.unit || task.Unit }}
            </span>
          </span>

          <span class="ui-badge ui-badge-success ui-badge-pill"> {{ task.progress || 0 }}% </span>
        </button>

        <div v-if="myUpcomingTasks.length === 0" class="ui-empty">
          <i class="fa-solid fa-circle-check"></i>
          <p>Tidak ada tugas mendekati deadline.</p>
        </div>
      </div>
    </div>

    <!-- Ringkasan -->
    <div>
      <h3 class="ui-section-label">
        <i class="fa-solid fa-chart-pie"></i>
        Ringkasan Aktivitas Anda
      </h3>

      <div class="grid grid-cols-4 gap-2 sm:gap-3">
        <button
          type="button"
          class="ui-stat-card flex flex-col items-center gap-1.5 min-w-0 p-2.5 text-center sm:flex-row sm:gap-3 sm:p-3.5 sm:text-left"
          @click="navigateTo('progress', 'in progress')"
        >
          <span class="ui-icon ui-stat-icon w-8 h-8 sm:w-10 sm:h-10 ui-icon-info">
            <i class="fa-solid fa-list-check"></i>
          </span>
          <span class="overflow-hidden w-full">
            <span class="ui-stat-label block overflow-hidden text-ellipsis whitespace-nowrap"
              >Tugas Aktif</span
            >
            <span class="ui-stat-value block">{{ myActiveTasksCount }}</span>
          </span>
        </button>

        <button
          type="button"
          class="ui-stat-card flex flex-col items-center gap-1.5 min-w-0 p-2.5 text-center sm:flex-row sm:gap-3 sm:p-3.5 sm:text-left"
          @click="navigateTo('progress', 'completed')"
        >
          <span class="ui-icon ui-stat-icon w-8 h-8 sm:w-10 sm:h-10 ui-icon-success">
            <i class="fa-solid fa-circle-check"></i>
          </span>
          <span class="overflow-hidden w-full">
            <span class="ui-stat-label block overflow-hidden text-ellipsis whitespace-nowrap"
              >Tugas Selesai</span
            >
            <span class="ui-stat-value block">{{ myCompletedTasksCount }}</span>
          </span>
        </button>

        <button
          type="button"
          class="ui-stat-card flex flex-col items-center gap-1.5 min-w-0 p-2.5 text-center sm:flex-row sm:gap-3 sm:p-3.5 sm:text-left"
          @click="navigateTo('aduan')"
        >
          <span class="ui-icon ui-stat-icon w-8 h-8 sm:w-10 sm:h-10 ui-icon-danger">
            <i class="fa-solid fa-headset"></i>
          </span>
          <span class="overflow-hidden w-full">
            <span class="ui-stat-label block overflow-hidden text-ellipsis whitespace-nowrap"
              >Aduan Open</span
            >
            <span class="ui-stat-value block">{{ openTicketsCount }}</span>
          </span>
        </button>

        <button
          type="button"
          class="ui-stat-card flex flex-col items-center gap-1.5 min-w-0 p-2.5 text-center sm:flex-row sm:gap-3 sm:p-3.5 sm:text-left"
          @click="navigateTo('notes')"
        >
          <span class="ui-icon ui-stat-icon w-8 h-8 sm:w-10 sm:h-10 ui-icon-warning">
            <i class="fa-solid fa-note-sticky"></i>
          </span>
          <span class="overflow-hidden w-full">
            <span class="ui-stat-label block overflow-hidden text-ellipsis whitespace-nowrap"
              >Notes</span
            >
            <span class="ui-stat-value block">{{ notesCount }}</span>
          </span>
        </button>
      </div>
    </div>

    <!-- Modul -->
    <div class="ui-card ui-card-flush bg-transparent shadow-none">
      <h4 class="ui-title">
        <i class="fa-solid fa-shapes"></i>
        Akses Modul & Fitur
      </h4>

      <div
        class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-6 gap-y-16 pt-12"
      >
        <button
          v-for="menu in filteredFeatures"
          :key="menu.id"
          type="button"
          class="ui-module-card relative flex flex-col items-center justify-start w-full pt-3 px-1 pb-3.5"
          @click="navigateTo(menu.id)"
        >
          <span
            v-if="menu.badge"
            class="ui-module-badge absolute -top-8 right-1 z-20 py-0.5 px-1.5"
          >
            {{ menu.badge }}
          </span>

          <span
            class="ui-module-icon z-10 flex items-center justify-center w-12 h-12 -mt-12 mb-1.5 md:w-14 md:h-14"
          >
            <img :src="menu.iconImg" :alt="menu.label" class="w-full h-full object-contain" />
          </span>

          <span class="ui-module-label line-clamp-2 overflow-hidden text-center">{{
            menu.label
          }}</span>
        </button>
      </div>
    </div>

    <!-- Modal status -->
    <Teleport to="body">
      <div v-if="isBioModalOpen" class="ui-modal-overlay" @click.self="isBioModalOpen = false">
        <div
          class="ui-modal ui-modal-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="staff-bio-title"
        >
          <div class="ui-modal-header">
            <h3 id="staff-bio-title" class="ui-title">
              <i class="fa-solid fa-comment-dots ui-text-success"></i>
              Ganti Status Harian
            </h3>

            <button
              type="button"
              class="ui-close"
              aria-label="Tutup modal status"
              @click="isBioModalOpen = false"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <form class="ui-modal-body flex flex-col gap-4" @submit.prevent="saveBio">
            <div>
              <label class="ui-label">Pilih Emoticon Ekspresif:</label>

              <div class="flex items-center gap-2 min-w-0 overflow-x-auto no-scrollbar pb-2">
                <button
                  v-for="emoji in EXPRESSIVE_EMOJIS"
                  :key="emoji"
                  type="button"
                  class="ui-option ui-option-emoji"
                  :class="{ 'is-active': selectedEmoji === emoji }"
                  :aria-pressed="selectedEmoji === emoji"
                  @click="selectEmoji(emoji)"
                >
                  {{ emoji }}
                </button>
              </div>
            </div>

            <div class="min-w-0">
              <label for="staff-bio" class="ui-label"> Teks Status: </label>
              <textarea
                id="staff-bio"
                v-model="bioFormText"
                rows="3"
                class="ui-input"
                placeholder="Tuliskan status harian Anda..."
              ></textarea>
            </div>

            <div class="ui-actions flex flex-wrap items-center gap-2 justify-end ui-divider pt-3">
              <button
                type="button"
                class="ui-button ui-button-secondary"
                :disabled="isSavingBio"
                @click="isBioModalOpen = false"
              >
                Batal
              </button>

              <button
                type="submit"
                class="ui-button ui-button-primary ui-button-shadow"
                :disabled="isSavingBio"
              >
                <i v-if="isSavingBio" class="fa-solid fa-spinner fa-spin"></i>
                {{ isSavingBio ? "Menyimpan..." : "Simpan Status" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { store } from "../store/index.js";
import { api } from "../services/api.js";
import ModalHakAkses from "../components/modals/ModalHakAkses.vue";

const canViewPage = computed(() => {
  const user = store.currentUser;
  if (!user) return false;

  const role = String(user.role || "").toUpperCase();
  if (role === "SUPERADMIN") return true;
  return store.canAccessPage("main");
});

const currentUser = computed(() => store.currentUser || {});

const isLoadingDashboard = ref(false);
const props = defineProps({
  isOpen: { type: Boolean, default: false },
  activePage: { type: String, default: "main" },
});

const emit = defineEmits(["close-sidebar", "change-page", "open-login"]);

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

// State untuk menyimpan jumlah note aktual
const myNotesList = ref([]);

const rawBioText = computed(
  () =>
    currentUser.value.Bio ||
    currentUser.value.bio ||
    "Stay on focus, don't give up! 🚀",
);

const cleanedBioText = computed(() => {
  const emojiRegex =
    /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
  const clean = rawBioText.value.replace(emojiRegex, "").trim();
  return clean || rawBioText.value;
});

const activeEmoji = computed(() => {
  const emojiRegex =
    /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
  const matches = rawBioText.value.match(emojiRegex);
  return matches && matches.length > 0 ? matches[matches.length - 1] : "🚀";
});

const emojiAnimationClass = computed(() => {
  const emoji = activeEmoji.value;
  if (["🚀", "🔥", "⚡"].includes(emoji)) return "tg-anim-launch";
  if (["😏", "😎", "🙌", "👍"].includes(emoji)) return "tg-anim-wiggle";
  if (["☕", "💻", "🎯", "💡"].includes(emoji)) return "tg-anim-heartbeat";
  if (["✨", "🌟", "🌈", "🎉"].includes(emoji)) return "tg-anim-spin-glow";
  return "tg-anim-bounce";
});

const directOpenTicketsCount = ref(0);

const fetchDashboardData = async () => {
  if (!canViewPage.value) return;
  isLoadingDashboard.value = true;
  try {
    const currentUserId =
      currentUser.value?.email || currentUser.value?.id || "guest";

    if (api && api.getDashboardSummary) {
      const summary = await api.getDashboardSummary(currentUserId);

      // Masukkan ke state reaktif penampung dashboard
      myNotesList.value = new Array(summary.notesCount); // Cukup simpan jumlahnya untuk .length

      // Simpan list program ringan untuk widget deadline terdekat
      if (!store.db) store.db = {};
      store.db.programs = summary.upcomingList;

      directOpenTicketsCount.value = summary.openTicketsCount || 0;

      // Simpan variabel hitungan langsung jika ingin dipakai di template
      // (Atau biarkan computed property membaca dari store yang sudah diringkas)
    }
  } catch (err) {
    console.error("Gagal memuat data dashboard:", err);
  } finally {
    isLoadingDashboard.value = false;
  }
};

const openBioModal = () => {
  bioFormText.value = cleanedBioText.value;
  selectedEmoji.value = activeEmoji.value;
  isBioModalOpen.value = true;
};

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
    const finalBio =
      `${bioFormText.value.trim()} ${selectedEmoji.value}`.trim();
    const payload = { bio: finalBio, Bio: finalBio };

    const res = await api.updateData("Users", myId, payload);
    if (res.success || res) {
      store.setCurrentUser({ ...store.currentUser, ...payload });
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
  if (hour >= 3 && hour < 11)
    return {
      glow: "bg-amber-300",
      celestialClass:
        "bg-amber-400/30 text-amber-200 border border-amber-300/40",
      celestialIcon: "fa-solid fa-sun",
    };
  if (hour >= 11 && hour < 15)
    return {
      glow: "bg-yellow-200",
      celestialClass:
        "bg-yellow-300/40 text-yellow-100 border border-yellow-200/50",
      celestialIcon: "fa-solid fa-sun-bright",
    };
  if (hour >= 15 && hour < 18)
    return {
      glow: "bg-amber-400",
      celestialClass:
        "bg-orange-400/30 text-amber-200 border border-amber-200/40",
      celestialIcon: "fa-solid fa-sun",
    };
  return {
    glow: "bg-indigo-400",
    celestialClass:
      "bg-indigo-400/20 text-yellow-200 border border-indigo-300/30",
    celestialIcon: "fa-solid fa-moon",
  };
});

const navTo = (pageId, filterStatus = null) => {
  store.activeProgressFilter = filterStatus || "all";
  store.currentPage = pageId;
};

const isSpvOrAdmin = computed(() => {
  const role = String(
    store.currentUser?.role || store.currentUser?.Role || "",
  ).toUpperCase();
  return ["SUPERADMIN", "SPV", "ADMIN"].includes(role);
});

const myTasks = computed(() => {
  const allPrograms = store.db?.programs || store.programs || [];
  if (isSpvOrAdmin.value) return allPrograms;

  const myId = currentUser.value?.id || currentUser.value?.email;
  const myName = currentUser.value?.nama;

  return allPrograms.filter((p) => {
    const assignedIds = p.assignedPicIds || [];
    const assignedUsers = p.assignedUsers || [];
    const picName = p.picName || p.PIC || "";
    const isAssigned =
      assignedIds.includes(myId) ||
      (myName && assignedUsers.includes(myName)) ||
      (myName && picName.toLowerCase().includes(myName.toLowerCase()));
    return isAssigned || p.createdBy === myId;
  });
});

const myActiveTasksCount = computed(
  () =>
    myTasks.value.filter((t) => (t.status || t.Status) === "In Progress")
      .length,
);
const myCompletedTasksCount = computed(
  () =>
    myTasks.value.filter((t) => (t.status || t.Status) === "Completed").length,
);
const openTicketsCount = computed(
  () =>
    directOpenTicketsCount.value ||
    (store.db?.aduanList || store.aduanList || []).filter(
      (a) => a.status === "Open",
    ).length,
);

// MENGAMBIL JUMLAH CATATAN SECARA REAKTIF & AKURAT
// const fetchNotesCount = async () => {
//   const currentUserId =
//     currentUser.value?.email || currentUser.value?.id || "guest";
//   try {
//     if (api && api.getUserNotesCountOnly) {
//       const res = await api.getUserNotesCountOnly(currentUserId);
//       myNotesList.value = res || [];
//     } else if (api && api.getUserNotes) {
//       const res = await api.getUserNotes(currentUserId);
//       myNotesList.value = res || [];
//     } else {
//       myNotesList.value = store.db?.notes || store.notes || [];
//     }
//   } catch (err) {
//     myNotesList.value = store.db?.notes || store.notes || [];
//   }
// };

const fetchNotesCount = async () => {
  const currentUserId =
    currentUser.value?.email || currentUser.value?.id || "guest";
  try {
    // Gunakan fungsi khusus yang tidak membawa beban gambar/content besar
    if (api && api.getUserNotesCountOnly) {
      const res = await api.getUserNotesCountOnly(currentUserId);
      myNotesList.value = res || [];
    } else if (api && api.getUserNotes) {
      const res = await api.getUserNotes(currentUserId);
      myNotesList.value = res || [];
    } else {
      myNotesList.value = store.db?.notes || store.notes || [];
    }
  } catch (err) {
    myNotesList.value = store.db?.notes || store.notes || [];
  }
};

const notesCount = computed(() => myNotesList.value.length);

const myUpcomingTasks = computed(() =>
  myTasks.value
    .filter((t) => (t.status || t.Status) !== "Completed")
    .slice(0, 3),
);

// const allSidebarFeatures = [
//   {
//     id: "daily-report",
//     label: "Laporan Harian",
//     icon: "fa-solid fa-file-invoice",
//     bgClass: "bg-rose-600 dark:bg-rose-500 text-white",
//     badge: "Wajib!",
//   },
//   {
//     id: "summary",
//     label: "Rekap Bisnis",
//     icon: "fa-solid fa-chart-line",
//     bgClass: "bg-emerald-600 dark:bg-emerald-500 text-white",
//   },
//   {
//     id: "notes",
//     label: "Notes",
//     icon: "fa-solid fa-note-sticky",
//     bgClass: "bg-amber-500 dark:bg-amber-500  text-white",
//   },
//   {
//     id: "unit-NHP",
//     label: "Nur Hidayah Press",
//     icon: "fa-solid fa-book-open",
//     bgClass: "bg-teal-600 dark:bg-teal-500 text-white",
//   },
//   {
//     id: "unit-NHC",
//     label: "Nusaragam",
//     icon: "fa-solid fa-shirt",
//     bgClass: "bg-amber-600 dark:bg-amber-500 text-white",
//   },
//   {
//     id: "unit-KG",
//     label: "Karta Grafika",
//     icon: "fa-solid fa-print",
//     bgClass: "bg-indigo-600 dark:bg-indigo-500 text-white",
//   },
//   {
//     id: "progress",
//     label: "Team Progress",
//     icon: "fa-solid fa-bars-progress",
//     bgClass: "bg-blue-600 dark:bg-blue-500 text-white",
//   },
//   {
//     id: "digmar",
//     label: "Socmed Analytics",
//     icon: "fa-solid fa-share-nodes",
//     bgClass: "bg-pink-600 dark:bg-pink-500 text-white",
//   },
//   {
//     id: "leads",
//     label: "Leads & Campaign",
//     icon: "fa-solid fa-users-rays",
//     bgClass: "bg-teal-600 dark:bg-teal-500 text-white",
//   },
//   {
//     id: "promo",
//     label: "Marketing Budget",
//     icon: "fa-solid fa-wallet",
//     bgClass: "bg-rose-600 dark:bg-rose-500 text-white",
//   },
//   {
//     id: "spv-report",
//     label: "Laporan Divisi",
//     icon: "fa-solid fa-file-signature",
//     bgClass: "bg-purple-600 dark:bg-purple-500 text-white",
//   },
//   {
//     id: "aduan",
//     label: "Customer Support",
//     icon: "fa-solid fa-headset",
//     bgClass: "bg-red-600 dark:bg-red-500 text-white",
//   },
//   {
//     id: "report",
//     label: "Laporan Executive",
//     icon: "fa-solid fa-file-invoice-dollar",
//     bgClass: "bg-emerald-700 dark:bg-emerald-800 text-white",
//   },
//   {
//     id: "master-data",
//     label: "Master Data",
//     icon: "fa-solid fa-sliders",
//     bgClass: "bg-slate-600 dark:bg-slate-500 text-white",
//   },
//   {
//     id: "users",
//     label: "Akses Pengguna",
//     icon: "fa-solid fa-users-gear",
//     bgClass: "bg-purple-600 dark:bg-purple-600 text-white",
//   },
// ];

const allSidebarFeatures = [
  {
    id: "daily-report",
    label: "Laporan Harian",
    iconImg: new URL("/icon/laporan_harian.png", import.meta.url).href,
    bgClass: "bg-rose-600/10 dark:bg-rose-500/20 text-rose-600",
    badge: "Wajib!",
  },
  {
    id: "summary",
    label: "Rekap Bisnis",
    iconImg: new URL("/icon/rekap_bisnis.png", import.meta.url).href,
    bgClass: "bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-600",
  },
  {
    id: "notes",
    label: "Notes",
    iconImg: new URL("/icon/notes.png", import.meta.url).href,
    bgClass: "bg-amber-500/10 dark:bg-amber-500/20 text-amber-600",
  },
  {
    id: "unit-NHP",
    label: "Nur Hidayah Press",
    iconImg: new URL("/icon/penerbitan.png", import.meta.url).href,
    bgClass: "bg-teal-600/10 dark:bg-teal-500/20 text-teal-600",
  },
  {
    id: "unit-NHC",
    label: "Nusaragam",
    iconImg: new URL("/icon/konveksi.png", import.meta.url).href,
    bgClass: "bg-amber-600/10 dark:bg-amber-500/20 text-amber-600",
  },
  {
    id: "unit-KG",
    label: "Karta Grafika",
    iconImg: new URL("/icon/percetakan.png", import.meta.url).href,
    bgClass: "bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600",
  },
  {
    id: "progress",
    label: "Team Progress",
    iconImg: new URL("/icon/progres.png", import.meta.url).href,
    bgClass: "bg-blue-600/10 dark:bg-blue-500/20 text-blue-600",
  },
  {
    id: "digmar",
    label: "Socmed Analytics",
    iconImg: new URL("/icon/medsos.png", import.meta.url).href,
    bgClass: "bg-pink-600/10 dark:bg-pink-500/20 text-pink-600",
  },
  {
    id: "leads",
    label: "Leads & Campaign",
    iconImg: new URL("/icon/campaign.png", import.meta.url).href,
    bgClass: "bg-teal-600/10 dark:bg-teal-500/20 text-teal-600",
  },
  {
    id: "promo",
    label: "Marketing Budget",
    iconImg: new URL("/icon/budget.png", import.meta.url).href,
    bgClass: "bg-rose-600/10 dark:bg-rose-500/20 text-rose-600",
  },
  {
    id: "spv-report",
    label: "Laporan Divisi",
    iconImg: new URL("/icon/executive_report.png", import.meta.url).href,
    bgClass: "bg-purple-600/10 dark:bg-purple-500/20 text-purple-600",
  },
  {
    id: "aduan",
    label: "Customer Support",
    iconImg: new URL("/icon/customer_care.png", import.meta.url).href,
    bgClass: "bg-red-600/10 dark:bg-red-500/20 text-red-600",
  },
  {
    id: "report",
    label: "Laporan Executive",
    iconImg: new URL("/icon/report.png", import.meta.url).href,
    bgClass: "bg-emerald-700/10 dark:bg-emerald-800/20 text-emerald-700",
  },
  {
    id: "master-data",
    label: "Master Data",
    iconImg: new URL("/icon/master_data.png", import.meta.url).href,
    bgClass: "bg-slate-600/10 dark:bg-slate-500/20 text-slate-600",
  },
  {
    id: "users",
    label: "Akses Pengguna",
    iconImg: new URL("/icon/user.png", import.meta.url).href,
    bgClass: "bg-purple-600/10 dark:bg-purple-600/20 text-purple-600",
  },
];

// const isMenuAllowed = (menuId) => {
//   // Jika belum login sama sekali, anggap terkunci
//   if (!store.currentUser) return true;

//   const role = String(
//     store.currentUser?.role || store.currentUser?.Role || "",
//   ).toUpperCase();

//   // Superadmin bebas akses semua
//   if (role === "SUPERADMIN") return true;

//   const userPerms = store.currentUser?.permissions || {};

//   // Jika permissions belum diset sama sekali, sesuaikan default-nya (misal: false jika ingin dikunci ketat)
//   return !!userPerms[menuId]?.access;
// };

const filteredFeatures = computed(() => {
  const role = String(
    store.currentUser?.role || store.currentUser?.Role || "",
  ).toUpperCase();
  if (role === "SUPERADMIN") return allSidebarFeatures;
  const userPerms = store.currentUser?.permissions || {};
  return allSidebarFeatures.filter((menu) => userPerms[menu.id]?.access);
});

const navigateTo = (pageId) => {
  store.currentPage = pageId;
};

// const filteredFeatures = computed(() => {
//   return allSidebarFeatures;
// });

// const isAlertModalOpen = ref(false);
// const alertMessage = ref("");

// const navigateTo = (pageId) => {
//   if (!isMenuAllowed(pageId)) {
//     isAlertModalOpen.value = true; // Munculkan pop-up kustom
//     return;
//   }
//   store.currentPage = pageId;
// };

onMounted(() => {
  if (canViewPage.value) {
    fetchNotesCount();
    fetchDashboardData();
  }
});

watch(
  () => store.currentUser,
  () => {
    fetchNotesCount();
    fetchDashboardData();
  },
  { deep: true },
);
</script>

<style scoped>
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


<!-- Gaya khusus komponen; layout utama berada di template. -->
<style scoped>
.ui-stat-card {
  border-radius: var(--ui-radius-card);
  background-color: var(--card-background);
  box-shadow: var(--ui-shadow-xs);
  cursor: pointer;
}

.ui-stat-label {
  color: var(--ui-text-muted);
  font-size: 10px;
  font-weight: 600;
}

.ui-stat-value {
  color: var(--ui-text);
  font-size: var(--ui-font-sm);
  font-weight: 600;
  line-height: 1.25;
}

@media (min-width: 640px) {
  .ui-stat-label {
    font-size: var(--ui-font-xs);
  }
}

@media (min-width: 640px) {
  .ui-stat-value {
    font-size: var(--ui-font-base);
  }
}

.ui-staff-greeting {
  border-radius: var(--ui-radius-large);
  color: #ffffff;
  box-shadow: var(--ui-shadow-button);
}

.ui-staff-role {
  border-radius: 999px;
  background: rgb(255 255 255 / 0.2);
  font-size: var(--ui-font-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  backdrop-filter: blur(12px);
}

.ui-staff-salutation {
  font-size: var(--ui-body-size);
  line-height: 1.25;
}

.ui-staff-name {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.25;
}

.ui-staff-description {
  color: rgb(255 255 255 / 0.8);
  font-size: var(--ui-body-size);
}

.ui-staff-status {
  border: 1px solid rgb(255 255 255 / 0.2);
  border-radius: var(--ui-radius-card);
  background-color: rgb(0 0 0 / 0.25);
  color: rgb(255 255 255 / 0.95);
  font-size: var(--ui-body-size);
  font-weight: 600;
  backdrop-filter: blur(12px);
  cursor: pointer;
}

.ui-staff-emoji {
  font-size: 2.25rem;
  cursor: pointer;
  user-select: none;
  filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.15));
}

.ui-stat-icon {
  font-size: var(--ui-font-sm);
}

.ui-module-card {
  border-radius: var(--ui-radius-control);
  background-color: var(--card-background);
  box-shadow: var(--ui-shadow-xs);
  cursor: pointer;
}

.ui-module-icon {
  transition: transform 200ms var(--ui-ease);
}

.ui-module-label {
  color: var(--ui-text-secondary);
  font-size: var(--ui-font-xs);
  font-weight: 600;
  line-height: 1.25;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.ui-module-badge {
  border-radius: 999px;
  background: #f43f5e;
  color: #ffffff;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  box-shadow: var(--ui-shadow-xs);
}

@media (min-width: 640px) {
  .ui-stat-icon {
    font-size: var(--ui-font-base);
  }
}

@media (min-width: 768px) {
  .ui-staff-name {
    font-size: 1.5rem;
  }
}

@media (min-width: 768px) {
  .ui-staff-emoji {
    font-size: 1.875rem;
  }
}

@media (hover: hover) and (pointer: fine) {
  .ui-module-card:hover .ui-module-icon {
    transform: translateY(-0.25rem) scale(1.05);
  }
}
</style>
