import { useState } from "react";
import { useNavigate } from "react-router-dom";
import http from "../api/axios";
import { toast } from "react-toastify";

const isValidEmail = (email) => {
  return email.includes("@") && email.includes(".");
};

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // disable khi thiếu field
  const isDisabled = !formData.email.trim() || !formData.password.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isDisabled) return;

    // ===== VALIDATE meaningful =====
    if (!isValidEmail(formData.email)) {
      return toast.error("Invalid email format", {
        toastId: "email-format",
      });
    }

    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters", {
        toastId: "password-length",
      });
    }

    try {
      setLoading(true);

      const res = await http.post("/auth/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      const { access_token } = res.data;

      localStorage.setItem("token", access_token);

      const userRes = await http.get("/auth/me");

      toast.success("Login successful");

      navigate("/chat", { state: { user: userRes.data } });
    } catch (err) {
      console.error(err); // interceptor handle
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
          />

          <button
            type="submit"
            disabled={loading || isDisabled}
            className="w-full bg-blue-600 py-2 rounded-lg text-white disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Login"}
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
