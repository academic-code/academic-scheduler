<!-- C:/Users/marcg/Desktop/academic-scheduler/app/pages/dean/schedules.vue -->
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
        :periods="periodsForUI"
        :days="days"
        :cells="cellsMap"
        :edit-mode="editMode"
        :open-editor-key="openEditorKey"
        :subject-options="subjectOptions"
        :teacher-options="teacherOptions"
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
import { computed, onMounted, ref } from 'vue'
import TimetableHeader from '~/components/timetable/TimetableHeader.vue'
import TimetableTable from '~/components/timetable/TimetableTable.vue'
import { useDeanSchedulePage } from '~/composables/dean/useDeanSchedulePage'
import { useScheduleUI } from '~/composables/useScheduleUI'
import { useInlineEditor } from '~/composables/useInlineEditor'

// composables
const { primaryTab, secondaryTab, editMode, selectedItem, layout, views } = useScheduleUI()
const { openEditorKey, openEditor, closeEditor } = useInlineEditor()

// dean data composable
const deanPage = useDeanSchedulePage()
const {
  loading,
  error,
  periods,
  classes,
  teachers,
  subjects,
  schedules,
  subjectOptions,
  teacherOptions,
  classOptions,
  init,
  refresh,
  createSchedule,
  updateSchedule,
  deleteSchedule
} = deanPage

// static days used by UI (keep same as previous)
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

onMounted(async () => {
  await init()
})

const dropdownItems = computed(() => (secondaryTab.value === 'class' ? classOptions.value : teacherOptions.value))

const currentSubtitle = computed(() => {
  // selectedItem can be null/undefined
  const selectedId = selectedItem.value
  if (!selectedId) return null
  if (secondaryTab.value === 'class') {
    const cls = classes.value.find(c => c.id === selectedId)
    return cls ? `${cls.name}${cls.section ? ' - ' + cls.section : ''} Timetable` : null
  } else {
    const t = teachers.value.find(t => t.id === selectedId)
    return t ? `${t.full_name} Timetable` : null
  }
})

// Periods for UI: map periods to include 'time' field if present
const periodsForUI = computed(() => (periods.value ?? []).map((p: any) => {
  return { id: p.id, name: p.period_number ? `Period ${p.period_number}` : (p.name ?? 'Period'), time: p.start_time && p.end_time ? `${p.start_time}-${p.end_time}` : (p.time ?? '') }
}))

/**
 * Build a cells map `{ "<periodId>-<dayIndex>": cellObject }` from schedules
 * cellObject contains fields expected by TimetableCell: subject, teacher, and includes schedule id and ids
 */
const cellsMap = computed(() => {
  const map: Record<string, any> = {}
  const list = schedules.value ?? []

  // Filter schedules depending on active mode and selectedItem
  const filtered = list.filter((s: any) => {
    if (secondaryTab.value === 'class') {
      if (!selectedItem.value) return false
      return s.class_id === selectedItem.value
    } else {
      if (!selectedItem.value) return false
      return s.faculty_id === selectedItem.value
    }
  })

  // create mapping
  for (const s of filtered) {
    // find day index
    const dayIndex = days.indexOf(s.day)
    if (dayIndex === -1) continue
    const periodId = s.period_id
    if (!periodId) continue
    const key = `${periodId}-${dayIndex}`

    // find subject and teacher display names
    const subj = subjects.value.find((x: any) => x.id === s.subject_id)
    const teacher = teachers.value.find((t: any) => t.id === s.faculty_id)
    map[key] = {
      id: s.id,
      subject: subj ? subj.name : (s.subject_name ?? s.subject ?? 'Untitled'),
      subject_id: s.subject_id ?? null,
      teacher: teacher ? teacher.full_name : (s.teacher_name ?? s.teacher ?? '—'),
      faculty_id: s.faculty_id ?? null,
      class_id: s.class_id ?? null,
      raw: s
    }
  }
  return map
})

// Inline editor handlers
function openInlineEditor(payload: { periodId: string; dayIndex: number }) {
  openEditor(`${payload.periodId}-${payload.dayIndex}`)
}
function closeInlineEditor() { closeEditor() }

async function deleteCell(payload: { periodId: string; dayIndex: number }) {
  // find schedule for that period/day & selected context
  const dayStr = days[payload.dayIndex]
  // filter schedules by selected context
  const s = schedules.value.find((sc: any) => sc.period_id === payload.periodId && sc.day === dayStr && (
    (secondaryTab.value === 'class' && sc.class_id === selectedItem.value) ||
    (secondaryTab.value === 'teacher' && sc.faculty_id === selectedItem.value)
  ))
  if (s?.id) {
    await deleteSchedule(s.id)
    await refresh()
  }
  closeEditor()
}

async function saveFromEditor(payload: any) {
  // payload contains subject (id), teacher (id), periodId, dayIndex, maybe id
  const periodId = payload.periodId
  const day = days[payload.dayIndex]

  // build payload for DB
  const schedulePayload: Record<string, any> = {
    subject_id: payload.subject || null,
    faculty_id: payload.teacher || null,
    period_id: periodId,
    day,
    // department_id & created_by are attached inside createSchedule
  }

  // attempt to set start_time/end_time if period has it
  const p = periods.value.find((x: any) => x.id === periodId)
  if (p) {
    if (p.start_time) schedulePayload.start_time = p.start_time
    if (p.end_time) schedulePayload.end_time = p.end_time
  }

  // attach class_id OR override faculty_id depending on mode
  if (secondaryTab.value === 'class') {
    // creating/updating schedule for a class
    if (selectedItem.value) {
      schedulePayload.class_id = selectedItem.value
    } else {
      // no selected class — caller should pick one; we'll still allow faculty_id from editor
      schedulePayload.class_id = null
    }
    // faculty_id already set from editor (payload.teacher)
  } else {
    // teacher timetable mode: schedule belongs to the teacher selected in header
    if (selectedItem.value) {
      schedulePayload.faculty_id = selectedItem.value
    }
    // class_id may be null when creating from teacher page
    if (!('class_id' in schedulePayload)) schedulePayload.class_id = null
  }

  // if payload.id exists => update
  if (payload.id) {
    await updateSchedule(payload.id, schedulePayload)
  } else {
    // create
    const res = await createSchedule(schedulePayload)
    if (res?.error) {
      console.error('createSchedule error', res.error)
    }
  }

  // refresh and close
  await refresh()
  closeEditor()
}

async function savePendingFromEditor(payload: any) {
  // currently treat as same as save
  await saveFromEditor(payload)
}
</script>

<style scoped>
.page-wrap { padding:24px; display:flex; flex-direction:column; gap:20px; }
.content { display:flex; flex-direction:column; gap:12px; }
</style>
