// src/services/api.js
import { db as firestoreDb } from './firebase'; 
import { 
  collection, 
  getDocs, 
  getDoc,
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from "firebase/firestore";

export const api = {
  // 1. Verifikasi Passcode Publik dari settings/passcode
  async getPublicDataWithPasscode(passcode) {
    try {
      const passcodeDocRef = doc(firestoreDb, "settings", "passcode");
      const passcodeSnap = await getDoc(passcodeDocRef);
      
      let validCode = "0";
      if (passcodeSnap.exists()) {
        validCode = String(passcodeSnap.data().code);
      }

      if (String(passcode) === validCode) {
        const fullData = await this.getAllData();
        return { success: true, data: fullData };
      } else {
        return { success: false, message: "Kode Akses Publik Salah!" };
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  // 2. Autentikasi Login Pengguna
  async validateUserLogin(userEmail, passwordInput) {
    try {
      let q = query(collection(firestoreDb, "users"), where("email", "==", userEmail));
      let querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        q = query(collection(firestoreDb, "users"), where("Email", "==", userEmail));
        querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          return { success: false, message: "Pengguna tidak ditemukan!" };
        }
      }

      let userData = null;
      querySnapshot.forEach((d) => {
        const dData = d.data();
        let units = dData.aksesUnit;
        if (!units) {
          units = dData.unit || dData.Unit ? [dData.unit || dData.Unit] : ['NHP'];
        }

        userData = { 
          id: d.id, 
          nama: dData.nama || dData.Nama || '',
          email: dData.email || dData.Email || '',
          role: dData.role || dData.Role || 'ADMIN_UNIT',
          aksesUnit: Array.isArray(units) ? units : [units],
          permissions: dData.permissions || null,
          avatarUrl: dData.avatarUrl || dData.Avatar || dData.avatar || '',
          password: dData.password || dData.Password || '',
          bio: dData.bio || dData.Bio || ''
        };
      });

      if (userData.password && userData.password !== passwordInput) {
        return { success: false, message: "Password salah!" };
      }

      return { success: true, user: userData };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  // 3. Ambil Seluruh Data Database (Termasuk Master Settings, Programs, Aduan, & SPV Reports)
  async getAllData() {
    try {
      const [revSnap, promoSnap, leadsSnap, usersSnap, targetSnap, passcodeSnap, masterSnap, programsSnap, aduanSnap, spvReportsSnap] = await Promise.all([
        getDocs(collection(firestoreDb, "revenues")),
        getDocs(collection(firestoreDb, "promosi")),
        getDocs(collection(firestoreDb, "leads")),
        getDocs(collection(firestoreDb, "users")),
        getDoc(doc(firestoreDb, "settings", "targets")),
        getDoc(doc(firestoreDb, "settings", "passcode")),
        getDoc(doc(firestoreDb, "settings", "master")),
        getDocs(collection(firestoreDb, "programs")),
        getDocs(collection(firestoreDb, "aduan")),
        getDocs(collection(firestoreDb, "spv_reports"))
      ]);

      const revenue = revSnap.docs.map(d => ({ Timestamp: d.id, id: d.id, ...d.data() }));
      const promo = promoSnap.docs.map(d => ({ Timestamp: d.id, id: d.id, ...d.data() }));
      const leads = leadsSnap.docs.map(d => ({ Timestamp: d.id, id: d.id, ...d.data() }));
      const programs = programsSnap.docs.map(d => ({ Timestamp: d.id, id: d.id, ...d.data() }));
      const aduanList = aduanSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const spvReports = spvReportsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      
      const users = usersSnap.docs.map(d => {
        const u = d.data();
        let units = u.aksesUnit;
        if (!units) {
          units = u.unit || u.Unit ? [u.unit || u.Unit] : ['NHP'];
        }

        return {
          id: d.id,
          nama: u.nama || u.Nama || '',
          email: u.email || u.Email || '',
          role: u.role || u.Role || 'ADMIN_UNIT',
          aksesUnit: Array.isArray(units) ? units : [units],
          permissions: u.permissions || null,
          avatarUrl: u.avatarUrl || u.Avatar || u.avatar || '',
          password: u.password || u.Password || '',
          bio: u.bio || u.Bio || ''
        };
      });
      
      let master = {
        unitList: [
          { code: 'NHP', name: 'Unit Nur Hidayah Press' },
          { code: 'NHC', name: 'Unit Nur Hidayah Creative' },
          { code: 'KG', name: 'Unit Karta Grafika' }
        ],
        divisiList: ['CS Deal', 'Zona 1A', 'Zona 1B', 'Zona 2', 'Zona 3', 'Digital Marketing', 'Offline', 'Penerbitan & Cetak', 'Produksi & Logistik'],
        platformList: ['Shopee', 'TikTok Shop', 'WhatsApp', 'Website', 'Siplah', 'Toko Ladang', 'Blibli', 'Event', 'Mitra', 'Kunjungan', 'Konsinyasi']
      };

      if (targetSnap.exists()) {
        const tData = targetSnap.data();
        const targetNHP = Number(tData.TargetNHP || 0);
        const targetNHC = Number(tData.TargetNHC || 0);
        const targetKG = Number(tData.TargetKG || 0);
        
        master = {
          ...master,
          ...tData,
          TargetNHP: targetNHP,
          TargetNHC: targetNHC,
          TargetKG: targetKG,
          TargetTahunIni: tData.TargetTahunIni || (targetNHP + targetNHC + targetKG)
        };
      }
      
      if (passcodeSnap.exists()) {
        master.KodeAkses = passcodeSnap.data().code;
      }

      if (masterSnap.exists()) {
        const mData = masterSnap.data();
        if (mData.unitList) master.unitList = mData.unitList;
        if (mData.divisiList) master.divisiList = mData.divisiList;
        if (mData.platformList) master.platformList = mData.platformList;
      }

      return { revenue, promo, leads, users, master, programs, aduanList, spvReports };
    } catch (err) {
      console.error("Error fetching Firestore data:", err);
      return { revenue: [], promo: [], leads: [], users: [], master: {}, programs: [], aduanList: [], spvReports: [] };
    }
  },

  // 4. Simpan Data Baru Generic
  async saveData(sheetName, payload) {
    try {
      const collectionMap = {
        'Revenue': 'revenues',
        'Promo': 'promosi',
        'Leads': 'leads',
        'Users': 'users',
        'Programs': 'programs',
        'Aduan': 'aduan',
        'SpvReports': 'spv_reports'
      };
      const colName = collectionMap[sheetName] || sheetName.toLowerCase();
      const docRef = await addDoc(collection(firestoreDb, colName), payload);
      return { success: true, message: `Data ${sheetName} berhasil ditambahkan!`, id: docRef.id };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  // 5. Update Data Dokumen Generic
  async updateData(sheetName, docId, payload) {
    try {
      const collectionMap = {
        'Revenue': 'revenues',
        'Promo': 'promosi',
        'Leads': 'leads',
        'Users': 'users',
        'Programs': 'programs',
        'Aduan': 'aduan',
        'SpvReports': 'spv_reports'
      };
      const colName = collectionMap[sheetName] || sheetName.toLowerCase();
      const docRef = doc(firestoreDb, colName, String(docId));
      await updateDoc(docRef, payload);
      return { success: true, message: `Data ${sheetName} berhasil diperbarui!` };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  // 6. Hapus Data Dokumen Generic
  async deleteData(sheetName, docId) {
    try {
      const collectionMap = {
        'Revenue': 'revenues',
        'Promo': 'promosi',
        'Leads': 'leads',
        'Users': 'users',
        'Programs': 'programs',
        'Aduan': 'aduan',
        'SpvReports': 'spv_reports'
      };
      const colName = collectionMap[sheetName] || sheetName.toLowerCase();
      await deleteDoc(doc(firestoreDb, colName, String(docId)));
      return { success: true, message: `Data ${sheetName} berhasil dihapus!` };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  // 7. Simpan/Update Target & Master Data secara Aman (Non-Destruktif dengan Merge)
  async saveMasterData(masterPayload) {
    try {
      if (masterPayload.KodeAkses !== undefined) {
        const passRef = doc(firestoreDb, "settings", "passcode");
        await setDoc(passRef, { code: String(masterPayload.KodeAkses) }, { merge: true });
      }
      
      const targetRef = doc(firestoreDb, "settings", "targets");
      await setDoc(targetRef, {
        TargetNHP: Number(masterPayload.TargetNHP || 0),
        TargetNHC: Number(masterPayload.TargetNHC || 0),
        TargetKG: Number(masterPayload.TargetKG || 0),
        TargetTahunIni: Number(masterPayload.TargetTahunIni || 0),
        RevenueTahunLalu: Number(masterPayload.RevenueTahunLalu || 0)
      }, { merge: true });

      const masterRef = doc(firestoreDb, "settings", "master");
      await setDoc(masterRef, {
        unitList: masterPayload.unitList || [],
        divisiList: masterPayload.divisiList || [],
        platformList: masterPayload.platformList || []
      }, { merge: true });

      return { success: true, message: "Seluruh Master Data & Target berhasil diperbarui!" };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  // 8. Simpan/Update Single Program Kanban ke Firestore
 // Di dalam src/services/api.js

// Dalam src/services/api.js

async saveProgramData(programItem) {
  try {
    const docId = String(programItem.id || programItem.Timestamp || Date.now());
    const docRef = doc(firestoreDb, "programs", docId);
    
    // Pastikan ID user yang ditugaskan disimpan sebagai Array
    const assignedPicIds = Array.isArray(programItem.assignedPicIds) 
      ? programItem.assignedPicIds 
      : (programItem.picId ? [programItem.picId] : []);

    const assignedUsers = Array.isArray(programItem.assignedUsers)
      ? programItem.assignedUsers
      : [];

    const payload = {
      unit: programItem.unit || programItem.Unit || 'NHP',
      division: programItem.division || programItem.Divisi || '',
      title: programItem.title || programItem.Judul || '',
      description: programItem.description || programItem.Deskripsi || '',
      deadline: programItem.deadline || programItem.Deadline || '',
      progress: Number(programItem.progress || programItem.Progress || 0),
      status: programItem.status || programItem.Status || 'To Do',
      // SIMPAN KEDUA ARRAY INI
      assignedPicIds: assignedPicIds, 
      assignedUsers: assignedUsers,
      picName: programItem.picName || assignedUsers.join(', '),
      updatedAt: Date.now()
    };

    await setDoc(docRef, payload, { merge: true });
    return { success: true, message: "Program berhasil disimpan!", id: docId };
  } catch (err) {
    console.error("Gagal menyimpan program progress:", err);
    return { success: false, message: err.message };
  }
},

  async deleteProgramData(programId) {
    return await this.deleteData('programs', String(programId));
  },

  // 9. Catatan Pribadi User
  async getUserNotes(userId) {
    try {
      const q = query(
        collection(firestoreDb, "user_notes"), 
        where("userId", "==", String(userId))
      );
      const querySnapshot = await getDocs(q);
      const notes = querySnapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      return notes.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    } catch (err) {
      console.error("Gagal mengambil catatan user:", err);
      return [];
    }
  },

  async saveUserNote(userId, noteItem) {
    try {
      const docId = String(noteItem.id || Date.now());
      const docRef = doc(firestoreDb, "user_notes", docId);
      
      const payload = {
        userId: String(userId),
        title: noteItem.title || '',
        category: noteItem.category || 'Umum',
        cardStyle: noteItem.cardStyle || 'standard',
        content: noteItem.content || '',
        todos: Array.isArray(noteItem.todos) ? noteItem.todos : [],
        images: Array.isArray(noteItem.images) ? noteItem.images : [],
        date: noteItem.date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        createdAt: noteItem.createdAt || Date.now()
      };

      await setDoc(docRef, payload, { merge: true });
      return { success: true, id: docId };
    } catch (err) {
      console.error("Gagal menyimpan catatan:", err);
      throw err;
    }
  },

  async deleteUserNote(noteId) {
    try {
      const docRef = doc(firestoreDb, "user_notes", String(noteId));
      await deleteDoc(docRef);
      return { success: true };
    } catch (err) {
      console.error("Gagal menghapus catatan:", err);
      throw err;
    }
  },

  // 10. Pengelolaan Aduan Layanan (Customer Care) Spesifik Firestore
  // src/services/api.js
async saveAduanData(aduanItem) {
  try {
    const docId = String(aduanItem.id || Date.now());
    const docRef = doc(firestoreDb, "aduan", docId);

    const payload = {
      ticketNo: aduanItem.ticketNo || ('TCK-' + Math.floor(1000 + Math.random() * 9000)),
      customerName: aduanItem.customerName || '',
      contact: aduanItem.contact || '',
      unit: aduanItem.unit || 'NHP',
      category: aduanItem.category || 'Lain-lain',
      priority: aduanItem.priority || 'Sedang',
      status: aduanItem.status || 'Open',
      description: aduanItem.description || '',
      date: aduanItem.date || new Date().toISOString().split('T')[0],
      // PASTI KAN FIELD INI TERSIMPAN KE FIRESTORE
      createdBy: aduanItem.createdBy || ''
    };

    await setDoc(docRef, payload, { merge: true });
    return { success: true, message: "Aduan berhasil disimpan!", id: docId };
  } catch (err) {
    console.error("Gagal menyimpan aduan:", err);
    return { success: false, message: err.message };
  }
},

  async deleteAduanData(aduanId) {
    return await this.deleteData('aduan', String(aduanId));
  },

  // 11. Pengelolaan Laporan Divisi SPV Pekanan
  async saveSpvReportData(reportItem) {
    try {
      const docId = String(reportItem.id || Date.now());
      const docRef = doc(firestoreDb, "spv_reports", docId);

      const payload = {
        tanggal: reportItem.tanggal || new Date().toISOString().split('T')[0],
        divisi: reportItem.divisi || '',
        capaian: reportItem.capaian || '',
        kendala: reportItem.kendala || '',
        pembuat: reportItem.pembuat || ''
      };

      await setDoc(docRef, payload, { merge: true });
      return { success: true, message: "Laporan SPV berhasil disimpan!", id: docId };
    } catch (err) {
      console.error("Gagal menyimpan laporan SPV:", err);
      return { success: false, message: err.message };
    }
  },

  async deleteSpvReportData(reportId) {
    return await this.deleteData('spv_reports', String(reportId));
  },

  // 12. Simpan Master Settings parsial
  async saveMasterTargetsOnly(targetPayload) {
    try {
      const targetRef = doc(firestoreDb, "settings", "targets");
      await setDoc(targetRef, {
        TargetNHP: Number(targetPayload.TargetNHP || 0),
        TargetNHC: Number(targetPayload.TargetNHC || 0),
        TargetKG: Number(targetPayload.TargetKG || 0),
        TargetTahunIni: Number(targetPayload.TargetTahunIni || 0)
      }, { merge: true });
      return { success: true, message: "Target revenue berhasil disimpan!" };
    } catch (err) {
      console.error("Gagal simpan target:", err);
      throw err;
    }
  },

  async saveMasterUnitsOnly(unitList) {
    try {
      const masterRef = doc(firestoreDb, "settings", "master");
      await setDoc(masterRef, { unitList }, { merge: true });
      return { success: true, message: "Master unit usaha berhasil disimpan!" };
    } catch (err) {
      console.error("Gagal simpan unit:", err);
      throw err;
    }
  },

  async saveMasterDivisionsOnly(divisiList) {
    try {
      const masterRef = doc(firestoreDb, "settings", "master");
      await setDoc(masterRef, { divisiList }, { merge: true });
      return { success: true, message: "Master divisi berhasil disimpan!" };
    } catch (err) {
      console.error("Gagal simpan divisi:", err);
      throw err;
    }
  },

  async saveMasterPlatformsOnly(platformList) {
    try {
      const masterRef = doc(firestoreDb, "settings", "master");
      await setDoc(masterRef, { platformList }, { merge: true });
      return { success: true, message: "Master platform berhasil disimpan!" };
    } catch (err) {
      console.error("Gagal simpan platform:", err);
      throw err;
    }
  },

  // Tambahkan / Perbarui metode berikut di dalam objek api pada src/services/api.js

  // 11. Pengelolaan Laporan Divisi SPV Pekanan (Diperbarui agar mendukung skema lengkap)
  async saveSpvReportData(reportItem) {
    try {
      const docId = String(reportItem.id || Date.now());
      const docRef = doc(firestoreDb, "spv_reports", docId);

      const payload = {
        unit: reportItem.unit || 'NHP',
        title: reportItem.title || '',
        startDate: reportItem.startDate || '',
        endDate: reportItem.endDate || '',
        periode: reportItem.periode || '',
        ringkasan: {
          penawaran: Number(reportItem.ringkasan?.penawaran || 0),
          pesanan: Number(reportItem.ringkasan?.pesanan || 0),
          penjualan: Number(reportItem.ringkasan?.penjualan || 0)
        },
        programList: Array.isArray(reportItem.programList) ? reportItem.programList : [],
        aktivitasCS: reportItem.aktivitasCS || '',
        kendala: reportItem.kendala || '',
        author: reportItem.author || '',
        releaseDate: reportItem.releaseDate || new Date().toISOString().split('T')[0],
        updatedAt: Date.now()
      };

      await setDoc(docRef, payload, { merge: true });
      return { success: true, message: "Laporan SPV berhasil disimpan!", id: docId };
    } catch (err) {
      console.error("Gagal menyimpan laporan SPV:", err);
      return { success: false, message: err.message };
    }
  },

  // Helper Tambahan: Kalkulasi Metrik Sales Otomatis dari Firestore Collections (revenues & leads)
  async getSalesMetricsByDateRange(startDate, endDate, unitFilter = "ALL") {
    try {
      const [revSnap, leadsSnap] = await Promise.all([
        getDocs(collection(firestoreDb, "revenues")),
        getDocs(collection(firestoreDb, "leads"))
      ]);

      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      let totalPenawaran = 0;
      let totalPesanan = 0;
      let totalPenjualan = 0;

      // Hitung Penawaran dari koleksi 'leads'
      leadsSnap.docs.forEach((d) => {
        const item = d.data();
        const itemDate = new Date(item.Tanggal || item.date || item.Timestamp);
        const itemUnit = item.Unit || item.unit;
        if (itemDate >= start && itemDate <= end && (unitFilter === "ALL" || itemUnit === unitFilter)) {
          totalPenawaran += Number(item.JumlahPenawaran || item.penawaran || 1);
        }
      });

      // Hitung Pesanan & Penjualan (Rp) dari koleksi 'revenues'
      revSnap.docs.forEach((d) => {
        const item = d.data();
        const itemDate = new Date(item.Tanggal || item.date || item.Timestamp);
        const itemUnit = item.Unit || item.unit;
        if (itemDate >= start && itemDate <= end && (unitFilter === "ALL" || itemUnit === unitFilter)) {
          totalPesanan += Number(item.JumlahPesanan || item.pesanan || 1);
          totalPenjualan += Number(item.Nominal || item.penjualan || item.omset || 0);
        }
      });

      return {
        penawaran: totalPenawaran,
        pesanan: totalPesanan,
        penjualan: totalPenjualan
      };
    } catch (err) {
      console.error("Gagal menghitung metrik sales:", err);
      return { penawaran: 0, pesanan: 0, penjualan: 0 };
    }
  }

};

