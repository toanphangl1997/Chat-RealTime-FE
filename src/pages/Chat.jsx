import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import http from "../api/axios";

const socket = io("http://localhost:3197"); // sửa nếu backend ở host khác

const Chat = () => {
  const [user, setUser] = useState(null);
  const [inboxUsers, setInboxUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const navigate = useNavigate();
  const socketRef = useRef(socket);

  // Gửi userOnline khi đã xác thực thành công
  useEffect(() => {
    const fetchUserAndInbox = async () => {
      try {
        const res = await http.get("/auth/me");
        setUser(res.data);
        socketRef.current.emit("userOnline", res.data.id);

        const inboxRes = await http.get("/messages/inbox");
        setInboxUsers(inboxRes.data);
      } catch (err) {
        console.error("Không lấy được user hoặc inbox:", err);
        navigate("/login");
      }
    };

    fetchUserAndInbox();
  }, [navigate]);

  // Lắng nghe onlineUsers và cập nhật trạng thái online của inboxUsers
  useEffect(() => {
    socketRef.current.on("onlineUsers", (onlineList) => {
      setInboxUsers((prev) =>
        prev.map((u) => {
          const isOnline = onlineList.some((ou) => ou.id === u.id);
          return { ...u, online: isOnline };
        })
      );

      // cập nhật selectedUser nếu đang được chọn
      setSelectedUser((prev) => {
        if (!prev) return null;
        const isOnline = onlineList.some((ou) => ou.id === prev.id);
        return { ...prev, online: isOnline };
      });
    });

    return () => {
      socketRef.current.off("onlineUsers");
    };
  }, []);

  // Lấy tin nhắn giữa user hiện tại và selectedUser
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser || !user) return;
      try {
        const res = await http.get("/messages");
        const filtered = res.data
          .filter(
            (m) =>
              (m.sender.id === user.id && m.receiver.id === selectedUser.id) ||
              (m.receiver.id === user.id && m.sender.id === selectedUser.id)
          )
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        const formatted = filtered.map((msg) => ({
          id: msg.id,
          sender: msg.sender.id === user.id ? "Bạn" : msg.sender.name,
          content: msg.content,
          time: new Date(msg.created_at).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));
        setMessages(formatted);
      } catch (err) {
        console.error("Không lấy được tin nhắn:", err);
      }
    };

    fetchMessages();
  }, [selectedUser, user]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedUser) return;

    try {
      await http.post("/messages", {
        sender_id: user.id,
        receiver_id: selectedUser.id,
        content: messageInput,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "Bạn",
          content: messageInput,
          time: new Date().toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setMessageInput("");
    } catch (err) {
      console.error("Gửi tin nhắn lỗi:", err);
    }
  };

  if (!user) return <div className="text-white p-4">Đang tải...</div>;

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 to-purple-900 flex">
      <div className="h-full w-full bg-gray-800 rounded-none shadow-none flex overflow-hidden">
        {/* Sidebar trái - Danh sách người từng chat */}
        <div className="w-1/4 bg-gray-900 border-r border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-purple-300">Tin nhắn</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {inboxUsers.map((u) => (
              <div
                key={u.id}
                onClick={() => setSelectedUser(u)}
                className={`flex items-center p-4 cursor-pointer hover:bg-gray-700 ${
                  selectedUser?.id === u.id ? "bg-gray-700" : ""
                }`}
              >
                <div className="relative">
                  <img
                    src={u.avatar || "https://via.placeholder.com/40"}
                    alt={u.name}
                    className="w-10 h-10 rounded-full"
                  />
                  {u.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></span>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-white font-medium">{u.name}</p>
                  <p className="text-gray-400 text-sm truncate">
                    {u.lastMessage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Khu vực chat bên phải */}
        <div className="w-3/4 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-700 flex items-center">
            {selectedUser ? (
              <>
                <img
                  src={selectedUser.avatar || "https://via.placeholder.com/40"}
                  alt={selectedUser.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-3">
                  <p className="text-white font-medium">{selectedUser.name}</p>
                  <p className="text-gray-400 text-sm">
                    {selectedUser.online ? "Đang hoạt động" : "Ngoại tuyến"}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-gray-400">Chọn người để bắt đầu trò chuyện</p>
            )}
          </div>

          {/* Tin nhắn */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-800">
            {selectedUser ? (
              messages.length === 0 ? (
                <p className="text-gray-400 text-center mt-10">
                  Bắt đầu trò chuyện với {selectedUser.name}!
                </p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-4 flex ${
                      msg.sender === "Bạn" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-lg ${
                        msg.sender === "Bạn"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-200"
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
                    </div>
                  </div>
                ))
              )
            ) : (
              <p className="text-center text-gray-500 mt-10">
                Hãy chọn một người để bắt đầu.
              </p>
            )}
          </div>

          {/* Gửi tin nhắn */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-gray-700 bg-gray-900"
          >
            <div className="flex items-center">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
              />
              <button
                type="submit"
                className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
              >
                Gửi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
