import { useState } from "react";
import { useNavigate } from "react-router-dom";
import http from "../api/axios";
import { toast } from "react-toastify";

const isValidEmail = (email) => {
  return email.includes("@") && email.includes(".");
};

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // disable khi thiếu field
  const isDisabled =
    !formData.name.trim() ||
    !formData.email.trim() ||
    !formData.password.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ===== GUARD (không toast nữa) =====
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

      await http.post("/auth/register", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      toast.success("Register success. You can login now.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
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
          Register
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
          />

          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your email"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Your password"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
          />

          <button
            type="submit"
            disabled={loading || isDisabled}
            className="w-full bg-blue-600 py-2 rounded-lg text-white disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-purple-400 cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
