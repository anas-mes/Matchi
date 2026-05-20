import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser, uploadProfileImage, updateProfile } from '../services/supabaseService'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [age, setAge] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [statusMessage, setStatusMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setStatusMessage('')
    setLoading(true)

    const { data, error } = await registerUser(email, password)

    if (error) {
      setStatusMessage(error.message)
      console.error('registerUser error:', error)
      setLoading(false)
      return
    }

    const userId = data?.user?.id ?? data?.session?.user?.id
    console.log('Auth response:', { data, userId })
    if (!userId) {
      setStatusMessage('Registration succeeded but no user id returned. Check email confirmation settings.')
      console.warn('No userId found in:', data)
      setLoading(false)
      return
    }

    let avatarUrl = null
    if (avatarFile) {
      const { data: uploadData, error: uploadError } = await uploadProfileImage(userId, avatarFile)
      if (uploadError) {
        console.warn('Avatar upload failed (continuing anyway):', uploadError.message)
        // Don't stop registration if avatar fails — it's optional
      } else {
        avatarUrl = uploadData
        console.log('Avatar uploaded:', avatarUrl)
      }
    }

    const updates = { email, name, bio, age: age ? Number(age) : null, avatar_url: avatarUrl }
    console.log('Upserting profile:', { userId, updates })
    const { data: profileData, error: profileError } = await updateProfile(userId, updates)
    console.log('Profile upsert result:', { profileData, profileError })
    if (profileError) {
      setStatusMessage(`Profile save failed: ${profileError.message}`)
      console.error('updateProfile error:', profileError)
      setLoading(false)
      return
    }

    setStatusMessage('Registration complete — please log in.')
    setLoading(false)
    navigate('/login')
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Register</h1>

      <form onSubmit={handleRegister} className="space-y-4">
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <textarea placeholder="Short bio" value={bio} onChange={(e) => setBio(e.target.value)} />
        <input placeholder="Age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
        <div>
          <label>Avatar (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)} />
        </div>

        <button type="submit" disabled={loading}>{loading ? 'Please wait...' : 'Register'}</button>
      </form>

      {statusMessage && <div className="mt-4 text-sm">{statusMessage}</div>}
    </div>
  )
}

export default Register