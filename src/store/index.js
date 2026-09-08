// src/store/index.js
import { reactive } from 'vue';
import { api } from '../services/api';

export const store = reactive({
  // Status Akses & UI State Global
  isAccessGranted: false,
  isDarkMode: false,
  isSidebarCollapsed: false,
  isMobileSidebarOpen: false,
  isLoading: false,
  
  currentPage: 'main',
  currentUnit: '',
  
  // Sesi Pengguna
  currentUser: JSON.parse(localStorage.getItem('SESSION_USER')) || null,
  
  // Filter Tanggal Dashboard
  filterDates: {
    start: '2026-01-01',
    end: new Date().toISOString().split('T')[0]
  },

  // Database State Global (Struktur Diselaraskan 100% dengan Dashboard & Modals)
  db: {
    revenue: [],
    promo: [],    // Gunakan 'promo' agar sesuai dengan Dashboard.vue & PagePromo.vue
    leads: [],
    users: [],
    master: {}    // Gunakan 'master' agar sesuai dengan TargetTahunIni & Passcode
  },

  // Centralized Modal Management
  activeModal: null, // 'login', 'revenue', 'target', 'user', 'kodeakses'
  editPayload: null,

  // --- METHODS ---

  // 1. Dark Mode Toggle
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  // 2. Control Modal Pop-up
  openModal(name, payload = null) {
    this.activeModal = name;
    this.editPayload = payload;
  },

  closeModal() {
    this.activeModal = null;
    this.editPayload = null;
  },

  // 3. Load Full Database dari Firestore (via api.js)
  async loadFullDatabase() {
    this.isLoading = true;
    try {
      const res = await api.getAllData();
      this.parseDB(res);
    } catch (err) {
      console.error("Gagal memuat data dari Firestore:", err);
    } finally {
      this.isLoading = false;
    }
  },

  // 4. Parse DB (Sinkronkan Data Firestore ke Reactive State)
  parseDB(data) {
    if (!data) return;
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    
    this.db.revenue = Array.isArray(parsed.revenue) ? parsed.revenue : [];
    this.db.promo = Array.isArray(parsed.promo) ? parsed.promo : (Array.isArray(parsed.promosi) ? parsed.promosi : []);
    this.db.leads = Array.isArray(parsed.leads) ? parsed.leads : [];
    this.db.users = Array.isArray(parsed.users) ? parsed.users : [];
    this.db.master = parsed.master || parsed.settings || {};
  },

  // 5. Autentikasi & Pengelolaan Sesi User
  setCurrentUser(user) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem('SESSION_USER', JSON.stringify(user));
      this.isAccessGranted = true;
    } else {
      localStorage.removeItem('SESSION_USER');
    }
  },

  logout() {
    this.setCurrentUser(null);
    this.isAccessGranted = false;
    this.currentPage = 'main';
  }
});