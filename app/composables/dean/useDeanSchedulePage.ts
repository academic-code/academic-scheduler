// /app/composables/dean/useDeanSchedulePage.ts
import { ref, computed } from 'vue'
import { useSupabase } from '~/composables/useSupabase'
import { useAuthComposable } from '~/composables/useAuth' // you already referenced this elsewhere

type Period = { id: string; period_number?: number; start_time?: string; end_time?: string; time?: string }
type ClassRec = { id: string; name: string; section?: string; department_id?: string }
type Teacher = { id: string; full_name: string; department_id?: string }
type Subject = { id: string; name: string; code?: string; department_id?: string }
type Schedule = any

export function useDeanSchedulePage() {
  const supabase = useSupabase()
  const { currentUser } = useAuthComposable()

  const loading = ref(false)
  const error = ref<string | null>(null)

  const periods = ref<Period[]>([])
  const classes = ref<ClassRec[]>([])
  const teachers = ref<Teacher[]>([])
  const subjects = ref<Subject[]>([])
  const schedules = ref<Schedule[]>([])

  // department id of the current dean
  const departmentId = ref<string | null>(null)

  async function init() {
    loading.value = true
    error.value = null
    try {
      const uid = currentUser.value?.id
      if (!uid) throw new Error('User not authenticated')

      // fetch dean row to get department
      const { data: deanRow, error: deanErr } = await supabase
        .from('users')
        .select('department_id')
        .eq('id', uid)
        .maybeSingle()
      if (deanErr) throw deanErr
      departmentId.value = deanRow?.department_id ?? null

      // fetch all resources filtered by department where applicable
      const [pRes, cRes, tRes, sRes, schRes] = await Promise.all([
        supabase.from('periods').select('*').eq('department_id', departmentId.value).order('period_number', { ascending: true }),
        supabase.from('classes').select('*').eq('department_id', departmentId.value).order('name', { ascending: true }),
        supabase
          .from('users')
          .select('id,full_name,department_id')
          .eq('role', 'faculty')
          .eq('department_id', departmentId.value)
          .order('full_name', { ascending: true }),
        supabase.from('subjects').select('*').eq('department_id', departmentId.value).order('name', { ascending: true }),
        supabase.from('schedules').select('*').eq('department_id', departmentId.value)
      ])

      if (pRes.error) throw pRes.error
      if (cRes.error) throw cRes.error
      if (tRes.error) throw tRes.error
      if (sRes.error) throw sRes.error
      if (schRes.error) throw schRes.error

      periods.value = pRes.data ?? []
      classes.value = cRes.data ?? []
      teachers.value = (tRes.data ?? []).map((r: any) => ({ id: r.id, full_name: r.full_name, department_id: r.department_id }))
      subjects.value = sRes.data ?? []
      schedules.value = schRes.data ?? []
    } catch (e: any) {
      error.value = e.message ?? String(e)
      console.error('[useDeanSchedulePage.init]', e)
    } finally {
      loading.value = false
    }
  }

  // refresh helper
  async function refresh() {
    await init()
  }

  // create schedule: payload must include (class_id?|faculty_id, subject_id, period_id, day, start_time?, end_time?)
  async function createSchedule(payload: Record<string, any>) {
    try {
      loading.value = true
      // ensure department attached
      payload.department_id = departmentId.value ?? payload.department_id ?? null

      // attach created_by (dean) if available
      payload.created_by = currentUser.value?.id ?? payload.created_by ?? null

      // safe defaults: avoid undefined values that may cause DB errors
      if (!payload.subject_id) payload.subject_id = null
      if (!payload.period_id) payload.period_id = null
      if (!payload.day) payload.day = null
      if (!('faculty_id' in payload)) payload.faculty_id = null
      if (!('class_id' in payload)) payload.class_id = null

      const { data, error: err } = await supabase.from('schedules').insert([payload]).select().single()
      if (err) throw err
      // push response (complete row) to schedules local state
      schedules.value.push(data)
      return { data }
    } catch (e: any) {
      console.error('[createSchedule]', e)
      return { error: e.message ?? String(e) }
    } finally {
      loading.value = false
    }
  }

  // update schedule by id
  async function updateSchedule(id: string, payload: Record<string, any>) {
    try {
      loading.value = true
      // attach updated_at server-side friendly field
      payload.updated_at = new Date().toISOString()
      // ensure department stays correct
      payload.department_id = departmentId.value ?? payload.department_id ?? null

      const { data, error: err } = await supabase.from('schedules').update(payload).eq('id', id).select().single()
      if (err) throw err
      const idx = schedules.value.findIndex((s) => s.id === id)
      if (idx !== -1) schedules.value[idx] = data
      return { data }
    } catch (e: any) {
      console.error('[updateSchedule]', e)
      return { error: e.message ?? String(e) }
    } finally {
      loading.value = false
    }
  }

  // delete schedule
  async function deleteSchedule(id: string) {
    try {
      loading.value = true
      const { error: err } = await supabase.from('schedules').delete().eq('id', id)
      if (err) throw err
      schedules.value = schedules.value.filter((s) => s.id !== id)
      return {}
    } catch (e: any) {
      console.error('[deleteSchedule]', e)
      return { error: e.message ?? String(e) }
    } finally {
      loading.value = false
    }
  }

  // helpers to map UI-friendly options: subjects -> { label, value: id }
  const subjectOptions = computed(() => subjects.value.map((s) => ({ label: s.name, value: s.id })))
  const teacherOptions = computed(() => teachers.value.map((t) => ({ label: t.full_name, value: t.id })))
  const classOptions = computed(() => classes.value.map((c) => ({ label: `${c.name}${c.section ? ' - ' + c.section : ''}`, value: c.id })))

  return {
    loading,
    error,
    periods,
    classes,
    teachers,
    subjects,
    schedules,
    subjectOptions,
    teacherOptions,
    classOptions,
    init,
    refresh,
    createSchedule,
    updateSchedule,
    deleteSchedule,
  }
}
