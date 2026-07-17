import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  // Re-read cart/user from localStorage on every render + storage events
  useEffect(() => {
    const update = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || []
      setCartCount(cart.reduce((acc, item) => acc + item.qty, 0))
      const stored = localStorage.getItem('user')
      setUser(stored ? JSON.parse(stored) : null)
    }
    update()
    window.addEventListener('storage', update)
    // Also poll every 500ms so cart badge updates after add-to-cart
    const interval = setInterval(update, 500)
    return () => {
      window.removeEventListener('storage', update)
      clearInterval(interval)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">ShopEase</Link>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/cart">
          Cart <span className="cart-badge">{cartCount}</span>
        </Link>
        {user ? (
          <>
            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px' }}>
              Hi, {user.name?.split(' ')[0]}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '5px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontFamily: 'DM Sans, sans-serif'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '5px 14px',
              borderRadius: '6px',
              color: '#fff'
            }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar