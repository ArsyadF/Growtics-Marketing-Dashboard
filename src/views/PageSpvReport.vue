<!-- src/views/PageSpvReport.vue -->
<template>
  <div class="space-y-4 md:space-y-6">
    <!-- HEADER BAR: TITLE & TOP ACTION -->
    <div
      class="glass-card p-4 md:p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div>
        <h3
          class="text-sm md:text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"
        >
          <i class="fa-solid fa-file-signature text-emerald-600"></i>
          Laporan Pekanan & Konsolidasi Direksi
        </h3>
        <p class="text-[11px] md:text-xs text-slate-400 mt-0.5">
          Modul pembuatan rekapitulasi kinerja mingguan per unit usaha maupun
          konsolidasi seluruh unit.
        </p>
      </div>

      <div class="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        <!-- Filter Unit Usaha untuk Tampilan Tabel/List -->
        <select
          v-model="selectedUnitFilter"
          :disabled="!isSuperadmin"
          class="glass-input rounded-xl px-3 py-2 text-xs font-semibold dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none cursor-pointer disabled:opacity-70"
        >
          <option value="ALL" v-if="isSuperadmin">
            Semua Unit (Konsolidasi)
          </option>
          <option value="NHP">Unit NHP</option>
          <option value="NHC">Unit NHC</option>
          <option value="KG">Unit KG</option>
        </select>

        <button
          @click="openAddReportModal"
          class="bg-button text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <i class="fa-solid fa-pen-to-square"></i>
          <span>Buat Laporan Baru</span>
        </button>
      </div>
    </div>

    <!-- LIST RIWAYAT LAPORAN PEKANAN -->
    <div v-if="filteredReports.length > 0" class="space-y-4">
      <div
        v-for="rep in filteredReports"
        :key="rep.id"
        class="glass-card p-5 rounded-2xl border border-white/30 dark:border-slate-800 space-y-4 shadow-sm"
      >
        <div
          class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3"
        >
          <div>
            <span
              class="text-[9px] font-bold px-2.5 py-0.5 rounded-full border uppercase"
              :class="
                rep.unit === 'ALL'
                  ? 'text-purple-600 bg-purple-500/10 border-purple-500/20'
                  : 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20'
              "
            >
              {{
                rep.unit === "ALL"
                  ? "KONSOLIDASI SELURUH UNIT"
                  : `UNIT ${rep.unit}`
              }}
              • Periode: {{ rep.periode }}
            </span>
            <h4
              class="font-bold text-sm md:text-base text-slate-800 dark:text-slate-100 mt-1"
            >
              {{ rep.title }}
            </h4>
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="printReport(rep)"
              class="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <i class="fa-solid fa-file-word"></i> Cetak Dokumen
            </button>
            <button
              @click="openEditReport(rep)"
              class="text-slate-400 hover:text-amber-500 text-xs p-1 cursor-pointer"
            >
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
          </div>
        </div>

        <!-- Metric Cards -->
        <div
          class="grid grid-cols-3 gap-3 text-center bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs"
        >
          <div>
            <span class="text-[10px] text-slate-400 block mb-0.5"
              >Total Penawaran</span
            >
            <strong class="text-emerald-600 text-sm md:text-base font-black">{{
              formatNumber(rep.ringkasan.penawaran)
            }}</strong>
          </div>
          <div>
            <span class="text-[10px] text-slate-400 block mb-0.5"
              >Total Pesanan</span
            >
            <strong class="text-emerald-600 text-sm md:text-base font-black">{{
              formatNumber(rep.ringkasan.pesanan)
            }}</strong>
          </div>
          <div>
            <span class="text-[10px] text-slate-400 block mb-0.5"
              >Total Penjualan (Rp)</span
            >
            <strong class="text-emerald-600 text-sm md:text-base font-black"
              >Rp {{ formatNumber(rep.ringkasan.penjualan) }}</strong
            >
          </div>
        </div>

        <!-- Rincian Program & Aktivitas SPV -->
        <div class="space-y-2 text-xs">
          <div
            v-if="rep.programList && rep.programList.length > 0"
            class="p-3 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800"
          >
            <strong class="text-slate-800 dark:text-slate-200 block mb-1"
              >Daftar Program Kerja Berjalan:</strong
            >
            <ul
              class="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400 text-[11px]"
            >
              <li v-for="p in rep.programList" :key="p.id">
                <span class="font-bold text-emerald-600">[{{ p.unit }}]</span>
                {{ p.title }} - Progress: {{ p.progress }}% (PIC: {{ p.pic }})
              </li>
            </ul>
          </div>

          <div
            v-if="rep.aktivitasCS"
            class="p-3 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800"
          >
            <strong class="text-slate-800 dark:text-slate-200 block mb-1"
              >Aktivitas CS Deal & Data:</strong
            >
            <p
              class="whitespace-pre-line text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed"
            >
              {{ rep.aktivitasCS }}
            </p>
          </div>

          <div
            v-if="rep.kendala"
            class="p-3 bg-rose-500/5 rounded-xl border border-rose-500/20 text-rose-600 dark:text-rose-400"
          >
            <strong class="block mb-1"
              >Catatan / Kendala & Solusi Tindak Lanjut:</strong
            >
            <p class="whitespace-pre-line text-[11px] leading-relaxed">
              {{ rep.kendala }}
            </p>
          </div>
        </div>

        <div
          class="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/80"
        >
          <span
            >Penyusun:
            <strong class="text-slate-700 dark:text-slate-300">{{
              rep.author || "Tim Penjualan"
            }}</strong></span
          >
          <span>Tanggal Rilis: {{ rep.releaseDate }}</span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="glass-card p-12 text-center rounded-3xl space-y-3">
      <i
        class="fa-solid fa-file-invoice text-4xl text-slate-300 dark:text-slate-700 mb-1"
      ></i>
      <h4 class="font-bold text-sm text-slate-700 dark:text-slate-300">
        Belum Ada Laporan Terdaftar
      </h4>
      <p class="text-xs text-slate-400 max-w-xs mx-auto">
        Klik tombol "Buat Laporan Baru" untuk menyusun laporan per unit atau
        konsolidasi seluruh unit.
      </p>
    </div>

    <!-- MODAL BUAT LAPORAN PEKANAN WITH MANUAL DATE & UNIT ALL SUPPORT -->
    <Teleport to="body">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
        @click.self="isModalOpen = false"
      >
        <div
          class="w-full max-w-2xl glass-card bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-100 dark:border-slate-800 max-h-[92vh] overflow-y-auto"
        >
          <div
            class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3"
          >
            <h3
              class="font-bold text-sm md:text-base text-slate-800 dark:text-slate-100"
            >
              {{
                isEdit
                  ? "Edit Laporan Pekanan"
                  : "Form Pembuatan Laporan Pekanan"
              }}
            </h3>
            <button
              @click="isModalOpen = false"
              class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <form @submit.prevent="saveReport" class="space-y-4 text-xs">
            <!-- Unit Selection & Manual Date Range Picker -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="block text-slate-500 font-medium mb-1"
                  >Unit Usaha Laporan:</label
                >
                <select
                  v-model="form.unit"
                  @change="onPeriodOrUnitChange"
                  class="w-full glass-input rounded-xl px-3 py-2 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                >
                  <option value="ALL" v-if="isSuperadmin">
                    Semua Unit (Konsolidasi)
                  </option>
                  <option value="NHP">Unit NHP</option>
                  <option value="NHC">Unit NHC</option>
                  <option value="KG">Unit KG</option>
                </select>
              </div>

              <div>
                <label class="block text-slate-500 font-medium mb-1"
                  >Dari Tanggal:</label
                >
                <input
                  v-model="form.startDate"
                  type="date"
                  required
                  @change="onPeriodOrUnitChange"
                  class="w-full glass-input rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 outline-none dark:bg-slate-800"
                />
              </div>

              <div>
                <label class="block text-slate-500 font-medium mb-1"
                  >Sampai Tanggal:</label
                >
                <input
                  v-model="form.endDate"
                  type="date"
                  required
                  @change="onPeriodOrUnitChange"
                  class="w-full glass-input rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 outline-none dark:bg-slate-800"
                />
              </div>
            </div>

            <div>
              <label class="block text-slate-500 font-medium mb-1"
                >Judul Laporan Pekanan:</label
              >
              <input
                v-model="form.title"
                type="text"
                required
                class="w-full glass-input rounded-xl px-3 py-2 outline-none font-semibold"
              />
            </div>

            <!-- Auto Sales Metric Summary (Support ALL / Multi-unit Sum) -->
            <div
              class="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-2 border border-slate-200 dark:border-slate-700"
            >
              <div class="flex justify-between items-center">
                <h5
                  class="font-bold text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wider"
                >
                  METRIK SALES AUTOMATIS
                  {{ form.unit === "ALL" ? "(AKUMULASI SELURUH UNIT)" : "" }}
                </h5>
                <button
                  type="button"
                  @click="autoFetchMetrics"
                  class="text-[10px] font-bold text-emerald-600 hover:underline"
                >
                  <i class="fa-solid fa-arrows-rotate mr-1"></i>Hitung Ulang
                </button>
              </div>
              <div class="grid grid-cols-3 gap-3">
                <div>
                  <label class="block text-[10px] text-slate-400 mb-0.5"
                    >Total Penawaran:</label
                  >
                  <input
                    v-model.number="form.ringkasan.penawaran"
                    type="number"
                    class="w-full glass-input rounded-xl px-2.5 py-1.5 font-bold outline-none"
                  />
                </div>
                <div>
                  <label class="block text-[10px] text-slate-400 mb-0.5"
                    >Total Pesanan:</label
                  >
                  <input
                    v-model.number="form.ringkasan.pesanan"
                    type="number"
                    class="w-full glass-input rounded-xl px-2.5 py-1.5 font-bold outline-none"
                  />
                </div>
                <div>
                  <label class="block text-[10px] text-slate-400 mb-0.5"
                    >Total Penjualan (Rp):</label
                  >
                  <input
                    v-model.number="form.ringkasan.penjualan"
                    type="number"
                    class="w-full glass-input rounded-xl px-2.5 py-1.5 font-bold outline-none"
                  />
                </div>
              </div>
            </div>

            <!-- Entry Manual -->
            <div>
              <label class="block text-slate-500 font-medium mb-1"
                >Aktivitas CS Deal & Data (Manual):</label
              >
              <textarea
                v-model="form.aktivitasCS"
                rows="3"
                placeholder="Tuliskan catatan aktivitas tim CS..."
                class="w-full glass-input rounded-xl px-3 py-2 outline-none resize-y min-h-[75px]"
              ></textarea>
            </div>

            <div>
              <label class="block text-slate-500 font-medium mb-1"
                >Catatan / Kendala & Solusi Tindak Lanjut (Manual):</label
              >
              <textarea
                v-model="form.kendala"
                rows="3"
                placeholder="Tuliskan kendala teknis dan solusi tindak lanjut..."
                class="w-full glass-input rounded-xl px-3 py-2 outline-none resize-y min-h-[75px]"
              ></textarea>
            </div>

            <div
              class="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800"
            >
              <button
                @click="isModalOpen = false"
                type="button"
                class="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                class="bg-button text-white px-5 py-2 rounded-xl font-bold shadow-md"
              >
                Terbitkan Laporan Pekanan
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { store } from "../store/index.js";

