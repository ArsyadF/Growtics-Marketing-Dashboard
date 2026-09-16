<!-- src/views/PageNote.vue -->
<template>
  <div class="space-y-4 md:space-y-6">
    <!-- Header Halaman & Tombol Buat Catatan -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-card p-4 md:p-5 rounded-2xl">
      <div>
        <h3 class="text-sm md:text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <i class="fa-solid fa-note-sticky text-theme"></i>
          Notes Multi-Model
        </h3>
        <p class="text-[11px] md:text-xs text-slate-400 mt-0.5">
          Dukungan To-Do checklist, upload/paste gambar, rich format (bold, numbering), dan pilihan gaya kartu.
        </p>
      </div>

      <button 
        @click="openAddModal" 
        type="button"
        class="bg-theme-gradient hover:bg-theme-gradient text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
      >
        <i class="fa-solid fa-plus text-xs"></i>
        <span>Tambah Catatan</span>
      </button>
    </div>

    <!-- Filter & Pencarian Catatan -->
    <div class="flex items-center gap-3">
      <div class="relative flex-1">
        <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari catatan, isi to-do, atau ide..." 
          class="w-full glass-input rounded-xl pl-9 pr-4 py-2 text-xs outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
        >
      </div>
    </div>

    <!-- State Loading Data Catatan -->
    <div v-if="isLoadingNotes" class="glass-card p-12 text-center rounded-3xl space-y-3">
      <i class="fa-solid fa-circle-notch fa-spin text-2xl text-theme"></i>
      <p class="text-xs font-semibold text-slate-500">Memuat catatan pribadi...</p>
    </div>

    <!-- GRID LIST CATATAN (DENGAN VARIASI MODEL KARTU) -->
    <div v-else-if="filteredNotes.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
      <div 
        v-for="note in filteredNotes" 
        :key="note.id" 
        class="glass-card p-4 rounded-2xl flex flex-col justify-between transition-all group relative overflow-hidden border"
        :class="getCardStyleClass(note.cardStyle)"
      >
        <div>
          <!-- Header Card (Kategori, Style Badge, & Tanggal) -->
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-1.5">
              <span class="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full text-theme bg-emerald-500/10 border border-theme">
                {{ note.category || 'Umum' }}
              </span>
              <span class="text-[8px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase">
                {{ getStyleLabel(note.cardStyle) }}
              </span>
            </div>
            <span class="text-[10px] text-slate-400">{{ note.date }}</span>
          </div>

          <!-- Judul Catatan -->
          <h4 class="font-bold text-slate-800 dark:text-slate-100 text-sm mb-2 line-clamp-1">
            {{ note.title }}
          </h4>

          <!-- MODEL 1: TO-DO CHECKLIST CARD -->
          <div v-if="note.cardStyle === 'checklist'" class="space-y-1.5 my-2 max-h-44 overflow-y-auto pr-1">
            <div 
              v-for="(item, tIdx) in note.todos" 
              :key="tIdx"
              @click.stop="toggleTodoItem(note, tIdx)"
              class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer text-xs transition-colors"
            >
              <i class="fa-solid" :class="item.done ? 'fa-square-check text-theme' : 'fa-square text-slate-300 dark:text-slate-600'"></i>
              <span class="truncate" :class="{ 'line-through text-slate-400 dark:text-slate-500': item.done }">
                {{ item.text }}
              </span>
            </div>
          </div>

          <!-- MODEL 2 & 3: STANDAR / HIGHLIGHT RICH TEXT CONTENT -->
          <div 
            v-else
            class="text-xs text-slate-600 dark:text-slate-300 line-clamp-6 leading-relaxed prose dark:prose-invert max-w-none"
            v-html="note.content"
          ></div>

          <!-- THUMBNAIL GAMBAR KARTU (JIKA ADA GAMBAR) -->
          <div v-if="note.images && note.images.length > 0" class="flex gap-1.5 mt-2.5 overflow-x-auto pb-1">
            <img 
              v-for="(img, iIdx) in note.images" 
              :key="iIdx" 
              :src="img" 
              class="w-14 h-14 object-cover rounded-lg border border-slate-200 dark:border-slate-700" 
            />
          </div>
        </div>

        <!-- Action Buttons Footer -->
        <div class="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
          <button 
            @click="openEditModal(note)" 
            type="button"
            class="p-1.5 text-slate-400 hover:text-amber-500 transition-colors cursor-pointer text-xs"
            title="Edit Catatan"
          >
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button 
            @click="confirmDeleteNote(note)" 
            type="button"
            class="p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer text-xs"
            title="Hapus Catatan"
          >
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- State Jika Catatan Kosong -->
    <div v-else class="glass-card p-12 text-center rounded-3xl space-y-3">
      <i class="fa-solid fa-note-sticky text-4xl text-slate-300 dark:text-slate-700 mb-1"></i>
      <h4 class="font-bold text-sm text-slate-700 dark:text-slate-300">Belum Ada Catatan</h4>
      <p class="text-xs text-slate-400 max-w-xs mx-auto">
        Buat to-do list, ide produk, atau ringkasan rapat dengan format tebal & paste gambar.
      </p>
    </div>

    <!-- MODAL FORM CATATAN MULTI-MODEL -->
    <Teleport to="body">
      <div 
        v-if="isModalOpen" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        @click.self="isModalOpen = false"
      >
        <div class="w-full max-w-lg glass-card bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl space-y-4 border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
          
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 class="font-bold text-slate-800 dark:text-slate-100 text-sm">
              {{ isEdit ? 'Edit Catatan' : 'Buat Catatan Baru' }}
            </h3>
            <button type="button" @click="isModalOpen = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <form @submit.prevent="saveNote" class="space-y-4 text-xs">
            
            <!-- Judul Catatan -->
            <div>
              <label class="block text-slate-500 dark:text-slate-400 font-medium mb-1">Judul Catatan:</label>
              <input 
                v-model="form.title" 
                type="text" 
                required 
                placeholder="Misal: Draft Strategi Marketing NHP" 
                class="w-full glass-input rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-600 font-bold"
              >
            </div>

            <!-- Kategori & Pilihan Model Kartu Visual -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-slate-500 dark:text-slate-400 font-medium mb-1">Kategori:</label>
                <select v-model="form.category" class="w-full glass-input rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 dark:bg-slate-800 outline-none">
                  <option value="Umum">Umum</option>
                  <option value="Ide Konten">Ide Konten</option>
                  <option value="To-Do List">To-Do List</option>
                  <option value="Rapat">Rapat / Evaluasi</option>
                </select>
              </div>

              <div>
                <label class="block text-slate-500 dark:text-slate-400 font-medium mb-1">Model / Tampilan Kartu:</label>
                <select v-model="form.cardStyle" class="w-full glass-input rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 dark:bg-slate-800 outline-none font-semibold text-theme">
                  <option value="standard">Teks & Rich Format</option>
                  <option value="checklist">To-Do Checklist</option>
                  <option value="highlight">Highlight (Sticky Note)</option>
                  <option value="minimal">Minimalis</option>
                </select>
              </div>
            </div>

            <!-- JIKA MODEL TO-DO CHECKLIST CHOSEN -->
            <div v-if="form.cardStyle === 'checklist'" class="space-y-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              <label class="block text-slate-700 dark:text-slate-200 font-bold mb-1">Daftar Tugas (Checklist):</label>
              
              <div v-for="(todo, index) in form.todos" :key="index" class="flex items-center gap-2">
                <input type="checkbox" v-model="todo.done" class="accent-emerald-600 rounded cursor-pointer">
                <input 
                  type="text" 
                  v-model="todo.text" 
                  placeholder="Nama tugas..." 
                  class="flex-1 glass-input rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-100 outline-none"
                >
                <button type="button" @click="removeTodoRow(index)" class="text-rose-500 hover:text-rose-700 p-1">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>

              <button 
                type="button" 
                @click="addTodoRow" 
                class="text-theme font-bold text-[11px] flex items-center gap-1 hover:underline pt-1 cursor-pointer"
              >
                <i class="fa-solid fa-plus text-[10px]"></i> Tambah Baris Task
              </button>
            </div>

            <!-- JIKA MODEL TEXT / RICH FORMAT CHOSEN -->
            <div v-else class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label class="block text-slate-500 dark:text-slate-400 font-medium">Isi Catatan & Format Teks:</label>
                
                <!-- TOOLBAR WYSIWYG SIMPLE -->
                <div class="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                  <button type="button" @click="execCommand('bold')" class="px-2 py-0.5 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-xs" title="Bold">B</button>
                  <button type="button" @click="execCommand('italic')" class="px-2 py-0.5 italic hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-xs" title="Italic">I</button>
                  <button type="button" @click="execCommand('underline')" class="px-2 py-0.5 underline hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-xs" title="Underline">U</button>
                  <button type="button" @click="execCommand('insertUnorderedList')" class="px-2 py-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-xs" title="Bullet List"><i class="fa-solid fa-list-ul"></i></button>
                  <button type="button" @click="execCommand('insertOrderedList')" class="px-2 py-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-xs" title="Numbering"><i class="fa-solid fa-list-ol"></i></button>
                </div>
              </div>

              <!-- ContentEditable Textarea Editor -->
              <div 
                ref="editorRef"
                contenteditable="true"
                @paste="handlePasteImage"
                class="w-full glass-input rounded-xl px-3 py-2.5 text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-600 min-h-[140px] max-h-[220px] overflow-y-auto leading-relaxed prose dark:prose-invert"
              ></div>
              <p class="text-[10px] text-slate-400 italic">Tips: Anda bisa langsung menempelkan gambar dengan Ctrl + V di area editor.</p>
            </div>

            <!-- UPLOAD & GALLERY GAMBAR -->
            <div class="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div class="flex justify-between items-center">
                <label class="block text-slate-500 font-medium">Sisipkan Gambar:</label>
                <input type="file" ref="fileInputRef" accept="image/*" class="hidden" @change="onFileSelected">
                <button type="button" @click="$refs.fileInputRef.click()" class="text-xs text-theme font-bold hover:underline flex items-center gap-1 cursor-pointer">
                  <i class="fa-solid fa-image"></i> Upload Gambar
                </button>
              </div>

              <div v-if="form.images.length > 0" class="flex gap-2 overflow-x-auto pb-1">
                <div v-for="(img, idx) in form.images" :key="idx" class="relative shrink-0 group">
                  <img :src="img" class="w-16 h-16 object-cover rounded-xl border border-slate-200 dark:border-slate-700">
                  <button type="button" @click="removeImage(idx)" class="absolute -top-1 -right-1 bg-rose-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px]">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Action Controls Modal -->
            <div class="flex items-center justify-end gap-2 pt-2">
              <button 
                type="button" 
                @click="isModalOpen = false" 
                :disabled="isSubmitting"
                class="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl font-bold cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
              <button 
                type="submit" 
                :disabled="isSubmitting"
                class="bg-theme-gradient hover:bg-theme-gradient text-white px-5 py-2 rounded-xl font-bold shadow-md cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                <i v-if="isSubmitting" class="fa-solid fa-circle-notch fa-spin text-xs"></i>
                <span>{{ isSubmitting ? 'Memproses...' : 'Simpan Catatan' }}</span>
              </button>
            </div>
          </form>

        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue';
