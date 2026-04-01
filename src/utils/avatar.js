export const getAvatar = (avatar, name) => {
  if (avatar && typeof avatar === "string" && avatar.startsWith("http")) {
    return avatar;
  }

  const safeName = name?.trim() || "U";

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    safeName,
  )}&background=random`;
};

/* CONFIG CŨ */
// const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=User";

// const getAvatar = (avatar, name) => {
//   if (avatar && typeof avatar === "string" && avatar.startsWith("http")) {
//     return avatar;
//   }

//   const initials = name
//     ? name
//         .split(" ")
//         .map((w) => w[0])
//         .join("")
//         .toUpperCase()
//     : "U";

//   return `https://ui-avatars.com/api/?name=${initials}&background=random`;
// };
