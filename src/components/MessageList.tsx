import { Message } from "@/types/chat";
import { MessageBubble } from "./MessageBubble";
import { getDateSeparator } from "@/utils/dateFormat";
import { useEffect, useRef } from "react";

interface MessageListProps {
  messages: Message[];
  animateMessages?: boolean;
  showWatermark?: boolean;
}

export function MessageList({ messages, animateMessages, showWatermark }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div 
      className="flex-1 overflow-y-auto p-2 space-y-1 relative"
      style={{
        backgroundImage: "url('/images/whatsapp-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {showWatermark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="text-watermark/10 text-4xl font-bold rotate-[-25deg] select-none">
            SIMULADO
          </div>
        </div>
      )}
      
      {messages.map((message, index) => {
        const separator = getDateSeparator(index, messages.length);
        return (
          <div key={message.id}>
            {separator && (
              <div className="flex justify-center my-2">
                <span className="bg-white/80 text-muted-foreground text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                  {separator}
                </span>
              </div>
            )}
            <MessageBubble message={message} animate={animateMessages} />
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
