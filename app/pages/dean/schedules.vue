<template>
  <div class="schedules-page">
    <ScheduleHeader
      v-model:primaryTab="primaryTab"
      v-model:secondaryTab="secondaryTab"
      v-model:editMode="editMode"
      v-model:selected="selectedItem"
      :items="dropdownItems"
      :views="views"
    />

    <LayoutSwitcher v-model:layout="layout" />

    <div class="table-wrapper">
      <TimetableTable
        :periods="periods"
        :days="days"
        :cells="cells"
        :edit-mode="editMode"
        :open-editor-key="openEditorKey"
        @add-cell="openInlineEditor"
        @edit-cell="openInlineEditor"
        @delete-cell="deleteCell"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ScheduleHeader from '@/components/timetable/ScheduleHeader.vue'
import LayoutSwitcher from '@/components/timetable/LayoutSwitcher.vue'
import TimetableTable from '@/components/timetable/TimetableTable.vue'

// UI state
const primaryTab = ref('weekly')
const secondaryTab = ref('class')
const editMode = ref(false)
const selectedItem = ref(null)
const layout = ref('vertical')
const views = ref(0)
const openEditorKey = ref(null)

// Data for dropdown
const classList = [
  { label: 'BSIT 2nd Year - A', value: 'bsit-2a' },
  { label: 'BSIT 2nd Year - B', value: 'bsit-2b' }
]

const teacherList = [
  { label: 'Mark Kian', value: 'mark-kian' },
  { label: 'Anna Cruz', value: 'anna-cruz' }
]

const dropdownItems = computed(() => secondaryTab.value === 'class' ? classList : teacherList)

// Timetable structure
const periods = [
  { id: 'p1', name: 'Period 1', time: '07:00-07:30' },
  { id: 'p2', name: 'Period 2', time: '07:30-08:00' }
]

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Cell data store
const cells = ref({
  'p1-1': {
    subject: 'IT113 PLATFORM TECHNOLOGIES',
    teacher: 'Mark Kian',
    className: 'BSIT 2nd Year-A'
  }
})

// Inline editor control
function openInlineEditor({ periodId, dayIndex }) {
  openEditorKey.value = `${periodId}-${dayIndex}`
}

function deleteCell({ periodId, dayIndex }) {
  const key = `${periodId}-${dayIndex}`
  delete cells.value[key]
}
</script>

<style scoped>
.schedules-page {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.table-wrapper {
  overflow: auto;
  padding-top: 10px;
}
</style>