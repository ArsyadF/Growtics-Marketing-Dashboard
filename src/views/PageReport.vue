<!-- src/views/PageReport.vue -->
<template>
  <div class="space-y-4 md:space-y-6">
    
    <!-- HEADER BAR & STRICT ACCESS INFO -->
    <div class="glass-card p-4 md:p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h3 class="text-sm md:text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <i class="fa-solid fa-file-invoice-dollar text-theme"></i>
          Pusat Laporan Eksekutif & Direksi
        </h3>
        <p class="text-[11px] md:text-xs text-slate-400 mt-0.5">
          Generator template laporan terstruktur untuk kebutuhan rapat evaluasi dan presentasi direksi.
        </p>
      </div>

      <!-- User Scope Badge -->
      <div class="flex items-center gap-2">
        <span class="text-[10px] font-bold uppercase px-3 py-1 rounded-full border text-theme bg-theme-gradient/10 border-theme/20">
          Akses: {{ userAccessRoleText }}
        </span>
      </div>
    </div>

    <!-- FILTER PERIODE LAPORAN -->
    <div class="glass-card p-4 rounded-2xl space-y-3">
      <h4 class="font-bold text-slate-800 dark:text-slate-100 text-xs uppercase tracking-wider flex items-center gap-2">
        <i class="fa-solid fa-filter text-theme"></i>
        Parameter & Range Tanggal Laporan
      </h4>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label class="block text-slate-400 font-medium mb-1">Cakupan Unit Usaha:</label>
          <select 
            v-model="reportFilter.unit" 
            :disabled="!isSuperadmin"
            class="w-full glass-input rounded-xl px-3 py-2 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none disabled:opacity-60 cursor-pointer"
          >
            <option value="ALL" v-if="isSuperadmin">Semua Unit (Konsolidasi Global)</option>
            <option value="NHP">Unit NHP</option>
            <option value="NHC">Unit NHC</option>
            <option value="KG">Unit KG</option>
          </select>
        </div>

        <div>
          <label class="block text-slate-400 font-medium mb-1">Tanggal Mulai:</label>
          <input 
            v-model="reportFilter.startDate" 
            type="date" 
            class="w-full glass-input rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 outline-none focus:border-theme"
          >
        </div>

        <div>
          <label class="block text-slate-400 font-medium mb-1">Tanggal Akhir:</label>
          <input 
            v-model="reportFilter.endDate" 
            type="date" 
            class="w-full glass-input rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 outline-none focus:border-theme"
          >
        </div>
      </div>
    </div>

    <!-- GRID TEMPLATE LAPORAN TERSEDIA -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      
      <!-- TEMPLATE 1: KINERJA FINANSIAL & OMZET -->
      <div class="glass-card p-4 md:p-5 rounded-2xl border border-white/20 dark:border-slate-800 hover:border-theme/40 transition-all space-y-3 flex flex-col justify-between">
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl text-base">
              <i class="fa-solid fa-chart-line"></i>
            </span>
            <span class="text-[9px] font-bold text-slate-400 uppercase">Template PDF / Excel</span>
          </div>
          <h4 class="font-bold text-slate-800 dark:text-slate-100 text-sm md:text-base">
            Laporan Kinerja Finansial & Omzet
          </h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Rekapitulasi total revenue terfilter vs target tahunan, selisih tahun lalu, dan breakdown omzet per platform & divisi.
          </p>
        </div>

        <div class="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <button 
            @click="generateReport('finansial')" 
            class="flex-1 bg-theme-gradient text-white py-2 rounded-xl text-xs font-bold shadow-md hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <i class="fa-solid fa-file-pdf"></i>
            <span>Cetak / Ekspor PDF</span>
          </button>
        </div>
      </div>

      <!-- TEMPLATE 2: PROMO & LEADS EFFICIENCY -->
      <div class="glass-card p-4 md:p-5 rounded-2xl border border-white/20 dark:border-slate-800 hover:border-theme/40 transition-all space-y-3 flex flex-col justify-between">
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="p-2 bg-rose-500/10 text-rose-500 rounded-xl text-base">
              <i class="fa-solid fa-bullhorn"></i>
            </span>
            <span class="text-[9px] font-bold text-slate-400 uppercase">Template PDF / Excel</span>
          </div>
          <h4 class="font-bold text-slate-800 dark:text-slate-100 text-sm md:text-base">
            Laporan Biaya Promosi & Conversi Leads
          </h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Analisis efisiensi biaya iklan vs perolehan leads, rasio follow up, dan persentase closing transaksi per unit usaha.
          </p>
        </div>

        <div class="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <button 
            @click="generateReport('promo-leads')" 
            class="flex-1 bg-theme-gradient text-white py-2 rounded-xl text-xs font-bold shadow-md hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <i class="fa-solid fa-file-pdf"></i>
            <span>Cetak / Ekspor PDF</span>
          </button>
        </div>
      </div>

      <!-- TEMPLATE 3: PROGRES OPERASIONAL & MILESTONE -->
      <div class="glass-card p-4 md:p-5 rounded-2xl border border-white/20 dark:border-slate-800 hover:border-theme/40 transition-all space-y-3 flex flex-col justify-between">
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="p-2 bg-amber-500/10 text-amber-500 rounded-xl text-base">
              <i class="fa-solid fa-diagram-project"></i>
            </span>
            <span class="text-[9px] font-bold text-slate-400 uppercase">Template PDF / Excel</span>
          </div>
          <h4 class="font-bold text-slate-800 dark:text-slate-100 text-sm md:text-base">
            Laporan Progres Operasional & Milestone Q1-Q4
          </h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Status pencapaian program kerja triwulanan divisi produksi, daftar program terlewat, dan evaluasi PIC penanggung jawab.
          </p>
        </div>

        <div class="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <button 
            @click="generateReport('progress')" 
            class="flex-1 bg-theme-gradient text-white py-2 rounded-xl text-xs font-bold shadow-md hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <i class="fa-solid fa-file-pdf"></i>
            <span>Cetak / Ekspor PDF</span>
          </button>
        </div>
      </div>

      <!-- TEMPLATE 4: DIGITAL MARKETING & SOSMED WEEKLY -->
      <div class="glass-card p-4 md:p-5 rounded-2xl border border-white/20 dark:border-slate-800 hover:border-theme/40 transition-all space-y-3 flex flex-col justify-between">
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="p-2 bg-blue-500/10 text-blue-500 rounded-xl text-base">
              <i class="fa-solid fa-share-nodes"></i>
            </span>
            <span class="text-[9px] font-bold text-slate-400 uppercase">Template PDF / Excel</span>
          </div>
          <h4 class="font-bold text-slate-800 dark:text-slate-100 text-sm md:text-base">
            Laporan Performa Sosmed & Digital Marketing
          </h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Ringkasan mingguan jangkauan (reach), engagement rate (ER%), dan konten paling berprestasi (content winners).
          </p>
        </div>

        <div class="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <button 
            @click="generateReport('digmar')" 
            class="flex-1 bg-theme-gradient text-white py-2 rounded-xl text-xs font-bold shadow-md hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <i class="fa-solid fa-file-pdf"></i>
            <span>Cetak / Ekspor PDF</span>
          </button>
        </div>
      </div>

    </div>

    <!-- PREVIEW PRATINJAU DOKUMEN (TELEPORT MODAL CETAK) -->
    <Teleport to="body">
      <div 
        v-if="isPreviewOpen" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md transition-opacity"
        @click.self="isPreviewOpen = false"
      >
        <div class="w-full max-w-2xl glass-card bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
          
          <!-- Header Preview -->
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 class="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                <i class="fa-solid fa-print text-theme"></i>
                Pratinjau Dokumen Laporan
              </h3>
              <p class="text-[10px] text-slate-400 mt-0.5">Dokumen siap dicetak atau diunduh</p>
            </div>
            <button @click="isPreviewOpen = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <!-- Dummy Preview Document Body -->
          <div class="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 font-mono text-xs text-slate-700 dark:text-slate-200">
            <div class="text-center border-b pb-3 border-slate-300 dark:border-slate-700">
              <h2 class="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                LAPORAN EKSKUTIF PERFORMA {{ previewData.type.toUpperCase() }}
              </h2>
              <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                Cakupan: Unit {{ reportFilter.unit }} | Periode: {{ reportFilter.startDate }} s/d {{ reportFilter.endDate }}
              </p>
            </div>

            <!-- Content Details -->
            <div class="space-y-2">
              <div class="flex justify-between">
                <span>Tanggal Cetak:</span>
                <strong>{{ currentDateStr }}</strong>
              </div>
              <div class="flex justify-between">
                <span>Dicetak Oleh:</span>
                <strong>{{ store.currentUser?.nama || 'Admin' }} ({{ store.currentUser?.role }})</strong>
              </div>
              <div class="flex justify-between">
                <span>Status Validasi:</span>
                <span class="text-emerald-500 font-bold">TERVERIFIKASI SISTEM</span>
              </div>
            </div>

            <div class="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] leading-relaxed">
              <strong>Ringkasan Eksekutif:</strong><br>
              Laporan ini memuat ringkasan performa operasional dan finansial terhitung sejak tanggal {{ reportFilter.startDate }} hingga {{ reportFilter.endDate }}. Seluruh angka disintesis secara otomatis oleh sistem Marketing v3.0.
            </div>
          </div>

          <!-- Action Print -->
          <div class="flex justify-end gap-2 pt-2">
            <button 
              @click="isPreviewOpen = false" 
              class="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-300 cursor-pointer"
            >
              Batal
            </button>
            <button 
              @click="printDocument" 
              class="bg-theme-gradient text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md hover:opacity-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <i class="fa-solid fa-print"></i>
              <span>Cetak / Download PDF</span>
            </button>
          </div>

        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { store } from '../store/index.js';

