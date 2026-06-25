import { useEffect, useState } from "react";
import '../assets/styles/Dashboard.css';
import ClientHistoryModal from '../components/ClientHistoryModal.tsx';
import React from "react";
import api from "../services/api.tsx";
import moment from "moment";
import Loader from "../components/Loader.tsx";

function Dashboard() {
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [adminDashboard, setAdminDashboard] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(); // Replace with dynamic user data if available
  const [timeBasedMessage, setTimeBasedMessage] = useState("");
  const [showAddRateModal, setShowAddRateModal] = useState(false);
  const [selectedClientForRate, setSelectedClientForRate] = useState<any>(null);
  const [productName, setProductName] = useState("");
const [rate, setRate] = useState("");


  useEffect(() => {
    fetchClients();
    setGreetingMessage();
    const localStorageUser = localStorage.getItem("user");
    if (localStorageUser) {
      const user = JSON.parse(localStorageUser); // Parse the JSON string
      setUserName(user.firstName || "User"); // Set the first name or default to "User"
    }
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);

      const res = await api.get("/auth/getuserswithdashbaord");
      // adjust based on your backend structure
      setClients(res.data.users.usersList);
      setAdminDashboard(res.data.users.dashboardData.getDashboard[0]);

    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
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

  const handleAddRate = (client: any) => {
    setSelectedClientForRate(client);
    setShowAddRateModal(true);
  };
  const handleSubmitRate = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await api.post("/product/product-configure-to-user", {
        userId: selectedClientForRate.uuid,
        product_name: productName,
        perliter_rate: rate,
      });
  
      if (response.data.success) {
        alert("Rate added successfully!");
        setShowAddRateModal(false);
        setProductName("");
        setRate("");
      } else {
        alert("Failed to add rate. Please try again.");
      }
    } catch (error) {
      console.error("Error adding rate:", error);
      alert("An error occurred. Please try again.");
    }
  };

  if (loading) return <Loader />
  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>
            Hi, {userName}! {timeBasedMessage}
          </h1>
        </div>

        <h3>Welcome to Dashboard</h3>

        <div className="summary-cards">
          <div className="card">
            <h3>Total Clients</h3>
            <span>{adminDashboard.totalClients}</span>
          </div>

          <div className="card">
            <h3>Total Liters</h3>
            <span>{adminDashboard.totalLiters}</span>
          </div>

          <div className="card">
            <h3>Total Amount</h3>
            <span>{adminDashboard.totalAmount}</span>
          </div>

          <div className="card">
            <h3>Total Product</h3>
            <span>2</span>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>mobileNumber</th>
                <th>Start Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {clients.map((client) => (
                <tr key={client.uuid}>
                  <td>{client.firstName}</td>
                  <td>{client.lastName}</td>
                  <td>{client.email}</td>
                  <td>{client.mobileNumber}</td>
                  <td>{moment(client.createdAt).format("DD/MM/YYYY")}</td>
                  <td>{client.status ? 'Active' : 'InActive'}</td>

                  <td>
                    <button
                      className="view-btn"
                      onClick={() =>
                        setSelectedClient(client)
                      }
                    >
                      View
                    </button>
                    <button
                      className="add-rate-btn"
                      onClick={() => handleAddRate(client)}
                    >
                      Add Rate
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {selectedClient && (
        <ClientHistoryModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
        />
      )}
      {showAddRateModal && (
        <div className="modal-overlay">
          <div className="add-rate-modal">
            <div className="modal-header">
              <h2>Add Product Rate</h2>
              <button
                className="close-btn"
                onClick={() => setShowAddRateModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmitRate}>
                <div className="form-group">
                  <label htmlFor="user">Select User</label>
                  <select
                    id="user"
                    value={selectedClientForRate?.uuid || ""}
                    disabled
                  >
                    <option value={selectedClientForRate?.uuid}>
                      {selectedClientForRate?.firstName} {selectedClientForRate?.lastName}
                    </option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="productName">Product Name</label>
                  <input
                    type="text"
                    id="productName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="rate">Rate</label>
                  <input
                    type="number"
                    id="rate"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    required
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowAddRateModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="save-btn" onClick={handleSubmitRate}>
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;