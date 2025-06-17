import { useState } from "react";
import { useNavigate } from "react-router-dom";
import http from "../api/axios";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await http.post("/auth/login", formData);
      const { access_token } = res.data;

      localStorage.setItem("token", access_token); // Lưu token

      // GỌI LẠI /auth/me SAU KHI LOGIN
      const resMe = await http.get("/auth/me");
      console.log("User info sau login:", resMe.data);

      // Điều hướng tới trang chat
      navigate("/chat");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-700 flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl p-8 transform transition-all hover:shadow-2xl">
        <h2 className="text-center text-3xl font-extrabold text-purple-300 mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-200"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ease-in-out"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-200"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ease-in-out"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-200 ease-in-out"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-gray-400 text-sm">
          Don't have an account?{" "}
          <a
            onClick={() => navigate("/register")}
            href="#"
            className="text-purple-400 hover:underline"
          >
            Register
          </a>
          <a
            onClick={() => navigate("/")}
            href="#"
            className="block text-purple-400 hover:underline mt-4"
          >
            Return to home page
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
