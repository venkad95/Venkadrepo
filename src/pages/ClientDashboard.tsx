import { useEffect, useState } from "react";
import PurchaseModal from "../components/PurchaseModal";
import "../assets/styles/ClientDashboard.css";
import React from "react";
import api from "../services/api";
import moment from "moment";
import Loader from "../components/Loader";

const Dashboard = () => {
    interface SummaryData {
        month: string;
        product_name: string;
        total_liters: number;
        amount: number;
        total_days: number;
      }
    const [showModal, setShowModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState("");
    const [historyData, setHistoryData] = useState([]);
    const [summaryData, setSummryData] = useState<SummaryData[]>([]);
          const [loading, setLoading] = useState(false);

    useEffect(()=>{
        clientSummary();
    },[])
    const clientSummary  = async ()=>{
        setLoading(true);
        try{
            const response = await api.get('/product/client-summary');
            setLoading(false);
            if(response.data){
                setSummryData(response.data)
            }
        }
        catch(err){
            setLoading(false)
            console.log(err);
            
        }
    }

    const handleView = async (month: string) => {
        setSelectedMonth(month);
        setShowHistoryModal(true);
        const formattedMonth = moment(
            month,
            "MMM-YYYY"
          ).format("YYYY-MM");
          setLoading(true);
        try {

            const response = await api.get(
                `/product/client-history/${formattedMonth}`
            );
            setLoading(false)
            setHistoryData(response.data);
            setSelectedMonth(month);

            setShowHistoryModal(true);

        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    };
    if(loading) return <Loader/>

    return (
        <div className="dashboard">

            <div className="dashboard-header">
                <h2>Welcome Kumar</h2>

                <button
                    className="add-btn"
                    onClick={() => setShowModal(true)}
                >
                    + Add Purchase
                </button>
            </div>

            <div className="summary-section">

                <div className="summary-card">
                    <h4>Total Liters</h4>
                    <span>520 L</span>
                </div>

                <div className="summary-card">
                    <h4>Total Amount</h4>
                    <span>₹27,040</span>
                </div>

                <div className="summary-card">
                    <h4>Total Purchases</h4>
                    <span>35</span>
                </div>

            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Total Days</th>
                            <th>Product</th>
                            <th>Liters</th>
                            <th>Amount</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {summaryData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.month}</td>
                                <td>{item.total_days}</td>
                                <td>{item.product_name}</td>
                                <td>{item.total_liters}</td>
                                <td>₹{item.amount}</td>
                                <td><button className="view-btn" onClick={() => handleView(item.month)}>View</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <PurchaseModal
                    onClose={() => setShowModal(false)}
                    onSuccess={clientSummary}
                />
            )}
            {showHistoryModal && (
                <div className="modal-overlay">

                    <div className="purchase-modal history-modal">

                        <div className="modal-header">
                            <h2>{selectedMonth} Purchase History</h2>

                            <button
                                className="close-btn"
                                onClick={() =>
                                    setShowHistoryModal(false)
                                }
                            >
                                ✕
                            </button>
                        </div>

                        <div className="modal-body">

                            <table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Product</th>
                                        <th>Morning</th>
                                        <th>Evening</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {historyData.map((item: any) => (
                                        <tr key={item.id}>
                                            <td>{item.buying_date}</td>
                                            <td>{item.product_name}</td>
                                            <td>{item.morning_qty}</td>
                                            <td>{item.evening_qty}</td>
                                            <td>₹{item.purchased_liter_amount}</td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>

                        </div>

                    </div>

                </div>
            )}
        </div>
    );
}

export default Dashboard;