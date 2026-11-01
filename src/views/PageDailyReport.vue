<!-- src/views/PageDailyReport.vue -->
<template>
  <div class="ui-page flex flex-col gap-3 pb-20 md:pb-6">
    <!-- Header -->
    <div class="ui-card flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="ui-title">
          <i class="fa-solid fa-file-invoice ui-text-success"></i>
          Laporan Harian (Daily Report)
        </h2>
        <p class="ui-description">Sistem pelaporan kinerja dinamis terintegrasi Master Data.</p>
      </div>

      <div class="ui-tabs">
        <button
          type="button"
          class="ui-tab"
          :class="{ 'is-active': activeTab === 'input' }"
          @click="activeTab = 'input'"
        >
          <i class="fa-solid fa-pen-to-square"></i>
          Input Laporan
        </button>

        <button
          type="button"
          class="ui-tab"
          :class="{ 'is-active': activeTab === 'rekap' }"
          @click="activeTab = 'rekap'"
        >
          <i class="fa-solid fa-table-list"></i>
          Rekap Data
        </button>

        <button
          v-if="isSuperadmin"
          type="button"
          class="ui-tab"
          :class="{ 'is-active': activeTab === 'builder' }"
          @click="activeTab = 'builder'"
        >
          <i class="fa-solid fa-sliders"></i>
          Builder
        </button>
      </div>
    </div>

    <div v-if="isLoadingData" class="ui-loading">
      <i class="fa-solid fa-circle-notch fa-spin ui-text-success"></i>
      <p>Menyinkronkan data...</p>
    </div>

    <template v-else>
      <!-- Input laporan -->
      <div v-if="activeTab === 'input'" class="max-w-4xl w-full mx-auto">
        <div class="ui-card ui-card-roomy">
          <form class="flex flex-col gap-4" @submit.prevent="submitDailyReport">
            <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div class="min-w-0">
                <label for="report-template" class="ui-label"> Jenis Laporan Pekerjaan </label>
                <select
                  id="report-template"
                  v-model="selectedTemplateId"
                  required
                  class="ui-input ui-input-strong"
                  @change="onTemplateChange"
                >
                  <option value="" disabled>-- Pilih Laporan --</option>
                  <option v-for="tpl in reportTemplates" :key="tpl.id" :value="tpl.id">
                    {{ tpl.title }}
                  </option>
                </select>
              </div>

              <div class="min-w-0">
                <label for="report-date" class="ui-label"> Tanggal Laporan </label>
                <input
                  id="report-date"
                  v-model="formHeader.tanggal"
                  type="date"
                  required
                  class="ui-input ui-input-strong"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div class="min-w-0">
                <label for="report-name" class="ui-label ui-label-muted"> Nama Staf </label>
                <input
                  id="report-name"
                  v-model="formHeader.nama"
                  type="text"
                  readonly
                  class="ui-input ui-input-strong"
                />
              </div>

              <div class="min-w-0">
                <label for="report-unit" class="ui-label ui-label-muted"> Unit Usaha </label>
                <input
                  id="report-unit"
                  v-model="formHeader.unit"
                  type="text"
                  readonly
                  class="ui-input ui-input-strong"
                />
              </div>

              <div class="min-w-0">
                <label for="report-division" class="ui-label ui-label-muted"> Divisi </label>
                <input
                  id="report-division"
                  v-model="formHeader.divisi"
                  type="text"
                  readonly
                  class="ui-input ui-input-strong"
                />
              </div>
            </div>

            <div v-if="activeTemplate" class="ui-subsection flex flex-col gap-3 pt-3">
              <h4 class="ui-title">
                <i class="fa-solid fa-list-check ui-text-info"></i>
                Rincian Indikator Laporan
              </h4>

              <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div
                  v-for="field in activeTemplate.fields"
                  :key="field.id"
                  class="min-w-0"
                  :class="{
                    'col-span-full': field.type === 'textarea' || field.type === 'checkbox',
                  }"
                >
                  <label class="ui-label">
                    {{ field.label }}
                    <span v-if="field.required" class="ui-required">*</span>
                  </label>

                  <input
                    v-if="field.type === 'number'"
                    v-model.number="formResponses[field.id]"
                    type="number"
                    min="0"
                    :required="field.required"
                    class="ui-input"
                  />

                  <input
                    v-else-if="field.type === 'text'"
                    v-model="formResponses[field.id]"
                    type="text"
                    :required="field.required"
                    class="ui-input"
                  />

                  <textarea
                    v-else-if="field.type === 'textarea'"
                    v-model="formResponses[field.id]"
                    rows="3"
                    :required="field.required"
                    class="ui-input"
                  ></textarea>

                  <select
                    v-else-if="field.type === 'select'"
                    v-model="formResponses[field.id]"
                    :required="field.required"
                    class="ui-input"
                  >
                    <option value="" disabled>-- Pilih --</option>
                    <option v-for="opt in field.options" :key="opt" :value="opt">
                      {{ opt }}
                    </option>
                  </select>

                  <div v-else-if="field.type === 'checkbox'" class="ui-checkbox-group">
                    <label v-for="opt in field.options" :key="opt" class="ui-checkbox-label">
                      <input
                        v-model="formResponses[field.id]"
                        type="checkbox"
                        :value="opt"
                        class="ui-checkbox"
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
              class="ui-button ui-button-primary ui-button-block ui-button-shadow"
              :disabled="isSubmitting || !activeTemplate"
            >
              <i v-if="isSubmitting" class="fa-solid fa-spinner fa-spin"></i>
              {{ isSubmitting ? "Menyimpan..." : "Kirim Laporan Pekerjaan" }}
            </button>
          </form>
        </div>
      </div>

      <!-- Rekap -->
      <div v-if="activeTab === 'rekap'" class="flex flex-col gap-4">
        <div class="ui-card flex flex-col lg:flex-row gap-3 items-center">
          <div class="grid grid-cols-2 gap-2 w-full md:grid-cols-4 lg:flex-1">
            <div class="min-w-0 col-span-full md:col-auto">
              <label for="filter-template" class="ui-label ui-label-muted"> Jenis Laporan </label>
              <select
                id="filter-template"
                v-model="filter.templateId"
                class="ui-input ui-input-sm ui-input-strong"
              >
                <option value="ALL">Semua Laporan</option>
                <option v-for="tpl in reportTemplates" :key="tpl.id" :value="tpl.id">
                  {{ tpl.title }}
                </option>
              </select>
            </div>

            <div class="min-w-0">
              <label for="filter-start" class="ui-label ui-label-muted"> Dari Tanggal </label>
              <input
                id="filter-start"
                v-model="filter.startDate"
                type="date"
                class="ui-input ui-input-sm ui-input-strong"
              />
            </div>

            <div class="min-w-0">
              <label for="filter-end" class="ui-label ui-label-muted"> Sampai Tanggal </label>
              <input
                id="filter-end"
                v-model="filter.endDate"
                type="date"
                class="ui-input ui-input-sm ui-input-strong"
              />
            </div>

            <div class="min-w-0">
              <label for="filter-search" class="ui-label ui-label-muted"> Filter Detail </label>
              <input
                id="filter-search"
                v-model="filter.search"
                type="text"
                placeholder="Cari..."
                class="ui-input ui-input-sm"
              />
            </div>
          </div>

          <div
            v-if="isManagerial"
            class="ui-filter-actions flex flex-wrap gap-2 w-full pt-3 lg:w-auto lg:pt-0 lg:pl-3"
          >
            <button type="button" class="ui-button ui-button-success" @click="exportToExcel">
              <i class="fa-solid fa-file-excel"></i>
              Export Excel
            </button>

            <label class="ui-button ui-button-info">
              <i class="fa-solid fa-file-import"></i>
              Import Excel
              <input type="file" accept=".xlsx, .xls" class="hidden" @change="importExcel" />
            </label>
          </div>
        </div>

        <!-- Aksi massal -->
        <div
          v-if="selectedItems.length > 0 && isSuperadmin"
          class="ui-card ui-card-compact flex items-center justify-between gap-3 min-w-0 animate-fade-in"
        >
          <div class="flex items-center gap-2 min-w-0">
            <span class="ui-badge ui-badge-info">
              {{ selectedItems.length }}
            </span>
            <span class="ui-subtitle">Data Terpilih</span>
          </div>

          <div class="ui-actions flex flex-wrap items-center gap-2">
            <button
              type="button"
              class="ui-button ui-button-glass ui-button-sm"
              @click="openBulkEditModal"
            >
              <i class="fa-solid fa-pen-to-square"></i>
              Edit Massal
            </button>

            <button
              type="button"
              class="ui-button ui-button-danger-solid ui-button-sm"
              @click="executeBulkDelete"
            >
              <i class="fa-solid fa-trash-can"></i>
              Hapus Massal
            </button>
          </div>
        </div>

        <!-- Tabel -->
        <div class="ui-table-container">
          <div class="ui-table-scroll custom-scrollbar">
            <table class="ui-table ui-table-sticky ui-table-hover ui-table-nowrap">
              <thead>
                <tr>
                  <th v-if="isSuperadmin" class="ui-table-cell-center">
                    <input
                      v-model="isAllSelected"
                      type="checkbox"
                      class="ui-checkbox"
                      aria-label="Pilih semua laporan"
                    />
                  </th>

                  <th class="sortable-header" @click="setSort('tanggal')">
                    Tanggal
                    <i class="fa-solid" :class="getSortIcon('tanggal')"></i>
                  </th>

                  <th class="sortable-header" @click="setSort('nama')">
                    Karyawan
                    <i class="fa-solid" :class="getSortIcon('nama')"></i>
                  </th>

                  <template v-if="filter.templateId !== 'ALL' && activeRekapTemplate">
                    <th v-for="field in activeRekapTemplate.fields" :key="field.id">
                      {{ field.label }}
                    </th>
                  </template>

                  <template v-else>
                    <th>Jenis Laporan</th>
                    <th>Cuplikan Isian</th>
                  </template>

                  <th v-if="isSuperadmin" class="ui-table-cell-right">Aksi</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="item in sortedReports"
                  :key="item.id"
                  data-clickable
                  :class="{ 'is-selected': selectedItems.includes(item.id) }"
                  title="Klik untuk melihat / mengedit detail laporan"
                  @click="openEditReportModal(item)"
                >
                  <td v-if="isSuperadmin" class="ui-table-cell-center" @click.stop>
                    <input
                      v-model="selectedItems"
                      type="checkbox"
                      :value="item.id"
                      class="ui-checkbox"
                      :aria-label="`Pilih laporan ${item.nama}`"
                    />
                  </td>

                  <td class="ui-text-strong">
                    {{ formatTanggal(item.tanggal) }}
                  </td>

                  <td>
                    <div class="ui-text-strong">{{ item.nama }}</div>
                    <div class="flex items-center gap-2 min-w-0">
                      <span class="ui-badge ui-badge-info">
                        {{ item.unit || "UMUM" }}
                      </span>
                      <span class="ui-caption">{{ item.divisi || "-" }}</span>
                    </div>
                  </td>

                  <template v-if="filter.templateId !== 'ALL' && activeRekapTemplate">
                    <td v-for="field in activeRekapTemplate.fields" :key="field.id">
                      <div
                        class="ui-truncate max-w-[200px]"
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
                    <td>
                      <span class="ui-badge">{{ item.jenisLaporan }}</span>
                    </td>
                    <td>
                      <div
                        class="ui-table-summary max-w-[28rem] overflow-hidden text-ellipsis whitespace-nowrap"
                        :title="getSummary(item.responses)"
                      >
                        {{ getSummary(item.responses) }}
                      </div>
                    </td>
                  </template>

                  <td v-if="isSuperadmin" class="ui-table-cell-right" @click.stop>
                    <button
                      type="button"
                      class="ui-button ui-button-danger ui-button-sm ui-button-icon"
                      title="Hapus Data"
                      @click="deleteReport(item.id)"
                    >
                      <i class="fa-solid fa-trash-can"></i>
                    </button>
                  </td>
                </tr>

                <tr v-if="sortedReports.length === 0" class="table-empty">
                  <td
                    :colspan="
                      2 +
                      (filter.templateId !== 'ALL' && activeRekapTemplate
                        ? activeRekapTemplate.fields.length
                        : 2) +
                      (isSuperadmin ? 2 : 0)
                    "
                  >
                    <div class="ui-empty">Tidak ada data laporan yang sesuai filter.</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Builder -->
      <div v-if="activeTab === 'builder' && isSuperadmin" class="max-w-5xl w-full mx-auto">
        <div class="ui-card flex flex-col gap-4">
          <div class="flex items-center justify-between gap-3 min-w-0">
            <h3 class="ui-title">
              <i class="fa-solid fa-list-ul ui-text-info"></i>
              Daftar Template Laporan
            </h3>

            <button
              type="button"
              class="ui-button ui-button-primary"
              @click="openBuilderModal(null)"
            >
              <i class="fa-solid fa-plus"></i>
              <span class="hidden sm:inline">Buat Baru</span>
            </button>
          </div>

          <div class="flex flex-col gap-2">
            <div
              v-for="tpl in reportTemplates"
              :key="tpl.id"
              class="ui-list-item flex-col sm:flex-row"
            >
              <div class="flex items-center gap-2 min-w-0 flex-1">
                <span class="ui-icon ui-icon-info">
                  <i class="fa-solid fa-file-lines"></i>
                </span>
                <div class="flex-1 min-w-0">
                  <h4 class="ui-text-strong">{{ tpl.title }}</h4>
                  <p class="ui-caption">{{ tpl.fields?.length || 0 }} Indikator Pertanyaan</p>
                </div>
              </div>

              <div class="ui-actions flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  class="ui-button ui-button-primary"
                  @click="openBuilderModal(tpl)"
                >
                  Edit Struktur
                </button>

                <button
                  type="button"
                  class="ui-button ui-button-danger ui-button-icon"
                  title="Hapus template"
                  @click="deleteTemplate(tpl.id)"
                >
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Modal detail laporan -->
    <Teleport to="body">
      <div
        v-if="isSingleEditModalOpen"
        class="ui-modal-overlay ui-modal-overlay-high"
        @click.self="isSingleEditModalOpen = false"
      >
        <div
          class="ui-modal animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-detail-title"
        >
          <div class="ui-modal-header ui-modal-header-filled">
            <div class="flex flex-col gap-1">
              <span class="ui-badge ui-badge-success">
                {{ editReportForm.jenisLaporan }}
              </span>
              <h3 id="report-detail-title" class="ui-title">Detail & Edit Laporan Pekerjaan</h3>
            </div>

            <button
              type="button"
              class="ui-close"
              aria-label="Tutup detail laporan"
              @click="isSingleEditModalOpen = false"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <form
            class="ui-modal-body ui-modal-body-form custom-scrollbar"
            @submit.prevent="saveSingleReport"
          >
            <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div class="min-w-0">
                <label class="ui-label">Nama Karyawan</label>
                <input
                  v-model="editReportForm.nama"
                  type="text"
                  disabled
                  class="ui-input ui-input-strong"
                />
              </div>

              <div class="min-w-0">
                <label class="ui-label">Tanggal Laporan</label>
                <input
                  v-model="editReportForm.tanggal"
                  type="date"
                  required
                  class="ui-input ui-input-strong"
                />
              </div>

              <div class="min-w-0">
                <label class="ui-label">Unit Usaha</label>
                <select v-model="editReportForm.unit" class="ui-input ui-input-strong">
                  <option v-for="u in masterUnits" :key="u.code" :value="u.code">
                    {{ u.code }} - {{ u.name }}
                  </option>
                </select>
              </div>

              <div class="min-w-0">
                <label class="ui-label">Divisi</label>
                <input
                  v-model="editReportForm.divisi"
                  type="text"
                  class="ui-input ui-input-strong"
                  placeholder="Nama Divisi..."
                />
              </div>
            </div>

            <div v-if="editingTemplate" class="ui-subsection flex flex-col gap-3 pt-3">
              <h4 class="ui-title">
                <i class="fa-solid fa-list-check ui-text-info"></i>
                Isian Indikator Laporan
              </h4>

              <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div
                  v-for="field in editingTemplate.fields"
                  :key="field.id"
                  class="min-w-0"
                  :class="{
                    'col-span-full': field.type === 'textarea' || field.type === 'checkbox',
                  }"
                >
                  <label class="ui-label">
                    {{ field.label }}
                    <span v-if="field.required" class="ui-required">*</span>
                  </label>

                  <input
                    v-if="field.type === 'number'"
                    v-model.number="editReportForm.responses[field.id]"
                    type="number"
                    min="0"
                    :required="field.required"
                    class="ui-input"
                  />

                  <input
                    v-else-if="field.type === 'text'"
                    v-model="editReportForm.responses[field.id]"
                    type="text"
                    :required="field.required"
                    class="ui-input"
                  />

                  <textarea
                    v-else-if="field.type === 'textarea'"
                    v-model="editReportForm.responses[field.id]"
                    rows="3"
                    :required="field.required"
                    class="ui-input"
                  ></textarea>

                  <select
                    v-else-if="field.type === 'select'"
                    v-model="editReportForm.responses[field.id]"
                    :required="field.required"
                    class="ui-input"
                  >
                    <option value="" disabled>-- Pilih --</option>
                    <option v-for="opt in field.options" :key="opt" :value="opt">
                      {{ opt }}
                    </option>
                  </select>

                  <div v-else-if="field.type === 'checkbox'" class="ui-checkbox-group">
                    <label v-for="opt in field.options" :key="opt" class="ui-checkbox-label">
                      <input
                        v-model="editReportForm.responses[field.id]"
                        type="checkbox"
                        :value="opt"
                        class="ui-checkbox"
                      />
                      {{ opt }}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="ui-modal-footer">
              <button
                v-if="isSuperadmin"
                type="button"
                class="ui-link ui-link-danger mr-auto"
                @click="
                  deleteReport(editReportForm.id);
                  isSingleEditModalOpen = false;
                "
              >
                <i class="fa-solid fa-trash-can"></i>
                Hapus Laporan
              </button>

              <button
                type="button"
                class="ui-button ui-button-glass"
                @click="isSingleEditModalOpen = false"
              >
                Batal
              </button>

              <button
                type="submit"
                class="ui-button ui-button-primary ui-button-shadow"
                :disabled="isSavingSingleReport"
              >
                <i v-if="isSavingSingleReport" class="fa-solid fa-circle-notch fa-spin"></i>
                {{ isSavingSingleReport ? "Menyimpan..." : "Simpan Perubahan" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal builder -->
    <Teleport to="body">
      <div v-if="isBuilderModalOpen" class="ui-modal-overlay ui-modal-overlay-high">
        <div
          class="ui-modal ui-modal-report"
          role="dialog"
          aria-modal="true"
          aria-labelledby="builder-modal-title"
        >
          <div class="ui-modal-header ui-modal-header-filled">
            <h3 id="builder-modal-title" class="ui-title">
              {{ builderTemplate.id ? "Edit Template Form" : "Buat Template Form Baru" }}
            </h3>

            <button
              type="button"
              class="ui-close"
              aria-label="Tutup builder"
              @click="isBuilderModalOpen = false"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="ui-modal-body flex flex-col gap-4 custom-scrollbar">
            <div class="min-w-0">
              <label class="ui-label">Nama / Judul Template:</label>
              <input
                v-model="builderTemplate.title"
                type="text"
                class="ui-input ui-input-sm"
                placeholder="Contoh: Laporan Harian Tim CS"
              />
            </div>

            <div class="flex flex-col gap-2">
              <div class="flex items-center justify-between gap-3 min-w-0">
                <h4 class="ui-title">
                  <i class="fa-solid fa-layer-group ui-text-success"></i>
                  Susunan Pertanyaan
                </h4>

                <button
                  type="button"
                  class="ui-button ui-button-success ui-button-sm"
                  @click="addBuilderField"
                >
                  <i class="fa-solid fa-plus"></i>
                  Tambah Field
                </button>
              </div>

              <div
                v-for="(field, idx) in builderTemplate.fields"
                :key="idx"
                class="flex flex-col gap-2"
              >
                <div class="ui-builder-grid grid grid-cols-1 gap-2">
                  <div class="min-w-0">
                    <label class="ui-label">Label Pertanyaan</label>
                    <input
                      v-model="field.label"
                      class="ui-input ui-input-sm"
                      placeholder="Misal: Jumlah Penawaran"
                    />
                  </div>

                  <div class="min-w-0">
                    <label class="ui-label">Tipe Jawaban</label>
                    <select v-model="field.type" class="ui-input ui-input-sm">
                      <option value="number">Angka (Number)</option>
                      <option value="text">Teks Singkat</option>
                      <option value="textarea">Teks Paragraf</option>
                      <option value="select">Pilihan Dropdown</option>
                      <option value="checkbox">Pilihan Ganda (Checkbox)</option>
                    </select>
                  </div>

                  <div class="flex items-center justify-between gap-3 min-w-0">
                    <label class="ui-checkbox-label">
                      <input v-model="field.required" type="checkbox" class="ui-checkbox" />
                      Wajib
                    </label>

                    <div class="ui-actions flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        class="ui-button ui-button-glass ui-button-sm ui-button-icon"
                        :disabled="idx === 0"
                        title="Naik"
                        @click="moveField(idx, -1)"
                      >
                        <i class="fa-solid fa-arrow-up"></i>
                      </button>

                      <button
                        type="button"
                        class="ui-button ui-button-glass ui-button-sm ui-button-icon"
                        :disabled="idx === builderTemplate.fields.length - 1"
                        title="Turun"
                        @click="moveField(idx, 1)"
                      >
                        <i class="fa-solid fa-arrow-down"></i>
                      </button>

                      <button
                        type="button"
                        class="ui-button ui-button-danger ui-button-sm ui-button-icon"
                        title="Hapus"
                        @click="builderTemplate.fields.splice(idx, 1)"
                      >
                        <i class="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  v-if="field.type === 'select' || field.type === 'checkbox'"
                  class="ui-builder-options p-2"
                >
                  <label class="ui-label">
                    <i class="fa-solid fa-list-ul ui-text-info"></i>
                    Opsi Pilihan (Pisahkan dengan Koma)
                  </label>

                  <input
                    :value="field.options ? field.options.join(', ') : ''"
                    class="ui-input ui-input-sm"
                    placeholder="A, B, C"
                    @input="(e) => (field.options = e.target.value.split(',').map((s) => s.trim()))"
                  />
                </div>
              </div>

              <div v-if="builderTemplate.fields.length === 0" class="ui-empty">
                Belum ada pertanyaan/field ditambahkan.
              </div>
            </div>
          </div>

          <div class="ui-modal-footer">
            <button
              type="button"
              class="ui-button ui-button-secondary"
              @click="isBuilderModalOpen = false"
            >
              Batal
            </button>

            <button type="button" class="ui-button ui-button-primary" @click="saveBuilderTemplate">
              Simpan
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal edit massal -->
    <Teleport to="body">
      <div v-if="isBulkEditModalOpen" class="ui-modal-overlay ui-modal-overlay-high">
        <div
          class="ui-modal ui-modal-sm ui-modal-report animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="bulk-edit-title"
        >
          <div class="ui-modal-header ui-modal-header-filled">
            <div>
              <h3 id="bulk-edit-title" class="ui-title">
                Edit Massal {{ selectedItems.length }} Data
              </h3>
              <p class="ui-description">Centang field yang ingin diubah/ditimpa secara massal.</p>
            </div>

            <button
              type="button"
              class="ui-close"
              aria-label="Tutup edit massal"
              @click="isBulkEditModalOpen = false"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="ui-modal-body flex flex-col gap-4 custom-scrollbar">
            <h4 class="ui-subtitle">Identitas Laporan Umum</h4>

            <div class="flex items-center gap-2 min-w-0">
              <input
                v-model="bulkEditToggles.tanggal"
                type="checkbox"
                class="ui-checkbox"
                aria-label="Aktifkan perubahan tanggal"
              />
              <div class="min-w-0 flex-1">
                <label class="ui-label">Timpa Tanggal Baru</label>
                <input
                  v-model="bulkEditForm.tanggal"
                  type="date"
                  class="ui-input ui-input-sm ui-input-strong"
                  :disabled="!bulkEditToggles.tanggal"
                />
              </div>
            </div>

            <div class="flex items-center gap-2 min-w-0">
              <input
                v-model="bulkEditToggles.unit"
                type="checkbox"
                class="ui-checkbox"
                aria-label="Aktifkan perubahan unit"
              />
              <div class="min-w-0 flex-1">
                <label class="ui-label">Timpa Unit Usaha Baru</label>
                <select
                  v-model="bulkEditForm.unit"
                  class="ui-input ui-input-sm ui-input-strong"
                  :disabled="!bulkEditToggles.unit"
                >
                  <option value="">-- Kosongkan --</option>
                  <option v-for="u in masterUnits" :key="u.code" :value="u.code">
                    {{ u.code }}
                  </option>
                </select>
              </div>
            </div>

            <div class="flex items-center gap-2 min-w-0">
              <input
                v-model="bulkEditToggles.divisi"
                type="checkbox"
                class="ui-checkbox"
                aria-label="Aktifkan perubahan divisi"
              />
              <div class="min-w-0 flex-1">
                <label class="ui-label">Timpa Divisi Baru</label>
                <input
                  v-model="bulkEditForm.divisi"
                  type="text"
                  class="ui-input ui-input-sm ui-input-strong"
                  :disabled="!bulkEditToggles.divisi"
                  placeholder="Ketik nama divisi baru..."
                />
              </div>
            </div>

            <div
              v-if="filter.templateId !== 'ALL' && activeRekapTemplate"
              class="ui-subsection flex flex-col gap-3 pt-3"
            >
              <h4 class="ui-subtitle ui-text-info">
                Timpa Nilai Indikator ({{ activeRekapTemplate.title }})
              </h4>

              <div
                v-for="field in activeRekapTemplate.fields"
                :key="field.id"
                class="flex items-center gap-2 min-w-0"
              >
                <input
                  v-model="bulkEditToggles.responses[field.id]"
                  type="checkbox"
                  class="ui-checkbox"
                  :aria-label="`Aktifkan perubahan ${field.label}`"
                />

                <div class="min-w-0 flex-1">
                  <label class="ui-label">Ubah: {{ field.label }}</label>

                  <input
                    v-if="field.type === 'number'"
                    v-model.number="bulkEditForm.responses[field.id]"
                    type="number"
                    class="ui-input ui-input-sm ui-input-strong"
                    :disabled="!bulkEditToggles.responses[field.id]"
                  />

                  <input
                    v-else-if="field.type === 'text'"
                    v-model="bulkEditForm.responses[field.id]"
                    type="text"
                    class="ui-input ui-input-sm ui-input-strong"
                    :disabled="!bulkEditToggles.responses[field.id]"
                  />

                  <textarea
                    v-else-if="field.type === 'textarea'"
                    v-model="bulkEditForm.responses[field.id]"
                    rows="2"
                    class="ui-input ui-input-sm ui-input-strong"
                    :disabled="!bulkEditToggles.responses[field.id]"
                  ></textarea>

                  <select
                    v-else-if="field.type === 'select'"
                    v-model="bulkEditForm.responses[field.id]"
                    class="ui-input ui-input-sm ui-input-strong"
                    :disabled="!bulkEditToggles.responses[field.id]"
                  >
                    <option v-for="opt in field.options" :key="opt" :value="opt">
                      {{ opt }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="ui-modal-footer ui-modal-footer-filled">
            <button
              type="button"
              class="ui-button ui-button-glass"
              @click="isBulkEditModalOpen = false"
            >
              Batal
            </button>

            <button type="button" class="ui-button ui-button-primary" @click="executeBulkEdit">
              <i class="fa-solid fa-floppy-disk"></i>
              Terapkan Edit Massal
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

const activeTab = ref("input");
const isSubmitting = ref(false);
const isLoadingData = ref(false);
const isBuilderModalOpen = ref(false);

const currentUser = computed(() => store.currentUser || {});
const role = computed(() =>
  String(currentUser.value.role || currentUser.value.Role || "").toUpperCase(),
);
const isManagerial = computed(() =>
  ["SUPERADMIN", "ADMIN_UNIT", "ADMIN", "SPV"].includes(role.value),
);
const isSuperadmin = computed(() => role.value === "SUPERADMIN");

const masterUnits = computed(() => store.db?.master?.unitList || []);
const reportTemplates = ref([]);
const reportsList = ref([]);

const selectedTemplateId = ref("");
const formHeader = reactive({ tanggal: "", nama: "", unit: "", divisi: "" });
const formResponses = reactive({});

const activeTemplate = computed(() =>
  reportTemplates.value.find((t) => t.id === selectedTemplateId.value),
);

// STATE BARU: EDIT LAPORAN SINGLE (MODAL DETAIL)
const isSingleEditModalOpen = ref(false);
const isSavingSingleReport = ref(false);
const editReportForm = reactive({
  id: "",
  templateId: "",
  jenisLaporan: "",
  tanggal: "",
  nama: "",
  unit: "",
  divisi: "",
  responses: {},
});

const editingTemplate = computed(() =>
  reportTemplates.value.find((t) => t.id === editReportForm.templateId),
);

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
const builderTemplate = reactive({ id: "", title: "", fields: [] });

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
    selectedItems.value = val ? sortedReports.value.map((item) => item.id) : [];
  },
});

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
    onTemplateChange();

    const snapRep = await getDocs(
      query(
        collection(firestoreDb, "daily_reports"),
        orderBy("timestamp", "desc"),
      ),
    );
    reportsList.value = snapRep.docs.map((d) => ({ ...d.data(), id: d.id }));
  } catch (err) {
    console.error("Gagal memuat data:", err);
  } finally {
    isLoadingData.value = false;
  }
});

