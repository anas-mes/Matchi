import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../services/supabaseService'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()

    const { data, error } = await registerUser(email, password)

    if (error) {
      alert(error.message)
    } else {
      alert('Registration successful! Please log in.')
      console.log(data)
      navigate('/login')
    }
  }

  return (
    <div>
      <h1>Register</h1>

      <form onSubmit={handleRegister}>
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

        <button type="submit">Register</button>
      </form>
    </div>
  )
}

export default Register