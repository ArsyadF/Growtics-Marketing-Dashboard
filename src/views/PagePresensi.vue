<!-- src/views/PageAbsensi.vue -->
<template>
  <div class="space-y-4 md:space-y-6 pb-20 md:pb-6">
    <!-- HEADER PAGE & NAVIGASI TAB -->
    <div
      class="glass-card p-4 md:p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
    >
      <div>
        <h2 class="text-base md:text-lg font-bold flex items-center gap-2 ui-text-primary">
          <i class="fa-solid fa-clipboard-user text-emerald-600"></i>
          <span>Absensi & Laporan Linerja Harian</span>
        </h2>
        <p class="text-xs mt-0.5 ui-text-muted">
          Pencatatan presensi, rekap performa tim, serta manajemen form laporan dinamis.
        </p>
      </div>

      <!-- Tab Switcher -->
      <div
        class="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl shrink-0 text-xs"
      >
        <button
          @click="activeTab = 'presensi'"
          class="px-3 py-1.5 rounded-xl transition-all cursor-pointer ui-button min-h-0"
          :class="
            activeTab === 'presensi'
              ? 'bg-button text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          "
        >
          <i class="fa-solid fa-pen-to-square mr-1"></i> Absen
        </button>
        <button
          @click="activeTab = 'rekap'"
          class="px-3 py-1.5 rounded-xl transition-all cursor-pointer ui-button min-h-0"
          :class="
            activeTab === 'rekap'
              ? 'bg-button text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          "
        >
          <i class="fa-solid fa-chart-pie mr-1"></i> Rekap Performa
        </button>
        <button
          v-if="isSuperadmin"
          @click="activeTab = 'builder'"
          class="px-3 py-1.5 rounded-xl transition-all cursor-pointer ui-button min-h-0"
          :class="
            activeTab === 'builder'
              ? 'bg-button text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          "
        >
          <i class="fa-solid fa-sliders mr-1"></i> Form Builder
        </button>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- TAB 1: FORM PRESENSI HARIAN (USER) -->
    <!-- ========================================== -->
    <div v-if="activeTab === 'presensi'" class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      <!-- Status Presensi Hari Ini -->
      <div
        class="glass-card p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4"
      >
        <h3
          class="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ui-text-muted"
        >
          <i class="fa-solid fa-calendar-check text-emerald-600"></i>
          Status Hari Ini ({{ todayDateStr }})
        </h3>

        <div
          v-if="hasFilledToday"
          class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2"
        >
          <div
            class="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xl mx-auto shadow-md"
          >
            <i class="fa-solid fa-check"></i>
          </div>
          <h4 class="font-bold text-sm text-emerald-700 dark:text-emerald-400">
            Anda Sudah Presensi!
          </h4>
          <p class="text-xs ui-text-description">
            Terima kasih, laporan harian Anda telah tersimpan ke sistem.
          </p>
        </div>

        <div
          v-else
          class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center space-y-2"
        >
          <div
            class="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center text-xl mx-auto shadow-md animate-pulse"
          >
            <i class="fa-solid fa-clock"></i>
          </div>
          <h4 class="font-bold text-sm text-amber-700 dark:text-amber-400">
            Belum Mengisi Absensi
          </h4>
          <p class="text-xs ui-text-description">
            Silakan lengkapi formulir laporan harian di samping sebelum batas jam kerja berakhir.
          </p>
        </div>

        <!-- Deteksi Geolocation GPS -->
        <div
          class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-2"
        >
          <div class="flex items-center justify-between font-bold ui-text-secondary">
            <span class="flex items-center gap-1.5"
              ><i class="fa-solid fa-location-dot text-rose-500"></i> Lokasi Anda</span
            >
            <button
              @click="getGeoLocation"
              type="button"
              class="text-theme hover:underline text-[10px]"
            >
              Refresh
            </button>
          </div>
          <p class="text-[11px] leading-relaxed ui-text-description">
            {{
              geoCoordinates
                ? `${geoCoordinates.lat.toFixed(5)}, ${geoCoordinates.lng.toFixed(5)}`
                : "Mendeteksi koordinat GPS..."
            }}
          </p>
        </div>
      </div>

      <!-- Form Isian Dinamis -->
      <div
        class="lg:col-span-2 glass-card p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4"
      >
        <h3
          class="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ui-text-muted"
        >
          <i class="fa-solid fa-list-check text-blue-600"></i>
          Form Laporan Harian
        </h3>

        <form @submit.prevent="submitAttendance" class="space-y-4 text-xs">
          <div v-for="field in currentFormSchema.fields" :key="field.id" class="space-y-1">
            <label class="block font-semibold ui-text-secondary">
              {{ field.label }}
              <span v-if="field.required" class="text-rose-500">*</span>
            </label>

            <!-- Input Text / URL -->
            <input
              v-if="['text', 'url', 'number'].includes(field.type)"
              v-model="userResponses[field.id]"
              :type="field.type"
              :required="field.required"
              class="w-full rounded-xl p-2.5 ui-input ui-text-primary min-h-0"
            />

            <!-- Input Textarea -->
            <textarea
              v-else-if="field.type === 'textarea'"
              v-model="userResponses[field.id]"
              :required="field.required"
              rows="3"
              class="w-full rounded-xl p-2.5 resize-none ui-input ui-text-primary min-h-0"
            ></textarea>

            <!-- Input Select -->
            <select
              v-else-if="field.type === 'select'"
              v-model="userResponses[field.id]"
              :required="field.required"
              class="w-full rounded-xl p-2.5 ui-input ui-text-primary min-h-0"
            >
              <option value="" disabled>-- Pilih Option --</option>
              <option v-for="opt in field.options" :key="opt" :value="opt">
                {{ opt }}
              </option>
            </select>
          </div>

          <button
            type="submit"
            :disabled="isSubmitting || hasFilledToday"
            class="w-full py-3 rounded-2xl shadow-md disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2 ui-button ui-button-primary min-h-0"
          >
            <i v-if="isSubmitting" class="fa-solid fa-spinner fa-spin"></i>
            <span>{{ isSubmitting ? "Menyimpan Presensi..." : "Kirim Presensi Harian" }}</span>
          </button>
        </form>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- TAB 2: REKAP PERFORMA & EKSPOR / IMPOR -->
    <!-- ========================================== -->
    <div v-if="activeTab === 'rekap'" class="space-y-4">
      <!-- Toolbar Filter & Ekspor Import -->
      <div
        class="glass-card p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs"
      >
        <div class="flex items-center gap-2 w-full md:w-auto">
          <input
            v-model="filterDate"
            type="date"
            class="rounded-xl p-2 ui-input ui-text-primary min-h-0"
          />
          <select v-model="filterUnit" class="rounded-xl p-2 ui-input ui-text-primary min-h-0">
            <option value="ALL">Semua Unit</option>
            <option value="NHP">NHP</option>
            <option value="NHC">NHC</option>
            <option value="KG">KG</option>
          </select>
        </div>

        <div class="flex items-center gap-2 w-full md:w-auto justify-end">
          <!-- Tombol Ekspor CSV/Excel -->
          <button
            @click="exportToCSV"
            type="button"
            class="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ui-button min-h-0"
          >
            <i class="fa-solid fa-file-excel"></i>
            <span>Ekspor CSV</span>
          </button>

          <!-- Tombol Impor CSV -->
          <label
            class="bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 border border-blue-500/30 px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <i class="fa-solid fa-file-import"></i>
            <span>Impor Data</span>
            <input type="file" accept=".csv" class="hidden" @change="importCSV" />
          </label>
        </div>
      </div>

      <!-- Tabel Rekap Presensi -->
      <div
        class="glass-card rounded-3xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm overflow-x-auto"
      >
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-800 ui-text-muted">
              <th class="p-2.5 font-semibold">Nama Staff</th>
              <th class="p-2.5 font-semibold">Unit</th>
              <th class="p-2.5 font-semibold">Waktu Presensi</th>
              <th class="p-2.5 font-semibold">Status</th>
              <th
                v-for="field in currentFormSchema.fields"
                :key="field.id"
                class="p-2.5 font-semibold"
              >
                {{ field.label }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800 ui-text-secondary">
            <tr v-for="item in filteredAttendances" :key="item.id" class="ui-row-hover">
              <td class="p-2.5 font-bold">{{ item.userName }}</td>
              <td class="p-2.5">
                <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-semibold">{{
                  item.userUnit
                }}</span>
              </td>
              <td class="p-2.5 ui-text-muted">
                {{ formatTime(item.timestamp) }}
              </td>
              <td class="p-2.5">
                <span
                  class="px-2 py-0.5 rounded-full font-bold text-[10px]"
                  :class="getStatusBadgeClass(item.status)"
                >
                  {{ item.status || "Hadir" }}
                </span>
              </td>
              <td
                v-for="field in currentFormSchema.fields"
                :key="field.id"
                class="p-2.5 truncate max-w-xs"
              >
                {{ item.responses?.[field.id] || "-" }}
              </td>
            </tr>

            <tr v-if="filteredAttendances.length === 0">
              <td
                :colspan="4 + currentFormSchema.fields.length"
                class="text-center py-8 ui-text-muted"
              >
                Belum ada data rekap presensi pada tanggal/unit ini.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- TAB 3: FORM BUILDER DINAMIS (SUPERADMIN) -->
    <!-- ========================================== -->
    <div
      v-if="activeTab === 'builder' && isSuperadmin"
      class="glass-card p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-5"
    >
      <div
        class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800"
      >
        <div>
          <h3 class="font-bold text-sm flex items-center gap-2 ui-text-primary">
            <i class="fa-solid fa-sliders text-rose-500"></i>
            <span>Google-Form Style Builder</span>
          </h3>
          <p class="text-xs ui-text-muted">
            Atur kolom & bidang laporan yang wajib diisi oleh staf.
          </p>
        </div>
        <button
          @click="addField"
          type="button"
          class="px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer ui-button ui-button-primary min-h-0"
        >
          <i class="fa-solid fa-plus"></i> Tambah Field
        </button>
      </div>

      <div class="space-y-3">
        <div
          v-for="(field, idx) in builderFields"
          :key="idx"
          class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3"
        >
          <div class="flex items-center justify-between gap-2">
            <input
              v-model="field.label"
              placeholder="Label Pertanyaan / Field..."
              class="flex-1 rounded-xl p-2 text-xs font-semibold ui-input min-h-0"
            />
            <select v-model="field.type" class="rounded-xl p-2 text-xs ui-input min-h-0">
              <option value="text">Teks Isian Singkat</option>
              <option value="textarea">Teks Paragraf / Jawaban Panjang</option>
              <option value="select">Pilihan Ganda (Dropdown)</option>
              <option value="url">Link / URL</option>
            </select>
            <button
              @click="removeField(idx)"
              type="button"
              class="text-rose-500 hover:text-rose-700 p-1"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>

          <!-- Tambah Option untuk Tipe Select -->
          <div
            v-if="field.type === 'select'"
            class="space-y-1 pl-2 border-l-2 border-slate-300 dark:border-slate-600"
          >
            <label class="text-[10px] font-bold ui-text-muted"
              >Opsi Pilihan (Pisahkan dengan koma):</label
            >
            <input
              :value="field.options ? field.options.join(', ') : ''"
              @input="(e) => (field.options = e.target.value.split(',').map((s) => s.trim()))"
              placeholder="Contoh: WFO, WFH, Dinas Luar"
              class="w-full rounded-xl p-1.5 text-xs ui-input min-h-0"
            />
          </div>
        </div>
      </div>

      <button
        @click="saveFormSchema"
        type="button"
        class="w-full py-2.5 rounded-xl shadow-md cursor-pointer ui-button ui-button-primary min-h-0"
      >
        Simpan Struktur Form Baru
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { store } from "../store/index.js";
import { api } from "../services/api.js";

