<!-- src/views/PageMasterData.vue -->
<template>
  <div class="space-y-4 md:space-y-6">
    <!-- HEADER BAR -->
    <div
      class="glass-card p-4 md:p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div>
        <h3
          class="text-sm md:text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"
        >
          <i class="fa-solid fa-sliders text-theme"></i>
          Manajemen Master Data & Target System
        </h3>
        <p class="text-[11px] md:text-xs text-slate-400 mt-0.5">
          Kelola entitas utama secara independen. Perubahan pada tiap bagian
          disave secara terpisah.
        </p>
      </div>
    </div>

    <!-- SECTION 1: MASTER TARGET REVENUE (GLOBAL & UNIT) -->
    <div
      class="glass-card p-4 md:p-5 rounded-2xl space-y-4 border border-emerald-500/20 bg-emerald-500/5"
    >
      <div
        class="flex items-center justify-between border-b border-emerald-500/20 pb-3"
      >
        <h4
          class="font-bold text-xs md:text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2"
        >
          <i class="fa-solid fa-bullseye text-theme"></i>
          Master Target Revenue (1 Tahun)
        </h4>
        <button
          @click="saveTargetsOnly"
          :disabled="savingState.targets"
          type="button"
          class="bg-button hover:bg-button text-white font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <i
            class="fa-solid fa-floppy-disk"
            :class="{ 'fa-spin': savingState.targets }"
          ></i>
          <span>{{ savingState.targets ? "Simpan..." : "Simpan Target" }}</span>
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div>
          <label class="block text-slate-500 font-semibold mb-1"
            >Target Global (1 Tahun):</label
          >
          <input
            v-model.number="targets.TargetTahunIni"
            type="number"
            placeholder="Rp Target Global"
            class="w-full glass-input rounded-xl px-3 py-2 font-bold text-emerald-600 outline-none dark:bg-slate-800"
          />
        </div>
        <div>
          <label class="block text-slate-500 font-semibold mb-1"
            >Target Unit NHP:</label
          >
          <input
            v-model.number="targets.TargetNHP"
            type="number"
            placeholder="Rp Target NHP"
            class="w-full glass-input rounded-xl px-3 py-2 font-bold text-slate-800 dark:text-slate-100 outline-none dark:bg-slate-800"
          />
        </div>
        <div>
          <label class="block text-slate-500 font-semibold mb-1"
            >Target Unit NHC:</label
          >
          <input
            v-model.number="targets.TargetNHC"
            type="number"
            placeholder="Rp Target NHC"
            class="w-full glass-input rounded-xl px-3 py-2 font-bold text-slate-800 dark:text-slate-100 outline-none dark:bg-slate-800"
          />
        </div>
        <div>
          <label class="block text-slate-500 font-semibold mb-1"
            >Target Unit KG:</label
          >
          <input
            v-model.number="targets.TargetKG"
            type="number"
            placeholder="Rp Target KG"
            class="w-full glass-input rounded-xl px-3 py-2 font-bold text-slate-800 dark:text-slate-100 outline-none dark:bg-slate-800"
          />
        </div>
      </div>
    </div>

    <!-- GRID MANAGEMENT 3 KOLOM ENTITAS INDEPENDEN -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-start">
      <!-- 2. MASTER UNIT USAHA -->
      <div
        class="glass-card p-4 rounded-2xl space-y-4 border border-white/50 dark:border-slate-800"
      >
        <div
          class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5"
        >
          <h4
            class="font-bold text-xs md:text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2"
          >
            <i class="fa-solid fa-building text-blue-500"></i>
            Master Unit Usaha
          </h4>
          <button
            @click="saveUnitsOnly"
            :disabled="savingState.units"
            type="button"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1 rounded-xl text-xs shadow-sm transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <i
              class="fa-solid fa-floppy-disk"
              :class="{ 'fa-spin': savingState.units }"
            ></i>
            <span>{{ savingState.units ? "..." : "Simpan Unit" }}</span>
          </button>
        </div>

        <form @submit.prevent="addUnit" class="flex gap-2">
          <input
            v-model="newUnitCode"
            type="text"
            placeholder="Kode (NHP)"
            required
            class="w-1/3 glass-input rounded-xl px-2.5 py-1.5 text-xs outline-none dark:bg-slate-800 uppercase font-bold text-slate-800 dark:text-slate-100"
          />
          <input
            v-model="newUnitName"
            type="text"
            placeholder="Nama Lengkap Unit..."
            required
            class="flex-1 glass-input rounded-xl px-2.5 py-1.5 text-xs outline-none dark:bg-slate-800 text-slate-800 dark:text-slate-100"
          />
          <button
            type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-sm cursor-pointer"
          >
            <i class="fa-solid fa-plus"></i>
          </button>
        </form>

        <div class="space-y-2 max-h-[360px] overflow-y-auto pr-1">
          <div
            v-for="(u, idx) in unitList"
            :key="idx"
            class="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs"
          >
            <div>
              <span
                class="font-black text-blue-600 dark:text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded text-[10px] mr-1.5 uppercase border border-blue-500/20"
              >
                {{ u.code }}
              </span>
              <span class="font-semibold text-slate-700 dark:text-slate-200">{{
                u.name
              }}</span>
            </div>
            <button
              @click="removeUnit(idx)"
              type="button"
              class="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
            >
              <i class="fa-solid fa-trash-can text-xs"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- 3. MASTER DIVISI -->
      <div
        class="glass-card p-4 rounded-2xl space-y-4 border border-white/50 dark:border-slate-800"
      >
        <div
          class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5"
        >
          <h4
            class="font-bold text-xs md:text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2"
          >
            <i class="fa-solid fa-sitemap text-emerald-600"></i>
            Master Divisi
          </h4>
          <button
            @click="saveDivisionsOnly"
            :disabled="savingState.divisions"
            type="button"
            class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded-xl text-xs shadow-sm transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <i
              class="fa-solid fa-floppy-disk"
              :class="{ 'fa-spin': savingState.divisions }"
            ></i>
            <span>{{ savingState.divisions ? "..." : "Simpan Divisi" }}</span>
          </button>
        </div>

        <form @submit.prevent="addDivisi" class="flex gap-2">
          <input
            v-model="newDivisiName"
            type="text"
            placeholder="Nama Divisi Baru..."
            required
            class="flex-1 glass-input rounded-xl px-2.5 py-1.5 text-xs outline-none dark:bg-slate-800 text-slate-800 dark:text-slate-100"
          />
          <button
            type="submit"
            class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-sm cursor-pointer"
          >
            <i class="fa-solid fa-plus"></i>
          </button>
        </form>

        <div class="space-y-2 max-h-[360px] overflow-y-auto pr-1">
          <div
            v-for="(d, idx) in divisiList"
            :key="idx"
            class="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs"
          >
            <span class="font-semibold text-slate-700 dark:text-slate-200">{{
              d
            }}</span>
            <button
              @click="removeDivisi(idx)"
              type="button"
              class="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
            >
              <i class="fa-solid fa-trash-can text-xs"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- 4. MASTER PLATFORM SALES -->
      <div
        class="glass-card p-4 rounded-2xl space-y-4 border border-white/50 dark:border-slate-800"
      >
        <div
          class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5"
        >
          <h4
            class="font-bold text-xs md:text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2"
          >
            <i class="fa-solid fa-store text-purple-600"></i>
            Master Platform Sales
          </h4>
          <button
            @click="savePlatformsOnly"
            :disabled="savingState.platforms"
            type="button"
            class="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3 py-1 rounded-xl text-xs shadow-sm transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <i
              class="fa-solid fa-floppy-disk"
              :class="{ 'fa-spin': savingState.platforms }"
            ></i>
            <span>{{ savingState.platforms ? "..." : "Simpan Platform" }}</span>
          </button>
        </div>

        <form @submit.prevent="addPlatform" class="flex gap-2">
          <input
            v-model="newPlatformName"
            type="text"
            placeholder="Nama Platform Baru..."
            required
            class="flex-1 glass-input rounded-xl px-2.5 py-1.5 text-xs outline-none dark:bg-slate-800 text-slate-800 dark:text-slate-100"
          />
          <button
            type="submit"
            class="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-sm cursor-pointer"
          >
            <i class="fa-solid fa-plus"></i>
          </button>
        </form>

        <div class="space-y-2 max-h-[360px] overflow-y-auto pr-1">
          <div
            v-for="(p, idx) in platformList"
            :key="idx"
            class="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs"
          >
            <span class="font-semibold text-slate-700 dark:text-slate-200">{{
              p
            }}</span>
            <button
              @click="removePlatform(idx)"
              type="button"
              class="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
            >
              <i class="fa-solid fa-trash-can text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { store } from "../store/index.js";
