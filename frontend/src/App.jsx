import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Menu from './Pages/menu/Ramen'
import PreOrder from './Pages/PreOrder'
import Rice from './Pages/menu/Rice'
import Soup from './Pages/menu/Soup'
import Drink from './Pages/menu/Drink'
import More from './Pages/menu/More'



const App = () => {
  return (
    <BrowserRouter>
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/PreOrder" element={<PreOrder />} />
        <Route path="/rice" element={<Rice />} />
        <Route path="/ramen" element={<Menu />} />
        <Route path="/soup" element={<Soup />} />
        <Route path="/drink" element={<Drink />} />
        <Route path="/more" element={<More />} />
    

      </Routes>
    </BrowserRouter>
  )
}

export default App
