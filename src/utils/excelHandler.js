// src/utils/excelHandler.js
import * as XLSX from 'xlsx';
import { EXCEL_SCHEMAS, mapDataToExcelHeaders, mapExcelHeadersToDataKeys } from './excelSchemas.js';

/**
 * Export Array of Objects ke Excel (.xlsx) dengan Schema Mapping
 */
export const exportToExcelBySchema = (filename, rawDataList, schemaKey) => {
  if (!rawDataList || !rawDataList.length) {
    throw new Error("Tidak ada data untuk diexport.");
  }

  const formattedData = mapDataToExcelHeaders(rawDataList, schemaKey);

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  // Auto-fit lebar kolom
  const maxWidths = [];
  if (formattedData.length > 0) {
    Object.keys(formattedData[0]).forEach((key, colIdx) => {
      let maxLen = key.toString().length;
      formattedData.forEach(row => {
        const valStr = row[key] ? row[key].toString() : "";
        if (valStr.length > maxLen) maxLen = valStr.length;
      });
      maxWidths[colIdx] = { wch: Math.min(Math.max(maxLen + 3, 12), 50) };
    });
    worksheet['!cols'] = maxWidths;
  }

  XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split("T")[0]}.xlsx`);
};

/**
 * Unduh Template Sample Excel Dinamis untuk Halaman Mana Pun
 */
export const downloadExcelTemplate = (schemaKey) => {
  const schema = EXCEL_SCHEMAS[schemaKey];
  if (!schema) throw new Error(`Skema '${schemaKey}' tidak ditemukan.`);

  const sampleData = schema.sampleData && schema.sampleData.length > 0
    ? schema.sampleData
    : [
        schema.columns.reduce((acc, col) => {
          acc[col.key] = "Contoh " + col.label;
          return acc;
        }, {})
      ];

  const formattedSample = mapDataToExcelHeaders(sampleData, schemaKey);

  const worksheet = XLSX.utils.json_to_sheet(formattedSample);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

  const cleanTitle = (schema.title || "Data").replace(/[\s\/]+/g, "_");
  XLSX.writeFile(workbook, `Template_Import_${cleanTitle}.xlsx`);
};

/**
 * Parse File Excel Menggunakan Schema Modul
 */
export const parseExcelWithSchema = (file, schemaKey) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const rawJson = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        const mappedData = mapExcelHeadersToDataKeys(rawJson, schemaKey);
        
        resolve(mappedData);
      } catch (err) {
        reject(new Error("Gagal membaca berkas Excel: " + err.message));
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Analisis & Deteksi Konflik Data
 */
export const analyzeImportDiff = (incomingData, existingData, primaryKey = "id") => {
  const existingMap = new Map(existingData.map(item => [String(item[primaryKey] || item.id || item.Timestamp), item]));

  const summary = {
    newItems: [],
    unchanged: [],
    conflicts: [],
  };

  incomingData.forEach(incoming => {
    const key = String(incoming[primaryKey] || incoming.id || incoming.Timestamp);

    if (!key || !existingMap.has(key)) {
      summary.newItems.push(incoming);
    } else {
      const existing = existingMap.get(key);
      const isIdentical = Object.keys(incoming).every(k => {
        return JSON.stringify(incoming[k]) === JSON.stringify(existing[k]);
      });

      if (isIdentical) {
        summary.unchanged.push(incoming);
      } else {
        summary.conflicts.push({
          existing,
          incoming,
          resolution: "overwrite"
        });
      }
    }
  });

  return summary;
};