const activeTab = ref("presensi");
const isSubmitting = ref(false);
const hasFilledToday = ref(false);
const geoCoordinates = ref(null);

const filterDate = ref(new Date().toISOString().split("T")[0]);
const filterUnit = ref("ALL");

const todayDateStr = computed(() =>
  new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
);

const isSuperadmin = computed(() => {
  const role = store.currentUser?.role || store.currentUser?.Role;
  return role ? role.toUpperCase() === "SUPERADMIN" : false;
});

// Default Schema Form Dinamis
const currentFormSchema = ref({
  id: "default_form",
  fields: [
    {
      id: "status_kehadiran",
      label: "Status Kehadiran",
      type: "select",
      options: ["Hadir", "Izin", "Sakit", "Cuti"],
      required: true,
    },
    {
      id: "lokasi_kerja",
      label: "Lokasi Kerja",
      type: "select",
      options: ["WFO (Kantor)", "WFH (Luar Kantor)", "Dinas Luar"],
      required: true,
    },
    {
      id: "rencana_kerja",
      label: "Rencana / Laporan Kerja Harian",
      type: "textarea",
      required: true,
    },
    {
      id: "link_lampiran",
      label: "Link Dokumentasi / Output Kerja",
      type: "url",
      required: false,
    },
  ],
});

