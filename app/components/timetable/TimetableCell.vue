<template>
  <div class="cell-wrapper">
    <!-- INLINE EDITOR -->
    <InlineEditor
      v-if="isEditing"
      :period-id="periodId"
      :day-index="dayIndex"
      :existing="cell"
      @close="emitCloseEditor"
      @save="emitSaveEditor"
      @save-pending="emitSavePending"
    />

    <!-- SUBJECT CARD -->
    <div v-else-if="cell" class="subject-card">
      <div class="subject-info">
        <div class="subject-title">{{ cell.subject }}</div>
        <div class="subject-meta">{{ cell.teacher }}</div>
      </div>

      <!-- EDIT/DELETE when editMode on -->
      <div v-if="editMode" class="subject-actions">
        <button class="icon-btn" @click="emitEdit">
          <i class="material-icons">edit</i>
        </button>
        <button class="icon-btn delete" @click="emitDelete">
          <i class="material-icons">delete</i>
        </button>
      </div>
    </div>

    <!-- + ADD BUTTON -->
    <button
      v-else-if="editMode"
      class="add-btn"
      @click="emitAdd"
    >
      + Add
    </button>

    <!-- EMPTY CELL (VIEW MODE) -->
    <div v-else class="placeholder">
      {{ placeholderText }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import InlineEditor from './InlineEditor.vue'

const props = defineProps({
  periodId: String,
  dayIndex: Number,
  cell: Object,
  editMode: Boolean,
  inlineKey: String,
  openEditorKey: String
})

const emit = defineEmits([
  'add-cell',
  'edit-cell',
  'delete-cell',
  'close-editor',
  'save-editor',
  'save-pending'
])

// check if this cell is the inline editor target
const isEditing = computed(() => props.openEditorKey === `${props.periodId}-${props.dayIndex}`)

// Placeholder text (Mon - Period 1)
const placeholderText = computed(() => {
  const shortDay = ['Mon','Tue','Wed','Thu','Fri','Sat'][props.dayIndex]
  const period = props.periodId.replace('p','Period ')
  return `${shortDay} - ${period}`
})

// Emitters
function emitAdd() {
  emit('add-cell', { periodId: props.periodId, dayIndex: props.dayIndex })
}
function emitEdit() {
  emit('edit-cell', { periodId: props.periodId, dayIndex: props.dayIndex })
}
function emitDelete() {
  emit('delete-cell', { periodId: props.periodId, dayIndex: props.dayIndex })
}
function emitCloseEditor() {
  emit('close-editor')
}
function emitSaveEditor(data) {
  emit('save-editor', { ...data, periodId: props.periodId, dayIndex: props.dayIndex })
}
function emitSavePending(data) {
  emit('save-pending', { ...data, periodId: props.periodId, dayIndex: props.dayIndex })
}
</script>

<style scoped>
.cell-wrapper {
  width: 100%;
  height: 100%;
}
.placeholder {
  color: #b6b6b6;
}
.subject-card {
  background: #e8f2ff;
  border: 1px solid #1a73e8;
  padding: 8px 10px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.subject-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.subject-title {
  font-weight: 700;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.subject-meta {
  color: #6b7280;
  font-size: 13px;
}
.icon-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  margin-left: 8px;
}
.icon-btn.delete i {
  color: #e54848;
}
.add-btn {
  border: 2px dashed #d1d5db;
  padding: 8px 14px;
  border-radius: 8px;
  color: #4b5563;
  cursor: pointer;
  width: 100%;
}
</style>