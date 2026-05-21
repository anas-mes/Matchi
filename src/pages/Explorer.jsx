function Explorer() {
  return (
    <main className="page page--centered">
      <div className="page-inner">
        <header className="page-header">
          <div>
            <p className="eyebrow">Explorer</p>
            <h1 className="hero-title">Discover activity and match posts</h1>
            <p className="hero-description">A feed for poster updates, match invites, and social posts. Add your own content later.</p>
          </div>
        </header>

        <section className="card-panel">
          <div className="section-heading">
            <h2>Live feed</h2>
            <p className="status-message">Mocked feed cards for upcoming posts and announcements.</p>
          </div>

          <div className="feed-grid">
            <article className="feed-card">
              <h3>Looking for 2 players</h3>
              <p>Local pickup game on Sunday. Need midfielders and forwards.</p>
              <p className="status-message">Posted 1 hour ago</p>
            </article>
            <article className="feed-card">
              <h3>New team forming</h3>
              <p>Friendly weekend squad seeking reliable defenders.</p>
              <p className="status-message">Posted yesterday</p>
            </article>
            <article className="feed-card">
              <h3>Coach says join training</h3>
              <p>Open training session for anyone who wants to improve ball control.</p>
              <p className="status-message">Posted 2 days ago</p>
            </article>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Explorer
