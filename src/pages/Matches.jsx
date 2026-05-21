function Matches() {
  return (
    <main className="page page--centered">
      <div className="page-inner">
        <header className="page-header">
          <div>
            <p className="eyebrow">Matches</p>
            <h1 className="hero-title">Browse scheduled games</h1>
            <p className="hero-description">Filter matches by location, date, and type. This is the place to find your next pickup game.</p>
          </div>
        </header>

        <section className="card-panel">
          <div className="section-heading">
            <h2>Upcoming matches</h2>
            <p className="status-message">Mocked list: your live match feed will appear here.</p>
          </div>

          <div className="match-grid">
            <article className="match-card">
              <h3>Friday Night 7v7</h3>
              <p>Location: City Park</p>
              <p>Date: 2026-06-11</p>
              <p>Status: Open for players</p>
            </article>
            <article className="match-card">
              <h3>Sunday Pickup Game</h3>
              <p>Location: Downtown Field</p>
              <p>Date: 2026-06-14</p>
              <p>Status: 3 spots left</p>
            </article>
            <article className="match-card">
              <h3>Midweek Training</h3>
              <p>Location: Community Stadium</p>
              <p>Date: 2026-06-18</p>
              <p>Status: Invite only</p>
            </article>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Matches
