

export default function ChatItem({
  chat,
  active = false,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`
        flex
        items-center
        gap-3
        px-4
        py-3
        cursor-pointer
        transition-all
        duration-200
        border-gray-100

        ${
          active
            ? "bg-[#f0f2f5]"
            : "hover:bg-gray-50"
        }
      `}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">

        <img
          src={
            chat.avatar ||
            "https://i.pravatar.cc/150?img=12"
          }
          alt={chat.name}
          className="
            w-12
            h-12
            rounded-full
            object-cover
          "
        />

        {chat.online ? (
          <span
            className="
              absolute
              bottom-0
              right-0
              w-3
              h-3
              rounded-full
              bg-green-500
              border-2
              border-white
            "
          />
        ) : (
          <span
            className="
              absolute
              bottom-0
              right-0
              w-3
              h-3
              rounded-full
              bg-gray-300
              border-2
              border-white
            "
          />
        )}

      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">

        {/* Top */}
        <div
          className="
            flex
            justify-between
            items-center
          "
        >

          <h3
            className="
              font-medium
              text-gray-900
              truncate
            "
          >
            {chat.name}
          </h3>

          <span
            className="
              text-xs
              text-gray-500
              flex-shrink-0
              ml-2
            "
          >
            {/* {chat.time} */}
          </span>

        </div>

        {/* Bottom */}
      <div
  className="
    flex
    items-start
    justify-between
    mt-1
  "
>

  <p
    className="
      text-sm
      text-gray-500
      truncate
      pr-2
      flex-1
    "
  >
    {chat.lastMessage || ""}
  </p>

  <div
    className="
      flex
      flex-col
      items-end
      gap-1
    "
  >

    <span
      className={`
        text-xs
        ${
          chat.unread > 0
            ? "text-[#25D366]"
            : "text-gray-500"
        }
      `}
    >
      {chat.time}
    </span>

    {chat.unread > 0 && (
      <span
        className="
          min-w-[20px]
          h-5
          px-1.5
          flex
          items-center
          justify-center
          rounded-full
          bg-[#25D366]
          text-white
          text-[11px]
          font-medium
        "
      >
        {chat.unread}
      </span>
    )}

  </div>

</div>

      </div>

    </div>
  );
}