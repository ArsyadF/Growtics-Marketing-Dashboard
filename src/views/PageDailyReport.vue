<!-- src/views/PageDailyReport.vue -->
<template>
  <div class="space-y-3 pb-20 md:pb-6">
    <!-- HEADER BAR & NAVIGASI TAB -->
    <div
      class="glass-card bg-white/90 dark:bg-slate-900/90 p-3 md:p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3"
    >
      <div>
        <h2
          class="text-base md:text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2"
        >
          <i class="fa-solid fa-file-invoice text-emerald-600"></i>
          <span>Laporan Harian (Daily Report)</span>
        </h2>
        <p class="text-xs md:text-xs text-slate-400 mt-0.5">
          Sistem pelaporan kinerja dinamis terintegrasi Master Data.
        </p>
      </div>

      <div
        v-if="canManageFormAndRekap"
        class="flex items-center bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl shrink-0 text-sm md:text-xs overflow-hidden border border-slate-200 dark:border-slate-700"
      >
        <button
          @click="activeTab = 'input'"
          class="px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer"
          :class="
            activeTab === 'input'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          "
        >
          <i class="fa-solid fa-pen-to-square mr-1"></i> Input Laporan
        </button>
        <button
          @click="activeTab = 'rekap'"
          class="px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer"
          :class="
            activeTab === 'rekap'
              ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          "
        >
          <i class="fa-solid fa-table-list mr-1"></i> Rekap Data
        </button>
        <button
          v-if="isSuperadmin"
          @click="activeTab = 'builder'"
          class="px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer"
          :class="
            activeTab === 'builder'
              ? 'bg-white dark:bg-slate-900 text-rose-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          "
        >
          <i class="fa-solid fa-sliders mr-1"></i> Builder
        </button>
      </div>
    </div>

    <!-- LOADING STATE -->
    <div
      v-if="isLoadingData"
      class="flex flex-col items-center justify-center py-10 gap-2"
    >
      <i class="fa-solid fa-circle-notch fa-spin text-3xl text-emerald-500"></i>
      <p class="text-sm md:text-xs font-semibold text-slate-500">
        Menyinkronkan data...
      </p>
    </div>

    <template v-else>
      <!-- TAB 1: FORM INPUT LAPORAN -->
      <div v-if="activeTab === 'input'" class="max-w-4xl mx-auto">
        <div
          class="glass-card bg-white/90 dark:bg-slate-900/90 p-4 md:p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
        >
          <form @submit.prevent="submitDailyReport" class="space-y-4">
            <div
              class="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-700"
            >
              <div>
                <label
                  class="block text-xs md:text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1"
                  >Jenis Laporan Pekerjaan</label
                >
                <select
                  v-model="selectedTemplateId"
                  @change="onTemplateChange"
                  required
                  class="w-full glass-input rounded-lg p-2.5 md:p-2 outline-none font-semibold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 text-sm md:text-xs"
                >
                  <option value="" disabled>-- Pilih Laporan --</option>
                  <option
                    v-for="tpl in reportTemplates"
                    :key="tpl.id"
                    :value="tpl.id"
                  >
                    {{ tpl.title }}
                  </option>
                </select>
              </div>
              <div>
                <label
                  class="block text-xs md:text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1"
                  >Tanggal Laporan</label
                >
                <input
                  v-model="formHeader.tanggal"
                  type="date"
                  required
                  class="w-full glass-input rounded-lg p-2.5 md:p-2 outline-none text-slate-800 dark:text-slate-100 text-sm md:text-xs font-semibold"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label
                  class="block text-xs md:text-xs font-semibold text-slate-500 mb-1"
                  >Nama Staf</label
                >
                <input
                  v-model="formHeader.nama"
                  type="text"
                  readonly
                  class="w-full glass-input rounded-lg p-2.5 md:p-2 bg-slate-100/50 dark:bg-slate-800/30 text-slate-500 outline-none text-sm md:text-xs font-semibold"
                />
              </div>
              <div>
                <label
                  class="block text-xs md:text-xs font-semibold text-slate-500 mb-1"
                  >Unit Usaha</label
                >
                <input
                  v-model="formHeader.unit"
                  type="text"
                  readonly
                  class="w-full glass-input rounded-lg p-2.5 md:p-2 bg-slate-100/50 dark:bg-slate-800/30 text-slate-500 outline-none text-sm md:text-xs font-semibold"
                />
              </div>
              <div>
                <label
                  class="block text-xs md:text-xs font-semibold text-slate-500 mb-1"
                  >Divisi</label
                >
                <input
                  v-model="formHeader.divisi"
                  type="text"
                  readonly
                  class="w-full glass-input rounded-lg p-2.5 md:p-2 bg-slate-100/50 dark:bg-slate-800/30 text-slate-500 outline-none text-sm md:text-xs font-semibold"
                />
              </div>
            </div>

            <div
              v-if="activeTemplate"
              class="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3"
            >
              <h4
                class="font-semibold text-slate-700 dark:text-slate-200 text-base md:text-sm flex items-center gap-2 mb-2"
              >
                <i class="fa-solid fa-list-check text-blue-500"></i> Rincian
                Indikator Laporan
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                  v-for="field in activeTemplate.fields"
                  :key="field.id"
                  :class="{
                    'md:col-span-2':
                      field.type === 'textarea' || field.type === 'checkbox',
                  }"
                >
                  <label
                    class="block font-semibold text-slate-700 dark:text-slate-200 text-xs md:text-xs mb-1"
                  >
                    {{ field.label }}
                    <span v-if="field.required" class="text-rose-500">*</span>
                  </label>

                  <input
                    v-if="field.type === 'number'"
                    v-model.number="formResponses[field.id]"
                    type="number"
                    min="0"
                    :required="field.required"
                    class="w-full glass-input rounded-lg p-2.5 md:p-2 outline-none text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800/40 focus:bg-white text-sm md:text-xs"
                  />

                  <input
                    v-else-if="field.type === 'text'"
                    v-model="formResponses[field.id]"
                    type="text"
                    :required="field.required"
                    class="w-full glass-input rounded-lg p-2.5 md:p-2 outline-none text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800/40 focus:bg-white text-sm md:text-xs"
                  />

                  <textarea
                    v-else-if="field.type === 'textarea'"
                    v-model="formResponses[field.id]"
                    rows="3"
                    :required="field.required"
                    class="w-full glass-input rounded-lg p-2.5 md:p-2 outline-none text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800/40 focus:bg-white text-sm md:text-xs resize-y"
                  ></textarea>

                  <select
                    v-else-if="field.type === 'select'"
                    v-model="formResponses[field.id]"
                    :required="field.required"
                    class="w-full glass-input rounded-lg p-2.5 md:p-2 outline-none text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800/40 focus:bg-white text-sm md:text-xs"
                  >
                    <option value="" disabled>-- Pilih --</option>
                    <option
                      v-for="opt in field.options"
                      :key="opt"
                      :value="opt"
                    >
                      {{ opt }}
                    </option>
                  </select>

                  <div
                    v-else-if="field.type === 'checkbox'"
                    class="flex flex-wrap gap-3 mt-1.5 p-2.5 md:p-2 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-700/50"
                  >
                    <label
                      v-for="opt in field.options"
                      :key="opt"
                      class="flex items-center gap-1.5 text-sm md:text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:text-theme transition-colors"
                    >
                      <input
                        type="checkbox"
                        :value="opt"
                        v-model="formResponses[field.id]"
                        class="accent-emerald-600 w-4 h-4 md:w-3.5 md:h-3.5 rounded cursor-pointer"
                      />
                      {{ opt }}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <button
              v-if="store.canEditPage('daily-report')"
              type="submit"
              :disabled="isSubmitting || !activeTemplate"
              class="w-full py-3 md:py-2.5 rounded-xl font-semibold text-sm md:text-xs bg-button text-white shadow-md disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              <i v-if="isSubmitting" class="fa-solid fa-spinner fa-spin"></i>
              <span>{{
                isSubmitting ? "Menyimpan..." : "Kirim Laporan Pekerjaan"
              }}</span>
            </button>
          </form>
        </div>
      </div>

      <!-- TAB 2: REKAP DATA -->
      <div
        v-if="activeTab === 'rekap' && canManageFormAndRekap"
        class="space-y-3"
      >
        <div
          class="glass-card bg-white/90 dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row gap-3 justify-between items-center"
        >
          <div class="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
            <div class="col-span-2 md:col-span-1">
              <label
                class="block text-xs md:text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider"
                >Jenis Laporan</label
              >
              <select
                v-model="filter.templateId"
                class="w-full glass-input rounded-lg p-2.5 md:p-2 outline-none font-semibold text-sm md:text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/50"
              >
                <option value="ALL">Semua Laporan</option>
                <option
                  v-for="tpl in reportTemplates"
                  :key="tpl.id"
                  :value="tpl.id"
                >
                  {{ tpl.title }}
                </option>
              </select>
            </div>
            <div>
              <label
                class="block text-xs md:text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider"
                >Dari Tanggal</label
              >
              <input
                v-model="filter.startDate"
                type="date"
                class="w-full glass-input rounded-lg p-2.5 md:p-2 outline-none text-sm md:text-xs font-semibold bg-slate-50 dark:bg-slate-800/50"
              />
            </div>
            <div>
              <label
                class="block text-xs md:text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider"
                >Sampai Tanggal</label
              >
              <input
                v-model="filter.endDate"
                type="date"
                class="w-full glass-input rounded-lg p-2.5 md:p-2 outline-none text-sm md:text-xs font-semibold bg-slate-50 dark:bg-slate-800/50"
              />
            </div>
            <div>
              <label
                class="block text-xs md:text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider"
                >Filter Detail</label
              >
              <input
                v-model="filter.search"
                type="text"
                placeholder="Cari..."
                class="w-full glass-input rounded-lg p-2.5 md:p-2 outline-none text-sm md:text-xs bg-slate-50 dark:bg-slate-800/50"
              />
            </div>
          </div>

          <div
            class="flex gap-2 w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 pt-3 lg:pt-0 lg:pl-3"
          >
            <button
              @click="exportToExcel"
              class="flex-1 lg:flex-none bg-emerald-500/10 text-emerald-600 px-3.5 py-2.5 md:px-3 md:py-2 rounded-lg font-semibold hover:bg-emerald-500/20 transition-all text-sm md:text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <i class="fa-solid fa-file-excel"></i> Export Excel
            </button>
            <label
              class="flex-1 lg:flex-none bg-blue-500/10 text-blue-600 px-3.5 py-2.5 md:px-3 md:py-2 rounded-lg font-semibold hover:bg-blue-500/20 transition-all text-sm md:text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <i class="fa-solid fa-file-import"></i> Import Excel
              <input
                type="file"
                accept=".xlsx, .xls"
                class="hidden"
                @change="importExcel"
              />
            </label>
          </div>
        </div>

        <!-- BULK ACTION TOOLBAR (Muncul jika ada baris terpilih) -->
        <div
          v-if="selectedItems.length > 0 && isSuperadmin"
          class="bg-blue-50/80 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 p-2.5 rounded-xl flex justify-between items-center shadow-sm animate-fade-in"
        >
          <div class="flex items-center gap-2">
            <div
              class="bg-blue-500 text-white w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold"
            >
              {{ selectedItems.length }}
            </div>
            <span
              class="text-sm md:text-xs font-semibold text-blue-700 dark:text-blue-300"
              >Data Terpilih</span
            >
          </div>
          <div class="flex gap-2">
            <button
              @click="openBulkEditModal"
              class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-lg text-sm md:text-xs font-semibold hover:bg-slate-50 cursor-pointer shadow-sm transition-all flex items-center gap-1.5"
            >
              <i class="fa-solid fa-pen-to-square"></i> Edit Masal
            </button>
            <button
              @click="executeBulkDelete"
              class="bg-rose-500 text-white px-3 py-1.5 rounded-lg text-sm md:text-xs font-semibold hover:bg-rose-600 cursor-pointer shadow-sm transition-all flex items-center gap-1.5"
            >
              <i class="fa-solid fa-trash-can"></i> Hapus Masal
            </button>
          </div>
        </div>

        <div
          class="glass-card bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col"
          style="max-height: 70vh"
        >
          <div class="overflow-auto flex-1 custom-scrollbar">
            <table
              class="w-full text-left text-sm md:text-xs border-collapse whitespace-nowrap"
            >
              <thead
                class="sticky top-0 bg-slate-50/95 dark:bg-slate-800/95 backdrop-blur-sm z-10 shadow-sm"
              >
                <tr
                  class="text-slate-500 font-semibold uppercase text-xs md:text-xs tracking-wider"
                >
                  <th
                    v-if="isSuperadmin"
                    class="p-3 border-b border-slate-200 dark:border-slate-700 w-10 text-center"
                  >
                    <input
                      type="checkbox"
                      v-model="isAllSelected"
                      class="accent-theme w-4 h-4 md:w-3.5 md:h-3.5 cursor-pointer rounded"
                    />
                  </th>
                  <th
                    @click="setSort('tanggal')"
                    class="p-3 cursor-pointer hover:text-theme border-b border-slate-200 dark:border-slate-700"
                  >
                    Tanggal
                    <i
                      class="fa-solid ml-1"
                      :class="getSortIcon('tanggal')"
                    ></i>
                  </th>
                  <th
                    @click="setSort('nama')"
                    class="p-3 cursor-pointer hover:text-theme border-b border-slate-200 dark:border-slate-700"
                  >
                    Karyawan
                    <i class="fa-solid ml-1" :class="getSortIcon('nama')"></i>
                  </th>
                  <!-- Dynamic Headers -->
                  <template
                    v-if="filter.templateId !== 'ALL' && activeRekapTemplate"
                  >
                    <th
                      v-for="field in activeRekapTemplate.fields"
                      :key="field.id"
                      class="p-3 border-b border-slate-200 dark:border-slate-700"
                    >
                      {{ field.label }}
                    </th>
                  </template>
                  <template v-else>
                    <th
                      class="p-3 border-b border-slate-200 dark:border-slate-700"
                    >
                      Jenis Laporan
                    </th>
                    <th
                      class="p-3 border-b border-slate-200 dark:border-slate-700 w-1/2"
                    >
                      Cuplikan Isian
                    </th>
                  </template>
                  <th
                    v-if="isSuperadmin"
                    class="p-3 border-b border-slate-200 dark:border-slate-700 text-right"
                  >
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody
                class="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-200"
              >
                <tr
                  v-for="item in sortedReports"
                  :key="item.id"
                  class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  :class="{
                    'bg-blue-50/30 dark:bg-blue-900/10': selectedItems.includes(
                      item.id,
                    ),
                  }"
                >
                  <td v-if="isSuperadmin" class="p-3 text-center">
                    <input
                      type="checkbox"
                      v-model="selectedItems"
                      :value="item.id"
                      class="accent-theme w-4 h-4 md:w-3.5 md:h-3.5 cursor-pointer rounded"
                    />
                  </td>
                  <td class="p-3 font-semibold">
                    {{ formatTanggal(item.tanggal) }}
                  </td>
                  <td class="p-3">
                    <div class="font-semibold text-slate-900 dark:text-white">
                      {{ item.nama }}
                    </div>
                    <div
                      class="text-xs md:text-xs text-slate-500 mt-0.5 flex gap-1 items-center"
                    >
                      <span
                        class="px-1 py-0.5 rounded bg-blue-500/10 text-blue-600 font-semibold"
                        >{{ item.unit || "UMUM" }}</span
                      >
                      <span>{{ item.divisi || "-" }}</span>
                    </div>
                  </td>
                  <template
                    v-if="filter.templateId !== 'ALL' && activeRekapTemplate"
                  >
                    <td
                      v-for="field in activeRekapTemplate.fields"
                      :key="field.id"
                      class="p-3"
                    >
                      <div
                        class="max-w-[200px] truncate text-slate-600 dark:text-slate-300"
                        :title="
                          Array.isArray(item.responses?.[field.id])
                            ? item.responses[field.id].join(', ')
                            : item.responses?.[field.id]
                        "
                      >
                        {{
                          Array.isArray(item.responses?.[field.id])
                            ? item.responses[field.id].join(", ")
                            : item.responses?.[field.id] || "-"
                        }}
                      </div>
                    </td>
                  </template>
                  <template v-else>
                    <td class="p-3">
                      <span
                        class="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 font-semibold text-xs md:text-xs"
                        >{{ item.jenisLaporan }}</span
                      >
                    </td>
                    <td class="p-3">
                      <div
                        class="max-w-md truncate text-slate-500 text-xs md:text-xs italic"
                        :title="getSummary(item.responses)"
                      >
                        {{ getSummary(item.responses) }}
                      </div>
                    </td>
                  </template>
                  <td v-if="isSuperadmin" class="p-3 text-right">
                    <button
                      @click="deleteReport(item.id)"
                      type="button"
                      class="text-rose-500 hover:text-rose-700 p-1.5 rounded-md hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Hapus Data"
                    >
                      <i class="fa-solid fa-trash-can text-sm md:text-xs"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="sortedReports.length === 0">
                  <td
                    :colspan="
                      isSuperadmin
                        ? filter.templateId !== 'ALL' && activeRekapTemplate
                          ? activeRekapTemplate.fields.length + 4
                          : 6
                        : 5
                    "
                    class="text-center py-10 text-slate-400 text-sm md:text-xs"
                  >
                    Tidak ada data laporan yang sesuai filter.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB 3: FORM BUILDER -->
      <div
        v-if="activeTab === 'builder' && isSuperadmin"
        class="space-y-3 max-w-5xl mx-auto"
      >
        <div
          class="glass-card bg-white/90 dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
        >
          <div
            class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3"
          >
            <div>
              <h3
                class="font-semibold text-slate-800 dark:text-slate-100 text-base md:text-sm flex items-center gap-2"
              >
                <i class="fa-solid fa-list-ul text-blue-500"></i> Daftar
                Template Laporan
              </h3>
            </div>
            <button
              @click="openBuilderModal(null)"
              type="button"
              class="bg-button text-white px-3.5 py-2 md:px-3 md:py-1.5 rounded-lg font-semibold text-sm md:text-xs flex items-center gap-1.5 shadow-sm cursor-pointer hover:shadow-md transition-all"
            >
              <i class="fa-solid fa-plus"></i>
              <span class="hidden sm:inline">Buat Baru</span>
            </button>
          </div>

          <div class="space-y-2">
            <div
              v-for="tpl in reportTemplates"
              :key="tpl.id"
              class="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-400/50 transition-colors group"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0"
                >
                  <i class="fa-solid fa-file-lines text-xs"></i>
                </div>
                <div>
                  <h4
                    class="font-semibold text-sm md:text-xs text-slate-800 dark:text-slate-100"
                  >
                    {{ tpl.title }}
                  </h4>
                  <p class="text-xs md:text-xs text-slate-500 font-normal">
                    {{ tpl.fields?.length || 0 }} Indikator Pertanyaan
                  </p>
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  @click="openBuilderModal(tpl)"
                  class="flex-1 sm:flex-none bg-blue-500/10 text-blue-600 px-3.5 py-2 md:px-3 md:py-1.5 rounded-lg text-sm md:text-xs font-semibold hover:bg-blue-500/20 cursor-pointer transition-all"
                >
                  Edit Struktur
                </button>
                <button
                  @click="deleteTemplate(tpl.id)"
                  class="bg-rose-500/10 text-rose-500 px-3 py-2 md:px-2.5 md:py-1.5 rounded-lg text-sm md:text-xs hover:bg-rose-500/20 cursor-pointer transition-all"
                >
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- MODAL BUILDER EKSKLUSIF -->
    <Teleport to="body">
      <div
        v-if="isBuilderModalOpen"
        class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[999] flex items-center justify-center p-3"
      >
        <div
          class="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
        >
          <div
            class="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/40"
          >
            <div>
              <h3
                class="font-semibold text-base md:text-sm text-slate-800 dark:text-slate-100"
              >
                {{
                  builderTemplate.id
                    ? "Edit Template Form"
                    : "Buat Template Form Baru"
                }}
              </h3>
            </div>
            <button
              @click="isBuilderModalOpen = false"
              class="text-slate-400 hover:text-rose-500 cursor-pointer text-lg w-7 h-7 flex items-center justify-center rounded-full hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="p-4 overflow-y-auto flex-1 space-y-4 custom-scrollbar">
            <div class="bg-blue-500/5 p-3 rounded-xl border border-blue-500/10">
              <label
                class="block text-xs md:text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >Nama / Judul Template:</label
              >
              <input
                v-model="builderTemplate.title"
                type="text"
                class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm md:text-xs outline-none font-semibold focus:border-blue-500 transition-colors"
                placeholder="Contoh: Laporan Harian Tim CS"
              />
            </div>

            <div>
              <div
                class="flex justify-between items-end mb-2 border-b border-slate-100 dark:border-slate-800 pb-2"
              >
                <h4
                  class="text-sm md:text-xs font-semibold text-slate-700 dark:text-slate-200"
                >
                  <i
                    class="fa-solid fa-layer-group text-emerald-500 mr-1.5"
                  ></i>
                  Susunan Pertanyaan
                </h4>
                <button
                  @click="addBuilderField"
                  type="button"
                  class="text-xs md:text-xs font-semibold bg-emerald-500/10 text-emerald-600 px-2.5 py-1.5 rounded-md cursor-pointer hover:bg-emerald-500/20"
                >
                  <i class="fa-solid fa-plus mr-1"></i> Tambah Field
                </button>
              </div>

              <div class="space-y-2">
                <div
                  v-for="(field, idx) in builderTemplate.fields"
                  :key="idx"
                  class="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col gap-2 relative group"
                >
                  <div class="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
                    <div class="sm:col-span-5">
                      <label
                        class="block text-xs md:text-xs font-semibold text-slate-500 mb-1"
                        >Label Pertanyaan</label
                      >
                      <input
                        v-model="field.label"
                        placeholder="Misal: Jumlah Penawaran"
                        class="w-full glass-input rounded-lg p-2 text-sm md:text-xs font-semibold outline-none focus:border-blue-400"
                      />
                    </div>
                    <div class="sm:col-span-3">
                      <label
                        class="block text-xs md:text-xs font-semibold text-slate-500 mb-1"
                        >Tipe Jawaban</label
                      >
                      <select
                        v-model="field.type"
                        class="w-full glass-input rounded-lg p-2 text-sm md:text-xs font-semibold outline-none bg-white dark:bg-slate-900"
                      >
                        <option value="number">Angka (Number)</option>
                        <option value="text">Teks Singkat</option>
                        <option value="textarea">Teks Paragraf</option>
                        <option value="select">Pilihan Dropdown</option>
                        <option value="checkbox">
                          Pilihan Ganda (Checkbox)
                        </option>
                      </select>
                    </div>
                    <div
                      class="sm:col-span-4 flex items-center justify-between pb-0.5"
                    >
                      <label
                        class="flex items-center gap-1.5 text-xs md:text-xs font-semibold cursor-pointer text-slate-600 dark:text-slate-300"
                      >
                        <input
                          type="checkbox"
                          v-model="field.required"
                          class="accent-theme w-4 h-4 md:w-3.5 md:h-3.5 rounded"
                        />
                        Wajib
                      </label>
                      <!-- TOMBOL PINDAH URUTAN & HAPUS -->
                      <div class="flex gap-1">
                        <button
                          @click="moveField(idx, -1)"
                          :disabled="idx === 0"
                          type="button"
                          class="text-slate-400 hover:text-blue-500 disabled:opacity-30 p-1.5 rounded bg-slate-200/50 dark:bg-slate-800 cursor-pointer transition-colors"
                          title="Naik"
                        >
                          <i
                            class="fa-solid fa-arrow-up text-xs md:text-xs"
                          ></i>
                        </button>
                        <button
                          @click="moveField(idx, 1)"
                          :disabled="idx === builderTemplate.fields.length - 1"
                          type="button"
                          class="text-slate-400 hover:text-blue-500 disabled:opacity-30 p-1.5 rounded bg-slate-200/50 dark:bg-slate-800 cursor-pointer transition-colors"
                          title="Turun"
                        >
                          <i
                            class="fa-solid fa-arrow-down text-xs md:text-xs"
                          ></i>
                        </button>
                        <button
                          @click="builderTemplate.fields.splice(idx, 1)"
                          type="button"
                          class="text-rose-500 hover:text-rose-700 p-1.5 rounded bg-rose-500/10 cursor-pointer ml-1"
                          title="Hapus"
                        >
                          <i
                            class="fa-solid fa-trash-can text-xs md:text-xs"
                          ></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div
                    v-if="field.type === 'select' || field.type === 'checkbox'"
                    class="bg-slate-100 dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700 mt-1"
                  >
                    <label
                      class="block text-xs md:text-xs font-semibold text-blue-500 mb-1"
                      ><i class="fa-solid fa-list-ul mr-1"></i> Opsi Pilihan
                      (Pisahkan dengan Koma)</label
                    >
                    <input
                      :value="field.options ? field.options.join(', ') : ''"
                      @input="
                        (e) =>
                          (field.options = e.target.value
                            .split(',')
                            .map((s) => s.trim()))
                      "
                      placeholder="A, B, C"
                      class="w-full bg-transparent border-b border-slate-300 dark:border-slate-600 py-1 text-xs md:text-xs outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div
                  v-if="builderTemplate.fields.length === 0"
                  class="text-center py-4 text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-sm md:text-xs"
                >
                  Belum ada pertanyaan/field ditambahkan.
                </div>
              </div>
            </div>
          </div>

          <div
            class="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex justify-end gap-2"
          >
            <button
              @click="isBuilderModalOpen = false"
              class="px-4 py-2.5 md:py-2 rounded-lg text-sm md:text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer transition-colors"
            >
              Batal
            </button>
            <button
              @click="saveBuilderTemplate"
              class="px-5 py-2.5 md:py-2 rounded-lg text-sm md:text-xs font-semibold bg-button text-white shadow-sm cursor-pointer flex items-center gap-1.5 hover:shadow-md transition-all"
            >
              <i class="fa-solid fa-floppy-disk"></i> Simpan
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- MODAL BULK EDIT MASAL -->
    <Teleport to="body">
      <div
        v-if="isBulkEditModalOpen"
        class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[999] flex items-center justify-center p-3 animate-fade-in"
      >
        <div
          class="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
        >
          <div
            class="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/40"
          >
            <div>
              <h3
                class="font-semibold text-base md:text-sm text-slate-800 dark:text-slate-100"
              >
                Edit Masal {{ selectedItems.length }} Data
              </h3>
              <p class="text-xs md:text-xs text-slate-500">
                Centang field yang ingin diubah/ditimpa secara massal.
              </p>
            </div>
            <button
              @click="isBulkEditModalOpen = false"
              class="text-slate-400 hover:text-rose-500 cursor-pointer text-lg"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div
            class="p-5 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar"
          >
            <!-- Common Metadata -->
            <div class="space-y-3">
              <h4
                class="text-sm md:text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2 border-b border-slate-100 dark:border-slate-800 pb-1"
              >
                Identitas Laporan Umum
              </h4>

              <div class="flex items-center gap-3">
                <input
                  type="checkbox"
                  v-model="bulkEditToggles.tanggal"
                  class="accent-theme w-4 h-4 rounded cursor-pointer"
                />
                <div class="flex-1">
                  <label
                    class="block text-xs md:text-xs font-semibold text-slate-500 mb-1"
                    :class="{ 'opacity-50': !bulkEditToggles.tanggal }"
                    >Timpa Tanggal Baru</label
                  >
                  <input
                    v-model="bulkEditForm.tanggal"
                    type="date"
                    :disabled="!bulkEditToggles.tanggal"
                    class="w-full glass-input rounded-lg p-2.5 md:p-2 text-sm md:text-xs font-semibold outline-none disabled:opacity-50"
                  />
                </div>
              </div>
              <div class="flex items-center gap-3">
                <input
                  type="checkbox"
                  v-model="bulkEditToggles.unit"
                  class="accent-theme w-4 h-4 rounded cursor-pointer"
                />
                <div class="flex-1">
                  <label
                    class="block text-xs md:text-xs font-semibold text-slate-500 mb-1"
                    :class="{ 'opacity-50': !bulkEditToggles.unit }"
                    >Timpa Unit Usaha Baru</label
                  >
                  <select
                    v-model="bulkEditForm.unit"
                    :disabled="!bulkEditToggles.unit"
                    class="w-full glass-input rounded-lg p-2.5 md:p-2 text-sm md:text-xs font-semibold outline-none bg-white dark:bg-slate-900 disabled:opacity-50"
                  >
                    <option value="">-- Kosongkan --</option>
                    <option
                      v-for="u in masterUnits"
                      :key="u.code"
                      :value="u.code"
                    >
                      {{ u.code }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <input
                  type="checkbox"
                  v-model="bulkEditToggles.divisi"
                  class="accent-theme w-4 h-4 rounded cursor-pointer"
                />
                <div class="flex-1">
                  <label
                    class="block text-xs md:text-xs font-semibold text-slate-500 mb-1"
                    :class="{ 'opacity-50': !bulkEditToggles.divisi }"
                    >Timpa Divisi Baru</label
                  >
                  <input
                    v-model="bulkEditForm.divisi"
                    type="text"
                    :disabled="!bulkEditToggles.divisi"
                    class="w-full glass-input rounded-lg p-2.5 md:p-2 text-sm md:text-xs font-semibold outline-none disabled:opacity-50"
                    placeholder="Ketik nama divisi baru..."
                  />
                </div>
              </div>
            </div>

            <!-- Dynamic Fields (Jika filter diset ke spesifik laporan) -->
            <div
              v-if="filter.templateId !== 'ALL' && activeRekapTemplate"
              class="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800"
            >
              <h4
                class="text-sm md:text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2 border-b border-slate-100 dark:border-slate-800 pb-1"
              >
                Timpa Nilai Indikator ({{ activeRekapTemplate.title }})
              </h4>

              <div
                v-for="field in activeRekapTemplate.fields"
                :key="field.id"
                class="flex items-start gap-3 mt-2"
              >
                <input
                  type="checkbox"
                  v-model="bulkEditToggles.responses[field.id]"
                  class="accent-blue-600 w-4 h-4 rounded cursor-pointer mt-1"
                />
                <div class="flex-1">
                  <label
                    class="block text-xs md:text-xs font-semibold text-slate-500 mb-1"
                    :class="{
                      'opacity-50': !bulkEditToggles.responses[field.id],
                    }"
                    >Ubah: {{ field.label }}</label
                  >
                  <input
                    v-if="field.type === 'number'"
                    v-model.number="bulkEditForm.responses[field.id]"
                    type="number"
                    :disabled="!bulkEditToggles.responses[field.id]"
                    class="w-full glass-input rounded-lg p-2.5 md:p-2 text-sm md:text-xs font-semibold outline-none disabled:opacity-50"
                  />
                  <input
                    v-else-if="field.type === 'text'"
                    v-model="bulkEditForm.responses[field.id]"
                    type="text"
                    :disabled="!bulkEditToggles.responses[field.id]"
                    class="w-full glass-input rounded-lg p-2.5 md:p-2 text-sm md:text-xs font-semibold outline-none disabled:opacity-50"
                  />
                  <textarea
                    v-else-if="field.type === 'textarea'"
                    v-model="bulkEditForm.responses[field.id]"
                    rows="2"
                    :disabled="!bulkEditToggles.responses[field.id]"
                    class="w-full glass-input rounded-lg p-2.5 md:p-2 text-sm md:text-xs font-semibold outline-none disabled:opacity-50"
                  ></textarea>
                  <select
                    v-else-if="field.type === 'select'"
                    v-model="bulkEditForm.responses[field.id]"
                    :disabled="!bulkEditToggles.responses[field.id]"
                    class="w-full glass-input rounded-lg p-2.5 md:p-2 text-sm md:text-xs font-semibold outline-none bg-white dark:bg-slate-900 disabled:opacity-50"
                  >
                    <option
                      v-for="opt in field.options"
                      :key="opt"
                      :value="opt"
                    >
                      {{ opt }}
                    </option>
                  </select>
                  <div
                    v-else-if="field.type === 'checkbox'"
                    class="flex flex-wrap gap-2 mt-1"
                    :class="{
                      'opacity-50 pointer-events-none':
                        !bulkEditToggles.responses[field.id],
                    }"
                  >
                    <label
                      v-for="opt in field.options"
                      :key="opt"
                      class="flex items-center gap-1 text-sm md:text-xs text-slate-600 dark:text-slate-300 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        :value="opt"
                        v-model="bulkEditForm.responses[field.id]"
                        :disabled="!bulkEditToggles.responses[field.id]"
                        class="accent-blue-600 w-3.5 h-3.5 rounded cursor-pointer"
                      />
                      {{ opt }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-else
              class="text-xs md:text-xs text-slate-400 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg italic text-center"
            >
              *Pilih spesifik 1 "Jenis Laporan" di filter jika ingin mengedit
              indikator form secara masal.
            </div>
          </div>

          <div
            class="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex justify-end gap-2"
          >
            <button
              @click="isBulkEditModalOpen = false"
              class="px-4 py-2.5 md:py-2 rounded-lg text-sm md:text-xs font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Batal
            </button>
            <button
              @click="executeBulkEdit"
              class="px-5 py-2.5 md:py-2 rounded-lg text-sm md:text-xs font-semibold bg-button text-white shadow-sm cursor-pointer flex items-center gap-1.5 hover:shadow-md transition-all"
            >
              <i class="fa-solid fa-floppy-disk"></i> Terapkan Edit Masal
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { store } from "../store/index.js";
import { api } from "../services/api.js";
import { db as firestoreDb } from "../services/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import * as XLSX from "xlsx";

// UI STATE
const activeTab = ref("input");
const isSubmitting = ref(false);
const isLoadingData = ref(false);
const isBuilderModalOpen = ref(false);

// ROLES & AUTH
const currentUser = computed(() => store.currentUser || {});
const role = computed(() =>
  String(currentUser.value.role || currentUser.value.Role || "").toUpperCase(),
);
const canManageFormAndRekap = computed(() =>
  ["SUPERADMIN", "ADMIN_UNIT", "ADMIN", "SPV"].includes(role.value),
);
const isSuperadmin = computed(() => role.value === "SUPERADMIN");

watch(canManageFormAndRekap, (canManage) => {
  if (!canManage) activeTab.value = "input";
});

// GLOBAL MASTER DATA
const masterUnits = computed(() => store.db?.master?.unitList || []);

// DATA STATE
const reportTemplates = ref([]);
const reportsList = ref([]);

// INPUT FORM STATE
const selectedTemplateId = ref("");
const formHeader = reactive({ tanggal: "", nama: "", unit: "", divisi: "" });
const formResponses = reactive({});

const activeTemplate = computed(() =>
  reportTemplates.value.find((t) => t.id === selectedTemplateId.value),
);

// REKAP FILTER & SORTING STATE
const date = new Date();
const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
  .toISOString()
  .split("T")[0];
const todayDay = date.toISOString().split("T")[0];

const filter = reactive({
  templateId: "ALL",
  startDate: firstDay,
  endDate: todayDay,
  unit: "ALL",
  search: "",
});
const sortKey = ref("tanggal");
const sortOrder = ref("desc");

const activeRekapTemplate = computed(() =>
  reportTemplates.value.find((t) => t.id === filter.templateId),
);

// BUILDER STATE
const builderTemplate = reactive({ id: "", title: "", fields: [] });

// BULK ACTION STATE
const selectedItems = ref([]);
const isBulkEditModalOpen = ref(false);

const bulkEditToggles = reactive({
  tanggal: false,
  unit: false,
  divisi: false,
  responses: {},
});

const bulkEditForm = reactive({
  tanggal: "",
  unit: "",
  divisi: "",
  responses: {},
});

const isAllSelected = computed({
  get: () =>
    sortedReports.value.length > 0 &&
    selectedItems.value.length === sortedReports.value.length,
  set: (val) => {
    if (val) {
      selectedItems.value = sortedReports.value.map((item) => item.id);
    } else {
      selectedItems.value = [];
    }
  },
});

// LIFECYCLE
onMounted(async () => {
  isLoadingData.value = true;
  formHeader.tanggal = todayDay;
  formHeader.nama = currentUser.value.nama || currentUser.value.Nama || "User";
  formHeader.unit =
    currentUser.value.unit ||
    currentUser.value.Unit ||
    (Array.isArray(currentUser.value.aksesUnit)
      ? currentUser.value.aksesUnit[0]
      : "UMUM");
  formHeader.divisi =
    currentUser.value.divisi || currentUser.value.Divisi || "";

  try {
    const snapTpl = await getDocs(
      query(collection(firestoreDb, "report_templates")),
    );
    reportTemplates.value = snapTpl.docs.map((d) => ({
      ...d.data(),
      id: d.id,
    }));
    if (reportTemplates.value.length > 0)
      selectedTemplateId.value = reportTemplates.value[0].id;

    // Inisialisasi properti formResponses (penting untuk checkbox)
    onTemplateChange();

    const snapRep = await getDocs(
      query(
        collection(firestoreDb, "daily_reports"),
        orderBy("timestamp", "desc"),
      ),
    );
    reportsList.value = snapRep.docs.map((d) => ({ ...d.data(), id: d.id }));
  } catch (err) {
    console.error("Gagal memuat data dari Firestore:", err);
  } finally {
    isLoadingData.value = false;
  }
});

const onTemplateChange = () => {
  Object.keys(formResponses).forEach((key) => delete formResponses[key]);
  if (activeTemplate.value) {
    activeTemplate.value.fields.forEach((f) => {
      // WAJIB: deklarasikan array secara eksplisit agar tidak dianggap Boolean
      formResponses[f.id] = f.type === "checkbox" ? [] : "";
    });
  }
};

watch(
  () => activeTemplate.value,
  (newTemplate) => {
    if (newTemplate) {
      newTemplate.fields.forEach((f) => {
        if (f.type === "checkbox" && !Array.isArray(formResponses[f.id])) {
          formResponses[f.id] = [];
        }
      });
    }
  },
  { deep: true, immediate: true },
);

// ACTIONS
const submitDailyReport = async () => {
  isSubmitting.value = true;
  try {
    const payload = {
      templateId: selectedTemplateId.value,
      jenisLaporan: activeTemplate.value.title,
      timestamp: Date.now(),
      tanggal: formHeader.tanggal,
      nama: formHeader.nama,
      unit: formHeader.unit,
      divisi: formHeader.divisi,
      responses: { ...formResponses },
    };
    const res = await api.saveData("daily_reports", payload);
    if (res && res.success) {
      payload.id = res.id;
      reportsList.value.unshift(payload);
      store.addNotification("Berhasil", "Laporan harian terkirim!", "success");

      // Reset Form Responses
      Object.keys(formResponses).forEach((k) => {
        const fieldData = activeTemplate.value.fields.find((f) => f.id === k);
        formResponses[k] = fieldData && fieldData.type === "checkbox" ? [] : "";
      });
    } else {
      store.openAlert(
        "Gagal",
        res?.message || "Gagal menyimpan",
        null,
        "warning",
      );
    }
  } catch (err) {
    store.openAlert("Error", err.message, null, "warning");
  } finally {
    isSubmitting.value = false;
  }
};

const deleteReport = (id) => {
  store.openAlert(
    "Hapus Data",
    "Hapus permanen data laporan ini?",
    async () => {
      try {
        const res = await api.deleteData("daily_reports", id);
        if (res && res.success) {
          reportsList.value = reportsList.value.filter((r) => r.id !== id);
          store.addNotification("Berhasil", "Laporan dihapus", "success");
        } else {
          store.openAlert(
            "Gagal",
            res?.message || "Gagal menghapus",
            null,
            "warning",
          );
        }
      } catch (err) {
        store.openAlert("Error", err.message, null, "warning");
      }
    },
    "warning",
  );
};

// REKAP SORTING
const setSort = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortOrder.value = "asc";
  }
};

