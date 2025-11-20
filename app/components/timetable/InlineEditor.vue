<template>
  <div class="inline-editor">
    <!-- SUBJECT FIELD -->
    <div class="field-block">
      <label class="field-label">* Subject</label>

      <v-select
        v-model="form.subject"
        :items="subjectOptions"
        item-title="label"
        item-value="value"
        density="comfortable"
        class="editor-select"
        hide-details
        placeholder="Select subject"
      />
    </div>

    <!-- TEACHER SECTION -->
    <div class="field-block">
      <label class="field-label">Teachers</label>

      <v-checkbox
        v-model="noTeacher"
        label="No teacher assigned"
        hide-details
        density="compact"
      />

      <v-select
        v-model="form.teacher"
        :items="teacherOptions"
        item-title="label"
        item-value="value"
        density="comfortable"
        class="editor-select"
        hide-details
        placeholder="No Teacher Available"
        :disabled="noTeacher"
      />
    </div>

    <!-- BUTTONS -->
    <div class="actions-row">
      <v-btn variant="outlined" class="btn cancel" @click="emitClose">
        <i class="material-icons">close</i>
        Cancel
      </v-btn>

      <v-btn variant="outlined" class="btn pending" @click="emitSavePending">
        <i class="material-icons">schedule</i>
        Save to Pending
      </v-btn>

      <v-btn color="primary" class="btn save" @click="emitSave">
        <i class="material-icons">check</i>
        Save Now
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'

const props = defineProps({
  periodId: String,
  dayIndex: Number,
  existing: Object
})

const emit = defineEmits(['close', 'save', 'save-pending'])

// SUBJECT OPTIONS (replace with real composable later)
const subjectOptions = [
  { label: 'IT113 PLATFORM TECHNOLOGIES', value: 'IT113' },
  { label: 'IT102 PROGRAMMING', value: 'IT102' },
  { label: 'DS101 DATA SCIENCE', value: 'DS101' }
]

// TEACHERS OPTIONS (replace later)
const teacherOptions = [
  { label: 'Mark Kian', value: 'Mark Kian' },
  { label: 'Anna Cruz', value: 'Anna Cruz' },
  { label: 'No Teacher', value: null }
]

// FORM STATE
const form = reactive({
  subject: props.existing?.subject || null,
  teacher: props.existing?.teacher || null
})

const noTeacher = ref(false)

watch(noTeacher, val => {
  if (val) form.teacher = null
})

// Emit actions
function emitClose() {
  emit('close')
}
function emitSave() {
  emit('save', { ...form })
}
function emitSavePending() {
  emit('save-pending', { ...form })
}
</script>

<style scoped>
.inline-editor {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-weight: 600;
  color: #333;
}

.editor-select {
  background: white;
}

.actions-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.btn {
  text-transform: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.cancel {
  border-color: #d1d5db !important;
  color: #333;
}

.pending {
  border-color: #d1d5db !important;
  color: #333;
}

.save {
  background: #1a73e8 !important;
  color: white !important;
}
</style>
