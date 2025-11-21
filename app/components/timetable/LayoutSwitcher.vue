<template>
  <div class="layout-switcher">
    <span class="label">Layout</span>

    <button class="btn" :class="{ active: layout === 'horizontal' }" @click="$emit('update:layout','horizontal')">
      <i class="material-icons">compare_arrows</i>
      Horizontal
    </button>

    <button class="btn" :class="{ active: layout === 'vertical' }" @click="$emit('update:layout','vertical')">
      <i class="material-icons">swap_vert</i>
      Vertical
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ layout: string }>()
const emit = defineEmits(['update:layout'])
</script>

<style scoped>
.layout-switcher { display:flex; gap:10px; align-items:center; }
.label { font-size:13px; color:#6b7280; margin-right:6px; }
.btn { background:white; border:1px solid #e6eefc; padding:8px 12px; border-radius:8px; display:flex; gap:8px; align-items:center; cursor:pointer; font-size:13px; }
.btn.active { border-color:#1a73e8; color:#1a73e8; background:rgba(26,115,232,0.06); }
</style>
