<!-- src/components/UserModal.vue -->
<template>
  <div class="fixed inset-0 z-[10010] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="glass-card w-full max-w-2xl bg-white/95 dark:bg-slate-900/95 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] flex flex-col">
      
      <!-- Header Modal -->
      <div class="flex items-center justify-between pb-3 border-b border-slate-200/50 dark:border-slate-800 shrink-0">
        <h3 class="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <i class="fa-solid fa-user-shield text-blue-500"></i>
          {{ isEdit ? 'Edit Hak Akses Pengguna' : 'Tambah Pengguna Baru' }}
        </h3>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <!-- Form Body (Scrollable) -->
      <form @submit.prevent="handleSubmit" class="space-y-4 overflow-y-auto flex-1 pr-1 custom-scrollbar">
        <!-- Informasi Dasar User -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium mb-1 text-slate-600 dark:text-slate-300">Nama Lengkap</label>
            <input v-model="form.nama" type="text" required class="w-full glass-input rounded-xl p-2.5 text-xs outline-none" placeholder="Masukkan nama">
          </div>
          <div>
            <label class="block text-xs font-medium mb-1 text-slate-600 dark:text-slate-300">Email</label>
            <input v-model="form.email" type="email" required :disabled="isEdit" class="w-full glass-input rounded-xl p-2.5 text-xs outline-none disabled:opacity-50" placeholder="user@growtics.com">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium mb-1 text-slate-600 dark:text-slate-300">Password {{ isEdit ? '(Isi jika ingin merubah)' : '' }}</label>
            <input v-model="form.password" type="password" :required="!isEdit" class="w-full glass-input rounded-xl p-2.5 text-xs outline-none" placeholder="******">
          </div>
          <div>
            <label class="block text-xs font-medium mb-1 text-slate-600 dark:text-slate-300">Role Utama</label>
            <select v-model="form.role" class="w-full glass-input rounded-xl p-2.5 text-xs outline-none bg-transparent dark:bg-slate-800">
              <option value="USER">USER / STAF</option>
              <option value="ADMIN">ADMIN UNIT</option>
              <option value="SUPERADMIN">SUPERADMIN (Akses Penuh)</option>
            </select>
          </div>
        </div>

        <!-- Checkbox Matrix Hak Akses Halaman -->
        <div v-if="form.role !== 'SUPERADMIN'" class="pt-3 border-t border-slate-200/50 dark:border-slate-800 space-y-2">
          <label class="block text-xs font-bold text-blue-600 dark:text-blue-400">
            Atur Akses Halaman & Fitur Edit
          </label>
          <p class="text-[11px] text-slate-400">Pilih halaman yang boleh dibuka dan apakah pengguna diizinkan menambah/mengedit data di halaman tersebut.</p>

          <div class="border border-slate-200/60 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-100/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border-b border-slate-200/60 dark:border-slate-800">
                  <th class="p-2.5 font-semibold">Halaman / Modul</th>
                  <th class="p-2.5 font-semibold text-center w-24">Bisa Akses</th>
                  <th class="p-2.5 font-semibold text-center w-32">Bisa Edit / Tambah</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                <tr v-for="page in pagesList" :key="page.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td class="p-2.5 font-medium text-slate-700 dark:text-slate-200">
                    <i :class="page.icon" class="mr-2 text-blue-500"></i>
                    {{ page.label }}
                  </td>
                  <!-- Checkbox Buka Halaman -->
                  <td class="p-2.5 text-center">
                    <input 
                      type="checkbox" 
                      v-model="form.permissions[page.id].access" 
                      @change="onAccessChange(page.id)"
                      class="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
                    >
                  </td>
                  <!-- Checkbox Fitur Edit / Tambah -->
                  <td class="p-2.5 text-center">
                    <input 
                      type="checkbox" 
                      v-model="form.permissions[page.id].canEdit" 
                      :disabled="!form.permissions[page.id].access"
                      class="w-4 h-4 rounded text-emerald-600 focus:ring-0 cursor-pointer disabled:opacity-30"
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-else class="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-2xl text-xs text-blue-600 dark:text-blue-300">
          <i class="fa-solid fa-info-circle mr-1"></i>
          <strong>Superadmin</strong> memiliki akses penuh ke seluruh halaman dan seluruh fitur pengeditan tanpa pembatasan.
        </div>

        <!-- Button Submit -->
        <div class="pt-3 border-t border-slate-200/50 dark:border-slate-800 flex justify-end gap-2 shrink-0">
          <button type="button" @click="$emit('close')" class="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            Batal
          </button>
          <button type="submit" class="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md hover:from-blue-700 hover:to-sky-600 cursor-pointer">
            {{ isEdit ? 'Simpan Perubahan' : 'Tambah User' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';

const props = defineProps({
  userData: { type: Object, default: null }
});

const emit = defineEmits(['close', 'save']);

const isEdit = ref(!!props.userData);

// Daftar Halaman yang Ada di Growtics
const pagesList = [
  { id: 'main', label: 'Dashboard Utama', icon: 'fa-solid fa-house' },
  { id: 'unit-NHP', label: 'Unit NHP', icon: 'fa-solid fa-building' },
  { id: 'unit-NHC', label: 'Unit NHC', icon: 'fa-solid fa-building-user' },
  { id: 'unit-KG', label: 'Unit KG', icon: 'fa-solid fa-city' },
  { id: 'leads', label: 'Leads & Campaign', icon: 'fa-solid fa-users-rays' },
  { id: 'promo', label: 'Biaya Promosi', icon: 'fa-solid fa-bullhorn' },
  { id: 'targets', label: 'Target Revenue', icon: 'fa-solid fa-bullseye' }
];

// Helper untuk inisialisasi default permissions
const createDefaultPermissions = () => {
  const perms = {};
  pagesList.forEach(p => {
    perms[p.id] = { access: true, canEdit: false };
  });
  return perms;
};

const form = reactive({
  nama: '',
  email: '',
  password: '',
  role: 'USER',
  permissions: createDefaultPermissions()
});

// Sync data jika dalam mode Edit & Reset jika mode Tambah
watch(() => props.userData, (curr) => {
  if (curr) {
    isEdit.value = true;
    form.nama = curr.nama || curr.Nama || '';
    form.email = curr.email || curr.Email || '';
    form.password = ''; // Kosongkan agar tidak tampil, user isi jika mau ubah
    form.role = curr.role || curr.Role || 'USER';
    
    if (curr.permissions) {
      pagesList.forEach(p => {
        form.permissions[p.id] = {
          access: curr.permissions[p.id]?.access ?? false,
          canEdit: curr.permissions[p.id]?.canEdit ?? false
        };
      });
    }
  } else {
    // FIX: RESET FORM SAAT TAMBAH USER BARU
    isEdit.value = false;
    form.nama = '';
    form.email = '';
    form.password = '';
    form.role = 'USER';
    form.permissions = createDefaultPermissions();
  }
}, { immediate: true });

// Jika "Bisa Akses" dimatikan, otomatis matikan "Bisa Edit"
const onAccessChange = (pageId) => {
  if (!form.permissions[pageId].access) {
    form.permissions[pageId].canEdit = false;
  }
};

const handleSubmit = () => {
  // Susun payload untuk dikirim ke API
  const payload = {
    nama: form.nama,
    email: form.email,
    role: form.role,
    permissions: form.permissions,
    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.nama)}&background=0D8ABC&color=fff`
  };

  // Tambahkan password hanya jika form password diisi
  if (form.password && form.password.trim() !== '') {
    payload.password = form.password;
  }

  emit('save', payload);
};
</script>