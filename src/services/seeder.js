// src/services/seeder.js
import { db as firestoreDb } from './firebase';
import { setDoc, doc } from 'firebase/firestore';

const jsonData = {
  "Revenue": {
    "Tue Aug 25 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-01-30T17:00:00.000Z", "Unit": "NHC", "Divisi": "CS Deal", "Platform": "WhatsApp", "Revenue": 104510000 },
    "Wed Aug 26 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-02-27T17:00:00.000Z", "Unit": "NHC", "Divisi": "CS Deal", "Platform": "WhatsApp", "Revenue": 153319700 },
    "Thu Aug 27 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-03-30T17:00:00.000Z", "Unit": "NHC", "Divisi": "CS Deal", "Platform": "WhatsApp", "Revenue": 79851415 },
    "Fri Aug 28 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-04-29T17:00:00.000Z", "Unit": "NHC", "Divisi": "CS Deal", "Platform": "WhatsApp", "Revenue": 296746588 },
    "Sat Aug 29 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-05-30T17:00:00.000Z", "Unit": "NHC", "Divisi": "CS Deal", "Platform": "WhatsApp", "Revenue": 350351000 },
    "Sun Aug 30 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-06-29T17:00:00.000Z", "Unit": "NHC", "Divisi": "CS Deal", "Platform": "WhatsApp", "Revenue": 239614125 },
    "Mon Aug 31 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-07-30T17:00:00.000Z", "Unit": "NHC", "Divisi": "CS Deal", "Platform": "WhatsApp", "Revenue": 105907125 },
    "Tue Sep 01 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-08-25T17:00:00.000Z", "Unit": "NHC", "Divisi": "CS Deal", "Platform": "WhatsApp", "Revenue": 54943800 },
    "Wed Sep 02 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-01-30T17:00:00.000Z", "Unit": "KG", "Divisi": "CS Deal", "Platform": "WhatsApp", "Revenue": 107925000 },
    "Thu Sep 03 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-02-27T17:00:00.000Z", "Unit": "KG", "Divisi": "CS Deal", "Platform": "WhatsApp", "Revenue": 220250 },
    "Fri Sep 04 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-03-30T17:00:00.000Z", "Unit": "KG", "Divisi": "CS Deal", "Platform": "WhatsApp", "Revenue": 2264250 },
    "Sat Sep 05 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-04-29T17:00:00.000Z", "Unit": "KG", "Divisi": "CS Deal", "Platform": "WhatsApp", "Revenue": 10545800 },
    "Sun Sep 06 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-05-30T17:00:00.000Z", "Unit": "KG", "Divisi": "CS Deal", "Platform": "WhatsApp", "Revenue": 2114450 },
    "Mon Sep 07 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-06-29T17:00:00.000Z", "Unit": "KG", "Divisi": "CS Deal", "Platform": "WhatsApp", "Revenue": 16706090 },
    "Tue Sep 08 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-07-30T17:00:00.000Z", "Unit": "KG", "Divisi": "CS Deal", "Platform": "WhatsApp", "Revenue": 345197765 },
    "Wed Sep 09 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-08-25T17:00:00.000Z", "Unit": "KG", "Divisi": "CS Deal", "Platform": "WhatsApp", "Revenue": 37109815 },
    "Thu Sep 10 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-01-30T17:00:00.000Z", "Unit": "NHP", "Divisi": "Zona 1A", "Platform": "WhatsApp", "Revenue": 184080150 },
    "Fri Sep 11 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-02-27T17:00:00.000Z", "Unit": "NHP", "Divisi": "Zona 1A", "Platform": "WhatsApp", "Revenue": 80718875 },
    "Sat Sep 12 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-03-30T17:00:00.000Z", "Unit": "NHP", "Divisi": "Zona 1A", "Platform": "WhatsApp", "Revenue": 11690475 },
    "Sun Sep 13 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-04-29T17:00:00.000Z", "Unit": "NHP", "Divisi": "Zona 1A", "Platform": "WhatsApp", "Revenue": 196374725 },
    "Mon Sep 14 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-05-30T17:00:00.000Z", "Unit": "NHP", "Divisi": "Zona 1A", "Platform": "WhatsApp", "Revenue": 591593880 },
    "Tue Sep 15 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-06-29T17:00:00.000Z", "Unit": "NHP", "Divisi": "Zona 1A", "Platform": "WhatsApp", "Revenue": 524791150 },
    "Wed Sep 16 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-07-30T17:00:00.000Z", "Unit": "NHP", "Divisi": "Zona 1A", "Platform": "WhatsApp", "Revenue": 402595975 },
    "Thu Sep 17 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-08-25T17:00:00.000Z", "Unit": "NHP", "Divisi": "Zona 1A", "Platform": "WhatsApp", "Revenue": 44274800 },
    "Fri Sep 18 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-01-30T17:00:00.000Z", "Unit": "NHP", "Divisi": "Zona 1B", "Platform": "WhatsApp", "Revenue": 52899525 },
    "Sat Sep 19 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-02-27T17:00:00.000Z", "Unit": "NHP", "Divisi": "Zona 1B", "Platform": "WhatsApp", "Revenue": 41177700 },
    "Sun Sep 20 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-03-30T17:00:00.000Z", "Unit": "NHP", "Divisi": "Zona 1B", "Platform": "WhatsApp", "Revenue": 2675750 },
    "Mon Sep 21 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-04-29T17:00:00.000Z", "Unit": "NHP", "Divisi": "Zona 1B", "Platform": "WhatsApp", "Revenue": 313136255 },
    "Tue Sep 22 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-05-30T17:00:00.000Z", "Unit": "NHP", "Divisi": "Zona 1B", "Platform": "WhatsApp", "Revenue": 260438550 },
    "Wed Sep 23 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-06-29T17:00:00.000Z", "Unit": "NHP", "Divisi": "Zona 1B", "Platform": "WhatsApp", "Revenue": 567352675 },
    "Thu Sep 24 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-07-30T17:00:00.000Z", "Unit": "NHP", "Divisi": "Zona 1B", "Platform": "WhatsApp", "Revenue": 151670725 },
    "Fri Sep 25 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-08-25T17:00:00.000Z", "Unit": "NHP", "Divisi": "Zona 1B", "Platform": "WhatsApp", "Revenue": 23991075 },
    "Sat Sep 26 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-01-30T17:00:00.000Z", "Unit": "NHP", "Divisi": "Zona 2", "Platform": "WhatsApp", "Revenue": 149642525 },
    "Sun Sep 27 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-02-27T17:00:00.000Z", "Unit": "NHP", "Divisi": "Zona 2", "Platform": "WhatsApp", "Revenue": 259611325 },
    "Mon Sep 28 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-03-30T17:00:00.000Z", "Unit": "NHP", "Divisi": "Zona 2", "Platform": "WhatsApp", "Revenue": 320809900 },
    "Tue Sep 29 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-04-29T17:00:00.000Z", "Unit": "NHP", "Divisi": "Zona 2", "Platform": "WhatsApp", "Revenue": 753777425 },
    "Wed Sep 30 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-05-30T17:00:00.000Z", "Unit": "NHP", "Divisi": "Zona 2", "Platform": "WhatsApp", "Revenue": 1014588085 },
    "Thu Oct 01 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-06-29T17:00:00.000Z", "Unit": "NHP", "Divisi": "Zona 2", "Platform": "WhatsApp", "Revenue": 1136083600 },
    "Fri Oct 02 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-07-30T17:00:00.000Z", "Unit": "NHP", "Divisi": "Zona 2", "Platform": "WhatsApp", "Revenue": 970771010 },
    "Sat Oct 03 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-08-25T17:00:00.000Z", "Unit": "NHP", "Divisi": "Zona 2", "Platform": "WhatsApp", "Revenue": 241385870 },
    "Sun Oct 04 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-01-30T17:00:00.000Z", "Unit": "NHP", "Divisi": "Zona 3", "Platform": "WhatsApp", "Revenue": 103077500 },
    "Mon Oct 05 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-02-27T17:00:00.000Z", "Unit": "NHP", "Divisi": "Zona 3", "Platform": "WhatsApp", "Revenue": 376481800 },
    "Tue Oct 06 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-03-30T17:00:00.000Z", "Unit": "NHP", "Divisi": "Zona 3", "Platform": "WhatsApp", "Revenue": 140686420 },
    "Wed Oct 07 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-04-29T17:00:00.000Z", "Unit": "NHP", "Divisi": "Zona 3", "Platform": "WhatsApp", "Revenue": 726199350 },
    "Thu Oct 08 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-05-30T17:00:00.000Z", "Unit": "NHP", "Divisi": "Zona 3", "Platform": "WhatsApp", "Revenue": 640870325 },
    "Fri Oct 09 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-06-29T17:00:00.000Z", "Unit": "NHP", "Divisi": "Zona 3", "Platform": "WhatsApp", "Revenue": 474724800 },
    "Sat Oct 10 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-07-30T17:00:00.000Z", "Unit": "NHP", "Divisi": "Zona 3", "Platform": "WhatsApp", "Revenue": 642259010 },
    "Sun Oct 11 2026 15:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-08-25T17:00:00.000Z", "Unit": "NHP", "Divisi": "Zona 3", "Platform": "WhatsApp", "Revenue": 70975300 }
  },
  "Promo": {
    "ID_1787712451013": { "Tanggal": "2026-01-30T17:00:00.000Z", "Unit": "NHP", "BiayaPromosi": 188852647 },
    "ID_1787712572059": { "Tanggal": "2026-02-27T17:00:00.000Z", "Unit": "NHP", "BiayaPromosi": 163294123 },
    "ID_1787713034565": { "Tanggal": "2026-03-30T17:00:00.000Z", "Unit": "NHP", "BiayaPromosi": 67064334 },
    "ID_1787713088005": { "Tanggal": "2026-04-29T17:00:00.000Z", "Unit": "NHP", "BiayaPromosi": 43587087 },
    "ID_1787713158473": { "Tanggal": "2026-05-30T17:00:00.000Z", "Unit": "NHP", "BiayaPromosi": 15555841 },
    "ID_1787713253508": { "Tanggal": "2026-06-29T17:00:00.000Z", "Unit": "NHP", "BiayaPromosi": 12674251 }
  },
  "Leads": {
    "Tue Aug 25 2026 21:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-01-30T17:00:00.000Z", "Unit": "NHP", "Campaign": 971, "DatabaseLeads": 396, "FollowUp": 45799, "Pesanan": 260 },
    "Wed Aug 26 2026 21:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-02-27T17:00:00.000Z", "Unit": "NHP", "Campaign": 128, "DatabaseLeads": 300, "FollowUp": 19877, "Pesanan": 154 },
    "Thu Aug 27 2026 21:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-03-30T17:00:00.000Z", "Unit": "NHP", "Campaign": 37329, "DatabaseLeads": 377, "FollowUp": 4540, "Pesanan": 33 },
    "Fri Aug 28 2026 21:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-04-29T17:00:00.000Z", "Unit": "NHP", "Campaign": 2818, "DatabaseLeads": 576, "FollowUp": 41574, "Pesanan": 90 },
    "Sat Aug 29 2026 21:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-05-30T17:00:00.000Z", "Unit": "NHP", "Campaign": 1824, "DatabaseLeads": 457, "FollowUp": 5994, "Pesanan": 102 },
    "Sun Aug 30 2026 21:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-06-29T17:00:00.000Z", "Unit": "NHP", "Campaign": 2549, "DatabaseLeads": 610, "FollowUp": 7563, "Pesanan": 173 },
    "Mon Aug 31 2026 21:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-07-30T17:00:00.000Z", "Unit": "NHP", "Campaign": 2748, "DatabaseLeads": 670, "FollowUp": 6807, "Pesanan": 312 },
    "Tue Sep 01 2026 21:09:12 GMT-0400 (Waktu Musim Panas Timur)": { "Tanggal": "2026-08-25T17:00:00.000Z", "Unit": "NHP", "Campaign": 7221, "DatabaseLeads": 445, "FollowUp": 4884, "Pesanan": 129 }
  },
  "Users": {
    "USR_1": {
      "nama": "Wafa Arsyada",
      "email": "admin@marketing.com",
      "password": "admin123",
      "role": "SUPERADMIN",
      "aksesUnit": ["NHP", "NHC", "KG"],
      "avatarUrl": "https://lh3.googleusercontent.com/ogw/AF2bZyhE_XfijAKtvttI4cqqlsislAGitO5E_MqYyLzpih1CVI=s64-c-mo"
    },
    "USR_1787798119406": {
      "nama": "Winda Annisa",
      "email": "nhp@marketing.com",
      "password": "admin123",
      "role": "ADMIN_UNIT",
      "aksesUnit": ["NHP"],
      "avatarUrl": "https://ui-avatars.com/api/?name=Admin%20NHP"
    },
    "USR_1787798171007": {
      "nama": "Hanifah",
      "email": "nhc@marketing.com",
      "password": "admin123",
      "role": "ADMIN_UNIT",
      "aksesUnit": ["NHC"],
      "avatarUrl": "https://ui-avatars.com/api/?name=Hanifah"
    },
    "USR_1787801309643": {
      "nama": "Admin KG",
      "email": "kg@marketing.com",
      "password": "admin123",
      "role": "ADMIN_UNIT",
      "aksesUnit": ["KG"],
      "avatarUrl": "https://ui-avatars.com/api/?name=Admin%20KG"
    }
  }
};

