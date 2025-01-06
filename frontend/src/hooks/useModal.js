import { useState } from "react";

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState("loading"); // 'loading', 'error', or 'success'
  const [message, setMessage] = useState("");

  const openModal = (newType, newMessage) => {
    setType(newType);
    setMessage(newMessage);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    type,
    message,
    openModal,
    closeModal,
  };
};