const isPreviewOpen = ref(false);
const previewData = reactive({ type: '' });

const reportFilter = reactive({
  unit: 'ALL',
  startDate: '',
  endDate: ''
});

const isSuperadmin = computed(() => {
  const role = store.currentUser?.role || store.currentUser?.Role;
  return role ? role.toUpperCase() === 'SUPERADMIN' : false;
});

const userAccessRoleText = computed(() => {
  if (isSuperadmin.value) return 'Superadmin (Akses Semua Unit)';
  const unit = store.currentUser?.aksesUnit ? store.currentUser.aksesUnit.join(', ') : (store.currentUser?.unit || 'NHP');
  return `Admin Unit (${unit})`;
});

const currentDateStr = computed(() => {
  return new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
});

onMounted(() => {
  // Sync dengan Filter Tanggal Store Global jika ada
  reportFilter.startDate = store.filterDates?.start || `${new Date().getFullYear()}-01-01`;
  reportFilter.endDate = store.filterDates?.end || new Date().toISOString().split('T')[0];

  if (!isSuperadmin.value && store.currentUser) {
    const userUnits = store.currentUser.aksesUnit || [store.currentUser.unit];
    if (userUnits.length > 0) {
      reportFilter.unit = userUnits[0];
    }
  }
});

const generateReport = (type) => {
  previewData.type = type;
  isPreviewOpen.value = true;
};

const printDocument = () => {
  window.print();
  isPreviewOpen.value = false;
  store.addNotification('Laporan Diekspor', `Dokumen Laporan ${previewData.type} berhasil dicetak`, 'success');
};
</script>