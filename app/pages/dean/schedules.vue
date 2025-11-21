<template>
  <div class="page-wrap">
    <TimetableHeader
      v-model:primaryTab="primaryTab"
      v-model:secondaryTab="secondaryTab"
      v-model:editMode="editMode"
      v-model:selected="selectedItem"
      :items="dropdownItems"
      :views="views"
      :subtitle="currentSubtitle"
      @update:layout="layout = $event"
    />

    <div class="content">
      <TimetableTable
        :periods="periods"
        :days="days"
        :cells="cells"
        :edit-mode="editMode"
        :open-editor-key="openEditorKey"
        @add-cell="openInlineEditor"
        @edit-cell="openInlineEditor"
        @delete-cell="deleteCell"
        @close-editor="closeInlineEditor"
        @save-editor="saveFromEditor"
        @save-pending="savePendingFromEditor"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import TimetableHeader from '~/components/timetable/TimetableHeader.vue'
import TimetableTable from '~/components/timetable/TimetableTable.vue'
import { useTimetable } from '~/composables/useTimetable'
import { useScheduleUI } from '~/composables/useScheduleUI'
import { useInlineEditor } from '~/composables/useInlineEditor'

// composables
const { primaryTab, secondaryTab, editMode, selectedItem, layout, views } = useScheduleUI()
const { periods, days, cells, setCell, removeCell } = useTimetable()
const { openEditorKey, openEditor, closeEditor } = useInlineEditor()

// local page state
const classList = [
  { label: 'BSIT 2nd Year - A', value: 'bsit-2a' },
  { label: 'BSIT 2nd Year - B', value: 'bsit-2b' }
]
const teacherList = [
  { label: 'Mark Kian', value: 'mark-kian' },
  { label: 'Anna Cruz', value: 'anna-cruz' }
]
const dropdownItems = computed(() => (secondaryTab.value === 'class' ? classList : teacherList))

const currentSubtitle = computed(() => {
  const found = classList.find(c => c.value === selectedItem.value)
  return found ? `${found.label} Timetable` : null
})

// actions
function openInlineEditor(payload: { periodId: string; dayIndex: number }) {
  openEditor(`${payload.periodId}-${payload.dayIndex}`)
}
function closeInlineEditor() { closeEditor() }
function deleteCell(payload: { periodId: string; dayIndex: number }) { removeCell(`${payload.periodId}-${payload.dayIndex}`) }
function saveFromEditor(payload: any) {
  const key = `${payload.periodId}-${payload.dayIndex}`
  setCell(key, {
    subject: payload.subject || 'Untitled Subject',
    teacher: payload.teacher || 'No Teacher',
    className: classList.find(c => c.value === selectedItem.value)?.label ?? ''
  })
  closeEditor()
}
function savePendingFromEditor(payload: any) { saveFromEditor(payload) }
</script>

<style scoped>
.page-wrap { padding:24px; display:flex; flex-direction:column; gap:20px; }
.content { display:flex; flex-direction:column; gap:12px; }
</style>
