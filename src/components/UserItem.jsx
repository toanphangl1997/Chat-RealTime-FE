const UserItem = ({ user, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center p-3 md:p-4 cursor-pointer hover:bg-gray-700 ${
        isSelected ? "bg-gray-700" : ""
      }`}
    >
      <div className="relative flex-shrink-0">
        <img
          src={user.avatar || "https://via.placeholder.com/40"}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        {user.online && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></span>
        )}
      </div>
      <div className="ml-3 overflow-hidden">
        <p className="text-white font-medium truncate">{user.name}</p>
        <p className="text-gray-400 text-sm truncate">{user.lastMessage}</p>
      </div>
    </div>
  );
};

export default UserItem;
