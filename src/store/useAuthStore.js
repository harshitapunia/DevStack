import { create } from 'zustand'
import { supabase, signIn, signUp, signOut, getSession, isSupabaseConfigured } from '../lib/supabase'

export const useAuthStore = create((set, get) => ({
  user: null,
  session: null,
  loading: true,
  error: null,

  initialize: async () => {
    if (!isSupabaseConfigured) {
      // No Supabase — run in offline/demo mode
      set({ loading: false, user: null, session: null })
      return
    }

    set({ loading: true })
    try {
      const { session } = await getSession()
      set({
        session,
        user: session?.user ?? null,
        loading: false,
      })

      // Listen for auth state changes
      supabase.auth.onAuthStateChange((_event, session) => {
        set({
          session,
          user: session?.user ?? null,
        })
      })
    } catch {
      set({ loading: false, user: null, session: null })
    }
  },

  login: async (email, password) => {
    set({ error: null, loading: true })
    const { data, error } = await signIn(email, password)
    if (error) {
      set({ error: error.message, loading: false })
      return false
    }
    set({
      session: data.session,
      user: data.user,
      loading: false,
    })
    return true
  },

  register: async (email, password, displayName) => {
    set({ error: null, loading: true })
    const { data, error } = await signUp(email, password, displayName)
    if (error) {
      set({ error: error.message, loading: false })
      return false
    }
    set({
      session: data.session,
      user: data.user,
      loading: false,
    })
    return true
  },

  logout: async () => {
    await signOut()
    set({ user: null, session: null })
  },

  clearError: () => set({ error: null }),
}))
