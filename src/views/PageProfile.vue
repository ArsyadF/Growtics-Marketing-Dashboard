<!-- src/views/PageProfile.vue -->
<template>
  <section id="page-profile" class="page-section space-y-4 md:space-y-6">
    <div class="glass-card p-6 rounded-3xl max-w-2xl mx-auto space-y-6">
      <!-- Profile Display Header -->
      <div
        class="flex items-center gap-5 border-b border-slate-200/50 dark:border-slate-800/80 pb-6"
      >
        <div class="relative group cursor-pointer" @click="triggerFileInput">
          <img
            :src="avatarPreviewUrl"
            alt="Avatar Profile"
            class="w-20 h-20 rounded-full object-cover border-2 border-theme shadow-lg shrink-0 transition-all group-hover:brightness-90"
          />
          <div
            class="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <i class="fa-solid fa-camera text-white text-lg"></i>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">
            {{
              userProfile.Nama ||
              userProfile.nama ||
              userProfile.name ||
              "Admin User"
            }}
          </h3>
          <p class="text-xs text-theme font-semibold uppercase">
            {{ userProfile.Role || userProfile.role || "Super Admin" }}
          </p>
          <p class="text-[11px] text-slate-400 mt-0.5">
            {{ userProfile.Email || userProfile.email || "-" }}
          </p>
        </div>
      </div>

      <!-- Form Update Profile -->
      <form @submit.prevent="saveUserProfile" class="space-y-4">
        <div>
          <label
            class="block text-xs font-medium mb-1 text-slate-600 dark:text-slate-300"
          >
            Nama Lengkap
          </label>
          <input
            v-model="form.nama"
            type="text"
            required
            class="w-full glass-input rounded-xl p-2.5 text-xs outline-none"
          />
        </div>

        <!-- src/views/PageProfile.vue - Sisipkan di dalam <form> -->

        <div class="grid grid-cols-2 gap-4">
          <!-- DROPDOWN UNIT (Master Data) -->
          <div>
            <label
              class="block text-xs font-medium mb-1 text-slate-600 dark:text-slate-300"
            >
              Unit Usaha Utama
            </label>
            <select
              v-model="form.unit"
              class="w-full glass-input rounded-xl p-2.5 text-xs outline-none bg-white dark:bg-slate-900 font-bold text-slate-700 dark:text-slate-200"
            >
              <option value="">-- Pilih Unit --</option>
              <option
                v-for="u in store.db?.master?.unitList"
                :key="u.code"
                :value="u.code"
              >
                {{ u.code }} ({{ u.name }})
              </option>
            </select>
          </div>

          <!-- DROPDOWN DIVISI (Master Data) -->
          <div>
            <label
              class="block text-xs font-medium mb-1 text-slate-600 dark:text-slate-300"
            >
              Divisi / Bagian Pekerjaan
            </label>
            <select
              v-model="form.divisi"
              class="w-full glass-input rounded-xl p-2.5 text-xs outline-none bg-white dark:bg-slate-900 font-bold text-slate-700 dark:text-slate-200"
            >
              <option value="">-- Pilih Divisi --</option>
              <option
                v-for="div in store.db?.master?.divisiList"
                :key="div"
                :value="div"
              >
                {{ div }}
              </option>
            </select>
          </div>
        </div>

        <!-- UPLOAD FOTO PROFIL (FILE / URL) -->
        <div>
          <label
            class="block text-xs font-medium mb-1 text-slate-600 dark:text-slate-300"
          >
            Foto Profil (Avatar)
          </label>

          <div class="flex gap-2 items-center">
            <input
              v-model="form.avatarUrl"
              type="text"
              placeholder="Pilih file atau tempel URL foto..."
              class="flex-1 glass-input rounded-xl p-2.5 text-xs outline-none"
            />

            <!-- Hidden Input File -->
            <input
              ref="fileInputRef"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleFileUpload"
            />

            <!-- Tombol Upload HP/Lokal -->
            <button
              type="button"
              @click="triggerFileInput"
              class="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shrink-0 border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <i class="fa-solid fa-upload text-theme"></i>
              <span>Upload</span>
            </button>
          </div>
        </div>

        <div class="pt-2 border-t border-slate-200/50 dark:border-slate-800/80">
          <label
            class="block text-xs font-bold mb-1 text-theme dark:text-theme"
          >
            Ganti Password
          </label>
          <input
            v-model="form.password"
            type="password"
            placeholder="Masukkan password baru (Kosongkan jika tidak diubah)"
            class="w-full glass-input rounded-xl p-2.5 text-xs outline-none"
          />
        </div>

        <div>
          <label
            class="block text-xs font-medium mb-1 text-slate-600 dark:text-slate-300"
          >
            Deskripsi / Bio Profil
          </label>

          <!-- PILIHAN EMOTICON EKSPRESIF CEPAT -->
          <div
            class="flex items-center gap-1.5 overflow-x-auto pb-2 mb-1.5 [scrollbar-width:none]"
          >
            <button
              v-for="emoji in EXPRESSIVE_EMOJIS"
              :key="emoji"
              type="button"
              @click="appendEmojiToBio(emoji)"
              class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/10 text-sm flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 transition-transform active:scale-95 cursor-pointer"
            >
              {{ emoji }}
            </button>
          </div>

          <textarea
            v-model="form.bio"
            rows="3"
            placeholder="Tuliskan bio atau status singkat Anda..."
            class="w-full glass-input rounded-xl p-2.5 text-xs outline-none"
          ></textarea>
        </div>

        <button
          type="submit"
          :disabled="isSaving"
          class="w-full bg-button text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md disabled:opacity-50 cursor-pointer"
        >
          {{ isSaving ? "Menyimpan..." : "Simpan Perubahan Profil" }}
        </button>
      </form>

      <!-- Logout Action -->
      <div class="pt-4 border-t border-slate-200/50 dark:border-slate-800/80">
        <button
          @click="handleLogout"
          class="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <i class="fa-solid fa-right-from-bracket"></i> Keluar (Logout)
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { store } from "../store";
import { api } from "../services/api";

