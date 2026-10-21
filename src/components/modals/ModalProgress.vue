<!-- src/components/modals/ModalProgress.vue -->
<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      @click.self="close"
    >
      <div
        class="w-full max-w-xl glass-card bg-white dark:bg-slate-900 rounded-3xl p-5 md:p-6 shadow-2xl space-y-4 border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto custom-scrollbar"
      >
        <!-- Header Modal -->
        <div
          class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3"
        >
          <div>
            <span
              class="text-xs md:text-xs font-semibold text-theme uppercase bg-theme/10 px-2 py-0.5 rounded border border-theme/20"
            >
              Unit {{ activeItem.unit }} • {{ activeItem.division }}
            </span>
            <h3
              class="font-bold text-slate-800 dark:text-slate-100 text-base md:text-sm mt-1"
            >
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
            class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
          >
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <!-- Form Utama -->
        <form @submit.prevent="onSubmit" class="space-y-4 text-sm md:text-xs">
          <div>
            <label
              class="block text-slate-600 dark:text-slate-300 font-semibold mb-1"
              >Nama Program / Milestone:</label
            >
            <input
              v-model="activeItem.title"
              type="text"
              required
              :disabled="!isSpvOrAdmin"
              class="w-full glass-input rounded-xl px-3 py-2.5 text-slate-800 dark:text-slate-100 font-semibold outline-none border border-slate-200/60 dark:border-slate-700/60 disabled:bg-slate-100 dark:disabled:bg-slate-800/50"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                class="block text-slate-600 dark:text-slate-300 font-semibold mb-1"
                >Unit Usaha:</label
              >
              <select
                v-model="activeItem.unit"
                :disabled="!isSpvOrAdmin"
                class="w-full glass-input rounded-xl px-3 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold outline-none border border-slate-200/60 dark:border-slate-700/60 disabled:opacity-70"
              >
                <option v-for="u in masterUnits" :key="u.code" :value="u.code">
                  {{ u.code }} - {{ u.name }}
                </option>
              </select>
            </div>

            <div>
              <label
                class="block text-slate-600 dark:text-slate-300 font-semibold mb-1"
                >Divisi:</label
              >
              <select
                v-model="activeItem.division"
                :disabled="!isSpvOrAdmin"
                class="w-full glass-input rounded-xl px-3 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold outline-none border border-slate-200/60 dark:border-slate-700/60 disabled:opacity-70"
              >
                <option
                  v-for="div in availableDivisions"
                  :key="div"
                  :value="div"
                >
                  {{ div }}
                </option>
              </select>
            </div>
          </div>

          <!-- Dropdown PIC -->
          <div class="relative">
            <label
              class="block text-slate-600 dark:text-slate-300 font-semibold mb-1"
              >Assign Penanggung Jawab (PIC Staff):</label
            >
            <button
              @click.stop="isPicDropdownOpen = !isPicDropdownOpen"
              type="button"
              :disabled="!isSpvOrAdmin"
              class="w-full glass-input rounded-xl px-3 py-2.5 text-sm md:text-xs text-left bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 flex justify-between items-center outline-none border border-slate-200/60 dark:border-slate-700/60 disabled:opacity-70 cursor-pointer"
            >
              <span class="font-semibold truncate">
                {{
                  activeItem.assignedPicIds &&
                  activeItem.assignedPicIds.length > 0
                    ? getSelectedPicNames()
                    : "-- Pilih PIC Staff --"
                }}
              </span>
              <i class="fa-solid fa-chevron-down text-xs opacity-60 ml-2"></i>
            </button>

            <div
              v-if="isPicDropdownOpen"
              @click.stop
              class="absolute left-0 right-0 mt-1 glass-card bg-white dark:bg-slate-900 rounded-2xl p-3 shadow-2xl border border-slate-100 dark:border-slate-800 z-50 space-y-2"
            >
              <div
                class="flex justify-between items-center pb-1 border-b border-slate-100 dark:border-slate-800"
              >
                <span
                  class="text-xs font-semibold text-slate-700 dark:text-slate-200"
                  >Pilih Staff PIC</span
                >
                <button
                  type="button"
                  @click="
                    activeItem.assignedPicIds = registeredUsers.map((u) => u.id)
                  "
                  class="text-xs font-semibold text-theme hover:underline cursor-pointer"
                >
                  Pilih Semua
                </button>
              </div>

              <div
                class="space-y-1 max-h-40 overflow-y-auto pr-1 custom-scrollbar"
              >
                <label
                  v-for="user in registeredUsers"
                  :key="user.id"
                  class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :value="user.id"
                    v-model="activeItem.assignedPicIds"
                    class="accent-emerald-600 rounded cursor-pointer w-4 h-4"
                  />
                  <div class="truncate">
                    <span
                      class="font-semibold text-slate-800 dark:text-slate-200"
                      >{{ user.nama }}</span
                    >
                    <span class="text-xs text-slate-400 ml-1 font-normal"
                      >({{ user.role }})</span
                    >
                  </div>
                </label>
              </div>

              <div
                class="flex justify-end pt-1 border-t border-slate-100 dark:border-slate-800"
              >
                <button
                  type="button"
                  @click="isPicDropdownOpen = false"
                  class="bg-button text-white font-semibold px-3 py-1 rounded-lg text-xs cursor-pointer shadow-xs"
                >
                  Selesai
                </button>
              </div>
            </div>
          </div>

          <!-- Target Deadline & Status -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                class="block text-slate-600 dark:text-slate-300 font-semibold mb-1"
                >Target Deadline:</label
              >
              <input
                v-model="activeItem.deadline"
                type="date"
                required
                :disabled="!isSpvOrAdmin"
                class="w-full glass-input rounded-xl px-3 py-2.5 text-slate-800 dark:text-slate-100 font-normal outline-none border border-slate-200/60 dark:border-slate-700/60 disabled:bg-slate-100 dark:disabled:bg-slate-800/50"
              />
            </div>

            <div>
              <label
                class="block text-slate-600 dark:text-slate-300 font-semibold mb-1"
                >Status Kanban:</label
              >
              <select
                v-model="activeItem.status"
                class="w-full glass-input rounded-xl px-3 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none font-semibold border border-slate-200/60 dark:border-slate-700/60"
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
              <label
                class="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5"
              >
                <i class="fa-solid fa-square-check text-theme"></i>
                <span>Daftar Sub-tugas / Checklist:</span>
              </label>
              <span
                class="text-xs font-semibold text-theme bg-theme/10 px-2 py-0.5 rounded-full"
              >
                {{ activeItem.todos.filter((t) => t.completed).length }} /
                {{ activeItem.todos.length }} Selesai
              </span>
            </div>

            <div
              class="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar"
            >
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
                  class="w-full bg-transparent outline-none text-slate-800 dark:text-slate-100 text-sm md:text-xs font-normal"
                  :class="{
                    'line-through text-slate-400 dark:text-slate-500':
                      todo.completed,
                  }"
                />
                <button
                  type="button"
                  @click="removeTodo(index)"
                  class="text-slate-400 hover:text-rose-500 px-1 cursor-pointer"
                >
                  <i class="fa-solid fa-trash-can text-xs"></i>
                </button>
              </div>
              <div
                v-if="activeItem.todos.length === 0"
                class="text-slate-400 text-xs italic text-center py-2"
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
                class="w-full glass-input rounded-xl px-3 py-2 text-sm md:text-xs outline-none bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 font-normal"
              />
              <button
                type="button"
                @click="addTodo"
                class="bg-button text-white font-semibold px-3.5 py-2 rounded-xl text-xs shrink-0 cursor-pointer shadow-xs"
              >
                <i class="fa-solid fa-plus mr-1"></i>Tambah
              </button>
            </div>
          </div>

          <!-- Slider Progres -->
          <div>
            <div class="flex justify-between items-center mb-1">
              <label
                class="block text-slate-600 dark:text-slate-300 font-semibold"
                >Progres Persentase (%):</label
              >
              <span class="font-bold text-theme text-sm"
                >{{ activeItem.progress }}%</span
              >
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
            <label
              class="block text-slate-600 dark:text-slate-300 font-semibold mb-1"
              >Deskripsi & Catatan Output Program:</label
            >
            <textarea
              v-model="activeItem.description"
              rows="3"
              placeholder="Rincian deskripsi..."
              class="w-full glass-input rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 outline-none resize-y min-h-[80px] font-normal border border-slate-200/60 dark:border-slate-700/60"
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
                class="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl font-semibold cursor-pointer text-xs"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="bg-button text-white px-5 py-2 rounded-xl font-semibold shadow-md hover:opacity-95 cursor-pointer flex items-center gap-2 text-xs"
              >
                <span>{{
                  isSubmitting ? "Memproses..." : "Simpan Progres"
                }}</span>
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
