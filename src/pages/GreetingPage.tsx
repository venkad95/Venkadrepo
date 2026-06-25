import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import "../assets/styles/GreetingPage.css";

// Register the required components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const GreetingPage = () => {
    const userName = "Kumar"; // Replace with dynamic user data if available
    const currentHour = new Date().getHours();
    let timeBasedMessage = "";

    if (currentHour < 12) {
        timeBasedMessage = "Good morning";
    } else if (currentHour < 18) {
        timeBasedMessage = "Good afternoon";
    } else {
        timeBasedMessage = "Good evening";
    }

    const data = {
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [
            {
                label: "Monthly Sales",
                data: [65, 59, 80, 81, 56, 55],
                fill: false,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
            },
        ],
    };

    return (
        <div className="greeting-page">
            <h1>{timeBasedMessage}, {userName}!</h1>
            <div className="graph-container">
                <Line data={data} />
            </div>
        </div>
    );
};

export default GreetingPage;