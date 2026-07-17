import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [qty, setQty] = useState(1)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`)
        const json = await res.json()
        if (res.ok) setProduct(json)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2000)
  }

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || []
    const existing = cart.find(item => item._id === product._id)
     const token = localStorage.getItem('token')
  if (!token) {
    navigate('/login')  
    return
  }
    if (existing) {
      existing.qty += qty
      showToast('Cart updated!')
    } else {
      cart.push({ ...product, qty })
      showToast('Added to cart!')
    }
    localStorage.setItem('cart', JSON.stringify(cart))
  }

  const buyNow = () => {
     const token = localStorage.getItem('token')
  if (!token) {
    navigate('/login')  
    return
  }
    addToCart()
    navigate('/cart')
  }

  if (loading) return (
    <div className="page-wrapper" style={{ textAlign: 'center', padding: '80px' }}>
      <div style={{ color: '#888' }}>Loading product…</div>
    </div>
  )

  if (!product) return (
    <div className="page-wrapper" style={{ textAlign: 'center', padding: '80px' }}>
      <div style={{ color: '#888' }}>Product not found.</div>
      <Link to="/products">
        <button className="btn-main" style={{ marginTop: '16px' }}>Back to products</button>
      </Link>
    </div>
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

      <Link to="/products" style={{ fontSize: '13px', color: '#1a6b4a', textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}>
        ← Back to products
      </Link>

      <div className="detail-layout">
        {/* Image */}
        <div className="detail-img">
          {product.image
            ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '16px' }} />
            : '📦'}
        </div>

        {/* Info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '600', color: '#1a1a1a' }}>{product.name}</h2>
            <span className={product.stock > 0 ? 'badge' : 'badge-red'}>
              {product.stock > 0 ? `In stock (${product.stock})` : 'Out of stock'}
            </span>
          </div>

          {product.category && (
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '12px' }}>
              Category: {product.category}
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '28px', fontWeight: '600', color: '#1a6b4a' }}>₹{product.price}</span>
          </div>

          <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.7', marginBottom: '24px' }}>
            {product.description || 'No description provided.'}
          </p>

          {/* Quantity */}
          <div style={{ marginBottom: '20px' }}>
            <div className="form-label">Quantity</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                style={{ width: '32px', height: '32px', border: '1px solid #e0e0e0', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontSize: '16px' }}
              >−</button>
              <span style={{ fontSize: '16px', fontWeight: '500', minWidth: '24px', textAlign: 'center' }}>{qty}</span>
              <button
                onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                style={{ width: '32px', height: '32px', border: '1px solid #e0e0e0', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontSize: '16px' }}
                disabled={qty >= product.stock}
              >+</button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className="btn-main"
              style={{ flex: 1, padding: '12px' }}
              onClick={addToCart}
              disabled={product.stock === 0}
            >
              Add to cart
            </button>
            <button
              className="btn-outline"
              style={{ flex: 1, padding: '12px' }}
              onClick={buyNow}
              disabled={product.stock === 0}
            >
              Buy now
            </button>
          </div>

          {/* Total for selected qty */}
          {qty > 1 && (
            <div style={{ marginTop: '12px', fontSize: '13px', color: '#888' }}>
              Total for {qty} items: <strong style={{ color: '#1a6b4a' }}>₹{(product.price * qty).toFixed(2)}</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail