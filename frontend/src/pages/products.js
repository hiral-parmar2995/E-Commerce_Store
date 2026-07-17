import { useEffect, useState } from 'react'
import { Link ,useNavigate} from 'react-router-dom'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const [toast, setToast] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products')
        const json = await res.json()
        if (res.ok) setProducts(json)
      } catch (err) {
        console.error(err)
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
    const cart = JSON.parse(localStorage.getItem('cart')) || []
    const existing = cart.find(item => item._id === product._id)
     const token = localStorage.getItem('token')
  if (!token) {
    navigate('/login')  
    return
  }
    if (existing) {
      existing.qty += 1
      showToast('Cart updated!')
    } else {
      cart.push({ ...product, qty: 1 })
      showToast('Added to cart!')
    }
    localStorage.setItem('cart', JSON.stringify(cart))
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-wrapper">
      {toast && (
        <div style={{
          position: 'fixed', top: '72px', right: '24px', zIndex: 999,
          background: '#1a6b4a', color: '#fff', padding: '10px 20px',
          borderRadius: '8px', fontSize: '14px', fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          {toast}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div className="section-title" style={{ marginBottom: 0 }}>All products</div>
        <input
          className="form-input"
          style={{ width: '240px' }}
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="section-sub">{filtered.length} products found</div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>Loading products…</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>No products match your search.</div>
      ) : (
        <div className="product-grid">
          {filtered.map((product) => (
            <div className="product-card" key={product._id}>
              <div className="product-img">
                {product.image
                  ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  : '📦'}
              </div>
              <div className="product-info">
                <div className="product-name">{product.name}</div>
                {product.category && (
                  <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>{product.category}</div>
                )}
                <div>
                  <span className="product-price">₹{product.price}</span>
                </div>
                <div className="product-footer">
                  <span className="badge">Stock: {product.stock}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link to={`/product-Detail/${product._id}`}>
                      <button className="btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}>View</button>
                    </Link>
                    <button
                      className="btn-main"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0 ? 'Out' : 'Add'}
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

export default Products