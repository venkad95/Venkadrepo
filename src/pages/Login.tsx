import React, { useState } from "react";
import AuthCard from "../components/AuthCard";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from '../services/api';

const Login = () =>{
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", formData);
      const userData = response.data.user;
      localStorage.setItem("token",response.data.accessToken);
      localStorage.setItem("user",JSON.stringify(response.data.user));
      if(userData.role == 'owner'){
        navigate("/dashboard");
      }
      else{
        navigate("/client-dashboard")
      }

    } catch (error: any) {
      alert(
        error.response?.data?.message ||
        "Login failed"
      );

    }
  };
  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Sign in to continue"
    >
      <input
        className="auth-input"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email Address"
      />

      <input
        className="auth-input"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />

      <div className="forgot-link">
        <Link to="/forgot-password">
          Forgot Password?
        </Link>
      </div>

      <button className="auth-btn" onClick={handleLogin}>
        Login
      </button>

      <div className="auth-link">
        Don't have an account?
        <Link to="/register"> Register</Link>
      </div>
    </AuthCard>
  );
}

export default Login;