const getSortIcon = (key) => {
  if (sortKey.value !== key) return "fa-sort text-slate-300";
  return sortOrder.value === "asc"
    ? "fa-sort-up text-theme"
    : "fa-sort-down text-theme";
};

const sortedReports = computed(() => {
  let result = reportsList.value.filter((item) => {
    const matchTpl =
      filter.templateId === "ALL" || item.templateId === filter.templateId;
    const matchStart = filter.startDate
      ? item.tanggal >= filter.startDate
      : true;
    const matchEnd = filter.endDate ? item.tanggal <= filter.endDate : true;
    const matchUnit = filter.unit === "ALL" || item.unit === filter.unit;
    let matchSearch = true;
    if (filter.search) {
      const s = filter.search.toLowerCase();
      matchSearch =
        (item.nama || "").toLowerCase().includes(s) ||
        (item.unit || "").toLowerCase().includes(s) ||
        (item.divisi || "").toLowerCase().includes(s);
    }
    return matchTpl && matchStart && matchEnd && matchUnit && matchSearch;
  });
  return result.sort((a, b) => {
    let valA = a[sortKey.value] || "";
    let valB = b[sortKey.value] || "";
    if (valA < valB) return sortOrder.value === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder.value === "asc" ? 1 : -1;
    return 0;
  });
});

