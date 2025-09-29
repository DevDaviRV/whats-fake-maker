export type MessageStatus = "sent" | "delivered" | "read";
export type MessageSender = "own" | "contact";

export interface Message {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: string;
  status: MessageStatus;
  image?: string;
}

export interface Participant {
  name: string;
  avatar?: string;
  status?: string;
}

export interface Conversation {
  id: string;
  contact: Participant;
  user: Participant;
  messages: Message[];
  showWatermark: boolean;
}
