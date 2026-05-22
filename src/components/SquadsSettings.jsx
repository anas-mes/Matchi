import React, { useEffect, useState } from 'react'
import MembersPicker from './MembersPicker'
import { fetchUserSquads, createSquad, fetchFriends } from '../services/supabaseService'

export default function SquadsSettings({ userId }) {
  const [squads, setSquads] = useState([])
  const [friends, setFriends] = useState([])
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [selected, setSelected] = useState([])
  const [status, setStatus] = useState('')

  useEffect(() => {
    async function load() {
      const { data: sData } = await fetchUserSquads(userId)
      setSquads(sData ?? [])
      const { data: fData } = await fetchFriends(userId)
      setFriends(fData ?? [])
    }
    if (userId) load()
  }, [userId])

  const handleCreate = async (e) => {
    e.preventDefault()
    setStatus('')
    if (squads.length >= 5) return setStatus('You already have 5 squads.')
    if (selected.length < 3) return setStatus('A squad needs at least 3 members.')
    if (selected.length > 6) return setStatus('A squad can have at most 6 members.')

    setCreating(true)
    const { data, error } = await createSquad(userId, name, selected)
    if (error) setStatus(error.message)
    else {
      setSquads((s) => [data, ...s])
      setName('')
      setSelected([])
      setStatus('Squad created')
    }
    setCreating(false)
  }

  return (
    <div>
      <div className="section-heading">
        <h3>Your squads</h3>
        <p className="status-message">Create up to 5 squads with 3–6 members.</p>
      </div>

      {squads.length === 0 ? <div>No squads yet.</div> : squads.map((q) => (
        <div key={q.id} className="player-card" style={{ marginBottom: 12 }}>
          <strong>{q.name}</strong>
          <div>{q.member_count ? `${q.member_count} members` : 'Members will appear here'}</div>
        </div>
      ))}

      <div className="card-panel" style={{ marginTop: 16 }}>
        <h4>Create squad</h4>
        <form onSubmit={handleCreate}>
          <div className="form-field">
            <label>Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="form-field">
            <label>Members</label>
            <MembersPicker friends={friends} selected={selected} onChange={setSelected} />
          </div>

          <div style={{ marginTop: 12 }}>
            <button className="button button-primary" type="submit" disabled={creating}>{creating ? 'Creating…' : 'Create squad'}</button>
            {status && <div className="status-message">{status}</div>}
          </div>
        </form>
      </div>
    </div>
  )
}