const selectedUnitFilter = ref("ALL");
const isModalOpen = ref(false);
const isEdit = ref(false);
const activeId = ref(null);

const reports = ref([
  {
    id: 1,
    unit: "NHP",
    title: "LAPORAN PEKANAN - UNIT NHP (07/09/2026 – 13/09/2026)",
    periode: "07/09/2026 – 13/09/2026",
    startDate: "2026-09-07",
    endDate: "2026-09-13",
    ringkasan: { penawaran: 2362, pesanan: 90, penjualan: 58248858 },
    programList: [
      {
        id: 1,
        unit: "NHP",
        title: "Eksplorasi data leads daring & campaign buku non-teks",
        progress: 75,
        pic: "Budi Santoso",
      },
    ],
    aktivitasCS:
      "1. Eksplorasi data leads daring untuk suplay pipeline campaign.\n2. Follow up surat penawaran 2026, konfirmasi pengiriman pesanan sekolah.",
    kendala:
      "1. Persiapan Event IIEF (Nusaragam): Membutuhkan kepastian skema penawaran produk.",
    author: "Departemen Penjualan",
    releaseDate: "14 Sep 2026",
  },
]);

const form = reactive({
  unit: "NHP",
  title: "",
  startDate: "",
  endDate: "",
  periode: "",
  ringkasan: { penawaran: 0, pesanan: 0, penjualan: 0 },
  programList: [],
  aktivitasCS: "",
  kendala: "",
});

