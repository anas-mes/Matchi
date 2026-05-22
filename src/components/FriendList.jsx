import React from 'react'

export default function FriendList({ friends = [], onRemove = () => {} }) {
  if (!friends || friends.length === 0) return <div>No friends yet.</div>

  return (
    <div>
      {friends.map((f) => {
        const friendName =
          f.friend?.name ||
          f.friend?.email ||
          f.requested?.name ||
          f.requested?.email ||
          f.requester?.name ||
          f.requester?.email ||
          f.requested_id ||
          f.requester_id

        return (
          <div key={f.id} className="player-card" style={{ marginBottom: 12 }}>
            <h4>{friendName}</h4>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="button button-secondary" onClick={() => onRemove(f.id)}>Remove</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
