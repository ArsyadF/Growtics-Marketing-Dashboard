<!-- src/components/Modals.vue -->
<template>
  <div>
    <!-- 1. Modal Input/Edit Revenue -->
    <div
      v-if="store.activeModal === 'revenue'"
      class="fixed inset-0 bg-slate-950/70 z-50 flex justify-center items-center p-4 backdrop-blur-md"
    >
      <div
        class="glass-card bg-white/95 dark:bg-slate-900/95 rounded-3xl w-full max-w-lg p-6 space-y-4"
      >
        <div class="flex justify-between items-center">
          <h3 class="font-bold text-slate-800 dark:text-slate-100">
            {{ isEditRevenue ? "Edit" : "Input" }} Revenue
          </h3>
          <button
            @click="store.closeModal()"
            class="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form @submit.prevent="saveRevenue" class="space-y-3">
          <div>
            <label class="block text-xs mb-1 font-medium">Tanggal</label>
            <input
              type="date"
              v-model="formRev.Tanggal"
              required
              class="w-full glass-input rounded-xl p-2.5 text-xs outline-none"
            />
          </div>

          <!-- UNIT USAHA DINAMIS FROM STORE -->
          <div>
            <label class="block text-xs mb-1 font-medium">Unit Usaha</label>
            <select
              v-model="formRev.Unit"
              required
              class="w-full glass-input rounded-xl p-2.5 text-xs dark:bg-slate-800 outline-none"
            >
              <option value="" disabled>-- Pilih Unit --</option>
              <option v-for="u in masterUnits" :key="u.code" :value="u.code">
                {{ u.code }} - {{ u.name }}
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs mb-1 font-medium">Revenue (Rp)</label>
              <input
                type="text"
                v-model="displayRevRevenue"
                @input="
                  handleInputFormatted(
                    $event,
                    formRev,
                    'Revenue',
                    'displayRevRevenue',
                  )
                "
                required
                placeholder="0"
                class="w-full glass-input rounded-xl p-2.5 text-xs outline-none"
              />
            </div>
            <div>
              <label class="block text-xs mb-1 font-medium"
                >Jumlah Pesanan (Pcs/Order)</label
              >
              <input
                type="number"
                v-model.number="formRev.JumlahPesanan"
                required
                placeholder="0"
                class="w-full glass-input rounded-xl p-2.5 text-xs outline-none"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs mb-1 font-medium">Divisi</label>
              <select
                v-model="formRev.Divisi"
                required
                class="w-full glass-input rounded-xl p-2.5 text-xs dark:bg-slate-800 outline-none"
              >
                <option value="" disabled>-- Pilih Divisi --</option>
                <option
                  v-for="div in availableDivisions"
                  :key="div"
                  :value="div"
                >
                  {{ div }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs mb-1 font-medium">Platform</label>
              <select
                v-model="formRev.Platform"
                required
                class="w-full glass-input rounded-xl p-2.5 text-xs dark:bg-slate-800 outline-none"
              >
                <option value="" disabled>-- Pilih Platform --</option>
                <option
                  v-for="plat in availablePlatforms"
                  :key="plat"
                  :value="plat"
                >
                  {{ plat }}
                </option>
              </select>
            </div>
          </div>

          <div
            class="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800"
          >
            <button
              type="button"
              @click="store.closeModal()"
              class="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-xs font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              class="bg-button text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md"
            >
              Simpan Revenue
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 2. Modal Input/Edit Leads & Campaign -->
    <div
      v-if="store.activeModal === 'leads'"
      class="fixed inset-0 bg-slate-950/70 z-50 flex justify-center items-center p-4 backdrop-blur-md"
    >
      <div
        class="glass-card bg-white/95 dark:bg-slate-900/95 rounded-3xl w-full max-w-lg p-6 space-y-4"
      >
        <div class="flex justify-between items-center">
          <h3 class="font-bold text-slate-800 dark:text-slate-100">
            {{ isEditLeads ? "Edit" : "Input" }} Leads & Campaign
          </h3>
          <button
            @click="store.closeModal()"
            class="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form @submit.prevent="saveLeads" class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs mb-1 font-medium">Tanggal</label>
              <input
                type="date"
                v-model="formLeads.Tanggal"
                required
                class="w-full glass-input rounded-xl p-2.5 text-xs outline-none"
              />
            </div>
            <div>
              <label class="block text-xs mb-1 font-medium">Unit Usaha</label>
              <select
                v-model="formLeads.Unit"
                required
                class="w-full glass-input rounded-xl p-2.5 text-xs dark:bg-slate-800 outline-none"
              >
                <option value="" disabled>-- Pilih Unit --</option>
                <option v-for="u in masterUnits" :key="u.code" :value="u.code">
                  {{ u.code }} - {{ u.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs mb-1 font-medium">Campaign</label>
              <input
                type="number"
                v-model.number="formLeads.Campaign"
                required
                placeholder="0"
                class="w-full glass-input rounded-xl p-2.5 text-xs outline-none"
              />
            </div>
            <div>
              <label class="block text-xs mb-1 font-medium"
                >Database Leads</label
              >
              <input
                type="number"
                v-model.number="formLeads.DatabaseLeads"
                required
                placeholder="0"
                class="w-full glass-input rounded-xl p-2.5 text-xs outline-none"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs mb-1 font-medium">Follow Up</label>
              <input
                type="number"
                v-model.number="formLeads.FollowUp"
                required
                placeholder="0"
                class="w-full glass-input rounded-xl p-2.5 text-xs outline-none"
              />
            </div>
            <div>
              <label class="block text-xs mb-1 font-medium"
                >Pesanan (Closing)</label
              >
              <input
                type="number"
                v-model.number="formLeads.Pesanan"
                required
                placeholder="0"
                class="w-full glass-input rounded-xl p-2.5 text-xs outline-none"
              />
            </div>
          </div>

          <div
            class="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800"
          >
            <button
              type="button"
              @click="store.closeModal()"
              class="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-xs font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              class="bg-button text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md"
            >
              Simpan Data Leads
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 3. Modal Input/Edit Biaya Promosi -->
    <div
      v-if="store.activeModal === 'promo'"
      class="fixed inset-0 bg-slate-950/70 z-50 flex justify-center items-center p-4 backdrop-blur-md"
    >
      <div
        class="glass-card bg-white/95 dark:bg-slate-900/95 rounded-3xl w-full max-w-md p-6 space-y-4"
      >
        <div class="flex justify-between items-center">
          <h3 class="font-bold text-slate-800 dark:text-slate-100">
            {{ isEditPromo ? "Edit" : "Input" }} Biaya Promosi
          </h3>
          <button
            @click="store.closeModal()"
            class="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form @submit.prevent="savePromo" class="space-y-3">
          <div>
            <label class="block text-xs mb-1 font-medium">Tanggal</label>
            <input
              type="date"
              v-model="formPromo.Tanggal"
              required
              class="w-full glass-input rounded-xl p-2.5 text-xs outline-none"
            />
          </div>

          <div>
            <label class="block text-xs mb-1 font-medium">Unit Usaha</label>
            <select
              v-model="formPromo.Unit"
              required
              class="w-full glass-input rounded-xl p-2.5 text-xs dark:bg-slate-800 outline-none"
            >
              <option value="" disabled>-- Pilih Unit --</option>
              <option v-for="u in masterUnits" :key="u.code" :value="u.code">
                {{ u.code }} - {{ u.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs mb-1 font-medium text-rose-500"
              >Biaya Promosi (Rp)</label
            >
            <input
              type="text"
              v-model="displayPromoBiaya"
              @input="
                handleInputFormatted(
                  $event,
                  formPromo,
                  'BiayaPromosi',
                  'displayPromoBiaya',
                )
              "
              required
              placeholder="0"
              class="w-full glass-input rounded-xl p-2.5 text-xs outline-none"
            />
          </div>

          <div
            class="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800"
          >
            <button
              type="button"
              @click="store.closeModal()"
              class="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-xs font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              class="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md"
            >
              Simpan Biaya Promosi
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 4. Modal Target Settings -->
    <div
      v-if="store.activeModal === 'target'"
      class="fixed inset-0 bg-slate-950/70 z-50 flex justify-center items-center p-4 backdrop-blur-md"
    >
      <div
        class="glass-card bg-white/95 dark:bg-slate-900/95 rounded-3xl w-full max-w-md p-6 space-y-4"
      >
        <div class="flex justify-between items-center">
          <h3 class="font-bold text-slate-800 dark:text-slate-100">
            Update Target Revenue
          </h3>
          <button
            @click="store.closeModal()"
            class="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <form @submit.prevent="saveTargets" class="space-y-3">
          <div>
            <label class="block text-xs mb-1">Target Global (Rp)</label>
            <input
              type="text"
              v-model="displayTargetTahunIni"
              @input="
                handleInputFormatted(
                  $event,
                  formTarget,
                  'TargetTahunIni',
                  'displayTargetTahunIni',
                )
              "
              required
              class="w-full glass-input rounded-xl p-2.5 text-xs outline-none"
            />
          </div>
          <div v-for="u in masterUnits" :key="u.code">
            <label class="block text-xs mb-1">Target {{ u.code }} (Rp)</label>
            <input
              type="number"
              v-model.number="formTarget['Target' + u.code]"
              required
              class="w-full glass-input rounded-xl p-2.5 text-xs outline-none"
            />
          </div>
          <button
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md mt-2 cursor-pointer"
          >
            Simpan Master Targets
          </button>
        </form>
      </div>
    </div>

    <!-- 5. Modal User (Tambah / Edit) -->
    <div
      v-if="store.activeModal === 'user'"
      class="fixed inset-0 bg-slate-950/70 z-50 flex justify-center items-center p-4 backdrop-blur-md"
    >
      <div
        class="glass-card bg-white/95 dark:bg-slate-900/95 rounded-3xl w-full max-w-md p-6 space-y-4"
      >
        <div class="flex justify-between items-center">
          <h3 class="font-bold text-slate-800 dark:text-slate-100">
            {{ isEditUser ? "Edit" : "Tambah" }} Pengguna
          </h3>
          <button
            @click="store.closeModal()"
            class="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <form @submit.prevent="saveUser" class="space-y-3">
          <div>
            <label class="block text-xs mb-1 font-medium">Nama Lengkap</label>
            <input
              type="text"
              v-model="formUser.name"
              required
              class="w-full glass-input rounded-xl p-2.5 text-xs outline-none"
            />
          </div>
          <div>
            <label class="block text-xs mb-1 font-medium"
              >Email / Username</label
            >
            <input
              type="text"
              v-model="formUser.email"
              required
              class="w-full glass-input rounded-xl p-2.5 text-xs outline-none"
            />
          </div>
          <div>
            <label class="block text-xs mb-1 font-medium">Password</label>
            <input
              type="password"
              v-model="formUser.password"
              placeholder="••••••••"
              class="w-full glass-input rounded-xl p-2.5 text-xs outline-none"
            />
          </div>
          <div>
            <label class="block text-xs mb-1 font-medium"
              >Role / Hak Akses</label
            >
            <select
              v-model="formUser.role"
              class="w-full glass-input rounded-xl p-2.5 text-xs dark:bg-slate-800 outline-none"
            >
              <option value="SUPERADMIN">Super Admin (Akses Semua)</option>
              <option value="ADMIN_UNIT">Admin Unit</option>
            </select>
          </div>
          <div v-if="formUser.role === 'ADMIN_UNIT'">
            <label class="block text-xs mb-1 font-medium"
              >Akses Spesifik Unit</label
            >
            <select
              v-model="formUser.unit"
              class="w-full glass-input rounded-xl p-2.5 text-xs dark:bg-slate-800 outline-none"
            >
              <option v-for="u in masterUnits" :key="u.code" :value="u.code">
                Unit {{ u.code }}
              </option>
            </select>
          </div>
          <button
            type="submit"
            class="w-full bg-button hover:opacity-90 text-white font-bold py-2.5 rounded-xl text-xs shadow-md mt-2 cursor-pointer"
          >
            Simpan Pengguna
          </button>
        </form>
      </div>
    </div>

    <!-- 6. Modal Kode Akses (Passcode Publik) -->
    <div
      v-if="store.activeModal === 'kodeakses'"
      class="fixed inset-0 bg-slate-950/70 z-50 flex justify-center items-center p-4 backdrop-blur-md"
    >
      <div
        class="glass-card bg-white/95 dark:bg-slate-900/95 rounded-3xl w-full max-w-md p-6 space-y-4"
      >
        <div class="flex justify-between items-center">
          <h3 class="font-bold text-slate-800 dark:text-slate-100">
            Update Passcode Publik
          </h3>
          <button
            @click="store.closeModal()"
            class="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <form @submit.prevent="savePasscode" class="space-y-3">
          <div>
            <label
              class="block text-xs font-bold text-amber-600 dark:text-amber-400 mb-1"
              >Kode Akses Publik (PIN / Passcode)</label
            >
            <input
              type="text"
              v-model="formPasscode.code"
              required
              placeholder="Contoh: 0"
              class="w-full glass-input rounded-xl p-2.5 text-xs font-mono outline-none"
            />
          </div>
          <button
            type="submit"
            class="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-2.5 rounded-xl text-xs shadow-md mt-2 cursor-pointer"
          >
            Simpan Passcode
          </button>
        </form>
      </div>
    </div>

    <!-- 7. Modal Alert / Konfirmasi -->
    <div
      v-if="store.activeModal === 'alert'"
      class="fixed inset-0 bg-slate-950/70 z-[60] flex justify-center items-center p-4 backdrop-blur-md"
    >
      <div
        class="glass-card bg-white/95 dark:bg-slate-900/95 rounded-3xl w-full max-w-sm p-6 space-y-4 text-center shadow-2xl"
      >
        <div
          class="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-xl"
          :class="
            store.alertPayload.type === 'warning'
              ? 'bg-amber-500/10 text-amber-500'
              : store.alertPayload.type === 'success'
                ? 'bg-emerald-500/10 text-theme'
                : 'bg-[#25eba11a] from-[#149B73]'
          "
        >
          <i
            class="fa-solid"
            :class="
              store.alertPayload.type === 'warning'
                ? 'fa-triangle-exclamation'
                : store.alertPayload.type === 'success'
                  ? 'fa-circle-check'
                  : 'fa-circle-info'
            "
          ></i>
        </div>

        <div>
          <h3 class="font-bold text-slate-800 dark:text-slate-100 text-base">
            {{ store.alertPayload.title || "Pemberitahuan" }}
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {{ store.alertPayload.message }}
          </p>
        </div>

        <div class="flex gap-2 pt-2">
          <button
            v-if="store.alertPayload.onConfirm"
            @click="store.closeAlert()"
            class="flex-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-2.5 rounded-xl text-xs cursor-pointer hover:bg-slate-300"
          >
            Batal
          </button>

          <button
            @click="handleAlertConfirm"
            class="flex-1 bg-button text-white font-bold py-2.5 rounded-xl text-xs shadow-md cursor-pointer"
          >
            {{ store.alertPayload.onConfirm ? "Ya, Lanjutkan" : "OK" }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 8. MODAL KANBAN PROGRESS -->
  <div
    v-if="store.activeModal === 'progress'"
    class="fixed inset-0 bg-slate-950/70 z-50 flex justify-center items-center p-4 backdrop-blur-md"
  >
    <div
      class="glass-card bg-white/95 dark:bg-slate-900/95 rounded-3xl w-full max-w-lg p-6 space-y-4"
    >
      <div class="flex justify-between items-center">
        <h3 class="font-bold text-slate-800 dark:text-slate-100">
          Tambah Program / Progress
        </h3>
        <button
          @click="store.closeModal()"
          class="text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <form @submit.prevent="saveProgress" class="space-y-3 text-xs">
        <div>
          <label class="block text-xs mb-1 font-medium"
            >Judul Program / Campaign</label
          >
          <input
            type="text"
            v-model="formProgress.title"
            required
            placeholder="Nama Program Kerja"
            class="w-full glass-input rounded-xl p-2.5 outline-none"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs mb-1 font-medium">Unit Usaha</label>
            <select
              v-model="formProgress.unit"
              required
              class="w-full glass-input rounded-xl p-2.5 dark:bg-slate-800 outline-none"
            >
              <option v-for="u in masterUnits" :key="u.code" :value="u.code">
                {{ u.code }} - {{ u.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-xs mb-1 font-medium">Divisi</label>
            <select
              v-model="formProgress.division"
              required
              class="w-full glass-input rounded-xl p-2.5 dark:bg-slate-800 outline-none"
            >
              <option v-for="div in availableDivisions" :key="div" :value="div">
                {{ div }}
              </option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs mb-1 font-medium"
              >Deadline Target</label
            >
            <input
              type="date"
              v-model="formProgress.deadline"
              required
              class="w-full glass-input rounded-xl p-2.5 outline-none"
            />
          </div>
          <div>
            <label class="block text-xs mb-1 font-medium">Status Awal</label>
            <select
              v-model="formProgress.status"
              required
              class="w-full glass-input rounded-xl p-2.5 dark:bg-slate-800 outline-none"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="In Review">In Review</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-xs mb-1 font-medium"
            >Deskripsi Singkat</label
          >
          <textarea
            v-model="formProgress.description"
            rows="3"
            placeholder="Catatan tugas..."
            class="w-full glass-input rounded-xl p-2.5 outline-none"
          ></textarea>
        </div>

        <button
          type="submit"
          class="w-full bg-button hover:opacity-90 text-white font-bold py-2.5 rounded-xl shadow-md mt-2 cursor-pointer"
        >
          Simpan Program Progress
        </button>
      </form>
    </div>
  </div>

  <!-- 9. MODAL LAPORAN SPV -->
  <div
    v-if="store.activeModal === 'spv-report'"
    class="fixed inset-0 bg-slate-950/70 z-50 flex justify-center items-center p-4 backdrop-blur-md"
  >
    <div
      class="glass-card bg-white/95 dark:bg-slate-900/95 rounded-3xl w-full max-w-lg p-6 space-y-4"
    >
      <div class="flex justify-between items-center">
        <h3 class="font-bold text-slate-800 dark:text-slate-100">
          Input Laporan Pekanan SPV
        </h3>
        <button
          @click="store.closeModal()"
          class="text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <form @submit.prevent="saveSpvReport" class="space-y-3 text-xs">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs mb-1 font-medium"
              >Tanggal Laporan</label
            >
            <input
              type="date"
              v-model="formSpv.tanggal"
              required
              class="w-full glass-input rounded-xl p-2.5 outline-none"
            />
          </div>
          <div>
            <label class="block text-xs mb-1 font-medium">Divisi</label>
            <select
              v-model="formSpv.divisi"
              required
              class="w-full glass-input rounded-xl p-2.5 dark:bg-slate-800 outline-none"
            >
              <option v-for="div in availableDivisions" :key="div" :value="div">
                {{ div }}
              </option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-xs mb-1 font-medium"
            >Capaian & Rangkuman Pekan Ini</label
          >
          <textarea
            v-model="formSpv.capaian"
            rows="3"
            required
            placeholder="Tuliskan poin hasil kerja divisi..."
            class="w-full glass-input rounded-xl p-2.5 outline-none"
          ></textarea>
        </div>

        <div>
          <label class="block text-xs mb-1 font-medium"
            >Kendala & Problem Field</label
          >
          <textarea
            v-model="formSpv.kendala"
            rows="2"
            placeholder="Kendala yang dihadapi..."
            class="w-full glass-input rounded-xl p-2.5 outline-none"
          ></textarea>
        </div>

        <button
          type="submit"
          class="w-full bg-button hover:opacity-90 text-white font-bold py-2.5 rounded-xl shadow-md mt-2 cursor-pointer"
        >
          Simpan Laporan Divisi
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { store } from "../store";
import { api } from "../services/api";

function formatThousand(val) {
  if (val === null || val === undefined || val === "") return "";
  const cleanVal = String(val).replace(/\D/g, "");
  if (!cleanVal) return "";
  return new Intl.NumberFormat("id-ID").format(cleanVal);
}

const displayRevRevenue = ref("");
const displayPromoBiaya = ref("");
const displayTargetTahunIni = ref("");

function handleInputFormatted(
  event,
  targetFormObj,
  targetProp,
  displayRefName,
) {
  const inputVal = event.target.value;
  const cleanVal = inputVal.replace(/\D/g, "");
  const numVal = cleanVal ? Number(cleanVal) : 0;

  targetFormObj[targetProp] = numVal;

  const formatted = formatThousand(cleanVal);
  if (displayRefName === "displayRevRevenue")
    displayRevRevenue.value = formatted;
  else if (displayRefName === "displayPromoBiaya")
    displayPromoBiaya.value = formatted;
  else if (displayRefName === "displayTargetTahunIni")
    displayTargetTahunIni.value = formatted;
}

const formRev = reactive({
  Tanggal: new Date().toISOString().split("T")[0],
  Unit: "NHP",
  Revenue: 0,
  JumlahPesanan: 0,
  Divisi: "CS Deal",
  Platform: "Shopee",
});

const formLeads = reactive({
  Tanggal: new Date().toISOString().split("T")[0],
  Unit: "NHP",
  Campaign: 0,
  DatabaseLeads: 0,
  FollowUp: 0,
  Pesanan: 0,
});

const formPromo = reactive({
  Tanggal: new Date().toISOString().split("T")[0],
  Unit: "NHP",
  BiayaPromosi: 0,
});

const formTarget = reactive({
  TargetTahunIni: 0,
});

const formUser = reactive({
  name: "",
  email: "",
  password: "",
  role: "ADMIN_UNIT",
  unit: "NHP",
});

const formPasscode = reactive({
  code: "0",
});

const isEditRevenue = computed(() => {
  if (store.activeModal !== "revenue" || !store.selectedItemForEdit)
    return false;
  const p = store.selectedItemForEdit;
  return !!(p.id || p.Timestamp || p.Revenue !== undefined);
});

const isEditLeads = computed(() => {
  if (store.activeModal !== "leads" || !store.selectedItemForEdit) return false;
  const p = store.selectedItemForEdit;
  return !!(p.id || p.Timestamp || p.Campaign !== undefined);
});

const isEditPromo = computed(() => {
  if (store.activeModal !== "promo" || !store.selectedItemForEdit) return false;
  const p = store.selectedItemForEdit;
  return !!(p.id || p.Timestamp || p.BiayaPromosi !== undefined);
});

const isEditUser = computed(
  () => store.activeModal === "user" && !!store.selectedItemForEdit?.id,
);

const masterUnits = computed(() => {
  return (
    store.db?.master?.unitList || [
      { code: "NHP", name: "Nur Hidayah Press" },
      { code: "NHC", name: "Nur Hidayah Creative" },
      { code: "KG", name: "Karta Grafika" },
    ]
  );
});

const availableDivisions = computed(() => {
  return (
    store.db?.master?.divisiList || [
      "CS Deal",
      "Zona 1A",
      "Zona 1B",
      "Zona 2",
      "Zona 3",
      "Digital Marketing",
      "Offline",
    ]
  );
});

const availablePlatforms = computed(() => {
  return (
    store.db?.master?.platformList || [
      "Shopee",
      "TikTok Shop",
      "WhatsApp",
      "Website",
      "Siplah",
      "Toko Ladang",
      "Blibli",
      "Event",
      "Mitra",
      "Kunjungan",
      "Konsinyasi",
    ]
  );
});

watch(
  () => store.activeModal,
  (newVal) => {
    if (!newVal) return;

    const raw = store.selectedItemForEdit
      ? JSON.parse(JSON.stringify(store.selectedItemForEdit))
      : null;

    const defaultUnitCode = masterUnits.value[0]?.code || "NHP";

    if (newVal === "revenue") {
      if (raw && (raw.id || raw.Timestamp || raw.Revenue !== undefined)) {
        formRev.Tanggal = raw.Tanggal
          ? String(raw.Tanggal).substring(0, 10)
          : new Date().toISOString().split("T")[0];
        formRev.Unit = raw.Unit || defaultUnitCode;
        formRev.Revenue = Number(raw.Revenue ?? 0);
        formRev.JumlahPesanan = Number(raw.JumlahPesanan ?? raw.pesanan ?? 0);
        formRev.Divisi = raw.Divisi || availableDivisions.value[0] || "CS Deal";
        formRev.Platform =
          raw.Platform || availablePlatforms.value[0] || "Shopee";
      } else {
        formRev.Tanggal = new Date().toISOString().split("T")[0];
        formRev.Unit = raw?.Unit || defaultUnitCode;
        formRev.Revenue = 0;
        formRev.JumlahPesanan = 0;
        formRev.Divisi = availableDivisions.value[0] || "CS Deal";
        formRev.Platform = availablePlatforms.value[0] || "Shopee";
      }
      displayRevRevenue.value = formatThousand(formRev.Revenue);
    } else if (newVal === "leads") {
      if (raw && (raw.id || raw.Timestamp || raw.Campaign !== undefined)) {
        formLeads.Tanggal = raw.Tanggal
          ? String(raw.Tanggal).substring(0, 10)
          : new Date().toISOString().split("T")[0];
        formLeads.Unit = raw.Unit || defaultUnitCode;
        formLeads.Campaign = Number(raw.Campaign ?? 0);
        formLeads.DatabaseLeads = Number(raw.DatabaseLeads ?? 0);
        formLeads.FollowUp = Number(raw.FollowUp ?? 0);
        formLeads.Pesanan = Number(raw.Pesanan ?? 0);
      } else {
        formLeads.Tanggal = new Date().toISOString().split("T")[0];
        formLeads.Unit = raw?.Unit || defaultUnitCode;
        formLeads.Campaign = 0;
        formLeads.DatabaseLeads = 0;
        formLeads.FollowUp = 0;
        formLeads.Pesanan = 0;
      }
    } else if (newVal === "promo") {
      if (raw && (raw.id || raw.Timestamp || raw.BiayaPromosi !== undefined)) {
        formPromo.Tanggal = raw.Tanggal
          ? String(raw.Tanggal).substring(0, 10)
          : new Date().toISOString().split("T")[0];
        formPromo.Unit = raw.Unit || defaultUnitCode;
        formPromo.BiayaPromosi = Number(raw.BiayaPromosi ?? 0);
      } else {
        formPromo.Tanggal = new Date().toISOString().split("T")[0];
        formPromo.Unit = raw?.Unit || defaultUnitCode;
        formPromo.BiayaPromosi = 0;
      }
      displayPromoBiaya.value = formatThousand(formPromo.BiayaPromosi);
    } else if (newVal === "target") {
      if (store.db.master) {
        Object.assign(formTarget, JSON.parse(JSON.stringify(store.db.master)));
      }
      displayTargetTahunIni.value = formatThousand(formTarget.TargetTahunIni);
    } else if (newVal === "user") {
      if (raw && raw.id) {
        Object.assign(formUser, {
          name: raw.nama || raw.name || "",
          email: raw.email || "",
          password: "",
          role: raw.role || "ADMIN_UNIT",
          unit: Array.isArray(raw.aksesUnit)
            ? raw.aksesUnit[0]
            : raw.unit || defaultUnitCode,
        });
      } else {
        Object.assign(formUser, {
          name: "",
          email: "",
          password: "",
          role: "ADMIN_UNIT",
          unit: defaultUnitCode,
        });
      }
    } else if (newVal === "kodeakses") {
      formPasscode.code = String(store.db.master?.KodeAkses || "0");
    }
  },
  { immediate: true },
);

async function saveRevenue() {
  store.isLoading = true;
  try {
    const rawData = store.selectedItemForEdit || {};
    const docId = rawData.id || rawData.Timestamp;

    if (isEditRevenue.value && docId) {
      await api.updateData("revenues", docId, formRev);
      store.addNotification(
        "Revenue Diperbarui",
        `Revenue Unit ${formRev.Unit} diperbarui`,
        "warning",
      );
    } else {
      await api.saveData("revenues", formRev);
      store.addNotification(
        "Revenue Ditambahkan",
        `Revenue baru Unit ${formRev.Unit} disimpan`,
        "success",
      );
    }
    await store.loadFullDatabase();
    store.closeModal();
  } catch (err) {
    store.openAlert("Gagal Menyimpan", err.message, null, "warning");
  } finally {
    store.isLoading = false;
  }
}

async function saveLeads() {
  store.isLoading = true;
  try {
    const rawData = store.selectedItemForEdit || {};
    const docId = rawData.id || rawData.Timestamp;

    if (isEditLeads.value && docId) {
      await api.updateData("leads", docId, formLeads);
      store.addNotification(
        "Leads Diperbarui",
        `Data Leads ${formLeads.Unit} diperbarui`,
        "warning",
      );
    } else {
      await api.saveData("leads", formLeads);
      store.addNotification(
        "Leads Ditambahkan",
        `Data Leads ${formLeads.Unit} disimpan`,
        "success",
      );
    }
    await store.loadFullDatabase();
    store.closeModal();
  } catch (err) {
    store.openAlert("Gagal Menyimpan", err.message, null, "warning");
  } finally {
    store.isLoading = false;
  }
}

async function savePromo() {
  store.isLoading = true;
  try {
    const rawData = store.selectedItemForEdit || {};
    const docId = rawData.id || rawData.Timestamp;

    if (isEditPromo.value && docId) {
      await api.updateData("promosi", docId, formPromo);
      store.addNotification(
        "Promosi Diperbarui",
        `Promosi Unit ${formPromo.Unit} diperbarui`,
        "warning",
      );
    } else {
      await api.saveData("promosi", formPromo);
      store.addNotification(
        "Promosi Ditambahkan",
        `Promosi Unit ${formPromo.Unit} disimpan`,
        "success",
      );
    }
    await store.loadFullDatabase();
    store.closeModal();
  } catch (err) {
    store.openAlert("Gagal Menyimpan", err.message, null, "warning");
  } finally {
    store.isLoading = false;
  }
}

async function saveTargets() {
  store.isLoading = true;
  try {
    const res = await api.saveMasterTargetsOnly(formTarget);
    if (res.success) {
      store.addNotification(
        "Target Diperbarui",
        "Master target tahunan disesuaikan",
        "warning",
      );
      await store.loadFullDatabase();
      store.closeModal();
    }
  } catch (err) {
    store.openAlert("Gagal Menyimpan", err.message, null, "warning");
  } finally {
    store.isLoading = false;
  }
}

async function saveUser() {
  store.isLoading = true;
  try {
    const payload = {
      nama: formUser.name,
      email: formUser.email,
      password: formUser.password,
      role: formUser.role,
      aksesUnit:
        formUser.role === "SUPERADMIN"
          ? masterUnits.value.map((u) => u.code)
          : [formUser.unit],
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(formUser.name)}`,
    };

    if (isEditUser.value) {
      await api.updateData("Users", store.selectedItemForEdit.id, payload);
      store.addNotification(
        "Pengguna Diubah",
        `Akun ${formUser.name} diperbarui`,
        "warning",
      );
    } else {
      await api.saveData("Users", payload);
      store.addNotification(
        "Pengguna Ditambah",
        `Akun ${formUser.name} telah dibuat`,
        "success",
      );
    }
    await store.loadFullDatabase();
    store.closeModal();
  } catch (err) {
    store.openAlert("Gagal Menyimpan", err.message, null, "warning");
  } finally {
    store.isLoading = false;
  }
}

async function savePasscode() {
  store.isLoading = true;
  try {
    const res = await api.saveMasterData({ KodeAkses: formPasscode.code });
    if (res.success) {
      store.db.master.KodeAkses = formPasscode.code;
      store.addNotification(
        "Passcode Diperbarui",
        "Passcode publik berhasil diubah",
        "warning",
      );
      store.closeModal();
    }
  } catch (err) {
    store.openAlert("Gagal Menyimpan", err.message, null, "warning");
  } finally {
    store.isLoading = false;
  }
}

function handleAlertConfirm() {
  if (
    store.alertPayload.onConfirm &&
    typeof store.alertPayload.onConfirm === "function"
  ) {
    store.alertPayload.onConfirm();
  }
  store.closeAlert();
}

const formProgress = reactive({
  title: "",
  unit: "NHP",
  division: "Digital Marketing",
  deadline: new Date().toISOString().split("T")[0],
  status: "To Do",
  description: "",
  progress: 0,
});

const formSpv = reactive({
  tanggal: new Date().toISOString().split("T")[0],
  divisi: "CS Deal",
  capaian: "",
  kendala: "",
});

const saveProgress = async () => {
  store.isLoading = true;
  try {
    const payload = {
      id: Date.now(),
      ...formProgress,
      createdBy: store.currentUser?.id || store.currentUser?.email,
    };
    if (api && api.saveProgramData) {
      await api.saveProgramData(payload);
    }
    if (!store.db.programs) store.db.programs = [];
    store.db.programs.unshift(payload);
    store.addNotification(
      "Berhasil",
      "Program kerja berhasil ditambahkan",
      "success",
    );
    store.closeModal();
  } catch (err) {
    store.addNotification("Gagal", err.message, "warning");
  } finally {
    store.isLoading = false;
  }
};

const saveSpvReport = async () => {
  store.isLoading = true;
  try {
    const payload = {
      id: Date.now(),
      ...formSpv,
      pembuat: store.currentUser?.nama || store.currentUser?.email,
    };
    if (api && api.saveSpvReportData) {
      await api.saveSpvReportData(payload);
    }
    if (!store.db.spvReports) store.db.spvReports = [];
    store.db.spvReports.unshift(payload);
    store.addNotification(
      "Berhasil",
      "Laporan Divisi berhasil disimpan",
      "success",
    );
    store.closeModal();
  } catch (err) {
    store.addNotification("Gagal", err.message, "warning");
  } finally {
    store.isLoading = false;
  }
};
</script>
