const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=User";

const getAvatar = (avatar) => {
  if (!avatar) return DEFAULT_AVATAR;

  if (typeof avatar === "string" && avatar.startsWith("http")) {
    return avatar;
  }

  return DEFAULT_AVATAR;
};

const MessageItem = ({ msg }) => {
  return (
    <div
      className={`mb-2 flex items-end ${
        msg.isOwn ? "justify-end" : "justify-start"
      }`}
    >
      {/* Avatar người khác */}
      {!msg.isOwn && (
        <img
          src={getAvatar(msg.sender?.avatar)}
          alt="avatar"
          className="w-8 h-8 rounded-full mr-2 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_AVATAR;
          }}
        />
      )}

      {/* Bubble */}
      <div
        className={`${
          msg.isOwn ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-200"
        } rounded-lg px-3 py-2 sm:px-4 sm:py-3 max-w-[75%] sm:max-w-[60%] text-sm sm:text-base break-words whitespace-pre-line`}
      >
        <p>{msg.content}</p>
        <p className="text-[11px] sm:text-xs text-gray-300 mt-1 text-right">
          {msg.created_at
            ? new Date(msg.created_at).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""}
        </p>
      </div>

      {/* Avatar mình */}
      {msg.isOwn && (
        <img
          src={getAvatar(msg.sender?.avatar)}
          alt="avatar"
          className="w-8 h-8 rounded-full ml-2 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_AVATAR;
          }}
        />
      )}
    </div>
  );
};

export default MessageItem;