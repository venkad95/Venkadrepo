import React, { useState, useEffect } from "react";
import "../assets/styles/PaymentModal.css";
import { toast } from "react-toastify";

interface PaymentModalProps {
  onClose: () => void;
  totalMilk: number;
  totalDays: number;
  unpaidDays: number;
  totalAmount: number;
  advanceAmount: number;
  onSubmit: (paymentData: { amount: number; isPartial: boolean }) => void;
}

const PaymentModal = ({
  onClose,
  totalMilk,
  totalDays,
  unpaidDays,
  totalAmount,
  advanceAmount,
  onSubmit,
}: PaymentModalProps) => {
  const [isPartialPayment, setIsPartialPayment] = useState(false);
  const [isFinalPayment, setIsFinalPayment] = useState(false);
  const [partialAmount, setPartialAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(totalAmount - advanceAmount);

  useEffect(() => {
    // Recalculate the final amount when advance or partial payment changes
    if (!isPartialPayment) {
      setFinalAmount(totalAmount - advanceAmount);
    }
  }, [isPartialPayment, totalAmount, advanceAmount]);

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