const onTemplateChange = () => {
  Object.keys(formResponses).forEach((key) => delete formResponses[key]);
  if (activeTemplate.value) {
    activeTemplate.value.fields.forEach((f) => {
      formResponses[f.id] = f.type === "checkbox" ? [] : "";
    });
  }
};

watch(
  () => activeTemplate.value,
  (newTemplate) => {
    if (newTemplate) {
      newTemplate.fields.forEach((f) => {
        if (f.type === "checkbox" && !Array.isArray(formResponses[f.id]))
          formResponses[f.id] = [];
      });
    }
  },
  { deep: true, immediate: true },
);

// FUNGSI UNTUK MEMBUKA MODAL EDIT SINGLE LAPORAN
const openEditReportModal = (item) => {
  const currentUserName =
    currentUser.value.nama || currentUser.value.Nama || "User";

  // Cek Hak Akses
  if (!isManagerial.value && item.nama !== currentUserName) {
    store.addNotification(
      "Akses Ditolak",
      "Anda hanya dapat melihat dan mengedit laporan Anda sendiri.",
      "warning",
    );
    return;
  }

  // Cari template asal laporan
  const tpl = reportTemplates.value.find((t) => t.id === item.templateId);

  // Inisialisasi ulang object responses secara terstruktur berdasarkan template
  let responsesCopy = {};

  if (tpl && tpl.fields) {
    tpl.fields.forEach((f) => {
      const existingVal = item.responses?.[f.id];

      if (f.type === "checkbox") {
        if (Array.isArray(existingVal)) {
          responsesCopy[f.id] = [...existingVal];
        } else if (existingVal) {
          responsesCopy[f.id] = [existingVal];
        } else {
          responsesCopy[f.id] = [];
        }
      } else {
        responsesCopy[f.id] =
          existingVal !== undefined && existingVal !== null ? existingVal : "";
      }
    });
  } else if (item.responses) {
    responsesCopy = JSON.parse(JSON.stringify(item.responses));
  }

  Object.assign(editReportForm, {
    id: item.id,
    templateId: item.templateId,
    jenisLaporan: item.jenisLaporan || tpl?.title || "Laporan",
    tanggal: item.tanggal || todayDay,
    nama: item.nama || "",
    unit: item.unit || "NHP",
    divisi: item.divisi || "",
    responses: responsesCopy,
  });

  isSingleEditModalOpen.value = true;
};

