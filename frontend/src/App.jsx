import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginScreen from "./pages/LoginScreen";
import SignupScreen from "./pages/SignupScreen";
import Home from"./pages/home";
import Footer from "./components/Layout/Footer";

function App() {
  return (
    <>
      <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<LoginScreen />} />
  <Route path="/signup" element={<SignupScreen />} />
      </Routes>
    </>
  )
}

export default App;