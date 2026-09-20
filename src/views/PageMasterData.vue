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
          Kelola entitas utama secara independen. Perubahan disimpan secara
          terpisah.
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
          class="bg-button text-white font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
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
        <div v-for="u in unitList" :key="u.code">
          <label class="block text-slate-500 font-semibold mb-1"
            >Target Unit {{ u.code }}:</label
          >
          <input
            v-model.number="targets['Target' + u.code]"
            type="number"
            :placeholder="'Rp Target ' + u.code"
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
            class="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs gap-2"
          >
            <!-- Mode Edit Unit -->
            <template v-if="editingUnitIndex === idx">
              <input
                v-model="editingUnitCode"
                type="text"
                class="w-20 glass-input rounded-lg px-2 py-1 uppercase font-bold text-blue-600 dark:bg-slate-900"
              />
              <input
                v-model="editingUnitName"
                type="text"
                class="flex-1 glass-input rounded-lg px-2 py-1 text-slate-700 dark:text-slate-200 dark:bg-slate-900"
              />
              <button
                @click="saveEditUnit(idx)"
                type="button"
                class="text-emerald-600 hover:text-emerald-700 p-1"
                title="Simpan"
              >
                <i class="fa-solid fa-check"></i>
              </button>
              <button
                @click="cancelEditUnit"
                type="button"
                class="text-slate-400 hover:text-slate-600 p-1"
                title="Batal"
              >
                <i class="fa-solid fa-xmark"></i>
              </button>
            </template>

            <!-- Mode Display Unit -->
            <template v-else>
              <div class="flex items-center gap-1.5 flex-1 truncate">
                <span
                  class="font-black text-blue-600 dark:text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded text-[10px] uppercase border border-blue-500/20 shrink-0"
                >
                  {{ u.code }}
                </span>
                <span
                  class="font-semibold text-slate-700 dark:text-slate-200 truncate"
                  >{{ u.name }}</span
                >
              </div>
              <div class="flex items-center gap-1">
                <button
                  @click="startEditUnit(idx)"
                  type="button"
                  class="text-slate-400 hover:text-blue-500 p-1 cursor-pointer"
                  title="Edit Unit"
                >
                  <i class="fa-solid fa-pen text-xs"></i>
                </button>
                <button
                  @click="removeUnit(idx)"
                  type="button"
                  class="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                  title="Hapus Unit"
                >
                  <i class="fa-solid fa-trash-can text-xs"></i>
                </button>
              </div>
            </template>
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
            class="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs gap-2"
          >
            <!-- Mode Edit Divisi -->
            <template v-if="editingDivisiIndex === idx">
              <input
                v-model="editingDivisiName"
                type="text"
                class="flex-1 glass-input rounded-lg px-2 py-1 text-slate-700 dark:text-slate-200 dark:bg-slate-900"
              />
              <button
                @click="saveEditDivisi(idx)"
                type="button"
                class="text-emerald-600 hover:text-emerald-700 p-1"
                title="Simpan"
              >
                <i class="fa-solid fa-check"></i>
              </button>
              <button
                @click="cancelEditDivisi"
                type="button"
                class="text-slate-400 hover:text-slate-600 p-1"
                title="Batal"
              >
                <i class="fa-solid fa-xmark"></i>
              </button>
            </template>

            <!-- Mode Display Divisi -->
            <template v-else>
              <span
                class="font-semibold text-slate-700 dark:text-slate-200 truncate flex-1"
                >{{ d }}</span
              >
              <div class="flex items-center gap-1">
                <button
                  @click="startEditDivisi(idx)"
                  type="button"
                  class="text-slate-400 hover:text-emerald-600 p-1 cursor-pointer"
                  title="Edit Divisi"
                >
                  <i class="fa-solid fa-pen text-xs"></i>
                </button>
                <button
                  @click="removeDivisi(idx)"
                  type="button"
                  class="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                  title="Hapus Divisi"
                >
                  <i class="fa-solid fa-trash-can text-xs"></i>
                </button>
              </div>
            </template>
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
            class="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs gap-2"
          >
            <!-- Mode Edit Platform -->
            <template v-if="editingPlatformIndex === idx">
              <input
                v-model="editingPlatformName"
                type="text"
                class="flex-1 glass-input rounded-lg px-2 py-1 text-slate-700 dark:text-slate-200 dark:bg-slate-900"
              />
              <button
                @click="saveEditPlatform(idx)"
                type="button"
                class="text-purple-600 hover:text-purple-700 p-1"
                title="Simpan"
              >
                <i class="fa-solid fa-check"></i>
              </button>
              <button
                @click="cancelEditPlatform"
                type="button"
                class="text-slate-400 hover:text-slate-600 p-1"
                title="Batal"
              >
                <i class="fa-solid fa-xmark"></i>
              </button>
            </template>

            <!-- Mode Display Platform -->
            <template v-else>
              <span
                class="font-semibold text-slate-700 dark:text-slate-200 truncate flex-1"
                >{{ p }}</span
              >
              <div class="flex items-center gap-1">
                <button
                  @click="startEditPlatform(idx)"
                  type="button"
                  class="text-slate-400 hover:text-purple-600 p-1 cursor-pointer"
                  title="Edit Platform"
                >
                  <i class="fa-solid fa-pen text-xs"></i>
                </button>
                <button
                  @click="removePlatform(idx)"
                  type="button"
                  class="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                  title="Hapus Platform"
                >
                  <i class="fa-solid fa-trash-can text-xs"></i>
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { store } from "../store";
import { api } from "../services/api";

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
});

