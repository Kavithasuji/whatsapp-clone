
import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

export default function MessageList({
  conversation,
  messages = [],
  hasMore,
  loadOlderMessages,
}) {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const shouldAutoScrollRef = useRef(true);
  const loadingRef = useRef(false);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container || loadingRef.current) return;

    const scrollTop = container.scrollTop;

    // Load more when user scrolls near top (within 100px)
    if (scrollTop <= 100 && hasMore) {
      // console.log("[MessageList] TRIGGER LOAD MORE - scrollTop:", scrollTop);
      loadingRef.current = true;
      loadOlderMessages();

      // Reset after a delay
      setTimeout(() => {
        loadingRef.current = false;
      }, 500);
    }
  };

  useEffect(() => {
    shouldAutoScrollRef.current = true;
  }, [conversation?._id]);

  useEffect(() => {
    if (shouldAutoScrollRef.current && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [messages]);

  if (!conversation) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#efeae2] text-gray-500">
        Start a conversation
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="w-full h-full flex flex-col p-4 overflow-y-auto bg-[#efeae2]"
    >
      {!messages.length ? (
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          No messages yet
        </div>
      ) : (
        <>
          {hasMore && (
            <div className="text-center text-xs text-gray-500 mb-3 py-2">
              Scroll up to load older messages
            </div>
          )}

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