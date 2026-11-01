<!-- src/components/UserModal.vue -->
<template>
  <div
    class="fixed inset-0 z-[10010] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
  >
    <div
      class="glass-card border border-slate-100 dark:border-slate-800 w-full max-w-2xl rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] flex flex-col"
    >
      <!-- Header Modal -->
      <div
        class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0"
      >
        <h3 class="font-semibold flex items-center gap-2 ui-text-primary ui-text-title">
          <i class="fa-solid fa-user-shield text-theme"></i>
          {{ isEdit ? "Edit Hak Akses Pengguna" : "Tambah Pengguna Baru" }}
        </h3>
        <button
          @click="$emit('close')"
          class="hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer transition-colors ui-text-muted"
        >
          <i class="fa-solid fa-xmark text-base"></i>
        </button>
      </div>

      <!-- Form Body (Scrollable) -->
      <form
        @submit.prevent="handleSubmit"
        class="space-y-4 overflow-y-auto flex-1 pr-1 custom-scrollbar ui-text-body"
      >
        <!-- Informasi Dasar User -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block font-semibold mb-1 ui-text-secondary ui-text-body"
              >Nama Lengkap</label
            >
            <input
              v-model="form.nama"
              type="text"
              required
              class="w-full rounded-xl p-2.5 font-normal ui-input ui-input-inherit min-h-0 ui-text-primary ui-text-body"
              placeholder="Masukkan nama"
            />
          </div>
          <div>
            <label class="block font-semibold mb-1 ui-text-secondary ui-text-body">Email</label>
            <input
              v-model="form.email"
              type="email"
              required
              :disabled="isEdit"
              class="w-full rounded-xl p-2.5 font-normal disabled:opacity-50 ui-input ui-input-inherit min-h-0 ui-text-primary ui-text-body"
              placeholder="user@growtics.com"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block font-semibold mb-1 ui-text-secondary ui-text-body">
              Password {{ isEdit ? "(Isi jika ingin merubah)" : "" }}
            </label>
            <input
              v-model="form.password"
              type="password"
              :required="!isEdit"
              class="w-full rounded-xl p-2.5 font-normal ui-input ui-input-inherit min-h-0 ui-text-primary ui-text-body"
              placeholder="******"
            />
          </div>
          <div>
            <label class="block font-semibold mb-1 ui-text-secondary ui-text-body"
              >Role Utama</label
            >
            <select
              v-model="form.role"
              class="w-full rounded-xl p-2.5 font-semibold ui-input ui-input-inherit min-h-0 ui-text-secondary ui-text-body"
            >
              <option value="USER">USER / STAF</option>
              <option value="SPV">SPV (Supervisor)</option>
              <option value="ADMIN">ADMIN UNIT</option>
              <option value="SUPERADMIN">SUPERADMIN (Akses Penuh)</option>
            </select>
          </div>
        </div>

        <!-- Penempatan Internal (Unit & Divisi) -->
        <div
          class="p-3.5 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100/60 dark:border-blue-800/30 space-y-3"
        >
          <h4
            class="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 border-b border-blue-100 dark:border-blue-800/50 pb-2"
          >
            <i class="fa-solid fa-sitemap"></i> Penempatan Internal (Master Data)
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold mb-1 text-slate-500">Unit Usaha</label>
              <select
                v-model="form.unit"
                class="w-full rounded-xl p-2.5 font-semibold ui-input ui-input-inherit min-h-0 ui-text-secondary ui-text-body"
              >
                <option value="">-- Pilih Unit --</option>
                <option v-for="u in masterUnits" :key="u.code" :value="u.code">
                  {{ u.code }} - {{ u.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold mb-1 text-slate-500">Divisi</label>
              <select
                v-model="form.divisi"
                class="w-full rounded-xl p-2.5 font-semibold ui-input ui-input-inherit min-h-0 ui-text-secondary ui-text-body"
              >
                <option value="">-- Pilih Divisi --</option>
                <option v-for="div in store.db?.master?.divisiList" :key="div" :value="div">
                  {{ div }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Checkbox Matrix Hak Akses Halaman -->
        <div
          v-if="form.role !== 'SUPERADMIN'"
          class="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2"
        >
          <div class="flex items-center justify-between">
            <div>
              <label class="block font-semibold text-theme ui-text-body"
                >Atur Akses Halaman & Fitur Edit</label
              >
              <p class="text-xs mt-0.5 font-normal ui-text-muted">
                Pilih modul yang boleh dibuka dan atur hak pengeditan/penambahan data.
              </p>
            </div>
            <button
              type="button"
              @click="toggleAllPermissions"
              class="text-xs text-theme hover:underline cursor-pointer shrink-0 theme-tint px-2.5 py-1 rounded-lg ui-button min-h-0 gap-0 border-0"
            >
              {{ isAllSelected ? "Matikan Semua" : "Buka Semua" }}
            </button>
          </div>

          <div
            class="border border-slate-200/60 dark:border-slate-800 rounded-2xl overflow-hidden text-xs max-h-56 overflow-y-auto custom-scrollbar"
          >
            <table class="w-full text-left border-collapse whitespace-nowrap">
              <thead
                class="bg-slate-50 dark:bg-slate-800/90 text-slate-500 sticky top-0 backdrop-blur-md z-10 shadow-xs"
              >
                <tr>
                  <th class="p-2.5 font-semibold">Halaman / Modul</th>
                  <th class="p-2.5 font-semibold text-center w-24">Bisa Akses</th>
                  <th class="p-2.5 font-semibold text-center w-32">Bisa Edit / Tambah</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 ui-text-secondary">
                <tr v-for="page in pagesList" :key="page.id" class="transition-colors ui-row-hover">
                  <td class="p-2.5 font-normal flex items-center gap-2">
                    <i :class="page.icon" class="w-4 text-center text-theme"></i>
                    <span>{{ page.label }}</span>
                  </td>
                  <td class="p-2.5 text-center">
                    <input
                      type="checkbox"
                      v-model="form.permissions[page.id].access"
                      @change="onAccessChange(page.id)"
                      class="w-4 h-4 rounded text-theme focus:ring-0 cursor-pointer accent-emerald-600"
                    />
                  </td>
                  <td class="p-2.5 text-center">
                    <input
                      type="checkbox"
                      v-model="form.permissions[page.id].canEdit"
                      :disabled="!form.permissions[page.id].access"
                      class="w-4 h-4 rounded text-theme focus:ring-0 cursor-pointer disabled:opacity-30 accent-emerald-600"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div
          v-else
          class="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl text-xs text-emerald-700 dark:text-emerald-300 flex gap-2 items-center"
        >
          <i class="fa-solid fa-shield-halved text-base shrink-0"></i>
          <p class="font-normal">
            <strong class="font-semibold">Superadmin</strong> memiliki akses penuh ke seluruh
            halaman dan hak akses edit tanpa pembatasan.
          </p>
        </div>

        <!-- Button Submit -->
        <div
          class="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2 shrink-0"
        >
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 rounded-xl text-slate-500 cursor-pointer transition-colors ui-button min-h-0 gap-0 glass-hover ui-text-body border-0"
          >
            Batal
          </button>
          <button
            type="submit"
            class="px-5 py-2 rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5 ui-button min-h-0 ui-button-primary ui-text-body border-0"
          >
            <i class="fa-solid fa-floppy-disk text-xs"></i>
            {{ isEdit ? "Simpan Perubahan" : "Tambah User" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { store } from "../../store";
const props = defineProps({
  userData: { type: Object, default: null },
});

const emit = defineEmits(["close", "save"]);

const isEdit = ref(!!props.userData);
const masterUnits = computed(() => store.db?.master?.unitList || []);

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
  {
    id: "daily-report",
    label: "Laporan Harian",
    icon: "fa-solid fa-file-invoice",
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
  unit: "",
  divisi: "",
  permissions: createDefaultPermissions(),
});

watch(
  () => props.userData,
  (curr) => {
    if (curr) {
      isEdit.value = true;
      form.nama = curr.nama || curr.Nama || "";
      form.email = curr.email || curr.Email || "";
      form.password = "";
      form.role = curr.role || curr.Role || "USER";
      form.unit =
        curr.unit ||
        curr.Unit ||
        (Array.isArray(curr.aksesUnit) ? curr.aksesUnit[0] : "");
      form.divisi = curr.divisi || curr.Divisi || "";

      const userPerms = curr.permissions || {};
      pagesList.forEach((p) => {
        form.permissions[p.id] = {
          access: userPerms[p.id]?.access ?? false,
          canEdit: userPerms[p.id]?.canEdit ?? false,
        };
      });
    } else {
      isEdit.value = false;
      form.nama = "";
      form.email = "";
      form.password = "";
      form.role = "USER";
      form.unit = "";
      form.divisi = "";
      form.permissions = createDefaultPermissions();
    }
  },
  { immediate: true },
);

const isAllSelected = computed(() => {
  return pagesList.every((p) => form.permissions[p.id]?.access);
});

const toggleAllPermissions = () => {
  const targetState = !isAllSelected.value;
  pagesList.forEach((p) => {
    form.permissions[p.id].access = targetState;
    if (!targetState) {
      form.permissions[p.id].canEdit = false;
    }
  });
};

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
    unit: form.unit,
    divisi: form.divisi,
    permissions: form.permissions,
    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.nama)}&background=0D8ABC&color=fff`,
  };

  if (form.password && form.password.trim() !== "") {
    payload.password = form.password;
  }

  emit("save", payload);
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
