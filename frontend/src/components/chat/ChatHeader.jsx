import {
  Search,
  Video,
  MoreVertical,
} from "lucide-react";

export default function ChatHeader({
  selectedUser,
}) {
  return (
    <div
      className="
        h-16
        px-4
        bg-white
        flex
        items-center
        justify-between
        border-b
        border-[#e9edef]
        sticky
        top-0
        z-10
      "
    >
      {/* Left Section */}
      <div className="flex items-center">

        <img
          src="https://i.pravatar.cc/150?img=12"
          alt="user"
          className="
            w-10
            h-10
            rounded-full
            object-cover
          "
        />

        <div className="ml-3">

          <h3
            className="
              text-sm
              font-semibold
              text-gray-900
            "
          >
            {selectedUser?.username ||
              "Select User"}
          </h3>

          <p
            className={`
              text-xs
              ${
                selectedUser?.online
                  ? "text-green-600"
                  : "text-gray-500"
              }
            `}
          >
            {selectedUser?.online
              ? "Online"
              : "Offline"}
          </p>

        </div>

      </div>

      {/* Right Section */}
      <div
        className="
          flex
          items-center
          gap-5
          text-gray-600
        "
      >

        <button
          className="
            hover:text-gray-900
            transition
          "
        >
          <Video size={22} />
        </button>

        <button
          className="
            hover:text-gray-900
            transition
          "
        >
          <Search size={22} />
        </button>

        <button
          className="
            hover:text-gray-900
            transition
          "
        >
          <MoreVertical size={22} />
        </button>

      </div>

    </div>
  );
}