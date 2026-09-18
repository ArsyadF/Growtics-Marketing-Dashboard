<!-- src/views/PageCustomerCare.vue -->
<template>
  <div class="space-y-4 md:space-y-6">
    <!-- HEADER HALAMAN & RINGKASAN STASTISTIK -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-4 md:p-5 rounded-3xl border border-white/20 dark:border-slate-800 shadow-sm"
    >
      <div>
        <h2
          class="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"
        >
          <i class="fa-solid fa-headset text-theme"></i>
          Customer Care & Aduan Layanan
        </h2>
        <p class="text-xs text-slate-400 mt-0.5">
          Kelola tiket aduan, masukan pelanggan, dan eskalasi penanganan
          masalah.
        </p>
      </div>

      <!-- Tombol Tambah HANYA untuk User dengan Hak Edit / Admin / SPV / Superadmin -->
      <button
        v-if="canCreateOrEdit"
        @click="openAddModal"
        class="bg-button hover:opacity-90 text-white font-bold px-4 py-2.5 rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
      >
        <i class="fa-solid fa-plus text-xs"></i>
        <span>Buat Tiket Aduan</span>
      </button>
    </div>

    <!-- STATISTIK RINGKAS (4 CARDS) -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div
        class="glass-card bg-white/80 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-xs flex items-center gap-3"
      >
        <div
          class="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-base shrink-0"
        >
          <i class="fa-solid fa-inbox"></i>
        </div>
        <div>
          <p
            class="text-[10px] font-medium text-slate-400 uppercase tracking-wider"
          >
            Total Aduan
          </p>
          <p
            class="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight"
          >
            {{ tickets.length }}
          </p>
        </div>
      </div>

      <div
        class="glass-card bg-white/80 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-xs flex items-center gap-3"
      >
        <div
          class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-base shrink-0"
        >
          <i class="fa-solid fa-clock"></i>
        </div>
        <div>
          <p
            class="text-[10px] font-medium text-slate-400 uppercase tracking-wider"
          >
            Menunggu
          </p>
          <p
            class="text-lg font-bold text-amber-600 dark:text-amber-400 leading-tight"
          >
            {{ countByStatus("Open") }}
          </p>
        </div>
      </div>

      <div
        class="glass-card bg-white/80 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-xs flex items-center gap-3"
      >
        <div
          class="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-base shrink-0"
        >
          <i class="fa-solid fa-spinner"></i>
        </div>
        <div>
          <p
            class="text-[10px] font-medium text-slate-400 uppercase tracking-wider"
          >
            Diproses
          </p>
          <p
            class="text-lg font-bold text-purple-600 dark:text-purple-400 leading-tight"
          >
            {{ countByStatus("In Progress") }}
          </p>
        </div>
      </div>

      <div
        class="glass-card bg-white/80 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-xs flex items-center gap-3"
      >
        <div
          class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-base shrink-0"
        >
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <div>
          <p
            class="text-[10px] font-medium text-slate-400 uppercase tracking-wider"
          >
            Selesai
          </p>
          <p
            class="text-lg font-bold text-emerald-600 dark:text-emerald-400 leading-tight"
          >
            {{ countByStatus("Resolved") }}
          </p>
        </div>
      </div>
    </div>

    <!-- FILTER & PENCARIAN -->
    <div
      class="glass-card bg-white/80 dark:bg-slate-900/80 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-xs flex flex-col md:flex-row gap-3 justify-between items-center text-xs"
    >
      <div class="relative w-full md:w-72">
        <i
          class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        ></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama, tiket, atau masalah..."
          class="w-full glass-input rounded-xl pl-9 pr-3 py-2 outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
        />
      </div>

      <div
        class="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end"
      >
        <select
          v-model="filterUnit"
          class="glass-input rounded-xl px-3 py-2 outline-none dark:bg-slate-800 font-medium"
        >
          <option value="">Semua Unit</option>
          <option v-for="u in masterUnits" :key="u.code" :value="u.code">
            {{ u.code }}
          </option>
        </select>

        <select
          v-model="filterStatus"
          class="glass-input rounded-xl px-3 py-2 outline-none dark:bg-slate-800 font-medium"
        >
          <option value="">Semua Status</option>
          <option value="Open">Open (Menunggu)</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved (Selesai)</option>
        </select>

        <select
          v-model="filterPriority"
          class="glass-input rounded-xl px-3 py-2 outline-none dark:bg-slate-800 font-medium"
        >
          <option value="">Semua Prioritas</option>
          <option value="Tinggi">Tinggi</option>
          <option value="Sedang">Sedang</option>
          <option value="Rendah">Rendah</option>
        </select>
      </div>
    </div>

    <!-- ACTION BAR SELEKSI MASSAL (BULK ACTION BAR) -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="selectedIds.length > 0"
        class="bg-emerald-600 text-white p-3 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 shadow-lg text-xs"
      >
        <div class="flex items-center gap-2 font-semibold">
          <i class="fa-solid fa-list-check"></i>
          <span>{{ selectedIds.length }} data tiket terpilih</span>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <!-- Dropdown Status Massal -->
          <div v-if="canCreateOrEdit" class="flex items-center gap-1">
            <span class="text-[11px] opacity-80">Status:</span>
            <select
              v-model="bulkStatus"
              class="bg-emerald-700 text-white rounded-lg px-2.5 py-1 text-xs outline-none cursor-pointer border border-emerald-500 font-semibold"
            >
              <option value="">-- Tidak Diubah --</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <!-- Dropdown Prioritas Massal -->
          <div v-if="canCreateOrEdit" class="flex items-center gap-1">
            <span class="text-[11px] opacity-80">Prioritas:</span>
            <select
              v-model="bulkPriority"
              class="bg-emerald-700 text-white rounded-lg px-2.5 py-1 text-xs outline-none cursor-pointer border border-emerald-500 font-semibold"
            >
              <option value="">-- Tidak Diubah --</option>
              <option value="Tinggi">Tinggi</option>
              <option value="Sedang">Sedang</option>
              <option value="Rendah">Rendah</option>
            </select>
          </div>

          <!-- Tombol Trigger Terapkan Edit Massal -->
          <button
            v-if="canCreateOrEdit && (bulkStatus || bulkPriority)"
            @click="applyBulkEdit"
            class="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-lg font-bold flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
          >
            <i class="fa-solid fa-check text-[11px]"></i>
            <span>Terapkan</span>
          </button>

          <!-- Hapus Massal -->
          <button
            @click="bulkDelete"
            class="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1 rounded-lg font-bold flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
          >
            <i class="fa-solid fa-trash-can text-[11px]"></i>
            <span>Hapus Massal</span>
          </button>

          <button
            @click="resetBulkSelection"
            class="text-white/80 hover:text-white underline text-[11px] ml-1 cursor-pointer"
          >
            Batal
          </button>
        </div>
      </div>
    </transition>

    <!-- TABEL ADUAN (Klik Baris Untuk Buka Detail Popup) -->
    <div
      class="glass-card bg-white/90 dark:bg-slate-900/90 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-md overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr
              class="bg-slate-100/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border-b border-slate-200/60 dark:border-slate-800 select-none"
            >
              <!-- Checkbox Select All -->
              <th class="p-3.5 w-10 text-center">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  @change="toggleSelectAll"
                  class="accent-emerald-600 rounded cursor-pointer"
                />
              </th>

              <!-- Sort: No Tiket -->
              <th
                @click="sortBy('ticketNo')"
                class="p-3.5 font-bold cursor-pointer hover:text-emerald-600 transition-colors"
              >
                <div class="flex items-center gap-1">
                  <span>No. Tiket</span>
                  <i class="fa-solid" :class="getSortIcon('ticketNo')"></i>
                </div>
              </th>

              <!-- Sort: Pelanggan -->
              <th
                @click="sortBy('customerName')"
                class="p-3.5 font-bold cursor-pointer hover:text-emerald-600 transition-colors"
              >
                <div class="flex items-center gap-1">
                  <span>Pelanggan / Kontak</span>
                  <i class="fa-solid" :class="getSortIcon('customerName')"></i>
                </div>
              </th>

              <!-- Sort: Unit -->
              <th
                @click="sortBy('unit')"
                class="p-3.5 font-bold cursor-pointer hover:text-emerald-600 transition-colors"
              >
                <div class="flex items-center gap-1">
                  <span>Unit Usaha</span>
                  <i class="fa-solid" :class="getSortIcon('unit')"></i>
                </div>
              </th>

              <th class="p-3.5 font-bold">Kategori / Masalah</th>

              <!-- Sort: Prioritas -->
              <th
                @click="sortBy('priority')"
                class="p-3.5 font-bold text-center cursor-pointer hover:text-emerald-600 transition-colors"
              >
                <div class="flex items-center justify-center gap-1">
                  <span>Prioritas</span>
                  <i class="fa-solid" :class="getSortIcon('priority')"></i>
                </div>
              </th>

              <!-- Sort: Status -->
              <th
                @click="sortBy('status')"
                class="p-3.5 font-bold text-center cursor-pointer hover:text-emerald-600 transition-colors"
              >
                <div class="flex items-center justify-center gap-1">
                  <span>Status</span>
                  <i class="fa-solid" :class="getSortIcon('status')"></i>
                </div>
              </th>

              <!-- Sort: Tanggal -->
              <th
                @click="sortBy('date')"
                class="p-3.5 font-bold cursor-pointer hover:text-emerald-600 transition-colors"
              >
                <div class="flex items-center gap-1">
                  <span>Tanggal</span>
                  <i class="fa-solid" :class="getSortIcon('date')"></i>
                </div>
              </th>

              <th class="p-3.5 font-bold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
            <tr
              v-for="item in filteredTickets"
              :key="item.id"
              @click="openDetailModal(item)"
              class="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
              :class="{ 'bg-emerald-500/5': selectedIds.includes(item.id) }"
            >
              <!-- Checkbox Row -->
              <td class="p-3.5 text-center" @click.stop>
                <input
                  type="checkbox"
                  :value="item.id"
                  v-model="selectedIds"
                  class="accent-emerald-600 rounded cursor-pointer"
                />
              </td>

              <!-- Tiket ID -->
              <td class="p-3.5 font-mono font-bold text-theme">
                #{{ item.ticketNo || item.id }}
              </td>

              <!-- Pelanggan -->
              <td class="p-3.5">
                <p
                  class="font-bold text-slate-800 dark:text-slate-100 group-hover:text-theme transition-colors"
                >
                  {{ item.customerName }}
                </p>
                <p class="text-[10px] text-slate-400">
                  {{ item.contact || "-" }}
                </p>
              </td>

              <!-- Unit -->
              <td class="p-3.5 font-semibold">
                <span
                  class="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50"
                >
                  {{ item.unit }}
                </span>
              </td>

              <!-- Deskripsi Masalah -->
              <td class="p-3.5 max-w-xs">
                <p
                  class="font-semibold text-slate-700 dark:text-slate-200 truncate"
                >
                  {{ item.category }}
                </p>
                <p class="text-[11px] text-slate-400 truncate">
                  {{ item.description }}
                </p>
              </td>

              <!-- Prioritas Badge -->
              <td class="p-3.5 text-center">
                <span
                  :class="getPriorityClass(item.priority)"
                  class="px-2.5 py-1 rounded-full text-[10px] font-bold"
                >
                  {{ item.priority }}
                </span>
              </td>

              <!-- Status Badge -->
              <td class="p-3.5 text-center">
                <span
                  :class="getStatusClass(item.status)"
                  class="px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1"
                >
                  <i :class="getStatusIcon(item.status)"></i>
                  {{ item.status }}
                </span>
              </td>

              <!-- Tanggal -->
              <td class="p-3.5 text-slate-500 whitespace-nowrap">
                {{ formatDate(item.date) }}
              </td>

              <!-- Tombol Aksi -->
              <td class="p-3.5 text-center" @click.stop>
                <div class="flex items-center justify-center gap-1.5">
                  <button
                    @click="openDetailModal(item)"
                    class="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    :title="
                      canCreateOrEdit ? 'Edit Tiket' : 'Lihat Detail Tiket'
                    "
                  >
                    <i
                      :class="
                        canCreateOrEdit
                          ? 'fa-solid fa-pen-to-square'
                          : 'fa-solid fa-eye'
                      "
                    ></i>
                  </button>

                  <!-- Tombol Hapus: Superadmin/SPV ATAU Pembuat Tiket Sendiri -->
                  <button
                    v-if="canDeleteItem(item)"
                    @click="deleteTicket(item)"
                    class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Hapus Tiket"
                  >
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </td>
            </tr>

            <!-- STATE JIKA DATA KOSONG -->
            <tr v-if="filteredTickets.length === 0">
              <td colspan="9" class="p-8 text-center text-slate-400">
                <i class="fa-solid fa-folder-open text-3xl mb-2 opacity-40"></i>
                <p class="font-medium">
                  Tidak ada data tiket aduan yang ditemukan.
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL POPUP DETAIL / FORM TIKET ADUAN -->
    <Teleport to="body">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
        @click.self="isModalOpen = false"
      >
        <div
          class="glass-card w-full max-w-lg bg-white/95 dark:bg-slate-900/95 rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
        >
          <div
            class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3"
          >
            <div>
              <span
                class="text-[10px] font-mono font-bold text-theme bg-theme/10 px-2 py-0.5 rounded border border-theme/20"
              >
                #{{ form.ticketNo }}
              </span>
              <h3
                class="font-bold text-slate-800 dark:text-slate-100 text-sm md:text-base mt-1 flex items-center gap-2"
              >
                <i class="fa-solid fa-ticket text-theme"></i>
                {{
                  isEdit
                    ? canCreateOrEdit
                      ? "Edit Tiket Aduan"
                      : "Rincian Tiket Aduan"
                    : "Buat Tiket Aduan Baru"
                }}
              </h3>
            </div>
            <button
              @click="isModalOpen = false"
              class="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <form @submit.prevent="saveTicket" class="space-y-3 text-xs">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-slate-500 font-medium mb-1"
                  >Nama Pelanggan / Pelapor</label
                >
                <input
                  v-model="form.customerName"
                  type="text"
                  required
                  :disabled="!canCreateOrEdit"
                  placeholder="Nama Lengkap"
                  class="w-full glass-input rounded-xl p-2.5 outline-none disabled:bg-slate-100 dark:disabled:bg-slate-800/60 disabled:text-slate-500"
                />
              </div>
              <div>
                <label class="block text-slate-500 font-medium mb-1"
                  >Kontak (WA / Email)</label
                >
                <input
                  v-model="form.contact"
                  type="text"
                  :disabled="!canCreateOrEdit"
                  placeholder="08xxxxxxx"
                  class="w-full glass-input rounded-xl p-2.5 outline-none disabled:bg-slate-100 dark:disabled:bg-slate-800/60 disabled:text-slate-500"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-slate-500 font-medium mb-1"
                  >Unit Usaha</label
                >
                <select
                  v-model="form.unit"
                  required
                  :disabled="!canCreateOrEdit"
                  class="w-full glass-input rounded-xl p-2.5 dark:bg-slate-800 outline-none disabled:opacity-70"
                >
                  <option
                    v-for="u in masterUnits"
                    :key="u.code"
                    :value="u.code"
                  >
                    {{ u.code }} - {{ u.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-slate-500 font-medium mb-1"
                  >Kategori Masalah</label
                >
                <select
                  v-model="form.category"
                  required
                  :disabled="!canCreateOrEdit"
                  class="w-full glass-input rounded-xl p-2.5 dark:bg-slate-800 outline-none disabled:opacity-70"
                >
                  <option value="Keterlambatan Pengiriman">
                    Keterlambatan Pengiriman
                  </option>
                  <option value="Kerusakan Produk / Cetak">
                    Kerusakan Produk / Cetak
                  </option>
                  <option value="Pelayanan CS / Admin">
                    Pelayanan CS / Admin
                  </option>
                  <option value="Kesalahan Order / Jumlah">
                    Kesalahan Order / Jumlah
                  </option>
                  <option value="Lain-lain">Lain-lain</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-slate-500 font-medium mb-1"
                  >Tingkat Prioritas</label
                >
                <select
                  v-model="form.priority"
                  required
                  :disabled="!canCreateOrEdit"
                  class="w-full glass-input rounded-xl p-2.5 dark:bg-slate-800 outline-none disabled:opacity-70"
                >
                  <option value="Rendah">Rendah</option>
                  <option value="Sedang">Sedang</option>
                  <option value="Tinggi">Tinggi</option>
                </select>
              </div>
              <div>
                <label class="block text-slate-500 font-medium mb-1"
                  >Status Penanganan</label
                >
                <select
                  v-model="form.status"
                  required
                  :disabled="!canCreateOrEdit"
                  class="w-full glass-input rounded-xl p-2.5 dark:bg-slate-800 outline-none font-bold disabled:opacity-70"
                >
                  <option value="Open">Open (Menunggu)</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved (Selesai)</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-slate-500 font-medium mb-1"
                >Rincian Keluhan / Aduan</label
              >
              <textarea
                v-model="form.description"
                rows="4"
                required
                :disabled="!canCreateOrEdit"
                placeholder="Jelaskan detail aduan pelanggan..."
                class="w-full glass-input rounded-xl p-2.5 outline-none resize-y min-h-[90px] disabled:bg-slate-100 dark:disabled:bg-slate-800/60 disabled:text-slate-500"
              ></textarea>
            </div>

            <!-- Info Pembuat Tiket -->
            <div
              v-if="form.createdBy"
              class="text-[10px] text-slate-400 italic"
            >
              Dibuat oleh: {{ form.createdBy }}
            </div>

            <div
              class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center"
            >
              <button
                v-if="isEdit && canDeleteItem(form)"
                type="button"
                @click="deleteTicket(form)"
                class="text-rose-500 font-bold hover:underline cursor-pointer text-xs"
              >
                Hapus Tiket
              </button>

              <div class="flex gap-2 ml-auto">
                <button
                  type="button"
                  @click="isModalOpen = false"
                  class="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {{ canCreateOrEdit ? "Batal" : "Tutup" }}
                </button>
                <button
                  v-if="canCreateOrEdit"
                  type="submit"
                  :disabled="isSubmitting"
                  class="bg-button text-white px-5 py-2 rounded-xl font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  {{ isSubmitting ? "Menyimpan..." : "Simpan Tiket" }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { store } from "../store/index.js";
import { api } from "../services/api.js";

const searchQuery = ref("");
const filterUnit = ref("");
const filterStatus = ref("");
const filterPriority = ref("");

// --- STATE SELEKSI MASSAL & SORT ---
const selectedIds = ref([]);
const sortField = ref("date");
const sortOrder = ref("desc");

// State penampung pilihan edit massal (Belum dieksekusi sebelum klik Terapkan)
const bulkStatus = ref("");
const bulkPriority = ref("");

// Reset Pilihan Bulk Action
const resetBulkSelection = () => {
  selectedIds.value = [];
  bulkStatus.value = "";
  bulkPriority.value = "";
};

// --- ESEKUSI EDIT MASSAL SETELAH TRIGGER BUTTON "TERAPKAN" ---
const applyBulkEdit = async () => {
  if (selectedIds.value.length === 0) return;
  if (!bulkStatus.value && !bulkPriority.value) {
    store.addNotification(
      "Peringatan",
      "Pilih minimal satu perubahan (Status atau Prioritas)",
      "warning",
    );
    return;
  }

  store.isLoading = true;
  try {
    const updatePromises = selectedIds.value.map((id) => {
      const ticket = tickets.value.find((t) => String(t.id) === String(id));
      if (ticket) {
        if (bulkStatus.value) ticket.status = bulkStatus.value;
        if (bulkPriority.value) ticket.priority = bulkPriority.value;

        if (api && api.saveAduanData) {
          return api.saveAduanData(ticket);
        }
      }
    });

    await Promise.all(updatePromises);

    let changesText = [];
    if (bulkStatus.value) changesText.push(`Status: ${bulkStatus.value}`);
    if (bulkPriority.value)
      changesText.push(`Prioritas: ${bulkPriority.value}`);

    store.addNotification(
      "Berhasil",
      `Perubahan (${changesText.join(", ")}) diterapkan pada ${selectedIds.value.length} tiket.`,
      "success",
    );

    resetBulkSelection();
  } catch (err) {
    store.addNotification("Gagal", err.message, "warning");
  } finally {
    store.isLoading = false;
  }
};

const isModalOpen = ref(false);
const isEdit = ref(false);
const isSubmitting = ref(false);

const currentUser = computed(() => store.currentUser || {});

// User yang bisa EDIT / TAMBAH
const canCreateOrEdit = computed(() => {
  const role = currentUser.value?.role?.toUpperCase();
  if (["SUPERADMIN", "SPV", "ADMIN"].includes(role)) return true;
  return store.canEditPage("aduan");
});

// Penentu Izin Hapus Spesifik: Superadmin/SPV bisa semua, User canEdit hanya bisa data miliknya sendiri
const canDeleteItem = (item) => {
  if (!item) return false;

  const role = currentUser.value?.role?.toUpperCase();

  // 1. Superadmin & SPV bebas menghapus apa saja
  if (["SUPERADMIN", "SPV"].includes(role)) return true;

  // 2. Jika user punya hak edit di modul aduan
  if (store.canEditPage("aduan")) {
    const userEmail = (currentUser.value?.email || "").toLowerCase();
    const userId = (currentUser.value?.id || "").toLowerCase();
    const creator = (item.createdBy || item.createdByEmail || "").toLowerCase();

    if (!creator) return false;

    return (
      (userEmail && creator === userEmail) || (userId && creator === userId)
    );
  }

  return false;
};

const masterUnits = computed(
  () =>
    store.db?.master?.unitList || [
      { code: "NHP", name: "Nur Hidayah Press" },
      { code: "NHC", name: "Nur Hidayah Creative" },
      { code: "KG", name: "Karta Grafika" },
    ],
);

const tickets = computed(() => store.db?.aduanList || store.aduanList || []);

const form = reactive({
  id: null,
  ticketNo: "",
  customerName: "",
  contact: "",
  unit: "NHP",
  category: "Keterlambatan Pengiriman",
  priority: "Sedang",
  status: "Open",
  description: "",
  date: "",
  createdBy: "",
});

const countByStatus = (st) =>
  tickets.value.filter((t) => t.status === st).length;

// --- LOGIKA FILTER & SORT TABEL ---
const filteredTickets = computed(() => {
  let list = tickets.value.filter((item) => {
    const q = searchQuery.value.toLowerCase();
    const matchSearch =
      !q ||
      (item.customerName || "").toLowerCase().includes(q) ||
      (item.ticketNo || "").toLowerCase().includes(q) ||
      (item.description || "").toLowerCase().includes(q);

    const matchUnit = !filterUnit.value || item.unit === filterUnit.value;
    const matchStatus =
      !filterStatus.value || item.status === filterStatus.value;
    const matchPriority =
      !filterPriority.value || item.priority === filterPriority.value;

    return matchSearch && matchUnit && matchStatus && matchPriority;
  });

  // Urutkan data berdasarkan sortField & sortOrder
  list.sort((a, b) => {
    let valA = a[sortField.value] || "";
    let valB = b[sortField.value] || "";

    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();

    if (valA < valB) return sortOrder.value === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder.value === "asc" ? 1 : -1;
    return 0;
  });

  return list;
});

// Fungsi Trigger Sort
const sortBy = (field) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortOrder.value = "asc";
  }
};