import { api } from "../services/api.js";

// Status loading indikator independen
const savingState = reactive({
  targets: false,
  units: false,
  divisions: false,
  platforms: false,
});

const unitList = ref([]);
const divisiList = ref([]);
const platformList = ref([]);

const targets = reactive({
  TargetTahunIni: 1000000000,
  TargetNHP: 400000000,
  TargetNHC: 350000000,
  TargetKG: 250000000,
});

const newUnitCode = ref("");
const newUnitName = ref("");
const newDivisiName = ref("");
const newPlatformName = ref("");

onMounted(() => {
  const master = store.db?.master || {};

  unitList.value = master.unitList || [
    { code: "NHP", name: "Unit Nur Hidayah Press" },
    { code: "NHC", name: "Unit Nur Hidayah Creative" },
    { code: "KG", name: "Unit Karta Grafika" },
  ];

  divisiList.value = master.divisiList || [
    "CS Deal",
    "Zona 1A",
    "Zona 1B",
    "Zona 2",
    "Zona 3",
    "Digital Marketing",
    "Offline",
    "Penerbitan & Cetak",
    "Produksi & Logistik",
  ];

  platformList.value = master.platformList || [
    "Shopee",
    "TikTok Shop",
    "WhatsApp",
    "Website",
    "Siplah",
    "Toko Ladang",
    "Blibli",
    "Event",
    "Mitra",
    "Kunjungan",
    "Konsinyasi",
  ];

  targets.TargetTahunIni = Number(master.TargetTahunIni || 1000000000);
  targets.TargetNHP = Number(master.TargetNHP || 400000000);
  targets.TargetNHC = Number(master.TargetNHC || 350000000);
  targets.TargetKG = Number(master.TargetKG || 250000000);
});

