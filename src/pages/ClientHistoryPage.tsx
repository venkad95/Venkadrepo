import React, { useEffect, useState } from "react";
import "../assets/styles/ClientDashboard.css";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import api from "../services/api";
import PurchaseModal from "../components/PurchaseModal";
import { toast } from "react-toastify";

const ClientHistoryPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Retrieve data passed via navigation

    const [showModal, setShowModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState("");
    const [historyData, setHistoryData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState(); // Replace with dynamic user data if available
    const [timeBasedMessage, setTimeBasedMessage] = useState("");
    const [editingRow, setEditingRow] = useState<number | null>(null);
    const [editedRowData, setEditedRowData] = useState<any>({});
    const [totalPages, setTotalPages] = useState(1); // Total pages from the server  
    const [totalLiters, setTotalLiters] = useState();
    const [totalDays, setTotalDays] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(30); // Number of items per page
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [totalMorning, setTotalMorning] = useState(0);
    const [totalEvening, setTotalEvening] = useState(0);

    const handleEditRow = (index: number, item: any) => {
        setEditingRow(index);
        setEditedRowData({ ...item }); // Pre-fill the row data for editing
    };
    useEffect(() => {
        purchaseHistory();
        setGreetingMessage();
        const localStorageUser = localStorage.getItem("user");
        if (localStorageUser) {
            const user = JSON.parse(localStorageUser); // Parse the JSON string
            setUserName(user.firstName || "User"); // Set the first name or default to "User"
        }
    }, [])
    const purchaseHistory = async (page = 1) => {
        setShowHistoryModal(true);
        const formattedMonth = moment().format("YYYY-MM");
        const monthinName = moment().format("MMMM YYYY");
        setSelectedMonth(monthinName);
        setLoading(true);
        try {
            const response = await api.get(
                `/product/client-history/${formattedMonth}?page=${page}&limit=${itemsPerPage}`
            );
            setLoading(false)
            setHistoryData(response.data.data);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage);
            setTotalDays(response.data.totalDays);
            setTotalLiters(response.data.totalLiters);
            const morningSum = response.data.data.reduce(
                (sum: number, item: any) => sum + (item.morning_qty || 0),
                0
              );
            const eveningSum = response.data.data.reduce(
            (sum: number, item: any) => sum + (item.evening_qty || 0),
            0
            );
            setTotalMorning(morningSum);
            setTotalEvening(eveningSum);
            setShowHistoryModal(true);

        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    };

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
                purchaseHistory(); // Refresh the history data after saving
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

    return (
        <div className="client-history-page">
            <div className="dashboard-header">
                <h2>Dear {userName}, {timeBasedMessage}</h2>

                <button
                    className="add-btn"
                    onClick={() => setShowModal(true)}
                >
                    + Add Milk for Today
                </button>
            </div>

            <div className="summary-section">

                <div className="summary-card">
                    <h4>Total Liters</h4>
                    <span>{totalLiters}L</span>
                </div>

                {/* <div className="summary-card">
                    <h4>Total Amount</h4>
                    <span>₹{clientDashboard.total_amount}</span>
                </div> */}

                <div className="summary-card">
                    <h4>Total Purchases</h4>
                    <span>{totalDays}</span>
                </div>

            </div>
            <div className="page-header">
                <h2>{selectedMonth} Purchase History</h2>
                {/* <button className="close-btn" onClick={() => navigate(-1)}>
                    Back
                </button> */}
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Action</th>
                            <th>Date</th>
                            <th>Product</th>
                            <th>Morning</th>
                            <th>Evening</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historyData?.map((item: any, index: number) => (
                            <tr key={item.id}>
                                <td>
                                    {editingRow === index ? (
                                        <>
                                            <button className="save-btn" onClick={() => handleSaveEdit(index)}>
                                                Save
                                            </button>
                                            <button className="cancel-btn" onClick={handleCancelEdit}>
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
                            </tr>
                        ))}
                        <tr className="total-row">
              <td colSpan={3}>
                {/* <button
                  className="total-btn"
                  onClick={() => toast.success(`Total Liters: ${totalLiters}L`)}
                > */}
                  Total Liters
                {/* </button> */}
              </td>
              <td>{totalMorning}</td>
              <td>{totalEvening}</td>
            </tr>
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button
                    onClick={() => purchaseHistory( Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => purchaseHistory(Math.min(currentPage +1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
            {showModal && (
                <PurchaseModal
                    onClose={() => setShowModal(false)}
                    onSuccess={purchaseHistory}
                />
            )}
        </div>
    );
};

export default ClientHistoryPage;