import { useEffect, useState } from 'react'
import {
  getCurrentUser,
  getUserProfile,
  uploadProfileImage,
  updateProfile,
  fetchFriendRequests,
  fetchFriends,
  acceptFriendRequest,
  removeFriend,
  fetchUserSquads,
} from '../services/supabaseService'
import FriendRequests from '../components/FriendRequests'
import FriendList from '../components/FriendList'
import SquadsSettings from '../components/SquadsSettings'

function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [bio, setBio] = useState('')
  const [age, setAge] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('overview')
  const [friends, setFriends] = useState([])
  const [requests, setRequests] = useState([])
  const [squads, setSquads] = useState([])
  const [settingsLoading, setSettingsLoading] = useState(false)

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

  useEffect(() => {
    async function loadSettings() {
      setSettingsLoading(true)
      const { data: userData } = await getCurrentUser()
      const userId = userData?.user?.id
      if (!userId) return setSettingsLoading(false)

      const { data: reqData } = await fetchFriendRequests(userId)
      setRequests((reqData || []).filter((r) => r.requested_id === userId && r.status === 'pending'))

      const { data: fData } = await fetchFriends(userId)
      setFriends(fData ?? [])

      const { data: sData } = await fetchUserSquads(userId)
      setSquads(sData ?? [])
      setSettingsLoading(false)
    }

    if (tab === 'settings') loadSettings()
  }, [tab])

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

      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        <button className={`button ${tab === 'overview' ? 'button-primary' : 'button-secondary'}`} onClick={() => setTab('overview')}>Overview</button>
        <button className={`button ${tab === 'settings' ? 'button-primary' : 'button-secondary'}`} onClick={() => setTab('settings')}>Settings</button>
      </div>

      {tab === 'overview' && !editing && (
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
      )}

      {tab === 'settings' && (
        <div>
          {settingsLoading ? (
            <div>Loading settings…</div>
          ) : (
            <div>
              <section className="card-panel">
                <div className="section-heading">
                  <h2>Friends</h2>
                </div>
                <div style={{ display: 'grid', gap: 12 }}>
                  <div>
                    <h4>Incoming requests</h4>
                    <FriendRequests requests={requests} onAccept={async (id) => { await acceptFriendRequest(id); setRequests((r) => r.filter((x) => x.id !== id)); }} onDecline={async (id) => { await removeFriend(id); setRequests((r) => r.filter((x) => x.id !== id)); }} />
                  </div>

                  <div>
                    <h4>Your friends</h4>
                    <FriendList friends={friends} onRemove={async (id) => { await removeFriend(id); setFriends((f) => f.filter((x) => x.id !== id)); }} />
                  </div>
                </div>
              </section>

              <section className="card-panel">
                <div className="section-heading">
                  <h2>Squads</h2>
                </div>
                <SquadsSettings userId={profile.id} />
              </section>
            </div>
          )}
        </div>
      )}

      {tab === 'overview' && editing && (
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