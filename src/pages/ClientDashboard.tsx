import { useEffect, useState } from "react";
import PurchaseModal from "../components/PurchaseModal";
import "../assets/styles/ClientDashboard.css";
import React from "react";
import api from "../services/api";
import moment from "moment";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

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
    const [historyData, setHistoryData] = useState<any[]>([]);
    const [summaryData, setSummryData] = useState<SummaryData[]>([]);
    const [clientDashboard, setClientDashboard] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState(); // Replace with dynamic user data if available
    const [timeBasedMessage, setTimeBasedMessage] = useState("");
    const [editingRow, setEditingRow] = useState<number | null>(null);
    const [editedRowData, setEditedRowData] = useState<any>({});


    useEffect(() => {
        clientSummary();
        setGreetingMessage();
        const localStorageUser = localStorage.getItem("user");
        if (localStorageUser) {
            const user = JSON.parse(localStorageUser); // Parse the JSON string
            setUserName(user.firstName || "User"); // Set the first name or default to "User"
        }
    }, [])
    const clientSummary = async () => {
        setLoading(true);
        try {
            const response = await api.get('/product/client-summary');
            setLoading(false);
            if (response.data) {

                setSummryData(response.data.users.usersList || []);
                setClientDashboard(response.data.users.dashboardData.dashboard[0] || {});
            }
        }
        catch (err) {
            setLoading(false)
            console.log(err);

        }
    }

    const setGreetingMessage = () => {
        const currentHour = new Date().getHours();
        if (currentHour < 12) {
            setTimeBasedMessage("Good Morning");
        } else if (currentHour < 18) {
            setTimeBasedMessage("Good Afternoon");
        } else {
            setTimeBasedMessage("Good Evening");
        }
    };

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

    const handleEditRow = (index: number, item: any) => {
        setEditingRow(index);
        setEditedRowData({ ...item }); // Pre-fill the row data for editing
      };
      
      const handleSaveEdit = async (index: number) => {
        try {
            const changedFields: any = {};
            if (editedRowData.morning_qty !== historyData[index].morning_qty) {
                changedFields.morning_qty = editedRowData.morning_qty;
            }
            if (editedRowData.evening_qty !== historyData[index].evening_qty) {
                changedFields.evening_qty = editedRowData.evening_qty;
            }
            const response = await api.put(`/product/update-productqty/${editedRowData.uuid}`, {
                uuid: editedRowData.uuid,
                ...changedFields
            });
          if (response.data.success) {
            toast.success(response.data.message);
            const updatedHistoryData = [...historyData];
            updatedHistoryData[index] = editedRowData;
            setHistoryData(updatedHistoryData);
            setEditingRow(null);
            handleView(selectedMonth); // Refresh the history data after saving
          } else {
            toast.error("Failed to update row. Please try again.");
          }
        } catch (error) {
          console.error("Error updating row:", error);
          toast.error("An error occurred. Please try again.");
        }
      };
      
      const handleCancelEdit = () => {
        setEditingRow(null);
        setEditedRowData({});
      };

    if (loading) return <Loader />

    return (
        <div className="dashboard">

            <div className="dashboard-header">
                <h2>Welcome {userName} ! {timeBasedMessage}</h2>

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
                    <span>{clientDashboard.total_liters}L</span>
                </div>

                <div className="summary-card">
                    <h4>Total Amount</h4>
                    <span>₹{clientDashboard.total_amount}</span>
                </div>

                <div className="summary-card">
                    <h4>Total Purchases</h4>
                    <span>{clientDashboard.total_days}</span>
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
                                        <th>Action</th>
                                        <th>Date</th>
                                        <th>Product</th>
                                        <th>Morning</th>
                                        <th>Evening</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {historyData.map((item: any, index:number) => (
                                        <tr key={item.id}>
                                            <td>
                                                {editingRow === index ? (
                                                    <>
                                                        <button className="save-btn" onClick={() => handleSaveEdit(index)}>
                                                            Save
                                                        </button>
                                                        <button className="cancel-btn" onClick={() => handleCancelEdit()}>
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button className="edit-btn" onClick={() => handleEditRow(index, item)}>
                                                        ✎
                                                    </button>
                                                )}
                                            </td>
                                            <td>{item.buying_date}</td>
                                            <td>{item.product_name}</td>
                                            <td>
                                                {editingRow === index ? (
                                                    <input
                                                        type="number"
                                                        value={editedRowData.morning_qty || ""}
                                                        onChange={(e) =>
                                                            setEditedRowData({ ...editedRowData, morning_qty: e.target.value })
                                                        }
                                                    />
                                                ) : (
                                                    item.morning_qty
                                                )}
                                            </td>
                                            <td>
                                                {editingRow === index ? (
                                                    <input
                                                        type="number"
                                                        value={editedRowData.evening_qty || ""}
                                                        onChange={(e) =>
                                                            setEditedRowData({ ...editedRowData, evening_qty: e.target.value })
                                                        }
                                                    />
                                                ) : (
                                                    item.evening_qty
                                                )}
                                            </td>
                                            
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