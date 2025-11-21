import { ref } from 'vue'

type Cell = { subject: string; teacher: string; className?: string }
const initialPeriods = [
  { id: 'p1', name: 'Period 1', time: '07:00-07:30' },
  { id: 'p2', name: 'Period 2', time: '07:30-08:00' }
]
const initialDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function useTimetable() {
  const periods = ref(initialPeriods)
  const days = ref(initialDays)
  const cells = ref<Record<string, Cell>>({
    'p1-1': { subject: 'IT113 PLATFORM TECHNOLOGIES', teacher: 'Mark Kian', className: 'BSIT 2nd Year-A' }
  })

  function setCell(key: string, value: Cell) { cells.value[key] = value }
  function removeCell(key: string) { delete cells.value[key] }

  return { periods, days, cells, setCell, removeCell }
}