// FUNGSI SIMPAN PERUBAHAN SINGLE LAPORAN
const saveSingleReport = async () => {
  isSavingSingleReport.value = true;
  try {
    const payload = {
      ...editReportForm,
      responses: { ...editReportForm.responses },
    };

    const res = await api.updateData("daily_reports", payload.id, payload);
    if (res && res.success) {
      const idx = reportsList.value.findIndex((r) => r.id === payload.id);
      if (idx !== -1) {
        reportsList.value[idx] = { ...reportsList.value[idx], ...payload };
      }

      store.addNotification(
        "Berhasil",
        "Laporan pekerjaan berhasil diperbarui!",
        "success",
      );
      isSingleEditModalOpen.value = false;
    } else {
      store.openAlert(
        "Gagal",
        res?.message || "Gagal memperbarui",
        null,
        "warning",
      );
    }
  } catch (err) {
    store.openAlert("Error", err.message, null, "warning");
  } finally {
    isSavingSingleReport.value = false;
  }
};

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
      onTemplateChange();
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
        }
      } catch (err) {
        store.openAlert("Error", err.message, null, "warning");
      }
    },
    "warning",
  );
};

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
    const currentUserName =
      currentUser.value.nama || currentUser.value.Nama || "User";
    if (!isManagerial.value && item.nama !== currentUserName) return false;
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
        (item.unit || "").toLowerCase().includes(s);
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
    let res = isEdit
      ? await api.updateData("report_templates", payload.id, payload)
      : (delete payload.id, await api.saveData("report_templates", payload));
    if (!isEdit && res?.id) payload.id = res.id;

    if (res && res.success) {
      if (isEdit) {
        const idx = reportTemplates.value.findIndex((t) => t.id === payload.id);
        if (idx !== -1) reportTemplates.value[idx] = payload;
      } else {
        reportTemplates.value.push(payload);
      }
      isBuilderModalOpen.value = false;
      store.addNotification("Berhasil", "Template disimpan", "success");
    }
  } catch (err) {
    store.openAlert("Error", err.message, null, "warning");
  }
};

