// src/utils/excelSchemas.js

export const EXCEL_SCHEMAS = {
  // 1. SKEMA REVENUE / OMSET (PageUnit.vue)
  REVENUE: {
    title: "Revenue / Omset",
    primaryKey: "id",
    columns: [
      { key: "id", label: "ID Data" },
      { key: "Tanggal", label: "Tanggal (YYYY-MM-DD)" },
      { key: "Unit", label: "Unit Usaha" },
      { key: "Divisi", label: "Divisi" },
      { key: "Platform", label: "Platform" },
      { key: "JumlahPesanan", label: "Jumlah Pesanan" },
      { key: "Revenue", label: "Nominal Omset (Rp)" },
      { key: "Keterangan", label: "Keterangan / Catatan" }
    ],
    sampleData: [
      {
        id: "REV-1001",
        Tanggal: "2026-09-01",
        Unit: "NHP",
        Divisi: "Digital Marketing",
        Platform: "Shopee",
        JumlahPesanan: 25,
        Revenue: 15000000,
        Keterangan: "Penjualan Event"
      }
    ]
  },

  // 2. SKEMA ADUAN / CUSTOMER CARE (PageCustomerCare.vue)
  ADUAN: {
    title: "Tiket Aduan Customer Care",
    primaryKey: "id",
    columns: [
      { key: "id", label: "ID Tiket" },
      { key: "ticketNo", label: "No Tiket" },
      { key: "customerName", label: "Nama Pelanggan" },
      { key: "contact", label: "Kontak (WA/Email)" },
      { key: "unit", label: "Unit Usaha" },
      { key: "category", label: "Kategori Masalah" },
      { key: "priority", label: "Prioritas (Tinggi/Sedang/Rendah)" },
      { key: "status", label: "Status (Open/In Progress/Resolved)" },
      { key: "description", label: "Rincian Keluhan" },
      { key: "date", label: "Tanggal (YYYY-MM-DD)" },
      { key: "createdBy", label: "Pembuat Tiket" }
    ],
    sampleData: [
      {
        id: "1726000000000",
        ticketNo: "TCK-1001",
        customerName: "Ahmad Fulan",
        contact: "08123456789",
        unit: "NHP",
        category: "Keterlambatan Pengiriman",
        priority: "Sedang",
        status: "Open",
        description: "Pesanan buku belum terkirim",
        date: "2026-09-01",
        createdBy: "admin@contoh.com"
      }
    ]
  },

  // 3. SKEMA LEADS / PENAWARAN (PageLeads.vue - Persiapan)
  LEADS: {
    title: "Data Leads",
    primaryKey: "id",
    columns: [
      { key: "id", label: "ID Data" },
      { key: "Tanggal", label: "Tanggal" },
      { key: "Unit", label: "Unit Usaha" },
      { key: "Divisi", label: "Divisi" },
      { key: "JumlahPenawaran", label: "Jumlah Penawaran" },
      { key: "Keterangan", label: "Keterangan" }
    ],
    sampleData: [
      {
        id: "LDS-1001",
        Tanggal: "2026-09-01",
        Unit: "NHP",
        Divisi: "Digital Marketing",
        JumlahPenawaran: 10,
        Keterangan: "Lead dari Facebook Ads"
      }
    ]
  }
};

/**
 * Konversi Array Objek Firestore ke Format Berlabel Excel secara Dinamis
 */
export const mapDataToExcelHeaders = (dataList, schemaKey) => {
  const schema = EXCEL_SCHEMAS[schemaKey];
  if (!schema) return dataList;

  return dataList.map((item, idx) => {
    const row = {};
    schema.columns.forEach(col => {
      let val = item[col.key];

      // Penanganan khusus fallback field dinamis per modul
      if (schemaKey === "REVENUE") {
        if (col.key === "Revenue") val = item.Revenue ?? item.Nominal ?? item.penjualan ?? item.omset ?? 0;
        else if (col.key === "Tanggal") val = item.Tanggal ?? item.date ?? item.Timestamp ?? "";
        else if (col.key === "Unit") val = item.Unit ?? item.unit ?? "";
        else if (col.key === "Divisi") val = item.Divisi ?? item.divisi ?? "";
        else if (col.key === "Platform") val = item.Platform ?? item.platform ?? "";
        else if (col.key === "JumlahPesanan") val = item.JumlahPesanan ?? item.pesanan ?? 1;
        else if (col.key === "id") val = item.id ?? item.Timestamp ?? `REV-${idx + 1}`;
      } else if (schemaKey === "ADUAN") {
        if (col.key === "id") val = item.id ?? Date.now();
        else if (col.key === "ticketNo") val = item.ticketNo ?? `TCK-${idx + 1000}`;
        else if (col.key === "customerName") val = item.customerName ?? "";
        else if (col.key === "contact") val = item.contact ?? "";
        else if (col.key === "unit") val = item.unit ?? item.Unit ?? "NHP";
        else if (col.key === "category") val = item.category ?? "Lain-lain";
        else if (col.key === "priority") val = item.priority ?? "Sedang";
        else if (col.key === "status") val = item.status ?? "Open";
        else if (col.key === "description") val = item.description ?? "";
        else if (col.key === "date") val = item.date ?? new Date().toISOString().split('T')[0];
        else if (col.key === "createdBy") val = item.createdBy ?? "";
      }

      row[col.label] = val !== undefined && val !== null ? val : "";
    });
    return row;
  });
};

/**
 * Konversi Array Objek dari Excel (Label) Kembali ke Field Database (Key) secara Dinamis
 */
export const mapExcelHeadersToDataKeys = (excelRows, schemaKey) => {
  const schema = EXCEL_SCHEMAS[schemaKey];
  if (!schema) return excelRows;

  const labelToKeyMap = {};
  schema.columns.forEach(col => {
    labelToKeyMap[col.label] = col.key;
    labelToKeyMap[col.key] = col.key; // Fallback jika header file memakai nama Key langsung
  });

  return excelRows.map(row => {
    const mappedObj = {};
    Object.keys(row).forEach(excelHeader => {
      const dbKey = labelToKeyMap[excelHeader] || excelHeader;
      mappedObj[dbKey] = row[excelHeader];
    });

    // Normalisasi Tipe Data berdasarkan Schema Modul
    if (schemaKey === "REVENUE") {
      mappedObj.Revenue = Number(mappedObj.Revenue || mappedObj.Nominal || 0);
      mappedObj.Nominal = mappedObj.Revenue; 
      mappedObj.JumlahPesanan = Number(mappedObj.JumlahPesanan || 1);
    } else if (schemaKey === "ADUAN") {
      if (!mappedObj.id) mappedObj.id = Date.now();
      if (!mappedObj.ticketNo) mappedObj.ticketNo = "TCK-" + Math.floor(1000 + Math.random() * 9000);
      if (!mappedObj.status) mappedObj.status = "Open";
      if (!mappedObj.priority) mappedObj.priority = "Sedang";
    }

    return mappedObj;
  });
};