const getSummary = (responses) => {
  if (!responses) return "-";
  return (
    Object.values(responses)
      .map((v) => (Array.isArray(v) ? v.join(", ") : v))
      .filter((v) => v)
      .join(" | ")
      .substring(0, 80) + "..."
  );
};

// BUILDER LOGIC
const openBuilderModal = (tpl = null) => {
  if (tpl) {
    Object.assign(builderTemplate, JSON.parse(JSON.stringify(tpl)));
  } else {
    Object.assign(builderTemplate, {
      id: "",
      title: "",
      fields: [
        { id: `f_${Date.now()}`, label: "", type: "number", required: true },
      ],
    });
  }
  isBuilderModalOpen.value = true;
};

const addBuilderField = () => {
  builderTemplate.fields.push({
    id: `f_${Date.now()}`,
    label: "",
    type: "number",
    required: true,
  });
};

const moveField = (index, direction) => {
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= builderTemplate.fields.length) return;
  const temp = builderTemplate.fields[index];
  builderTemplate.fields[index] = builderTemplate.fields[newIndex];
  builderTemplate.fields[newIndex] = temp;
};

const saveBuilderTemplate = async () => {
  if (!builderTemplate.title.trim())
    return store.addNotification(
      "Perhatian",
      "Judul template wajib diisi",
      "warning",
    );
  try {
    const isEdit = !!builderTemplate.id;
    const payload = JSON.parse(JSON.stringify(builderTemplate));
    let res;
    if (isEdit) {
      res = await api.updateData("report_templates", payload.id, payload);
    } else {
      delete payload.id;
      res = await api.saveData("report_templates", payload);
      payload.id = res.id;
    }

    if (res && res.success) {
      if (isEdit) {
        const idx = reportTemplates.value.findIndex((t) => t.id === payload.id);
        if (idx !== -1) reportTemplates.value[idx] = payload;
      } else {
        reportTemplates.value.push(payload);
      }
      isBuilderModalOpen.value = false;
      store.addNotification(
        "Berhasil",
        "Template berhasil disimpan!",
        "success",
      );
    } else {
      store.openAlert(
        "Gagal",
        res?.message || "Gagal menyimpan",
        null,
        "warning",
      );
    }
  } catch (err) {
    store.openAlert("Error", err.message, null, "warning");
  }
};

