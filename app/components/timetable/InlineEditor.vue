<template>
  <div class="inline-editor-card">
    <div class="row">
      <div class="field">
        <label class="label">* Subject</label>
        <v-select
          v-model="form.subject"
          :items="subjectOptions"
          item-title="label"
          item-value="value"
          variant="outlined"
          density="comfortable"
          hide-details
          class="input"
        />
      </div>

      <div class="field">
        <label class="label">Teacher</label>
        <v-select
          v-model="form.teacher"
          :items="teacherOptions"
          item-title="label"
          item-value="value"
          variant="outlined"
          density="comfortable"
          hide-details
          class="input"
          :disabled="noTeacher"
        />
        <v-checkbox v-model="noTeacher" label="No teacher" density="compact" hide-details class="no-teacher" />
      </div>
    </div>

    <div class="actions">
      <v-btn variant="outlined" class="btn" @click="emitClose"><i class="material-icons">close</i> Cancel</v-btn>
      <v-btn variant="outlined" class="btn" @click="emitSavePending"><i class="material-icons">schedule</i> Pending</v-btn>
      <v-btn color="primary" class="btn" @click="emitSave"><i class="material-icons">check</i> Save</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'

const props = defineProps({
  periodId: String,
  dayIndex: Number,
  existing: Object as any
})

const emit = defineEmits(['close', 'save', 'save-pending'])

const subjectOptions = [
  { label: 'IT113 PLATFORM TECHNOLOGIES', value: 'IT113' },
  { label: 'IT102 PROGRAMMING', value: 'IT102' },
  { label: 'DS101 DATA SCIENCE', value: 'DS101' }
]

const teacherOptions = [
  { label: 'Mark Kian', value: 'Mark Kian' },
  { label: 'Anna Cruz', value: 'Anna Cruz' },
  { label: 'No Teacher', value: '' }
]

const form = reactive({
  subject: props.existing?.subject ?? '',
  teacher: props.existing?.teacher ?? ''
})

const noTeacher = ref(false)
watch(noTeacher, (val) => { if (val) form.teacher = '' })

function emitClose() { emit('close') }
function emitSave() { emit('save', { subject: form.subject, teacher: form.teacher }) }
function emitSavePending() { emit('save-pending', { subject: form.subject, teacher: form.teacher }) }
</script>

<style scoped>
.inline-editor-card { background:white; border:1px solid #e6eefc; padding:14px; border-radius:10px; display:flex; flex-direction:column; gap:10px; box-shadow:0 6px 18px rgba(2,6,23,0.06); }
.row { display:flex; gap:12px; }
.field { flex:1; display:flex; flex-direction:column; gap:8px; }
.label { font-weight:600; color:#111827; font-size:13px; }
.input { width:100%; }
.no-teacher { margin-top:-6px; }
.actions { display:flex; gap:10px; justify-content:flex-end; }
.btn { display:flex; align-items:center; gap:8px; text-transform:none; }
</style>
