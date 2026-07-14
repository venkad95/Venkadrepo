import React, { useEffect, useState } from "react";
import '../assets/styles/ClientDashboard.css';
import api from "../services/api";
import Loader from "./Loader";
import moment from "moment";
import { toast } from "react-toastify";

type Props = {
  client: any;
  onClose: () => void;
};

const ClientHistoryModal = ({
  client,
  onClose,
}: Props) => {

  const [productHistory, setProductHistory] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [historyData, setHistoryData] = useState([]);
  const [totalPages, setTotalPages] = useState(1); // Total pages from the server  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page

  useEffect(() => {
    fetchProductHistory();
  }, []);
  const fetchProductHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/product/client-summary?userid=${client.uuid}`);
      setProductHistory(res.data.users.usersList || []);
      setLoading(false);
    }
    catch (error) {
      setLoading(false);
      console.error("Error fetching clients:", error);
    }
  }

  const handleView = async (month: string, page = 1) => {
    setSelectedMonth(month);
    setShowHistoryModal(true);
    const formattedMonth = moment(
      month,
      "MMM-YYYY"
    ).format("YYYY-MM");
    try {

      const response = await api.get(
        `/product/client-history/${formattedMonth}?userid=${client.uuid}&page=${page}&limit=${itemsPerPage}`
      );

      setHistoryData(response.data.data);
      setSelectedMonth(month);
      // setHistoryData(response.data.history); // Update table data
      setTotalPages(response.data.totalPages); // Update total pages from the server
      setCurrentPage(page);
      setCurrentPage(response.data.currentPage);

      setShowHistoryModal(true);

    } catch (error) {
      console.log(error);
    }
  };

  const generatePayment = async (month: string, ) => {
    console.log(month,'---');
    
    const formattedMonth = moment(month, "MMM-YYYY").format("YYYY-MM-01");
    console.log(formattedMonth);
    
    try {
      const response = await api.post(`/payment/generate-payment`, {
        userId: client.uuid,
        month: formattedMonth
      })

      if (response.data.success) {
        toast.success("Payment generated successfully!");
      } else {
        toast.error("Failed to generate payment.");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while generating payment.");
    }
  }
  if (loading) return <Loader />
  return (
    <div className="modal-overlay">

      <div className="modal-content">

        <h3>{client.name} History</h3>
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Total Days</th>
              <th>Product</th>
              <th>Liters</th>
              <th>Amount</th>
              <th>Action</th>
              <th>Payment</th>
            </tr>
          </thead>

          <tbody>
            {productHistory && productHistory?.map((item, index) => (
              <tr key={index}>
                <td>{item.month}</td>
                <td>{item.total_days}</td>
                <td>{item.product_name}</td>
                <td>{item.total_liters}</td>
                <td>₹{item.amount}</td>
                <td><button className="view-btn" onClick={() => handleView(item.month, 1)}>View</button></td>
                <td><button className="view-btn" onClick={() => generatePayment(item.month)}>Generate Payment</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <button className="cancel-btn" onClick={onClose}>
          Close
        </button>
      </div>
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

                  {historyData && historyData.map((item: any) => (
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
              <div className="pagination">
          <button
            onClick={() => handleView(selectedMonth, Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              handleView(selectedMonth, Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
            </div>

          </div>

        </div>
      )}
    </div>

  );
}

export default ClientHistoryModal;