const isSuperadmin = computed(
  () => store.currentUser?.role?.toUpperCase() === "SUPERADMIN",
);

onMounted(() => {
  if (!isSuperadmin.value && store.currentUser) {
    const userUnits = store.currentUser.aksesUnit || [store.currentUser.unit];
    if (userUnits.length > 0) selectedUnitFilter.value = userUnits[0];
  }
});

// Pantau sinyal pemanggilan modal dari BottomNav

const filteredReports = computed(() => {
  return reports.value.filter(
    (rep) =>
      selectedUnitFilter.value === "ALL" ||
      rep.unit === selectedUnitFilter.value,
  );
});

const formatDateIndo = (dStr) => {
  if (!dStr) return "";
  const d = new Date(dStr);
  if (isNaN(d)) return dStr;
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const onPeriodOrUnitChange = () => {
  if (form.startDate && form.endDate) {
    const pStart = formatDateIndo(form.startDate);
    const pEnd = formatDateIndo(form.endDate);
    form.periode = `${pStart} – ${pEnd}`;
    const unitTag =
      form.unit === "ALL" ? "SELURUH UNIT (KONSOLIDASI)" : `UNIT ${form.unit}`;
    form.title = `LAPORAN PEKANAN - ${unitTag} (${form.periode})`;
  }
  autoFetchMetrics();
};

const autoFetchMetrics = () => {
  const dummySalesData = {
    NHP: { penawaran: 2362, pesanan: 90, penjualan: 58248858 },
    NHC: { penawaran: 1450, pesanan: 65, penjualan: 34100000 },
    KG: { penawaran: 890, pesanan: 40, penjualan: 22500000 },
  };

  if (form.unit === "ALL") {
    // Akumulasi otomatis seluruh unit
    let totalPenawaran = 0;
    let totalPesanan = 0;
    let totalPenjualan = 0;

    Object.values(dummySalesData).forEach((u) => {
      totalPenawaran += u.penawaran;
      totalPesanan += u.pesanan;
      totalPenjualan += u.penjualan;
    });

    form.ringkasan = {
      penawaran: totalPenawaran,
      pesanan: totalPesanan,
      penjualan: totalPenjualan,
    };
    form.programList = store.programs || [
      {
        id: 1,
        unit: "NHP",
        title: "Program NHP Main",
        progress: 75,
        pic: "Budi",
      },
      {
        id: 2,
        unit: "NHC",
        title: "Program NHC Shopee",
        progress: 90,
        pic: "Siti",
      },
      {
        id: 3,
        unit: "KG",
        title: "Pengadaan Mesin KG",
        progress: 100,
        pic: "Ahmad",
      },
    ];
  } else {
    form.ringkasan = dummySalesData[form.unit] || {
      penawaran: 0,
      pesanan: 0,
      penjualan: 0,
    };
    if (store.programs) {
      form.programList = store.programs.filter((p) => p.unit === form.unit);
    } else {
      form.programList = [
        {
          id: 1,
          unit: form.unit,
          title: `Program Utama Unit ${form.unit}`,
          progress: 80,
          pic: store.currentUser?.nama || "Admin",
        },
      ];
    }
  }
};

const formatNumber = (val) => new Intl.NumberFormat("id-ID").format(val || 0);

const openAddReportModal = () => {
  isEdit.value = false;
  activeId.value = null;

  const today = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 6);

  form.startDate = lastWeek.toISOString().split("T")[0];
  form.endDate = today.toISOString().split("T")[0];
  form.unit =
    selectedUnitFilter.value !== "ALL" ? selectedUnitFilter.value : "ALL";

  onPeriodOrUnitChange();
  form.aktivitasCS = "";
  form.kendala = "";
  isModalOpen.value = true;
};

