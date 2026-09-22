// src/utils/excelSchemas.js

export const EXCEL_SCHEMAS = {
  // 1. SKEMA UNTUK REVENUE / OMSET (PageUnit.vue)
  REVENUE: {
    title: "Revenue / Omset",
    primaryKey: "id",
    columns: [
      { key: "id", label: "ID Data" },
      { key: "Tanggal", label: "Tanggal" },
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
        Keterangan: "Penjualan Event Awal Bulan"
      }
    ]
  },

  // 2. SKEMA UNTUK LEADS
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
  },

  // 3. SKEMA UNTUK ADUAN / CUSTOMER CARE
  ADUAN: {
    title: "Tiket Aduan Customer Care",
    primaryKey: "id",
    columns: [
      { key: "id", label: "ID Data" },
      { key: "ticketNo", label: "No Tiket" },
      { key: "customerName", label: "Nama Pelanggan" },
      { key: "contact", label: "Kontak WA/Email" },
      { key: "unit", label: "Unit Usaha" },
      { key: "category", label: "Kategori Masalah" },
      { key: "priority", label: "Prioritas" },
      { key: "status", label: "Status Tiket" },
      { key: "description", label: "Rincian Aduan" },
      { key: "date", label: "Tanggal Aduan" },
      { key: "createdBy", label: "Pembuat Tiket" }
    ],
    sampleData: [
      {
        id: "TCK-1001",
        ticketNo: "TCK-1001",
        customerName: "Ahmad Fulan",
        contact: "08123456789",
        unit: "NHP",
        category: "Keterlambatan Pengiriman",
        priority: "Sedang",
        status: "Open",
        description: "Pesanan belum sampai lokasi",
        date: "2026-09-01",
        createdBy: "admin@contoh.com"
      }
    ]
  }
};

/**
 * Helper: Konversi Array Objek Firestore ke Format Berlabel Excel
 */
export const mapDataToExcelHeaders = (dataList, schemaKey) => {
  const schema = EXCEL_SCHEMAS[schemaKey];
  if (!schema) return dataList;

  return dataList.map((item, idx) => {
    const row = {};
    schema.columns.forEach(col => {
      let val = item[col.key];

      // SINKRONISASI FIELD REVENUE DENGAN FIRESTORE
      if (schemaKey === "REVENUE") {
        if (col.key === "Revenue") {
          val = item.Revenue ?? item.Nominal ?? item.penjualan ?? item.omset ?? 0;
        } else if (col.key === "Tanggal") {
          val = item.Tanggal ?? item.date ?? item.tanggal ?? item.Timestamp ?? "";
        } else if (col.key === "Unit") {
          val = item.Unit ?? item.unit ?? "";
        } else if (col.key === "Divisi") {
          val = item.Divisi ?? item.divisi ?? "";
        } else if (col.key === "Platform") {
          val = item.Platform ?? item.platform ?? "";
        } else if (col.key === "JumlahPesanan") {
          val = item.JumlahPesanan ?? item.pesanan ?? 1;
        } else if (col.key === "id") {
          val = item.id ?? item.Timestamp ?? `REV-${idx + 1}`;
        }
      }

      row[col.label] = val !== undefined && val !== null ? val : "";
    });
    return row;
  });
};

/**
 * Helper: Konversi Array Objek dari Excel (Label) Kembali ke Field Database (Key)
 */
export const mapExcelHeadersToDataKeys = (excelRows, schemaKey) => {
  const schema = EXCEL_SCHEMAS[schemaKey];
  if (!schema) return excelRows;

  const labelToKeyMap = {};
  schema.columns.forEach(col => {
    labelToKeyMap[col.label] = col.key;
    labelToKeyMap[col.key] = col.key; // Fallback jika header menggunakan Key langsung
  });

  return excelRows.map(row => {
    const mappedObj = {};
    Object.keys(row).forEach(excelHeader => {
      const dbKey = labelToKeyMap[excelHeader] || excelHeader;
      mappedObj[dbKey] = row[excelHeader];
    });

    // NORMALISASI TIPE DATA DARI EXCEL UNTUK FIRESTORE
    if (schemaKey === "REVENUE") {
      mappedObj.Revenue = Number(mappedObj.Revenue || mappedObj.Nominal || 0);
      mappedObj.Nominal = mappedObj.Revenue; // Duplikasi ke Nominal agar kompatibel dengan modul lama
      mappedObj.JumlahPesanan = Number(mappedObj.JumlahPesanan || 1);
    }

    return mappedObj;
  });
};