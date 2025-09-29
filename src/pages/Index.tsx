import { useState, useRef } from "react";
import { ChatHeader } from "@/components/ChatHeader";
import { MessageList } from "@/components/MessageList";
import { ChatInput } from "@/components/ChatInput";
import { EditorPanel } from "@/components/EditorPanel";
import { Conversation } from "@/types/chat";
import { useVideoExport } from "@/hooks/useVideoExport";
import { ExportFormat } from "@/components/ExportDialog";
import { toast } from "sonner";

const initialConversation: Conversation = {
  id: "1",
  contact: {
    name: "Contato",
    status: "online",
  },
  user: {
    name: "Você",
  },
  messages: [
    {
      id: "1",
      text: "Olá! Como posso ajudar?",
      sender: "contact",
      timestamp: "10:30",
      status: "read",
    },
    {
      id: "2",
      text: "Oi! Estou testando a ferramenta 😊",
      sender: "own",
      timestamp: "10:31",
      status: "read",
    },
  ],
  showWatermark: false,
};

const Index = () => {
  const [conversation, setConversation] = useState<Conversation>(initialConversation);
  const [isPlaying, setIsPlaying] = useState(false);
  const [displayedMessages, setDisplayedMessages] = useState(conversation.messages);
  const chatPreviewRef = useRef<HTMLDivElement>(null);
  const { exportVideo, isExporting } = useVideoExport();

  const handlePlay = () => {
    if (isPlaying) {
      toast.info("Já está reproduzindo...");
      return;
    }

    setIsPlaying(true);
    setDisplayedMessages([]);
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < conversation.messages.length) {
        setDisplayedMessages((prev) => [...prev, conversation.messages[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsPlaying(false);
        toast.success("Preview concluído!");
      }
    }, 1500); // 1.5s entre cada mensagem
  };

  const handleUpdateConversation = (updated: Conversation) => {
    setConversation(updated);
    if (!isPlaying) {
      setDisplayedMessages(updated.messages);
    }
  };

  const handleExportVideo = async (format: ExportFormat) => {
    if (!chatPreviewRef.current) {
      toast.error("Erro ao acessar preview");
      return;
    }

    toast.info("Iniciando exportação...");
    
    // Resetar para estado inicial
    setIsPlaying(true);
    setDisplayedMessages([]);

    await new Promise(resolve => setTimeout(resolve, 100));

    // Função de animação que será executada durante a gravação
    const runAnimation = async () => {
      // Aguardar 1 segundo inicial
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Animar mensagens
      for (let i = 0; i < conversation.messages.length; i++) {
        setDisplayedMessages(prev => [...prev, conversation.messages[i]]);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Pausa final
      await new Promise(resolve => setTimeout(resolve, 2000));
    };

    // Executar exportação
    await exportVideo(chatPreviewRef.current, runAnimation, format);

    // Resetar estado
    setIsPlaying(false);
    setDisplayedMessages(conversation.messages);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Chat Preview */}
      <div 
        ref={chatPreviewRef}
        className="flex-1 flex flex-col max-w-3xl mx-auto shadow-2xl"
      >
        <ChatHeader contact={conversation.contact} />
        <MessageList
          messages={isPlaying ? displayedMessages : conversation.messages}
          animateMessages={isPlaying}
          showWatermark={conversation.showWatermark}
        />
        <ChatInput />
      </div>

      {/* Editor Panel */}
      <EditorPanel
        conversation={conversation}
        onUpdateConversation={handleUpdateConversation}
        onPlay={handlePlay}
        isPlaying={isPlaying || isExporting}
        onExportVideo={handleExportVideo}
      />
    </div>
  );
};

export default Index;
