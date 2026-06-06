
// import MessageBubble from "./MessageBubble";
// import {
//   useEffect,
//   useRef,
// } from "react";

// export default function MessageList({
//   conversation,
//   messages = [],
// }) {
//   if (!conversation) {
//     return (
//       <div
//         className="
//           flex-1
//           flex
//           items-center
//           justify-center
//           bg-[#efeae2]
//           text-gray-500
//         "
//       >
//         Start a conversation
//       </div>
//     );
//   }
// const bottomRef =
//   useRef(null);

// useEffect(() => {

//   bottomRef.current?.
//     scrollIntoView({
//       behavior: "smooth",
//     });

// }, [messages]);
//   return (
//     <div
//       className="
//         flex-1
//         p-4
//         bg-[#efeae2]
//         overflow-y-auto
//       "
//     >
//       {!messages.length ? (
//         <div
//           className="
//             h-full
//             flex
//             items-center
//             justify-center
//             text-gray-500
//           "
//         >
//           No messages yet
//         </div>
//       ) : (
//         messages.map((message) => (
//           <MessageBubble
//             key={message._id}
//             message={message}
//           />
//         ))
//       )}
//     </div>
//   );
// }
import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

export default function MessageList({
  conversation,
  messages = [],
}) {
  const listRef = useRef(null);
  const bottomRef = useRef(null);
  const shouldAutoScrollRef = useRef(true);

  const handleScroll = () => {
    const listEl = listRef.current;
    if (!listEl) return;

    const distanceFromBottom =
      listEl.scrollHeight - listEl.scrollTop - listEl.clientHeight;
    shouldAutoScrollRef.current = distanceFromBottom < 80;
  };

  useEffect(() => {
    shouldAutoScrollRef.current = true;
  }, [conversation?._id]);

  useEffect(() => {
    if (shouldAutoScrollRef.current) {
      bottomRef.current?.scrollIntoView({
        behavior: "instant",
      });
    }
  }, [messages]);

  if (!conversation) {
    return (
      <div
        className="
          flex-1
          flex
          items-center
          justify-center
          bg-[#efeae2]
          text-gray-500
        "
      >
        Start a conversation
      </div>
    );
  }

  return (
    <div
      ref={listRef}
      onScroll={handleScroll}
      className="
        flex-1
        p-4
        bg-[#efeae2]
        overflow-y-auto
      "
    >
      {!messages.length ? (
        <div
          className="
            h-full
            flex
            items-center
            justify-center
            text-gray-500
          "
        >
          No messages yet
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <MessageBubble
              key={message._id}
              message={message}
            />
          ))}

          <div ref={bottomRef} />
        </>
      )}
    </div>
  );
}