import { store } from '../store/index.js';
import { api } from '../services/api.js';

const notes = ref([]);
const searchQuery = ref('');
const isModalOpen = ref(false);
const isEdit = ref(false);
const isLoadingNotes = ref(false);
const isSubmitting = ref(false);
const activeNoteId = ref(null);

const editorRef = ref(null);
const fileInputRef = ref(null);

const form = reactive({
  title: '',
  category: 'Umum',
  cardStyle: 'standard',
  content: '',
  todos: [],
  images: []
});

const currentUserId = computed(() => {
  return store.currentUser?.email || store.currentUser?.id || 'guest';
});

const fetchNotes = async () => {
  if (!currentUserId.value) return;
  isLoadingNotes.value = true;
  try {
    if (api && api.getUserNotes) {
      notes.value = await api.getUserNotes(currentUserId.value);
    }
  } catch (err) {
    store.addNotification('Gagal Memuat Catatan', err.message, 'warning');
  } finally {
    isLoadingNotes.value = false;
  }
};

const filteredNotes = computed(() => {
  if (!searchQuery.value) return notes.value;
  const q = searchQuery.value.toLowerCase();
  return notes.value.filter(n => 
    (n.title && n.title.toLowerCase().includes(q)) || 
    (n.content && n.content.toLowerCase().includes(q)) ||
    (n.category && n.category.toLowerCase().includes(q))
  );
});