const deleteTemplate = (id) => {
  store.openAlert(
    "Hapus Template",
    "Lanjutkan hapus template?",
    async () => {
      const res = await api.deleteData("report_templates", id);
      if (res && res.success) {
        reportTemplates.value = reportTemplates.value.filter(
          (t) => t.id !== id,
        );
        store.addNotification("Berhasil", "Template dihapus", "success");
      }
    },
    "warning",
  );
};

const executeBulkDelete = () => {
  store.openAlert(
    "Hapus Masal",
    `Hapus ${selectedItems.value.length} data terpilih?`,
    async () => {
      for (const id of selectedItems.value) {
        await api.deleteData("daily_reports", id);
      }
      reportsList.value = reportsList.value.filter(
        (r) => !selectedItems.value.includes(r.id),
      );
      selectedItems.value = [];
      store.addNotification("Berhasil", "Data massal dihapus", "success");
    },
    "warning",
  );
};

const openBulkEditModal = () => {
  bulkEditToggles.tanggal = false;
  bulkEditToggles.unit = false;
  bulkEditToggles.divisi = false;
  isBulkEditModalOpen.value = true;
};

const executeBulkEdit = async () => {
  let count = 0;
  for (const id of selectedItems.value) {
    const idx = reportsList.value.findIndex((r) => r.id === id);
    if (idx > -1) {
      let data = { ...reportsList.value[idx] };
      if (bulkEditToggles.tanggal) data.tanggal = bulkEditForm.tanggal;
      if (bulkEditToggles.unit) data.unit = bulkEditForm.unit;
      if (bulkEditToggles.divisi) data.divisi = bulkEditForm.divisi;

      const res = await api.updateData("daily_reports", id, data);
      if (res && res.success) {
        reportsList.value[idx] = data;
        count++;
      }
    }
  }
  isBulkEditModalOpen.value = false;
  selectedItems.value = [];
  store.addNotification("Berhasil", `${count} baris diperbarui`, "success");
};