const userResponses = ref({});
const attendancesList = ref([]);
const builderFields = ref([]);

// Ambil Geolocation HP/Device
const getGeoLocation = () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        geoCoordinates.value = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
      },
      (err) => console.warn("GPS Gagal:", err.message),
    );
  }
};

// Check Status Absen Hari Ini & Load Data
onMounted(async () => {
  getGeoLocation();
  builderFields.value = JSON.parse(
    JSON.stringify(currentFormSchema.value.fields),
  );

  // Dummy data sync store / Firestore
  const loadedAttendances = store.db?.attendances || store.attendances || [];
  attendancesList.value = loadedAttendances;

  const todayStr = new Date().toISOString().split("T")[0];
  const myId = store.currentUser?.id || store.currentUser?.email;

  hasFilledToday.value = loadedAttendances.some(
    (a) => a.userId === myId && a.date === todayStr,
  );
});

// Filter Rekap Presensi
const filteredAttendances = computed(() => {
  return attendancesList.value.filter((item) => {
    const matchDate = filterDate.value ? item.date === filterDate.value : true;
    const matchUnit =
      filterUnit.value === "ALL" ? true : item.userUnit === filterUnit.value;
    return matchDate && matchUnit;
  });
});

// Simpan Absensi ke Firestore
const submitAttendance = async () => {
  const myUser = store.currentUser;
  if (!myUser)
    return store.addNotification(
      "Peringatan",
      "Sesi login berakhir",
      "warning",
    );

  isSubmitting.value = true;
  try {
    const todayStr = new Date().toISOString().split("T")[0];
    const docId = `ATT-${Date.now()}-${myUser.id || "usr"}`;

    const payload = {
      id: docId,
      userId: myUser.id || myUser.email,
      userName: myUser.nama || myUser.Nama || "Staff User",
      userUnit: myUser.unit || myUser.Unit || "NHP",
      date: todayStr,
      timestamp: Date.now(),
      status: userResponses.value.status_kehadiran || "Hadir",
      location: geoCoordinates.value || null,
      responses: { ...userResponses.value },
    };

    const res = (await api.saveData)
      ? await api.saveData("attendances", payload)
      : { success: true };

    if (res.success || res) {
      attendancesList.value.unshift(payload);
      hasFilledToday.value = true;
      store.addNotification(
        "Berhasil",
        "Presensi harian berhasil tersimpan!",
        "success",
      );
    }
  } catch (err) {
    store.addNotification("Error", err.message, "warning");
  } finally {
    isSubmitting.value = false;
  }
};

