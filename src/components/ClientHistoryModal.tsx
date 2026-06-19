import React , {useEffect, useState} from "react";
import '../assets/styles/Dashboard.css';
import api from "../services/api";

type Props = {
  client: any;
  onClose: () => void;
};

const ClientHistoryModal = ({
  client,
  onClose,
}: Props) => {

const [productHistory, setProductHistory] = useState<any>([]);
useEffect(() => {
    fetchProductHistory();
  }, []);
  const fetchProductHistory = async() =>{
    try{
      const res = await api.get("/product/getproductlist");
      setProductHistory(res.data.getDetails)
    }
    catch(error){
      console.error("Error fetching clients:", error);
    }
  }
  const history = [
    {
      month: "May 2026",
      liters: 240,
      rate: 50,
      amount: 12000,
    },
    {
      month: "Apr 2026",
      liters: 220,
      rate: 48,
      amount: 10560,
    },
  ];

  return (
    <div className="modal-overlay">

      <div className="modal-content">

        <h3>{client.name} History</h3>

        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Liters</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {productHistory.map((item, index) => (
              <tr key={index}>
                <td>{item.buying_date}</td>
                <td>{item.product_qty}</td>
                <td>{item.perliter_rate}</td>
                <td>{item.total_amount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          className="close-btn"
          onClick={onClose}
        >
          Close
        </button>

      </div>
    </div>
  );
}

export default ClientHistoryModal;