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
      <main className="page page--hero">
        <section className="hero-panel">
          <div className="hero-copy">
            <span className="eyebrow">Welcome to Matchi</span>
            <h1 className="hero-title">Find local football matches and connect with players.</h1>
            <p className="hero-description">
              Sign in or register to create and manage your profile, upload a picture, and join games nearby.
            </p>
          </div>

          <div className="auth-shell">
            <div className="auth-switch">
              <button
                className={`button ${mode === 'login' ? 'button-primary' : 'button-secondary'}`}
                type="button"
                onClick={() => setMode('login')}
              >
                Login
              </button>
              <button
                className={`button ${mode === 'register' ? 'button-primary' : 'button-secondary'}`}
                type="button"
                onClick={() => setMode('register')}
              >
                Register
              </button>
            </div>

            <form className="form-card" onSubmit={handleSubmit}>
              <div className="form-field">
                <label>Email</label>
                <input
                  className="input"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                />
              </div>

              <div className="form-field">
                <label>Password</label>
                <input
                  className="input"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {mode === 'register' && (
                <>
                  <div className="form-field">
                    <label>Full name</label>
                    <input
                      className="input"
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                    />
                  </div>

                  <div className="form-field">
                    <label>Short bio</label>
                    <textarea
                      className="textarea"
                      placeholder="Tell others about yourself"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>

                  <div className="form-field form-field--small">
                    <label>Age</label>
                    <input
                      className="input"
                      placeholder="Age"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <label>Avatar (optional)</label>
                    <input
                      className="file-input"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                    />
                  </div>
                </>
              )}

              <button className="button button-primary button-full" type="submit" disabled={loading}>
                {loading ? 'Please wait…' : mode === 'login' ? 'Login' : 'Create account'}
              </button>

              {statusMessage && <div className="status-message">{statusMessage}</div>}
            </form>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="page page--centered">
      <section className="hero-panel hero-panel--small">
        <span className="eyebrow">Welcome back</span>
        <h1 className="hero-title">Hello, {user.email}</h1>
        <p className="hero-description">
          You are logged in. Use the navigation bar to add matches, update your profile, and view your games.
        </p>
      </section>
    </main>
  )
}

export default Home