<!-- src/views/PageProfile.vue -->
<template>
  <section
    id="page-profile"
    class="page-section space-y-4 md:space-y-6 max-w-4xl mx-auto pb-20 md:pb-6"
  >
    <!-- 1. HERO HEADER CARD (Fresh Modern Glass & Theme Backdrop) -->
    <div
      class="glass-card bg-white/90 dark:bg-slate-900/90 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden"
    >
      <!-- Top Navigation & Action Bar -->
      <!-- <div class="flex items-center justify-between relative z-10 mb-4">
        <span
          class="text-xs font-semibold px-3 py-1 rounded-full bg-theme/10 text-theme border border-theme/20 uppercase tracking-wider"
        >
          {{ userProfile.Role || userProfile.role || "Super Admin" }}
        </span>
        
        <button
          @click="triggerFileInput"
          type="button"
          class="w-10 h-10 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-theme/10 hover:text-theme text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer border border-slate-200/50 dark:border-slate-700/50"
          title="Ubah Foto"
        >
          <i class="fa-solid fa-camera text-sm"></i>
        </button>
      </div> -->

      <!-- Avatar & Information Section -->
      <div
        class="flex flex-col items-center text-center space-y-3 relative z-10 my-2"
      >
        <div class="relative group cursor-pointer" @click="triggerFileInput">
          <img
            :src="avatarPreviewUrl"
            alt="Avatar Profile"
            class="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-slate-100 dark:border-slate-800 shadow-md transition-transform group-hover:scale-105"
          />
          <div
            class="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <i class="fa-solid fa-pen text-white text-base"></i>
          </div>
        </div>

        <div
          class="flex flex-row w-full items-center justify-between text-left"
        >
          <div>
            <h2
              class="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100"
            >
              {{
                userProfile.Nama ||
                userProfile.nama ||
                userProfile.name ||
                "User Pengguna"
              }}
            </h2>

            <!-- <span class="text-theme font-semibold">{{
              userProfile.Divisi || userProfile.divisi || "Divisi Kerja"
            }}</span>
            <span
              class="inline-block w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"
            ></span>
            <span>{{
              userProfile.Unit || userProfile.unit || "Unit Usaha"
            }}</span> -->

            <p class="text-xs text-slate-400 font-normal mt-1">
              {{ userProfile.Email || userProfile.email || "email@domain.com" }}
            </p>
          </div>

          <!-- Quick Action Icons -->
          <div class="flex items-center gap-2.5 pt-2">
            <button
              @click="triggerFileInput"
              type="button"
              class="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-theme flex items-center justify-center transition-colors cursor-pointer border border-slate-200/50 dark:border-slate-700/50"
              title="Upload Foto"
            >
              <i class="fa-solid fa-image text-sm"></i>
            </button>
            <button
              @click="activeTab = 'edit'"
              type="button"
              class="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-theme flex items-center justify-center transition-colors cursor-pointer border border-slate-200/50 dark:border-slate-700/50"
              title="Edit Profil"
            >
              <i class="fa-solid fa-user-pen text-sm"></i>
            </button>
            <button
              @click="handleLogout"
              type="button"
              class="w-10 h-10 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 flex items-center justify-center transition-colors cursor-pointer border border-rose-500/20"
              title="Keluar"
            >
              <i class="fa-solid fa-right-from-bracket text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. METRIC STAT CARDS (3 Floating Badge Rows) -->
    <div class="grid grid-cols-3 gap-3 md:gap-4 px-1">
      <div
        class="glass-card bg-white/90 dark:bg-slate-900/90 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 text-center shadow-xs flex flex-col items-center justify-center"
      >
        <div
          class="w-8 h-8 rounded-xl bg-theme/10 text-theme flex items-center justify-center mb-1 text-xs"
        >
          <i class="fa-solid fa-building"></i>
        </div>
        <h4
          class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate w-full"
        >
          {{ form.unit || "-" }}
        </h4>
        <p class="text-[10px] sm:text-xs text-slate-400 font-normal">
          Unit Usaha
        </p>
      </div>

      <div
        class="glass-card bg-white/90 dark:bg-slate-900/90 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 text-center shadow-xs flex flex-col items-center justify-center"
      >
        <div
          class="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1 text-xs"
        >
          <i class="fa-solid fa-sitemap"></i>
        </div>
        <h4
          class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate w-full"
        >
          {{ form.divisi || "-" }}
        </h4>
        <p class="text-[10px] sm:text-xs text-slate-400 font-normal">Divisi</p>
      </div>

      <div
        class="glass-card bg-white/90 dark:bg-slate-900/90 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 text-center shadow-xs flex flex-col items-center justify-center"
      >
        <div
          class="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-1 text-xs"
        >
          <i class="fa-solid fa-shield-halved"></i>
        </div>
        <h4
          class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate w-full"
        >
          {{ userProfile.Role || userProfile.role || "Super Admin" }}
        </h4>
        <p class="text-[10px] sm:text-xs text-slate-400 font-normal">
          Hak Akses
        </p>
      </div>
    </div>

    <!-- 3. MAIN FORM & DETAILS SECTION -->
    <div
      class="glass-card bg-white/90 dark:bg-slate-900/90 rounded-3xl p-5 md:p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-5"
    >
      <!-- Navigasi Tab Sederhana -->
      <div
        class="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3"
      >
        <button
          @click="activeTab = 'about'"
          type="button"
          class="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all"
          :class="
            activeTab === 'about'
              ? 'bg-button text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800'
          "
        >
          Informasi Bio
        </button>
        <button
          @click="activeTab = 'edit'"
          type="button"
          class="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all"
          :class="
            activeTab === 'edit'
              ? 'bg-button text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800'
          "
        >
          Pengaturan Profil
        </button>
      </div>

      <!-- Tab 1: Ringkasan Bio & Informasi -->
      <div v-if="activeTab === 'about'" class="space-y-4 text-xs">
        <div>
          <h4 class="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">
            Bio / Deskripsi Ringkas
          </h4>
          <p
            class="text-slate-600 dark:text-slate-300 font-normal leading-relaxed"
          >
            {{
              form.bio ||
              "Belum ada bio atau catatan deskripsi profil yang ditambahkan."
            }}
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div
            class="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800"
          >
            <span class="text-slate-400 font-normal">Unit Usaha Utama</span>
            <p
              class="font-semibold text-slate-800 dark:text-slate-100 mt-0.5 text-sm"
            >
              {{ form.unit || "-" }}
            </p>
          </div>
          <div
            class="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800"
          >
            <span class="text-slate-400 font-normal"
              >Divisi / Bagian Pekerjaan</span
            >
            <p
              class="font-semibold text-slate-800 dark:text-slate-100 mt-0.5 text-sm"
            >
              {{ form.divisi || "-" }}
            </p>
          </div>
        </div>
      </div>

      <!-- Tab 2: Form Pengeditan Data Profil -->
      <form v-else @submit.prevent="saveUserProfile" class="space-y-4 text-xs">
        <div>
          <label
            class="block font-semibold mb-1 text-slate-600 dark:text-slate-300"
            >Nama Lengkap</label
          >
          <input
            v-model="form.nama"
            type="text"
            required
            class="w-full glass-input rounded-xl p-2.5 text-xs outline-none font-normal bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700/60"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              class="block font-semibold mb-1 text-slate-600 dark:text-slate-300"
              >Unit Usaha Utama</label
            >
            <select
              v-model="form.unit"
              class="w-full glass-input rounded-xl p-2.5 text-xs outline-none bg-slate-50 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60"
            >
              <option value="">-- Pilih Unit --</option>
              <option
                v-for="u in store.db?.master?.unitList"
                :key="u.code"
                :value="u.code"
              >
                {{ u.code }} - {{ u.name }}
              </option>
            </select>
          </div>

          <div>
            <label
              class="block font-semibold mb-1 text-slate-600 dark:text-slate-300"
              >Divisi / Bagian Pekerjaan</label
            >
            <select
              v-model="form.divisi"
              class="w-full glass-input rounded-xl p-2.5 text-xs outline-none bg-slate-50 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60"
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

        <div>
          <label
            class="block font-semibold mb-1 text-slate-600 dark:text-slate-300"
            >Foto Profil (URL / Unggah File)</label
          >
          <div class="flex gap-2 items-center">
            <input
              v-model="form.avatarUrl"
              type="text"
              placeholder="Tempel URL atau pilih file..."
              class="flex-1 glass-input rounded-xl p-2.5 text-xs outline-none font-normal bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700/60"
            />
            <input
              ref="fileInputRef"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleFileUpload"
            />
            <button
              type="button"
              @click="triggerFileInput"
              class="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3.5 py-2.5 rounded-xl font-semibold text-xs cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              Unggah
            </button>
          </div>
        </div>

        <div>
          <label
            class="block font-semibold mb-1 text-slate-600 dark:text-slate-300"
            >Ganti Password</label
          >
          <input
            v-model="form.password"
            type="password"
            placeholder="Ketik password baru jika ingin diubah..."
            class="w-full glass-input rounded-xl p-2.5 text-xs outline-none font-normal bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700/60"
          />
        </div>

        <div>
          <label
            class="block font-semibold mb-1 text-slate-600 dark:text-slate-300"
            >Bio / Deskripsi Singkat</label
          >
          <textarea
            v-model="form.bio"
            rows="3"
            placeholder="Tuliskan bio profil Anda..."
            class="w-full glass-input rounded-xl p-2.5 text-xs outline-none font-normal bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700/60"
          ></textarea>
        </div>

        <!-- Tombol Simpan Berwarna Tema Utama App -->
        <button
          type="submit"
          :disabled="isSaving"
          class="w-full bg-button text-white font-semibold p-3 rounded-xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
        >
          <i v-if="isSaving" class="fa-solid fa-spinner fa-spin"></i>
          <i v-else class="fa-solid fa-floppy-disk"></i>
          <span>{{ isSaving ? "Menyimpan..." : "Simpan" }}</span>
        </button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { store } from "../store";
import { api } from "../services/api";

const emit = defineEmits(["logout-success"]);

const fileInputRef = ref(null);
const activeTab = ref("about");

const userProfile = ref({
  Nama: "",
  Email: "",
  Role: "",
  Avatar: "",
  Bio: "",
  Divisi: "",
  Unit: "",
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
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(nameToUse)}&background=0D8ABC&color=fff`;
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
        (Array.isArray(curr.aksesUnit) ? curr.aksesUnit[0] : "");
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

    if (res && (res.success || res)) {
      const updatedUser = {
        ...store.currentUser,
        ...payload,
      };

      store.setCurrentUser(updatedUser);
      userProfile.value = updatedUser;

      store.openAlert(
        "Berhasil",
        "Profil berhasil diperbarui!",
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
