<!-- src/views/PageUsers.vue -->
<template>
  <section id="page-users" class="page-section space-y-4 md:space-y-6 pb-20 md:pb-6">
    <!-- KONDISI JIKA USER TIDAK PUNYA HAK AKSES -->
    <div
      v-if="!canViewPage"
      class="glass-card p-12 text-center rounded-3xl space-y-3 mt-10 shadow-sm border border-slate-100 dark:border-slate-800"
    >
      <i class="fa-solid fa-lock text-4xl text-rose-500 mb-2"></i>
      <h3 class="font-bold text-lg ui-text-primary">Akses Modul Dibatasi</h3>
      <p class="text-xs ui-text-muted">
        Anda tidak memiliki hak akses ke modul Manajemen Akses Pengguna.
      </p>
    </div>

    <!-- KONDISI JIKA USER MEMILIKI HAK AKSES (TAMPILAN NORMAL) -->
    <template v-else>
      <div
        class="ui-card md:p-6 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h3 class="font-semibold flex items-center gap-2 ui-text-primary ui-text-title">
            <i class="fa-solid fa-users-gear text-theme"></i> Manajemen Akses Pengguna
          </h3>
          <p class="text-xs mt-0.5 font-normal ui-text-muted">
            Kelola data staf, role, divisi, unit, dan hak akses halaman.
          </p>
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto">
          <button
            @click="store.openModal('kodeakses')"
            class="flex-1 sm:flex-none bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ui-button min-h-0 ui-text-body"
          >
            <i class="fa-solid fa-key text-xs"></i> Passcode Publik
          </button>

          <button
            v-if="canManageUsers"
            @click="openAddUserModal"
            class="px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0 ui-button ui-button-primary min-h-0 ui-text-body"
          >
            <i class="fa-solid fa-user-plus text-xs"></i> Tambah Pengguna
          </button>
        </div>
      </div>

      <div class="ui-card md:p-6 border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse whitespace-nowrap ui-text-body">
            <thead>
              <tr
                class="border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold uppercase tracking-wider text-xs bg-slate-50/50 dark:bg-slate-800/50"
              >
                <th class="pb-3 px-3">Pengguna & Penempatan</th>
                <th class="pb-3 px-3">Role</th>
                <th class="pb-3 px-3">Akses Halaman</th>
                <th class="pb-3 px-3 text-right" v-if="canManageUsers">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 ui-text-secondary">
              <tr v-if="isLoadingUsers && usersList.length === 0">
                <td colspan="4" class="py-8 text-center font-normal ui-text-muted">
                  <i class="fa-solid fa-circle-notch fa-spin text-base mr-2"></i>
                  Memuat data pengguna...
                </td>
              </tr>

              <tr v-else-if="usersList.length === 0">
                <td colspan="4" class="py-8 text-center font-normal ui-text-muted">
                  Belum ada data pengguna.
                </td>
              </tr>

              <tr
                v-else
                v-for="user in usersList"
                :key="user.id"
                class="transition-colors ui-row-hover"
              >
                <!-- Info User & Unit/Divisi Masterdata -->
                <td class="py-3 px-3">
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
                      <p class="font-semibold truncate ui-text-primary">
                        {{ user.nama || user.Nama || "Tanpa Nama" }}
                      </p>
                      <p class="text-xs truncate mb-1 font-normal ui-text-muted">
                        {{ user.email || user.Email || "-" }}
                      </p>
                      <div class="flex flex-wrap gap-1 mt-0.5">
                        <span
                          v-if="user.unit || user.Unit"
                          class="px-1.5 py-[2px] rounded text-xs font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/20 uppercase"
                        >
                          <i class="fa-solid fa-building mr-0.5"></i>
                          {{ user.unit || user.Unit }}
                        </span>
                        <span
                          v-if="user.divisi || user.Divisi"
                          class="px-1.5 py-[2px] rounded text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                        >
                          <i class="fa-solid fa-sitemap mr-0.5"></i>
                          {{ user.divisi || user.Divisi }}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Role -->
                <td class="py-3 px-3">
                  <span
                    class="px-2.5 py-1 rounded-lg text-xs font-semibold uppercase border"
                    :class="getRoleBadgeClass(user.role || user.Role)"
                  >
                    {{ user.role || user.Role || "USER" }}
                  </span>
                </td>

                <!-- Rincian Akses Halaman -->
                <td class="py-3 px-3">
                  <div
                    v-if="(user.role || user.Role) === 'SUPERADMIN'"
                    class="text-xs text-theme font-semibold"
                  >
                    <i class="fa-solid fa-shield-halved mr-1"></i> Akses Penuh (Superadmin)
                  </div>
                  <div v-else class="flex flex-wrap gap-1 max-w-xs">
                    <div v-if="user.permissions" class="flex flex-wrap gap-1">
                      <span
                        v-for="(perm, pageKey) in user.permissions"
                        :key="pageKey"
                        v-show="perm.access"
                        class="px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ui-text-secondary"
                      >
                        {{ getPageLabel(pageKey) }}
                      </span>
                    </div>
                    <span v-else class="text-xs italic font-normal ui-text-muted"
                      >Belum disetel</span
                    >
                  </div>
                </td>

                <!-- Aksi -->
                <td class="py-3 px-3 text-right" v-if="canManageUsers">
                  <div class="flex items-center justify-end gap-1.5">
                    <button
                      @click="openEditUserModal(user)"
                      class="p-1.5 text-theme hover:bg-blue-50 rounded-lg transition-colors cursor-pointer ui-button glass-hover min-h-0"
                      title="Edit Akses"
                    >
                      <i class="fa-solid fa-user-pen text-xs"></i>
                    </button>
                    <button
                      @click="deleteUser(user)"
                      class="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer ui-button glass-hover min-h-0"
                      title="Hapus User"
                    >
                      <i class="fa-solid fa-trash-can text-xs"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

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
import { ref, computed, onMounted } from "vue";
import { store } from "../store";
import { api } from "../services/api";
import UserModal from "../components/modals/ModalUserForm.vue";

