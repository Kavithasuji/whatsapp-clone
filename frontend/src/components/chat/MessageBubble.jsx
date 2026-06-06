
export default function MessageBubble({
  message,
}) {
  const currentUser =
    JSON.parse(
      localStorage.getItem("user")
    );

  const isMine =
    String(message.senderId) ===
    String(currentUser?.id);

  const messageTime =
    message.createdAt
      ? new Date(
          message.createdAt
        ).toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        )
      : "";

  return (
    <div
      className={`
        flex
        mb-2
        ${
          isMine
            ? "justify-end"
            : "justify-start"
        }
      `}
    >
      <div
        className={`
          px-3
          py-2
          rounded-lg
          max-w-md
          min-w-[100px]
          shadow-sm

          ${
            isMine
              ? "bg-[#d9fdd3]"
              : "bg-white"
          }
        `}
      >
        <div
          className="
            break-words
            text-[14px]
            text-gray-900
          "
        >
          {message.text}
        </div>

        <div
          className="
            flex
            justify-end
            items-center
            gap-1
            mt-1
          "
        >
          <span
            className="
              text-[11px]
              text-gray-500
            "
          >
            {messageTime}
          </span>

          {isMine && (
            <span
              className="
                text-[12px]
                leading-none
              "
            >
              {message.status ===
                "sent" && "✓"}

              {message.status ===
                "delivered" &&
                "✓✓"}

              {message.status ===
                "read" && (
                <span
                  className="
                    text-blue-500
                  "
                >
                  ✓✓
                </span>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}