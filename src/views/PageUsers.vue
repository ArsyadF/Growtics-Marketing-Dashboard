<!-- src/views/PageUsers.vue -->
<template>
  <section id="page-users" class="page-section space-y-4 md:space-y-6">
    <div
      class="glass-card p-4 md:p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
    >
      <div>
        <h3
          class="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"
        >
          <i class="fa-solid fa-users-gear from-[#149B73]"></i> Manajemen Akses
          Pengguna
        </h3>
        <p class="text-xs text-slate-400 mt-0.5">
          Kelola data staf, role, divisi, unit, dan hak akses halaman.
        </p>
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto">
        <button
          @click="store.openModal('kodeakses')"
          class="flex-1 sm:flex-none bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2.5 rounded-xl font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <i class="fa-solid fa-key"></i> Passcode Publik
        </button>

        <button
          v-if="canManageUsers"
          @click="openAddUserModal"
          class="bg-button text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <i class="fa-solid fa-user-plus"></i> Tambah Pengguna
        </button>
      </div>
    </div>

    <div class="glass-card p-4 md:p-6 rounded-3xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr
              class="border-b border-slate-200/60 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider"
            >
              <th class="pb-3 px-2">Pengguna & Penempatan</th>
              <th class="pb-3 px-2">Role</th>
              <th class="pb-3 px-2">Akses Halaman</th>
              <th class="pb-3 px-2 text-right" v-if="canManageUsers">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
            <tr v-if="store.isLoading && usersList.length === 0">
              <td colspan="4" class="py-8 text-center text-slate-400">
                <i class="fa-solid fa-circle-notch fa-spin text-lg mr-2"></i>
                Memuat data pengguna...
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
              <!-- Info User & Unit/Divisi Masterdata -->
              <td class="py-3 px-2">
                <div class="flex items-center gap-3">
                  <img
                    :src="
                      user.avatarUrl ||
                      user.Avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nama || user.Nama || 'User')}&background=0D8ABC&color=fff`
                    "
                    class="w-9 h-9 rounded-full object-cover border border-blue-400/40 shrink-0"
                  />
                  <div class="min-w-0">
                    <p
                      class="font-bold text-slate-800 dark:text-slate-100 truncate"
                    >
                      {{ user.nama || user.Nama || "Tanpa Nama" }}
                    </p>
                    <p class="text-[9px] text-slate-400 truncate mb-1">
                      {{ user.email || user.Email || "-" }}
                    </p>
                    <div class="flex flex-wrap gap-1 mt-0.5">
                      <span
                        v-if="user.unit || user.Unit"
                        class="px-1.5 py-[2px] rounded text-[9px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20 uppercase"
                      >
                        <i class="fa-solid fa-building mr-0.5"></i>
                        {{ user.unit || user.Unit }}
                      </span>
                      <span
                        v-if="user.divisi || user.Divisi"
                        class="px-1.5 py-[2px] rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                      >
                        <i class="fa-solid fa-sitemap mr-0.5"></i>
                        {{ user.divisi || user.Divisi }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Role -->
              <td class="py-3 px-2">
                <span
                  class="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase"
                  :class="getRoleBadgeClass(user.role || user.Role)"
                >
                  {{ user.role || user.Role || "USER" }}
                </span>
              </td>

              <!-- Rincian Akses Halaman -->
              <td class="py-3 px-2">
                <div
                  v-if="(user.role || user.Role) === 'SUPERADMIN'"
                  class="text-[11px] text-theme dark:text-theme font-semibold"
                >
                  <i class="fa-solid fa-shield-halved mr-1"></i> Akses Penuh
                  (Superadmin)
                </div>
                <div v-else class="flex flex-wrap gap-1 max-w-xs">
                  <div v-if="user.permissions" class="flex flex-wrap gap-1">
                    <span
                      v-for="(perm, pageKey) in user.permissions"
                      :key="pageKey"
                      v-show="perm.access"
                      class="px-2 py-0.5 rounded-md text-[9px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    >
                      {{ getPageLabel(pageKey) }}
                    </span>
                  </div>
                  <span v-else class="text-[10px] text-slate-400 italic"
                    >Belum disetel</span
                  >
                </div>
              </td>

              <!-- Aksi -->
              <td class="py-3 px-2 text-right" v-if="canManageUsers">
                <div class="flex items-center justify-end gap-1.5">
                  <button
                    @click="openEditUserModal(user)"
                    class="p-1.5 text-theme hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="Edit Akses"
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
    <Teleport to="body">
      <UserModal
        v-if="isModalOpen"
        :user-data="selectedUserForEdit"
        @close="isModalOpen = false"
        @save="handleSaveUser"
      />
    </Teleport>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import { store } from "../store";
import { api } from "../services/api";
import UserModal from "../components/UserModal.vue";

const usersList = computed(() => store.db.users || []);
const isModalOpen = ref(false);
const selectedUserForEdit = ref(null);

const canManageUsers = computed(() => {
  const role = store.currentUser?.role || store.currentUser?.Role;
  return role ? role.toUpperCase() === "SUPERADMIN" : false;
});

const getRoleBadgeClass = (role) => {
  const r = String(role || "").toUpperCase();
  if (r === "SUPERADMIN")
    return "bg-purple-500/10 text-purple-600 border-purple-500/30";
  if (r === "ADMIN") return "bg-[#25eba11a] text-theme border-theme/30";
  return "bg-slate-500/10 text-slate-600 border-slate-500/30";
};

const getPageLabel = (pageKey) => {
  const labels = {
    main: "Main",
    "unit-NHP": "Unit NHP",
    "unit-NHC": "Unit NHC",
    "unit-KG": "Unit KG",
    leads: "Leads",
    promo: "Promo",
    targets: "Targets",
    "daily-report": "Laporan Harian",
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

const handleSaveUser = async (formData) => {
  isModalOpen.value = false;
  store.isLoading = true;

  try {
    if (selectedUserForEdit.value?.id) {
      const res = await api.updateData(
        "users",
        selectedUserForEdit.value.id,
        formData,
      );
      if (res && res.success) {
        store.openAlert(
          "Berhasil",
          "Hak akses & divisi pengguna diperbarui!",
          null,
          "success",
        );
        await store.loadFullDatabase();
      } else {
        store.openAlert(
          "Gagal",
          res?.message || "Gagal memperbarui.",
          null,
          "warning",
        );
      }
    } else {
      const res = await api.saveData("users", formData);
      if (res && res.success) {
        store.openAlert(
          "Berhasil",
          "Pengguna baru berhasil ditambahkan!",
          null,
          "success",
        );
        await store.loadFullDatabase();
      } else {
        store.openAlert(
          "Gagal",
          res?.message || "Gagal menambahkan pengguna.",
          null,
          "warning",
        );
      }
    }
  } catch (err) {
    store.openAlert("Gagal", err.message, null, "warning");
  } finally {
    store.isLoading = false;
  }
};

const deleteUser = (user) => {
  if (user.id === store.currentUser?.id) {
    return store.openAlert(
      "Perhatian",
      "Tidak dapat menghapus akun Anda sendiri.",
      null,
      "warning",
    );
  }

  store.openAlert(
    "Konfirmasi Hapus",
    `Hapus akun "${user.nama || user.email}"?`,
    async () => {
      store.isLoading = true;
      try {
        await api.deleteData("Users", user.id);
        store.openAlert(
          "Berhasil",
          "Pengguna berhasil dihapus!",
          null,
          "success",
        );
        await store.loadFullDatabase();
      } catch (err) {
        store.openAlert("Gagal", err.message, null, "warning");
      } finally {
        store.isLoading = false;
      }
    },
    "warning",
  );
};
</script>
