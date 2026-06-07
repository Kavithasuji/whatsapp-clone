
import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

export default function MessageList({
  conversation,
  messages = [],
  hasMore,
  loadOlderMessages,
  sentTrigger,
}) {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  const loadingRef = useRef(false);
  const previousHeightRef = useRef(0);
  const loadingOlderRef = useRef(false);
  const previousMessageCountRef = useRef(0);

  const handleScroll = () => {
    const container = containerRef.current;

    if (!container || loadingRef.current) return;

    if (container.scrollTop <= 100 && hasMore) {
      previousHeightRef.current = container.scrollHeight;
      loadingOlderRef.current = true;
      loadingRef.current = true;

      loadOlderMessages();

      setTimeout(() => {
        loadingRef.current = false;
      }, 500);
    }
  };

  
  
// Force scroll to bottom whenever YOU send a message
useEffect(() => {
    if (!sentTrigger) return;

    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [sentTrigger]);

  // Scroll to bottom when switching conversations
  useEffect(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({
        behavior: "instant",
      });
    }, 0);

    previousMessageCountRef.current = messages.length;
  }, [conversation?._id]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    // Case 1: Older messages loaded
    if (loadingOlderRef.current) {
      const newHeight = container.scrollHeight;
      const heightDifference = newHeight - previousHeightRef.current;

      container.scrollTop += heightDifference;

      loadingOlderRef.current = false;
      previousHeightRef.current = 0;
    }
    // Case 2: New message added
    else if (messages.length > previousMessageCountRef.current) {
      const distanceFromBottom =
        container.scrollHeight -
        container.scrollTop -
        container.clientHeight;

      // Auto-scroll only if user is already near bottom
      if (distanceFromBottom < 200) {
        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }
    }

    previousMessageCountRef.current = messages.length;
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