<template>
  <div class="tt-table-wrap">
    <table class="timetable">
      <thead>
        <tr>
          <th class="period-cell">Period / Day</th>
          <th v-for="(day, idx) in days" :key="idx">{{ day }}</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="period in periods" :key="period.id">
          <td class="period-cell">
            <div class="period-name">{{ period.name }}</div>
            <div class="period-time">{{ period.time }}</div>
          </td>

          <td v-for="(day, dayIndex) in days" :key="dayIndex">
            <TimetableCell
              :period-id="period.id"
              :day-index="dayIndex"
              :cell="cells ? cells[`${period.id}-${dayIndex}`] : undefined"
              :edit-mode="editMode"
              :open-editor-key="openEditorKey"
              @add-cell="$emit('add-cell', $event)"
              @edit-cell="$emit('edit-cell', $event)"
              @delete-cell="$emit('delete-cell', $event)"
              @close-editor="$emit('close-editor')"
              @save-editor="$emit('save-editor', $event)"
              @save-pending="$emit('save-pending', $event)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import TimetableCell from './TimetableCell.vue'

type Period = { id: string; name: string; time: string }

const props = defineProps({
  periods: Array as PropType<Period[]>,
  days: Array as PropType<string[]>,
  cells: Object as PropType<Record<string, any> | undefined>,
  editMode: Boolean,

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
</script>


<style scoped>
.tt-table-wrap { background: white; border-radius: 12px; padding:16px; box-shadow: 0 6px 22px rgba(2,6,23,0.06); border:1px solid #eef6ff; }
.timetable { width:100%; border-collapse:collapse; min-width:900px; }
.timetable thead th { background:#f1f9ff; padding:14px; text-align:center; border-bottom:1px solid #e6eefc; font-weight:700; color:#0f172a; }
.timetable tbody td { padding:18px; border:1px solid #f1f5f9; vertical-align:top; min-width:150px; background:white; }
.period-cell { width:200px; background:transparent; }
.period-name { font-weight:700; }
.period-time { color:#6b7280; font-size:13px; margin-top:4px; }
</style>
