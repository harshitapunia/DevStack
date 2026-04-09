import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

const isConfigured = supabaseUrl.length > 0 && supabaseAnonKey.length > 0

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const isSupabaseConfigured = isConfigured

// ─── Auth helpers ───────────────────────────────────────────────
export async function signUp(email, password, displayName) {
  if (!supabase) return { data: null, error: { message: 'Supabase not configured' } }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } },
  })
  return { data, error }
}

export async function signIn(email, password) {
  if (!supabase) return { data: null, error: { message: 'Supabase not configured' } }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function signOut() {
  if (!supabase) return { error: null }
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getSession() {
  if (!supabase) return { session: null, error: null }
  const { data, error } = await supabase.auth.getSession()
  return { session: data?.session ?? null, error }
}

// ─── Roadmap CRUD ───────────────────────────────────────────────
export async function fetchRoadmaps(userId) {
  if (!supabase) return { data: [], error: null }
  const { data, error } = await supabase
    .from('roadmaps')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
  return { data: data ?? [], error }
}

export async function fetchPublicRoadmap(roadmapId) {
  if (!supabase) return { data: null, error: null }
  const { data, error } = await supabase
    .from('roadmaps')
    .select('*')
    .eq('id', roadmapId)
    .eq('is_public', true)
    .single()
  return { data, error }
}

export async function upsertRoadmap(roadmap) {
  if (!supabase) return { data: null, error: { message: 'Supabase not configured' } }
  const { data, error } = await supabase
    .from('roadmaps')
    .upsert(roadmap, { onConflict: 'id' })
    .select()
    .single()
  return { data, error }
}

export async function deleteRoadmap(roadmapId) {
  if (!supabase) return { error: null }
  const { error } = await supabase
    .from('roadmaps')
    .delete()
    .eq('id', roadmapId)
  return { error }
}

export async function toggleRoadmapPublic(roadmapId, isPublic) {
  if (!supabase) return { data: null, error: null }
  const { data, error } = await supabase
    .from('roadmaps')
    .update({ is_public: isPublic })
    .eq('id', roadmapId)
    .select()
    .single()
  return { data, error }
}
