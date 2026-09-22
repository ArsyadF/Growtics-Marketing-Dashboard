// src/utils/csvHandler.js

// 1. Export Array of Objects ke Berkas CSV
export const exportToCSV = (filename, data, headers = []) => {
  if (!data || !data.length) throw new Error("Tidak ada data untuk diexport.");

  // Tentukan kolom yang dipakai
  const keys = headers.length ? headers : Object.keys(data[0]);
  
  // Format baris Header
  const csvRows = [keys.join(",")];

  // Format baris Data (Handling koma, quote, dan newlines)
  for (const row of data) {
    const values = keys.map(key => {
      let val = row[key] ?? "";
      if (typeof val === "object") val = JSON.stringify(val);
      const escaped = String(val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }

  // Buat File Blob & Trigger Download
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 2. Parser CSV Sederhana menjadi Array of Objects
export const parseCSV = (text) => {
  const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== "");
  if (lines.length < 2) return [];

  // Parse header
  const headers = lines[0].split(",").map(h => h.replace(/^"|"$/g, "").trim());

  const results = [];
  for (let i = 1; i < lines.length; i++) {
    // Regex split koma yang aman dari tanda kutip
    const currentline = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(",");
    
    if (currentline.length < headers.length) continue;

    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      let val = currentline[j] ? currentline[j].replace(/^"|"$/g, "").trim() : "";
      // Autodetect JSON string jika ada
      if (val.startsWith("{") || val.startsWith("[")) {
        try { val = JSON.parse(val); } catch (e) { /* Tetap string */ }
      }
      obj[headers[j]] = val;
    }
    results.push(obj);
  }
  return results;
};

// 3. Logika Analisis & Deteksi Konflik (Diff Engine)
export const analyzeImportDiff = (incomingData, existingData, primaryKey = "id") => {
  const existingMap = new Map(existingData.map(item => [String(item[primaryKey]), item]));

  const summary = {
    unchanged: [],  // Data persis sama (diabaikan)
    newItems: [],   // Data baru
    conflicts: [],  // ID sama tapi isi berbeda
  };

  incomingData.forEach(incoming => {
    const key = String(incoming[primaryKey]);

    if (!key || !existingMap.has(key)) {
      summary.newItems.push(incoming);
    } else {
      const existing = existingMap.get(key);
      
      // Bandingkan isi data
      const isIdentical = Object.keys(incoming).every(k => {
        return JSON.stringify(incoming[k]) === JSON.stringify(existing[k]);
      });

      if (isIdentical) {
        summary.unchanged.push(incoming);
      } else {
        summary.conflicts.push({
          existing,
          incoming,
          // Pilihan default resolusi
          resolution: "overwrite" // Pilihan: 'overwrite' | 'keep_existing' | 'generate_new'
        });
      }
    }
  });

  return summary;
};