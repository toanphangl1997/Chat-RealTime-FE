import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import http from "../api/axios";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await http.get("/auth/me");
        console.log("User info:", res.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin user:", error);
      }
    };

    fetchMe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await http.post("/auth/login", formData);
      const { access_token } = res.data; // 👈 Đúng tên field trả về từ backend
      localStorage.setItem("token", access_token); // 👈 Lưu token vào localStorage
      console.log("Kết quả login:", res.data);
      alert("Đăng nhập thành công");
      navigate("/chat");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  // **** CÁCH 1 ****
  // const handleEmailChange = (e) => {
  //   setFormData({ ...formData, email: e.target.value });
  // };
  // const handlePasswordChange = (e) => {
  //   setFormData({ ...formData, password: e.target.value });
  // };

  // **** CÁCH 2 **** nhớ thêm name vào mỗi input tương ứng khi thay đổi
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
          Đăng Nhập
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
              placeholder="Nhập email của bạn"
              className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ease-in-out"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-200"
            >
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ease-in-out"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-200 ease-in-out"
          >
            Đăng nhập
          </button>
        </form>
        <p className="mt-4 text-center text-gray-400 text-sm">
          Chưa có tài khoản?{" "}
          <a
            onClick={() => navigate("/register")}
            href=""
            className="text-purple-400 hover:underline"
          >
            Đăng ký
          </a>
          <a
            onClick={() => navigate("/")}
            href=""
            className="block text-purple-400 hover:underline mt-4"
          >
            Quay về trang chủ
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
