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
  onlineUsers, // ✅ thêm prop này
  onOpenProfile,
}) => {
  // realtime online status
  const isOnline = selectedUser ? onlineUsers.includes(selectedUser.id) : false;

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
              <div className="relative">
                <img
                  src={getAvatar(selectedUser.avatar)}
                  alt={selectedUser.name}
                  className="w-10 h-10 rounded-full object-cover"
                />

                {/* FIX ONLINE REALTIME */}
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${
                    isOnline ? "bg-green-500" : "bg-gray-500"
                  }`}
                ></span>
              </div>

              <div className="ml-3 truncate">
                <p className="text-white font-medium truncate">
                  {selectedUser.name}
                </p>
                <p className="text-gray-400 text-sm">
                  {isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-400">
              Choose someone to start the conversation with.
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenProfile}
            className="text-sm text-blue-400 hover:text-blue-200 border border-blue-500 px-2 py-1 rounded-md"
          >
            Edit Profile
          </button>

          <button
            onClick={handleLogout}
            className="text-sm text-red-400 hover:text-red-200 border border-red-500 px-2 py-1 rounded-md"
          >
            Logout
          </button>
        </div>
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
          Choose someone to start the conversation with.
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
