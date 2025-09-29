import { ArrowLeft, MoreVertical, Phone, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Participant } from "@/types/chat";

interface ChatHeaderProps {
  contact: Participant;
}

export function ChatHeader({ contact }: ChatHeaderProps) {
  return (
    <header className="bg-header text-header-foreground px-4 py-3 flex items-center gap-3 shadow-md">
      <button className="hover:bg-white/10 p-2 rounded-full transition-colors">
        <ArrowLeft className="h-5 w-5" />
      </button>
      
      <Avatar className="h-10 w-10 border-2 border-white/20">
        <AvatarImage src={contact.avatar} />
        <AvatarFallback className="bg-primary text-primary-foreground">
          {contact.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <h1 className="font-semibold text-white">{contact.name}</h1>
        {contact.status && (
          <p className="text-xs text-white/80">{contact.status}</p>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <button className="hover:bg-white/10 p-2 rounded-full transition-colors">
          <Video className="h-5 w-5" />
        </button>
        <button className="hover:bg-white/10 p-2 rounded-full transition-colors">
          <Phone className="h-5 w-5" />
        </button>
        <button className="hover:bg-white/10 p-2 rounded-full transition-colors">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
