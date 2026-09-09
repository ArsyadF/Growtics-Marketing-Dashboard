<!-- src/components/Modals.vue -->
<template>
  <div>
    <!-- 1. Modal Input/Edit Revenue -->
    <div v-if="store.activeModal === 'revenue'" class="fixed inset-0 bg-slate-950/70 z-50 flex justify-center items-center p-4 backdrop-blur-md">
      <div class="glass-card bg-white/95 dark:bg-slate-900/95 rounded-3xl w-full max-w-lg p-6 space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="font-bold text-slate-800 dark:text-slate-100">{{ isEditRevenue ? 'Edit' : 'Input' }} Revenue</h3>
          <button @click="store.closeModal()" class="text-slate-400 hover:text-slate-600 cursor-pointer"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <form @submit.prevent="saveRevenue" class="space-y-3">
          <div>
            <label class="block text-xs mb-1 font-medium">Tanggal</label>
            <input type="date" v-model="formRev.Tanggal" required class="w-full glass-input rounded-xl p-2.5 text-xs outline-none">
          </div>

          <div>
            <label class="block text-xs mb-1 font-medium">Unit Usaha</label>
            <select v-model="formRev.Unit" class="w-full glass-input rounded-xl p-2.5 text-xs dark:bg-slate-800 outline-none">
              <option value="NHP">NHP</option>
              <option value="NHC">NHC</option>
              <option value="KG">KG</option>
            </select>
          </div>

          <div>
            <label class="block text-xs mb-1 font-medium">Revenue (Rp)</label>
            <input 
              type="text" 
              v-model="displayRevRevenue" 
              @input="handleInputFormatted($event, formRev, 'Revenue', 'displayRevRevenue')" 
              required 
              placeholder="0" 
              class="w-full glass-input rounded-xl p-2.5 text-xs outline-none"
            >
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs mb-1 font-medium">Divisi</label>
              <select v-model="formRev.Divisi" required class="w-full glass-input rounded-xl p-2.5 text-xs dark:bg-slate-800 outline-none">
                <option value="CS Deal">CS Deal</option>
                <option value="Zona 1A">Zona 1A</option>
                <option value="Zona 1B">Zona 1B</option>
                <option value="Zona 2">Zona 2</option>
                <option value="Zona 3">Zona 3</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Offline">Offline</option>
              </select>
            </div>

            <div>
              <label class="block text-xs mb-1 font-medium">Platform</label>
              <select v-model="formRev.Platform" required class="w-full glass-input rounded-xl p-2.5 text-xs dark:bg-slate-800 outline-none">
                <option value="Shopee">Shopee</option>
                <option value="TikTok Shop">TikTok Shop</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Website">Website</option>
                <option value="Siplah">Siplah</option>
                <option value="Toko Ladang">Toko Ladang</option>
                <option value="Blibli">Blibli</option>
                <option value="Event">Event</option>
                <option value="Mitra">Mitra</option>
                <option value="Kunjungan">Kunjungan</option>
                <option value="Konsinyasi">Konsinyasi</option>
              </select>
            </div>
          </div>

          <button type="submit" class="w-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold py-2.5 rounded-xl text-xs shadow-md mt-2 cursor-pointer">
            Simpan Revenue
          </button>
        </form>
      </div>
    </div>

    <!-- 2. Modal Input/Edit Leads & Campaign -->
    <div v-if="store.activeModal === 'leads'" class="fixed inset-0 bg-slate-950/70 z-50 flex justify-center items-center p-4 backdrop-blur-md">
      <div class="glass-card bg-white/95 dark:bg-slate-900/95 rounded-3xl w-full max-w-lg p-6 space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="font-bold text-slate-800 dark:text-slate-100">{{ isEditLeads ? 'Edit' : 'Input' }} Leads & Campaign</h3>
          <button @click="store.closeModal()" class="text-slate-400 hover:text-slate-600 cursor-pointer"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <form @submit.prevent="saveLeads" class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs mb-1 font-medium">Tanggal</label>
              <input type="date" v-model="formLeads.Tanggal" required class="w-full glass-input rounded-xl p-2.5 text-xs outline-none">
            </div>
            <div>
              <label class="block text-xs mb-1 font-medium">Unit Usaha</label>
              <select v-model="formLeads.Unit" class="w-full glass-input rounded-xl p-2.5 text-xs dark:bg-slate-800 outline-none">
                <option value="NHP">NHP</option>
                <option value="NHC">NHC</option>
                <option value="KG">KG</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs mb-1 font-medium">Campaign</label>
              <input type="number" v-model.number="formLeads.Campaign" required placeholder="0" class="w-full glass-input rounded-xl p-2.5 text-xs outline-none">
            </div>
            <div>
              <label class="block text-xs mb-1 font-medium">Database Leads</label>
              <input type="number" v-model.number="formLeads.DatabaseLeads" required placeholder="0" class="w-full glass-input rounded-xl p-2.5 text-xs outline-none">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs mb-1 font-medium">Follow Up</label>
              <input type="number" v-model.number="formLeads.FollowUp" required placeholder="0" class="w-full glass-input rounded-xl p-2.5 text-xs outline-none">
            </div>
            <div>
              <label class="block text-xs mb-1 font-medium">Pesanan (Closing)</label>
              <input type="number" v-model.number="formLeads.Pesanan" required placeholder="0" class="w-full glass-input rounded-xl p-2.5 text-xs outline-none">
            </div>
          </div>

          <button type="submit" class="w-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold py-2.5 rounded-xl text-xs shadow-md mt-2 cursor-pointer">
            Simpan Data Leads
          </button>
        </form>
      </div>
    </div>

    <!-- 3. Modal Input/Edit Biaya Promosi -->
    <div v-if="store.activeModal === 'promo'" class="fixed inset-0 bg-slate-950/70 z-50 flex justify-center items-center p-4 backdrop-blur-md">
      <div class="glass-card bg-white/95 dark:bg-slate-900/95 rounded-3xl w-full max-w-md p-6 space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="font-bold text-slate-800 dark:text-slate-100">{{ isEditPromo ? 'Edit' : 'Input' }} Biaya Promosi</h3>
          <button @click="store.closeModal()" class="text-slate-400 hover:text-slate-600 cursor-pointer"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <form @submit.prevent="savePromo" class="space-y-3">
          <div>
            <label class="block text-xs mb-1 font-medium">Tanggal</label>
            <input type="date" v-model="formPromo.Tanggal" required class="w-full glass-input rounded-xl p-2.5 text-xs outline-none">
          </div>

          <div>
            <label class="block text-xs mb-1 font-medium">Unit Usaha</label>
            <select v-model="formPromo.Unit" class="w-full glass-input rounded-xl p-2.5 text-xs dark:bg-slate-800 outline-none">
              <option value="NHP">NHP</option>
              <option value="NHC">NHC</option>
              <option value="KG">KG</option>
            </select>
          </div>

          <div>
            <label class="block text-xs mb-1 font-medium text-rose-500">Biaya Promosi (Rp)</label>
            <input 
              type="text" 
              v-model="displayPromoBiaya" 
              @input="handleInputFormatted($event, formPromo, 'BiayaPromosi', 'displayPromoBiaya')" 
              required 
              placeholder="0" 
              class="w-full glass-input rounded-xl p-2.5 text-xs outline-none"
            >
          </div>

          <button type="submit" class="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold py-2.5 rounded-xl text-xs shadow-md mt-2 cursor-pointer">
            Simpan Biaya Promosi
          </button>
        </form>
      </div>
    </div>

    <!-- 4. Modal Target Settings -->
    <div v-if="store.activeModal === 'target'" class="fixed inset-0 bg-slate-950/70 z-50 flex justify-center items-center p-4 backdrop-blur-md">
      <div class="glass-card bg-white/95 dark:bg-slate-900/95 rounded-3xl w-full max-w-md p-6 space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="font-bold text-slate-800 dark:text-slate-100">Update Target Revenue</h3>
          <button @click="store.closeModal()" class="text-slate-400 hover:text-slate-600 cursor-pointer"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form @submit.prevent="saveTargets" class="space-y-3">
          <div>
            <label class="block text-xs mb-1">Target Global (Rp)</label>
            <input type="text" v-model="displayTargetTahunIni" @input="handleInputFormatted($event, formTarget, 'TargetTahunIni', 'displayTargetTahunIni')" required class="w-full glass-input rounded-xl p-2.5 text-xs outline-none">
          </div>
          <div>
            <label class="block text-xs mb-1">Target NHP (Rp)</label>
            <input type="text" v-model="displayTargetNHP" @input="handleInputFormatted($event, formTarget, 'TargetNHP', 'displayTargetNHP')" required class="w-full glass-input rounded-xl p-2.5 text-xs outline-none">
          </div>
          <div>
            <label class="block text-xs mb-1">Target NHC (Rp)</label>
            <input type="text" v-model="displayTargetNHC" @input="handleInputFormatted($event, formTarget, 'TargetNHC', 'displayTargetNHC')" required class="w-full glass-input rounded-xl p-2.5 text-xs outline-none">
          </div>
          <div>
            <label class="block text-xs mb-1">Target KG (Rp)</label>
            <input type="text" v-model="displayTargetKG" @input="handleInputFormatted($event, formTarget, 'TargetKG', 'displayTargetKG')" required class="w-full glass-input rounded-xl p-2.5 text-xs outline-none">
          </div>
          <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md mt-2 cursor-pointer">Simpan Master Targets</button>
        </form>
      </div>
    </div>

    <!-- 5. Modal User (Tambah / Edit) -->
    <div v-if="store.activeModal === 'user'" class="fixed inset-0 bg-slate-950/70 z-50 flex justify-center items-center p-4 backdrop-blur-md">
      <div class="glass-card bg-white/95 dark:bg-slate-900/95 rounded-3xl w-full max-w-md p-6 space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="font-bold text-slate-800 dark:text-slate-100">{{ isEditUser ? 'Edit' : 'Tambah' }} Pengguna</h3>
          <button @click="store.closeModal()" class="text-slate-400 hover:text-slate-600 cursor-pointer"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form @submit.prevent="saveUser" class="space-y-3">
          <div>
            <label class="block text-xs mb-1 font-medium">Nama Lengkap</label>
            <input type="text" v-model="formUser.name" required class="w-full glass-input rounded-xl p-2.5 text-xs outline-none">
          </div>
          <div>
            <label class="block text-xs mb-1 font-medium">Email / Username</label>
            <input type="text" v-model="formUser.email" required class="w-full glass-input rounded-xl p-2.5 text-xs outline-none">
          </div>
          <div>
            <label class="block text-xs mb-1 font-medium">Password</label>
            <input type="password" v-model="formUser.password" placeholder="••••••••" class="w-full glass-input rounded-xl p-2.5 text-xs outline-none">
          </div>
          <div>
            <label class="block text-xs mb-1 font-medium">Role / Hak Akses</label>
            <select v-model="formUser.role" class="w-full glass-input rounded-xl p-2.5 text-xs dark:bg-slate-800 outline-none">
              <option value="SUPERADMIN">Super Admin (Akses Semua)</option>
              <option value="ADMIN_UNIT">Admin Unit</option>
            </select>
          </div>
          <div v-if="formUser.role === 'ADMIN_UNIT'">
            <label class="block text-xs mb-1 font-medium">Akses Spesifik Unit</label>
            <select v-model="formUser.unit" class="w-full glass-input rounded-xl p-2.5 text-xs dark:bg-slate-800 outline-none">
              <option value="NHP">Unit NHP</option>
              <option value="NHC">Unit NHC</option>
              <option value="KG">Unit KG</option>
            </select>
          </div>
          <button type="submit" class="w-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold py-2.5 rounded-xl text-xs shadow-md mt-2 cursor-pointer">
            Simpan Pengguna
          </button>
        </form>
      </div>
    </div>

    <!-- 6. Modal Kode Akses (Passcode Publik) -->
    <div v-if="store.activeModal === 'kodeakses'" class="fixed inset-0 bg-slate-950/70 z-50 flex justify-center items-center p-4 backdrop-blur-md">
      <div class="glass-card bg-white/95 dark:bg-slate-900/95 rounded-3xl w-full max-w-md p-6 space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="font-bold text-slate-800 dark:text-slate-100">Update Passcode Publik</h3>
          <button @click="store.closeModal()" class="text-slate-400 hover:text-slate-600 cursor-pointer"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form @submit.prevent="savePasscode" class="space-y-3">
          <div>
            <label class="block text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">Kode Akses Publik (PIN / Passcode)</label>
            <input type="text" v-model="formPasscode.code" required placeholder="Contoh: 0" class="w-full glass-input rounded-xl p-2.5 text-xs font-mono outline-none">
          </div>
          <button type="submit" class="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-2.5 rounded-xl text-xs shadow-md mt-2 cursor-pointer">
            Simpan Passcode
          </button>
        </form>
      </div>
    </div>

    <!-- 7. Modal Alert / Konfirmasi (Pengganti alert() & confirm() JS) -->
    <div v-if="store.activeModal === 'alert'" class="fixed inset-0 bg-slate-950/70 z-[60] flex justify-center items-center p-4 backdrop-blur-md">
      <div class="glass-card bg-white/95 dark:bg-slate-900/95 rounded-3xl w-full max-w-sm p-6 space-y-4 text-center shadow-2xl">
        
        <!-- Ikon Alert -->
        <div class="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-xl"
          :class="store.alertPayload.type === 'warning' ? 'bg-amber-500/10 text-amber-500' : (store.alertPayload.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500')">
          <i class="fa-solid" :class="store.alertPayload.type === 'warning' ? 'fa-triangle-exclamation' : (store.alertPayload.type === 'success' ? 'fa-circle-check' : 'fa-circle-info')"></i>
        </div>

        <div>
          <h3 class="font-bold text-slate-800 dark:text-slate-100 text-base">
            {{ store.alertPayload.title || 'Pemberitahuan' }}
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {{ store.alertPayload.message }}
          </p>
        </div>

        <!-- Tombol Aksi -->
        <div class="flex gap-2 pt-2">
          <button 
            v-if="store.alertPayload.onConfirm"
            @click="store.closeAlert()" 
            class="flex-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-2.5 rounded-xl text-xs cursor-pointer hover:bg-slate-300"
          >
            Batal
          </button>
          
          <button 
            @click="handleAlertConfirm" 
            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md cursor-pointer"
          >
            {{ store.alertPayload.onConfirm ? 'Ya, Lanjutkan' : 'OK' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { store } from '../store';
import { api } from '../services/api';

// --- HELPER FUNCTION FORMAT RIBUAN ---
function formatThousand(val) {
  if (val === null || val === undefined || val === '') return '';
  const cleanVal = String(val).replace(/\D/g, '');
  if (!cleanVal) return '';
  return new Intl.NumberFormat('id-ID').format(cleanVal);
}

// Variables untuk Binding Tampilan Input Rupiah
const displayRevRevenue = ref('');
const displayPromoBiaya = ref('');
const displayTargetTahunIni = ref('');
const displayTargetNHP = ref('');
const displayTargetNHC = ref('');
const displayTargetKG = ref('');

// Handler Event @input
function handleInputFormatted(event, targetFormObj, targetProp, displayRefName) {
  const inputVal = event.target.value;
  const cleanVal = inputVal.replace(/\D/g, '');
  const numVal = cleanVal ? Number(cleanVal) : 0;

  targetFormObj[targetProp] = numVal;

  const formatted = formatThousand(cleanVal);
  if (displayRefName === 'displayRevRevenue') displayRevRevenue.value = formatted;
  else if (displayRefName === 'displayPromoBiaya') displayPromoBiaya.value = formatted;
  else if (displayRefName === 'displayTargetTahunIni') displayTargetTahunIni.value = formatted;
  else if (displayRefName === 'displayTargetNHP') displayTargetNHP.value = formatted;
  else if (displayRefName === 'displayTargetNHC') displayTargetNHC.value = formatted;
  else if (displayRefName === 'displayTargetKG') displayTargetKG.value = formatted;
}

// --- REACTIVE FORM STATES ---
const formRev = reactive({
  Tanggal: new Date().toISOString().split('T')[0], 
  Unit: 'NHP', 
  Revenue: 0, 
  Divisi: 'CS Deal', 
  Platform: 'Shopee'
});

const formLeads = reactive({
  Tanggal: new Date().toISOString().split('T')[0],
  Unit: 'NHP',
  Campaign: 0,
  DatabaseLeads: 0,
  FollowUp: 0,
  Pesanan: 0
});

const formPromo = reactive({
  Tanggal: new Date().toISOString().split('T')[0],
  Unit: 'NHP',
  BiayaPromosi: 0
});

const formTarget = reactive({
  TargetTahunIni: 0, TargetNHP: 0, TargetNHC: 0, TargetKG: 0
});

const formUser = reactive({
  name: '', email: '', password: '', role: 'ADMIN_UNIT', unit: 'NHP'
});

const formPasscode = reactive({
  code: '0'
});

// --- COMPUTED EDIT STATES ---
const isEditRevenue = computed(() => {
  if (store.activeModal !== 'revenue' || !store.editPayload) return false;
  const p = store.editPayload;
  return !!(p.id || p.Timestamp || p.Revenue !== undefined || p.revenue !== undefined);
});

const isEditLeads = computed(() => {
  if (store.activeModal !== 'leads' || !store.editPayload) return false;
  const p = store.editPayload;
  return !!(p.id || p.Timestamp || p.Campaign !== undefined || p.DatabaseLeads !== undefined);
});

const isEditPromo = computed(() => {
  if (store.activeModal !== 'promo' || !store.editPayload) return false;
  const p = store.editPayload;
  return !!(p.id || p.Timestamp || p.BiayaPromosi !== undefined || p.biayaPromosi !== undefined);
});

const isEditUser = computed(() => store.activeModal === 'user' && !!store.editPayload?.id);

// --- WATCHER UTAMA UNTUK SINKRONISASI SEMUA MODAL ---
watch(() => store.activeModal, (newVal) => {
  if (!newVal) return;

  const raw = store.editPayload ? JSON.parse(JSON.stringify(store.editPayload)) : null;

  if (newVal === 'revenue') {
    if (raw && (raw.id || raw.Timestamp || raw.Revenue !== undefined || raw.revenue !== undefined)) {
      formRev.Tanggal = (raw.Tanggal || raw.tanggal) 
        ? String(raw.Tanggal || raw.tanggal).substring(0, 10) 
        : new Date().toISOString().split('T')[0];
      formRev.Unit = raw.Unit || raw.unit || 'NHP';
      formRev.Revenue = Number(raw.Revenue ?? raw.revenue ?? 0);
      formRev.Divisi = raw.Divisi || raw.divisi || 'CS Deal';
      formRev.Platform = raw.Platform || raw.platform || 'Shopee';
    } else {
      const defaultUnit = raw?.Unit || raw?.unit || 'NHP';
      formRev.Tanggal = new Date().toISOString().split('T')[0];
      formRev.Unit = defaultUnit;
      formRev.Revenue = 0;
      formRev.Divisi = 'CS Deal';
      formRev.Platform = 'Shopee';
    }
    displayRevRevenue.value = formatThousand(formRev.Revenue);
  } 
  else if (newVal === 'leads') {
    if (raw && (raw.id || raw.Timestamp || raw.Campaign !== undefined || raw.DatabaseLeads !== undefined)) {
      formLeads.Tanggal = (raw.Tanggal || raw.tanggal) 
        ? String(raw.Tanggal || raw.tanggal).substring(0, 10) 
        : new Date().toISOString().split('T')[0];
      formLeads.Unit = raw.Unit || raw.unit || 'NHP';
      formLeads.Campaign = Number(raw.Campaign ?? raw.campaign ?? 0);
      formLeads.DatabaseLeads = Number(raw.DatabaseLeads ?? raw.databaseLeads ?? 0);
      formLeads.FollowUp = Number(raw.FollowUp ?? raw.followUp ?? 0);
      formLeads.Pesanan = Number(raw.Pesanan ?? raw.pesanan ?? 0);
    } else {
      const defaultUnit = raw?.Unit || raw?.unit || 'NHP';
      formLeads.Tanggal = new Date().toISOString().split('T')[0];
      formLeads.Unit = defaultUnit;
      formLeads.Campaign = 0;
      formLeads.DatabaseLeads = 0;
      formLeads.FollowUp = 0;
      formLeads.Pesanan = 0;
    }
  } 
  else if (newVal === 'promo') {
    if (raw && (raw.id || raw.Timestamp || raw.BiayaPromosi !== undefined || raw.biayaPromosi !== undefined)) {
      formPromo.Tanggal = (raw.Tanggal || raw.tanggal) 
        ? String(raw.Tanggal || raw.tanggal).substring(0, 10) 
        : new Date().toISOString().split('T')[0];
      formPromo.Unit = raw.Unit || raw.unit || 'NHP';
      formPromo.BiayaPromosi = Number(raw.BiayaPromosi ?? raw.biayaPromosi ?? 0);
    } else {
      const defaultUnit = raw?.Unit || raw?.unit || 'NHP';
      formPromo.Tanggal = new Date().toISOString().split('T')[0];
      formPromo.Unit = defaultUnit;
      formPromo.BiayaPromosi = 0;
    }
    displayPromoBiaya.value = formatThousand(formPromo.BiayaPromosi);
  }
  else if (newVal === 'target') {
    if (store.db.master) {
      Object.assign(formTarget, JSON.parse(JSON.stringify(store.db.master)));
    }
    displayTargetTahunIni.value = formatThousand(formTarget.TargetTahunIni);
    displayTargetNHP.value = formatThousand(formTarget.TargetNHP);
    displayTargetNHC.value = formatThousand(formTarget.TargetNHC);
    displayTargetKG.value = formatThousand(formTarget.TargetKG);
  } 
  else if (newVal === 'user') {
    if (raw && raw.id) {
      Object.assign(formUser, {
        name: raw.nama || raw.name || '',
        email: raw.email || '',
        password: '',
        role: raw.role || 'ADMIN_UNIT',
        unit: Array.isArray(raw.aksesUnit) ? raw.aksesUnit[0] : (raw.unit || 'NHP')
      });
    } else {
      Object.assign(formUser, { name: '', email: '', password: '', role: 'ADMIN_UNIT', unit: 'NHP' });
    }
  } 
  else if (newVal === 'kodeakses') {
    formPasscode.code = String(store.db.master?.KodeAkses || '0');
  }
}, { immediate: true });

// --- SAVE ACTIONS TO FIRESTORE ---
async function saveRevenue() {
  store.isLoading = true;
  try {
    const rawData = store.editPayload ? JSON.parse(JSON.stringify(store.editPayload)) : {};
    const docId = rawData.id || rawData.Timestamp;

    if (isEditRevenue.value && docId) {
      await api.updateData('revenues', docId, formRev);
    } else {
      await api.saveData('revenues', formRev);
    }
    await store.loadFullDatabase();
    store.closeModal();
  } catch (err) {
    store.openAlert("Gagal Menyimpan", "Gagal menyimpan Revenue: " + err.message, null, "warning");
  } finally {
    store.isLoading = false;
  }
}

async function saveLeads() {
  store.isLoading = true;
  try {
    const rawData = store.editPayload ? JSON.parse(JSON.stringify(store.editPayload)) : {};
    const docId = rawData.id || rawData.Timestamp;

    if (isEditLeads.value && docId) {
      await api.updateData('leads', docId, formLeads);
    } else {
      await api.saveData('leads', formLeads);
    }
    await store.loadFullDatabase();
    store.closeModal();
  } catch (err) {
    store.openAlert("Gagal Menyimpan", "Gagal menyimpan Leads: " + err.message, null, "warning");
  } finally {
    store.isLoading = false;
  }
}

async function savePromo() {
  store.isLoading = true;
  try {
    const rawData = store.editPayload ? JSON.parse(JSON.stringify(store.editPayload)) : {};
    const docId = rawData.id || rawData.Timestamp;

    if (isEditPromo.value && docId) {
      await api.updateData('promosi', docId, formPromo);
    } else {
      await api.saveData('promosi', formPromo);
    }
    await store.loadFullDatabase();
    store.closeModal();
  } catch (err) {
    store.openAlert("Gagal Menyimpan", "Gagal menyimpan Biaya Promosi: " + err.message, null, "warning");
  } finally {
    store.isLoading = false;
  }
}

async function saveTargets() {
  store.isLoading = true;
  try {
    const res = await api.saveMasterTargets(formTarget);
    if (res.success) {
      await store.loadFullDatabase();
      store.closeModal();
    } else {
      store.openAlert("Perhatian", res.message, null, "warning");
    }
  } catch (err) {
    store.openAlert("Gagal Menyimpan", "Gagal menyimpan Target: " + err.message, null, "warning");
  } finally {
    store.isLoading = false;
  }
}

async function saveUser() {
  store.isLoading = true;
  try {
    const payload = {
      nama: formUser.name,
      email: formUser.email,
      password: formUser.password,
      role: formUser.role,
      aksesUnit: formUser.role === 'SUPERADMIN' ? ['NHP', 'NHC', 'KG'] : [formUser.unit],
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(formUser.name)}`
    };

    if (isEditUser.value) {
      await api.updateData('Users', store.editPayload.id, payload);
    } else {
      await api.saveData('Users', payload);
    }
    await store.loadFullDatabase();
    store.closeModal();
  } catch (err) {
    store.openAlert("Gagal Menyimpan", "Gagal menyimpan Pengguna: " + err.message, null, "warning");
  } finally {
    store.isLoading = false;
  }
}

async function savePasscode() {
  store.isLoading = true;
  try {
    const res = await api.saveMasterTargets({ KodeAkses: formPasscode.code });
    if (res.success) {
      store.db.master.KodeAkses = formPasscode.code;
      store.closeModal();
      store.openAlert("Berhasil", "Passcode Publik berhasil diperbarui!", null, "success");
    } else {
      store.openAlert("Perhatian", res.message, null, "warning");
    }
  } catch (err) {
    store.openAlert("Gagal Menyimpan", "Gagal memperbarui Passcode: " + err.message, null, "warning");
  } finally {
    store.isLoading = false;
  }
}

function handleAlertConfirm() {
  if (store.alertPayload.onConfirm && typeof store.alertPayload.onConfirm === 'function') {
    store.alertPayload.onConfirm();
  }
  store.closeAlert();
}
</script>