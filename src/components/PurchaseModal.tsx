import React from "react";
import { useState } from "react";
import "../assets/styles/PurchaseModal.css";
import api from "../services/api";
import Loader from "./Loader";
import { toast } from "react-toastify";

interface PurchaseModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

const PurchaseModal = ({ onClose, onSuccess }: PurchaseModalProps) => {
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        product_name: "",
        buying_date: "",
        morning_qty: "",
        evening_qty: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            setSaving(true);
            const response = await api.post("/product/createproductentry", formData);
            setLoading(false);
            toast.success(response.data.message);
            setSaving(false);
            onSuccess(); // refresh dashboard
            onClose();
        } catch (error: any) {
            setLoading(false);
            setSaving(false);
            toast.error(error.response?.data?.message);
        }
    };
    if (loading) return <Loader />
    return (
        <div className="modal-overlay">
            <div className="purchase-modal">

                <div className="modal-header">
                    <h2>Add Product Purchase</h2>
                    <button
                        className="close-btn"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <div className="modal-body">

                    <div className="form-group">
                        <label>Product Name</label>
                        <input
                            type="text"
                            name="product_name"
                            value={formData.product_name}
                            onChange={handleChange}
                            placeholder="Enter Product Name"
                        />
                    </div>

                    <div className="form-group">
                        <label>Purchase Date</label>
                        <input
                            type="date"
                            name="buying_date"
                            value={formData.buying_date}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Morning</label>
                        <input
                            type="number"
                            name="morning_qty"
                            value={formData.morning_qty}
                            onChange={handleChange}
                            placeholder="Enter Liters"
                        />
                    </div>
                    <div className="form-group">
                        <label>Evening</label>
                        <input
                            type="number"
                            name="evening_qty"
                            value={formData.evening_qty}
                            onChange={handleChange}
                            placeholder="Enter Liters"
                        />
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="cancel-btn" onClick={onClose}>
                        Cancel
                    </button>

                    <button className="save-btn" disabled={saving} onClick={handleSave}>
                        {saving ? (
                            <div className="btn-spinner"></div>
                        ) : (
                            "Save Purchase"
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default PurchaseModal;