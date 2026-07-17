import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API = process.env.REACT_APP_API_URL || 'http://localhost:4000'

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', cpassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('token')) navigate('/')
  }, [navigate])

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.cpassword) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API}/api/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Registration failed.')
      } else {
        localStorage.setItem('token', json.token)
        localStorage.setItem('user', JSON.stringify(json.user))
        navigate('/')
      }
    } catch (err) {
      console.error('Register fetch error:', err)
      setError('Cannot reach server. Make sure the backend is running on port 4000.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-wrapper">
      <div className="form-card">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🛍️</div>
          <div className="section-title">Create account</div>
          <div className="section-sub" style={{ marginBottom: 0 }}>Join ShopEase today</div>
        </div>

        {error && (
          <div style={{ background: '#fdeaea', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Full name</label>
            <input
              className="form-input" type="text" placeholder="Raj Patel"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input" type="email" placeholder="you@email.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input" type="password" placeholder="Min 6 characters"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm password</label>
            <input
              className="form-input" type="password" placeholder="Repeat password"
              value={form.cpassword} onChange={e => setForm({ ...form, cpassword: e.target.value })}
              required
            />
          </div>
          <button
            className="btn-main"
            style={{ width: '100%', padding: '12px', marginTop: '4px', opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
          <div className="form-link">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register