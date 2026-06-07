import {
  Search,
  Video,
  MoreVertical,
  ArrowLeft,
} from "lucide-react";

import defaultAvatar from "../../assets/default-avatar.png.jpg";
export default function ChatHeader({
  selectedUser,
  onBack,
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
  src={
    selectedUser?.profilePicture ||
    defaultAvatar
  }
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
          gap-3
          text-gray-600
        "
      >

        {onBack && selectedUser && (
          <button
            onClick={onBack}
            className="
              md:hidden
              p-2
              rounded-full
              hover:bg-gray-100
              transition
            "
          >
            <ArrowLeft size={22} />
          </button>
        )}

        <button
          className="
            hidden
            md:flex
            hover:text-gray-900
            transition
          "
        >
          <Video size={22} />
        </button>

        <button
          className="
            hidden
            md:flex
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