import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar'
import Home from './pages/home'
import Products from './pages/products'
import ProductDetail from './pages/productDetail'
import Cart from './pages/cart'
import Login from './pages/login'
import Register from './pages/register'
import Checkout from './pages/checkout'
import OrderSuccess from './pages/order-sucess'
import './index.css'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product-Detail/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App