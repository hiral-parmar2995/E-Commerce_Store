import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API = process.env.REACT_APP_API_URL || 'http://localhost:4000'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('token')) navigate('/')
  }, [navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Login failed.')
      } else {
        localStorage.setItem('token', json.token)
        localStorage.setItem('user', JSON.stringify(json.user))
        navigate('/')
      }
    } catch (err) {
      console.error('Login fetch error:', err)
      setError('Cannot reach server. Make sure the backend is running on port 4000.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-wrapper">
      <div className="form-card">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>👋</div>
          <div className="section-title">Welcome back</div>
          <div className="section-sub" style={{ marginBottom: 0 }}>Login to your account</div>
        </div>

        {error && (
          <div style={{ background: '#fdeaea', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
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
              className="form-input" type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button
            className="btn-main"
            style={{ width: '100%', padding: '12px', marginTop: '4px', opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? 'Logging in…' : 'Login'}
          </button>
          <div className="form-link">
            Don't have an account? <Link to="/register">Register</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login