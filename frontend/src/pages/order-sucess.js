import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const OrderSuccess = () => {
  const [order, setOrder] = useState(null)

  useEffect(() => {
    // Read the last order saved by Checkout before cart was cleared
    const saved = localStorage.getItem('lastOrder')
    if (saved) {
      setOrder(JSON.parse(saved))
      localStorage.removeItem('lastOrder')
    }
  }, [])

  // Generate a fake order number for display
  const orderNum = `SE-${Math.floor(10000 + Math.random() * 90000)}`

  return (
    <div className="page-wrapper">
      <div className="success-wrapper">
        <div className="success-icon">✓</div>
        <div className="success-title">Order placed!</div>
        <div className="success-sub">
          Order #{orderNum} · We'll deliver within 3–5 business days
        </div>

        {order && (
          <div className="order-summary-box">
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '12px', fontWeight: '500' }}>Order summary</div>
            {order.items.map(item => (
              <div className="summary-row" key={item._id}>
                <span>{item.name} × {item.qty}</span>
                <span>₹{(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
            <div className="summary-row">
              <span>Discount</span>
              <span style={{ color: '#b91c1c' }}>−₹10.00</span>
            </div>
            <hr className="summary-divider" />
            <div className="summary-total">
              <span>Total paid</span>
              <span>₹{order.total.toFixed(2)}</span>
            </div>
          </div>
        )}

        <Link to="/">
          <button className="btn-main" style={{ padding: '12px 40px' }}>
            Continue shopping
          </button>
        </Link>
      </div>
    </div>
  )
}

export default OrderSuccess