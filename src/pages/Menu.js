
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

function Menu() {
  const [menu, setMenu] = useState([
    { id: 1, name: "Pizza", price: 10 },
    { id: 2, name: "Burger", price: 7 },
    { id: 3, name: "Pasta", price: 8 },
    { id: 4, name: "Sandwich", price: 5 },
    { id: 5, name: "Fries", price: 4 },
    { id: 6, name: "Noodles", price: 9 },
    { id: 7, name: "Salad", price: 6 },
    { id: 8, name: "Taco", price: 7 },
    { id: 9, name: "Ice Cream", price: 5 },
    { id: 10, name: "Soup", price: 6 },
  ]);

  useEffect(() => {
    fetch("https://foodbackend-kadu.onrender.com/api/menu/")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch menu");
        return response.json();
      })
      .then((data) => setMenu(data))
      .catch((error) => console.error("Error fetching menu:", error));
  }, []);

  const handleAddOrder = (item) => {
    const orderData = {
      foodname: item.name,
      price: item.price,
      status: "pending", // Set default status
    };
    fetch("https://foodbackend-kadu.onrender.com/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to add order");
        return response.json();
      })
      .then(() => {
        alert("Order added successfully!");
      })
      .catch((error) => console.error("Error adding order:", error));
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "20px" }}>
        <h2>Menu</h2>
        {menu.length === 0 ? (
          <p>Loading menu...</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Food Name</th>
                <th>Price ($)</th>
                <th>Order</th>
              </tr>
            </thead>
            <tbody>
              {menu.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>
                    <button onClick={() => handleAddOrder(item)}>
                      Add Order
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

export default Menu;
