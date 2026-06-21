import React from "react";
import '../assets/styles/AuthCard.css';

type Props = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

function AuthCard({
  title,
  subtitle,
  children,
}: Props) {
  return (
    <div className="auth-container">
      <div className="auth-card auth-logo">
        <h2>{title}</h2>
        <p>{subtitle}</p>

        {children}
      </div>
    </div>
  );
}

export default AuthCard;