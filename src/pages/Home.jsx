const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Hiệu ứng nền */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_70%)] pointer-events-none"></div>

      {/* Nội dung chính */}
      <div className="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-xl p-10 text-center transform transition-all hover:shadow-2xl relative z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-purple-300 mb-4">
          Chat Real Time
        </h1>
        <p className="text-gray-300 text-lg mb-8">
          Join now to discover amazing experiences and connect with your
          community!
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/register"
            className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-200 ease-in-out text-lg font-medium"
          >
            Register
          </a>
          <a
            href="/login"
            className="bg-blue-600 text-white py-2 px-9 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-200 ease-in-out text-lg font-medium"
          >
            Login
          </a>
        </div>
      </div>

      {/* Footer nhỏ */}
      <footer className="mt-8 text-gray-400 text-xl relative z-10">
        &copy; 2025 devtoanphan2211@gmail.com.
      </footer>
    </div>
  );
};

export default Home;
