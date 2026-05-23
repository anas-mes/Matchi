import React from 'react'

export default function FriendList({ friends = [], onRemove = () => {} }) {
  if (!friends || friends.length === 0) return <div>No friends yet.</div>

  return (
    <div>
      {friends.map((f) => {
        // Determine which profile object to use based on relationship
        const otherProfile = f.requested_id ? f.requested : f.requester
        const friendUsername = otherProfile?.username || otherProfile?.name || otherProfile?.email || 'Unknown'

        return (
          <div key={f.id} className="player-card" style={{ marginBottom: 12 }}>
            <h4>{friendUsername}</h4>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="button button-secondary" onClick={() => onRemove(f.id)}>Remove</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
