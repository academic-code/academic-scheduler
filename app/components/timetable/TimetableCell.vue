<template>
  <div class="cell-wrap">
    <InlineEditor
      v-if="isEditing"
      :period-id="periodId"
      :day-index="dayIndex"
      :existing="cell"
      @close="emitCloseEditor"
      @save="emitSaveEditor"
      @save-pending="emitSavePending"
    />

    <div v-else-if="cell" class="subject-card">
      <div class="subject-left">
        <div class="subject-title">{{ cell.subject }}</div>
        <div class="subject-meta">{{ cell.teacher }}</div>
      </div>

      <div v-if="editMode" class="subject-actions">
        <button class="icon-btn" @click="emitEdit"><i class="material-icons">edit</i></button>
        <button class="icon-btn delete" @click="emitDelete"><i class="material-icons">delete</i></button>
      </div>
    </div>

    <button v-else-if="editMode" class="add-btn" @click="emitAdd">+ Add</button>

    <div v-else class="placeholder">{{ placeholderText }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'
import InlineEditor from './InlineEditor.vue'

const props = defineProps({
  periodId: { type: String, required: true },
  dayIndex: { type: Number, required: true },
  cell: { type: Object as PropType<any>, required: false },
  editMode: { type: Boolean, required: true },

  openEditorKey: {
    type: String as PropType<string | null>,
    required: false,
    default: null
  }
})

const emit = defineEmits([
  'add-cell',
  'edit-cell',
  'delete-cell',
  'close-editor',
  'save-editor',
  'save-pending'
])

const isEditing = computed(() => {
  const k = props.openEditorKey
  return k === `${props.periodId}-${props.dayIndex}`
})

const placeholderText = computed(() => {
  const shortDay = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][props.dayIndex] ?? 'Day'
  const period = String(props.periodId ?? '').replace(/^p/, 'Period ')
  return `${shortDay} - ${period}`
})

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

function emitSaveEditor(data: any) {
  emit('save-editor', { ...data, periodId: props.periodId, dayIndex: props.dayIndex })
}

function emitSavePending(data: any) {
  emit('save-pending', { ...data, periodId: props.periodId, dayIndex: props.dayIndex })
}
</script>



<style scoped>
.cell-wrap { width:100%; min-height:64px; display:flex; align-items:center; }
.placeholder { color:#9ca3af; font-size:13px; }

.subject-card { display:flex; justify-content:space-between; align-items:center; gap:12px; width:100%; background:#f0f8ff; border:1px solid #cfe6ff; padding:10px 12px; border-radius:10px; }
.subject-left { display:flex; flex-direction:column; gap:4px; }
.subject-title { font-weight:700; color:#0f172a; }
.subject-meta { color:#6b7280; font-size:13px; }

.subject-actions { display:flex; gap:8px; }
.icon-btn { background:transparent; border:none; cursor:pointer; padding:6px; border-radius:8px; }
.icon-btn i { font-size:18px; }
.icon-btn.delete i { color:#ef4444; }

.add-btn { border:2px dashed #e6eefc; padding:10px; border-radius:8px; width:100%; background:white; color:#374151; font-weight:600; }
</style>
