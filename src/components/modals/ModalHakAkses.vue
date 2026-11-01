<template>
  <!-- POP-UP MODAL PERINGATAN AKSES TERBATAS -->
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[10060] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div
        class="w-full max-w-sm glass-card rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-100 dark:border-slate-800 text-center"
      >
        <div
          class="w-14 h-14 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-2"
        >
          <i class="fa-solid fa-lock"></i>
        </div>

        <h3 class="font-semibold text-base ui-text-primary">Akses Terbatas</h3>

        <p class="text-xs leading-relaxed ui-text-description">
          {{ message }}
        </p>

        <!-- KUMPULAN TOMBOL AKSI -->
        <div class="space-y-2 pt-2">
          <!-- Tombol Login (Hanya muncul jika belum login) -->
          <button
            v-if="!isLoggedIn"
            @click="handleLogin"
            class="w-full py-2.5 rounded-xl shadow-md cursor-pointer text-xs flex items-center justify-center gap-2 transition-all ui-button min-h-0 px-0 ui-button-primary border-0"
          >
            <i class="fa-solid fa-right-to-bracket shrink-0"></i>
            <span>Login Akun</span>
          </button>

          <!-- Tombol Mengerti / Tutup Modal -->
          <button
            @click="closeModal"
            class="w-full py-2.5 rounded-xl font-medium transition-all text-xs cursor-pointer ui-button min-h-0 px-0 gap-0 glass-hover ui-text-secondary border-0"
            :class="{
              'bg-slate-100 dark:bg-slate-800/80 font-semibold': isLoggedIn,
            }"
          >
            {{ isLoggedIn ? "Mengerti" : "Nanti Saja" }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from "vue";
import { store } from "../../store";

// Mendefinisikan props yang dikirim dari parent (Sidebar.vue)
defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: "Anda tidak memiliki hak akses ke modul ini.",
  },
});

// Mendefinisikan emits untuk menutup modal
const emit = defineEmits(["close", "open-login"]);

const isLoggedIn = computed(() => !!store.currentUser);

const closeModal = () => {
  emit("close");
};

const handleLogin = () => {
  emit("close");
  emit("open-login");
};
</script>
