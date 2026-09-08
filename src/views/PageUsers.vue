<!-- src/views/PageUsers.vue -->
<template>
  <section id="page-users" class="page-section space-y-4 md:space-y-6">
    <!-- Header Page -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div>
        <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <i class="fa-solid fa-users-gear text-blue-500"></i> Manajer Akses Pengguna
        </h3>
        <p class="text-slate-400 text-xs mt-0.5">Kelola pengguna, penetapan peran (role), dan unit operasional.</p>
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto">
        <!-- Buka Modal Kode Akses (Passcode Publik) -->
        <button 
          @click="store.openModal('kodeakses')" 
          class="flex-1 sm:flex-none bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2.5 rounded-xl font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <i class="fa-solid fa-key"></i> Passcode Publik
        </button>

        <!-- Buka Modal Tambah User Baru -->
        <button 
          @click="store.openModal('user')" 
          class="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white px-4 py-2.5 rounded-xl font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <i class="fa-solid fa-user-plus"></i> Tambah Pengguna
        </button>
      </div>
    </div>

    <!-- Table Card -->
    <div class="glass-card p-4 sm:p-6 rounded-3xl border border-white/40 dark:border-slate-800/80 shadow-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-xs text-left">
          <thead class="bg-slate-100/70 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider">
            <tr>
              <th class="py-3.5 px-4 rounded-l-xl">Pengguna</th>
              <th class="py-3.5 px-4">Email / Username</th>
              <th class="py-3.5 px-4">Role</th>
              <th class="py-3.5 px-4">Akses Unit</th>
              <th class="py-3.5 px-4 text-center rounded-r-xl">Aksi</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
            <!-- Loading State -->
            <tr v-if="store.isLoading && usersList.length === 0">
              <td colspan="5" class="py-8 text-center text-slate-400">
                <i class="fa-solid fa-circle-notch fa-spin text-lg text-blue-500 mb-2 block"></i>
                Memuat data pengguna dari Firestore...
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-else-if="usersList.length === 0">
              <td colspan="5" class="py-8 text-center text-slate-400">
                Belum ada pengguna terdaftar di Firestore.
              </td>
            </tr>

            <!-- Data Users -->
            <tr 
              v-else 
              v-for="user in usersList" 
              :key="user.id" 
              class="hover:bg-white/20 dark:hover:bg-slate-800/40 transition-all"
            >
              <td class="py-3.5 px-4 font-semibold flex items-center gap-3">
                <img 
                  :src="getAvatarUrl(user)" 
                  class="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                >
                <span class="text-xs text-slate-800 dark:text-slate-100 font-bold">{{ user.nama || 'User' }}</span>
              </td>
              <td class="py-3.5 px-4 text-slate-600 dark:text-slate-300">{{ user.email || '-' }}</td>
              <td class="py-3.5 px-4">
                <span 
                  :class="[
                    'px-2.5 py-1 rounded-full text-[10px] font-bold border',
                    user.role === 'SUPERADMIN' 
                      ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' 
                      : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                  ]"
                >
                  {{ user.role || 'ADMIN_UNIT' }}
                </span>
              </td>
              <td class="py-3.5 px-4 font-medium text-slate-600 dark:text-slate-300">
                {{ formatAksesUnit(user.aksesUnit) }}
              </td>
              <td class="py-3.5 px-4 text-center">
                <button 
                  @click="store.openModal('user', user)" 
                  class="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 mr-1 transition-all cursor-pointer"
                  title="Edit Pengguna"
                >
                  <i class="fa-solid fa-pen-to-square text-xs"></i>
                </button>
                <button 
                  @click="deleteUser(user.id)" 
                  class="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                  title="Hapus Pengguna"
                >
                  <i class="fa-solid fa-trash text-xs"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { store } from '../store';
import { api } from '../services/api';

// Ambisi Data Pengguna Langsung dari Reactive Store Global
const usersList = computed(() => store.db.users || []);

// Helper Format Akses Unit (Jika Array -> Join string, jika String -> Tampilkan langsung)
function formatAksesUnit(unit) {
  if (Array.isArray(unit)) {
    return unit.join(', ');
  }
  return unit || '-';
}

// Avatar Fallback
function getAvatarUrl(user) {
  if (user.avatarUrl && user.avatarUrl.length > 5) {
    return user.avatarUrl;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nama || 'User')}`;
}

// Hapus User dari Firestore via api.js
async function deleteUser(userId) {
  if (!confirm('Apakah Anda yakin ingin menghapus pengguna ini dari Firestore?')) return;
  
  store.isLoading = true;
  try {
    const res = await api.deleteData('Users', userId);
    if (res.success) {
      await store.loadFullDatabase();
    } else {
      alert("Gagal menghapus pengguna: " + res.message);
    }
  } catch (err) {
    alert("Error: " + err.message);
  } finally {
    store.isLoading = false;
  }
}
</script>