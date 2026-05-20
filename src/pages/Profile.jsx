import { useEffect, useState } from 'react'
import {
  getCurrentUser,
  getUserProfile,
  uploadProfileImage,
  updateProfile,
} from '../services/supabaseService'

function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [bio, setBio] = useState('')
  const [age, setAge] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [saving, setSaving] = useState(false)

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
        setBio(data?.bio ?? '')
        setAge(data?.age ?? '')
      }
      setLoading(false)
    }

    loadProfile()
  }, [])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) setAvatarFile(file)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    const { data: userData } = await getCurrentUser()
    const userId = userData?.user?.id
    if (!userId) {
      alert('No user logged in')
      setSaving(false)
      return
    }

    let avatarUrl = profile?.avatar_url
    if (avatarFile) {
      const { data, error } = await uploadProfileImage(userId, avatarFile)
      if (error) {
        alert(error.message)
        setSaving(false)
        return
      }
      avatarUrl = data
    }

    const updates = {
      bio,
      age: age ? Number(age) : null,
      avatar_url: avatarUrl,
    }

    const { data, error } = await updateProfile(userId, updates)
    if (error) {
      alert(error.message)
    } else {
      setProfile(data)
      setEditing(false)
    }

    setSaving(false)
  }

  if (loading) return <div>Loading profile…</div>

  if (!profile) return <div>No profile data found.</div>

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      {!editing ? (
        <div>
          {profile.avatar_url && (
            // eslint-disable-next-line jsx-a11y/img-redundant-alt
            <img src={profile.avatar_url} alt="avatar" width={120} className="rounded-full mb-4" />
          )}

          <p className="mb-2">Email: {profile.email}</p>
          <p className="mb-2">Bio: {profile.bio ?? '—'}</p>
          <p className="mb-2">Age: {profile.age ?? '—'}</p>

          <button onClick={() => setEditing(true)} className="mt-4 px-4 py-2 bg-orange-500 text-white rounded">
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Avatar</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <div>
            <label className="block text-sm mb-1">Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-2 rounded" />
          </div>

          <div>
            <label className="block text-sm mb-1">Age</label>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-24 p-2 rounded" />
          </div>

          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded">
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button type="button" onClick={() => setEditing(false)} className="px-4 py-2 bg-gray-600 text-white rounded">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default Profile