const openEditReport = (rep) => {
  isEdit.value = true;
  activeId.value = rep.id;
  form.unit = rep.unit;
  form.startDate = rep.startDate || "2026-09-07";
  form.endDate = rep.endDate || "2026-09-13";
  form.title = rep.title;
  form.periode = rep.periode;
  form.ringkasan = { ...rep.ringkasan };
  form.programList = rep.programList || [];
  form.aktivitasCS = rep.aktivitasCS;
  form.kendala = rep.kendala;
  isModalOpen.value = true;
};

const saveReport = () => {
  const todayStr = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  if (isEdit.value && activeId.value) {
    const idx = reports.value.findIndex((r) => r.id === activeId.value);
    if (idx !== -1)
      reports.value[idx] = {
        ...reports.value[idx],
        ...JSON.parse(JSON.stringify(form)),
      };
  } else {
    reports.value.unshift({
      id: Date.now(),
      ...JSON.parse(JSON.stringify(form)),
      author: store.currentUser?.nama || "Tim Penjualan",
      releaseDate: todayStr,
    });
  }
  isModalOpen.value = false;
  store.addNotification(
    "Laporan Disimpan",
    "Dokumen Laporan Pekanan telah diterbitkan",
    "success",
  );
};

const printReport = (rep) => {
  window.print();
};

watch(
  () => store.activeModal,
  (newModal) => {
    if (newModal === "spv-report") {
      openAddReportModal();
      store.closeModal(); // Bersihkan sinyal di store
    }
  },
  { immediate: true },
);
</script>
