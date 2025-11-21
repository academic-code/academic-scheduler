<template>
  <div class="tt-header">

    <!-- Top row: Title + right controls -->
    <div class="tt-toprow">
      <div class="tt-title-block">
        <h1 class="tt-title">Schedules</h1>
        <div v-if="subtitle" class="tt-subtitle">{{ subtitle }}</div>
      </div>

      <div class="tt-right-controls">
        <div class="views">Views: <strong>{{ views }}</strong></div>

        <div class="edit-mode">
          <span class="edit-text">Edit Mode</span>
          <v-switch
            :model-value="editMode"
            @update:model-value="onEditModeUpdate"
            inset
              color="primary"
            hide-details
          />
        </div>
      </div>
    </div>

    <!-- White card area with primary tabs and controls -->
    <div class="tt-card">
      <div class="tt-row">
        <!-- Primary tabs -->
        <v-tabs
          :model-value="primaryTab"
          @update:model-value="onPrimaryTabUpdate"
          grow
          background-color="transparent"
          class="primary-tabs"
        >
          <v-tab value="weekly" class="primary-tab">Weekly Timetable</v-tab>
          <v-tab value="daily" class="primary-tab">Daily Timetable</v-tab>
        </v-tabs>

        <!-- Right small actions (icons) -->
        <div class="actions-right">
          <v-btn 
              color="#5865f2" 
              prepend-icon="mdi mdi-filter-cog"
              variant="flat" 
              >
            filter_list
          </v-btn>

          <v-btn 
              color="#5865f2" 
              prepend-icon="mdi mdi-download"
              variant="flat"
          >
              file_download
          </v-btn>
          <v-btn
              color="#5865f2" 
              prepend-icon="mdi mdi-share"
              variant="flat"
          >
            share
          </v-btn>
        </div>
      </div>

      <!-- subtabs row: class / teacher + search + layout -->
      <div class="tt-row subtabs-row">
        <div class="subtabs-left">
          <button
            class="subtab-btn"
            :class="{ active: secondaryTab === 'class' }"
            @click="onSecondaryTab('class')"
          >
            Class Timetable
          </button>

          <button
            class="subtab-btn"
            :class="{ active: secondaryTab === 'teacher' }"
            @click="onSecondaryTab('teacher')"
          >
            Teacher Timetable
          </button>
        </div>

        <div class="controls">
          <v-text-field
            v-model="searchText"
            placeholder="Search class, teacher or subject"
            variant="outlined"
            density="comfortable"
            class="search-field"
            hide-details
            append-inner-icon="search"
            @update:modelValue="onSearchUpdate"
          />

          <v-select
            :items="items"
            v-model="localSelected"
            item-title="label"
            item-value="value"
            variant="outlined"
            density="comfortable"
            class="class-select"
            hide-details
            placeholder="Filter"
          />

          <div class="layout-inline">
            <span class="layout-label">Layout</span>
            <button class="layout-btn"  :class="{ active: layout === 'horizontal' }" @click="emit('update:layout','horizontal')">
              <i class="mdi mdi-swap-horizontal">Horizontal</i>
            </button>
            <button class="layout-btn" :class="{ active: layout === 'vertical' }" @click="emit('update:layout','vertical')">
              <i class="mdi mdi-swap-vertical">Vertical</i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
type Item = { label: string; value: string }

const props = defineProps<{
  primaryTab: string
  secondaryTab: string
  editMode: boolean
  selected: string | null | undefined
  items: Item[]
  views: number
  layout?: string
  subtitle?: string | null
}>()

const emit = defineEmits([
  'update:primaryTab',
  'update:secondaryTab',
  'update:editMode',
  'update:selected',
  'update:layout'
])

const localSelected = ref<string | null | undefined>(props.selected)
watch(localSelected, (v) => emit('update:selected', v))

const searchText = ref('')

function onSearchUpdate(v: unknown) {
  // purely cosmetic: we don't change app logic — emit selected as before
  // keep the search text local; if you want to wire up, you can add event emit here
  searchText.value = String(v ?? '')
}

function onPrimaryTabUpdate(val: unknown) { emit('update:primaryTab', val as string) }
function onSecondaryTab(val: 'class' | 'teacher') { emit('update:secondaryTab', val) }
function onEditModeUpdate(val: unknown) { emit('update:editMode', val as boolean) }
</script>

<style scoped>
.tt-header { display:flex; flex-direction:column; gap:14px; }

/* TOP ROW */
.tt-toprow { display:flex; align-items:center; justify-content:space-between; gap:12px; }
.tt-title-block { display:flex; flex-direction:column; gap:4px; }
.tt-title { margin:0; font-size:28px; font-weight:700; color:#111827; }
.tt-subtitle { font-size:14px; color:#6b7280; }

/* RIGHT CONTROLS */
.tt-right-controls { display:flex; align-items:center; gap:14px; }
.views { font-size:14px; color:#374151; }
.edit-mode { display:flex; align-items:center; gap:8px; }
.edit-text { font-size:13px; color:#6b7280; }

/* WHITE CARD AREA */
.tt-card { background:white; border-radius:12px; padding:14px; box-shadow: 0 4px 20px rgba(2,6,23,0.06); border:1px solid #e6eefc; }

/* primary tabs row */
.tt-row { display:flex; align-items:center; justify-content:space-between; gap:12px; }
.primary-tabs .v-tab { text-transform:none; font-weight:600; font-size:15px; color:#0f172a; }
.actions-right { display:flex; gap:8px; align-items:center; }

/* subtabs row */
.subtabs-row { margin-top:8px; display:flex; align-items:center; justify-content:space-between; gap:12px; }
.subtabs-left { display:flex; gap:10px; align-items:center; }

.subtab-btn {
  padding:8px 14px;
  border-radius:10px;
  background:#f8fafc;
  border:1px solid #e6eefc;
  cursor:pointer;
  font-size:14px;
  color:#374151;
}
.subtab-btn.active { background:#e8f2ff; border-color:#1a73e8; color:#1a73e8; }

/* controls styling */
.controls { display:flex; gap:10px; align-items:center; }

.search-field { min-width:280px; max-width:420px; }
.class-select { width:220px; }

/* layout inline */
.layout-inline { display:flex; align-items:center; gap:8px; margin-left:6px; }
.layout-label { font-size:12px; color:#6b7280; margin-right:4px; }
.layout-btn {
  border-radius:8px;
  border:1px solid #e6eefc;
  background:white;
  padding:8px;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
}
.layout-btn.active { background:rgba(26,115,232,0.08); border-color:#1a73e8; color:#1a73e8; }
</style>
