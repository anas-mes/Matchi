import React, { useEffect, useState } from 'react'
import {
  getCurrentUser,
  fetchFriendRequests,
  fetchFriends,
  searchProfiles,
  sendFriendRequest,
  acceptFriendRequest,
} from '../services/supabaseService'

export default function Recruitment() {
  const [currentUser, setCurrentUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [incomingRequests, setIncomingRequests] = useState([])
  const [friends, setFriends] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [requestedIds, setRequestedIds] = useState(new Set())

  const getDisplayName = (profile) => profile?.name || profile?.email || 'Unknown'
  const getFriendName = (friend) =>
    friend.friend?.name ||
    friend.friend?.email ||
    friend.requested?.name ||
    friend.requested?.email ||
    friend.requester?.name ||
    friend.requester?.email ||
    friend.requested_id ||
    friend.requester_id

  useEffect(() => {
    async function loadCurrentUser() {
      const { data, error } = await getCurrentUser()
      if (error) return setError('Failed to load user')
      setCurrentUser(data?.user ?? null)
    }
    loadCurrentUser()
  }, [])

  useEffect(() => {
    if (!currentUser) return
    async function loadConnections() {
      const [{ data: reqData }, { data: friendsData }] = await Promise.all([
        fetchFriendRequests(currentUser.id),
        fetchFriends(currentUser.id),
      ])
      setIncomingRequests((reqData || []).filter(r => r.requested_id === currentUser.id && r.status === 'pending'))
      setFriends(friendsData || [])
    }
    loadConnections()
  }, [currentUser])

  const handleSearch = async (e) => {
    e?.preventDefault()
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await searchProfiles(searchQuery)
      if (error) return setError(error.message || 'Search failed')
      setSearchResults((data || []).filter(p => p.id !== currentUser?.id))
    } finally {
      setLoading(false)
    }
  }

  const handleSendRequest = async (profileId) => {
    try {
      const { error } = await sendFriendRequest(profileId)
      if (error) throw error
      setRequestedIds(prev => new Set([...Array.from(prev), profileId]))
      alert('Friend request sent')
    } catch (err) {
      console.error(err)
      alert('Failed to send friend request')
    }
  }

  const handleAcceptRequest = async (friendshipId) => {
    try {
      const { error } = await acceptFriendRequest(friendshipId)
      if (error) throw error
      setIncomingRequests(prev => prev.filter(r => r.id !== friendshipId))
      const { data } = await fetchFriends(currentUser.id)
      setFriends(data || [])
    } catch (err) {
      console.error(err)
      alert('Failed to accept request')
    }
  }

  const isFriend = (profileId) => {
    return friends.some(f => (f.requester_id === profileId || f.requested_id === profileId) && f.status === 'accepted')
  }

  const hasPending = (profileId) => {
    return requestedIds.has(profileId) || incomingRequests.some(r => (r.requester_id === profileId && r.requested_id === currentUser?.id) || (r.requested_id === profileId && r.requester_id === currentUser?.id))
  }

  return (
    <main className="page page--centered">
      <div className="page-inner">
        <header className="page-header">
          <div>
            <p className="eyebrow">Recruitment</p>
            <h1 className="hero-title">Find players and add friends</h1>
            <p className="hero-description">Search other profiles and connect with players.</p>
          </div>
        </header>

        {error && <div className="status-message" style={{ color: 'salmon' }}>{error}</div>}

        <section className="card-panel">
          <form onSubmit={handleSearch} style={{ display: 'grid', gap: 8 }}>
            <input
              className="input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="button button-primary" type="submit" disabled={loading}>
                {loading ? 'Searching…' : 'Search'}
              </button>
              <button
                type="button"
                className="button button-secondary"
                onClick={() => { setSearchQuery(''); setSearchResults([]) }}
              >
                Clear
              </button>
            </div>
          </form>
        </section>

        {searchResults.length > 0 && (
          <section className="card-panel">
            <div className="section-heading"><h2>Search Results</h2></div>
            <div className="player-grid">
              {searchResults.map(profile => (
                <article className="player-card" key={profile.id}>
                  <h3>{profile.name || profile.email || 'Unknown'}</h3>
                  <p>{profile.bio || ''}</p>
                  {!isFriend(profile.id) && !hasPending(profile.id) && (
                    <button className="button button-primary button-full" onClick={() => handleSendRequest(profile.id)}>
                      Add Friend
                    </button>
                  )}
                  {hasPending(profile.id) && <button className="button button-secondary button-full" disabled>Pending</button>}
                  {isFriend(profile.id) && <button className="button button-secondary button-full" disabled>Friend</button>}
                </article>
              ))}
            </div>
          </section>
        )}

        {incomingRequests.length > 0 && (
          <section className="card-panel">
            <div className="section-heading"><h2>Incoming Requests</h2></div>
            <div className="player-grid">
              {incomingRequests.map(req => (
                <article className="player-card" key={req.id}>
                  <h3>Request from {getDisplayName(req.requester)}</h3>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="button button-primary" onClick={() => handleAcceptRequest(req.id)}>Accept</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="card-panel">
          <div className="section-heading"><h2>My Friends ({friends.length})</h2></div>
          <div>
            {friends.length === 0 ? (
              <p className="status-message">No friends yet. Use search to add players.</p>
            ) : (
              friends.map(f => (
                <div key={f.id} className="player-card" style={{ marginBottom: 8 }}>
                  <p>{getFriendName(f)}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  )
}