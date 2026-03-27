import { createContext, useContext, useState, useEffect } from "react";
import { socket } from "../socket";

const OnlineUsersContext = createContext([]);

export const OnlineUsersProvider = ({ children, user }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!user) return;

    // CONNECT
    socket.auth = { userId: user.id };

    if (!socket.connected) {
      socket.connect();
      console.log("🔌 SOCKET CONNECT:", user.id);
    }

    // ===== LISTEN =====
    const handleOnlineUsers = (users) => {
      setOnlineUsers(users.map(Number));
    };

    const handleUserOnline = (userId) => {
      setOnlineUsers((prev) =>
        prev.includes(userId) ? prev : [...prev, userId]
      );
    };

    const handleUserOffline = (userId) => {
      setOnlineUsers((prev) =>
        prev.filter((id) => id !== userId)
      );
    };

    socket.on("onlineUsers", handleOnlineUsers);
    socket.on("userOnline", handleUserOnline);
    socket.on("userOffline", handleUserOffline);

    socket.emit("getOnlineUsers");

    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
      socket.off("userOnline", handleUserOnline);
      socket.off("userOffline", handleUserOffline);
    };
  }, [user]);

  return (
    <OnlineUsersContext.Provider value={onlineUsers}>
      {children}
    </OnlineUsersContext.Provider>
  );
};

export const useOnlineUsers = () => useContext(OnlineUsersContext);