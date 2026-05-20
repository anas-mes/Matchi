import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createMatch } from '../services/supabaseService'

function AddMatch() {
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newMatch = {
      title,
      location,
      date,
    }

    const { data, error } = await createMatch(newMatch)

    if (error) {
      alert(error.message)
    } else {
      alert('Match created successfully!')
      console.log(data)
      navigate('/')
    }
  }

  return (
    <div>
      <h1>Add Match</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          placeholder="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button type="submit">Create Match</button>
      </form>
    </div>
  )
}

export default AddMatch