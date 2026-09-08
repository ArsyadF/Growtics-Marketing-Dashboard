<!-- src/views/pageprofile.vue -->
<template>
  <section id="page-profile" class="page-section space-y-4 md:space-y-6">
    <div class="glass-card p-6 rounded-3xl max-w-2xl mx-auto space-y-6">
      
      <!-- Profile Display Header -->
      <div class="flex items-center gap-5 border-b border-slate-200/50 dark:border-slate-800/80 pb-6">
        <img 
          :src="avatarPreviewUrl" 
          alt="Avatar Profile" 
          class="w-20 h-20 rounded-full object-cover border-2 border-blue-500 shadow-lg shrink-0"
        >
        <div>
          <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">
            {{ userProfile.Nama || userProfile.nama || userProfile.name || 'Admin User' }}
          </h3>
          <p class="text-xs text-blue-500 font-semibold uppercase">
            {{ userProfile.Role || userProfile.role || 'Super Admin' }}
          </p>
          <p class="text-[11px] text-slate-400 mt-0.5">
            {{ userProfile.Email || userProfile.email || '-' }}
          </p>
        </div>
      </div>

      <!-- Form Update Profile -->
      <form @submit.prevent="saveUserProfile" class="space-y-4">
        <div>
          <label class="block text-xs font-medium mb-1 text-slate-600 dark:text-slate-300">
            Nama Lengkap
          </label>
          <input 
            v-model="form.nama"
            type="text" 
            required 
            class="w-full glass-input rounded-xl p-2.5 text-xs outline-none"
          >
        </div>

        <div>
          <label class="block text-xs font-medium mb-1 text-slate-600 dark:text-slate-300">
            Link / URL Foto Profil (Avatar)
          </label>
          <input 
            v-model="form.avatarUrl"
            type="text" 
            placeholder="https://example.com/avatar.jpg"
            class="w-full glass-input rounded-xl p-2.5 text-xs outline-none"
          >
        </div>

        <div class="pt-2 border-t border-slate-200/50 dark:border-slate-800/80">
          <label class="block text-xs font-bold mb-1 text-blue-600 dark:text-blue-400">
            Ganti Password
          </label>
          <input 
            v-model="form.password"
            type="password" 
            placeholder="Masukkan password baru (Kosongkan jika tidak diubah)" 
            class="w-full glass-input rounded-xl p-2.5 text-xs outline-none"
          >
        </div>

        <div>
          <label class="block text-xs font-medium mb-1 text-slate-600 dark:text-slate-300">
            Deskripsi / Bio Profil
          </label>
          <textarea 
            v-model="form.bio"
            rows="3" 
            class="w-full glass-input rounded-xl p-2.5 text-xs outline-none"
          ></textarea>
        </div>

        <button 
          type="submit" 
          :disabled="isSaving"
          class="w-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md disabled:opacity-50 cursor-pointer"
        >
          {{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan Profil' }}
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
import { ref, computed, watch } from 'vue';
import { store } from '../store';
import { api } from '../services/api';

const emit = defineEmits(['logout-success']);

const userProfile = ref({
  Nama: '',
  Email: '',
  Role: '',
  Avatar: '',
  Bio: ''
});

const form = ref({
  nama: '',
  password: '',
  bio: '',
  avatarUrl: ''
});

const isSaving = ref(false);

const avatarPreviewUrl = computed(() => {
  if (form.value.avatarUrl && form.value.avatarUrl.length > 5) {
    return form.value.avatarUrl;
  }
  const nameToUse = form.value.nama || userProfile.value.Nama || userProfile.value.nama || userProfile.value.name || 'User';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(nameToUse)}`;
});

// Sync data user secara reaktif ketika store.currentUser dimuat
watch(() => store.currentUser, (curr) => {
  if (curr) {
    userProfile.value = { ...curr };
    form.value.nama = curr.Nama || curr.nama || curr.name || '';
    form.value.bio = curr.Bio || curr.bio || '';
    form.value.avatarUrl = curr.Avatar || curr.avatar || curr.avatarUrl || '';
  }
}, { immediate: true, deep: true });

const saveUserProfile = async () => {
  const currentUserId = store.currentUser?.id;
  
  if (!currentUserId) {
    alert("Sesi pengguna tidak ditemukan.");
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
      Avatar: form.value.avatarUrl
    };

    if (form.value.password) {
      payload.password = form.value.password;
    }

    const res = await api.updateData('Users', currentUserId, payload);
    
    if (res.success || res) {
      const updatedUser = {
        ...store.currentUser,
        ...payload
      };
      
      // Update state store Pinia & localStorage
      store.setCurrentUser(updatedUser);
      userProfile.value = updatedUser;
      
      alert('Profil berhasil diperbarui!');
      form.value.password = '';
    } else {
      alert('Gagal memperbarui profil.');
    }
  } catch (err) {
    console.error("Gagal menyimpan profil:", err);
    alert('Terjadi kesalahan saat menyimpan profil: ' + err.message);
  } finally {
    isSaving.value = false;
  }
};

const handleLogout = () => {
  if (confirm('Apakah Anda yakin ingin keluar?')) {
    store.logout();
    emit('logout-success');
  }
};
</script>