export async function seedDatabase() {
  console.log("Memulai migrasi data ke Firestore...");

  // 1. Seed Revenues
  for (const [key, item] of Object.entries(jsonData.Revenue || {})) {
    await setDoc(doc(firestoreDb, "revenues", key), item);
  }

  // 2. Seed Promosi
  for (const [key, item] of Object.entries(jsonData.Promo || {})) {
    await setDoc(doc(firestoreDb, "promosi", key), item);
  }

  // 3. Seed Leads
  for (const [key, item] of Object.entries(jsonData.Leads || {})) {
    await setDoc(doc(firestoreDb, "leads", key), item);
  }

  // 4. Seed Users (Sesuai skema Firestore: nama, email, role, aksesUnit, avatarUrl)
  for (const [key, item] of Object.entries(jsonData.Users || {})) {
    await setDoc(doc(firestoreDb, "users", key), item);
  }

  // 5. Seed Settings (passcode & targets)
  await setDoc(doc(firestoreDb, "settings", "passcode"), { code: "0" });
  await setDoc(doc(firestoreDb, "settings", "targets"), {
    TargetNHP: 10491778328,
    TargetNHC: 1311472291,
    TargetKG: 1311472291,
    RevenueTahunLalu: 13114722910,
    TargetTahunIni: 13114722910
  });

  console.log("Migrasi Data ke Firestore Selesai!");
}