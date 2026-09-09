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

  // Database State Global
  db: {
    revenue: [],
    promo: [],    // Sesuai dengan Dashboard.vue & PagePromo.vue
    leads: [],
    users: [],
    master: {}    // Sesuai dengan TargetTahunIni & Passcode
  },

  // Centralized Modal & Alert Management
  activeModal: null, // 'login', 'revenue', 'leads', 'promo', 'target', 'user', 'kodeakses', 'alert'
  editPayload: null,
  alertPayload: {
    title: '',
    message: '',
    type: 'info', // 'info', 'success', 'warning'
    onConfirm: null
  },

  // --- METHODS ---

  // 1. Alert Custom Modal Handler
  openAlert(title, message, onConfirm = null, type = 'warning') {
    this.alertPayload = { title, message, onConfirm, type };
    this.activeModal = 'alert';
  },

  closeAlert() {
    this.activeModal = null;
    this.alertPayload = { title: '', message: '', type: 'info', onConfirm: null };
  },

  // 2. Dark Mode Toggle
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  // 3. Control Modal Pop-up
  openModal(name, payload = null) {
    this.activeModal = name;
    this.editPayload = payload;
  },

  closeModal() {
    this.activeModal = null;
    this.editPayload = null;
  },

  // 4. Load Full Database dari Firestore (via api.js)
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

  // 5. Parse DB (Sinkronkan Data Firestore ke Reactive State)
  parseDB(data) {
    if (!data) return;
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    
    this.db.revenue = Array.isArray(parsed.revenue) ? parsed.revenue : [];
    this.db.promo = Array.isArray(parsed.promo) ? parsed.promo : (Array.isArray(parsed.promosi) ? parsed.promosi : []);
    this.db.leads = Array.isArray(parsed.leads) ? parsed.leads : [];
    this.db.users = Array.isArray(parsed.users) ? parsed.users : [];
    this.db.master = parsed.master || parsed.settings || {};
  },

  // 6. Autentikasi & Pengelolaan Sesi User
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