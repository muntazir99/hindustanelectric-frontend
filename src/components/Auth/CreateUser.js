import React, { useState } from "react";
import axios from "../../api.js";
import { jwtDecode } from "jwt-decode";

function CreateUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");


// Update handleCreateUser
const handleCreateUser = async (e) => {
  e.preventDefault();
  
  // Frontend password validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    setMessage("Password must contain 8+ chars with uppercase, lowercase, and number");
    return;
  }

  try {
    // Get admin status from JWT
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    
    if (decoded.role !== "admin") {
      setMessage("Only admins can create users");
      return;
    }

    const res = await axios.post("/auth/create_user", 
      { username, password, role },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setMessage(res.data.message);
  } catch (err) {
    setMessage(err.response?.data?.message || "Creation failed");
  }
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Create User</h2>
        <form onSubmit={handleCreateUser}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded"
          >
            Create User
          </button>
        </form>
        {message && <p className="mt-4 text-center text-green-500">{message}</p>}
      </div>
    </div>
  );
}

export default CreateUser;
