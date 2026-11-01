<!-- src/components/PasscodeModal.vue -->
<template>
  <div
    v-if="!store.isAccessGranted"
    class="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-xl flex justify-center items-center p-4"
  >
    <div
      class="glass-card w-full max-w-sm p-6 md:p-8 rounded-3xl shadow-2xl border border-white/60 dark:border-blue-900/40 space-y-5 text-center relative z-[10000]"
    >
      <div
        class="inline-flex p-3.5 bg-gradient-to-tr from-amber-500 to-orange-400 text-white rounded-2xl shadow-lg text-xl"
      >
        <i class="fa-solid fa-lock"></i>
      </div>
      <div>
        <h3 class="text-xl font-semibold ui-text-primary">Area Terproteksi</h3>
        <p class="text-xs mt-1 font-normal ui-text-description">
          Masukkan Kode Akses Publik untuk membuka visualisasi Dashboard.
        </p>
      </div>

      <form @submit.prevent="verify" class="space-y-4 ui-text-body">
        <div>
          <input
            type="password"
            v-model="passcode"
            maxlength="20"
            required
            placeholder="Masukkan Kode Akses..."
            class="w-full rounded-xl p-3 text-center font-semibold tracking-widest text-sm ui-input ui-input-inherit min-h-0"
          />
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 rounded-xl transition-all shadow-md flex items-center justify-center cursor-pointer disabled:opacity-50 ui-button min-h-0 px-0 gap-0 ui-button-primary ui-text-body border-0"
        >
          <i v-if="loading" class="fa-solid fa-spinner fa-spin mr-1.5 text-xs"></i>
          <span v-else><i class="fa-solid fa-key mr-1.5 text-xs"></i>Buka Dashboard</span>
        </button>
      </form>

      <div class="pt-2 border-t border-slate-200/50 dark:border-slate-800/80">
        <button
          type="button"
          @click="store.openModal('login')"
          class="text-theme hover:underline font-semibold cursor-pointer ui-text-body"
        >
          <i class="fa-solid fa-user-shield mr-1"></i>Login
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { store } from "../store";
import { api } from "../services/api";

const passcode = ref("");
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
      store.currentPage = "main";
      passcode.value = "";
    } else {
      alert(res?.message || "Kode akses publik salah!");
    }
  } catch (err) {
    alert("Terjadi kesalahan sistem: " + err.message);
  } finally {
    loading.value = false;
    store.isLoading = false;
  }
}
</script>
