import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

// 1. Baca Service Account
const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'));

// 2. Baca data.json
const fileContent = JSON.parse(readFileSync('./data.json', 'utf8'));

// Cari objek yang berisi 'Revenue' secara otomatis
let rawData = fileContent;
if (Array.isArray(fileContent)) {
  rawData = fileContent[0];
}

// Cek apakah data terbungkus di dalam objek lain (misal: { data: { Revenue: ... } })
if (!rawData.Revenue && typeof rawData === 'object') {
  const possibleKey = Object.keys(rawData).find(k => rawData[k] && rawData[k].Revenue);
  if (possibleKey) {
    rawData = rawData[possibleKey];
  }
}

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function seedDatabase() {
  console.log('--- DEBUG INFO ---');
  console.log('Kunci (Keys) yang ditemukan di JSON:', Object.keys(rawData));
  console.log('-------------------\n');

  console.log('Mulai mengunggah data ke Firestore...\n');

  // A. Seed Collection 'revenues'
  if (rawData.Revenue) {
    const batch = db.batch();
    const entries = Object.entries(rawData.Revenue);
    console.log(`📦 Menemukan ${entries.length} data Revenue...`);
    
    entries.forEach(([key, val]) => {
      const docRef = db.collection('revenues').doc();
      batch.set(docRef, {
        Tanggal: val.Tanggal ? val.Tanggal.split('T')[0] : '',
        Unit: val.Unit || '',
        Divisi: val.Divisi || '',
        Platform: val.Platform || '',
        Revenue: val.Revenue || 0
      });
    });
    await batch.commit();
    console.log('✔ Collection "revenues" berhasil diunggah.');
  } else {
    console.log('❌ Data Revenue tidak ditemukan di objek JSON.');
  }

  // B. Seed Collection 'promosi'
  if (rawData.Promo) {
    const batch = db.batch();
    const entries = Object.entries(rawData.Promo);
    console.log(`📦 Menemukan ${entries.length} data Promo...`);

    entries.forEach(([key, val]) => {
      const docRef = db.collection('promosi').doc();
      batch.set(docRef, {
        Tanggal: val.Tanggal ? val.Tanggal.split('T')[0] : '',
        Unit: val.Unit || '',
        BiayaPromosi: val.BiayaPromosi || 0
      });
    });
    await batch.commit();
    console.log('✔ Collection "promosi" berhasil diunggah.');
  }

  // C. Seed Collection 'leads'
  if (rawData.Leads) {
    const batch = db.batch();
    const entries = Object.entries(rawData.Leads);
    console.log(`📦 Menemukan ${entries.length} data Leads...`);

    entries.forEach(([key, val]) => {
      const docRef = db.collection('leads').doc();
      batch.set(docRef, {
        Tanggal: val.Tanggal ? val.Tanggal.split('T')[0] : '',
        Unit: val.Unit || '',
        Campaign: String(val.Campaign || ''),
        DatabaseLeads: val.DatabaseLeads || 0,
        FollowUp: val.FollowUp || 0,
        Pesanan: val.Pesanan || 0
      });
    });
    await batch.commit();
    console.log('✔ Collection "leads" berhasil diunggah.');
  }

  // D. Seed Collection 'users'
  if (rawData.Users) {
    const batch = db.batch();
    const entries = Object.entries(rawData.Users);
    console.log(`📦 Menemukan ${entries.length} data Users...`);

    entries.forEach(([idKey, val]) => {
      const docRef = db.collection('users').doc(idKey);
      batch.set(docRef, {
        nama: val.Nama || '',
        email: val.Email || '',
        password: val.Password || '',
        role: val.Role || 'ADMIN_UNIT',
        aksesUnit: val.Unit === '-' ? ['NHP', 'NHC', 'KG'] : [val.Unit],
        avatarUrl: val.Avatar || ''
      });
    });
    await batch.commit();
    console.log('✔ Collection "users" berhasil diunggah.');
  }

  // E. Seed Collection 'settings'
  if (rawData.MasterData) {
    const master = Object.values(rawData.MasterData)[0];
    await db.collection('settings').doc('targets').set({
      global: Number(Object.keys(rawData.MasterData)[0]) || 19160000000,
      nhp: master.TargetNHP || 0,
      nhc: master.TargetNHC || 0,
      kg: master.TargetKG || 0,
      revenueTahunLalu: master.RevenueTahunLalu || 0
    });
    
    await db.collection('settings').doc('passcode').set({
      code: String(master.KodeAkses || '0')
    });
    console.log('✔ Collection "settings" berhasil diunggah.');
  }

  console.log('\n🚀 Selesai! Silakan cek Firestore Console.');
}

seedDatabase().catch(console.error);