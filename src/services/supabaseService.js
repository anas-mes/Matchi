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

// --- Friends & Squads (stubs) ---
export async function fetchFriendRequests(userId) {
  if (!userId) return { data: [], error: null }

  try {
    return await supabase
      .from('friends')
      .select('*, requester:requester_id(id,username,name,email), requested:requested_id(id,username,name,email)')
      .or(`requested_id.eq.${userId},requester_id.eq.${userId}`)
      .order('created_at', { ascending: false })
  } catch (err) {
    return { data: null, error: err }
  }
}

export async function sendFriendRequest(requestedId) {
  try {
    const { data, error } = await supabase.from('friends').insert({ requester_id: (await supabase.auth.getUser()).data.user.id, requested_id: requestedId, status: 'pending' }).select()
    return { data, error }
  } catch (err) {
    return { data: null, error: err }
  }
}

export async function acceptFriendRequest(id) {
  try {
    const { data, error } = await supabase.from('friends').update({ status: 'accepted' }).eq('id', id).select()
    return { data, error }
  } catch (err) {
    return { data: null, error: err }
  }
}

export async function removeFriend(id) {
  try {
    const { data, error } = await supabase.from('friends').delete().eq('id', id)
    return { data, error }
  } catch (err) {
    return { data: null, error: err }
  }
}

export async function fetchFriends(userId) {
  if (!userId) return { data: [], error: null }

  try {
    return await supabase
      .from('friends')
      .select('*, requester:requester_id(id,username,name,email), requested:requested_id(id,username,name,email)')
      .or(`and(requester_id.eq.${userId},status.eq.accepted),and(requested_id.eq.${userId},status.eq.accepted)`)
      .order('created_at', { ascending: false })
  } catch (err) {
    return { data: null, error: err }
  }
}

export async function createSquad(ownerId, name, memberIds = []) {
  try {
    // create squad
    const { data: squadData, error: squadError } = await supabase.from('squads').insert({ owner_id: ownerId, name }).select().single()
    if (squadError) return { data: null, error: squadError }

    const inserts = memberIds.map((user_id) => ({ squad_id: squadData.id, user_id }))
    if (inserts.length > 0) {
      const { data: membersData, error: membersError } = await supabase.from('squad_members').insert(inserts).select()
      if (membersError) return { data: null, error: membersError }
    }

    return { data: squadData, error: null }
  } catch (err) {
    return { data: null, error: err }
  }
}

export async function fetchUserSquads(userId) {
  try {
    return await supabase.from('squads').select('*').eq('owner_id', userId)
  } catch (err) {
    return { data: null, error: err }
  }
}

export async function addSquadMember(squadId, userId) {
  try {
    return await supabase.from('squad_members').insert({ squad_id: squadId, user_id: userId }).select()
  } catch (err) {
    return { data: null, error: err }
  }
}

export async function removeSquadMember(squadId, userId) {
  try {
    return await supabase.from('squad_members').delete().match({ squad_id: squadId, user_id: userId })
  } catch (err) {
    return { data: null, error: err }
  }
}

export async function searchProfiles(query) {
  if (!query || query.trim() === '') {
    return { data: [], error: null }
  }
  const q = query.trim()
  try {
    // Search `profiles` by name or email (adjust fields if your table differs)
    return await supabase
      .from('profiles')
      .select('id, name, email, avatar_url, bio')
      .or(`name.ilike.%${q}%,email.ilike.%${q}%`)
  } catch (err) {
    return { data: null, error: err }
  }
}