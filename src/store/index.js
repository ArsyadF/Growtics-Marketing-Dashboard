// src/store/index.js
import { reactive } from 'vue';
import { api } from '../services/api';

export const store = reactive({
  // ==========================================
  // 1. STATE & KONFIGURASI GLOBAL
  // ==========================================
  isAccessGranted: false,
  isSidebarCollapsed: false,
  isMobileSidebarOpen: false,
  isLoading: false,
  
  currentPage: 'main',
  currentUnit: '',
  
  currentUser: JSON.parse(localStorage.getItem('SESSION_USER')) || null,
  
  filterDates: {
    start: '2026-01-01',
    end: new Date().toISOString().split('T')[0]
  },

  db: {
    revenue: [],
    promo: [],
    leads: [],
    users: [],
    programs: [],
    aduanList: [], 
    spvReports: [], 
    master: {}    
  },

  // ==========================================
  // 2. STATE & METHODS MODAL/ALERT
  // ==========================================
  activeModal: null, 
  selectedItemForEdit: null,
  editPayload: null,
  alertPayload: {
    title: '',
    message: '',
    type: 'info', 
    onConfirm: null
  },

  openAlert(title, message, onConfirm = null, type = 'warning') {
    this.alertPayload = { title, message, onConfirm, type };
    this.activeModal = 'alert';
  },

  closeAlert() {
    this.activeModal = null;
    this.alertPayload = { title: '', message: '', type: 'info', onConfirm: null };
  },

  openModal(modalName, itemData = null) {
    this.activeModal = modalName;
    this.selectedItemForEdit = itemData;
  },

  closeModal() {
    this.activeModal = null;
    this.selectedItemForEdit = null;
  },

  toggleSidebarCollapse() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  },

  // ==========================================
  // 3. STATE & METHODS TEMA (UI)
  // ==========================================
  themePreference: localStorage.getItem('THEME_PREFERENCE') || 'system',
  isDarkMode: false,
  activeThemeColor: localStorage.getItem('APP_THEME_COLOR') || '#149B73',

  colorPresets: [
    { id: 'green', name: 'Hijau', hex: '#0db988', lightHex: '#2EE59D' },
    { id: 'orange', name: 'Kuning Oranye', hex: '#F59E0B', lightHex: '#FBBF24' },
    { id: 'blue', name: 'Biru', hex: '#3195ff', lightHex: '#59b4ff' },
    { id: 'rose', name: 'Pink', hex: '#ef476b', lightHex: '#ff889a' },
    { id: 'tosca', name: 'Tosca', hex: '#0D9488', lightHex: '#2DD4BF' },
    { id: 'red', name: 'Merah', hex: '#DC2626', lightHex: '#F87171' }
  ],

  initTheme() {
    const savedTheme = localStorage.getItem('THEME_PREFERENCE') || 'system';
    this.setTheme(savedTheme);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (this.themePreference === 'system') {
        this.applyTheme(e.matches);
      }
    });
  },

  setTheme(pref) {
    this.themePreference = pref;
    localStorage.setItem('THEME_PREFERENCE', pref);

    if (pref === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.applyTheme(systemDark);
    } else {
      this.applyTheme(pref === 'dark');
    }
  },

  applyTheme(isDark) {
    this.isDarkMode = isDark;
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  toggleDarkMode() {
    this.setTheme(this.isDarkMode ? 'light' : 'dark');
  },

  setThemeColor(hexColor, lightHexColor = null) {
    this.activeThemeColor = hexColor;
    localStorage.setItem('APP_THEME_COLOR', hexColor);

    const lightColor = lightHexColor || hexColor;
    document.documentElement.style.setProperty('--primary-color', hexColor);
    document.documentElement.style.setProperty('--primary-light', lightColor);
    document.documentElement.style.setProperty('--primary-text', hexColor);
  },

  initThemeColor() {
    const savedColor = localStorage.getItem('APP_THEME_COLOR') || '#149B73';
    const preset = this.colorPresets.find((p) => p.hex === savedColor);
    if (preset) {
      this.setThemeColor(preset.hex, preset.lightHex);
    } else {
      this.setThemeColor(savedColor);
    }
  },

  // ==========================================
  // 4. STATE & METHODS NOTIFIKASI
  // ==========================================
  notifications: JSON.parse(localStorage.getItem('APP_NOTIFICATIONS')) || [
    { id: 1, title: 'Sistem Siap', message: 'Selamat datang di Dashboard Marketing', time: 'Baru saja', read: false }
  ],

  addNotification(title, message, type = 'info') {
    const newNotif = {
      id: Date.now(),
      title,
      message,
      type,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      read: false
    };

    this.notifications.unshift(newNotif);
    if (this.notifications.length > 20) {
      this.notifications.pop();
    }
    localStorage.setItem('APP_NOTIFICATIONS', JSON.stringify(this.notifications));
  },

  markAllNotifsAsRead() {
    this.notifications.forEach(n => n.read = true);
    localStorage.setItem('APP_NOTIFICATIONS', JSON.stringify(this.notifications));
  },

  clearNotifications() {
    this.notifications = [];
    localStorage.removeItem('APP_NOTIFICATIONS');
  },

  // ==========================================
  // 5. DATABASE & USER SESSION OPERATIONS
  // ==========================================
  async loadFullDatabase() {
    this.isLoading = true;
    try {
      const res = await api.getAllData();
      this.parseDB(res);

      if (this.currentUser && this.currentUser.email) {
        const foundUser = this.db.users.find(u => 
          (u.email && u.email.toLowerCase() === this.currentUser.email.toLowerCase()) || 
          (u.Email && u.Email.toLowerCase() === this.currentUser.email.toLowerCase())
        );
        if (foundUser) {
          this.setCurrentUser({
            ...this.currentUser,
            ...foundUser
          });
        }
      }
    } catch (err) {
      console.error("Gagal memuat data dari Firestore:", err);
    } finally {
      this.isLoading = false;
    }
  },

  parseDB(data) {
    if (!data) return;
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;

    this.db.revenue = Array.isArray(parsed.revenue) ? parsed.revenue : [];
    this.db.promo = Array.isArray(parsed.promo) ? parsed.promo : (Array.isArray(parsed.promosi) ? parsed.promosi : []);
    this.db.leads = Array.isArray(parsed.leads) ? parsed.leads : [];
    this.db.users = Array.isArray(parsed.users) ? parsed.users : [];
    this.db.programs = Array.isArray(parsed.programs) ? parsed.programs : [];
    this.db.master = parsed.master || parsed.settings || {};
    
    const rawAduan = Array.isArray(parsed.aduanList) 
      ? parsed.aduanList 
      : (Array.isArray(parsed.aduan) ? parsed.aduan : []);

    this.db.aduanList = rawAduan.map(item => ({
      ...item,
      imageUrl: item.imageUrl || item.ImageUrl || item.image || item.Image || ""
    }));

    this.db.spvReports = Array.isArray(parsed.spvReports) 
      ? parsed.spvReports 
      : (Array.isArray(parsed.spv_reports) ? parsed.spv_reports : []);
  },

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
  },

  // ==========================================
  // 6. ROUTING & PERMISSIONS
  // ==========================================
  navigate(page) {
    this.currentPage = page;
    window.history.pushState({ page: page }, "", `#${page}`);
  },

  canAccessPage(pageKey) {
    if (pageKey === 'profile') return true;
    if (!this.isAccessGranted) return false;
    if (!this.currentUser) return pageKey === 'main';

    const role = (this.currentUser.role || this.currentUser.Role || '').toUpperCase();
    if (role === 'SUPERADMIN') return true;

    if (this.currentUser.permissions && this.currentUser.permissions[pageKey]) {
      return !!this.currentUser.permissions[pageKey].access;
    }

    return true; 
  },

  canEditPage(pageId) {
    if (!this.currentUser) return false;
    
    const role = (this.currentUser.role || this.currentUser.Role || '').toUpperCase();
    if (role === 'SUPERADMIN') return true;
    
    const perms = this.currentUser.permissions;
    if (perms) {
      return !!(perms[pageId]?.access && perms[pageId]?.canEdit);
    }
    
    if (pageId.startsWith('revenue') || pageId.startsWith('leads') || pageId.startsWith('promo')) {
      return true; 
    }

    return false;
  },

  canExportImport() {
    if (!this.currentUser) return false;
    const role = String(this.currentUser.role || this.currentUser.Role || '').toUpperCase();
    
    return ['SUPERADMIN', 'ADMIN_UNIT', 'ADMIN', 'SPV'].includes(role);
  }
});