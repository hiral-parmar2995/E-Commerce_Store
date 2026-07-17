import { useEffect, useState } from 'react'
import { Link ,useNavigate} from 'react-router-dom'

const Home = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    const fetchProducts = async () => {
  try {
    const res = await fetch('/api/products')
    
    if (!res.ok) {
      console.error('Server error:', res.status, res.statusText)
      return
    }

    const text = await res.text()         // read as text first
    if (!text) {
      console.error('Empty response')
      return
    }

    const json = JSON.parse(text)         // then parse safely
    setProducts(json)
  } catch (err) {
    console.error('Fetch failed:', err)
  } finally {
    setLoading(false)
  }
}
    fetchProducts()
  }, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2000)
  }

  const addToCart = (product) => {
      const token = localStorage.getItem('token')
  if (!token) {
    navigate('/login')  
    return
  }
    const cart = JSON.parse(localStorage.getItem('cart')) || []
    const existing = cart.find(item => item._id === product._id)
    if (existing) {
      existing.qty += 1
      showToast('Cart updated!')
    } else {
      cart.push({ ...product, qty: 1 })
      showToast('Added to cart!')
    }
    localStorage.setItem('cart', JSON.stringify(cart))
  }

  return (
    <div className="page-wrapper">
      {toast && (
        <div style={{
          position: 'fixed', top: '72px', right: '24px', zIndex: 999,
          background: '#1a6b4a', color: '#fff', padding: '10px 20px',
          borderRadius: '8px', fontSize: '14px', fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)', transition: 'all 0.2s'
        }}>
          {toast}
        </div>
      )}

      {/* Hero */}
      <div className="hero">
        <div className="hero-text">
          <h1>Fresh deals,<br />every day</h1>
          <p>Shop the latest products at unbeatable prices</p>
          <Link to="/products">
            <button className="btn-main">Shop now</button>
          </Link>
        </div>
        <div className="hero-icon">🛍️</div>
      </div>

      <div className="section-title">Featured products</div>
      <div className="section-sub">Handpicked just for you</div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>Loading products…</div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>No products found.</div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div className="product-card" key={product._id}>
              <div className="product-img">
                {product.image
                  ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  : '📦'}
              </div>
              <div className="product-info">
                <div className="product-name">{product.name}</div>
                <div>
                  <span className="product-price">₹{product.price}</span>
                </div>
                <div className="product-footer">
                  <span className="badge">In stock: {product.stock}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link to={`/product-Detail/${product._id}`}>
                      <button className="btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}>View</button>
                    </Link>
                    <button
                      className="btn-main"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                      onClick={() => addToCart(product)}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home