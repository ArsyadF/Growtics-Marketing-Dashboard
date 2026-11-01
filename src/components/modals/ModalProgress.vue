<!-- src/components/modals/ModalProgress.vue -->
<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      @click.self="close"
    >
      <div
        class="w-full max-w-xl glass-card rounded-3xl p-5 md:p-6 shadow-2xl space-y-4 border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto custom-scrollbar"
      >
        <!-- Header Modal -->
        <div
          class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3"
        >
          <div>
            <span
              class="text-xs md:text-xs font-semibold text-theme uppercase theme-tint px-2 py-0.5 rounded border theme-border-soft"
            >
              Unit {{ activeItem.unit }} • {{ activeItem.division }}
            </span>
            <h3 class="font-bold mt-1 ui-text-primary ui-text-title">
              {{
                isEdit
                  ? isSpvOrAdmin
                    ? "Edit Program Kerja"
                    : "Update Progres Program"
                  : "Tambah Program Kerja Baru"
              }}
            </h3>
          </div>
          <button
            type="button"
            @click="close"
            class="hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1 ui-text-muted"
          >
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <!-- Form Utama -->
        <form @submit.prevent="onSubmit" class="space-y-4 ui-text-body">
          <div>
            <label class="block font-semibold mb-1 ui-text-secondary"
              >Nama Program / Milestone:</label
            >
            <input
              v-model="activeItem.title"
              type="text"
              required
              :disabled="!isSpvOrAdmin"
              class="w-full rounded-xl px-3 py-2.5 font-semibold border disabled:bg-slate-100 dark:disabled:bg-slate-800/50 ui-input ui-input-inherit min-h-0 ui-text-primary"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold mb-1 ui-text-secondary">Unit Usaha:</label>
              <select
                v-model="activeItem.unit"
                :disabled="!isSpvOrAdmin"
                class="w-full rounded-xl px-3 py-2.5 font-semibold border disabled:opacity-70 ui-input ui-input-inherit min-h-0 ui-text-primary"
              >
                <option v-for="u in masterUnits" :key="u.code" :value="u.code">
                  {{ u.code }} - {{ u.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block font-semibold mb-1 ui-text-secondary">Divisi:</label>
              <select
                v-model="activeItem.division"
                :disabled="!isSpvOrAdmin"
                class="w-full rounded-xl px-3 py-2.5 font-semibold border disabled:opacity-70 ui-input ui-input-inherit min-h-0 ui-text-primary"
              >
                <option v-for="div in availableDivisions" :key="div" :value="div">
                  {{ div }}
                </option>
              </select>
            </div>
          </div>

          <!-- Dropdown PIC -->
          <div class="relative">
            <label class="block font-semibold mb-1 ui-text-secondary"
              >Assign Penanggung Jawab (PIC Staff):</label
            >
            <button
              @click.stop="isPicDropdownOpen = !isPicDropdownOpen"
              type="button"
              :disabled="!isSpvOrAdmin"
              class="w-full rounded-xl px-3 py-2.5 text-left bg-slate-50 dark:bg-slate-800 flex justify-between items-center outline-none border border-slate-200/60 dark:border-slate-700/60 disabled:opacity-70 cursor-pointer ui-button min-h-0 gap-0 ui-button-glass ui-text-primary ui-text-body"
            >
              <span class="font-semibold truncate">
                {{
                  activeItem.assignedPicIds && activeItem.assignedPicIds.length > 0
                    ? getSelectedPicNames()
                    : "-- Pilih PIC Staff --"
                }}
              </span>
              <i class="fa-solid fa-chevron-down text-xs opacity-60 ml-2"></i>
            </button>

            <div
              v-if="isPicDropdownOpen"
              @click.stop
              class="absolute left-0 right-0 mt-1 glass-card rounded-2xl p-3 shadow-2xl border border-slate-100 dark:border-slate-800 z-50 space-y-2"
            >
              <div
                class="flex justify-between items-center pb-1 border-b border-slate-100 dark:border-slate-800"
              >
                <span class="text-xs font-semibold ui-text-secondary">Pilih Staff PIC</span>
                <button
                  type="button"
                  @click="activeItem.assignedPicIds = registeredUsers.map((u) => u.id)"
                  class="text-xs font-semibold text-theme hover:underline cursor-pointer"
                >
                  Pilih Semua
                </button>
              </div>

              <div class="space-y-1 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                <label
                  v-for="user in registeredUsers"
                  :key="user.id"
                  class="flex items-center gap-2 p-1.5 rounded-lg cursor-pointer glass-hover"
                >
                  <input
                    type="checkbox"
                    :value="user.id"
                    v-model="activeItem.assignedPicIds"
                    class="accent-emerald-600 rounded cursor-pointer w-4 h-4"
                  />
                  <div class="truncate">
                    <span class="font-semibold ui-text-primary">{{ user.nama }}</span>
                    <span class="text-xs ml-1 font-normal ui-text-muted">({{ user.role }})</span>
                  </div>
                </label>
              </div>

              <div class="flex justify-end pt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  @click="isPicDropdownOpen = false"
                  class="px-3 py-1 rounded-lg text-xs cursor-pointer shadow-xs ui-button min-h-0 gap-0 ui-button-primary border-0"
                >
                  Selesai
                </button>
              </div>
            </div>
          </div>

          <!-- Target Deadline & Status -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold mb-1 ui-text-secondary">Target Deadline:</label>
              <input
                v-model="activeItem.deadline"
                type="date"
                required
                :disabled="!isSpvOrAdmin"
                class="w-full rounded-xl px-3 py-2.5 font-normal border disabled:bg-slate-100 dark:disabled:bg-slate-800/50 ui-input ui-input-inherit min-h-0 ui-text-primary"
              />
            </div>

            <div>
              <label class="block font-semibold mb-1 ui-text-secondary">Status Kanban:</label>
              <select
                v-model="activeItem.status"
                class="w-full rounded-xl px-3 py-2.5 font-semibold border ui-input ui-input-inherit min-h-0 ui-text-primary"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="In Review">In Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <!-- Checklist Sub-tasks -->
          <div
            class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-2"
          >
            <div class="flex items-center justify-between">
              <label class="font-semibold flex items-center gap-1.5 ui-text-secondary">
                <i class="fa-solid fa-square-check text-theme"></i>
                <span>Daftar Sub-tugas / Checklist:</span>
              </label>
              <span class="text-xs font-semibold text-theme theme-tint px-2 py-0.5 rounded-full">
                {{ activeItem.todos.filter((t) => t.completed).length }} /
                {{ activeItem.todos.length }} Selesai
              </span>
            </div>

            <div class="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              <div
                v-for="(todo, index) in activeItem.todos"
                :key="index"
                class="flex items-center gap-2 p-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-2xs"
              >
                <input
                  type="checkbox"
                  v-model="todo.completed"
                  @change="recalculateProgress"
                  class="accent-emerald-600 rounded cursor-pointer w-4 h-4 shrink-0"
                />
                <input
                  type="text"
                  v-model="todo.text"
                  placeholder="Tuliskan tugas..."
                  class="w-full bg-transparent outline-none font-normal ui-text-primary ui-text-body"
                  :class="{
                    'line-through text-slate-400 dark:text-slate-500': todo.completed,
                  }"
                />
                <button
                  type="button"
                  @click="removeTodo(index)"
                  class="hover:text-rose-500 px-1 cursor-pointer ui-text-muted"
                >
                  <i class="fa-solid fa-trash-can text-xs"></i>
                </button>
              </div>
              <div
                v-if="activeItem.todos.length === 0"
                class="text-xs italic text-center py-2 ui-text-muted"
              >
                Belum ada sub-tugas.
              </div>
            </div>

            <div class="flex gap-2 pt-1">
              <input
                type="text"
                v-model="newTodoText"
                @keyup.enter.prevent="addTodo"
                placeholder="+ Tambah item checklist baru..."
                class="w-full rounded-xl px-3 py-2 border font-normal ui-input ui-input-inherit min-h-0 ui-text-body"
              />
              <button
                type="button"
                @click="addTodo"
                class="px-3.5 py-2 rounded-xl text-xs shrink-0 cursor-pointer shadow-xs ui-button min-h-0 gap-0 ui-button-primary border-0"
              >
                <i class="fa-solid fa-plus mr-1"></i>Tambah
              </button>
            </div>
          </div>

          <!-- Slider Progres -->
          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="block font-semibold ui-text-secondary">Progres Persentase (%):</label>
              <span class="font-bold text-theme text-sm">{{ activeItem.progress }}%</span>
            </div>
            <input
              v-model.number="activeItem.progress"
              type="range"
              min="0"
              max="100"
              class="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          <!-- Deskripsi -->
          <div>
            <label class="block font-semibold mb-1 ui-text-secondary"
              >Deskripsi & Catatan Output Program:</label
            >
            <textarea
              v-model="activeItem.description"
              rows="3"
              placeholder="Rincian deskripsi..."
              class="w-full rounded-xl px-3 py-2 resize-y font-normal border ui-input ui-input-inherit min-h-[80px] ui-text-primary"
            ></textarea>
          </div>

          <!-- Footer Modal -->
          <div
            class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800"
          >
            <button
              v-if="isEdit && canDeleteItem"
              @click="$emit('delete', activeItem)"
              type="button"
              :disabled="isSubmitting"
              class="text-rose-500 font-semibold hover:underline cursor-pointer disabled:opacity-40 flex items-center gap-1.5 text-xs"
            >
              <span>{{ isSubmitting ? "Deleting..." : "Hapus Program" }}</span>
            </button>

            <div class="flex gap-2 ml-auto">
              <button
                @click="close"
                type="button"
                :disabled="isSubmitting"
                class="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl cursor-pointer text-xs ui-button min-h-0 gap-0 ui-text-secondary border-0"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-5 py-2 rounded-xl shadow-md cursor-pointer flex items-center gap-2 text-xs ui-button min-h-0 ui-button-primary border-0"
              >
                <span>{{ isSubmitting ? "Memproses..." : "Simpan Progres" }}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  isOpen: Boolean,
  isEdit: Boolean,
  isSpvOrAdmin: Boolean,
  canDeleteItem: Boolean,
  isSubmitting: Boolean,
  activeItem: Object,
  masterUnits: Array,
  availableDivisions: Array,
  registeredUsers: Array,
});