// Helper Label Style Kartu
const getStyleLabel = (style) => {
  switch (style) {
    case 'checklist': return 'To-Do List';
    case 'highlight': return 'Sticky Note';
    case 'minimal': return 'Minimalis';
    default: return 'Rich Text';
  }
};

const getCardStyleClass = (style) => {
  switch (style) {
    case 'checklist': return 'border-emerald-500/30 bg-emerald-500/5';
    case 'highlight': return 'border-amber-500/40 bg-amber-500/10 dark:bg-amber-500/5';
    case 'minimal': return 'border-slate-200 dark:border-slate-800 bg-transparent';
    default: return 'border-white/20 dark:border-slate-800 hover:border-emerald-500/40';
  }
};

// Rich Text Editor Commands
const execCommand = (cmd) => {
  document.execCommand(cmd, false, null);
};

// Paste Image Handler (Ctrl + V)
const handlePasteImage = (e) => {
  const items = (e.clipboardData || e.originalEvent.clipboardData).items;
  for (const item of items) {
    if (item.type.indexOf('image') === 0) {
      const blob = item.getAsFile();
      const reader = new FileReader();
      reader.onload = (event) => {
        form.images.push(event.target.result);
      };
      reader.readAsDataURL(blob);
    }
  }
};

// Upload File Gambar Handler
const onFileSelected = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      form.images.push(event.target.result);
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = (idx) => form.images.splice(idx, 1);

