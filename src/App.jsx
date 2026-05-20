import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

import Navbar from './components/Navbar'

import Home from './pages/Home'
import Profile from './pages/Profile'
import AddMatch from './pages/AddMatch'
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

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <div className="app-shell">
      {user && <Navbar onLogout={handleLogout} />}

      <Routes>
        <Route path="/" element={<Home user={user} onUserUpdate={setUser} />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/register" element={<Navigate to="/" replace />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/add-match" element={<AddMatch />} />
      </Routes>
    </div>
  )
}

export default App