import React from 'react'

export default function MembersPicker({ friends = [], selected = [], onChange = () => {} }) {
  const toggle = (id) => {
    const exists = selected.includes(id)
    const next = exists ? selected.filter((s) => s !== id) : [...selected, id]
    onChange(next)
  }

  if (!friends || friends.length === 0) return <div>No friends to choose from.</div>

  return (
    <div>
      {friends.map((f) => {
        const id = f.user_id ?? f.requester_id ?? f.requested_id
        return (
          <label key={id} style={{ display: 'block', marginBottom: 8 }}>
            <input type="checkbox" checked={selected.includes(id)} onChange={() => toggle(id)} /> {f.requester_email ?? f.requested_email ?? id}
          </label>
        )
      })}
    </div>
  )
}