// Icon Indikator Sort
const getSortIcon = (field) => {
  if (sortField.value !== field) return "fa-sort opacity-30 text-[10px]";
  return sortOrder.value === "asc"
    ? "fa-sort-up text-emerald-600"
    : "fa-sort-down text-emerald-600";
};

// --- LOGIKA CENTANG MASSAL (SELECT ALL) ---
const isAllSelected = computed(() => {
  if (filteredTickets.value.length === 0) return false;
  return filteredTickets.value.every((t) => selectedIds.value.includes(t.id));
});

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value = [];
  } else {
    selectedIds.value = filteredTickets.value.map((t) => t.id);
  }
};

// --- FITUR BULK EDIT STATUS & PRIORITAS ---
const bulkUpdateStatus = async (newStatus) => {
  if (!newStatus || selectedIds.value.length === 0) return;

  store.isLoading = true;
  try {
    const updatePromises = selectedIds.value.map((id) => {
      const ticket = tickets.value.find((t) => String(t.id) === String(id));
      if (ticket) {
        ticket.status = newStatus;
        if (api && api.saveAduanData) return api.saveAduanData(ticket);
      }
    });

    await Promise.all(updatePromises);
    store.addNotification(
      "Berhasil",
      `Status ${selectedIds.value.length} tiket diperbarui menjadi ${newStatus}`,
      "success",
    );
    selectedIds.value = [];
  } catch (err) {
    store.addNotification("Gagal", err.message, "warning");
  } finally {
    store.isLoading = false;
  }
};

