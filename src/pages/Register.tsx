import React, { useState } from "react";
import AuthCard from "../components/AuthCard";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email:"",
    password:"",
    mobileNumber: ""
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleRegister = async () => {
    try {
      if (!formData.firstName) {
        alert("First Name is required");
        return;
      }
    
      if (!formData.email) {
        alert("Email is required");
        return;
      }
    
      if (!formData.password) {
        alert("Password is required");
        return;
      }    
      const response = await api.post("/auth/signup",formData);
      const userData = response.data;
      alert(response.data.message);
      localStorage.setItem("token",response.data.accessToken);
      localStorage.setItem("user",JSON.stringify(response.data.user));
      if(userData.role == 'owner'){
        navigate("/dashboard");
      }
      else{
        navigate("/client-dashboard")
      }
    } catch (error: any) {
      alert(error.response?.data?.message);
    }
  };
  return (
    <AuthCard
      title="Create Account"
      subtitle="Register to get started"
    >
      <input
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        placeholder="First Name"
        className="auth-input"
      />

      <input
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        placeholder="Last Name"
        className="auth-input"
      />

      <input
        type="text"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="UserName"
        className="auth-input"
      />

      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        className="auth-input"
      />

      <input
        type="text"
        name="mobileNumber"
        value={formData.mobileNumber}
        onChange={handleChange}
        placeholder="mobile number"
        className="auth-input"
      />

      <button className="auth-btn" onClick={handleRegister}>
        Register
      </button>

      <p className="text-center mt-4">
        Already have an account?{" "}
        <Link to="/login">
          Login
        </Link>
      </p>
    </AuthCard>
  );
}

export default Register;