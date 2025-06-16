import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

const ChatWindow = ({
  selectedUser,
  messages,
  messageInput,
  setMessageInput,
  handleSendMessage,
  handleLogout,
  isMobile,
  goBack,
}) => {
  if (isMobile && !selectedUser) return null;

  return (
    <div className="w-full md:w-auto flex flex-col h-full bg-gray-800">
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {isMobile && (
          <button
            onClick={goBack}
            className="text-purple-300 mr-3 text-xl font-bold"
          >
            ←
          </button>
        )}
        {selectedUser ? (
          <div className="flex items-center">
            <img
              src={selectedUser.avatar || "https://via.placeholder.com/40"}
              alt={selectedUser.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="ml-3">
              <p className="text-white font-medium truncate max-w-[120px] md:max-w-none">
                {selectedUser.name}
              </p>
              <p className="text-gray-400 text-sm">
                {selectedUser.online ? "Đang hoạt động" : "Ngoại tuyến"}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">Select person to start chatting</p>
        )}

        <button
          onClick={handleLogout}
          className="text-sm text-red-400 hover:text-red-200 border border-red-500 px-2 py-1 rounded-md transition ml-auto"
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
};

export default ChatWindow;
