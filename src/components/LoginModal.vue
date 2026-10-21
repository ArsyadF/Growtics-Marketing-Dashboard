<!-- src/components/LoginModal.vue -->
<template>
  <BaseModal maxWidth="max-w-md" @close="closeModal">
    <template #header>
      <button
        @click="closeModal"
        class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer z-10"
      >
        <i class="fa-solid fa-xmark text-base"></i>
      </button>
    </template>

    <div class="text-center space-y-2 mb-6 pt-2">
      <div
        class="inline-flex p-3 bg-button text-white rounded-2xl shadow-lg text-xl mb-2"
      >
        <i class="fa-solid fa-chart-pie"></i>
      </div>
      <h2 class="text-xl font-semibold text-slate-800 dark:text-slate-100">
        Portal Marketing
      </h2>
      <p class="text-xs text-slate-500 font-normal">
        Silakan masuk untuk akses fitur manajemen data.
      </p>
    </div>

    <div
      v-if="errorMessage"
      class="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500 text-xs font-semibold text-center"
    >
      {{ errorMessage }}
    </div>

    <form @submit.prevent="handleLogin" class="space-y-4 text-sm md:text-xs">
      <div>
        <label
          class="block font-semibold text-slate-600 dark:text-slate-300 mb-1"
          >Email / Username</label
        >
        <input
          v-model="email"
          type="text"
          required
          class="w-full glass-input rounded-xl p-3 outline-none"
        />
      </div>
      <div>
        <label
          class="block font-semibold text-slate-600 dark:text-slate-300 mb-1"
          >Password</label
        >
        <input
          v-model="password"
          type="password"
          required
          class="w-full glass-input rounded-xl p-3 outline-none"
        />
      </div>
      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full bg-button text-white font-semibold py-3 rounded-xl transition-all shadow-md mt-2 disabled:opacity-50 flex items-center justify-center cursor-pointer"
      >
        <i
          v-if="!isSubmitting"
          class="fa-solid fa-right-to-bracket mr-2 text-xs"
        ></i>
        <i v-else class="fa-solid fa-circle-notch fa-spin mr-2 text-xs"></i>
        <span>{{ isSubmitting ? "Memverifikasi..." : "Masuk Aplikasi" }}</span>
      </button>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref } from "vue";
import { store } from "../store";
import { api } from "../services/api";
import BaseModal from "./BaseModal.vue";

const emit = defineEmits(["close", "login-success"]);
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const isSubmitting = ref(false);

const closeModal = () => {
  store.closeModal();
  emit("close");
};

const handleLogin = async () => {
  errorMessage.value = "";
  isSubmitting.value = true;
  try {
    const res = await api.validateUserLogin(email.value.trim(), password.value);
    if (res.success) {
      store.setCurrentUser(res.user);
      store.isAccessGranted = true;
      await store.loadFullDatabase();
      emit("login-success", res.user);
      closeModal();
    } else {
      errorMessage.value = res.message || "Email atau Password salah!";
    }
  } catch (error) {
    errorMessage.value = "Terjadi kesalahan sistem.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>
