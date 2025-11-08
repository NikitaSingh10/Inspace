import React from 'react'
import{Routes, Route, useLocation} from 'react-router-dom'
import Home from './pages/Home'
import PlaceOrder from './pages/PlaceOrder'
import Navbar from'./components/Navbar'
import Collection from './pages/Collection';
import About from './pages/About';
import Contact from './pages/Contact';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Orders from './pages/Orders';
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import ProductPage from './pages/ProductPage'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ARViewer from './pages/ARViewer';
import PaymentSuccess from './pages/PaymentSuccess';

const App = () => {
  const location = useLocation();
  const isARViewer = location.pathname === '/ar-viewer';

  // For AR viewer, render without layout wrapper
  if (isARViewer) {
    return (
      <>
        <ToastContainer/>
        <Routes>
          <Route path="/ar-viewer" element={<ARViewer />} />
        </Routes>
      </>
    );
  }

// In your routes:


  // For all other pages, render with normal layout
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer/>
      <Navbar />
      <SearchBar />
  
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/Collection' element={<Collection />}/>
        <Route path='/About' element={<About />}/>
        <Route path='/Contact' element={<Contact />} />
        <Route path='/Product/:productId' element={<Product/>} />
        <Route path='/Cart' element={<Cart />}/>
        <Route path='/Login' element={<Login />}/>
        <Route path='/PlaceOrder' element={<PlaceOrder/>}/>
        <Route path='/Orders' element={<Orders/>}/>
        <Route path="/product" element={<ProductPage />} /> 
        <Route path="/ar-viewer" element={<ARViewer />} />
        <Route path='/payment-success' element={<PaymentSuccess />} />
      </Routes>
      <Footer />

    </div>
  )
    
}

export default App
