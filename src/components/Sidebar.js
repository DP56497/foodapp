import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaReceipt,
  FaUtensils,
  FaBuilding,
  FaSignOutAlt,
  FaHotel,
} from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();

  let handleLogout = () => {
    localStorage.clear(); // or localStorage.removeItem('token');
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <h2>
        <FaHotel style={{fontSize: "30px"}}/> Hotel Jogmaya{" "}
      </h2>
      <nav>
        <Link to="/home">
          <FaHome  style={{fontSize: "30px"}}/> Home
        </Link>
        <Link to="/orders">
          <FaReceipt style={{fontSize: "30px"}}/> Orders
        </Link>
        <Link to="/Menu">
          <FaUtensils style={{fontSize: "30px"}}/> Menu
        </Link>
        <Link to="/Company">
          <FaBuilding style={{fontSize: "30px"}}/> Company
        </Link>

        <button
          onClick={handleLogout}
          style={{
            cursor: "pointer",
            color: "red",
            background: "none",
            border: "none",
            padding: 0,
            font: "inherit",
            textDecoration: "underline",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            marginTop: "420px",
            fontSize: "40px",
          }}
        >
          <FaSignOutAlt />
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