// State Form Tambah Baru
const newUnitCode = ref("");
const newUnitName = ref("");
const newDivisiName = ref("");
const newPlatformName = ref("");

// State Inline Edit Item
const editingUnitIndex = ref(null);
const editingUnitCode = ref("");
const editingUnitName = ref("");

const editingDivisiIndex = ref(null);
const editingDivisiName = ref("");

const editingPlatformIndex = ref(null);
const editingPlatformName = ref("");

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
  unitList.value.forEach((u) => {
    targets["Target" + u.code] = Number(master["Target" + u.code] || 300000000);
  });
});

// --- HELPER INLINE EDIT UNIT USAHA ---
const startEditUnit = (idx) => {
  editingUnitIndex.value = idx;
  editingUnitCode.value = unitList.value[idx].code;
  editingUnitName.value = unitList.value[idx].name;
};

const saveEditUnit = (idx) => {
  if (!editingUnitCode.value.trim() || !editingUnitName.value.trim()) return;
  unitList.value[idx] = {
    code: editingUnitCode.value.trim().toUpperCase(),
    name: editingUnitName.value.trim(),
  };
  cancelEditUnit();
};

const cancelEditUnit = () => {
  editingUnitIndex.value = null;
  editingUnitCode.value = "";
  editingUnitName.value = "";
};

const addUnit = () => {
  if (!newUnitCode.value.trim() || !newUnitName.value.trim()) return;
  const code = newUnitCode.value.trim().toUpperCase();
  unitList.value.push({ code, name: newUnitName.value.trim() });
  if (targets["Target" + code] === undefined) targets["Target" + code] = 0;
  newUnitCode.value = "";
  newUnitName.value = "";
};

const removeUnit = (idx) => {
  unitList.value.splice(idx, 1);
};

// --- HELPER INLINE EDIT DIVISI ---
const startEditDivisi = (idx) => {
  editingDivisiIndex.value = idx;
  editingDivisiName.value = divisiList.value[idx];
};

const saveEditDivisi = (idx) => {
  if (!editingDivisiName.value.trim()) return;
  divisiList.value[idx] = editingDivisiName.value.trim();
  cancelEditDivisi();
};

const cancelEditDivisi = () => {
  editingDivisiIndex.value = null;
  editingDivisiName.value = "";
};

const addDivisi = () => {
  if (!newDivisiName.value.trim()) return;
  divisiList.value.push(newDivisiName.value.trim());
  newDivisiName.value = "";
};

const removeDivisi = (idx) => {
  divisiList.value.splice(idx, 1);
};

// --- HELPER INLINE EDIT PLATFORM ---
const startEditPlatform = (idx) => {
  editingPlatformIndex.value = idx;
  editingPlatformName.value = platformList.value[idx];
};

const saveEditPlatform = (idx) => {
  if (!editingPlatformName.value.trim()) return;
  platformList.value[idx] = editingPlatformName.value.trim();
  cancelEditPlatform();
};

const cancelEditPlatform = () => {
  editingPlatformIndex.value = null;
  editingPlatformName.value = "";
};

const addPlatform = () => {
  if (!newPlatformName.value.trim()) return;
  platformList.value.push(newPlatformName.value.trim());
  newPlatformName.value = "";
};

const removePlatform = (idx) => {
  platformList.value.splice(idx, 1);
};

// --- SIMPAN TERPISAH KE FIRESTORE ---
const saveTargetsOnly = async () => {
  savingState.targets = true;
  if (!store.db.master) store.db.master = {};
  Object.assign(store.db.master, targets);

  try {
    if (api && api.saveMasterTargetsOnly) {
      await api.saveMasterTargetsOnly(targets);
    }
    store.addNotification(
      "Target Disimpan",
      "Master target revenue diperbarui",
      "success",
    );
  } catch (err) {
    store.addNotification("Gagal Simpan", err.message, "warning");
  } finally {
    savingState.targets = false;
  }
};

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
      "Master unit usaha diperbarui",
      "success",
    );
  } catch (err) {
    store.addNotification("Gagal Simpan", err.message, "warning");
  } finally {
    savingState.units = false;
  }
};

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
      "Master divisi diperbarui",
      "success",
    );
  } catch (err) {
    store.addNotification("Gagal Simpan", err.message, "warning");
  } finally {
    savingState.divisions = false;
  }
};

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
      "Master platform sales diperbarui",
      "success",
    );
  } catch (err) {
    store.addNotification("Gagal Simpan", err.message, "warning");
  } finally {
    savingState.platforms = false;
  }
};
</script>
