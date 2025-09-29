import { ArrowLeft, MoreVertical, Phone, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Participant } from "@/types/chat";

interface ChatHeaderProps {
  contact: Participant;
}

export function ChatHeader({ contact }: ChatHeaderProps) {
  return (
    <header className="bg-header text-header-foreground px-2 py-2 flex items-center gap-2 shadow-md shrink-0">
      <button className="hover:bg-white/10 p-1.5 rounded-full transition-colors">
        <ArrowLeft className="h-4 w-4" />
      </button>
      
      <Avatar className="h-8 w-8 border-2 border-white/20">
        <AvatarImage src={contact.avatar} />
        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
          {contact.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <h1 className="font-semibold text-white text-sm truncate">{contact.name}</h1>
        {contact.status && (
          <p className="text-[10px] text-white/80 truncate">{contact.status}</p>
        )}
      </div>
      
      <div className="flex items-center gap-1">
        <button className="hover:bg-white/10 p-1.5 rounded-full transition-colors">
          <Video className="h-4 w-4" />
        </button>
        <button className="hover:bg-white/10 p-1.5 rounded-full transition-colors">
          <Phone className="h-4 w-4" />
        </button>
        <button className="hover:bg-white/10 p-1.5 rounded-full transition-colors">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
