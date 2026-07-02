import React, { useState, useEffect } from "react";
import "../assets/styles/PaymentModal.css";
import { toast } from "react-toastify";
import api from "../services/api";

interface PaymentModalProps {
  onClose: () => void;
  onSubmit: (paymentDetails: { amount: number; isPartial: boolean }) => void;
  selectedMonth: string;
}

const PaymentModal = ({ onClose, onSubmit, selectedMonth}: PaymentModalProps) => {
  
  const [isPartialPayment, setIsPartialPayment] = useState(false);
  const [isFinalPayment, setIsFinalPayment] = useState(false);
  const [partialAmount, setPartialAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [totalMilk, setTotalMilk] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [unpaidDays, setUnpaidDays] = useState(0); 
  const [totalAmount, setTotalAmount] = useState(0);
  const [advanceAmount, setAdvanceAmount] = useState(0);

  useEffect(() => {
    getPaymentDetails(selectedMonth);
  }, [selectedMonth]);

  const getPaymentDetails = async (selectedMonth) => {
    try{
      // Calculate from_date (start of the month) and to_date (end of the month)
        const fromDate = new Date(selectedMonth);
        fromDate.setDate(1); // Set to the first day of the month
        const toDate = new Date(fromDate);
        toDate.setMonth(toDate.getMonth() + 1); // Move to the next month
        toDate.setDate(0); // Set to the last day of the current month

        // Format dates as YYYY-MM-DD
        const from_date = fromDate.toISOString().split("T")[0];
        const to_date = toDate.toISOString().split("T")[0];

        const response = await api.get(
          `/payment/get-payment-details?from_date=${from_date}&to_date=${to_date}`
        );
        const paymentDetails = response.data.data;
        console.log(paymentDetails);
        
        setTotalMilk(paymentDetails.total_liter);
        setTotalDays(paymentDetails.totalDays);
        setUnpaidDays(paymentDetails.unpaidDays);
        setTotalAmount(paymentDetails.total_amount);
        setAdvanceAmount(paymentDetails.advance_payment);
        setFinalAmount(paymentDetails.total_amount - paymentDetails.advance_payment);
      }
      catch(error){
        console.error("Error fetching payment details:", error);
        toast.error("Failed to fetch payment details.");
    }
  }

  const handleSubmit = () => {
    const amountToPay = isPartialPayment ? partialAmount : finalAmount;

    if (isPartialPayment && partialAmount <= 0) {
      toast.error("Please enter a valid partial amount.");
      return;
    }

    toast.info(
        <div>
          <p>Are you sure you want to pay ₹{amountToPay}?</p>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              style={{
                backgroundColor: "#02750a",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => {
                onSubmit({ amount: amountToPay, isPartial: isPartialPayment });
                toast.dismiss(); // Close the toast
                onClose(); // Close the modal
              }}
            >
              Confirm
            </button>
            <button
              style={{
                backgroundColor: "#ccc",
                color: "black",
                border: "none",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => toast.dismiss()} // Close the toast
            >
              Cancel
            </button>
          </div>
        </div>,
        {
          autoClose: false, // Prevent auto-closing
          closeOnClick: false, // Prevent closing on click
        }
      );
  };

  const handleFinalPaymentChange = (checked: boolean) => {
    setIsFinalPayment(checked);
    if (checked) {
      setIsPartialPayment(false); // Disable partial payment if final payment is selected
    }
  };

  const handlePartialPaymentChange = (checked: boolean) => {
    setIsPartialPayment(checked);
    if (checked) {
      setIsFinalPayment(false); // Disable final payment if partial payment is selected
    }
  };

  return (
    <div className="modal-overlay">
      <div className="payment-modal">
        <div className="modal-header">
          <h2>Payment Details</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="payment-summary">
            <p>Total Milk: <strong>{totalMilk} Liters</strong></p>
            <p>Total Days: <strong>{totalDays}</strong></p>
            <p>Unpaid Days: <strong>{unpaidDays}</strong></p>
            <p>Total Amount: <strong>₹{totalAmount}</strong></p>
            <p>Advance Amount: <strong>₹{advanceAmount}</strong></p>
            <p>Final Amount: <strong>₹{finalAmount}</strong></p>
          </div>
          <div className="payment-options">
            <div className="final-payment">
              <label>
                <input
                  type="checkbox"
                  checked={isFinalPayment}
                  onChange={(e) => handleFinalPaymentChange(e.target.checked)}
                />
                Final Payment: <strong>₹{finalAmount}</strong>
              </label>
            </div>
            <div className="partial-payment">
              <label>
                <input
                  type="checkbox"
                  checked={isPartialPayment}
                  onChange={(e) => handlePartialPaymentChange(e.target.checked)}
                />
                Partial Payment
              </label>
              {isPartialPayment && (
                <input
                  type="number"
                  placeholder="Enter Partial Amount"
                  value={partialAmount}
                  onChange={(e) => setPartialAmount(Number(e.target.value))}
                  className="partial-amount-input"
                />
              )}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={!isFinalPayment && !isPartialPayment} // Disable if no option is selected
          >
            Submit Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;