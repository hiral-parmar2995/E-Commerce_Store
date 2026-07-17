import { useEffect, useState } from 'react'
import {  useNavigate } from 'react-router-dom'

const Checkout = () => {
  const navigate = useNavigate()
  const [address, setAddress] = useState({
    firstname: '', lastname: '', street: '', city: '', pincode: '', phone: ''
  })
  const [cartItems, setCartItems] = useState([])
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || []
    setCartItems(cart)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
    }
  }, [navigate])
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  const discount = cartItems.length > 0 ? 10 : 0
  const total = subtotal - discount

  const handlePlaceOrder = async () => {
    // Validate required fields
    const { firstname, lastname, street, city, pincode, phone } = address
    if (!firstname || !lastname || !street || !city || !pincode || !phone) {
      setError('Please fill in all delivery fields.')
      return
    }
    if (cartItems.length === 0) {
      setError('Your cart is empty.')
      return
    }

    setPlacing(true)
    setError('')

    try {
      // Build items array with product ref + quantity as the backend expects
      const items = cartItems.map(item => ({
        product: item._id,
        quantity: item.qty
      }))

      const fullAddress = `${firstname} ${lastname}, ${street}, ${city} - ${pincode}, Phone: ${phone}`

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, totalPrice: total, address: fullAddress })
      })

      const json = await res.json()

      if (res.ok) {
        // Save order summary for success page before clearing cart
        localStorage.setItem('lastOrder', JSON.stringify({ items: cartItems, total, orderId: json._id }))
        localStorage.removeItem('cart')
        navigate('/order-success')
      } else {
        setError(json.error || 'Failed to place order. Try again.')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="page-wrapper">
      {/* Steps */}
      <div className="checkout-steps">
        <div className="step done">Cart</div>
        <div className="step active">Delivery</div>
        <div className="step">Payment</div>
        <div className="step">Confirm</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>
        {/* Form */}
        <div className="cart-card">
          <div className="section-title" style={{ marginBottom: '4px' }}>Delivery details</div>
          <div className="section-sub">Where should we deliver?</div>

          {error && (
            <div style={{ background: '#fdeaea', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First name</label>
              <input className="form-input" type="text" placeholder="Raj"
                value={address.firstname} onChange={e => setAddress({ ...address, firstname: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Last name</label>
              <input className="form-input" type="text" placeholder="Patel"
                value={address.lastname} onChange={e => setAddress({ ...address, lastname: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Street address</label>
            <input className="form-input" type="text" placeholder="123, MG Road"
              value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">City</label>
              <input className="form-input" type="text" placeholder="Ahmedabad"
                value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">PIN code</label>
              <input className="form-input" type="text" placeholder="380001"
                value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone number</label>
            <input className="form-input" type="text" placeholder="+91 98765 43210"
              value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} />
          </div>

          {/* Payment note */}
          <div style={{ background: '#f9f9f7', borderRadius: '10px', padding: '14px', marginTop: '8px' }}>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Payment method</div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a' }}>Cash on delivery</div>
            <div style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>Pay when your order arrives</div>
          </div>
        </div>

        {/* Summary — single card, not mapped */}
        <div className="summary-card">
          <div className="summary-title">Order summary</div>
          {cartItems.map(item => (
            <div className="summary-row" key={item._id}>
              <span>{item.name} × {item.qty}</span>
              <span>₹{(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          <hr className="summary-divider" />
          <div className="summary-row"><span>Delivery</span><span style={{ color: '#1a6b4a' }}>Free</span></div>
          <div className="summary-row"><span>Discount</span><span style={{ color: '#b91c1c' }}>−₹{discount.toFixed(2)}</span></div>
          <hr className="summary-divider" />
          <div className="summary-total"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
          <button
            className="btn-main"
            style={{ width: '100%', marginTop: '16px', padding: '12px', opacity: placing ? 0.7 : 1 }}
            onClick={handlePlaceOrder}
            disabled={placing}
          >
            {placing ? 'Placing order…' : 'Place order'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Checkout