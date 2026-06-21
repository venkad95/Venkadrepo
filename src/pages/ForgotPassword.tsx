import React from "react";
import AuthCard from "../components/AuthCard";
import { Link } from "react-router-dom";

function ForgotPassword() {
  return (
    <AuthCard
      title="Forgot Password"
      subtitle="Reset your password"
    >
      <input
        type="email"
        placeholder="Email Address"
        className="auth-input"
      />

      <button className="auth-btn">
        Send Reset Link
      </button>

      <p className="text-center mt-4">
        <Link to="/login">
          Back to Login
        </Link>
      </p>
    </AuthCard>
  );
}

export default ForgotPassword;