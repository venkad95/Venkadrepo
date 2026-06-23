import React, { useState } from "react";
import AuthCard from "../components/AuthCard";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from '../services/api';
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const Login = () =>{
  const [loading, setLoading] = useState(false);
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
    setLoading(true)
    try {
      const response = await api.post("/auth/login", formData);
      setLoading(false)
      const userData = response.data.user;
      localStorage.setItem("token",response.data.accessToken);
      localStorage.setItem("user",JSON.stringify(response.data.user));
      toast.success("Login successfully");
      if(userData.role == 'owner'){
        navigate("/dashboard");
      }
      else{
        navigate("/client-dashboard")
      }

    } catch (error: any) {
      setLoading(false)
      toast.error(error.response?.data?.message);
      // alert(
      //   error.response?.data?.message ||
      //   "Login failed"
      // );

    }
  };
  if (loading) return <Loader />;
  return (
    <AuthCard
      title="Welcome"
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