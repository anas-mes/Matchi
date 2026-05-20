import { supabase } from './supabaseClient'

export async function loginWithPassword(email, password) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  })
}

export async function registerUser(email, password) {
  return await supabase.auth.signUp({
    email,
    password,
  })
}

export async function createMatch(match) {
  return await supabase.from('matches').insert(match).select()
}

export async function fetchMatches() {
  return await supabase.from('matches').select('*')
}

export async function getUserProfile(userId) {
  if (!userId) {
    return { data: null, error: new Error('Missing user ID') }
  }

  return await supabase.from('profiles').select('*').eq('id', userId).single()
}

export async function getCurrentUser() {
  return await supabase.auth.getUser()
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback)
}

export async function signOut() {
  return await supabase.auth.signOut()
}
