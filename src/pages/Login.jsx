import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginWithPassword } from '../services/supabaseService'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    const { data, error } = await loginWithPassword(email, password)

    if (error) {
      alert(error.message)
    } else {
      alert('Login successful!')
      console.log(data)
      navigate('/')
    }
  }

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login