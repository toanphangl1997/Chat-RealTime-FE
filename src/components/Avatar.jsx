import { getAvatar } from "../utils/avatar";

const sizeMap = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-14 h-14",
  xl: "w-24 h-24",
};

const dotSizeMap = {
  sm: "w-2 h-2",
  md: "w-3 h-3",
  lg: "w-3.5 h-3.5",
  xl: "w-4 h-4",
};

const Avatar = ({
  user,
  size = "md",
  showOnline = false,
  isOnline = false,
  className = "",
}) => {
  if (!user) return null;

  const avatarUrl = getAvatar(user.avatar, user.name);

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      <img
        src={avatarUrl}
        alt={user.name}
        className={`${sizeMap[size]} rounded-full object-cover`}
      />

      {showOnline && (
        <span
          className={`absolute bottom-0 right-0 ${
            dotSizeMap[size]
          } rounded-full border-2 border-gray-900 ${
            isOnline ? "bg-green-500" : "bg-gray-500"
          }`}
        />
      )}
    </div>
  );
};

export default Avatar;
