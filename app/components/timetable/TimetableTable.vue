<template>
  <table class="timetable">
    <thead>
      <tr>
        <th class="period-cell">Period / Day</th>
        <th v-for="day in days" :key="day">{{ day }}</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="period in periods" :key="period.id">
        <!-- Period Column -->
        <td class="period-cell">
          <div class="period-title">{{ period.name }}</div>
          <div class="period-time">{{ period.time }}</div>
        </td>

        <!-- Day Columns -->
        <td
          v-for="(day, dayIndex) in days"
          :key="dayIndex"
        >
          <TimetableCell
            :period-id="period.id"
            :day-index="dayIndex"
            :cell="cells[`${period.id}-${dayIndex}`]"
            :edit-mode="editMode"
            @add-cell="$emit('add-cell', $event)"
            @edit-cell="$emit('edit-cell', $event)"
            @delete-cell="$emit('delete-cell', $event)"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import TimetableCell from './TimetableCell.vue'

defineProps({
  periods: Array,
  days: Array,
  cells: Object,
  editMode: Boolean
})

defineEmits(['add-cell', 'edit-cell', 'delete-cell'])
</script>

<style scoped>
.timetable {
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
}
.timetable thead th {
  background: #eef8ff;
  padding: 14px;
  text-align: center;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
}
.timetable tbody td {
  padding: 18px;
  border: 1px solid #eee;
  vertical-align: top;
  min-width: 150px;
}
.period-cell {
  width: 200px;
  background: #fff;
}
.period-title {
  font-weight: 700;
}
.period-time {
  color: #9ca3af;
  font-size: 13px;
}
</style>
