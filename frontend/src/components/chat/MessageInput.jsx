import { useState } from "react";

import {
  Plus,
  Smile,
  Mic,
  Send,
} from "lucide-react";

export default function MessageInput({
  onSendMessage,
}) {
  const [message, setMessage] =
    useState("");

  const handleSend = () => {
    const text = message.trim();

    if (!text) return;

    if (onSendMessage) {
      onSendMessage(text);
    }

    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div
      className="
        bg-white
        px-4
        py-3
        border-t
        border-gray-200
      "
    >
      <div
        className="
          flex
          items-center
          gap-3
        "
      >
        {/* Attachment */}
        <button
          className="
            text-gray-600
            hover:text-gray-800
          "
        >
          <Plus size={24} />
        </button>

        {/* Emoji */}
        <button
          className="
            text-gray-600
            hover:text-gray-800
          "
        >
          <Smile size={24} />
        </button>

        {/* Input */}
        <div
          className="
            flex-1
            bg-gray-100
            rounded-full
            px-4
          "
        >
          <input
            type="text"
            value={message}
            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }
            onKeyDown={
              handleKeyDown
            }
            placeholder="Type a message"
            className="
              w-full
              h-12
              bg-transparent
              outline-none
            "
          />
        </div>

        {/* Send / Mic */}
        {message.trim() ? (
          <button
            onClick={handleSend}
            className="
              text-green-600
              hover:text-green-700
            "
          >
            <Send size={24} />
          </button>
        ) : (
          <button
            className="
              text-gray-600
              hover:text-gray-800
            "
          >
            <Mic size={24} />
          </button>
        )}
      </div>
    </div>
  );
}