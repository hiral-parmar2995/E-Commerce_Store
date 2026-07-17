import { Link ,useNavigate} from 'react-router-dom'
import { useEffect, useState } from 'react'

const Cart = () => {
  const [cartItems, setCartItems] = useState([])
   const navigate = useNavigate()

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || []
    setCartItems(cart)
  }, [])

  const save = (updated) => {
    setCartItems(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
  }

  const removeItem = (id) => {
    save(cartItems.filter(item => item._id !== id))
  }

  const updateQty = (id, delta) => {
    const updated = cartItems.map(item =>
      item._id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    )
    save(updated)
  }

   const handleCheckout = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    navigate('/checkout')
  }
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  const discount = cartItems.length > 0 ? 10 : 0
  const total = subtotal - discount

  return (
    <div className="page-wrapper">
      <div className="section-title">Your cart</div>
      <div className="section-sub">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</div>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
          <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px', color: '#1a1a1a' }}>Your cart is empty</div>
          <div style={{ color: '#888', marginBottom: '24px', fontSize: '14px' }}>Add some products to get started</div>
          <Link to="/products">
            <button className="btn-main">Browse products</button>
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Items */}
          <div className="cart-card">
            {cartItems.map((item) => (
              <div className="cart-item" key={item._id}>
                <div className="cart-item-img">
                  {item.image
                    ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    : '📦'}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-qty">₹{item.price} each</div>
                  {/* Qty controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <button onClick={() => updateQty(item._id, -1)} style={{ width: '26px', height: '26px', border: '1px solid #e0e0e0', borderRadius: '5px', background: '#fff', cursor: 'pointer', fontSize: '14px' }}>−</button>
                    <span style={{ fontSize: '14px', fontWeight: '500', minWidth: '20px', textAlign: 'center' }}>{item.qty}</span>
                    <button onClick={() => updateQty(item._id, 1)} style={{ width: '26px', height: '26px', border: '1px solid #e0e0e0', borderRadius: '5px', background: '#fff', cursor: 'pointer', fontSize: '14px' }}>+</button>
                  </div>
                </div>
                <div className="cart-item-price">₹{(item.price * item.qty).toFixed(2)}</div>
                <button
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: '16px', marginLeft: '8px', padding: '4px' }}
                  onClick={() => removeItem(item._id)}
                  title="Remove"
                >✕</button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="summary-card">
            <div className="summary-title">Order summary</div>
            <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
            <div className="summary-row"><span>Delivery</span><span style={{ color: '#1a6b4a' }}>Free</span></div>
            <div className="summary-row"><span>Discount</span><span style={{ color: '#b91c1c' }}>−₹{discount.toFixed(2)}</span></div>
            <hr className="summary-divider" />
            <div className="summary-total"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
            <Link to="/checkout">
             <button className="btn-main" style={{ width: '100%', marginTop: '16px', padding: '12px' }} onClick={handleCheckout}>
  Proceed to checkout
</button>
            </Link>
            <Link to="/products">
              <button className="btn-outline" style={{ width: '100%', marginTop: '10px', padding: '11px' }}>
                Continue shopping
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart