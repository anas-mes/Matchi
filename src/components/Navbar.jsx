import { Link } from 'react-router-dom'

function Navbar({ onLogout }) {
  return (
    <nav style={{ display: 'flex', gap: '10px' }}>
      <Link to="/">Home</Link>
      <Link to="/add-match">Add Match</Link>
      <Link to="/profile">Profile</Link>
      <button type="button" onClick={onLogout} style={{ cursor: 'pointer' }}>
        Logout
      </button>
    </nav>
  )
}

export default Navbar