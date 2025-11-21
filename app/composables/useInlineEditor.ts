import { ref } from 'vue'

export function useInlineEditor() {
  const openEditorKey = ref<string | null>(null)

  function openEditor(key: string) { openEditorKey.value = key }
  function closeEditor() { openEditorKey.value = null }

  return { openEditorKey, openEditor, closeEditor }
}
