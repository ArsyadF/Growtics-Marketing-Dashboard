<!-- src/views/PageUsers.vue -->
<template>
  <section id="page-users" class="page-section space-y-4 md:space-y-6">
    
    <!-- Header Page & Tombol Tambah User -->
    <div class="glass-card p-4 md:p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h3 class="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <i class="fa-solid fa-users-gear from-[#149B73]"></i>
          <!-- Manajemen Akses Pengguna -->
        </h3>
        <p class="text-xs text-slate-400 mt-0.5">Kelola data staf, role, dan pembatasan hak akses halaman.</p>
      </div>

      <!-- Tombol Tambah User Baru (Hanya Tampil Jika Memiliki Akses Edit Halaman Users/Targets/Superadmin) -->
      <div class="flex items-center gap-2 w-full sm:w-auto">
        <!-- Buka Modal Kode Akses (Passcode Publik) -->
        <button 
          @click="store.openModal('kodeakses')" 
          class="flex-1 sm:flex-none bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2.5 rounded-xl font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <i class="fa-solid fa-key"></i> Passcode Publik
        </button>

      <button 
        v-if="canManageUsers"
        @click="openAddUserModal" 
        class="bg-gradient-to-r from-[#149B73] to-[#2EE59D] hover:from-[#149b73] hover:to-[#149b73] text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
      >
        <i class="fa-solid fa-user-plus"></i> Tambah Pengguna
      </button>
      </div>
    </div>

    <!-- Tabel Daftar Pengguna -->
    <div class="glass-card p-4 md:p-6 rounded-3xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="border-b border-slate-200/60 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              <th class="pb-3 px-2">Pengguna</th>
              <th class="pb-3 px-2">Role</th>
              <th class="pb-3 px-2">Akses Halaman</th>
              <th class="pb-3 px-2 text-right" v-if="canManageUsers">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
            <!-- Loading Indicator diganti menggunakan store.isLoading -->
            <tr v-if="store.isLoading && usersList.length === 0">
              <td colspan="4" class="py-8 text-center text-slate-400">
                <i class="fa-solid fa-circle-notch fa-spin text-lg mr-2"></i> Memuat data pengguna...
              </td>
            </tr>

            <tr v-else-if="usersList.length === 0">
              <td colspan="4" class="py-8 text-center text-slate-400">
                Belum ada data pengguna.
              </td>
            </tr>

            <tr 
              v-else 
              v-for="user in usersList" 
              :key="user.id" 
              class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
            >
              <!-- Info User (Avatar + Nama + Email) -->
              <td class="py-3 px-2">
                <div class="flex items-center gap-3">
                  <img 
                    :src="user.avatarUrl || user.Avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nama || user.Nama || 'User')}&background=0D8ABC&color=fff`" 
                    class="w-8 h-8 rounded-full object-cover border border-blue-400/40 shrink-0"
                  >
                  <div class="min-w-0">
                    <p class="font-bold text-slate-800 dark:text-slate-100 truncate">
                      {{ user.nama || user.Nama || 'Tanpa Nama' }}
                    </p>
                    <p class="text-[10px] text-slate-400 truncate">
                      {{ user.email || user.Email || '-' }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- Role -->
              <td class="py-3 px-2">
                <span 
                  class="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase"
                  :class="getRoleBadgeClass(user.role || user.Role)"
                >
                  {{ user.role || user.Role || 'USER' }}
                </span>
              </td>

              <!-- Rincian Ringkas Akses Halaman -->
              <td class="py-3 px-2">
                <div v-if="(user.role || user.Role) === 'SUPERADMIN'" class="text-[11px] text-[#1caa80] dark:text-[#1caa80] font-semibold">
                  <i class="fa-solid fa-shield-halved mr-1"></i> Akses Penuh (Superadmin)
                </div>
                <div v-else class="flex flex-wrap gap-1 max-w-xs">
                  <!-- Fallback jika properti permissions tidak ada / data lama -->
                  <span v-if="!user.permissions" class="text-slate-500 text-xs">
                    {{ Array.isArray(user.aksesUnit) ? user.aksesUnit.join(', ') : (user.aksesUnit || '-') }}
                  </span>
                  
                  <span 
                    v-else
                    v-for="(perm, pageKey) in user.permissions" 
                    :key="pageKey"
                    v-show="perm.access"
                    class="px-2 py-0.5 rounded-md text-[9px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50"
                  >
                    {{ getPageLabel(pageKey) }}
                    <i v-if="perm.canEdit" class="fa-solid fa-pen text-[8px] text-emerald-500 ml-0.5" title="Bisa Edit/Input"></i>
                  </span>
                </div>
              </td>

              <!-- Tombol Aksi Edit & Hapus -->
              <td class="py-3 px-2 text-right" v-if="canManageUsers">
                <div class="flex items-center justify-end gap-1.5">
                  <button 
                    @click="openEditUserModal(user)" 
                    class="p-1.5 text-[#1caa80] hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="Edit Hak Akses"
                  >
                    <i class="fa-solid fa-user-pen"></i>
                  </button>

                  <button 
                    @click="deleteUser(user)" 
                    class="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="Hapus User"
                  >
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Tambah / Edit User -->
    <UserModal 
      v-if="isModalOpen" 
      :user-data="selectedUserForEdit" 
      @close="isModalOpen = false" 
      @save="handleSaveUser" 
    />

  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { store } from '../store';
import { api } from '../services/api';
import UserModal from '../components/UserModal.vue';

// 1. Mengubah usersList menjadi computed dari store (menghilangkan error api.getData)
const usersList = computed(() => store.db.users || []);

const isModalOpen = ref(false);
const selectedUserForEdit = ref(null);

// Pengecekan apakah user yang login punya izin mengelola user lain (Superadmin)
const canManageUsers = computed(() => {
  const role = store.currentUser?.role || store.currentUser?.Role;
  return role ? role.toUpperCase() === 'SUPERADMIN' : false;
});

// Format badge warna sesuai Role
const getRoleBadgeClass = (role) => {
  const r = String(role || '').toUpperCase();
  if (r === 'SUPERADMIN') return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30';
  if (r === 'ADMIN') return 'bg-[#25eba11a] text-[#1caa80] dark:text-[#1caa80] border border-[#1caa80]/30';
  return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/30';
};

// Mapping nama label singkat untuk tag perizinan
const getPageLabel = (pageKey) => {
  const labels = {
    'main': 'Main',
    'unit-NHP': 'NHP',
    'unit-NHC': 'NHC',
    'unit-KG': 'KG',
    'leads': 'Leads',
    'promo': 'Promo',
    'targets': 'Targets'
  };
  return labels[pageKey] || pageKey;
};

const openAddUserModal = () => {
  selectedUserForEdit.value = null;
  isModalOpen.value = true;
};

const openEditUserModal = (user) => {
  selectedUserForEdit.value = { ...user };
  isModalOpen.value = true;
};

// Handle Simpan (Tambah / Update) Data Pengguna
const handleSaveUser = async (formData) => {
  isModalOpen.value = false;
  store.isLoading = true;

  try {
    if (selectedUserForEdit.value?.id) {
      // UPDATE USER (Gunakan 'users' huruf kecil sesuai mapping di api.js)
      const userId = selectedUserForEdit.value.id;
      const res = await api.updateData('users', userId, formData);
      if (res && res.success) {
        store.openAlert('Berhasil', 'Hak akses pengguna berhasil diperbarui!', null, 'success');
        await store.loadFullDatabase();
      } else {
        store.openAlert('Gagal', res?.message || 'Gagal memperbarui pengguna.', null, 'warning');
      }
    } else {
      // TAMBAH USER BARU (Gunakan 'users' huruf kecil sesuai mapping di api.js)
      const res = await api.saveData('users', formData);
      if (res && res.success) {
        store.openAlert('Berhasil', 'Pengguna baru berhasil ditambahkan!', null, 'success');
        await store.loadFullDatabase();
      } else {
        store.openAlert('Gagal', res?.message || 'Gagal menambahkan pengguna.', null, 'warning');
      }
    }
  } catch (err) {
    console.error("Gagal menyimpan pengguna:", err);
    store.openAlert('Gagal', 'Terjadi kesalahan saat menyimpan data: ' + err.message, null, 'warning');
  } finally {
    store.isLoading = false;
  }
};

// Delete User dengan Modal Konfirmasi Kustom
const deleteUser = (user) => {
  if (user.id === store.currentUser?.id) {
    store.openAlert('Perhatian', 'Anda tidak dapat menghapus akun Anda sendiri yang sedang digunakan.', null, 'warning');
    return;
  }

  store.openAlert(
    'Konfirmasi Hapus',
    `Apakah Anda yakin ingin menghapus akun "${user.nama || user.Nama || user.email}"?`,
    async () => {
      store.isLoading = true;
      try {
        await api.deleteData('Users', user.id);
        store.openAlert('Berhasil', 'Pengguna berhasil dihapus!', null, 'success');
        // Load dari store global
        await store.loadFullDatabase();
      } catch (err) {
        console.error("Gagal menghapus pengguna:", err);
        store.openAlert('Gagal', 'Gagal menghapus pengguna: ' + err.message, null, 'warning');
      } finally {
        store.isLoading = false;
      }
    },
    'warning'
  );
};
</script>