const deleteTemplate = (id) => {
  if (!id)
    return store.openAlert("Error", "ID Dokumen tidak valid.", null, "warning");
  store.openAlert(
    "Hapus Template",
    "Laporan lama yg memakai template ini strukturnya bisa terganggu. Lanjutkan?",
    async () => {
      try {
        const res = await api.deleteData("report_templates", id);
        if (res && res.success) {
          reportTemplates.value = reportTemplates.value.filter(
            (t) => t.id !== id,
          );
          store.addNotification("Berhasil", "Template dihapus", "success");
        } else {
          store.openAlert(
            "Gagal",
            res?.message || "Gagal menghapus",
            null,
            "warning",
          );
        }
      } catch (err) {
        store.openAlert("Error", err.message, null, "warning");
      }
    },
    "warning",
  );
};

// BULK ACTIONS
const executeBulkDelete = () => {
  if (selectedItems.value.length === 0) return;
  store.openAlert(
    "Hapus Masal",
    `Anda yakin ingin menghapus permanen ${selectedItems.value.length} data terpilih?`,
    async () => {
      store.addNotification("Info", "Memproses penghapusan...", "info");
      let count = 0;

      for (const id of selectedItems.value) {
        try {
          const res = await api.deleteData("daily_reports", id);
          if (res && res.success) {
            count++;
            reportsList.value = reportsList.value.filter((r) => r.id !== id);
          }
        } catch (err) {
          console.error("Gagal hapus", id, err);
        }
      }

      selectedItems.value = [];
      store.addNotification(
        "Berhasil",
        `${count} data laporan berhasil dihapus.`,
        "success",
      );
    },
    "warning",
  );
};

