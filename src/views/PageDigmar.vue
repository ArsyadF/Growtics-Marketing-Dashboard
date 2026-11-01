<!-- src/views/PageDigmar.vue -->
<template>
  <div class="space-y-4 md:space-y-6">
    <!-- HEADER BAR & CONTROLS -->
    <div
      class="glass-card p-4 md:p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div>
        <h3 class="text-sm md:text-base font-bold flex items-center gap-2 ui-text-primary">
          <i class="fa-solid fa-share-nodes text-theme"></i>
          Digital Marketing & Weekly Sosmed Analytics
        </h3>
        <p class="text-[11px] md:text-xs mt-0.5 ui-text-muted">
          Rekapitulasi performa konten, jangkauan organik, dan konversi leads mingguan.
        </p>
      </div>

      <!-- Control Filters & Action Button -->
      <div class="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        <!-- Filter Unit Usaha -->
        <select
          v-model="selectedUnit"
          class="rounded-xl px-3 py-2 text-xs font-semibold dark:bg-slate-800 cursor-pointer flex-1 sm:flex-initial ui-input ui-text-secondary min-h-0"
        >
          <option value="ALL" v-if="isSuperadmin">Semua Unit Usaha</option>
          <option value="NHP">Unit NHP</option>
          <option value="NHC">Unit NHC</option>
          <option value="KG">Unit KG</option>
        </select>

        <!-- Filter Pekan/Bulan -->
        <select
          v-model="selectedPeriod"
          class="rounded-xl px-3 py-2 text-xs font-semibold dark:bg-slate-800 cursor-pointer ui-input ui-text-secondary min-h-0"
        >
          <option value="this-week">Pekan Ini</option>
          <option value="last-week">Pekan Lalu</option>
          <option value="this-month">Bulan Ini</option>
        </select>

        <!-- Button Input Weekly Metrics -->
        <button
          @click="openAddModal"
          class="px-3.5 py-2 rounded-xl text-xs shadow-md hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ui-button ui-button-primary min-h-0"
        >
          <i class="fa-solid fa-plus text-xs"></i>
          <span class="hidden sm:inline">Input Data Pekanan</span>
        </button>
      </div>
    </div>

    <!-- METRIK KINERJA DIGITAL MARKETING (TOP CARDS) -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 md:gap-4">
      <!-- Total Reach / Jangkauan -->
      <div
        class="glass-card p-3.5 md:p-4 rounded-2xl border border-slate-100 dark:border-slate-800"
      >
        <div class="flex items-center justify-between mb-1 ui-text-muted">
          <span class="text-[10px] md:text-xs font-medium">Total Reach</span>
          <i class="fa-solid fa-eye text-xs text-blue-500"></i>
        </div>
        <h3 class="text-base md:text-xl font-black ui-text-primary">
          {{ formatNumber(totalReach) }}
        </h3>
        <p class="text-[9px] text-emerald-500 font-semibold mt-1 flex items-center gap-1">
          <i class="fa-solid fa-arrow-trend-up"></i> +12.4% vs pekan lalu
        </p>
      </div>

      <!-- Total Engagement -->
      <div
        class="glass-card p-3.5 md:p-4 rounded-2xl border border-slate-100 dark:border-slate-800"
      >
        <div class="flex items-center justify-between mb-1 ui-text-muted">
          <span class="text-[10px] md:text-xs font-medium">Total Engagement</span>
          <i class="fa-solid fa-heart text-xs text-rose-500"></i>
        </div>
        <h3 class="text-base md:text-xl font-black ui-text-primary">
          {{ formatNumber(totalEngagement) }}
        </h3>
        <p class="text-[9px] text-emerald-500 font-semibold mt-1 flex items-center gap-1">
          <i class="fa-solid fa-arrow-trend-up"></i> +8.1% vs pekan lalu
        </p>
      </div>

      <!-- Avg Engagement Rate -->
      <div
        class="glass-card p-3.5 md:p-4 rounded-2xl border border-slate-100 dark:border-slate-800"
      >
        <div class="flex items-center justify-between mb-1 ui-text-muted">
          <span class="text-[10px] md:text-xs font-medium">Avg ER (%)</span>
          <i class="fa-solid fa-chart-line text-xs text-amber-500"></i>
        </div>
        <h3 class="text-base md:text-xl font-black text-theme">{{ avgER }}%</h3>
        <p class="text-[9px] mt-1 ui-text-muted">
          Status: <strong class="text-emerald-500">Sehat (&gt;3%)</strong>
        </p>
      </div>

      <!-- Leads Disatukan dari Sosmed -->
      <div
        class="glass-card p-3.5 md:p-4 rounded-2xl border border-slate-100 dark:border-slate-800 theme-tint-subtle"
      >
        <div class="flex items-center justify-between mb-1 ui-text-muted">
          <span class="text-[10px] md:text-xs font-medium text-theme">Leads dari Sosmed</span>
          <i class="fa-solid fa-comments text-xs text-theme"></i>
        </div>
        <h3 class="text-base md:text-xl font-black text-theme">
          {{ totalLeadsFromSosmed }}
          <span class="text-[10px] font-normal ui-text-muted">Leads</span>
        </h3>
        <p class="text-[9px] mt-1 ui-text-muted">Terhubung ke Page Leads</p>
      </div>
    </div>

    <!-- GRID PERFORMA PER PLATFORM SOSIAL MEDIA -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
      <div
        v-for="item in filteredSocialData"
        :key="item.id"
        class="glass-card p-4 md:p-5 rounded-2xl border border-white/20 dark:border-slate-800 theme-border-hover transition-all space-y-3 relative overflow-hidden"
      >
        <!-- Top Bar Platform Header -->
        <div
          class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3"
        >
          <div class="flex items-center gap-2.5">
            <!-- Icon Platform -->
            <div
              class="w-9 h-9 rounded-xl flex items-center justify-center text-white text-base shadow-sm"
              :class="getPlatformBgClass(item.platform)"
            >
              <i class="fa-brands" :class="getPlatformIconClass(item.platform)"></i>
            </div>
            <div>
              <h4 class="font-bold text-xs sm:text-sm ui-text-primary">
                {{ item.platform }}
              </h4>
              <span class="text-[9px] font-bold uppercase ui-text-muted">
                Unit {{ item.unit }} • {{ item.weekRange }}
              </span>
            </div>
          </div>

          <!-- Badge Engagement Rate -->
          <span
            class="text-[10px] font-extrabold text-theme theme-tint px-2 py-0.5 rounded-full border theme-border-soft"
          >
            ER {{ item.er }}%
          </span>
        </div>

        <!-- Rincian Parameter Metrics -->
        <div class="grid grid-cols-2 gap-2 text-xs pt-1">
          <div class="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span class="text-[9px] block mb-0.5 ui-text-muted">Reach / Impression</span>
            <span class="font-bold ui-text-primary">{{ formatNumber(item.reach) }}</span>
          </div>
          <div class="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span class="text-[9px] block mb-0.5 ui-text-muted">Likes & Comments</span>
            <span class="font-bold ui-text-primary">{{ formatNumber(item.likesComments) }}</span>
          </div>
          <div class="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span class="text-[9px] block mb-0.5 ui-text-muted">Shares & Saves</span>
            <span class="font-bold ui-text-primary">{{ formatNumber(item.sharesSaves) }}</span>
          </div>
          <div class="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span class="text-[9px] text-emerald-600 dark:text-emerald-400 block mb-0.5"
              >Link Clicks / Leads</span
            >
            <span class="font-bold text-emerald-700 dark:text-emerald-300"
              >{{ item.leads }} Leads</span
            >
          </div>
        </div>

        <!-- Top Performing Content Catatan -->
        <div
          v-if="item.topContent"
          class="text-[10px] bg-slate-100/70 dark:bg-slate-800/70 p-2.5 rounded-xl ui-text-secondary"
        >
          <span class="font-bold block mb-0.5 ui-text-primary">🏆 Content Winner Pekan Ini:</span>
          "{{ item.topContent }}"
        </div>

        <!-- Action Edit / Delete -->
        <div
          class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800"
        >
          <button
            @click="openEditModal(item)"
            class="hover:text-amber-500 text-xs p-1 transition-colors cursor-pointer ui-text-muted"
            title="Edit Analytics"
          >
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button
            @click="deleteItem(item.id)"
            class="hover:text-rose-500 text-xs p-1 transition-colors cursor-pointer ui-text-muted"
            title="Hapus Data"
          >
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL FORM INPUT/EDIT METRICS DIGMAR -->
    <Teleport to="body">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        @click.self="isModalOpen = false"
      >
        <div
          class="w-full max-w-md glass-card rounded-3xl p-5 shadow-2xl space-y-4 border border-slate-100 dark:border-slate-800"
        >
          <div
            class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3"
          >
            <h3 class="font-bold text-sm ui-text-primary">
              {{ isEdit ? "Edit Metrics Sosmed" : "Input Metrics Sosmed Pekanan" }}
            </h3>
            <button
              @click="isModalOpen = false"
              class="hover:text-slate-600 dark:hover:text-slate-200 ui-text-muted"
            >
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <form @submit.prevent="saveMetrics" class="space-y-3 text-xs">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-medium mb-1 ui-text-description">Unit Usaha:</label>
                <select
                  v-model="form.unit"
                  class="w-full rounded-xl px-3 py-2 dark:bg-slate-800 ui-input ui-text-primary min-h-0"
                >
                  <option value="NHP">NHP</option>
                  <option value="NHC">NHC</option>
                  <option value="KG">KG</option>
                </select>
              </div>

              <div>
                <label class="block font-medium mb-1 ui-text-description">Platform Sosmed:</label>
                <select
                  v-model="form.platform"
                  class="w-full rounded-xl px-3 py-2 dark:bg-slate-800 ui-input ui-text-primary min-h-0"
                >
                  <option value="Instagram">Instagram</option>
                  <option value="TikTok">TikTok</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Facebook">Facebook</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-medium mb-1 ui-text-description">Rentang Pekan:</label>
                <input
                  v-model="form.weekRange"
                  type="text"
                  required
                  placeholder="Misal: 07 Apr - 13 Apr"
                  class="w-full rounded-xl px-3 py-2 ui-input ui-text-primary min-h-0"
                />
              </div>
              <div>
                <label class="block font-medium mb-1 ui-text-description">Total Reach:</label>
                <input
                  v-model.number="form.reach"
                  type="number"
                  required
                  placeholder="0"
                  class="w-full rounded-xl px-3 py-2 ui-input ui-text-primary min-h-0"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-medium mb-1 ui-text-description">Likes & Comments:</label>
                <input
                  v-model.number="form.likesComments"
                  type="number"
                  required
                  placeholder="0"
                  class="w-full rounded-xl px-3 py-2 ui-input ui-text-primary min-h-0"
                />
              </div>
              <div>
                <label class="block font-medium mb-1 ui-text-description">Shares & Saves:</label>
                <input
                  v-model.number="form.sharesSaves"
                  type="number"
                  required
                  placeholder="0"
                  class="w-full rounded-xl px-3 py-2 ui-input ui-text-primary min-h-0"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-medium mb-1 ui-text-description">Leads Generated:</label>
                <input
                  v-model.number="form.leads"
                  type="number"
                  required
                  placeholder="0"
                  class="w-full rounded-xl px-3 py-2 ui-input ui-text-primary min-h-0"
                />
              </div>
              <div>
                <label class="block font-medium mb-1 ui-text-description"
                  >Engagement Rate (%):</label
                >
                <input
                  v-model.number="form.er"
                  type="number"
                  step="0.1"
                  required
                  placeholder="3.5"
                  class="w-full rounded-xl px-3 py-2 ui-input ui-text-primary min-h-0"
                />
              </div>
            </div>

            <div>
              <label class="block font-medium mb-1 ui-text-description"
                >Judul Content Winner (Opsional):</label
              >
              <input
                v-model="form.topContent"
                type="text"
                placeholder="Misal: Video Reels Promo Buku Q2"
                class="w-full rounded-xl px-3 py-2 ui-input ui-text-primary min-h-0"
              />
            </div>

            <div class="flex justify-end gap-2 ml-auto">
              <button
                @click="isModalOpen = false"
                type="button"
                :disabled="isSubmitting"
                class="bg-slate-200 dark:bg-slate-800 px-4 py-2 rounded-xl cursor-pointer disabled:opacity-50 ui-button ui-text-secondary min-h-0"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-5 py-2 rounded-xl shadow-md cursor-pointer flex items-center gap-2 disabled:opacity-50 ui-button ui-button-primary min-h-0"
              >
                <i v-if="isSubmitting" class="fa-solid fa-circle-notch fa-spin text-xs"></i>
                <span>{{ isSubmitting ? "Memproses..." : "Simpan Analytics" }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { store } from "../store/index.js";

// Dummy Data Initial Social Media Metrics
const socialData = ref([
  {
    id: 1,
    unit: "NHP",
    platform: "Instagram",
    weekRange: "07 Apr - 13 Apr",
    reach: 45200,
    likesComments: 2850,
    sharesSaves: 640,
    leads: 124,
    er: 4.8,
    topContent: "Reels Soft Selling Modul Pembelajaran Q2",
  },
  {
    id: 2,
    unit: "NHP",
    platform: "TikTok",
    weekRange: "07 Apr - 13 Apr",
    reach: 89400,
    likesComments: 6120,
    sharesSaves: 1450,
    leads: 210,
    er: 5.6,
    topContent: "VT Behind the Scene Produksi Percetakan",
  },
  {
    id: 3,
    unit: "NHC",
    platform: "Instagram",
    weekRange: "07 Apr - 13 Apr",
    reach: 22100,
    likesComments: 1100,
    sharesSaves: 310,
    leads: 45,
    er: 3.4,
    topContent: "Carousel Tips Memilih Kertas Cetak",
  },
]);

const selectedUnit = ref("ALL");
const selectedPeriod = ref("this-week");
const isModalOpen = ref(false);
const isEdit = ref(false);
const activeId = ref(null);

const form = reactive({
  unit: "NHP",
  platform: "Instagram",
  weekRange: "07 Apr - 13 Apr",
  reach: 0,
  likesComments: 0,
  sharesSaves: 0,
  leads: 0,
  er: 0,
  topContent: "",
});

const isSuperadmin = computed(() => {
  const role = store.currentUser?.role || store.currentUser?.Role;
  return role ? role.toUpperCase() === "SUPERADMIN" : false;
});

onMounted(() => {
  if (!isSuperadmin.value && store.currentUser) {
    const userUnits = store.currentUser.aksesUnit || [store.currentUser.unit];
    if (userUnits.length > 0) {
      selectedUnit.value = userUnits[0];
    }
  }
});

// Filter Data berdasarkan Unit
const filteredSocialData = computed(() => {
  return socialData.value.filter((item) => {
    return selectedUnit.value === "ALL" || item.unit === selectedUnit.value;
  });
});

// Computed Aggregations
const totalReach = computed(() =>
  filteredSocialData.value.reduce((acc, curr) => acc + curr.reach, 0),
);
const totalEngagement = computed(() =>
  filteredSocialData.value.reduce(
    (acc, curr) => acc + curr.likesComments + curr.sharesSaves,
    0,
  ),
);
const totalLeadsFromSosmed = computed(() =>
  filteredSocialData.value.reduce((acc, curr) => acc + curr.leads, 0),
);

const avgER = computed(() => {
  if (filteredSocialData.value.length === 0) return 0;
  const sumER = filteredSocialData.value.reduce(
    (acc, curr) => acc + curr.er,
    0,
  );
  return (sumER / filteredSocialData.value.length).toFixed(1);
});

// Styling Helpers Per Platform
const getPlatformBgClass = (platform) => {
  switch (platform) {
    case "Instagram":
      return "bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600";
    case "TikTok":
      return "bg-slate-900 dark:bg-slate-700";
    case "YouTube":
      return "bg-red-600";
    case "Facebook":
      return "bg-blue-600";
    default:
      return "bg-theme";
  }
};

const getPlatformIconClass = (platform) => {
  switch (platform) {
    case "Instagram":
      return "fa-instagram";
    case "TikTok":
      return "fa-tiktok";
    case "YouTube":
      return "fa-youtube";
    case "Facebook":
      return "fa-facebook-f";
    default:
      return "fa-share-nodes";
  }
};

const formatNumber = (val) => {
  if (!val) return "0";
  return new Intl.NumberFormat("id-ID").format(val);
};

// Modal Actions
const openAddModal = () => {
  isEdit.value = false;
  activeId.value = null;
  form.unit = selectedUnit.value !== "ALL" ? selectedUnit.value : "NHP";
  form.platform = "Instagram";
  form.weekRange = "07 Apr - 13 Apr";
  form.reach = 0;
  form.likesComments = 0;
  form.sharesSaves = 0;
  form.leads = 0;
  form.er = 0;
  form.topContent = "";
  isModalOpen.value = true;
};

const openEditModal = (item) => {
  isEdit.value = true;
  activeId.value = item.id;
  form.unit = item.unit;
  form.platform = item.platform;
  form.weekRange = item.weekRange;
  form.reach = item.reach;
  form.likesComments = item.likesComments;
  form.sharesSaves = item.sharesSaves;
  form.leads = item.leads;
  form.er = item.er;
  form.topContent = item.topContent || "";
  isModalOpen.value = true;
};

const saveMetrics = () => {
  if (isEdit.value && activeId.value) {
    const idx = socialData.value.findIndex((s) => s.id === activeId.value);
    if (idx !== -1) {
      socialData.value[idx] = { ...socialData.value[idx], ...form };
    }
  } else {
    socialData.value.unshift({ id: Date.now(), ...form });
  }
  isModalOpen.value = false;
};

const deleteItem = (id) => {
  socialData.value = socialData.value.filter((s) => s.id !== id);
};
</script>
