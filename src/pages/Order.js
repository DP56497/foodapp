//6
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import jsPDF from "jspdf";

function Order() {
  const [orders, setOrders] = useState({
    done: [],
    processing: [],
    stuck: [],
    pending: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("https://foodbackend-kadu.onrender.com/api/orders", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setOrders(data);
      //  const allOrders = [...data.done, ...data.processing, ...data.stuck, ...data.pending];
      setFilteredOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleSearch = () => {
    const term = searchTerm.trim().toLowerCase();
    const allOrders = [
      ...orders.done,
      ...orders.processing,
      ...orders.stuck,
      ...orders.pending,
    ];

    if (term === "") {
      setFilteredOrders(allOrders);
    } else {
      const result = allOrders.filter(
        (order) =>
          order.id?.toString().includes(term) ||
          order.foodname.toLowerCase().includes(term) ||
          order.price.toString().includes(term)
      );
      setFilteredOrders(result);
    }
  };

  // const loadImage = (url) =>
  //   new Promise((resolve, reject) => {
  //     const img = new Image();
  //     img.crossOrigin = "Anonymous";
  //     img.onload = () => resolve(img);
  //     img.onerror = reject;
  //     img.src = url;
  //   });

  const handleDownloadPDF = async (order) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Jogmaya Restaurant", 14, 20);
    // doc.FaHotel(14, 20)
    doc.setFontSize(12);
    doc.text("Address: 123 Main Road, Bhavnagar, Gujarat", 200, 20, {
      align: "right",
    });
    doc.setFontSize(14);
    doc.text(`Order ID: ${order.id}`, 14, 40);
    doc.text(`Food Name: ${order.foodname}`, 14, 50);
    doc.text(`Price: ₹${order.price}`, 14, 60);

    // const img = await loadImage("foodapp/public/ChatGPT Image May 19, 2025, 06_27_42 PM.png");
    // doc.addImage(img, "PNG", 14, 240, 50, 20);
    //     const base64Img = await loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."); // <-- paste full base64 string
    // doc.addImage(base64Img, "PNG", 14, 240, 50, 20);

    doc.text("Owner Signature", 14, 265);
    doc.text("Customer Signature", 200, 265, { align: "right" });

    doc.save(`Order_${order.id}_Memo.pdf`);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "20px" }}>
        <h1>All Orders</h1>
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Search by ID, Food Name, or Price"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "8px", marginRight: "10px" }}
          />
          <button
            onClick={() => handleSearch()}
            style={{ padding: "8px 16px" }}
          >
            Search
          </button>
        </div>
        {filteredOrders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Food Name</th>
                <th>Price ($)</th>
                <th>Download Memo</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id || order._id}>
                  <td>{order.id || order._id}</td>
                  <td>{order.foodname}</td>
                  <td>{order.price}</td>
                  <td>
                    <button
                      onClick={() => handleDownloadPDF(order)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#1e1e2f",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "4px",
                      }}
                    >
                      Download Memo
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Order;
