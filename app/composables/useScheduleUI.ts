import { ref } from 'vue'

export function useScheduleUI() {
  const primaryTab = ref<string>('weekly')
  const secondaryTab = ref<string>('class')
  const editMode = ref<boolean>(false)

  // FIXED: must be string | null (not undefined)
const selectedItem = ref<string | null | undefined>(undefined)

  const layout = ref<string>('vertical')
  const views = ref<number>(0)

  return {
    primaryTab,
    secondaryTab,
    editMode,
    selectedItem,
    layout,
    views
  }
}
