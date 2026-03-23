import { useState } from "react";
import { useNavigate } from "react-router-dom";
import http from "../api/axios";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // 1️⃣ login
      const res = await http.post("/auth/login", formData);
      const { access_token } = res.data;
      localStorage.setItem("token", access_token);

      // 2️⃣ preload user info
      const userRes = await http.get("/auth/me");

      // 3️⃣ navigate chat với state user
      navigate("/chat", { state: { user: userRes.data } });
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-700 flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl p-8">
        <h2 className="text-center text-3xl font-extrabold text-purple-300 mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 py-2 rounded-lg text-white"
          >
            {loading ? "Đang đăng nhập..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-400">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-purple-400 cursor-pointer"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;