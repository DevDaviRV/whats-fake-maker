import { Check, CheckCheck } from "lucide-react";
import { Message } from "@/types/chat";
import { formatMessageTime } from "@/utils/dateFormat";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
  animate?: boolean;
}

export function MessageBubble({ message, animate }: MessageBubbleProps) {
  const isOwn = message.sender === "own";
  
  const getStatusIcon = () => {
    if (message.sender === "contact") return null;
    
    switch (message.status) {
      case "sent":
        return <Check className="h-4 w-4" />;
      case "delivered":
        return <CheckCheck className="h-4 w-4 text-muted-foreground" />;
      case "read":
        return <CheckCheck className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div
      className={cn(
        "flex mb-2",
        isOwn ? "justify-end" : "justify-start",
        animate && "animate-slide-up"
      )}
    >
      <div
        className={cn(
          "max-w-[75%] rounded-lg px-3 py-2 shadow-sm",
          isOwn
            ? "bg-bubble-own rounded-br-none"
            : "bg-bubble-contact rounded-bl-none"
        )}
      >
        {message.image && (
          <img
            src={message.image}
            alt="Anexo"
            className="rounded-md mb-1 max-w-full h-auto"
          />
        )}
        <p className="text-foreground text-sm whitespace-pre-wrap break-words">
          {message.text}
        </p>
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-xs text-timestamp">
            {formatMessageTime(message.timestamp)}
          </span>
          {getStatusIcon()}
        </div>
      </div>
    </div>
  );
}
