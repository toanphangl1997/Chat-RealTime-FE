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
  handleLogout,
  isMobile,
  goBack,
}) => {
  return (
    <div className="w-full flex flex-col h-full bg-gray-800 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center">
          {selectedUser && (
            <button
              onClick={goBack}
              className="text-purple-300 mr-3 text-xl font-bold hover:text-purple-100"
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
            <p className="text-gray-400">
              Chọn người để bắt đầu trò chuyện
            </p>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="text-sm text-red-400 hover:text-red-200 border border-red-500 px-2 py-1 rounded-md transition ml-4"
        >
          Logout
        </button>
      </div>

      {/* Body */}
      {selectedUser ? (
        <>
          <MessageList messages={messages} selectedUser={selectedUser} />

          <MessageInput
            messageInput={messageInput}
            setMessageInput={setMessageInput}
            handleSendMessage={handleSendMessage}
          />
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          Chọn người để bắt đầu trò chuyện
        </div>
      )}
    </div>
  );
};

export default ChatWindow;