// Helper tambah / hapus item lokal
const addUnit = () => {
  if (!newUnitCode.value.trim() || !newUnitName.value.trim()) return;
  unitList.value.push({
    code: newUnitCode.value.trim().toUpperCase(),
    name: newUnitName.value.trim(),
  });
  newUnitCode.value = "";
  newUnitName.value = "";
};
const removeUnit = (idx) => {
  unitList.value.splice(idx, 1);
};

const addDivisi = () => {
  if (!newDivisiName.value.trim()) return;
  divisiList.value.push(newDivisiName.value.trim());
  newDivisiName.value = "";
};
const removeDivisi = (idx) => {
  divisiList.value.splice(idx, 1);
};

const addPlatform = () => {
  if (!newPlatformName.value.trim()) return;
  platformList.value.push(newPlatformName.value.trim());
  newPlatformName.value = "";
};
const removePlatform = (idx) => {
  platformList.value.splice(idx, 1);
};

// 1. Simpan Hanya Target Revenue
const saveTargetsOnly = async () => {
  savingState.targets = true;
  if (!store.db.master) store.db.master = {};

  store.db.master.TargetTahunIni = targets.TargetTahunIni;
  store.db.master.TargetNHP = targets.TargetNHP;
  store.db.master.TargetNHC = targets.TargetNHC;
  store.db.master.TargetKG = targets.TargetKG;

  try {
    if (api && api.saveMasterTargetsOnly) {
      await api.saveMasterTargetsOnly(targets);
    }
    store.addNotification(
      "Target Disimpan",
      "Master target revenue berhasil diperbarui",
      "success",
    );
  } catch (err) {
    store.addNotification("Gagal Simpan", err.message, "warning");
  } finally {
    savingState.targets = false;
  }
};

// 2. Simpan Hanya Master Unit Usaha
const saveUnitsOnly = async () => {
  savingState.units = true;
  if (!store.db.master) store.db.master = {};
  store.db.master.unitList = [...unitList.value];

  try {
    if (api && api.saveMasterUnitsOnly) {
      await api.saveMasterUnitsOnly(unitList.value);
    }
    store.addNotification(
      "Unit Disimpan",
      "Master unit usaha berhasil diperbarui",
      "success",
    );
  } catch (err) {
    store.addNotification("Gagal Simpan", err.message, "warning");
  } finally {
    savingState.units = false;
  }
};

// 3. Simpan Hanya Master Divisi
const saveDivisionsOnly = async () => {
  savingState.divisions = true;
  if (!store.db.master) store.db.master = {};
  store.db.master.divisiList = [...divisiList.value];

  try {
    if (api && api.saveMasterDivisionsOnly) {
      await api.saveMasterDivisionsOnly(divisiList.value);
    }
    store.addNotification(
      "Divisi Disimpan",
      "Master divisi berhasil diperbarui",
      "success",
    );
  } catch (err) {
    store.addNotification("Gagal Simpan", err.message, "warning");
  } finally {
    savingState.divisions = false;
  }
};

// 4. Simpan Hanya Master Platform Sales
const savePlatformsOnly = async () => {
  savingState.platforms = true;
  if (!store.db.master) store.db.master = {};
  store.db.master.platformList = [...platformList.value];

  try {
    if (api && api.saveMasterPlatformsOnly) {
      await api.saveMasterPlatformsOnly(platformList.value);
    }
    store.addNotification(
      "Platform Disimpan",
      "Master platform sales berhasil diperbarui",
      "success",
    );
  } catch (err) {
    store.addNotification("Gagal Simpan", err.message, "warning");
  } finally {
    savingState.platforms = false;
  }
};
</script>
