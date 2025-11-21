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
      <v-btn variant="outlined" class="btn" @click="emitClose">Cancel</v-btn>
      <v-btn variant="outlined" class="btn" @click="emitSavePending"> Pending</v-btn>
      <v-btn color="primary" class="btn" @click="emitSave">Save</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { PropType } from 'vue'

const props = defineProps({
  periodId: String,
  dayIndex: Number,
  existing: Object as PropType<any>,

  // dynamic options (label/value where value is the uuid)
  subjectOptions: { type: Array as PropType<Array<{ label: string; value: string }>>, default: () => [] },
  teacherOptions: { type: Array as PropType<Array<{ label: string; value: string }>>, default: () => [] }
})

const emit = defineEmits(['close', 'save', 'save-pending'])

// initialize the form with IDs if available (existing schedule may provide subject_id / faculty_id)
const form = reactive({
  subject: props.existing?.subject_id ?? props.existing?.subject ?? '',
  teacher: props.existing?.faculty_id ?? props.existing?.teacher ?? ''
})

const noTeacher = ref(false)
watch(noTeacher, (val) => { if (val) form.teacher = '' })

function emitClose() { emit('close') }

// emit only ID values; TimetableCell will augment with period/day and existing id
function emitSave() { emit('save', { subject: form.subject || null, teacher: form.teacher || null }) }
function emitSavePending() { emit('save-pending', { subject: form.subject || null, teacher: form.teacher || null }) }
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
