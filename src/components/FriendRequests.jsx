import React from 'react'

export default function FriendRequests({ requests = [], onAccept = () => {}, onDecline = () => {} }) {
  if (!requests || requests.length === 0) return <div>No incoming requests.</div>

  return (
    <div>
      {requests.map((r) => {
        const requesterUsername = r.requester?.username || r.requester?.name || r.requester?.email || 'Unknown'

        return (
          <div key={r.id} className="player-card" style={{ marginBottom: 12 }}>
            <h4>{requesterUsername}</h4>
            <p>Status: {r.status}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="button button-primary" onClick={() => onAccept(r.id)}>Accept</button>
              <button className="button button-secondary" onClick={() => onDecline(r.id)}>Decline</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
