
// import { useEffect, useRef } from "react";
// import MessageBubble from "./MessageBubble";


// export default function MessageList({
//   conversation,
//   messages = [],
//   hasMore,
//   loadOlderMessages,
// }){
//   const listRef = useRef(null);
//   const bottomRef = useRef(null);
//   const shouldAutoScrollRef = useRef(true);

// const containerRef =
//   useRef(null);

// const handleScroll =
//   () => {

//     if (
//       containerRef.current
//         ?.scrollTop <= 5 &&
//       hasMore
//     ) {

//       loadOlderMessages();
//     }
//   };  const handleScroll = () => {
//     const listEl = listRef.current;
//     if (!listEl) return;

//     const distanceFromBottom =
//       listEl.scrollHeight - listEl.scrollTop - listEl.clientHeight;
//     shouldAutoScrollRef.current = distanceFromBottom < 80;
//   };

//   useEffect(() => {
//     shouldAutoScrollRef.current = true;
//   }, [conversation?._id]);

//   useEffect(() => {
//     if (shouldAutoScrollRef.current) {
//       bottomRef.current?.scrollIntoView({
//         behavior: "instant",
//       });
//     }
//   }, [messages]);

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

//   return (
//     <div
//       ref={listRef}
//       onScroll={handleScroll}
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
//         <>
//           {messages.map((message) => (
//             <MessageBubble
//               key={message._id}
//               message={message}
//             />
//           ))}

//           <div ref={bottomRef} />
//         </>
//       )}
//     </div>
//   );
// }
import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

export default function MessageList({
  conversation,
  messages = [],
  hasMore,
  loadOlderMessages,
}) {

  const containerRef =
    useRef(null);

  const bottomRef =
    useRef(null);

  const shouldAutoScrollRef =
    useRef(true);

const handleScroll = () => {

  const listEl =
    containerRef.current;

  if (!listEl) return;

  console.log(
    "scrollTop:",
    listEl.scrollTop
  );

  if (
    listEl.scrollTop <= 5 &&
    hasMore
  ) {

    console.log(
      "LOAD MORE"
    );

    loadOlderMessages();
  }
};

  useEffect(() => {

    shouldAutoScrollRef.current =
      true;

  }, [conversation?._id]);

  useEffect(() => {

    if (
      shouldAutoScrollRef.current
    ) {

      bottomRef.current?.
        scrollIntoView({
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
      ref={containerRef}
      onScroll={handleScroll}
      className="
        flex-1
        p-4
        overflow-y-auto
         bg-[#efeae2]
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
          {hasMore && (
            <div
              className="
                text-center
                text-xs
                text-gray-500
                mb-3
              "
            >
              Scroll up to load older messages
            </div>
          )}

          {messages.map(
            (message) => (
              <MessageBubble
                key={message._id}
                message={message}
              />
            )
          )}

          <div ref={bottomRef} />
        </>

      )}

    </div>
  );
}