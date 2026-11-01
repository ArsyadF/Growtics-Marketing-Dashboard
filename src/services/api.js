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
  where,
  limit,
  getCountFromServer
} from "firebase/firestore";

// Peta koleksi global untuk fungsi CRUD Generic
const COLLECTION_MAP = {
  'Revenue': 'revenues',
  'Promo': 'promosi',
  'Leads': 'leads',
  'Users': 'users',
  'Programs': 'programs',
  'Aduan': 'aduan',
  'SpvReports': 'spv_reports',
  'DailyReports': 'daily_reports',
  'ReportTemplates': 'report_templates'  
};

export const api = {
  // ==========================================
  // 1. AUTENTIKASI & AKSES PUBLIK
  // ==========================================
  
 async getPublicDataWithPasscode(passcode) {
    try {
      const passcodeDocRef = doc(firestoreDb, "settings", "passcode");
      const passcodeSnap = await getDoc(passcodeDocRef);
      
      let validCode = "0";
      if (passcodeSnap.exists()) {
        validCode = String(passcodeSnap.data().code);
      }

      if (String(passcode) === validCode) {
        // ❌ HAPUS: const fullData = await this.getAllData();
        
        // ✅ CUKUP AMBIL SATU DOKUMEN MASTER ATAU RETURN OBJECT KOSONG UNTUK VERIFIKASI KODE
        const masterSnap = await getDoc(doc(firestoreDb, "settings", "master"));
        const masterData = masterSnap.exists() ? masterSnap.data() : {};

        return { 
          success: true, 
          data: { 
            master: masterData,
            revenue: [],
            promo: [],
            leads: [],
            users: [],
            programs: [],
            aduanList: [],
            spvReports: []
          } 
        };
      } else {
        return { success: false, message: "Kode Akses Publik Salah!" };
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

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
          role: dData.role || dData.Role || '',
          unit: dData.unit || dData.Unit || (Array.isArray(units) ? units[0] : ''),
          divisi: dData.divisi || dData.Divisi || '',
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

  async getDashboardSummary(userId) {
  try {
    // 1. Hitung jumlah Notes milik user
    const notesQuery = query(collection(firestoreDb, "user_notes"), where("userId", "==", String(userId)));
    const notesSnap = await getCountFromServer(notesQuery);
    const notesCount = notesSnap.data().count;

    // 2. Hitung jumlah Program / Tugas Aktif & Selesai
    const progQuery = query(collection(firestoreDb, "programs"));
    const progSnap = await getDocs(progQuery); // Ambil ringan khusus status & PIC saja
    
    let activeTasks = 0;
    let completedTasks = 0;
    let upcomingList = [];

    progSnap.docs.forEach(d => {
      const data = d.data();
      const status = data.status || data.Status || 'To Do';
      
      // Filter tugas milik user yang sedang login (sesuaikan logika PIC Anda)
      // Jika ingin global untuk admin/SPV, bisa langsung hitung
      if (status === 'In Progress') activeTasks++;
      if (status === 'Completed') completedTasks++;

      upcomingList.push({
        id: d.id,
        title: data.title || data.Judul || '',
        status: status,
        progress: Number(data.progress || data.Progress || 0),
        deadline: data.deadline || data.Deadline || '',
        unit: data.unit || data.Unit || 'NHP',
        assignedPicIds: data.assignedPicIds || [],
        assignedUsers: data.assignedUsers || []
      });
    });

    // 3. Hitung jumlah Aduan Open
    const aduanQuery = query(collection(firestoreDb, "aduan"), where("status", "==", "Open"));
    const aduanSnap = await getCountFromServer(aduanQuery);
    const openTicketsCount = aduanSnap.data().count;

    return {
      notesCount,
      activeTasks,
      completedTasks,
      openTicketsCount,
      upcomingList: upcomingList.slice(0) // Ambil 5 teratas saja untuk list deadline
    };
  } catch (err) {
    console.error("Gagal mengambil ringkasan dashboard:", err);
    return { notesCount: 0, activeTasks: 0, completedTasks: 0, openTicketsCount: 0, upcomingList: [] };
  }
},

  // ==========================================
  // 2. PENGAMBILAN DATA GLOBAL
  // ==========================================
  
//  async getAllData() {
//     try {
//       // ✅ PASANG LIMIT PADA SEMUA KOLEKSI BESAR DI DALAM PROMISE.ALL
//       const [
//         revSnap, promoSnap, leadsSnap, usersSnap, targetSnap, 
//         passcodeSnap, masterSnap, programsSnap, aduanSnap, spvReportsSnap
//       ] = await Promise.all([
//         getDocs(query(collection(firestoreDb, "revenues"), limit())),
//         getDocs(query(collection(firestoreDb, "promosi"), limit())),
//         getDocs(query(collection(firestoreDb, "leads"), limit())),
//         getDocs(query(collection(firestoreDb, "users"), limit())),
//         getDoc(doc(firestoreDb, "settings", "targets")),
//         getDoc(doc(firestoreDb, "settings", "passcode")),
//         getDoc(doc(firestoreDb, "settings", "master")),
//         getDocs(query(collection(firestoreDb, "programs"), limit())),
//         getDocs(query(collection(firestoreDb, "aduan"), limit())),
//         getDocs(query(collection(firestoreDb, "spv_reports"), limit()))
//       ]);

//       const revenue = revSnap.docs.map(d => ({ Timestamp: d.id, id: d.id, ...d.data() }));
//       const promo = promoSnap.docs.map(d => ({ Timestamp: d.id, id: d.id, ...d.data() }));
//       const leads = leadsSnap.docs.map(d => ({ Timestamp: d.id, id: d.id, ...d.data() }));
//       const programs = programsSnap.docs.map(d => ({ Timestamp: d.id, id: d.id, ...d.data() }));
//       const spvReports = spvReportsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

//       const aduanList = aduanSnap.docs.map(d => {
//         const data = d.data();
//         return {
//           id: d.id,
//           ...data,
//           imageUrl: data.imageUrl || data.ImageUrl || data.image || data.Image || ""
//         };
//       });
      
//       const users = usersSnap.docs.map(d => {
//         const u = d.data();
//         let units = u.aksesUnit;
//         if (!units) {
//           units = u.unit || u.Unit ? [u.unit || u.Unit] : ['NHP'];
//         }

//         return {
//           id: d.id,
//           nama: u.nama || u.Nama || '',
//           email: u.email || u.Email || '',
//           role: u.role || u.Role || '',
//           unit: u.unit || u.Unit || (Array.isArray(units) ? units[0] : ''),
//           divisi: u.divisi || u.Divisi || '',
//           aksesUnit: Array.isArray(units) ? units : [units],
//           permissions: u.permissions || null,
//           avatarUrl: u.avatarUrl || u.Avatar || u.avatar || '',
//           // 🔒 AMAN: Field password dihapus agar tidak bocor di Network Inspect
//           bio: u.bio || u.Bio || ''
//         };
//       });
      
//       let master = {
//         unitList: [
//           { code: 'NHP', name: 'Unit Nur Hidayah Press' },
//           { code: 'NHC', name: 'Unit Nur Hidayah Collection' },
//           { code: 'KG', name: 'Unit Karta Grafika' }
//         ],
//         divisiList: ['CS Deal', 'Zona 1A', 'Zona 1B', 'Zona 2', 'Zona 3', 'Digital Marketing', 'Offline', 'Penerbitan & Cetak', 'Produksi & Logistik'],
//         platformList: ['Shopee', 'TikTok Shop', 'WhatsApp', 'Website', 'Toko Ladang', 'Blibli', 'Event', 'Mitra', 'Kunjungan', 'Konsinyasi']
//       };

//       if (targetSnap.exists()) {
//         const tData = targetSnap.data();
//         const targetNHP = Number(tData.TargetNHP || 0);
//         const targetNHC = Number(tData.TargetNHC || 0);
//         const targetKG = Number(tData.TargetKG || 0);
        
//         master = {
//           ...master,
//           ...tData,
//           TargetNHP: targetNHP,
//           TargetNHC: targetNHC,
//           TargetKG: targetKG,
//           TargetTahunIni: tData.TargetTahunIni || (targetNHP + targetNHC + targetKG)
//         };
//       }
      
//       if (passcodeSnap.exists()) {
//         master.KodeAkses = passcodeSnap.data().code;
//       }

//       if (masterSnap.exists()) {
//         const mData = masterSnap.data();
//         if (mData.unitList) master.unitList = mData.unitList;
//         if (mData.divisiList) master.divisiList = mData.divisiList;
//         if (mData.platformList) master.platformList = mData.platformList;
//       }

//       return { revenue, promo, leads, users, master, programs, aduanList, spvReports };
//     } catch (err) {
//       console.error("Error fetching data:", err);
//       return { revenue: [], promo: [], leads: [], users: [], master: {}, programs: [], aduanList: [], spvReports: [] };
//     }
//   },

  // Modul penarikan data ringan khusus pasca-login
 // Modul penarikan data ringan khusus pasca-login dengan proteksi akses master
  async getPostLoginData(currentUser = null) {
    try {
      const role = String(currentUser?.role || currentUser?.Role || "").toUpperCase();
      const hasMasterAccess = role === "SUPERADMIN" || (currentUser?.permissions?.["master-data"]?.access === true);

      let master = {
        unitList: [{ code: 'NHP', name: 'Unit Nur Hidayah Press' }],
        divisiList: [],
        platformList: []
      };

      // 🔒 Hanya ambil data master sensitif dari Firestore jika user benar-benar memiliki hak akses
      if (hasMasterAccess) {
        const [targetSnap, passcodeSnap, masterSnap] = await Promise.all([
          getDoc(doc(firestoreDb, "settings", "targets")),
          getDoc(doc(firestoreDb, "settings", "passcode")),
          getDoc(doc(firestoreDb, "settings", "master"))
        ]);

        master = {
          unitList: [
            { code: 'NHP', name: 'Unit Nur Hidayah Press' },
            { code: 'NHC', name: 'Unit Nur Hidayah Collection' },
            { code: 'KG', name: 'Unit Karta Grafika' }
          ],
          divisiList: ['CS Deal', 'Zona 1A', 'Zona 1B', 'Zona 2', 'Zona 3', 'Digital Marketing', 'Offline', 'Penerbitan & Cetak', 'Produksi & Logistik'],
          platformList: ['Shopee', 'TikTok Shop', 'WhatsApp', 'Website', 'Toko Ladang', 'Blibli', 'Event', 'Mitra', 'Kunjungan', 'Konsinyasi']
        };

        if (targetSnap.exists()) {
          const tData = targetSnap.data();
          master = { ...master, ...tData };
        }
        if (passcodeSnap.exists()) master.KodeAkses = passcodeSnap.data().code;
        if (masterSnap.exists()) {
          const mData = masterSnap.data();
          if (mData.unitList) master.unitList = mData.unitList;
          if (mData.divisiList) master.divisiList = mData.divisiList;
          if (mData.platformList) master.platformList = mData.platformList;
        }
      }

      return { 
        revenue: [], 
        promo: [], 
        leads: [], 
        users: [], 
        master, 
        programs: [], 
        aduanList: [], 
        spvReports: [] 
      };
    } catch (err) {
      console.error("Error fetching post-login data:", err);
      return { revenue: [], promo: [], leads: [], users: [], master: {}, programs: [], aduanList: [], spvReports: [] };
    }
  },


  // ==========================================
  // 3. GENERIC CRUD OPERATIONS
  // ==========================================
  
  async saveData(sheetName, payload) {
    try {
      const colName = COLLECTION_MAP[sheetName] || sheetName.toLowerCase();
      const docRef = await addDoc(collection(firestoreDb, colName), payload);
      localStorage.removeItem(`CACHE_${sheetName.toUpperCase()}`);
      
      return { success: true, message: `Data ${sheetName} berhasil ditambahkan!`, id: docRef.id };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  async updateData(sheetName, docId, payload) {
    try {
      const colName = COLLECTION_MAP[sheetName] || sheetName.toLowerCase();
      const docRef = doc(firestoreDb, colName, String(docId));
      localStorage.removeItem(`CACHE_${sheetName.toUpperCase()}`);

      await updateDoc(docRef, payload);
      return { success: true, message: `Data ${sheetName} berhasil diperbarui!` };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  async deleteData(sheetName, docId) {
    try {
      const colName = COLLECTION_MAP[sheetName] || sheetName.toLowerCase();
      await deleteDoc(doc(firestoreDb, colName, String(docId)));
      localStorage.removeItem(`CACHE_${sheetName.toUpperCase()}`);

      return { success: true, message: `Data ${sheetName} berhasil dihapus!` };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  // ==========================================
  // 4. PENGELOLAAN MASTER SETTINGS & TARGET
  // ==========================================
  
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

  // ==========================================
  // 5. MODUL SPESIFIK (PROGRAM, CATATAN, ADUAN, SPV)
  // ==========================================
  
  async saveProgramData(programItem) {
    try {
      const docId = String(programItem.id || programItem.Timestamp || Date.now());
      const docRef = doc(firestoreDb, "programs", docId);
      
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
        todos: Array.isArray(programItem.todos) ? programItem.todos : [],
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

  async getUserNotesCountOnly(userId) {
  try {
    const q = query(
      collection(firestoreDb, "user_notes"), 
      where("userId", "==", String(userId))
    );
    const querySnapshot = await getDocs(q);
    // Hanya mengembalikan id dan title, mengabaikan 'images' atau 'content' yang besar
    const notes = querySnapshot.docs.map(d => ({
      id: d.id,
      title: d.data().title || '',
      createdAt: d.data().createdAt || 0
      // ❌ Properti images / content sengaja tidak ditarik agar hemat bandwidth!
    }));
    return notes.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  } catch (err) {
    console.error("Gagal mengambil ringkasan catatan:", err);
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
        imageUrl: aduanItem.imageUrl || aduanItem.ImageUrl || aduanItem.image || '',
        date: aduanItem.date || new Date().toISOString().split('T')[0],
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

  async saveSpvReportData(reportItem) {
    try {
      const docId = String(reportItem.id || Date.now());
      const docRef = doc(firestoreDb, "spv_reports", docId);

      const payload = {
        unit: reportItem.unit || 'NHP',
        selectedUnits: Array.isArray(reportItem.selectedUnits) ? reportItem.selectedUnits : [],
        salesVariables: Array.isArray(reportItem.salesVariables) ? reportItem.salesVariables : [],
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
        originalAuthors: Array.isArray(reportItem.originalAuthors) ? reportItem.originalAuthors : null,
        releaseDate: reportItem.releaseDate || new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
        updatedAt: Date.now()
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

  // ==========================================
  // 6. METRIK ANALISIS & KALKULASI
  // ==========================================
  
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

      leadsSnap.docs.forEach((d) => {
        const item = d.data();
        const itemDate = new Date(item.Tanggal || item.date || item.Timestamp);
        const itemUnit = item.Unit || item.unit;
        if (itemDate >= start && itemDate <= end && (unitFilter === "ALL" || itemUnit === unitFilter)) {
          totalPenawaran += Number(item.JumlahPenawaran || item.penawaran || 1);
        }
      });

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
  },

  // ==========================================
  // 7. MODUL PRESENSI & FORM BUILDER
  // ==========================================
  
  async saveAttendanceData(payload) {
    try {
      const docRef = doc(firestoreDb, "attendances", payload.id);
      await setDoc(docRef, payload, { merge: true });
      return { success: true, message: "Presensi berhasil disimpan!" };
    } catch (err) {
      console.error("Firestore Error:", err);
      return { success: false, message: err.message };
    }
  },

  async saveFormSchema(schemaPayload) {
    try {
      const docRef = doc(firestoreDb, "attendance_forms", schemaPayload.id);
      await setDoc(docRef, schemaPayload, { merge: true });
      return { success: true, message: "Skema form berhasil diperbarui!" };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },
  
  async getPrograms() {
  try {
    const q = query(collection(firestoreDb, "programs"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ Timestamp: d.id, id: d.id, ...d.data() }));
  } catch (err) {
    console.error("Gagal getPrograms:", err);
    return [];
  }
},

async getProgramsLight() {
  try {
    const q = query(collection(firestoreDb, "programs")); // Tanpa limit agar hitungan akurat
    const snap = await getDocs(q);
    return snap.docs.map(d => ({
      id: d.id,
      status: d.data().status || d.data().Status || 'To Do',
      progress: Number(d.data().progress || d.data().Progress || 0),
      deadline: d.data().deadline || d.data().Deadline || '',
      title: d.data().title || d.data().Judul || '',
      assignedPicIds: d.data().assignedPicIds || [],
      assignedUsers: d.data().assignedUsers || [],
      createdBy: d.data().createdBy || ''
    }));
  } catch (err) {
    console.error("Gagal getProgramsLight:", err);
    return [];
  }
},

async getAduanList() {
  const CACHE_KEY = 'CACHE_ADUAN_LIST';
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) return JSON.parse(cached);

  try {
    const q = query(collection(firestoreDb, "aduan"));
    const snap = await getDocs(q);
    const aduanList = snap.docs.map(d => ({
      
        id: d.id,
        ticketNo: data.ticketNo || '',
        customerName: data.customerName || '',
        unit: data.unit || 'NHP',
        status: data.status || 'Open',
        priority: data.priority || 'Sedang',
        date: data.date || '',
        description: data.description || '',
        category: data.category || '', 
        contact: data.contact || '',
        createdBy: data.createdBy || ''
      }));
      localStorage.setItem(CACHE_KEY, JSON.stringify(aduanList));
    return aduanList; 
  } catch (err) {
    console.error("Gagal getAduanList:", err);
    return [];
  }
},

async getAduanListLight() {
  try {
    const q = query(collection(firestoreDb, "aduan")); // Tanpa limit agar hitungan akurat
    const snap = await getDocs(q);
    return snap.docs.map(d => ({
      id: d.id,
      status: d.data().status || 'Open'
    }));
  } catch (err) {
    console.error("Gagal getAduanListLight:", err);
    return [];
  }
},

async getAduanDetail(docId) {
  try {
    const docRef = doc(firestoreDb, "aduan", String(docId));
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        imageUrl: data.imageUrl || data.ImageUrl || data.image || data.Image || ""
      };
    }
    return null;
  } catch (err) {
    console.error("Gagal getAduanDetail:", err);
    return null;
  }
},

async getRevenues() {
  try {
    const q = query(collection(firestoreDb, "revenues"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ Timestamp: d.id, id: d.id, ...d.data() }));
  } catch (err) {
    console.error("Gagal getRevenues:", err);
    return [];
  }
},

async getPromos() {
  try {
    const q = query(collection(firestoreDb, "promosi"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ Timestamp: d.id, id: d.id, ...d.data() }));
  } catch (err) {
    console.error("Gagal getPromos:", err);
    return [];
  }
},

async getLeads() {
  try {
    const q = query(collection(firestoreDb, "leads"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ Timestamp: d.id, id: d.id, ...d.data() }));
  } catch (err) {
    console.error("Gagal getLeads:", err);
    return [];
  }
},

async getSpvReports() {
  try {
    const q = query(collection(firestoreDb, "spv_reports"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error("Gagal getSpvReports:", err);
    return [];
  }
},

async getUsers() {
    const CACHE_KEY = 'CACHE_USERS';
    
    // 1. Cek apakah cache sudah ada di LocalStorage
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      console.log("[Cache] Mengambil data users dari LocalStorage");
      return JSON.parse(cachedData);
    }

    // 2. Jika belum ada, ambil dari Firestore
    try {
      const q = query(collection(firestoreDb, "users"));
      const snap = await getDocs(q);
      
      const usersList = snap.docs.map(d => {
        const u = d.data();
        let units = u.aksesUnit;
        if (!units) {
          units = u.unit || u.Unit ? [u.unit || u.Unit] : ['NHP'];
        }
        return {
          id: d.id,
          nama: u.nama || u.Nama || '',
          email: u.email || u.Email || '',
          role: u.role || u.Role || '',
          unit: u.unit || u.Unit || (Array.isArray(units) ? units[0] : ''),
          divisi: u.divisi || u.Divisi || '',
          aksesUnit: Array.isArray(units) ? units : [units],
          permissions: u.permissions || null,
          avatarUrl: u.avatarUrl || u.Avatar || u.avatar || '',
          bio: u.bio || u.Bio || ''
        };
      });

      // 3. Simpan ke LocalStorage sebelum dikembalikan
      localStorage.setItem(CACHE_KEY, JSON.stringify(usersList));
      return usersList;
      
    } catch (err) {
      console.error("Gagal mengambil data users:", err);
      return [];
    }
  },

// 4. Fungsi Pembersihan Cache saat Logout
  clearAllCache() {
    // Hapus semua key cache yang berawalan CACHE_
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('CACHE_')) {
        localStorage.removeItem(key);
      }
    });
    console.log("[Cache] Semua cache lokal berhasil dibersihkan.");
  }
};