const exportToExcel = async () => {
  if (sortedReports.value.length === 0)
    return store.addNotification("Info", "Tidak ada data", "warning");
  const worksheet = XLSX.utils.json_to_sheet(sortedReports.value);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan");
  XLSX.writeFile(workbook, `Rekap_Laporan.xlsx`);
};

const importExcel = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  store.addNotification("Info", "Fitur import siap digunakan", "info");
  e.target.value = null;
};

const formatTanggal = (d) =>
  d
    ? new Date(d).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";
</script>



<!-- Scoped rules also follow Vue's teleported modal elements. -->



<!-- Gaya khusus komponen; layout utama berada di template. -->
<style scoped>
.ui-filter-actions {
  border-top: 1px solid var(--ui-border-soft);
}

.ui-filter-actions > .ui-button {
  flex: 1;
}

@media (min-width: 1024px) {
  .ui-filter-actions {
    border-top: none;
    border-left: 1px solid var(--ui-border-soft);
  }
}

@media (min-width: 1024px) {
  .ui-filter-actions > .ui-button {
    flex: none;
  }
}

.ui-builder-options {
  border: 1px solid var(--input-border);
  border-radius: var(--ui-radius-sm);
  background-color: var(--input-background);
}

.ui-builder-grid {
  align-items: end;
}

@media (min-width: 640px) {
  .ui-builder-grid {
    grid-template-columns: minmax(0, 5fr) minmax(0, 3fr) minmax(0, 4fr);
  }
}

.ui-table-summary {
  color: var(--ui-text-description);
  font-size: var(--ui-font-xs);
  font-style: italic;
}
</style>
