import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import React from 'react'
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Layout from './components/Layout'
import Dashboard from "./pages/Dashboard";
import ClientDashboard from "./pages/ClientDashboard";


function App() {

  return (
    <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/client-dashboard" element={<ClientDashboard/>}/>
      </Routes>
    </Layout>
  </BrowserRouter>
  )
}

export default App