const emit = defineEmits(["logout-success"]);

const fileInputRef = ref(null);

// Pilihan Emoticon Ekspresif untuk Form Bio
const EXPRESSIVE_EMOJIS = [
  "🚀",
  "🔥",
  "💡",
  "🎯",
  "⚡",
  "💪",
  "😎",
  "☕",
  "💻",
  "✨",
  "📊",
  "✅",
  "🎉",
  "🌟",
  "🏼",
  "👍",
  "🙌",
  "📝",
  "🌈",
  "🏆",
];

const userProfile = ref({
  Nama: "",
  Email: "",
  Role: "",
  Avatar: "",
  Bio: "",
  Divisi: "",
});

const form = ref({
  nama: "",
  password: "",
  bio: "",
  avatarUrl: "",
  unit: "",
  divisi: "",
});

const isSaving = ref(false);

const appendEmojiToBio = (emoji) => {
  form.value.bio += (form.value.bio ? " " : "") + emoji;
};

const avatarPreviewUrl = computed(() => {
  if (form.value.avatarUrl && form.value.avatarUrl.length > 5) {
    return form.value.avatarUrl;
  }
  const nameToUse =
    form.value.nama ||
    userProfile.value.Nama ||
    userProfile.value.nama ||
    userProfile.value.name ||
    "User";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(nameToUse)}`;
});

const triggerFileInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
};

const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    store.openAlert(
      "Ukuran Terlalu Besar",
      "Gunakan foto dengan ukuran kurang dari 2MB.",
      null,
      "warning",
    );
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    form.value.avatarUrl = event.target.result;
  };
  reader.readAsDataURL(file);
};

watch(
  () => store.currentUser,
  (curr) => {
    if (curr) {
      userProfile.value = { ...curr };
      form.value.nama = curr.Nama || curr.nama || curr.name || "";
      form.value.bio = curr.Bio || curr.bio || "";
      form.value.avatarUrl = curr.Avatar || curr.avatarUrl || curr.avatar || "";
      form.value.unit =
        curr.unit ||
        curr.Unit ||
        (Array.isArray(curr.aksesUnit) ? curr.aksesUnit[0] : ""); // <--- BARU
      form.value.divisi = curr.divisi || curr.Divisi || "";
    }
  },
  { immediate: true, deep: true },
);

const saveUserProfile = async () => {
  const currentUserId = store.currentUser?.id;

  if (!currentUserId) {
    store.openAlert(
      "Perhatian",
      "Sesi pengguna tidak ditemukan.",
      null,
      "warning",
    );
    return;
  }

  isSaving.value = true;
  try {
    const payload = {
      nama: form.value.nama,
      Nama: form.value.nama,
      bio: form.value.bio,
      Bio: form.value.bio,
      avatarUrl: form.value.avatarUrl,
      Avatar: form.value.avatarUrl,
      unit: form.value.unit,
      Unit: form.value.unit,
      divisi: form.value.divisi,
      Divisi: form.value.divisi,
    };

    if (form.value.password) {
      payload.password = form.value.password;
    }

    const res = await api.updateData("Users", currentUserId, payload);

    if (res.success || res) {
      const updatedUser = {
        ...store.currentUser,
        ...payload,
      };

      store.setCurrentUser(updatedUser);
      userProfile.value = updatedUser;

      store.openAlert(
        "Berhasil",
        "Profil & Foto berhasil diperbarui!",
        null,
        "success",
      );
      form.value.password = "";
    } else {
      store.openAlert("Gagal", "Gagal memperbarui profil.", null, "warning");
    }
  } catch (err) {
    console.error("Gagal menyimpan profil:", err);
    store.openAlert(
      "Error",
      "Terjadi kesalahan saat menyimpan profil: " + err.message,
      null,
      "warning",
    );
  } finally {
    isSaving.value = false;
  }
};

const handleLogout = () => {
  store.openAlert(
    "Konfirmasi Keluar",
    "Apakah Anda yakin ingin keluar dari aplikasi?",
    () => {
      store.logout();
      emit("logout-success");
    },
    "warning",
  );
};
</script>
