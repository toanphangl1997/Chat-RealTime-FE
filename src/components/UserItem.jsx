import Avatar from "./Avatar";

const UserItem = ({ user, isSelected, onClick, isOnline }) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center p-3 md:p-4 cursor-pointer hover:bg-gray-700 ${
        isSelected ? "bg-gray-700" : ""
      }`}
    >
      <div className="relative flex-shrink-0">
        {/* <img
          src={getAvatar(user.avatar, user.name)}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover"
        /> */}

        <Avatar user={user} size="md" showOnline isOnline={isOnline} />

        {/* dùng isOnline thay vì user.online */}
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900 ${
            isOnline ? "bg-green-500" : "bg-gray-500"
          }`}
        ></span>
      </div>

      <div className="ml-3 overflow-hidden">
        <p className="text-white font-medium truncate">{user.name}</p>
        <p className="text-gray-400 text-sm truncate">{user.lastMessage}</p>
      </div>
    </div>
  );
};

export default UserItem;