// --- 1. PENJAGAAN AKSES HALAMAN (VIEW PROTECTION) ---
const canViewPage = computed(() => {
  const user = store.currentUser;
  if (!user) return false;

  const role = String(user.role || user.Role || "").toUpperCase();
  if (role === "SUPERADMIN") return true;

  return store.canAccessPage("users");
});

const usersList = computed(() => store.db.users || []);
const isModalOpen = ref(false);
const selectedUserForEdit = ref(null);

const canManageUsers = computed(() => {
  const role = store.currentUser?.role || store.currentUser?.Role;
  if (!role) return false;
  const r = role.toUpperCase();
  if (r === "SUPERADMIN") return true;
  return store.canEditPage ? store.canEditPage("users") : false;
});

const isLoadingUsers = ref(false);

// ✅ PERBAIKAN: Gunakan pemanggilan spesifik untuk mengambil data users dari Firestore
const fetchUsersData = async () => {
  if (!canViewPage.value) return;
  isLoadingUsers.value = true;
  try {
    if (api && api.getUsers) {
      const res = await api.getUsers();
      if (res) {
        if (!store.db) store.db = {};
        store.db.users = res;
      }
    }
  } catch (err) {
    console.error("Gagal memuat data pengguna:", err);
  } finally {
    isLoadingUsers.value = false;
  }
};

onMounted(() => {
  fetchUsersData();
});

const getRoleBadgeClass = (role) => {
  const r = String(role || "").toUpperCase();
  if (r === "SUPERADMIN")
    return "bg-purple-500/10 text-purple-600 border-purple-500/30";
  if (r === "ADMIN")
    return "bg-emerald-500/10 text-emerald-600 border-emerald-500/30";
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
  if (!canManageUsers.value) return;
  selectedUserForEdit.value = null;
  isModalOpen.value = true;
};

const openEditUserModal = (user) => {
  if (!canManageUsers.value) return;
  selectedUserForEdit.value = { ...user };
  isModalOpen.value = true;
};

const handleSaveUser = async (formData) => {
  if (!canManageUsers.value) return;
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
        await fetchUsersData();
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
        await fetchUsersData();
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
  if (!canManageUsers.value) return;
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
        await fetchUsersData();
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
