<!-- src/views/PageSpvReport.vue -->
<template>
  <div class="space-y-4 md:space-y-6 pb-20 md:pb-6">
    <!-- HEADER BAR: TITLE & FILTER UNIT -->
    <div
      class="glass-card p-4 md:p-5 rounded-2xl flex flex-col lg:flex-row md:items-center justify-between gap-4 no-print"
    >
      <div>
        <h3
          class="text-sm md:text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"
        >
          <i class="fa-solid fa-file-signature text-emerald-600"></i>
          <span>Laporan Pekanan & Konsolidasi Direksi</span>
        </h3>
        <p class="text-[11px] md:text-xs text-slate-400 mt-0.5">
          Modul pembuatan rekapitulasi kinerja mingguan per unit usaha maupun
          konsolidasi seluruh unit.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <select
          v-model="selectedUnitFilter"
          :disabled="!isSuperadmin"
          class="glass-input rounded-xl px-2.5 py-1.5 md:px-3 md:py-2 text-xs font-semibold dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none cursor-pointer disabled:opacity-70"
        >
          <option value="ALL" v-if="isSuperadmin">
            Semua Unit (Konsolidasi)
          </option>
          <option v-for="u in masterUnits" :key="u.code" :value="u.code">
            {{ u.code }} - {{ u.name }}
          </option>
        </select>

        <button
          @click="openAddReportModal"
          class="bg-button text-white font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <i class="fa-solid fa-pen-to-square"></i>
          <span>+ Laporan</span>
        </button>
      </div>
    </div>

    <!-- TABEL LAPORAN RINGKAS RESPONSIF MOBILE -->
    <div
      v-if="filteredReports.length > 0"
      class="glass-card rounded-2xl overflow-hidden border border-white/30 dark:border-slate-800 shadow-sm no-print space-y-0"
    >
      <div
        class="p-3 md:p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap justify-between items-center bg-slate-50/50 dark:bg-slate-800/40 gap-2"
      >
        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            :checked="isAllSelected"
            @change="toggleSelectAll"
            class="accent-purple-600 rounded cursor-pointer w-4 h-4"
            title="Pilih Semua Laporan"
          />
          <span class="text-xs font-bold text-slate-700 dark:text-slate-200">
            Daftar Laporan Terdaftar ({{ filteredReports.length }})
          </span>
        </div>

        <div class="flex items-center gap-1.5">
          <span
            v-if="selectedReportIds.length > 0"
            class="text-[10px] md:text-[11px] text-purple-600 font-bold bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20 mr-0.5"
          >
            {{ selectedReportIds.length }} Dipilih
          </span>

          <button
            v-if="selectedReportIds.length > 0"
            @click="clearBulkSelection"
            class="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold px-2.5 py-1 rounded-xl text-[11px] transition-all flex items-center gap-1 cursor-pointer"
            title="Batal Pilih Semua"
          >
            <i class="fa-solid fa-xmark"></i>
            <span>Batal</span>
          </button>

          <button
            v-if="selectedReportIds.length > 0"
            @click="confirmBulkDelete"
            class="bg-rose-600 hover:bg-rose-700 text-white font-bold px-2.5 py-1 rounded-xl text-[11px] shadow-md transition-all flex items-center gap-1 cursor-pointer"
          >
            <i class="fa-solid fa-trash"></i>
            <span>Hapus</span>
          </button>

          <button
            v-if="selectedReportIds.length > 0"
            @click="generateBulkConsolidation"
            class="bg-purple-600 hover:bg-purple-700 text-white font-bold px-2.5 py-1 rounded-xl text-[11px] shadow-md transition-all flex items-center gap-1 cursor-pointer animate-pulse"
          >
            <i class="fa-solid fa-layer-group"></i>
            <span>Konsolidasi</span>
          </button>
        </div>
      </div>

      <!-- TABLE LAYOUT FIXED UNTUK KONTROL MOBILE -->
      <div class="w-full overflow-x-auto">
        <table
          class="w-full text-left text-xs table-fixed min-w-[620px] md:min-w-full"
        >
          <thead>
            <tr
              class="bg-slate-100/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase text-[9px] md:text-[10px] border-b border-slate-200 dark:border-slate-800"
            >
              <th class="p-2 md:p-3 w-8 text-center">Pilih</th>
              <th
                @click="sortTable('unit')"
                class="p-2 md:p-3 w-16 md:w-24 cursor-pointer select-none"
              >
                Unit
              </th>
              <th
                @click="sortTable('title')"
                class="p-2 md:p-3 cursor-pointer select-none"
              >
                Judul & Periode
              </th>
              <th
                @click="sortTable('penjualan')"
                class="p-2 md:p-3 w-28 md:w-36 text-right cursor-pointer select-none"
              >
                Penjualan
              </th>
              <th
                @click="sortTable('releaseDate')"
                class="p-2 md:p-3 w-20 md:w-28 text-center cursor-pointer select-none"
              >
                Tgl Rilis
              </th>
              <th class="p-2 md:p-3 w-24 md:w-32 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
            <template v-for="rep in sortedReports" :key="rep.id">
              <tr
                class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                :class="{
                  'bg-purple-500/5 dark:bg-purple-500/10':
                    selectedReportIds.includes(rep.id),
                }"
              >
                <!-- CHECKBOX -->
                <td class="p-2 md:p-3 text-center" @click.stop>
                  <input
                    type="checkbox"
                    :value="rep.id"
                    v-model="selectedReportIds"
                    class="accent-purple-600 rounded cursor-pointer w-3.5 h-3.5"
                  />
                </td>

                <!-- BADGE UNIT -->
                <td class="p-2 md:p-3" @click="toggleExpand(rep.id)">
                  <span
                    class="text-[8px] md:text-[9px] font-bold px-1.5 py-0.5 rounded-full border uppercase inline-block truncate max-w-full"
                    :class="
                      rep.unit === 'ALL'
                        ? 'text-purple-600 bg-purple-500/10 border-purple-500/20'
                        : 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20'
                    "
                  >
                    {{ rep.unit === "ALL" ? "KONSOL" : rep.unit }}
                  </span>
                </td>

                <!-- JUDUL & PERIODE DENGAN TRUNCATE (...) -->
                <td
                  class="p-2 md:p-3 cursor-pointer overflow-hidden"
                  @click="toggleExpand(rep.id)"
                >
                  <div
                    class="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1 min-w-0"
                  >
                    <i
                      class="fa-solid text-[9px] text-slate-400 shrink-0 transition-transform duration-200"
                      :class="
                        expandedReportIds.includes(rep.id)
                          ? 'fa-chevron-down'
                          : 'fa-chevron-right'
                      "
                    ></i>
                    <span
                      class="truncate text-[11px] md:text-xs"
                      :title="rep.title"
                      >{{ rep.title }}</span
                    >
                  </div>
                  <span
                    class="text-[9px] md:text-[10px] text-slate-400 block truncate ml-3"
                    :title="rep.periode"
                  >
                    {{ rep.periode }}
                  </span>
                </td>

                <!-- NOMINAL PENJUALAN -->
                <td
                  class="p-2 md:p-3 text-right font-black text-emerald-600 whitespace-nowrap cursor-pointer text-[11px] md:text-xs"
                  @click="toggleExpand(rep.id)"
                >
                  Rp {{ formatNumber(rep.ringkasan?.penjualan) }}
                </td>

                <!-- TANGGAL RILIS -->
                <td
                  class="p-2 md:p-3 text-center text-slate-500 text-[10px] md:text-[11px] whitespace-nowrap cursor-pointer"
                  @click="toggleExpand(rep.id)"
                >
                  {{ rep.releaseDate }}
                </td>

                <!-- ACTION BUTTONS -->
                <td class="p-2 md:p-3 text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-1">
                    <button
                      @click="duplicateReport(rep)"
                      class="bg-amber-500 hover:bg-amber-600 text-white text-[10px] p-1.5 md:px-2 md:py-1 rounded-lg font-bold transition-all cursor-pointer shadow-xs"
                      title="Duplikat Data Laporan"
                    >
                      <i class="fa-solid fa-copy"></i>
                    </button>
                    <button
                      @click="openExportModal(rep)"
                      class="bg-blue-600 hover:bg-blue-700 text-white text-[10px] px-1.5 py-1 md:px-2.5 md:py-1 rounded-lg font-bold transition-all cursor-pointer shadow-xs flex items-center gap-0.5"
                      title="Opsi Ekspor Laporan"
                    >
                      <i class="fa-solid fa-download"></i>
                      <span class="hidden md:inline">Ekspor</span>
                    </button>
                    <button
                      @click="openEditReport(rep)"
                      class="text-slate-400 hover:text-amber-500 p-1 cursor-pointer"
                      title="Edit"
                    >
                      <i class="fa-solid fa-pen-to-square text-[11px]"></i>
                    </button>
                    <button
                      @click="confirmDeleteReport(rep)"
                      class="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                      title="Hapus"
                    >
                      <i class="fa-solid fa-trash text-[11px]"></i>
                    </button>
                  </div>
                </td>
              </tr>

              <!-- DETAIL LAPORAN COLLAPSIBLE -->
              <tr
                v-if="expandedReportIds.includes(rep.id)"
                class="bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800"
              >
                <td colspan="6" class="p-3 md:p-4 space-y-3">
                  <div class="space-y-1">
                    <strong
                      class="text-[11px] md:text-xs font-bold text-slate-800 dark:text-slate-100 uppercase"
                      >1. Ringkasan Pesanan & Penjualan (Seluruh Unit)</strong
                    >
                    <div
                      class="grid grid-cols-3 gap-2 md:gap-3 text-center bg-white dark:bg-slate-800 p-2.5 md:p-3 rounded-xl border border-slate-200 dark:border-slate-700"
                    >
                      <div>
                        <span
                          class="text-[9px] md:text-[10px] text-slate-400 block mb-0.5"
                          >Total Penawaran</span
                        >
                        <strong
                          class="text-emerald-600 text-xs md:text-sm font-black"
                          >{{ formatNumber(rep.ringkasan?.penawaran) }}</strong
                        >
                      </div>
                      <div>
                        <span
                          class="text-[9px] md:text-[10px] text-slate-400 block mb-0.5"
                          >Total Pesanan</span
                        >
                        <strong
                          class="text-emerald-600 text-xs md:text-sm font-black"
                          >{{ formatNumber(rep.ringkasan?.pesanan) }}</strong
                        >
                      </div>
                      <div>
                        <span
                          class="text-[9px] md:text-[10px] text-slate-400 block mb-0.5"
                          >Total Penjualan (Rp)</span
                        >
                        <strong
                          class="text-emerald-600 text-xs md:text-sm font-black"
                          >Rp
                          {{ formatNumber(rep.ringkasan?.penjualan) }}</strong
                        >
                      </div>
                    </div>
                  </div>

                  <div
                    v-if="rep.aktivitasCS"
                    class="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1"
                  >
                    <strong
                      class="text-slate-800 dark:text-slate-200 block text-xs uppercase"
                      >2. Aktivitas Unit</strong
                    >
                    <div
                      class="rich-editor-content export-override-font text-xs leading-relaxed text-slate-600 dark:text-slate-300"
                      v-html="rep.aktivitasCS"
                    ></div>
                  </div>

                  <div
                    class="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2"
                  >
                    <strong
                      class="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase"
                      >3. Detail Proses Pesanan: Leads & Campaign</strong
                    >
                    <div class="overflow-x-auto">
                      <table
                        class="w-full text-xs text-left border-collapse border"
                      >
                        <thead>
                          <tr class="bg-slate-100 dark:bg-slate-700/50">
                            <th class="border p-1.5">Unit</th>
                            <th class="border p-1.5">Data Baru</th>
                            <th class="border p-1.5">Penawaran</th>
                            <th class="border p-1.5">Follow Up</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(row, idx) in getPemasaranRows(rep)"
                            :key="idx"
                          >
                            <td class="border p-1.5 font-semibold">
                              {{ row.unit }}
                            </td>
                            <td class="border p-1.5">
                              {{ formatNumber(row.leads) }}
                            </td>
                            <td class="border p-1.5">
                              {{ formatNumber(row.campaign) }}
                            </td>
                            <td class="border p-1.5">
                              {{ formatNumber(row.fu) }}
                            </td>
                          </tr>
                          <tr
                            class="font-bold bg-slate-50 dark:bg-slate-700/30"
                          >
                            <td class="border p-1.5">TOTAL</td>
                            <td class="border p-1.5">
                              {{ formatNumber(getPemasaranTotal(rep).leads) }}
                            </td>
                            <td class="border p-1.5">
                              {{
                                formatNumber(getPemasaranTotal(rep).campaign)
                              }}
                            </td>
                            <td class="border p-1.5">
                              {{ formatNumber(getPemasaranTotal(rep).fu) }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div
                    class="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2"
                  >
                    <strong
                      class="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase"
                      >4. Detail Penjualan</strong
                    >
                    <div class="overflow-x-auto">
                      <table
                        class="w-full text-xs text-left border-collapse border"
                      >
                        <thead>
                          <tr class="bg-slate-100 dark:bg-slate-700/50">
                            <th class="border p-1.5">Unit / Channel</th>
                            <th class="border p-1.5">Pesanan</th>
                            <th class="border p-1.5">Penjualan (Rp)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(row, idx) in getPenjualanRows(rep)"
                            :key="idx"
                          >
                            <td class="border p-1.5 font-semibold">
                              {{ row.channel }}
                            </td>
                            <td class="border p-1.5">
                              {{
                                row.pesanan > 0
                                  ? formatNumber(row.pesanan)
                                  : "-"
                              }}
                            </td>
                            <td class="border p-1.5">
                              Rp {{ formatNumber(row.penjualan) }}
                            </td>
                          </tr>
                          <tr
                            class="font-bold bg-slate-50 dark:bg-slate-700/30"
                          >
                            <td class="border p-1.5">TOTAL</td>
                            <td class="border p-1.5">
                              {{
                                getPenjualanTotal(rep).pesanan > 0
                                  ? formatNumber(getPenjualanTotal(rep).pesanan)
                                  : "-"
                              }}
                            </td>
                            <td class="border p-1.5">
                              Rp
                              {{
                                formatNumber(getPenjualanTotal(rep).penjualan)
                              }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div
                    v-if="rep.kendala"
                    class="p-3 bg-rose-500/5 dark:bg-rose-500/10 rounded-xl border border-rose-500/20 text-rose-600 dark:text-rose-400 space-y-1"
                  >
                    <strong class="block text-xs uppercase font-bold"
                      >5. Kendala & Solusi Tindak Lanjut</strong
                    >
                    <div
                      class="rich-editor-content export-override-font text-xs leading-relaxed"
                      v-html="rep.kendala"
                    ></div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="glass-card p-12 text-center rounded-3xl space-y-3 no-print"
    >
      <i
        class="fa-solid fa-file-invoice text-4xl text-slate-300 dark:text-slate-700 mb-1"
      ></i>
      <h4 class="font-bold text-sm text-slate-700 dark:text-slate-300">
        Belum Ada Laporan Terdaftar
      </h4>
      <p class="text-xs text-slate-400 max-w-xs mx-auto">
        Klik tombol "Buat Laporan Baru" untuk menyusun laporan per unit atau
        konsolidasi seluruh unit.
      </p>
    </div>

    <!-- MODAL FORM LAPORAN PEKANAN -->
    <Teleport to="body">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md no-print"
        @click.self="isModalOpen = false"
      >
        <div
          class="w-full max-w-3xl glass-card bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-100 dark:border-slate-800 max-h-[92vh] overflow-y-auto"
        >
          <div
            class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3"
          >
            <h3
              class="font-bold text-sm md:text-base text-slate-800 dark:text-slate-100"
            >
              {{
                isEdit
                  ? "Edit Laporan Pekanan"
                  : "Form Pembuatan Laporan Pekanan"
              }}
            </h3>
            <button
              @click="isModalOpen = false"
              class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <form @submit.prevent="saveReport" class="space-y-4 text-xs">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="block text-slate-500 font-medium mb-1"
                  >Unit Usaha Laporan:</label
                >
                <select
                  v-model="form.unit"
                  @change="onPeriodOrUnitChange"
                  class="w-full glass-input rounded-xl px-3 py-2 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none cursor-pointer"
                >
                  <option value="ALL" v-if="isSuperadmin">
                    Semua Unit (Konsolidasi)
                  </option>
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
                  >Dari Tanggal:</label
                >
                <input
                  v-model="form.startDate"
                  type="date"
                  required
                  @change="onPeriodOrUnitChange"
                  class="w-full glass-input rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 outline-none dark:bg-slate-800"
                />
              </div>

              <div>
                <label class="block text-slate-500 font-medium mb-1"
                  >Sampai Tanggal:</label
                >
                <input
                  v-model="form.endDate"
                  type="date"
                  required
                  @change="onPeriodOrUnitChange"
                  class="w-full glass-input rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 outline-none dark:bg-slate-800"
                />
              </div>
            </div>

            <div>
              <label class="block text-slate-500 font-medium mb-1"
                >Judul Laporan Pekanan:</label
              >
              <input
                v-model="form.title"
                type="text"
                required
                class="w-full glass-input rounded-xl px-3 py-2 outline-none font-semibold"
              />
            </div>

            <!-- RICH TEXT EDITOR 1 -->
            <div>
              <label class="block text-slate-500 font-medium mb-1"
                >Aktivitas Unit (Rich Text Editor):</label
              >
              <div
                class="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800"
              >
                <div
                  class="flex gap-1 p-1.5 bg-slate-100 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-xs flex-wrap items-center"
                >
                  <button
                    type="button"
                    @click="formatText('csEditor', 'bold')"
                    class="px-2 py-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded font-bold"
                    title="Bold"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    @click="formatText('csEditor', 'italic')"
                    class="px-2 py-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded italic"
                    title="Italic"
                  >
                    I
                  </button>
                  <div
                    class="h-4 w-px bg-slate-300 dark:bg-slate-600 mx-1"
                  ></div>
                  <button
                    type="button"
                    @click="formatText('csEditor', 'insertUnorderedList')"
                    class="px-2 py-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                    title="Bullet List"
                  >
                    <i class="fa-solid fa-list-ul"></i>
                  </button>
                  <button
                    type="button"
                    @click="formatText('csEditor', 'insertOrderedList')"
                    class="px-2 py-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded font-bold"
                    title="Numbered List (1, 2, 3)"
                  >
                    123
                  </button>
                  <button
                    type="button"
                    @click="formatCustomList('csEditor', 'upper-alpha')"
                    class="px-2 py-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded font-bold"
                    title="List Kapital (A, B, C)"
                  >
                    ABC
                  </button>
                  <button
                    type="button"
                    @click="formatCustomList('csEditor', 'lower-alpha')"
                    class="px-2 py-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded font-bold"
                    title="List Non-Kapital (a, b, c)"
                  >
                    abc
                  </button>
                </div>
                <div
                  id="csEditor"
                  contenteditable="true"
                  @input="handleEditorInput('csEditor')"
                  class="rich-editor-box p-3 outline-none text-slate-800 dark:text-slate-100 text-xs"
                ></div>
              </div>
            </div>

            <!-- RICH TEXT EDITOR 2 -->
            <div>
              <label class="block text-slate-500 font-medium mb-1"
                >Catatan / Kendala & Solusi Tindak Lanjut:</label
              >
              <div
                class="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800"
              >
                <div
                  class="flex gap-1 p-1.5 bg-slate-100 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-xs flex-wrap items-center"
                >
                  <button
                    type="button"
                    @click="formatText('kendalaEditor', 'bold')"
                    class="px-2 py-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded font-bold"
                    title="Bold"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    @click="formatText('kendalaEditor', 'italic')"
                    class="px-2 py-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded italic"
                    title="Italic"
                  >
                    I
                  </button>
                  <div
                    class="h-4 w-px bg-slate-300 dark:bg-slate-600 mx-1"
                  ></div>
                  <button
                    type="button"
                    @click="formatText('kendalaEditor', 'insertUnorderedList')"
                    class="px-2 py-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                    title="Bullet List"
                  >
                    <i class="fa-solid fa-list-ul"></i>
                  </button>
                  <button
                    type="button"
                    @click="formatText('kendalaEditor', 'insertOrderedList')"
                    class="px-2 py-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded font-bold"
                    title="Numbered List (1, 2, 3)"
                  >
                    123
                  </button>
                  <button
                    type="button"
                    @click="formatCustomList('kendalaEditor', 'upper-alpha')"
                    class="px-2 py-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded font-bold"
                    title="List Kapital (A, B, C)"
                  >
                    ABC
                  </button>
                  <button
                    type="button"
                    @click="formatCustomList('kendalaEditor', 'lower-alpha')"
                    class="px-2 py-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded font-bold"
                    title="List Non-Kapital (a, b, c)"
                  >
                    abc
                  </button>
                </div>
                <div
                  id="kendalaEditor"
                  contenteditable="true"
                  @input="handleEditorInput('kendalaEditor')"
                  class="rich-editor-box p-3 outline-none text-slate-800 dark:text-slate-100 text-xs"
                ></div>
              </div>
            </div>

            <div
              class="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800"
            >
              <button
                @click="isModalOpen = false"
                type="button"
                class="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="store.isLoading"
                class="bg-button text-white px-5 py-2 rounded-xl font-bold shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <i
                  v-if="store.isLoading"
                  class="fa-solid fa-spinner fa-spin"
                ></i>
                <span>{{
                  store.isLoading ? "Menyimpan..." : "Terbitkan Laporan Pekanan"
                }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- POPUP MODAL EXPORT & PREVIEW -->
    <Teleport to="body">
      <div
        v-if="isExportModalOpen && printActiveReport"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md no-print"
        @click.self="isExportModalOpen = false"
      >
        <div
          class="w-full max-w-4xl glass-card bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-2xl space-y-4 border border-slate-100 dark:border-slate-800 max-h-[92vh] flex flex-col"
        >
          <div
            class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 shrink-0"
          >
            <div>
              <h3
                class="font-bold text-xs md:text-base text-slate-800 dark:text-slate-100 flex items-center gap-2"
              >
                <i class="fa-solid fa-file-export text-blue-600"></i>
                <span>Opsi Ekspor & Pratinjau Dokumen</span>
              </h3>
              <p
                class="text-[10px] md:text-[11px] text-slate-400 mt-0.5 truncate max-w-xs md:max-w-md"
              >
                {{ printActiveReport.title }}
              </p>
            </div>

            <div class="flex items-center gap-1.5">
              <button
                @click="executeExportWord"
                class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1.5 md:px-3 md:py-1.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-1 cursor-pointer"
              >
                <i class="fa-solid fa-file-word"></i>
                <span class="hidden md:inline">Unduh Word (.doc)</span>
              </button>

              <button
                @click="executePrintPDF"
                class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1.5 md:px-3 md:py-1.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-1 cursor-pointer"
              >
                <i class="fa-solid fa-print"></i>
                <span>Cetak / PDF</span>
              </button>

              <button
                @click="isExportModalOpen = false"
                class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
              >
                <i class="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
          </div>

          <div
            class="overflow-y-auto flex-1 p-3 md:p-6 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200/80 dark:border-slate-800"
          >
            <div
              id="modal-preview-box"
              class="p-4 md:p-8 space-y-6 text-black bg-white shadow-md mx-auto max-w-3xl font-calibri rounded-lg"
            >
              <div class="text-center border-b pb-4">
                <h2
                  class="text-lg md:text-xl font-bold uppercase tracking-wide"
                >
                  {{ printActiveReport.title }}
                </h2>
                <p class="text-xs md:text-sm text-slate-600">
                  Periode: {{ printActiveReport.periode }} | Unit:
                  {{ printActiveReport.unit }}
                </p>
              </div>

              <div class="border p-3 md:p-4 rounded-lg space-y-2">
                <h3
                  class="font-bold text-xs md:text-sm border-b pb-1 text-emerald-800 uppercase"
                >
                  1. RINGKASAN PESANAN DAN PENJUALAN
                </h3>
                <table
                  class="w-full text-left text-xs md:text-sm border-collapse border"
                >
                  <thead>
                    <tr class="bg-slate-100">
                      <th class="border p-1.5 md:p-2">Total Penawaran</th>
                      <th class="border p-1.5 md:p-2">Total Pesanan</th>
                      <th class="border p-1.5 md:p-2">Total Penjualan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="border p-1.5 md:p-2 font-bold">
                        {{
                          formatNumber(printActiveReport.ringkasan?.penawaran)
                        }}
                      </td>
                      <td class="border p-1.5 md:p-2 font-bold">
                        {{ formatNumber(printActiveReport.ringkasan?.pesanan) }}
                      </td>
                      <td
                        class="border p-1.5 md:p-2 font-bold text-emerald-700"
                      >
                        Rp
                        {{
                          formatNumber(printActiveReport.ringkasan?.penjualan)
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="border p-3 md:p-4 rounded-lg space-y-2">
                <h3
                  class="font-bold text-xs md:text-sm border-b pb-1 text-emerald-800 uppercase"
                >
                  2. AKTIVITAS UNIT
                </h3>
                <div
                  class="rich-editor-content export-override-font text-xs md:text-sm leading-relaxed"
                  v-html="printActiveReport.aktivitasCS"
                ></div>
              </div>

              <div class="border p-3 md:p-4 rounded-lg space-y-2">
                <h3
                  class="font-bold text-xs md:text-sm border-b pb-1 text-emerald-800 uppercase"
                >
                  3. DETAIL PROSES PESANAN: LEADS & CAMPAIGN
                </h3>
                <table
                  class="w-full text-left text-xs md:text-sm border-collapse border"
                >
                  <thead>
                    <tr class="bg-slate-100">
                      <th class="border p-1.5 md:p-2">Unit</th>
                      <th class="border p-1.5 md:p-2">Data Baru</th>
                      <th class="border p-1.5 md:p-2">Penawaran</th>
                      <th class="border p-1.5 md:p-2">Follow Up</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(row, idx) in getPemasaranRows(printActiveReport)"
                      :key="idx"
                    >
                      <td class="border p-1.5 md:p-2 font-semibold">
                        {{ row.unit }}
                      </td>
                      <td class="border p-1.5 md:p-2">
                        {{ formatNumber(row.leads) }}
                      </td>
                      <td class="border p-1.5 md:p-2">
                        {{ formatNumber(row.campaign) }}
                      </td>
                      <td class="border p-1.5 md:p-2">
                        {{ formatNumber(row.fu) }}
                      </td>
                    </tr>
                    <tr class="font-bold bg-slate-100">
                      <td class="border p-1.5 md:p-2">TOTAL</td>
                      <td class="border p-1.5 md:p-2">
                        {{
                          formatNumber(
                            getPemasaranTotal(printActiveReport).leads,
                          )
                        }}
                      </td>
                      <td class="border p-1.5 md:p-2">
                        {{
                          formatNumber(
                            getPemasaranTotal(printActiveReport).campaign,
                          )
                        }}
                      </td>
                      <td class="border p-1.5 md:p-2">
                        {{
                          formatNumber(getPemasaranTotal(printActiveReport).fu)
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="border p-3 md:p-4 rounded-lg space-y-2">
                <h3
                  class="font-bold text-xs md:text-sm border-b pb-1 text-emerald-800 uppercase"
                >
                  4. DETAIL PENJUALAN
                </h3>
                <table
                  class="w-full text-left text-xs md:text-sm border-collapse border"
                >
                  <thead>
                    <tr class="bg-slate-100">
                      <th class="border p-1.5 md:p-2">Unit / Channel</th>
                      <th class="border p-1.5 md:p-2">Pesanan</th>
                      <th class="border p-1.5 md:p-2">Penjualan (Rp)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(row, idx) in getPenjualanRows(printActiveReport)"
                      :key="idx"
                    >
                      <td class="border p-1.5 md:p-2 font-semibold">
                        {{ row.channel }}
                      </td>
                      <td class="border p-1.5 md:p-2">
                        {{ row.pesanan > 0 ? formatNumber(row.pesanan) : "-" }}
                      </td>
                      <td class="border p-1.5 md:p-2">
                        Rp {{ formatNumber(row.penjualan) }}
                      </td>
                    </tr>
                    <tr class="font-bold bg-slate-100">
                      <td class="border p-1.5 md:p-2">TOTAL</td>
                      <td class="border p-1.5 md:p-2">
                        {{
                          getPenjualanTotal(printActiveReport).pesanan > 0
                            ? formatNumber(
                                getPenjualanTotal(printActiveReport).pesanan,
                              )
                            : "-"
                        }}
                      </td>
                      <td class="border p-1.5 md:p-2">
                        Rp
                        {{
                          formatNumber(
                            getPenjualanTotal(printActiveReport).penjualan,
                          )
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="border p-3 md:p-4 rounded-lg space-y-2">
                <h3
                  class="font-bold text-xs md:text-sm border-b pb-1 text-emerald-800 uppercase"
                >
                  5. KENDALA & SOLUSI
                </h3>
                <div
                  class="rich-editor-content export-override-font text-xs md:text-sm leading-relaxed"
                  v-html="printActiveReport.kendala"
                ></div>
              </div>

              <div class="flex justify-between text-xs pt-6 border-t mt-6">
                <div>
                  <p>Penyusun Laporan:</p>
                  <br /><br />
                  <p class="font-bold text-xs md:text-sm">
                    {{ printActiveReport.author || "SPV Unit" }}
                  </p>
                </div>
                <div class="text-right">
                  <p>Tanggal Diterbitkan:</p>
                  <p class="font-bold text-xs md:text-sm">
                    {{ printActiveReport.releaseDate }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- CONTAINER RENDER KHUSUS PRINTER CETAK PDF -->
    <div
      v-if="printActiveReport"
      id="document-render-template"
      class="print-only font-calibri"
    >
      <div class="text-center border-b pb-4 mb-6">
        <h2 class="text-xl font-bold uppercase tracking-wide">
          {{ printActiveReport.title }}
        </h2>
        <p class="text-sm text-slate-600">
          Periode: {{ printActiveReport.periode }} | Unit:
          {{ printActiveReport.unit }}
        </p>
      </div>

      <div class="border p-4 rounded-lg space-y-2 mb-4">
        <h3 class="font-bold text-sm border-b pb-1 text-emerald-800 uppercase">
          1. RINGKASAN PESANAN DAN PENJUALAN
        </h3>
        <table class="w-full text-left text-sm border-collapse border">
          <thead>
            <tr class="bg-slate-100">
              <th class="border p-2">Total Penawaran</th>
              <th class="border p-2">Total Pesanan</th>
              <th class="border p-2">Total Penjualan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border p-2 font-bold">
                {{ formatNumber(printActiveReport.ringkasan?.penawaran) }}
              </td>
              <td class="border p-2 font-bold">
                {{ formatNumber(printActiveReport.ringkasan?.pesanan) }}
              </td>
              <td class="border p-2 font-bold text-emerald-700">
                Rp {{ formatNumber(printActiveReport.ringkasan?.penjualan) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="border p-4 rounded-lg space-y-2 mb-4">
        <h3 class="font-bold text-sm border-b pb-1 text-emerald-800 uppercase">
          2. AKTIVITAS UNIT
        </h3>
        <div
          class="rich-editor-content export-override-font text-sm leading-relaxed"
          v-html="printActiveReport.aktivitasCS"
        ></div>
      </div>

      <div class="border p-4 rounded-lg space-y-2 mb-4">
        <h3 class="font-bold text-sm border-b pb-1 text-emerald-800 uppercase">
          3. DETAIL PROSES PESANAN: LEADS & CAMPAIGN
        </h3>
        <table class="w-full text-left text-sm border-collapse border">
          <thead>
            <tr class="bg-slate-100">
              <th class="border p-2">Unit</th>
              <th class="border p-2">Data Baru</th>
              <th class="border p-2">Penawaran</th>
              <th class="border p-2">Follow Up</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, idx) in getPemasaranRows(printActiveReport)"
              :key="idx"
            >
              <td class="border p-2 font-semibold">{{ row.unit }}</td>
              <td class="border p-2">{{ formatNumber(row.leads) }}</td>
              <td class="border p-2">{{ formatNumber(row.campaign) }}</td>
              <td class="border p-2">{{ formatNumber(row.fu) }}</td>
            </tr>
            <tr class="font-bold bg-slate-100">
              <td class="border p-2">TOTAL</td>
              <td class="border p-2">
                {{ formatNumber(getPemasaranTotal(printActiveReport).leads) }}
              </td>
              <td class="border p-2">
                {{
                  formatNumber(getPemasaranTotal(printActiveReport).campaign)
                }}
              </td>
              <td class="border p-2">
                {{ formatNumber(getPemasaranTotal(printActiveReport).fu) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="border p-4 rounded-lg space-y-2 mb-4">
        <h3 class="font-bold text-sm border-b pb-1 text-emerald-800 uppercase">
          4. DETAIL PENJUALAN
        </h3>
        <table class="w-full text-left text-sm border-collapse border">
          <thead>
            <tr class="bg-slate-100">
              <th class="border p-2">Unit / Channel</th>
              <th class="border p-2">Pesanan</th>
              <th class="border p-2">Penjualan (Rp)</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, idx) in getPenjualanRows(printActiveReport)"
              :key="idx"
            >
              <td class="border p-2 font-semibold">{{ row.channel }}</td>
              <td class="border p-2">
                {{ row.pesanan > 0 ? formatNumber(row.pesanan) : "-" }}
              </td>
              <td class="border p-2">Rp {{ formatNumber(row.penjualan) }}</td>
            </tr>
            <tr class="font-bold bg-slate-100">
              <td class="border p-2">TOTAL</td>
              <td class="border p-2">
                {{
                  getPenjualanTotal(printActiveReport).pesanan > 0
                    ? formatNumber(getPenjualanTotal(printActiveReport).pesanan)
                    : "-"
                }}
              </td>
              <td class="border p-2">
                Rp
                {{
                  formatNumber(getPenjualanTotal(printActiveReport).penjualan)
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="border p-4 rounded-lg space-y-2 mb-4">
        <h3 class="font-bold text-sm border-b pb-1 text-emerald-800 uppercase">
          5. KENDALA & SOLUSI
        </h3>
        <div
          class="rich-editor-content export-override-font text-sm leading-relaxed"
          v-html="printActiveReport.kendala"
        ></div>
      </div>

      <div class="flex justify-between text-xs pt-8 border-t mt-6">
        <div>
          <p>Penyusun Laporan:</p>
          <br /><br />
          <p class="font-bold text-sm">
            {{ printActiveReport.author || "SPV Unit" }}
          </p>
        </div>
        <div class="text-right">
          <p>Tanggal Diterbitkan:</p>
          <p class="font-bold text-sm">{{ printActiveReport.releaseDate }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, nextTick } from "vue";
import { store } from "../store/index.js";
import { api } from "../services/api.js";

const selectedUnitFilter = ref("ALL");
const isModalOpen = ref(false);
const isExportModalOpen = ref(false);
const isEdit = ref(false);
const activeId = ref(null);
const printActiveReport = ref(null);

const expandedReportIds = ref([]);
const selectedReportIds = ref([]);
const sortKey = ref("releaseDate");
const sortAsc = ref(false);

const masterUnits = computed(() => {
  return (
    store.db?.master?.unitList ||
    store.master?.unitList || [
      { code: "NHP", name: "Nur Hidayah Press" },
      { code: "NHC", name: "Nur Hidayah Creative" },
      { code: "KG", name: "Karta Grafika" },
    ]
  );
});

const reports = computed(() => store.db?.spvReports || store.spvReports || []);

const form = reactive({
  unit: "NHP",
  title: "",
  startDate: "",
  endDate: "",
  periode: "",
  ringkasan: { penawaran: 0, pesanan: 0, penjualan: 0 },
  programList: [],
  aktivitasCS: "",
  kendala: "",
});

const isSuperadmin = computed(
  () => store.currentUser?.role?.toUpperCase() === "SUPERADMIN",
);

onMounted(() => {
  if (!isSuperadmin.value && store.currentUser) {
    const userUnits = store.currentUser.aksesUnit || [store.currentUser.unit];
    if (userUnits.length > 0) selectedUnitFilter.value = userUnits[0];
  }
});

const filteredReports = computed(() => {
  return reports.value.filter(
    (rep) =>
      selectedUnitFilter.value === "ALL" ||
      rep.unit === selectedUnitFilter.value,
  );
});

const sortedReports = computed(() => {
  return [...filteredReports.value].sort((a, b) => {
    let modifier = sortAsc.value ? 1 : -1;
    let aVal = a[sortKey.value];
    let bVal = b[sortKey.value];

    if (sortKey.value === "penjualan") {
      aVal = a.ringkasan?.penjualan || 0;
      bVal = b.ringkasan?.penjualan || 0;
    }

    if (aVal < bVal) return -1 * modifier;
    if (aVal > bVal) return 1 * modifier;
    return 0;
  });
});

const sortTable = (key) => {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortKey.value = key;
    sortAsc.value = true;
  }
};

const toggleExpand = (id) => {
  const idx = expandedReportIds.value.indexOf(id);
  if (idx !== -1) {
    expandedReportIds.value.splice(idx, 1);
  } else {
    expandedReportIds.value.push(id);
  }
};

const isAllSelected = computed(() => {
  return (
    filteredReports.value.length > 0 &&
    selectedReportIds.value.length === filteredReports.value.length
  );
});

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedReportIds.value = [];
  } else {
    selectedReportIds.value = filteredReports.value.map((r) => r.id);
  }
};

const clearBulkSelection = () => {
  selectedReportIds.value = [];
};

const autoFetchMetrics = () => {
  if (!form.startDate || !form.endDate) return;

  const leadsList = store.db?.leads || [];
  const revenuesList = store.db?.revenue || store.db?.revenues || [];

  const startStr = form.startDate;
  const endStr = form.endDate;

  let sumPenawaranTotal = 0;
  let sumPesananTotal = 0;
  let sumPenjualanRpTotal = 0;

  leadsList.forEach((item) => {
    const itemDate = item.Tanggal ? String(item.Tanggal).substring(0, 10) : "";
    if (itemDate >= startStr && itemDate <= endStr) {
      sumPenawaranTotal += Number(item.Campaign || item.campaign || 0);
      sumPesananTotal += Number(
        item.Pesanan || item.JumlahPesanan || item.pesanan || 0,
      );
    }
  });

  revenuesList.forEach((item) => {
    const itemDate = item.Tanggal ? String(item.Tanggal).substring(0, 10) : "";
    if (itemDate >= startStr && itemDate <= endStr) {
      sumPenjualanRpTotal += Number(
        item.Revenue || item.Nominal || item.penjualan || item.omset || 0,
      );
      if (sumPesananTotal === 0) {
        sumPesananTotal += Number(item.JumlahPesanan || item.pesanan || 0);
      }
    }
  });

  form.ringkasan = {
    penawaran: sumPenawaranTotal,
    pesanan: sumPesananTotal,
    penjualan: sumPenjualanRpTotal,
  };
};

const getPemasaranRows = (rep) => {
  if (!rep) return [];
  const leadsList = store.db?.leads || [];
  const startStr = rep.startDate;
  const endStr = rep.endDate;

  const unitMap = {};
  leadsList.forEach((item) => {
    const dStr = item.Tanggal ? String(item.Tanggal).substring(0, 10) : "";
    const u = item.Unit || item.unit || "Lainnya";

    if (
      dStr >= startStr &&
      dStr <= endStr &&
      (rep.unit === "ALL" || u === rep.unit)
    ) {
      if (!unitMap[u]) unitMap[u] = { leads: 0, campaign: 0, fu: 0 };
      unitMap[u].leads += Number(item.DatabaseLeads || 0);
      unitMap[u].campaign += Number(item.Campaign || 0);
      unitMap[u].fu += Number(item.FollowUp || 0);
    }
  });

  return Object.keys(unitMap).map((u) => ({
    unit: `CS Deal ${u}`,
    ...unitMap[u],
  }));
};

const getPemasaranTotal = (rep) => {
  const rows = getPemasaranRows(rep);
  return rows.reduce(
    (acc, curr) => ({
      leads: acc.leads + curr.leads,
      campaign: acc.campaign + curr.campaign,
      fu: acc.fu + curr.fu,
    }),
    { leads: 0, campaign: 0, fu: 0 },
  );
};

const getPenjualanRows = (rep) => {
  if (!rep) return [];
  const revenuesList = store.db?.revenue || store.db?.revenues || [];
  const startStr = rep.startDate;
  const endStr = rep.endDate;

  const channelMap = {};
  revenuesList.forEach((item) => {
    const dStr = item.Tanggal ? String(item.Tanggal).substring(0, 10) : "";
    const u = item.Unit || item.unit || "";
    const p = item.Platform || item.platform || "Direct";
    const key = `${p} ${u}`.trim();

    if (
      dStr >= startStr &&
      dStr <= endStr &&
      (rep.unit === "ALL" || u === rep.unit)
    ) {
      if (!channelMap[key]) channelMap[key] = { pesanan: 0, penjualan: 0 };
      channelMap[key].pesanan += Number(
        item.JumlahPesanan || item.pesanan || 0,
      );
      channelMap[key].penjualan += Number(item.Revenue || item.Nominal || 0);
    }
  });

  return Object.keys(channelMap).map((k) => ({
    channel: k,
    ...channelMap[k],
  }));
};

const getPenjualanTotal = (rep) => {
  const rows = getPenjualanRows(rep);
  return rows.reduce(
    (acc, curr) => ({
      pesanan: acc.pesanan + curr.pesanan,
      penjualan: acc.penjualan + curr.penjualan,
    }),
    { pesanan: 0, penjualan: 0 },
  );
};

const duplicateReport = async (rep) => {
  store.isLoading = true;
  if (store.addNotification) {
    store.addNotification("Memproses", "Menduplikasi data laporan...", "info");
  }

  try {
    const dupData = JSON.parse(JSON.stringify(rep));
    dupData.id = Date.now();
    dupData.title = `${dupData.title} (Salinan)`;
    dupData.releaseDate = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const res = await api.saveSpvReportData(dupData);
    if (res.success) {
      if (!store.db.spvReports) store.db.spvReports = [];
      store.db.spvReports.unshift(dupData);
      if (store.addNotification) {
        store.addNotification(
          "Berhasil",
          "Data laporan berhasil diduplikat",
          "success",
        );
      }
    }
  } catch (err) {
    alert("Gagal menduplikat data: " + err.message);
  } finally {
    store.isLoading = false;
  }
};

const confirmDeleteReport = (rep) => {
  store.openAlert(
    "Konfirmasi Hapus",
    `Apakah Anda yakin ingin menghapus laporan "${rep.title}"?`,
    async () => {
      store.isLoading = true;
      if (store.addNotification) {
        store.addNotification(
          "Memproses",
          "Menghapus data laporan dari database...",
          "info",
        );
      }

      try {
        const res = await api.deleteSpvReportData(rep.id);
        if (res.success) {
          if (store.db.spvReports) {
            store.db.spvReports = store.db.spvReports.filter(
              (r) => String(r.id) !== String(rep.id),
            );
          }
          if (store.addNotification) {
            store.addNotification(
              "Dihapus",
              "Laporan berhasil dihapus",
              "warning",
            );
          }
        }
      } catch (err) {
        alert("Gagal menghapus data: " + err.message);
      } finally {
        store.isLoading = false;
      }
    },
    "warning",
  );
};

const confirmBulkDelete = () => {
  store.openAlert(
    "Konfirmasi Bulk Delete",
    `Apakah Anda yakin ingin menghapus ${selectedReportIds.value.length} laporan terpilih secara permanen?`,
    async () => {
      store.isLoading = true;
      if (store.addNotification) {
        store.addNotification(
          "Memproses",
          `Menghapus ${selectedReportIds.value.length} laporan...`,
          "info",
        );
      }

      try {
        for (const id of selectedReportIds.value) {
          await api.deleteSpvReportData(id);
        }
        if (store.db.spvReports) {
          store.db.spvReports = store.db.spvReports.filter(
            (r) => !selectedReportIds.value.includes(r.id),
          );
        }
        selectedReportIds.value = [];
        if (store.addNotification) {
          store.addNotification(
            "Dihapus",
            "Semua laporan terpilih telah dihapus",
            "warning",
          );
        }
      } catch (err) {
        alert("Gagal melakukan bulk delete: " + err.message);
      } finally {
        store.isLoading = false;
      }
    },
    "warning",
  );
};

const handleEditorInput = (editorId) => {
  const el = document.getElementById(editorId);
  if (!el) return;

  if (editorId === "csEditor") form.aktivitasCS = el.innerHTML;
  if (editorId === "kendalaEditor") form.kendala = el.innerHTML;
};

const formatCustomList = (editorId, type) => {
  document.execCommand("insertOrderedList", false, null);
  const el = document.getElementById(editorId);
  if (!el) return;

  const ols = el.querySelectorAll("ol");
  ols.forEach((ol) => {
    ol.style.listStyleType = type;
  });
  handleEditorInput(editorId);
};

const formatText = (editorId, command) => {
  document.execCommand(command, false, null);
  handleEditorInput(editorId);
};

const generateBulkConsolidation = () => {
  const targetReports = reports.value.filter((r) =>
    selectedReportIds.value.includes(r.id),
  );
  if (targetReports.length === 0) return;

  isEdit.value = false;
  activeId.value = null;

  let mergedPrograms = [];
  let mergedCS = [];
  let mergedKendala = [];

  targetReports.forEach((r) => {
    if (r.programList) mergedPrograms.push(...r.programList);
    if (r.aktivitasCS)
      mergedCS.push(`<strong>[${r.unit}]</strong><br/>${r.aktivitasCS}`);
    if (r.kendala)
      mergedKendala.push(`<strong>[${r.unit}]</strong><br/>${r.kendala}`);
  });

  const todayStr = new Date().toISOString().split("T")[0];

  form.unit = "ALL";
  form.startDate = todayStr;
  form.endDate = todayStr;
  form.periode = `KONSOLIDASI ${targetReports.length} LAPORAN PEKANAN`;
  form.title = `LAPORAN KONSOLIDASI DIREKSI (${targetReports.length} PEKAN/UNIT)`;

  form.programList = mergedPrograms;
  form.aktivitasCS = mergedCS.join("<br/><hr class='my-2'/><br/>");
  form.kendala = mergedKendala.join("<br/><hr class='my-2'/><br/>");

  isModalOpen.value = true;
  autoFetchMetrics();

  nextTick(() => {
    if (document.getElementById("csEditor"))
      document.getElementById("csEditor").innerHTML = form.aktivitasCS;
    if (document.getElementById("kendalaEditor"))
      document.getElementById("kendalaEditor").innerHTML = form.kendala;
  });
};

const formatDateIndo = (dStr) => {
  if (!dStr) return "";
  const d = new Date(dStr);
  if (isNaN(d)) return dStr;
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const onPeriodOrUnitChange = () => {
  if (form.startDate && form.endDate) {
    const pStart = formatDateIndo(form.startDate);
    const pEnd = formatDateIndo(form.endDate);
    form.periode = `${pStart} – ${pEnd}`;
    const unitTag =
      form.unit === "ALL" ? "SELURUH UNIT (KONSOLIDASI)" : `UNIT ${form.unit}`;
    form.title = `LAPORAN PEKANAN - ${unitTag} (${form.periode})`;
  }
  autoFetchMetrics();
};

const formatNumber = (val) => new Intl.NumberFormat("id-ID").format(val || 0);

const openAddReportModal = () => {
  isEdit.value = false;
  activeId.value = null;

  const today = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 6);

  form.startDate = lastWeek.toISOString().split("T")[0];
  form.endDate = today.toISOString().split("T")[0];
  form.unit =
    selectedUnitFilter.value !== "ALL" ? selectedUnitFilter.value : "ALL";

  onPeriodOrUnitChange();
  form.aktivitasCS = "";
  form.kendala = "";

  isModalOpen.value = true;
  nextTick(() => {
    if (document.getElementById("csEditor"))
      document.getElementById("csEditor").innerHTML = "";
    if (document.getElementById("kendalaEditor"))
      document.getElementById("kendalaEditor").innerHTML = "";
  });
};

const openEditReport = (rep) => {
  isEdit.value = true;
  activeId.value = rep.id;
  form.unit = rep.unit;
  form.startDate = rep.startDate || new Date().toISOString().split("T")[0];
  form.endDate = rep.endDate || new Date().toISOString().split("T")[0];
  form.title = rep.title;
  form.periode = rep.periode;
  form.ringkasan = { ...rep.ringkasan };
  form.programList = rep.programList || [];
  form.aktivitasCS = rep.aktivitasCS || "";
  form.kendala = rep.kendala || "";

  isModalOpen.value = true;
  nextTick(() => {
    if (document.getElementById("csEditor"))
      document.getElementById("csEditor").innerHTML = form.aktivitasCS;
    if (document.getElementById("kendalaEditor"))
      document.getElementById("kendalaEditor").innerHTML = form.kendala;
  });
};

const saveReport = async () => {
  store.isLoading = true;
  if (store.addNotification) {
    store.addNotification(
      "Memproses",
      "Menerbitkan dokumen laporan pekanan...",
      "info",
    );
  }

  const todayStr = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const payload = {
    id: isEdit.value && activeId.value ? activeId.value : Date.now(),
    ...JSON.parse(JSON.stringify(form)),
    author: store.currentUser?.nama || "Tim Penjualan",
    releaseDate: todayStr,
  };

  try {
    const res = await api.saveSpvReportData(payload);

    if (res.success) {
      if (!store.db.spvReports) store.db.spvReports = [];
      const idx = store.db.spvReports.findIndex(
        (r) => String(r.id) === String(payload.id),
      );
      if (idx !== -1) {
        store.db.spvReports[idx] = payload;
      } else {
        store.db.spvReports.unshift(payload);
      }

      isModalOpen.value = false;
      if (store.addNotification) {
        store.addNotification(
          "Laporan Disimpan",
          "Dokumen Laporan Pekanan berhasil diterbitkan",
          "success",
        );
      }
    } else {
      alert("Gagal menyimpan laporan: " + res.message);
    }
  } catch (err) {
    alert("Terjadi kesalahan: " + err.message);
  } finally {
    store.isLoading = false;
  }
};

const openExportModal = (rep) => {
  printActiveReport.value = null;
  nextTick(() => {
    printActiveReport.value = JSON.parse(JSON.stringify(rep));
    isExportModalOpen.value = true;
  });
};

const executeExportWord = () => {
  if (!printActiveReport.value) return;
  const rep = printActiveReport.value;
  const renderEl = document.getElementById("modal-preview-box");
  const innerHTML = renderEl ? renderEl.innerHTML : "";

  const content = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${rep.title}</title>
      <style>
        body, table, td, th, p, div, span, li {
          font-family: 'Calibri', Arial, sans-serif !important;
          color: #000000 !important;
        }
        body { font-size: 11pt; line-height: 1.3; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 10px; }
        th, td { border: 1px solid #718096; padding: 6px 8px; text-align: left; font-size: 10pt; }
        th { background-color: #f1f5f9; font-weight: bold; }
        ul { list-style-type: disc; padding-left: 24px; margin-top: 4px; margin-bottom: 4px; }
        ol { list-style-type: decimal; padding-left: 24px; margin-top: 4px; margin-bottom: 4px; }
        li { margin-bottom: 2px; }
      </style>
    </head>
    <body>
      ${innerHTML}
    </body>
    </html>
  `;

  const blob = new Blob(["\ufeff" + content], {
    type: "application/msword;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${rep.title}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const executePrintPDF = () => {
  window.print();
};

watch(
  () => store.activeModal,
  (newModal) => {
    if (newModal === "spv-report") {
      openAddReportModal();
      store.closeModal();
    }
  },
  { immediate: true },
);
</script>

<style scoped>
.rich-editor-box {
  min-height: 120px;
  max-height: 360px;
  resize: vertical;
  overflow: auto;
}

.font-calibri {
  font-family: "Calibri", "Segoe UI", sans-serif !important;
}

:deep(.export-override-font),
:deep(.export-override-font *),
.font-calibri,
.font-calibri * {
  font-family: "Calibri", "Segoe UI", sans-serif !important;
}

/* STYLING EDITOR & LIST AGAR TETAP TERJAGA */
:deep(.rich-editor-content ul),
.rich-editor-box :deep(ul) {
  list-style-type: disc !important;
  list-style-position: outside !important;
  padding-left: 1.25rem !important;
  margin-top: 0.25rem !important;
  margin-bottom: 0.25rem !important;
}

:deep(.rich-editor-content ol),
.rich-editor-box :deep(ol) {
  list-style-type: decimal !important;
  list-style-position: outside !important;
  padding-left: 1.25rem !important;
  margin-top: 0.25rem !important;
  margin-bottom: 0.25rem !important;
}

:deep(.rich-editor-content ol[style*="upper-alpha"]),
.rich-editor-box :deep(ol[style*="upper-alpha"]) {
  list-style-type: upper-alpha !important;
}

:deep(.rich-editor-content ol[style*="lower-alpha"]),
.rich-editor-box :deep(ol[style*="lower-alpha"]) {
  list-style-type: lower-alpha !important;
}

:deep(.rich-editor-content li),
.rich-editor-box :deep(li) {
  display: list-item !important;
  margin-bottom: 0.2rem !important;
}

.print-only {
  display: none;
}

/* FIX STYLING PRINT UTAMA */
@media print {
  body * {
    visibility: hidden !important;
  }
  .no-print {
    display: none !important;
  }

  #document-render-template,
  #document-render-template * {
    visibility: visible !important;
    font-family: "Calibri", "Segoe UI", sans-serif !important;
  }

  #document-render-template {
    display: block !important;
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 20px !important;
    background: white !important;
    color: black !important;
  }

  #document-render-template table {
    display: table !important;
    width: 100% !important;
    border-collapse: collapse !important;
  }
  #document-render-template tr {
    display: table-row !important;
  }
  #document-render-template th,
  #document-render-template td {
    display: table-cell !important;
  }
  #document-render-template ul {
    display: block !important;
    list-style-type: disc !important;
    list-style-position: outside !important;
    padding-left: 1.25rem !important;
  }
  #document-render-template ol {
    display: block !important;
    list-style-type: decimal !important;
    list-style-position: outside !important;
    padding-left: 1.25rem !important;
  }
  #document-render-template li {
    display: list-item !important;
    margin-bottom: 0.2rem !important;
  }
}
</style>