const openBulkEditModal = () => {
  bulkEditToggles.tanggal = false;
  bulkEditToggles.unit = false;
  bulkEditToggles.divisi = false;
  bulkEditForm.tanggal = "";
  bulkEditForm.unit = "";
  bulkEditForm.divisi = "";

  if (filter.templateId !== "ALL" && activeRekapTemplate.value) {
    activeRekapTemplate.value.fields.forEach((f) => {
      bulkEditToggles.responses[f.id] = false;
      bulkEditForm.responses[f.id] = f.type === "checkbox" ? [] : "";
    });
  }

  isBulkEditModalOpen.value = true;
};

const executeBulkEdit = async () => {
  const isAnyCommonToggled =
    bulkEditToggles.tanggal || bulkEditToggles.unit || bulkEditToggles.divisi;
  const isAnyDynamicToggled = Object.values(bulkEditToggles.responses).some(
    (val) => val === true,
  );

  if (!isAnyCommonToggled && !isAnyDynamicToggled) {
    return store.addNotification(
      "Perhatian",
      "Tidak ada kolom yang dicentang untuk diubah.",
      "warning",
    );
  }

  store.addNotification("Info", "Memproses perubahan massal...", "info");
  let count = 0;

  for (const id of selectedItems.value) {
    const reportIndex = reportsList.value.findIndex((r) => r.id === id);
    if (reportIndex > -1) {
      let updatedData = { ...reportsList.value[reportIndex] };
      let changed = false;

      if (bulkEditToggles.tanggal) {
        updatedData.tanggal = bulkEditForm.tanggal;
        changed = true;
      }
      if (bulkEditToggles.unit) {
        updatedData.unit = bulkEditForm.unit;
        changed = true;
      }
      if (bulkEditToggles.divisi) {
        updatedData.divisi = bulkEditForm.divisi;
        changed = true;
      }

      if (filter.templateId !== "ALL" && activeRekapTemplate.value) {
        if (!updatedData.responses) updatedData.responses = {};
        activeRekapTemplate.value.fields.forEach((f) => {
          if (bulkEditToggles.responses[f.id]) {
            updatedData.responses[f.id] = bulkEditForm.responses[f.id];
            changed = true;
          }
        });
      }

      if (changed) {
        try {
          const res = await api.updateData("daily_reports", id, updatedData);
          if (res && res.success) {
            reportsList.value[reportIndex] = updatedData;
            count++;
          }
        } catch (e) {
          console.error("Gagal update id:", id, e);
        }
      }
    }
  }

  isBulkEditModalOpen.value = false;
  selectedItems.value = [];
  store.addNotification(
    "Berhasil",
    `${count} baris data berhasil diperbarui!`,
    "success",
  );
};