const emit = defineEmits(["close", "save", "delete"]);

const isPicDropdownOpen = ref(false);
const newTodoText = ref("");

const close = () => {
  isPicDropdownOpen.value = false;
  emit("close");
};

const addTodo = () => {
  if (!newTodoText.value.trim()) return;
  props.activeItem.todos.push({
    text: newTodoText.value.trim(),
    completed: false,
  });
  newTodoText.value = "";
  recalculateProgress();
};

const removeTodo = (index) => {
  props.activeItem.todos.splice(index, 1);
  recalculateProgress();
};

const recalculateProgress = () => {
  if (!props.activeItem.todos || props.activeItem.todos.length === 0) return;
  const completed = props.activeItem.todos.filter((t) => t.completed).length;
  props.activeItem.progress = Math.round(
    (completed / props.activeItem.todos.length) * 100,
  );

  if (props.activeItem.progress === 100) {
    props.activeItem.status = "Completed";
  } else if (
    props.activeItem.progress > 0 &&
    props.activeItem.status === "To Do"
  ) {
    props.activeItem.status = "In Progress";
  }
};

const getSelectedPicNames = () => {
  if (!props.activeItem.assignedPicIds?.length) return "-- Pilih PIC Staff --";
  const users = props.registeredUsers.filter((u) =>
    props.activeItem.assignedPicIds.includes(u.id),
  );
  return users.length
    ? users.map((u) => u.nama).join(", ")
    : "-- Pilih PIC Staff --";
};

const onSubmit = () => {
  emit("save", props.activeItem);
};
</script>
