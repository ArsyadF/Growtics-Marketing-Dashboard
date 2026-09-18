<!-- src/components/UserModal.vue -->
<template>
  <div
    class="fixed inset-0 z-[10010] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4"
  >
    <div
      class="glass-card w-full max-w-2xl bg-white/95 dark:bg-slate-900/95 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] flex flex-col"
    >
      <!-- Header Modal -->
      <div
        class="flex items-center justify-between pb-3 border-b border-slate-200/50 dark:border-slate-800 shrink-0"
      >
        <h3
          class="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"
        >
          <i class="fa-solid fa-user-shield text-[#1caa80]"></i>
          {{ isEdit ? "Edit Hak Akses Pengguna" : "Tambah Pengguna Baru" }}
        </h3>
        <button
          @click="$emit('close')"
          class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
        >
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <!-- Form Body (Scrollable) -->
      <form
        @submit.prevent="handleSubmit"
        class="space-y-4 overflow-y-auto flex-1 pr-1 custom-scrollbar"
      >
        <!-- Informasi Dasar User -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              class="block text-xs font-medium mb-1 text-slate-600 dark:text-slate-300"
              >Nama Lengkap</label
            >
            <input
              v-model="form.nama"
              type="text"
              required
              class="w-full glass-input rounded-xl p-2.5 text-xs outline-none"
              placeholder="Masukkan nama"
            />
          </div>
          <div>
            <label
              class="block text-xs font-medium mb-1 text-slate-600 dark:text-slate-300"
              >Email</label
            >
            <input
              v-model="form.email"
              type="email"
              required
              :disabled="isEdit"
              class="w-full glass-input rounded-xl p-2.5 text-xs outline-none disabled:opacity-50"
              placeholder="user@growtics.com"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              class="block text-xs font-medium mb-1 text-slate-600 dark:text-slate-300"
              >Password {{ isEdit ? "(Isi jika ingin merubah)" : "" }}</label
            >
            <input
              v-model="form.password"
              type="password"
              :required="!isEdit"
              class="w-full glass-input rounded-xl p-2.5 text-xs outline-none"
              placeholder="******"
            />
          </div>
          <div>
            <label
              class="block text-xs font-medium mb-1 text-slate-600 dark:text-slate-300"
              >Role Utama</label
            >
            <select
              v-model="form.role"
              class="w-full glass-input rounded-xl p-2.5 text-xs outline-none bg-transparent dark:bg-slate-800"
            >
              <option value="USER">USER / STAF</option>
              <option value="SPV">SPV (Supervisor)</option>
              <option value="ADMIN">ADMIN UNIT</option>
              <option value="SUPERADMIN">SUPERADMIN (Akses Penuh)</option>
            </select>
          </div>
        </div>

        <!-- Checkbox Matrix Hak Akses Halaman -->
        <div
          v-if="form.role !== 'SUPERADMIN'"
          class="pt-3 border-t border-slate-200/50 dark:border-slate-800 space-y-2"
        >
          <div class="flex items-center justify-between">
            <div>
              <label class="block text-xs font-bold text-theme dark:text-theme">
                Atur Akses Halaman & Fitur Edit
              </label>
              <p class="text-[11px] text-slate-400 mt-0.5">
                Pilih modul yang boleh dibuka dan atur hak pengeditan/penambahan
                data.
              </p>
            </div>
            <button
              type="button"
              @click="toggleAllPermissions"
              class="text-[11px] font-bold text-theme dark:text-theme hover:underline cursor-pointer shrink-0"
            >
              {{ isAllSelected ? "Matikan Semua" : "Buka Semua" }}
            </button>
          </div>

          <div
            class="border border-slate-200/60 dark:border-slate-800 rounded-2xl overflow-hidden text-xs"
          >
            <table class="w-full text-left border-collapse">
              <thead>
                <tr
                  class="bg-slate-100/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border-b border-slate-200/60 dark:border-slate-800"
                >
                  <th class="p-2.5 font-semibold">Halaman / Modul</th>
                  <th class="p-2.5 font-semibold text-center w-24">
                    Bisa Akses
                  </th>
                  <th class="p-2.5 font-semibold text-center w-32">
                    Bisa Edit / Tambah
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                <tr
                  v-for="page in pagesList"
                  :key="page.id"
                  class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                >
                  <td
                    class="p-2.5 font-medium text-slate-700 dark:text-slate-200"
                  >
                    <i :class="page.icon" class="mr-2 text-theme"></i>
                    {{ page.label }}
                  </td>
                  <!-- Checkbox Buka Halaman -->
                  <td class="p-2.5 text-center">
                    <input
                      type="checkbox"
                      v-model="form.permissions[page.id].access"
                      @change="onAccessChange(page.id)"
                      class="w-4 h-4 rounded text-[#1caa80] focus:ring-0 cursor-pointer accent-emerald-600"
                    />
                  </td>
                  <!-- Checkbox Fitur Edit / Tambah -->
                  <td class="p-2.5 text-center">
                    <input
                      type="checkbox"
                      v-model="form.permissions[page.id].canEdit"
                      :disabled="!form.permissions[page.id].access"
                      class="w-4 h-4 rounded text-[#1caa80] focus:ring-0 cursor-pointer disabled:opacity-30 accent-emerald-600"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div
          v-else
          class="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl text-xs text-emerald-700 dark:text-emerald-300"
        >
          <i class="fa-solid fa-shield-halved mr-1"></i>
          <strong>Superadmin</strong> memiliki akses penuh ke seluruh halaman
          dan hak akses edit tanpa pembatasan.
        </div>

        <!-- Button Submit -->
        <div
          class="pt-3 border-t border-slate-200/50 dark:border-slate-800 flex justify-end gap-2 shrink-0"
        >
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            class="px-5 py-2 rounded-xl text-xs font-bold bg-button text-white shadow-md hover:from-[#149b73] hover:to-[#149b73] cursor-pointer"
          >
            {{ isEdit ? "Simpan Perubahan" : "Tambah User" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";

const props = defineProps({
  userData: { type: Object, default: null },
});

const emit = defineEmits(["close", "save"]);

const isEdit = ref(!!props.userData);

// Daftar Halaman Lengkap Sesuai Struktur Sistem
const pagesList = [
  { id: "summary", label: "Rekap Bisnis", icon: "fa-solid fa-chart-line" },
  { id: "notes", label: "Notes / Catatan", icon: "fa-solid fa-note-sticky" },
  {
    id: "unit-NHP",
    label: "Unit Nur Hidayah Press",
    icon: "fa-solid fa-building",
  },
  {
    id: "unit-NHC",
    label: "Unit Nusaragam x Pengaosan",
    icon: "fa-solid fa-building-user",
  },
  { id: "unit-KG", label: "Unit Karta Grafika", icon: "fa-solid fa-city" },
  {
    id: "progress",
    label: "Kanban Progress",
    icon: "fa-solid fa-bars-progress",
  },
  { id: "digmar", label: "Socmed Analytics", icon: "fa-solid fa-share-nodes" },
  { id: "leads", label: "Leads & Campaign", icon: "fa-solid fa-users-rays" },
  { id: "promo", label: "Marketing Budget", icon: "fa-solid fa-wallet" },
  {
    id: "spv-report",
    label: "Laporan Divisi",
    icon: "fa-solid fa-file-signature",
  },
  { id: "aduan", label: "Customer Support", icon: "fa-solid fa-headset" },
  {
    id: "report",
    label: "Laporan Executive",
    icon: "fa-solid fa-file-invoice-dollar",
  },
  {
    id: "master-data",
    label: "Master Data System",
    icon: "fa-solid fa-sliders",
  },
  { id: "users", label: "Akses Pengguna", icon: "fa-solid fa-users-gear" },
];

// Helper untuk inisialisasi default permissions
const createDefaultPermissions = () => {
  const perms = {};
  pagesList.forEach((p) => {
    perms[p.id] = { access: true, canEdit: false };
  });
  return perms;
};

const form = reactive({
  nama: "",
  email: "",
  password: "",
  role: "USER",
  permissions: createDefaultPermissions(),
});

// Sync data jika dalam mode Edit & Reset jika mode Tambah
watch(
  () => props.userData,
  (curr) => {
    if (curr) {
      isEdit.value = true;
      form.nama = curr.nama || curr.Nama || "";
      form.email = curr.email || curr.Email || "";
      form.password = ""; // Kosongkan agar user isi hanya jika ingin ganti
      form.role = curr.role || curr.Role || "USER";

      // Pastikan setiap page.id terdefinisi jika ada menu baru yang belum tersimpan di DB
      const userPerms = curr.permissions || {};
      pagesList.forEach((p) => {
        form.permissions[p.id] = {
          access: userPerms[p.id]?.access ?? false,
          canEdit: userPerms[p.id]?.canEdit ?? false,
        };
      });
    } else {
      // Reset Form Saat Tambah User Baru
      isEdit.value = false;
      form.nama = "";
      form.email = "";
      form.password = "";
      form.role = "USER";
      form.permissions = createDefaultPermissions();
    }
  },
  { immediate: true },
);

// Check Status Semua Permission Terpilih atau Tidak
const isAllSelected = computed(() => {
  return pagesList.every((p) => form.permissions[p.id]?.access);
});

// Toggle Pilih Semua / Matikan Semua Permission
const toggleAllPermissions = () => {
  const targetState = !isAllSelected.value;
  pagesList.forEach((p) => {
    form.permissions[p.id].access = targetState;
    if (!targetState) {
      form.permissions[p.id].canEdit = false;
    }
  });
};

// Jika "Bisa Akses" dimatikan, otomatis matikan "Bisa Edit"
const onAccessChange = (pageId) => {
  if (!form.permissions[pageId].access) {
    form.permissions[pageId].canEdit = false;
  }
};

const handleSubmit = () => {
  const payload = {
    nama: form.nama,
    email: form.email,
    role: form.role,
    permissions: form.permissions,
    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.nama)}&background=0D8ABC&color=fff`,
  };

  if (form.password && form.password.trim() !== "") {
    payload.password = form.password;
  }

  emit("save", payload);
};
</script>
