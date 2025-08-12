import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TableReservation from './pages/TableReservation';
import PaymentGateway from './pages/PaymentGateway';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PaymentGateway />} />
      
        <Route path="/TableReservation" element={<TableReservation />} />

      </Routes>
    </Router>
  );
}

export default App;