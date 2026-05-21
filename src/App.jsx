import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import './App.css'

import Navbar from './components/Navbar'

import Home from './pages/Home'
import Matches from './pages/Matches'
import Explorer from './pages/Explorer'
import Recruitment from './pages/Recruitment'
import Profile from './pages/Profile'





import {
  getCurrentUser,
  onAuthStateChange,
  signOut,
} from './services/supabaseService'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function initAuth() {
      const { data } = await getCurrentUser()
      setUser(data?.user ?? null)
    }

    initAuth()

    const { data: authListener } = onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => authListener?.subscription?.unsubscribe()
  }, [])

  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    setUser(null)
    navigate('/')
  }

  return (
    <div className="app-shell">
      {user && <Navbar onLogout={handleLogout} />}

      <Routes>
        <Route path="/" element={<Home user={user} onUserUpdate={setUser} />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/explorer" element={<Explorer />} />
        <Route path="/recruitment" element={<Recruitment />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/register" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App