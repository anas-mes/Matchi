import { useEffect, useState } from 'react'
import { getCurrentUser, getUserProfile } from '../services/supabaseService'

function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      const { data: userData, error: userError } = await getCurrentUser()
      if (userError || !userData?.user) {
        setLoading(false)
        return
      }

      const userId = userData.user.id
      const { data, error } = await getUserProfile(userId)

      if (error) {
        console.error(error)
      } else {
        setProfile(data)
      }
      setLoading(false)
    }

    loadProfile()
  }, [])

  if (loading) {
    return <div>Loading profile…</div>
  }

  if (!profile) {
    return <div>No profile data found.</div>
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {profile.name || profile.email || 'Unknown'}</p>
      <p>Email: {profile.email}</p>
    </div>
  )
}

export default Profile