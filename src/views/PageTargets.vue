<!-- src/views/PageTargets.vue -->
<template>
  <section id="page-targets" class="page-section space-y-4 md:space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100">Rekapitulasi Target vs Realisasi</h2>
        <p class="text-slate-400 text-xs">Pantau progres ketercapaian target revenue per unit bisnis.</p>
      </div>
        <button 
         v-if="store.canEditPage('target')"  
        @click="store.openModal('target')" 
        class="bg-gradient-to-r from-blue-600 to-sky-500 text-white px-4 py-2.5 rounded-xl font-medium text-xs shadow-md hover:from-blue-700 hover:to-sky-600 w-full sm:w-auto cursor-pointer"
      >
        <i class="fa-solid fa-plus mr-1.5"></i>Edit Target Master
      </button>
    </div>

   
    <!-- Table Targets -->
    <div class="glass-card p-4 rounded-2xl md:rounded-1xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full text-xs text-left">
          <thead class="bg-white/40 dark:bg-slate-800/60 text-slate-400">
            <tr>
              <th class="py-3 px-4">Kategori Target</th>
              <th class="py-3 px-4">Target (Rp)</th>
              <th class="py-3 px-4">Realisasi (Rp)</th>
              <th class="py-3 px-4">Sisa Target (Rp)</th>
              <th class="py-3 px-4">Capaian (%)</th>
            </tr>
          </thead>
          <tbody class="divide-y dark:divide-slate-800/80">
            <tr v-if="store.isLoading">
              <td colspan="5" class="text-center py-6 text-slate-400">Memuat data target & realisasi...</td>
            </tr>
            <tr v-else v-for="t in listTargets" :key="t.name" class="hover:bg-white/20 dark:hover:bg-slate-800/40">
              <td class="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-100">{{ t.name }}</td>
              <td class="py-3.5 px-4 font-semibold">{{ formatRp(t.target) }}</td>
              <td class="py-3.5 px-4 text-emerald-500 font-bold">{{ formatRp(t.real) }}</td>
              <td class="py-3.5 px-4 text-rose-500 font-semibold">
                {{ formatRp(t.target - t.real > 0 ? t.target - t.real : 0) }}
              </td>
              <td class="py-3.5 px-4">
                <div class="flex items-center gap-2">
                  <span 
                    class="px-2.5 py-1 rounded-full text-[11px] font-bold min-w-[55px] text-center"
                    :class="getCapaianBadgeClass(t.capaian)"
                  >
                    {{ t.capaian }}%
                  </span>
                  <!-- Progress Bar Mini -->
                  <div class="w-20 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden hidden sm:block">
                    <div 
                      class="h-full rounded-full transition-all duration-500"
                      :class="getCapaianBarClass(t.capaian)"
                      :style="{ width: `${Math.min(t.capaian, 100)}%` }"
                    ></div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { store } from '../store';

const formatRp = (num) => new Intl.NumberFormat('id-ID', { 
  style: 'currency', 
  currency: 'IDR', 
  minimumFractionDigits: 0 
}).format(num || 0);

// Helper penyaring tanggal
function isDateInFilter(dateStr) {
  if (!dateStr) return false;
  const targetDate = String(dateStr).substring(0, 10);
  const startDate = store.filterDates?.start;
  const endDate = store.filterDates?.end;

  if (startDate && targetDate < startDate) return false;
  if (endDate && targetDate > endDate) return false;
  return true;
}

const listTargets = computed(() => {
  const m = store.db?.master || {};
  const rev = Array.isArray(store.db?.revenue) ? store.db.revenue : [];

  const tGlob = Number(m.TargetTahunIni || 0);
  const tNHP = Number(m.TargetNHP || 0);
  const tNHC = Number(m.TargetNHC || 0);
  const tKG = Number(m.TargetKG || 0);

  // Helper kalkulasi revenue yang aman dari error undefined
  const getRev = (unit) => {
    return rev
      .filter(r => {
        if (!isDateInFilter(r.Tanggal)) return false;
        if (unit && r.Unit !== unit) return false;
        return true;
      })
      .reduce((sum, r) => sum + Number(r.Revenue || r.revenue || 0), 0);
  };

  const calculateCapaian = (real, target) => {
    if (!target || target <= 0) return '0.0';
    return ((real / target) * 100).toFixed(1);
  };

  const realGlob = getRev(null);
  const realNHP = getRev('NHP');
  const realNHC = getRev('NHC');
  const realKG = getRev('KG');

  return [
    { 
      name: 'Target Global 1 Tahun', 
      target: tGlob, 
      real: realGlob, 
      capaian: calculateCapaian(realGlob, tGlob) 
    },
    { 
      name: 'Target Unit NHP', 
      target: tNHP, 
      real: realNHP, 
      capaian: calculateCapaian(realNHP, tNHP) 
    },
    { 
      name: 'Target Unit NHC', 
      target: tNHC, 
      real: realNHC, 
      capaian: calculateCapaian(realNHC, tNHC) 
    },
    { 
      name: 'Target Unit KG', 
      target: tKG, 
      real: realKG, 
      capaian: calculateCapaian(realKG, tKG) 
    }
  ];
});

// Styling Badge
const getCapaianBadgeClass = (capaianVal) => {
  const val = Number(capaianVal);
  if (val >= 100) return 'bg-emerald-500/10 text-emerald-500';
  if (val >= 50) return 'bg-blue-500/10 text-blue-500';
  if (val > 0) return 'bg-amber-500/10 text-amber-500';
  return 'bg-slate-500/10 text-slate-400';
};

// Styling Progress Bar
const getCapaianBarClass = (capaianVal) => {
  const val = Number(capaianVal);
  if (val >= 100) return 'bg-emerald-500';
  if (val >= 50) return 'bg-blue-500';
  if (val > 0) return 'bg-amber-500';
  return 'bg-slate-400';
};
</script>