const bulkUpdatePriority = async (newPriority) => {
  if (!newPriority || selectedIds.value.length === 0) return;

  store.isLoading = true;
  try {
    const updatePromises = selectedIds.value.map((id) => {
      const ticket = tickets.value.find((t) => String(t.id) === String(id));
      if (ticket) {
        ticket.priority = newPriority;
        if (api && api.saveAduanData) return api.saveAduanData(ticket);
      }
    });

    await Promise.all(updatePromises);
    store.addNotification(
      "Berhasil",
      `Prioritas ${selectedIds.value.length} tiket diperbarui menjadi ${newPriority}`,
      "success",
    );
    selectedIds.value = [];
  } catch (err) {
    store.addNotification("Gagal", err.message, "warning");
  } finally {
    store.isLoading = false;
  }
};

// --- FITUR BULK DELETE DENGAN VALIDASI HAK MILIK ---
const bulkDelete = () => {
  if (selectedIds.value.length === 0) return;

  const targetTickets = tickets.value.filter((t) =>
    selectedIds.value.includes(t.id),
  );

  // Pisahkan tiket yang boleh dihapus dan tiket yang ditolak
  const deletableTickets = targetTickets.filter((t) => canDeleteItem(t));
  const forbiddenCount = targetTickets.length - deletableTickets.length;

  if (deletableTickets.length === 0) {
    store.addNotification(
      "Akses Ditolak",
      `Seluruh ${targetTickets.length} tiket yang dicentang bukan milik Anda dan tidak dapat dihapus.`,
      "warning",
    );
    return;
  }

  let confirmMsg = `Yakin menghapus ${deletableTickets.length} tiket aduan?`;
  if (forbiddenCount > 0) {
    confirmMsg += ` (${forbiddenCount} tiket milik user lain akan dilewati/tidak terhapus)`;
  }

  store.openAlert(
    "Konfirmasi Hapus Massal",
    confirmMsg,
    async () => {
      store.isLoading = true;
      try {
        const deletePromises = deletableTickets.map((t) => {
          if (api && api.deleteAduanData) return api.deleteAduanData(t.id);
        });

        await Promise.all(deletePromises);

        // Hapus data terhapus dari reactive store
        deletableTickets.forEach((t) => {
          const idx = store.db.aduanList.findIndex(
            (item) => String(item.id) === String(t.id),
          );
          if (idx !== -1) store.db.aduanList.splice(idx, 1);
        });

        if (forbiddenCount > 0) {
          store.addNotification(
            "Hapus Parsial",
            `${deletableTickets.length} tiket milik Anda berhasil dihapus. ${forbiddenCount} tiket gagal dihapus karena bukan milik Anda.`,
            "warning",
          );
        } else {
          store.addNotification(
            "Berhasil",
            `${deletableTickets.length} tiket aduan berhasil dihapus.`,
            "success",
          );
        }

        selectedIds.value = [];
      } catch (err) {
        store.addNotification("Gagal", err.message, "warning");
      } finally {
        store.isLoading = false;
      }
    },
    "warning",
  );
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getPriorityClass = (priority) => {
  switch (priority) {
    case "Tinggi":
      return "bg-rose-500/10 text-rose-600 border border-rose-500/20";
    case "Sedang":
      return "bg-amber-500/10 text-amber-600 border border-amber-500/20";
    default:
      return "bg-blue-500/10 text-blue-600 border border-blue-500/20";
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case "Resolved":
      return "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20";
    case "In Progress":
      return "bg-purple-500/10 text-purple-600 border border-purple-500/20";
    default:
      return "bg-amber-500/10 text-amber-600 border border-amber-500/20";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "Resolved":
      return "fa-solid fa-circle-check";
    case "In Progress":
      return "fa-solid fa-spinner fa-spin";
    default:
      return "fa-solid fa-clock";
  }
};

const openAddModal = () => {
  if (!canCreateOrEdit.value) return;
  isEdit.value = false;
  Object.assign(form, {
    id: Date.now(),
    ticketNo: "TCK-" + Math.floor(1000 + Math.random() * 9000),
    customerName: "",
    contact: "",
    unit: masterUnits.value[0]?.code || "NHP",
    category: "Keterlambatan Pengiriman",
    priority: "Sedang",
    status: "Open",
    description: "",
    date: new Date().toISOString().split("T")[0],
    createdBy: store.currentUser?.email || store.currentUser?.id || "",
  });
  isModalOpen.value = true;
};

const openDetailModal = (item) => {
  isEdit.value = true;
  Object.assign(form, { ...item });
  isModalOpen.value = true;
};

const saveTicket = async () => {
  if (!canCreateOrEdit.value) return;
  isSubmitting.value = true;
  try {
    const payload = {
      ...form,
      createdBy:
        form.createdBy ||
        currentUser.value?.email ||
        currentUser.value?.nama ||
        "",
    };

    if (api && api.saveAduanData) {
      await api.saveAduanData(payload);
    }

    if (!store.db.aduanList) store.db.aduanList = [];

    if (isEdit.value) {
      const idx = store.db.aduanList.findIndex(
        (t) => String(t.id) === String(form.id),
      );
      if (idx !== -1) store.db.aduanList[idx] = payload;
    } else {
      store.db.aduanList.unshift(payload);
    }

    store.addNotification(
      "Disimpan",
      `Tiket #${form.ticketNo} berhasil disimpan`,
      "success",
    );
    isModalOpen.value = false;
  } catch (err) {
    store.addNotification("Gagal", err.message, "warning");
  } finally {
    isSubmitting.value = false;
  }
};

const deleteTicket = (item) => {
  if (!canDeleteItem(item)) {
    store.addNotification(
      "Akses Ditolak",
      "Anda hanya dapat menghapus tiket aduan yang Anda buat sendiri.",
      "warning",
    );
    return;
  }

  store.openAlert(
    "Konfirmasi Hapus",
    `Hapus tiket aduan #${item.ticketNo}?`,
    async () => {
      try {
        if (api && api.deleteAduanData) await api.deleteAduanData(item.id);
        const idx = store.db.aduanList.findIndex(
          (t) => String(t.id) === String(item.id),
        );
        if (idx !== -1) store.db.aduanList.splice(idx, 1);

        store.addNotification(
          "Dihapus",
          "Tiket aduan telah dihapus",
          "warning",
        );
        isModalOpen.value = false;
      } catch (err) {
        store.addNotification("Gagal", err.message, "warning");
      }
    },
    "warning",
  );
};
</script>