// EXPORT/IMPORT EXCEL
const exportToExcel = async () => {
  if (sortedReports.value.length === 0)
    return store.addNotification("Info", "Tidak ada data diekspor", "warning");

  let exportData = [];
  const isSpecific = filter.templateId !== "ALL" && activeRekapTemplate.value;

  if (isSpecific) {
    exportData = sortedReports.value.map((item) => {
      let row = {
        Tanggal: item.tanggal,
        "Nama Karyawan": item.nama,
        "Unit Usaha": item.unit,
        Divisi: item.divisi,
        "Jenis Laporan": item.jenisLaporan,
      };
      activeRekapTemplate.value.fields.forEach((f) => {
        const val = item.responses?.[f.id];
        row[f.label] = Array.isArray(val) ? val.join(", ") : val || "";
      });
      return row;
    });
  } else {
    exportData = sortedReports.value.map((item) => ({
      Tanggal: item.tanggal,
      "Nama Karyawan": item.nama,
      "Unit Usaha": item.unit,
      Divisi: item.divisi,
      "Jenis Laporan": item.jenisLaporan,
      "Isian Rangkuman": getSummary(item.responses),
    }));
  }

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  const sheetName = isSpecific
    ? activeRekapTemplate.value.title
        .substring(0, 30)
        .replace(/[^a-zA-Z0-9 ]/g, "")
    : "Semua_Laporan";

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  const fileName = `Rekap_${filter.startDate}_sd_${filter.endDate}.xlsx`;

  try {
    // 1. Ubah tipe output dari 'array' menjadi 'base64' (Lebih ramah untuk WebView)
    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "base64" });
    const mimeType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    const base64Uri = `data:${mimeType};base64,${wbout}`;

    // 2. Deteksi Mobile & Coba gunakan Native Share API (Solusi ampuh untuk WebView)
    const isMobile =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        navigator.userAgent.toLowerCase(),
      );

    if (isMobile && navigator.share) {
      try {
        // Konversi Base64 URI kembali ke File object untuk di-share
        const fetchRes = await fetch(base64Uri);
        const blob = await fetchRes.blob();
        const file = new File([blob], fileName, { type: mimeType });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: fileName,
            text: "Berikut adalah rekap laporan harian.",
          });
          return; // Berhasil di-share, hentikan eksekusi
        }
      } catch (shareErr) {
        console.warn(
          "Share API dibatalkan/gagal, beralih ke direct download...",
          shareErr,
        );
      }
    }

    // 3. Fallback direct download (Untuk Desktop atau jika Share API gagal)
    const a = document.createElement("a");
    a.href = base64Uri; // Gunakan base64Uri langsung, BUKAN blob
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
    }, 200);
  } catch (err) {
    console.error("Ekspor Error:", err);
    // Fallback darurat bawaan library
    XLSX.writeFile(workbook, fileName);
  }
};

