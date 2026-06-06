import { useState, useMemo } from "react";
import ChatList from "./ChatList";

export default function Sidebar({
  users,
  selectedUser,
  onSelectUser,
}) {
  const [searchQuery, setSearchQuery] =
    useState("");

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) {
      return users;
    }

    const query = searchQuery
      .toLowerCase()
      .trim();

    const matched = users
      .filter((user) => {
        const username = (
          user.username || ""
        ).toLowerCase();
        const email = (
          user.email || ""
        ).toLowerCase();

        return (
          username.includes(query) ||
          email.includes(query)
        );
      })
      .sort((a, b) => {
        const aUsername = (
          a.username || ""
        ).toLowerCase();
        const aEmail = (
          a.email || ""
        ).toLowerCase();
        const bUsername = (
          b.username || ""
        ).toLowerCase();
        const bEmail = (
          b.email || ""
        ).toLowerCase();

        const aStartsUsername =
          aUsername.startsWith(query);
        const aStartsEmail =
          aEmail.startsWith(query);
        const bStartsUsername =
          bUsername.startsWith(query);
        const bStartsEmail =
          bEmail.startsWith(query);

        if (
          aStartsUsername !==
          bStartsUsername
        ) {
          return aStartsUsername ? -1 : 1;
        }

        if (aStartsEmail !== bStartsEmail) {
          return aStartsEmail ? -1 : 1;
        }

        const aIndex = aUsername.indexOf(
          query
        );
        const bIndex = bUsername.indexOf(
          query
        );

        if (aIndex !== bIndex) {
          return aIndex - bIndex;
        }

        return aUsername.localeCompare(
          bUsername
        );
      });

    return matched;
  }, [users, searchQuery]);

  return (
    <div
      className="
        w-[380px]
        bg-white
        flex
        flex-col
      "
    >
      <div className="p-4">

        <h1 className="text-2xl font-bold text-green-600">
          WhatsApp
        </h1>

      </div>

      <div className="p-3">

        <input
          placeholder="Search by username or email"
          value={searchQuery}
          onChange={(e) =>
            setSearchQuery(e.target.value)
          }
          className="
            w-full
            h-11
            px-4
            rounded-full
            bg-gray-100
            outline-none
            focus:ring-2
            focus:ring-green-600
          "
        />

      </div>

      <ChatList
        users={filteredUsers}
        selectedUser={selectedUser}
        onSelectUser={onSelectUser}
      />
    </div>
  );
}