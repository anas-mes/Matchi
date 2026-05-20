import { supabase } from './supabaseClient'

export async function loginWithPassword(email, password) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  })
}

export async function registerUser(email, password) {
  const result = await supabase.auth.signUp({
    email,
    password,
  })
  console.log('registerUser full response:', result)
  return result
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

export async function uploadProfileImage(userId, file) {
  if (!userId || !file) return { data: null, error: new Error('Missing params') }

  const fileExt = file.name.split('.').pop()
  const filePath = `${userId}/${Date.now()}.${fileExt}`

  try {
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })

    console.log('Storage upload response:', { data, error, filePath })

    if (error) {
      console.error('Upload error details:', error)
      return { data: null, error }
    }

    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath)
    console.log('Public URL:', urlData?.publicUrl)

    return { data: urlData?.publicUrl ?? null, error: null }
  } catch (err) {
    console.error('Upload exception:', err)
    return { data: null, error: err }
  }
}

export async function updateProfile(userId, updates) {
  if (!userId) return { data: null, error: new Error('Missing user ID') }

  const payload = { id: userId, ...updates }
  console.log('updateProfile payload:', payload)

  const result = await supabase.from('profiles').upsert(payload).select().single()
  console.log('updateProfile result:', result)
  return result
}
