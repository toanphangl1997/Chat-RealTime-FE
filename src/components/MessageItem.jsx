import Avatar from "./Avatar";

const MessageItem = ({ msg, prevMsg, nextMsg }) => {
  const isOwn = msg.isOwn;

  const isSameSenderPrev = prevMsg && prevMsg.sender?.id === msg.sender?.id;

  const isSameSenderNext = nextMsg && nextMsg.sender?.id === msg.sender?.id;

  // chỉ show avatar nếu là message cuối cụm
  const showAvatar = !isOwn && !isSameSenderNext;

  return (
    <div
      className={`flex ${isOwn ? "justify-end" : "justify-start"} items-end ${
        isSameSenderPrev ? "mb-1" : "mb-3"
      }`}
    >
      {/* Avatar (giữ width để không bị lệch layout) */}
      {!isOwn && (
        <div className="w-8 mr-[10px]">
          {showAvatar && <Avatar user={msg.sender} size="sm" />}
        </div>
      )}

      {/* Bubble */}
      <div
        className={`
          ${isOwn ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-200"}

          px-3 py-2 sm:px-4 sm:py-3
          text-sm sm:text-base
          break-words whitespace-pre-line
          max-w-[min(60%,400px)]

          ${
            isOwn
              ? `
                rounded-2xl
                ${isSameSenderPrev ? "rounded-tr-md" : ""}
                ${isSameSenderNext ? "rounded-br-md" : ""}
              `
              : `
                rounded-2xl
                ${isSameSenderPrev ? "rounded-tl-md" : ""}
                ${isSameSenderNext ? "rounded-bl-md" : ""}
              `
          }
        `}
      >
        <p>{msg.content}</p>

        {/* chỉ show time ở cuối cụm */}
        {!isSameSenderNext && (
          <p className="text-[11px] sm:text-xs text-gray-300 mt-1 text-right">
            {msg.created_at
              ? new Date(msg.created_at).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </p>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
