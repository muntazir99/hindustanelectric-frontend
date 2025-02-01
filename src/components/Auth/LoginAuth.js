
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../api.js";

// // Import local images
// import logo from "../assets/logo.png"; // Path to your logo image
// import userIcon from "../assets/user.png"; // Path to user icon
// import lockIcon from "../assets/lock.png"; // Path to lock icon

// function Login() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await api.post("/auth/login", { username, password });
//       console.log("API Response:", response.data);
//       if (response.data.success) {
//         localStorage.setItem("token", response.data.token);
//         localStorage.setItem("role", response.data.role);
//         console.log("Redirecting to /dashboard...");
//         navigate("/dashboard");
//       }else {
//         setError("Invalid credentials, please try again.");
//       }
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || "Login failed";
//       setError(errorMsg);
//       console.error("Login error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
    
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-6">
//       <div className="text-center text-white text-4xl font-bold tracking-wide uppercase mb-2" style={{ fontFamily: 'Reospec' }}>
//   HINDUSTAN ELECTRIC
// </div>
//       {/* Outer Container with Glassmorphism Effect */}
//       <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-lg p-8 space-y-6 border border-white/20 max-w-md w-full">
      
//         {/* Logo */}
//         <div className="text-center">
//           <img 
//             src={logo} 
//             alt="Company Logo" 
//             className="w-24 h-24 mx-auto object-contain drop-shadow-lg"
//           />
//         </div>

//         {/* Form */}
//         <form onSubmit={handleLogin} className="space-y-4">
          
//           {/* Username Input */}
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="USERNAME"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="w-full px-4 py-3 pl-12 placeholder:text-white bg-white/20 text-sm text-white rounded-xl border border-white/30 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-inner" style={{ fontFamily: 'Reospec' }}
//             />
//             <img
//               src={userIcon}
//               alt="User icon"
//               className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 opacity-80"
//             />
//           </div>

//           {/* Password Input */}
//           <div className="relative">
//             <input
//               type="password"
//               placeholder="PASSWORD"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-4 py-3 pl-12 text-white placeholder:text-white bg-white/20 text-sm rounded-xl border border-white/30 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-inner"style={{ fontFamily: 'Reospec' }}
//             />
//             <img
//               src={lockIcon}
//               alt="Lock icon"
//               className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 opacity-80"
//             />
//           </div>

//           {/* Login Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-3 px-4 rounded-xl font-semibold text-blue-700 bg-white shadow-lg border border-blue-700 
//               transition-all duration-300 transform active:scale-95
//               ${
//                 loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700 hover:text-white" 
//               }`} style={{ fontFamily: 'Reospec' }}
//           >
//             {loading ? "Logging in..." : "LOGIN"}
//           </button>

//           {/* Forgot Password */}
//           <div className="text-center">
//             <a href="/forgot-password" className="text-sm text-white hover:text-gray-300" style={{ fontFamily: 'Reospec' }}>
//               Forgot password?
//             </a>
//           </div>
//         </form>

//         {/* Error Message */}
//         {error && (
//           <div className="p-3 bg-red-100 text-red-700 rounded-xl text-sm text-center shadow-md">
//             {error}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Login;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api.js";

// Import local images
import logo from "../assets/logo.png"; // Path to your logo image
import userIcon from "../assets/user.png"; // Path to user icon
import lockIcon from "../assets/lock.png"; // Path to lock icon

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { username, password });
      console.log("API Response:", response.data);
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        console.log("Redirecting to /dashboard...");
        navigate("/dashboard");
      } else {
        setError("Invalid credentials, please try again.");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed";
      setError(errorMsg);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-200 p-6">
      <div
        className="text-center text-gray-800 text-4xl font-bold tracking-wide uppercase mb-6"
        style={{ fontFamily: "Reospec" }}
      >
        HINDUSTAN ELECTRIC
      </div>
      <div
        className="p-8 space-y-6 max-w-md w-full rounded-3xl"
        style={{
          background: "#e0e0e0",
          boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff"
        }}
      >
        {/* Logo */}
        <div className="text-center">
          <img
            src={logo}
            alt="Company Logo"
            className="w-24 h-24 mx-auto object-contain"
            style={{
              boxShadow: "4px 4px 8px #bebebe, -4px -4px 8px #ffffff"
            }}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="USERNAME"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 pl-12 text-sm text-gray-800 rounded-xl focus:outline-none"
              style={{
                background: "#e0e0e0",
                boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
                border: "none"
              }}
            />
            <img
              src={userIcon}
              alt="User icon"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 opacity-80"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type="password"
              placeholder="PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pl-12 text-sm text-gray-800 rounded-xl focus:outline-none"
              style={{
                background: "#e0e0e0",
                boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
                border: "none"
              }}
            />
            <img
              src={lockIcon}
              alt="Lock icon"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 opacity-80"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-semibold text-gray-800 transition-all duration-300 transform active:scale-95"
            style={{
              background: "#e0e0e0",
              boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
              border: "none"
            }}
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>

          {/* Forgot Password */}
          <div className="text-center">
            <a
              href="/forgot-password"
              className="text-sm text-gray-800 hover:text-gray-600"
              style={{ fontFamily: "Reospec" }}
            >
              Forgot password?
            </a>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-xl text-sm text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
