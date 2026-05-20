import { Link } from 'react-router-dom'

function Navbar({ onLogout }) {
  return (
    <header className="navbar">
      <div className="navbar__brand">Matchi</div>
      <nav className="navbar__links">
        <Link to="/">Home</Link>
        <Link to="/add-match">Add Match</Link>
        <Link to="/profile">Profile</Link>
        <button type="button" className="button button-secondary" onClick={onLogout}>
          Logout
        </button>
      </nav>
    </header>
  )
}

export default Navbar