import { useEffect, useState } from "react";
import '../assets/styles/Dashboard.css';
import ClientHistoryModal from '../components/ClientHistoryModal.tsx';
import React from "react";
import api from "../services/api.tsx";
import moment from "moment";

function Dashboard() {
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [adminDashboard, setAdminDashboard] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);

      const res = await api.get("/auth/getuserswithdashbaord");
      console.log(res,'----');
      
      // adjust based on your backend structure
      setClients(res.data.users.usersList);
      setAdminDashboard(res.data.users.dashboardData.getDashboard[0]);

    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <div className="dashboard-container">

        <h2>Milk Management Dashboard</h2>

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
    </>
  );
}

export default Dashboard;