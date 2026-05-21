import { useEffect, useState } from 'react'
import { createMatch, fetchMatches } from '../services/supabaseService'

function Matches() {
  const [matches, setMatches] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [matchDate, setMatchDate] = useState('')
  const [description, setDescription] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadMatches() {
      const { data, error } = await fetchMatches()
      if (error) {
        setStatusMessage(error.message)
      } else {
        setMatches(data ?? [])
      }
    }

    loadMatches()
  }, [])

  const refreshMatches = async () => {
    const { data, error } = await fetchMatches()
    if (error) {
      setStatusMessage(error.message)
    } else {
      setMatches(data ?? [])
    }
  }

  const handleCreateMatch = async (e) => {
    e.preventDefault()
    setStatusMessage('')
    setLoading(true)

    const payload = {
      title,
      description,
      location,
      match_date: matchDate ? new Date(matchDate).toISOString() : null,
    }

    const { data, error } = await createMatch(payload)
    if (error) {
      setStatusMessage(error.message)
    } else {
      setStatusMessage('Match created successfully.')
      setTitle('')
      setLocation('')
      setMatchDate('')
      setDescription('')
      setShowForm(false)
      await refreshMatches()
    }

    setLoading(false)
  }

  return (
    <main className="page page--centered">
      <div className="page-inner">
        <header className="page-header">
          <div>
            <p className="eyebrow">Matches</p>
            <h1 className="hero-title">Browse scheduled games</h1>
            <p className="hero-description">View upcoming matches and post your own game.</p>
          </div>
          <button className="button button-primary" onClick={() => setShowForm((prev) => !prev)}>
            {showForm ? 'Close form' : 'Create match'}
          </button>
        </header>

        {showForm && (
          <section className="card-panel">
            <div className="section-heading">
              <h2>New match</h2>
              <p className="status-message">Fill in the match details and submit.</p>
            </div>

            <form onSubmit={handleCreateMatch} className="form-card">
              <div className="form-field">
                <label>Title</label>
                <input
                  className="input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Friday Evening 5-a-side"
                  required
                />
              </div>

              <div className="form-field">
                <label>Location</label>
                <input
                  className="input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. City Park"
                  required
                />
              </div>

              <div className="form-field">
                <label>Date and time</label>
                <input
                  className="input"
                  type="datetime-local"
                  value={matchDate}
                  onChange={(e) => setMatchDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label>Description</label>
                <textarea
                  className="textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the game, skill level, or number of players needed."
                />
              </div>

              <button className="button button-primary button-full" type="submit" disabled={loading}>
                {loading ? 'Saving…' : 'Create match'}
              </button>
              {statusMessage && <div className="status-message">{statusMessage}</div>}
            </form>
          </section>
        )}

        <section className="card-panel">
          <div className="section-heading">
            <h2>Upcoming matches</h2>
            <p className="status-message">Click &quot;Create match&quot; to add a new game.</p>
          </div>

          <div className="match-grid">
            {matches.length > 0 ? (
              matches.map((match) => (
                <article className="match-card" key={match.id || match.title}>
                  <h3>{match.title || 'Untitled match'}</h3>
                  <p>{match.location || 'Unknown location'}</p>
                  <p>{match.description || 'No description yet.'}</p>
                  <p>{match.match_date ? new Date(match.match_date).toLocaleString() : 'Date not set'}</p>
                </article>
              ))
            ) : (
              <article className="match-card">
                <h3>No matches yet</h3>
                <p>Create the first match with the button above.</p>
              </article>
            )}
          </div>
        </section>
      </div>

      <button className="fab" onClick={() => setShowForm(true)}>
        + Create match
      </button>
    </main>
  )
}

export default Matches
