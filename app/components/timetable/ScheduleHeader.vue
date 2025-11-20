<template>
  <div class="header-wrapper">
    <!-- PRIMARY TABS (Weekly / Daily) -->
    <v-tabs
  :model-value="primaryTab"
  @update:model-value="val => emit('update:primaryTab', val)"
  bg-color="transparent"
  class="primary-tabs"
     density="comfortable"
>
      <v-tab value="weekly">Weekly Timetable</v-tab>
      <v-tab value="daily">Daily Timetable</v-tab>
    </v-tabs>

    <v-divider class="mt-2" />

    <!-- SECONDARY TABS & EDIT MODE -->
    <div class="secondary-row">
      <div class="secondary-tabs">
        <button
          :class="['secondary-tab', { selected: secondaryTab === 'class' }]"
          @click="emitSecondary('class')"
        >
          Class Timetable
        </button>

        <button
          :class="['secondary-tab', { selected: secondaryTab === 'teacher' }]"
          @click="emitSecondary('teacher')"
        >
          Teacher Timetable
        </button>
      </div>

      <div class="edit-wrapper">
        <span class="edit-label">Edit Mode:</span>
        <v-switch
          :model-value="editMode"
          @update:model-value="emitEditMode"
          inset
          density="compact"
          class="edit-toggle"
        />
      </div>
    </div>

    <v-divider />

    <!-- DROPDOWN + RIGHT ACTIONS -->
    <div class="controls-row">
      <v-select
        v-model="localSelected"
        :items="items"
        item-value="value"
        item-title="label"
        hide-details
        density="comfortable"
        class="select-main"
      />

      <div class="spacer" />

      <div class="actions-right">
        <v-btn variant="outlined" density="comfortable" class="control-btn">
          <i class="material-icons">filter_list</i>
          Subject
        </v-btn>

        <v-btn variant="outlined" density="comfortable" class="control-btn">
          <i class="material-icons">file_download</i>
          Download
        </v-btn>

        <v-btn variant="outlined" density="comfortable" class="control-btn">
          <i class="material-icons">share</i>
          Share
        </v-btn>

        <div class="views">Views: <span class="views-count">{{ views }}</span></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  primaryTab: String,
  secondaryTab: String,
  editMode: Boolean,
  selected: String,
  items: Array,
  views: Number,
})

const emit = defineEmits([
  'update:primaryTab',
  'update:secondaryTab',
  'update:editMode',
  'update:selected'
])

const localSelected = ref(props.selected)
watch(localSelected, v => emit('update:selected', v))

function emitSecondary(val) {
  emit('update:secondaryTab', val)
}
function emitEditMode(val) {
  emit('update:editMode', val)
}
</script>

<style scoped>
.header-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 8px;
}
.primary-tabs .v-tab {
  text-transform: none;
  font-size: 16px;
}
.secondary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.secondary-tabs {
  display: flex;
  gap: 22px;
}
.secondary-tab {
  background: transparent;
  border: none;
  padding: 8px 4px;
  font-size: 16px;
  color: #333;
  cursor: pointer;
}
.secondary-tab.selected {
  color: #1a73e8;
  border-bottom: 3px solid #1a73e8;
}
.edit-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}
.edit-label {
  color: #6b7280;
  font-size: 14px;
}
.controls-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 6px;
}
.select-main {
  width: 220px;
}
.spacer {
  flex: 1;
}
.actions-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.control-btn {
  border-color: #e5e7eb !important;
  text-transform: none;
  display: flex;
  align-items: center;
  gap: 6px;
}
.views {
  background: #f1f5f9;
  padding: 8px 12px;
  border-radius: 6px;
}
.views-count {
  color: #1a73e8;
  margin-left: 8px;
}
</style>