import { useRef } from "react";
import { socket } from "../socket";

export const useSocket = () => {
  const socketRef = useRef(socket);
  return { socketRef };
};