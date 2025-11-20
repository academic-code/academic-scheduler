<template>
  <div class="layout-wrapper">
    <span class="layout-label">Layout:</span>

    <!-- HORIZONTAL BUTTON -->
    <v-btn
      variant="outlined"
      density="comfortable"
      class="layout-btn"
      :class="{ selected: layout === 'horizontal' }"
      @click="emitLayout('horizontal')"
    >
      <i class="material-icons">compare_arrows</i>
      Horizontal
    </v-btn>

    <!-- VERTICAL BUTTON -->
    <v-btn
      variant="outlined"
      density="comfortable"
      class="layout-btn"
      :class="{ selected: layout === 'vertical' }"
      @click="emitLayout('vertical')"
    >
      <i class="material-icons">swap_vert</i>
      Vertical
    </v-btn>
  </div>
</template>

<script setup>
const props = defineProps({
  layout: String
})

const emit = defineEmits(['update:layout'])

function emitLayout(val) {
  emit('update:layout', val)
}
</script>

<style scoped>
.layout-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 4px 0 12px;
}

.layout-label {
  font-size: 14px;
  color: #6b7280;
}

.layout-btn {
  border-color: #d1d5db !important;
  text-transform: none;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #444;
}

.layout-btn.selected {
  border-color: #1a73e8 !important;
  background: rgba(26, 115, 232, 0.1) !important;
  color: #1a73e8 !important;
}
</style>
