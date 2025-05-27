import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { SlArrowRightCircle, SlArrowLeftCircle } from "react-icons/sl";
import { IoIosAddCircle } from "react-icons/io";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    role: "Staff",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = () => {
    fetch(`https://foodbackend-kadu.onrender.com/auth/users?page=${page}&limit=10`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || data);
        setTotalPages(data.totalPages || 1);
      })
      .catch((err) => console.error("Error fetching users:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.username || !newUser.email || !newUser.role) {
      alert("All fields are required");
      return;
    }
    try {
      const res = await fetch("https://foodbackend-kadu.onrender.com/auth/adduser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        alert(result.message || "Failed to add user");
        return;
      }

      fetchUsers(); // Refresh users
      setNewUser({ username: "", email: "", role: "Staff" });
    } catch (err) {
      console.error("Error adding user:", err);
      alert("An error occurred. Please try again.");
    }
  };

 const handleDeleteUser = async (id)  => {

    console.log("Deleting user with ID:", id); 
  if (!id) {
    alert("User ID missing!");
    return;
  }

  const confirmDelete = window.confirm("Are you sure you want to delete this user?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(`https://foodbackend-kadu.onrender.com/deleteuser/${id}`, {
      method: "DELETE",
      
    });

    const result = await res.json();
    

    if (!res.ok || !result.success) {
      alert(result.message || "Failed to delete user");
      return;
    }

    alert("User deleted successfully");

    // Refresh user list
    fetch(`https://foodbackend-kadu.onrender.com/auth/users?page=${page}&limit=10`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setTotalPages(data.totalPages || 1);
      });
  } catch (err) {
    console.error("Delete error:", err);
    alert("Server error while deleting user");
  }
};


  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ padding: "50px" }}>
        <h1>Welcome to Foodie!</h1>

        <form onSubmit={handleAddUser} style={{ margin: "30px 0" }}>
          <h3>Add New User</h3>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={newUser.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newUser.email}
            onChange={handleChange}
            required
          />
          <select name="role" value={newUser.role} onChange={handleChange}>
            <option value="Admin">Admin</option>
            <option value="Staff">Staff</option>
          </select>
          <button type="submit"><IoIosAddCircle  style={{fontSize: "15px"}}/></button>
        </form>

        {/*  Pagination Controls */}
        <div style={{ marginBottom: "20px" }}>
          {users.length > 0 && (
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              style={{
                padding: "8px 16px",
                marginRight: "10px",
                backgroundColor: "#000814",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "20px",
                cursor: page === 1 ? "not-allowed" : "pointer",
                opacity: page === 1 ? 0.6 : 1,
              }}
            >
              <SlArrowLeftCircle />
            </button>
          )}

          {users.length >= 10 && (
            <button
              onClick={() => setPage((prev) => prev + 1)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#000814",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              <SlArrowRightCircle />
            </button>
          )}
        </div>

        {/*  Users Table */}
        <table border="1" cellPadding="5">
          <thead>
            <tr> 
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <tr key={u._id}>
                <td>{(page - 1) * 10 + index + 1}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button
                    onClick={() => handleDeleteUser(u._id)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#1e1e2f",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;


