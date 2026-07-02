import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }
    setLoading(true);
    try {
      const response = await api.post("/auth/forgot-password", { email });
      toast.success(response.data.message || "Password reset link sent to your email.");
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <p>Enter your email to receive a password reset link.</p>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="auth-input"
      />
      <button
        className="auth-btn"
        onClick={handleForgotPassword}
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </button>
    </div>
  );
};

export default ForgotPassword;