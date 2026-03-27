import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import http from "../api/axios";

import { useSocket } from "../hooks/useSocket";
import { useUsers } from "../hooks/useUsers";
import { useChat } from "../hooks/useChat";
import { useOnlineUsers, OnlineUsersProvider } from "../context/OnlineUsersContext";

import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/Sidebar";

const ChatContent = ({ user }) => {
  const navigate = useNavigate();

  const [selectedUser, setSelectedUser] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth < 768);

  // SOCKET
  const { socketRef } = useSocket();

  // ONLINE USERS
  const onlineUsers = useOnlineUsers();

  // USERS
  const { inboxUsers, allUsers } = useUsers(user, socketRef);

  // CHAT
  const { getMessages, fetchMessages, sendMessage,typingUsers, markSeen} =
    useChat(user, socketRef);

  // KHÔNG dùng useState messages
  const messages = getMessages(selectedUser);

  // RESPONSIVE
  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth < 768;
      setIsMobile(isNowMobile);
      if (!isNowMobile) setShowSidebar(true);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // LOAD MESSAGES
  useEffect(() => {
    if (selectedUser && user) {
      fetchMessages(selectedUser);
    }
  }, [selectedUser, user]);

  // SELECT USER
  const handleSelectUser = (u) => {
    setSelectedUser(u);
    if (isMobile) setShowSidebar(false);
  };

  // SEND MESSAGE
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedUser) return;

    await sendMessage(selectedUser, messageInput);
    setMessageInput("");
  };

  // LOGOUT
  const handleLogout = async () => {
    try {
      await http.post("/auth/logout").catch(() => {});
    } catch {}

    localStorage.removeItem("token");
    delete http.defaults.headers.common["Authorization"];

    socketRef.current?.disconnect();

    setSelectedUser(null);
    setMessageInput("");

    window.location.href = "/login";
  };

  return (
    <div className="h-screen flex w-full overflow-hidden">
      {/* SIDEBAR */}
      <div className={`${showSidebar ? "block w-full" : "hidden"} md:block md:w-1/4`}>
        <Sidebar
          inboxUsers={inboxUsers}
          allUsers={allUsers}
          selectedUser={selectedUser}
          setSelectedUser={handleSelectUser}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleLogout={handleLogout}
          user={user}
          show={showSidebar}
          isMobile={isMobile}
          onlineUsers={onlineUsers}
        />
      </div>

      {/* CHAT */}
      <div className={`${showSidebar ? "hidden" : "block w-full"} md:block md:w-3/4`}>
        <ChatWindow
          selectedUser={selectedUser}
          messages={messages}
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          handleSendMessage={handleSendMessage}
          handleLogout={handleLogout}
          isMobile={isMobile}
          goBack={() => {
            setSelectedUser(null);
            setShowSidebar(true);
          }}
          onlineUsers={onlineUsers}
        />
      </div>
    </div>
  );
};

const Chat = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return navigate("/login", { replace: true });

    const fetchUser = async () => {
      try {
        const res = await http.get("/auth/me");
        setUser(res.data);
      } catch {
        navigate("/login", { replace: true });
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <OnlineUsersProvider user={user}>
      <ChatContent user={user} />
    </OnlineUsersProvider>
  );
};

export default Chat;