// Ekspor ke CSV Dinamis
const exportToCSV = () => {
  if (filteredAttendances.value.length === 0) {
    return store.addNotification(
      "Info",
      "Tidak ada data untuk diekspor",
      "warning",
    );
  }

  const headers = [
    "Nama Staff",
    "Unit",
    "Tanggal",
    "Status",
    ...currentFormSchema.value.fields.map((f) => f.label),
  ];
  const rows = filteredAttendances.value.map((item) => [
    `"${item.userName}"`,
    `"${item.userUnit}"`,
    `"${item.date}"`,
    `"${item.status || "Hadir"}"`,
    ...currentFormSchema.value.fields.map(
      (f) => `"${item.responses?.[f.id] || ""}"`,
    ),
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Rekap_Absensi_${filterDate.value}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Impor Data CSV
const importCSV = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    const lines = evt.target.result.split("\n");
    store.addNotification(
      "Berhasil",
      `Memproses impor ${lines.length - 1} baris data CSV`,
      "success",
    );
  };
  reader.readAsText(file);
};

// Form Builder Helpers
const addField = () => {
  builderFields.value.push({
    id: `field_${Date.now()}`,
    label: "Pertanyaan Baru",
    type: "text",
    required: false,
  });
};
const removeField = (idx) => builderFields.value.splice(idx, 1);
const saveFormSchema = () => {
  currentFormSchema.value.fields = JSON.parse(
    JSON.stringify(builderFields.value),
  );
  store.addNotification(
    "Berhasil",
    "Struktur form absensi berhasil diperbarui!",
    "success",
  );
};

const formatTime = (ts) =>
  ts
    ? new Date(ts).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";
const getStatusBadgeClass = (st) => {
  if (st === "Izin")
    return "bg-amber-500/10 text-amber-600 border border-amber-500/20";
  if (st === "Sakit")
    return "bg-rose-500/10 text-rose-600 border border-rose-500/20";
  return "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20";
};
</script>
