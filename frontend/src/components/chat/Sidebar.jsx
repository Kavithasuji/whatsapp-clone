import ChatList from "./ChatList";

export default function Sidebar({
  users,
    selectedUser,
  onSelectUser,
}) {
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
          placeholder="Search"
          className="
            w-full
            h-11
            px-4
            rounded-full
            bg-gray-100
            outline-none
          "
        />

      </div>

   <ChatList
  users={users}
  selectedUser={selectedUser}
  onSelectUser={onSelectUser}
/>
    </div>
  );
}