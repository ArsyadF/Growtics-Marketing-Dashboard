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
      
      let validCode = "0"; // Fallback default
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
          permissions: dData.permissions || null, // FIX: TAMBAHKAN INI
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

  // 3. Ambil Seluruh Data Database
  async getAllData() {
    try {
      const [revSnap, promoSnap, leadsSnap, usersSnap, targetSnap, passcodeSnap] = await Promise.all([
        getDocs(collection(firestoreDb, "revenues")),
        getDocs(collection(firestoreDb, "promosi")),
        getDocs(collection(firestoreDb, "leads")),
        getDocs(collection(firestoreDb, "users")),
        getDoc(doc(firestoreDb, "settings", "targets")),
        getDoc(doc(firestoreDb, "settings", "passcode"))
      ]);

      const revenue = revSnap.docs.map(d => ({ Timestamp: d.id, ...d.data() }));
      const promo = promoSnap.docs.map(d => ({ Timestamp: d.id, ...d.data() }));
      const leads = leadsSnap.docs.map(d => ({ Timestamp: d.id, ...d.data() }));
      
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
          permissions: u.permissions || null, // FIX: TAMBAHKAN INI
          avatarUrl: u.avatarUrl || u.Avatar || u.avatar || '',
          password: u.password || u.Password || '',
          bio: u.bio || u.Bio || ''
        };
      });
      
      let master = {};
      if (targetSnap.exists()) {
        const tData = targetSnap.data();
        const targetNHP = Number(tData.TargetNHP || 0);
        const targetNHC = Number(tData.TargetNHC || 0);
        const targetKG = Number(tData.TargetKG || 0);
        
        master = {
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

      return { revenue, promo, leads, users, master };
    } catch (err) {
      console.error("Error fetching Firestore data:", err);
      return { revenue: [], promo: [], leads: [], users: [], master: {} };
    }
  },

  // 4. Simpan Data Baru
  async saveData(sheetName, payload) {
    try {
      const collectionMap = {
        'Revenue': 'revenues',
        'Promo': 'promosi',
        'Leads': 'leads',
        'Users': 'users'
      };
      const colName = collectionMap[sheetName] || sheetName.toLowerCase();
      const docRef = await addDoc(collection(firestoreDb, colName), payload);
      return { success: true, message: `Data ${sheetName} berhasil ditambahkan!`, id: docRef.id };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  // 5. Update Data Dokumen
  async updateData(sheetName, docId, payload) {
    try {
      const collectionMap = {
        'Revenue': 'revenues',
        'Promo': 'promosi',
        'Leads': 'leads',
        'Users': 'users'
      };
      const colName = collectionMap[sheetName] || sheetName.toLowerCase();
      const docRef = doc(firestoreDb, colName, docId);
      await updateDoc(docRef, payload);
      return { success: true, message: `Data ${sheetName} berhasil diperbarui!` };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  // 6. Hapus Data Dokumen
  async deleteData(sheetName, docId) {
    try {
      const collectionMap = {
        'Revenue': 'revenues',
        'Promo': 'promosi',
        'Leads': 'leads',
        'Users': 'users'
      };
      const colName = collectionMap[sheetName] || sheetName.toLowerCase();
      await deleteDoc(doc(firestoreDb, colName, docId));
      return { success: true, message: `Data ${sheetName} berhasil dihapus!` };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  // 7. Simpan/Update Target & Passcode ke Dokumen Settings di Firestore
  async saveMasterTargets(masterPayload) {
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

      return { success: true, message: "Target & Passcode berhasil diperbarui!" };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }
};