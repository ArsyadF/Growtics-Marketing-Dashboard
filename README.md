🚀 Changelog Update Versi 2.0 (v2.0)

🎨 1. Refactoring UI & Design System
Tri-Mode Theme Engine: Mengimplementasikan sistem preferensi tema dinamis 3 opsi (Light / Dark / System OS) dengan sinkronisasi real-time ke sistem operasi.

Dynamic Accent Color Palette: Penambahan kustomisasi warna aksen visual (Hijau, Kuning, Biru, Pink Rose, Tosca, Merah, & Color Wheel bebas) berbasis CSS Variables (--primary-color, --primary-light, --primary-text) yang diterapkan ke seluruh komponen web.

Flat Minimalist & Glassmorphic Redesign: Penyelarasan gaya kartu visual Glassmorphism dengan tombol dan modal berkonsep Flat Minimalist.

Compact Header & Dynamic Titles: Restrukturisasi Header dengan judul halaman dinamis, filter tanggal terintegrasi, serta tombol switch tema yang ringkas.

💻 2. Arsitektur State & Core Engine
Pembersihan Modul Store (store/index.js): Eliminasi duplikasi properti state, konsolidasi inisialisasi tema (initTheme, initThemeColor), serta sentralisasi fungsi sinkronisasi session persistence localStorage.

Sistem Navigasi & WebView Android Bridge:

Penambahan penanganan tombol Back HP Android (window.handleAndroidBack) yang konsisten mengembalikan nilai balik (boolean string) ke WebView MainActivity.kt.

Pengelolaan riwayat navigasi (Page Stack History) agar navigasi dalam aplikasi tidak berulang (looping).

📊 3. Perbaikan Dashboard & Visualisasi Data
Header Kinerja Finansial Compact:

Pengoptimalan tata letak dari bertumpuk menjadi ultra-compact horizontal/baseline alignment (justify-start & items-end).

Penambahan helper formatRpDynamic untuk meringkas angka nominal besar (jt/M) di layar mobile HP agar tidak terpotong.

Semi-Doughnut Chart (Setengah Donat): Refactoring Chart.js pada diagram platform penjualan menjadi bentuk gauge speedometer (rotation: -90, circumference: 180, cutout: '65%') dengan penyesuaian tinggi kontainer responsif (h-36 / h-40).

Rekap Performa Unit Usaha (4-Baris Berhirarki):

Restrukturisasi grid layout mobile menjadi 1 kartu penuh di atas (Unit NHP) dan 2 kartu berdampingan di bawah (NHC & KG).

Penonjolan kontras visual pada nominal Revenue (Hero Value) dan integrasi Dynamic Progress Bar Ketercapaian Target.

🧭 4. Komponen & Navigasi
Sidebar Navigasi Gaya macOS/Minimalist:

Penyederhanaan item menu dengan latar indikator aktif pill-shaped gradient (bg-theme-gradient text-white shadow-md).

Perapihan kategori hirarki menu (Workspace, Unit Usaha, Lainnya, Admin) serta widget profil pengguna di bagian bawah.

Modals & Real-time Notification System (Awal):

Sentralisasi modal CRUD (Revenue, Leads, Promo, User, Target, Passcode) lengkap dengan input formatter mata uang ribuan.

Penambahan ikon lonceng notifikasi di Header dengan pop-up dialog, badge angka unread count, dan riwayat aktivitas transaksi.
