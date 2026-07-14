import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import React from 'react'
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Layout from './components/Layout'
import Dashboard from "./pages/Dashboard";
import ClientDashboard from "./pages/ClientDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./pages/HomePage";
import About from "./components/About";
import Contact from "./components/Contact";
import GreetingPage from "./pages/GreetingPage";
import OtpVerify from "./pages/OtpVerify";
import AuthorizationRole from "./components/authorizationRole";
import ResetPassword from "./pages/ResetPassword";
import ClientHistoryPage from "./pages/ClientHistoryPage";


function App() {

  return (
    <>
    <ToastContainer/>
    <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/otp-verify" element={<OtpVerify/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/" element={<HomePage/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/greeting" element={<GreetingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<AuthorizationRole allowedRoles ={['owner']}><Dashboard /></AuthorizationRole> } />
        <Route path="/client-dashboard" element={<AuthorizationRole allowedRoles={['owner','client']}><ClientDashboard/></AuthorizationRole> }/>
        <Route path="/forgot-password" element={<ForgotPassword />} /> 
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/purchase-history" element={<AuthorizationRole allowedRoles={['client']}><ClientHistoryPage/></AuthorizationRole>} />
      </Routes>
    </Layout>
  </BrowserRouter>
    </>
  )
}

export default App
