import { useState } from "react";
import defaultAvatar from "../../assets/default-avatar.png.jpg";// C:\Users\merun\Documents\whatsapp-clone\frontend\src\assets\default-avatar.png.jpg

export default function ProfileModal({
  user,
  onClose,
  onSave,
}) {
  const [preview, setPreview] =
    useState(
      user?.profilePicture || ""
    );

  const handleImage = (e) => {
    const file =
      e.target.files[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onloadend = () => {
      setPreview(
        reader.result
      );
    };

    reader.readAsDataURL(file);
  };

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/40
        flex
        items-center
        justify-center
        z-50
      "
    >
      <div
        className="
          bg-white
          w-[420px]
          rounded-2xl
          shadow-xl
          overflow-hidden
        "
      >

        {/* Header */}

        <div
          className="
            bg-green-500
            text-white
            px-6
            py-4
          "
        >
          <h2
            className="
              text-xl
              font-semibold
            "
          >
            Profile
          </h2>
        </div>

        <div
          className="
            p-6
            flex
            flex-col
            items-center
          "
        >

          {/* Avatar */}

          <img
            src={
              preview ||
              defaultAvatar
            }
            alt="profile"
            className="
              w-32
              h-32
              rounded-full
              object-cover
              border-4
              border-gray-100
              shadow
            "
          />

          {/* Upload Button */}

          <label
            className="
              mt-4
              px-4
              py-2
              bg-gray-100
              hover:bg-gray-200
              rounded-lg
              cursor-pointer
              text-sm
              font-medium
            "
          >
            Change Photo

            <input
              type="file"
              accept="image/*"
              onChange={
                handleImage
              }
              className="hidden"
            />
          </label>

          {/* User Details */}

          <div
            className="
              w-full
              mt-6
              space-y-4
            "
          >

            <div>
              <p
                className="
                  text-xs
                  text-gray-500
                  mb-1
                "
              >
                Username
              </p>

              <div
                className="
                  p-3
                  bg-gray-50
                  rounded-lg
                "
              >
                {user?.username}
              </div>
            </div>

            <div>
              <p
                className="
                  text-xs
                  text-gray-500
                  mb-1
                "
              >
                Email
              </p>

              <div
                className="
                  p-3
                  bg-gray-50
                  rounded-lg
                "
              >
                {user?.email}
              </div>
            </div>

          </div>

          {/* Buttons */}

          <div
            className="
              flex
              justify-end
              gap-3
              w-full
              mt-6
            "
          >

            <button
              onClick={onClose}
              className="
                px-4
                py-2
                border
                rounded-lg
                hover:bg-gray-100
              "
            >
              Cancel
            </button>

            <button
              onClick={() =>
                onSave(
                  preview
                )
              }
              className="
                px-5
                py-2
                bg-green-500
                text-white
                rounded-lg
                hover:bg-green-600
              "
            >
              Save
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}