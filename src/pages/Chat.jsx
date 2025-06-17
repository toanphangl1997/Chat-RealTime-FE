import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import http from "../api/axios";
import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/Sidebar";

const socket = io("https://chat-realtime-api-2i6s.onrender.com");

const Chat = () => {
  const [user, setUser] = useState(null);
  const [inboxUsers, setInboxUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const socketRef = useRef(socket);

  // responsive
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth < 768;
      setIsMobile(isNowMobile);
      if (!isNowMobile) setShowSidebar(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    if (isMobile) setShowSidebar(false);
  };

  useEffect(() => {
    const fetchUserAndInbox = async () => {
      try {
        const res = await http.get("/auth/me");
        setUser(res.data);
        socketRef.current.emit("userOnline", res.data.id);

        const inboxRes = await http.get("/messages/inbox");
        setInboxUsers(inboxRes.data);

        // Nếu đang ở mobile và có inbox thì chọn người đầu tiên
        if (isMobile && inboxRes.data.length > 0) {
          setSelectedUser(inboxRes.data[0]);
          setShowSidebar(false);
        }
      } catch (err) {
        console.error("Không lấy được user hoặc inbox:", err);
        navigate("/login");
      }
    };
    fetchUserAndInbox();
  }, [navigate, isMobile]);

  useEffect(() => {
    socketRef.current.on("onlineUsers", (onlineList) => {
      setInboxUsers((prev) =>
        prev.map((u) => ({
          ...u,
          online: onlineList.some((ou) => ou.id === u.id),
        }))
      );
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!user) return <div className="text-white p-4">Loading...</div>;

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 to-purple-900 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div
        className={`${
          showSidebar ? "block" : "hidden"
        } md:block md:w-1/4 h-full`}
      >
        <Sidebar
          inboxUsers={inboxUsers}
          selectedUser={selectedUser}
          setSelectedUser={handleSelectUser}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleLogout={handleLogout}
        />
      </div>

      {/* ChatWindow */}
      <div
        className={`${
          showSidebar ? "hidden" : "block"
        } md:block md:w-3/4 flex-1 h-full`}
      >
        {selectedUser ? (
          <ChatWindow
            selectedUser={selectedUser}
            messages={messages}
            messageInput={messageInput}
            setMessageInput={setMessageInput}
            handleSendMessage={handleSendMessage}
            handleLogout={handleLogout}
            isMobile={isMobile}
            goBack={() => setShowSidebar(true)}
          />
        ) : (
          <div className="text-white flex justify-center items-center h-full text-xl text-center px-4">
            {isMobile
              ? "Vui lòng chọn người để bắt đầu trò chuyện."
              : "Chọn người dùng trong danh sách để bắt đầu chat."}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