// To-Do Checklist Handlers
const addTodoRow = () => form.todos.push({ text: '', done: false });
const removeTodoRow = (idx) => form.todos.splice(idx, 1);

const toggleTodoItem = async (note, tIdx) => {
  note.todos[tIdx].done = !note.todos[tIdx].done;
  if (api && api.saveUserNote) {
    await api.saveUserNote(currentUserId.value, note);
  }
};

const openAddModal = () => {
  isEdit.value = false;
  activeNoteId.value = null;
  form.title = '';
  form.category = 'Umum';
  form.cardStyle = 'standard';
  form.content = '';
  form.todos = [{ text: '', done: false }];
  form.images = [];
  isModalOpen.value = true;
  nextTick(() => {
    if (editorRef.value) editorRef.value.innerHTML = '';
  });
};

const openEditModal = (note) => {
  isEdit.value = true;
  activeNoteId.value = note.id;
  form.title = note.title;
  form.category = note.category || 'Umum';
  form.cardStyle = note.cardStyle || 'standard';
  form.content = note.content || '';
  form.todos = note.todos ? JSON.parse(JSON.stringify(note.todos)) : [{ text: '', done: false }];
  form.images = note.images ? [...note.images] : [];
  isModalOpen.value = true;
  nextTick(() => {
    if (editorRef.value) editorRef.value.innerHTML = form.content;
  });
};

const saveNote = async () => {
  isSubmitting.value = true;

  if (editorRef.value) {
    form.content = editorRef.value.innerHTML;
  }

  const currentDateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  
  const notePayload = {
    id: isEdit.value && activeNoteId.value ? activeNoteId.value : Date.now(),
    title: form.title,
    category: form.category,
    cardStyle: form.cardStyle,
    content: form.content,
    todos: form.todos.filter(t => t.text.trim() !== ''),
    images: form.images,
    date: currentDateStr,
    createdAt: Date.now()
  };

  try {
    if (api && api.saveUserNote) {
      await api.saveUserNote(currentUserId.value, notePayload);
    }

    if (isEdit.value) {
      const idx = notes.value.findIndex(n => n.id === activeNoteId.value);
      if (idx !== -1) notes.value[idx] = notePayload;
    } else {
      notes.value.unshift(notePayload);
    }

    store.addNotification('Tersimpan', `Catatan "${form.title}" berhasil disimpan`, 'success');
    isModalOpen.value = false;
  } catch (err) {
    store.addNotification('Gagal Menyimpan', err.message, 'warning');
  } finally {
    isSubmitting.value = false;
  }
};

const confirmDeleteNote = (note) => {
  store.openAlert(
    'Hapus Catatan',
    `Apakah Anda yakin ingin menghapus catatan "${note.title}"?`,
    async () => {
      try {
        if (api && api.deleteUserNote) {
          await api.deleteUserNote(note.id);
        }
        notes.value = notes.value.filter(n => n.id !== note.id);
        store.addNotification('Dihapus', 'Catatan berhasil dihapus', 'info');
      } catch (err) {
        store.addNotification('Gagal Menghapus', err.message, 'warning');
      }
    },
    'warning'
  );
};

onMounted(() => {
  fetchNotes();
});

watch(currentUserId, () => {
  fetchNotes();
});

watch(
  () => store.activeModal,
  (newModal) => {
    if (newModal === 'notes') {
      openAddModal(); // sesuaikan nama fungsi buka modal di PageNotes.vue
      store.closeModal();
    }
  },
  { immediate: true }
);
</script>