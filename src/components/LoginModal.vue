<!-- src/components/LoginModal.vue -->
<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-[10002] bg-slate-950/70 backdrop-blur-md flex justify-center items-center p-4"
  >
    <div class="glass-card bg-white/95 dark:bg-slate-900/95 w-full max-w-md p-6 md:p-8 rounded-3xl shadow-2xl border border-white/60 dark:border-blue-900/40 space-y-6 relative">
      
      <!-- Tombol Close Modal -->
      <button 
        @click="closeModal" 
        class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
      >
        <i class="fa-solid fa-xmark text-lg"></i>
      </button>

      <!-- Header Portal -->
      <div class="text-center space-y-2">
        <div class="inline-flex p-3 bg-gradient-to-tr from-blue-600 to-sky-400 text-white rounded-2xl shadow-lg text-2xl mb-2">
          <i class="fa-solid fa-chart-pie"></i>
        </div>
        <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100">Portal Marketing</h2>
        <p class="text-xs text-slate-500 dark:text-slate-400">Silakan masuk untuk akses fitur manajemen data.</p>
      </div>

      <!-- Pesan Error Login -->
      <div 
        v-if="errorMessage" 
        class="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500 text-xs font-semibold text-center"
      >
        {{ errorMessage }}
      </div>

      <!-- Form Login -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Email / Username
          </label>
          <input 
            v-model="email" 
            type="text" 
            required 
            placeholder="admin@marketing.com" 
            class="w-full glass-input rounded-xl p-3 text-xs outline-none"
          >
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Password
          </label>
          <input 
            v-model="password" 
            type="password" 
            required 
            placeholder="••••••••" 
            class="w-full glass-input rounded-xl p-3 text-xs outline-none"
          >
        </div>

        <button 
          type="submit" 
          :disabled="isSubmitting" 
          class="w-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md mt-2 disabled:opacity-50 cursor-pointer flex items-center justify-center"
        >
          <i v-if="!isSubmitting" class="fa-solid fa-right-to-bracket mr-2"></i>
          <i v-else class="fa-solid fa-circle-notch fa-spin mr-2 text-sm"></i>
          <span>{{ isSubmitting ? 'Memverifikasi...' : 'Masuk Aplikasi' }}</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { store } from '../store';
import { api } from '../services/api';

defineProps({
  isOpen: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['close', 'login-success']);

// State Input
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isSubmitting = ref(false);

const closeModal = () => {
  store.closeModal();
  emit('close');
};

// Handler Autentikasi Login (Menggunakan api.js)
const handleLogin = async () => {
  errorMessage.value = '';
  isSubmitting.value = true;

  try {
    // Memanggil api.validateUserLogin yang menangani kapitalisasi field 'Email' & 'email'
    const res = await api.validateUserLogin(email.value.trim(), password.value);

    if (res.success) {
      // 1. Simpan data user yang berhasil login ke State Store Global & LocalStorage
      store.setCurrentUser(res.user);
      store.isAccessGranted = true;
      
      // 2. Fetch seluruh database Firestore untuk role terautentikasi
      await store.loadFullDatabase();
      
      // 3. Emit event & Tutup Modal Login
      emit('login-success', res.user);
      closeModal();
    } else {
      errorMessage.value = res.message || 'Email atau Password salah!';
    }
  } catch (error) {
    console.error("Login Error:", error);
    errorMessage.value = 'Terjadi kesalahan sistem saat mencoba login: ' + error.message;
  } finally {
    isSubmitting.value = false;
  }
};
</script>