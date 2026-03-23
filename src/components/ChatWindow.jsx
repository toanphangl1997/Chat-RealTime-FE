import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=User";

const getAvatar = (avatar) => {
  if (!avatar) return DEFAULT_AVATAR;
  if (typeof avatar === "string" && avatar.startsWith("http")) return avatar;
  return DEFAULT_AVATAR;
};

const ChatWindow = ({
  selectedUser,
  messages,
  messageInput,
  setMessageInput,
  handleSendMessage,
  handleLogout, // <- nhận prop từ Chat.jsx
  isMobile,
  goBack,
}) => {
  if (isMobile && !selectedUser) {
    return (
      <div className="flex items-center justify-center text-white h-full">
        Vui lòng chọn người để bắt đầu trò chuyện
      </div>
    );
  }

  return (
    <div className="w-full md:w-auto flex flex-col h-full bg-gray-800">
      {/* Header */}
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
          <div className="flex items-center flex-1 overflow-hidden">
            <img
              src={getAvatar(selectedUser.avatar)}
              alt={selectedUser.name}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_AVATAR;
              }}
            />
            <div className="ml-3 truncate">
              <p className="text-white font-medium truncate max-w-[120px] md:max-w-none">
                {selectedUser.name}
              </p>
              <p className="text-gray-400 text-sm">
                {selectedUser.online ? "Đang hoạt động" : "Ngoại tuyến"}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">Chọn người để bắt đầu trò chuyện</p>
        )}

        <button
          onClick={handleLogout}
          className="text-sm text-red-400 hover:text-red-200 border border-red-500 px-2 py-1 rounded-md transition ml-4"
        >
          Logout
        </button>
      </div>

      <MessageList messages={messages} selectedUser={selectedUser} />

      {selectedUser && (
        <MessageInput
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          handleSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
};

export default ChatWindow;