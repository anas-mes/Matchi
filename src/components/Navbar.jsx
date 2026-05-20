import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav style={{ display: 'flex', gap: '10px' }}>
      <Link to="/">Home</Link>
      <Link to="/add-match">Add Match</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/login">Login</Link>
    </nav>
  )
}

export default Navbar