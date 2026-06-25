import React, { useEffect, useState } from "react";
import "../assets/styles/OtpVerify.css";
import api from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const OtpVerify = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [timer, setTimer] = useState(240); // Timer in seconds (3 minutes)

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtp(e.target.value);
    };

    const handleVerifyOtp = async () => {
        if (otp.trim().length !== 6) {
            setErrorMessage("Please enter a valid 6-digit OTP.");
            return;
        }

        setLoading(true);
        setErrorMessage("");

        try {
            const response = await api.post("/auth/verify-otp", { otp });
            if (response.data.success) {
                toast.success("OTP verified successfully!");
                const userData = response.data;
                localStorage.setItem("token", userData.accessToken);
                localStorage.setItem("user", JSON.stringify(userData.user));
                navigate("/client-dashboard")
            } else {
                setErrorMessage("Invalid OTP. Please try again.");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            setErrorMessage("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

     // Timer countdown logic
     useEffect(() => {
        if (timer > 0) {
            const countdown = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);

            return () => clearInterval(countdown); // Cleanup interval on unmount
        }
    }, [timer]);

    // Format timer as MM:SS
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
    };

    return (
        <div className="otp-verify-container">
            <div className="otp-verify-box">
                <h2>Verify OTP</h2>
                <p>Please enter the OTP sent to your registered email or phone.</p>
                <div className="form-group">
                    <label htmlFor="otp">Enter OTP</label>
                    <input
                        type="text"
                        id="otp"
                        value={otp}
                        onChange={handleOtpChange}
                        maxLength={6}
                        placeholder="Enter 6-digit OTP"
                    />
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button
                    className="verify-btn"
                    onClick={handleVerifyOtp}
                    disabled={loading}
                >
                    {loading ? <span className="btn-spinner"></span> : "Verify OTP"}
                </button>
                <p className="timer">
                    {timer > 0
                        ? `Time remaining: ${formatTime(timer)}`
                        : "OTP expired. Please request a new OTP."}
                </p>
            </div>
        </div>
    );
};

export default OtpVerify;