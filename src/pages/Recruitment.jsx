function Recruitment() {
  return (
    <main className="page page--centered">
      <div className="page-inner">
        <header className="page-header">
          <div>
            <p className="eyebrow">Recruitment</p>
            <h1 className="hero-title">Find players and add friends</h1>
            <p className="hero-description">Browse other profiles, send friend requests, and connect with members who want to join your team.</p>
          </div>
        </header>

        <section className="card-panel">
          <div className="section-heading">
            <h2>Suggested players</h2>
            <p className="status-message">Mocked profiles to match your interests. API integration coming later.</p>
          </div>

          <div className="player-grid">
            <article className="player-card">
              <h3>Sam Bauer</h3>
              <p>Position: Forward</p>
              <p>Level: Competitive</p>
              <button className="button button-primary button-full">Add Friend</button>
            </article>
            <article className="player-card">
              <h3>Lea Schmidt</h3>
              <p>Position: Midfield</p>
              <p>Level: Social league</p>
              <button className="button button-primary button-full">Add Friend</button>
            </article>
            <article className="player-card">
              <h3>Jonas Keller</h3>
              <p>Position: Defense</p>
              <p>Level: Weekend warrior</p>
              <button className="button button-primary button-full">Add Friend</button>
            </article>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Recruitment
