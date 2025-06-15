import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

const ChatWindow = ({
  selectedUser,
  messages,
  messageInput,
  setMessageInput,
  handleSendMessage,
  handleLogout,
}) => (
  <div className="w-3/4 flex flex-col">
    <div className="p-4 border-b border-gray-700 flex items-center justify-between">
      {selectedUser ? (
        <div className="flex items-center">
          <img
            src={selectedUser.avatar || "https://via.placeholder.com/40"}
            alt={selectedUser.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="ml-3">
            <p className="text-white font-medium">{selectedUser.name}</p>
            <p className="text-gray-400 text-sm">
              {selectedUser.online ? "Đang hoạt động" : "Ngoại tuyến"}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-gray-400">Select person to start chatting with</p>
      )}

      {/* Nút Logout */}
      <button
        onClick={handleLogout}
        className="text-sm text-red-400 hover:text-red-200 border border-red-500 px-2 py-1 rounded-md transition ml-auto mr-2"
      >
        Logout
      </button>
    </div>

    <MessageList messages={messages} selectedUser={selectedUser} />

    <MessageInput
      messageInput={messageInput}
      setMessageInput={setMessageInput}
      handleSendMessage={handleSendMessage}
    />
  </div>
);

export default ChatWindow;
