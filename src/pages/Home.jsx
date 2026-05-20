import { useState } from 'react'
import {
  loginWithPassword,
  registerUser,
  uploadProfileImage,
  updateProfile,
} from '../services/supabaseService'

function Home({ user, onUserUpdate }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [age, setAge] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [statusMessage, setStatusMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatusMessage('')
    setLoading(true)

    if (mode === 'login') {
      const { data, error } = await loginWithPassword(email, password)
      const loggedUser = data?.user ?? data?.session?.user

      if (error) {
        setStatusMessage(error.message)
      } else {
        setStatusMessage('Login successful!')
        onUserUpdate?.(loggedUser)
      }
    } else {
      // Registration flow: create auth user, then create profile row and upload avatar
      const { data, error } = await registerUser(email, password)

      if (error) {
        setStatusMessage(error.message)
      } else {
        const userId = data?.user?.id ?? data?.session?.user?.id

        if (!userId) {
          setStatusMessage('Registration succeeded but no user id returned. Please check email confirmation.')
          setMode('login')
          setEmail('')
          setPassword('')
          setName('')
          setBio('')
          setAge('')
          setAvatarFile(null)
        } else {
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

          const updates = {
            email,
            name,
            bio,
            age: age ? Number(age) : null,
            avatar_url: avatarUrl,
          }

          const { data: profileData, error: profileError } = await updateProfile(userId, updates)
          if (profileError) {
            setStatusMessage(profileError.message)
          } else {
            setStatusMessage('Registration successful! Please log in.')
            setMode('login')
            setEmail('')
            setPassword('')
            setName('')
            setBio('')
            setAge('')
            setAvatarFile(null)
          }
        }
      }
    }

    setLoading(false)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/10">
          <h1 className="text-3xl font-bold text-center mb-6">Welcome to Matchi</h1>

          <div className="flex justify-center gap-2 mb-6">
            <button
              className={`px-5 py-2 rounded-full ${mode === 'login' ? 'bg-orange-500 text-white' : 'bg-white/10 text-white'}`}
              onClick={() => setMode('login')}
              type="button"
            >
              Login
            </button>
            <button
              className={`px-5 py-2 rounded-full ${mode === 'register' ? 'bg-orange-500 text-white' : 'bg-white/10 text-white'}`}
              onClick={() => setMode('register')}
              type="button"
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="w-full rounded-2xl px-4 py-3 bg-white/10 border border-white/10 text-white placeholder:text-white/70"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
            <input
              className="w-full rounded-2xl px-4 py-3 bg-white/10 border border-white/10 text-white placeholder:text-white/70"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {mode === 'register' && (
              <>
                <input
                  className="w-full rounded-2xl px-4 py-3 bg-white/10 border border-white/10 text-white placeholder:text-white/70"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                />

                <textarea
                  className="w-full rounded-2xl px-4 py-3 bg-white/10 border border-white/10 text-white placeholder:text-white/70"
                  placeholder="Short bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />

                <input
                  className="w-32 rounded-2xl px-3 py-2 bg-white/10 border border-white/10 text-white placeholder:text-white/70"
                  placeholder="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  type="number"
                />

                <div>
                  <label className="block text-sm mb-1">Avatar (optional)</label>
                  <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)} />
                </div>
              </>
            )}
            <button
              type="submit"
              className="w-full rounded-2xl bg-orange-500 py-3 font-semibold text-white hover:bg-orange-600"
              disabled={loading}
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
            </button>
          </form>

          {statusMessage && (
            <div className="mt-4 text-center text-sm text-white/80">
              {statusMessage}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl font-bold mb-4">Welcome back, {user.email}</h1>
        <p className="text-white/70 max-w-xl mb-8">
          You are now logged in. Use the navigation bar to add matches, see your profile, and manage your games.
        </p>
      </main>
    </div>
  )
}

export default Home