
import { useState, useMemo } from "react";

import {
  MoreVertical,
  User,
  LogOut,
  Search,
} from "lucide-react";

import ChatList from "./ChatList";
import ProfileModal from "./ProfileModal";

import { logout } from "../../utils/logout";

import {
  updateProfile,
} from "../../services/userService";

export default function Sidebar({
  users,
  selectedUser,
  onSelectUser,
}) {

  const currentUser =
    JSON.parse(
      localStorage.getItem("user")
    );

  const [searchQuery, setSearchQuery] =
    useState("");

  const [showMenu, setShowMenu] =
    useState(false);

  const [
    showLogoutModal,
    setShowLogoutModal,
  ] = useState(false);

  const [
    showProfileModal,
    setShowProfileModal,
  ] = useState(false);

  const filteredUsers = useMemo(() => {

    if (!searchQuery.trim()) {
      return users;
    }

    const query =
      searchQuery
        .toLowerCase()
        .trim();

    return users.filter((user) => {

      const username =
        (
          user.username || ""
        ).toLowerCase();

      const email =
        (
          user.email || ""
        ).toLowerCase();

      return (
        username.includes(query) ||
        email.includes(query)
      );

    });

  }, [users, searchQuery]);

  const handleProfileSave =
    async (profilePicture) => {

      try {

        const response =
          await updateProfile(
            profilePicture
          );

        const updatedUser = {
          ...response.user,
          id: response.user.id || response.user._id,
        };

        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );

        setShowProfileModal(
          false
        );

      } catch (error) {

        console.log(error);

      }

    };

  return (
    <>
      <div
        className="
          w-full
          h-full
          bg-white
          flex
          flex-col
          overflow-hidden
        "
      >

        {/* Header */}

        <div
          className="
            p-4
            flex
            items-center
            justify-between
            relative
          "
        >
          <h1
            className="
              text-2xl
              font-bold
              text-green-600
            "
          >
            WhatsApp
          </h1>

          <button
            onClick={() =>
              setShowMenu(
                !showMenu
              )
            }
            className="
              p-2
              rounded-full
              hover:bg-gray-100
            "
          >
            <MoreVertical
              size={22}
            />
          </button>

          {showMenu && (
            <div
              className="
                absolute
                top-12
                right-2
                w-44
                bg-white
                rounded-lg
                shadow-xl
                z-50
                py-1
              "
            >

              {/* Profile */}

              <button
                onClick={() => {

                  setShowMenu(
                    false
                  );

                  setShowProfileModal(
                    true
                  );

                }}
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  text-sm
                  hover:bg-gray-100
                "
              >
                <User size={18} />

                <span>
                  Profile
                </span>

              </button>

              {/* Logout */}

              <button
                onClick={() => {

                  setShowMenu(
                    false
                  );

                  setShowLogoutModal(
                    true
                  );

                }}
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  text-sm
                  hover:bg-gray-100
                "
              >
                <LogOut
                  size={18}
                />

                <span>
                  Log out
                </span>

              </button>

            </div>
          )}

        </div>

        {/* Search */}

        <div className="p-3">

          <div
            className="
              relative
              flex
              items-center
            "
          >

            <Search
              size={18}
              className="
                absolute
                left-4
                text-gray-500
              "
            />

            <input
              type="text"
              placeholder="Search or start a new chat"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }
              className="
                w-full
                h-12
                pl-12
                pr-4
                rounded-full
                bg-[#f0f2f5]
                outline-none
                text-sm
                focus:bg-white
                focus:ring-1
                focus:ring-green-500
              "
            />

          </div>

        </div>

        {/* Chat List */}

        <ChatList
          users={
            filteredUsers
          }
          selectedUser={
            selectedUser
          }
          onSelectUser={
            onSelectUser
          }
        />

      </div>

      {/* Logout Modal */}

      {showLogoutModal && (

        <div
          className="
            fixed
            inset-0
            bg-black/40
            flex
            items-center
            justify-center
            z-[100]
          "
        >

          <div
            className="
              bg-white
              rounded-xl
              p-6
              w-[350px]
            "
          >

            <h3
              className="
                text-lg
                font-semibold
              "
            >
              Logout
            </h3>

            <p
              className="
                mt-2
                text-gray-600
              "
            >
              Do you want to log out?
            </p>

            <div
              className="
                flex
                justify-end
                gap-3
                mt-6
              "
            >

              <button
                onClick={() =>
                  setShowLogoutModal(
                    false
                  )
                }
                className="
                  px-4
                  py-2
                  border
                  rounded-lg
                "
              >
                No
              </button>

              <button
                onClick={
                  logout
                }
                className="
                  px-4
                  py-2
                  rounded-lg
                  bg-red-500
                  text-white
                "
              >
                Yes
              </button>

            </div>

          </div>

        </div>

      )}

      {/* Profile Modal */}

      {showProfileModal && (

        <ProfileModal
          user={currentUser}
          onClose={() =>
            setShowProfileModal(
              false
            )
          }
          onSave={
            handleProfileSave
          }
        />

      )}

    </>
  );
}