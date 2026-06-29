import React, { useState } from "react";
import AuthCard from "../components/AuthCard";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobileNumber: ""
  });
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Real-time password validation
    if (name === "password") {
      setPasswordValidation({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /\d/.test(value),
        specialChar: /[@$!%*?&]/.test(value),
      });
    }
  };
  const handleRegister = async () => {
    setLoading(true)
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
      // Password validation
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        alert(
          "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character."
        );
        setLoading(false);
        return;
      }
      const response = await api.post("/auth/signup", formData);
      setLoading(false)
      const userData = response.data;
      toast.success(response.data.message);
      // localStorage.setItem("token",userData.data.accessToken);
      // localStorage.setItem("user",JSON.stringify(userData.data.user));
      navigate("/otp-verify");
    } catch (error: any) {
      setLoading(false)
      toast.error(error.response?.data?.message);
    }
  };
  if (loading) return <Loader />
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
      {/* Password Validation Feedback */}
      <div className="password-validation">
        <p className={passwordValidation.length ? "valid" : "invalid"}>
        {passwordValidation.length ? "✔" : "✖"}
          At least 8 characters
        </p>
        <p className={passwordValidation.uppercase ? "valid" : "invalid"}>
          {passwordValidation.uppercase ? "✔" : "✖"}
          At least one uppercase letter
        </p>
        <p className={passwordValidation.lowercase ? "valid" : "invalid"}>
          {passwordValidation.lowercase ? "✔" : "✖"}
          At least one lowercase letter
        </p>
        <p className={passwordValidation.number ? "valid" : "invalid"}>
          {passwordValidation.number ? "✔" : "✖"}
          At least one number
        </p>
        <p className={passwordValidation.specialChar ? "valid" : "invalid"}>
          {passwordValidation.specialChar ? "✔" : "✖"}
          At least one special character (@, $, !, %, *, ?, &)
        </p>
      </div>
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