<!-- src/components/PasscodeModal.vue -->
<template>
  <div v-if="!store.isAccessGranted" class="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-xl flex justify-center items-center p-4">
    <div class="glass-card bg-white/95 dark:bg-slate-900/95 w-full max-w-sm p-6 md:p-8 rounded-3xl shadow-2xl border border-white/60 dark:border-blue-900/40 space-y-5 text-center relative z-[10000]">
      <div class="inline-flex p-3.5 bg-gradient-to-tr from-amber-500 to-orange-400 text-white rounded-2xl shadow-lg text-2xl">
        <i class="fa-solid fa-lock"></i>
      </div>
      <div>
        <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100">Area Terproteksi</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Masukkan Kode Akses Publik untuk membuka visualisasi Dashboard.</p>
      </div>

      <form @submit.prevent="verify" class="space-y-4">
        <div>
          <input 
            type="password" 
            v-model="passcode" 
            maxlength="20" 
            required 
            placeholder="Masukkan Kode Akses..." 
            class="w-full glass-input rounded-xl p-3 text-center font-bold tracking-widest text-sm outline-none"
          >
        </div>
        <button 
          type="submit" 
          :disabled="loading" 
          class="w-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md flex items-center justify-center"
        >
          <i v-if="loading" class="fa-solid fa-spinner fa-spin mr-1.5"></i>
          <span v-else><i class="fa-solid fa-key mr-1.5"></i>Buka Dashboard</span>
        </button>
      </form>

      <div class="pt-2 border-t border-slate-200/50 dark:border-slate-800/80">
        <button type="button" @click="store.openModal('login')" class="text-xs text-blue-500 hover:underline font-semibold cursor-pointer">
          <i class="fa-solid fa-user-shield mr-1"></i>Login Pengelola (Admin)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { store } from '../store';
import { api } from '../services/api';

const passcode = ref('');
const loading = ref(false);

async function verify() {
  if (!passcode.value) return;
  loading.value = true;
  store.isLoading = true; // Munculkan indikator loading global

  try {
    const res = await api.getPublicDataWithPasscode(passcode.value);
    if (res && res.success) {
      store.parseDB(res.data);
      store.isAccessGranted = true; // Buka kunci visual halaman
      store.currentPage = 'main';
      passcode.value = '';
    } else {
      alert(res?.message || 'Kode akses publik salah!');
    }
  } catch (err) {
    alert("Terjadi kesalahan sistem: " + err.message);
  } finally {
    loading.value = false;
    store.isLoading = false;
  }
}
</script>