const importExcel = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (filter.templateId === "ALL" || !activeRekapTemplate.value) {
    e.target.value = null;
    return store.openAlert(
      "Perhatian",
      "Pilih SATU Jenis Laporan di menu filter (bukan Semua Jenis Laporan) sebelum mengimpor, agar sistem tahu struktur kolomnya.",
      null,
      "warning",
    );
  }

  const reader = new FileReader();
  reader.onload = async (evt) => {
    try {
      store.addNotification(
        "Info",
        "Sedang memproses dan menyimpan data...",
        "info",
      );
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0)
        return store.addNotification("Warning", "File Excel kosong", "warning");

      let successCount = 0;
      for (const row of jsonData) {
        const payload = {
          templateId: filter.templateId,
          jenisLaporan: row["Jenis Laporan"] || activeRekapTemplate.value.title,
          timestamp: Date.now(),
          tanggal: row["Tanggal"] || new Date().toISOString().split("T")[0],
          nama: row["Nama Karyawan"] || "Tanpa Nama",
          unit: row["Unit Usaha"] || "",
          divisi: row["Divisi"] || "",
          responses: {},
        };

        activeRekapTemplate.value.fields.forEach((f) => {
          if (row[f.label] !== undefined) {
            if (f.type === "checkbox") {
              payload.responses[f.id] = String(row[f.label])
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s);
            } else {
              payload.responses[f.id] = String(row[f.label]);
            }
          } else if (f.type === "checkbox") {
            payload.responses[f.id] = [];
          }
        });

        const res = await api.saveData("daily_reports", payload);
        if (res && res.success) {
          payload.id = res.id;
          reportsList.value.unshift(payload);
          successCount++;
        }
      }

      store.addNotification(
        "Berhasil",
        `${successCount} baris data berhasil diimpor & disimpan!`,
        "success",
      );
      e.target.value = null;
    } catch (error) {
      store.openAlert("Error Import", error.message, null, "warning");
      e.target.value = null;
    }
  };
  reader.readAsArrayBuffer(file);
};

const formatTanggal = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
</script>

<style>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
